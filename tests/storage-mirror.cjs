/* Phase 6.6 — IndexedDB mirror mode.
 *
 * Verifies, against an in-memory IndexedDB shim, that:
 *   - successful writes are mirrored and deletions remove the mirror copy;
 *   - an evicted (empty) localStorage is rebuilt from the mirror by hydrate();
 *   - hydrate() never resurrects records on an origin that still has records;
 *   - a full reset clears the mirror too;
 *   - with the threshold forced to 0 the synchronous API still works end to end;
 *   - without indexedDB everything keeps working and the status says so.
 *
 * Caveat recorded on purpose: this is a mirror/recovery path, not a primary-store
 * swap. Reads stay synchronous and localStorage-first.
 */
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');

const source = fs.readFileSync('assets/js/storage.js', 'utf8');

function fakeIndexedDb() {
  const data = new Map();
  const tick = fn => queueMicrotask(fn);
  function request(result) {
    const req = { result };
    return req;
  }
  function objectStore(transaction) {
    return {
      put(value, key) { data.set(key, value); return request(value); },
      get(key) { return request(data.get(key)); },
      getAllKeys() { return request([...data.keys()]); },
      delete(key) { data.delete(key); return request(undefined); },
      clear() { data.clear(); return request(undefined); }
    };
  }
  return {
    data,
    open() {
      const db = {
        objectStoreNames: { contains: () => data.storeCreated === true },
        createObjectStore() { data.storeCreated = true; },
        transaction() {
          const transaction = {
            objectStore: () => objectStore(transaction),
            error: null,
            oncomplete: null, onerror: null, onabort: null
          };
          tick(() => transaction.oncomplete && transaction.oncomplete());
          return transaction;
        },
        close() { db.closed = true; }
      };
      const openRequest = { result: db, error: null };
      tick(() => {
        openRequest.onupgradeneeded && openRequest.onupgradeneeded();
        openRequest.onsuccess && openRequest.onsuccess();
      });
      return openRequest;
    }
  };
}

function localStorageProxy(store) {
  return new Proxy({
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { store.set(key, String(value)); },
    removeItem: key => { store.delete(key); },
    key: index => [...store.keys()][index] ?? null
  }, {
    ownKeys: () => [...store.keys()],
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true })
  });
}

function load(options = {}) {
  const store = new Map(options.entries || []);
  const idb = options.idb === undefined ? fakeIndexedDb() : options.idb;
  const context = {
    localStorage: localStorageProxy(store),
    indexedDB: idb,
    __d3sTestThreshold: options.threshold,
    navigator: { storage: { persisted: options.persisted } },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    dispatchEvent: () => true,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init && init.detail; } },
    document: { documentElement: { style: { setProperty() {} }, dataset: {}, setAttribute() {} }, querySelector: () => null },
    Date, console, Promise, queueMicrotask, setTimeout, clearTimeout
  };
  vm.runInNewContext(source, context);
  return { S: context.StudyStorage, store, idb };
}

const settle = () => new Promise(resolve => setTimeout(resolve, 20));

(async () => {
  /* ── Mirror on write, delete on removal ─────────────────────────────── */
  {
    const { S, idb } = load();
    S.set('section-note:mirror', { text: 'kept', updatedAt: 1 });
    await settle();
    assert.equal(idb.data.get('d3s:section-note:mirror'), JSON.stringify({ text: 'kept', updatedAt: 1 }), 'write is mirrored');
    const status = await S.idbStatus();
    assert.equal(status.primary, 'localStorage', 'localStorage is still the primary store');
    assert.equal(status.available, true);
    assert.equal(status.mode, 'mirror:standard', 'default threshold reports standard mirror mode');
    assert.equal(status.persisted, null, 'missing persisted() is reported as unknown, not granted');
    S.remove('section-note:mirror');
    await settle();
    assert.equal(idb.data.has('d3s:section-note:mirror'), false, 'deletion removes the mirror copy');
  }

  /* ── Eviction recovery ─────────────────────────────────────────────── */
  {
    const { S, store, idb } = load();
    S.set('quiz-history', [{ historyId: 'a' }]);
    S.set('section-note:recover', { text: 'restore me', updatedAt: 3 });
    await suite_mirror(idb);
    store.clear();                        // simulate evicted site data
    assert.equal(S.keys().length, 0);
    const result = await S.hydrate();
    assert.equal(result.restored, 2, `hydrate rebuilds every mirrored record (${result.reason})`);
    assert.equal(S.get('section-note:recover').text, 'restore me');
    assert.equal(S.get('quiz-history')[0].historyId, 'a');
    assert.equal((await S.hydrate()).restored, 0, 'hydrate is a no-op once records exist');
  }

  /* ── A deliberate reset must not be resurrected ─────────────────────── */
  {
    const { S, store, idb } = load();
    S.set('section-note:gone', { text: 'x', updatedAt: 1 });
    await settle();
    S.clearGroup('everything');
    await settle();
    assert.equal(idb.data.size, 0, 'everything clears the mirror as well');
    assert.equal(S.keys().length, 0);
    store.clear();
    assert.equal((await S.hydrate()).restored, 0, 'nothing comes back after an explicit reset');
  }

  /* ── Threshold forced to 0: the API keeps working ───────────────────── */
  {
    const { S, store, idb } = load({ threshold: 0 });
    S.set('practice-presets', { size: 10 });
    await settle();
    const status = await S.idbStatus();
    assert.equal(status.largeMode, true, 'threshold 0 puts the module in large mode');
    assert.equal(status.mode, 'mirror:large');
    assert.equal(status.primary, 'localStorage', 'large mode is still reported honestly');
    assert.equal(S.get('practice-presets').size, 10, 'reads work in large mode');
    store.clear();
    assert.equal((await S.hydrate()).restored, 1, 'large mode still recovers from the mirror');
    assert.equal(S.get('practice-presets').size, 10);
    const backup = JSON.parse(JSON.stringify(S.backup()));
    assert.deepEqual(Object.keys(backup.stores), ['d3s:practice-presets']);
  }

  /* ── No indexedDB: graceful fallback, honest status ─────────────────── */
  {
    const { S } = load({ idb: null });
    S.set('section-note:fallback', { text: 'works', updatedAt: 9 });
    assert.equal(S.get('section-note:fallback').text, 'works');
    const status = await S.idbStatus();
    assert.equal(status.available, false);
    assert.equal(status.mode, 'mirror:standard');
    const result = await S.hydrate();
    assert.equal(result.restored, 0);
    assert.match(result.reason, /unavailable/);
    assert.equal(await S.clearMirror(), false);
  }

  /* ── Persistence promise is reported as given ───────────────────────── */
  {
    const granted = load({ persisted: async () => true });
    assert.equal((await granted.S.idbStatus()).persisted, true);
    const denied = load({ persisted: async () => false });
    assert.equal((await denied.S.idbStatus()).persisted, false);
  }

  console.log('PASS indexeddb mirror, eviction recovery, reset isolation, threshold override, fallback, persisted reporting');
})().catch(error => { console.error(error); process.exit(1); });

async function suite_mirror(idb) {
  for (let i = 0; i < 5 && idb.data.size < 2; i += 1) await settle();
  assert.equal(idb.data.size, 2, 'both records reached the mirror');
}
