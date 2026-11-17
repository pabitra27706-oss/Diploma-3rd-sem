/* Deterministic, browser-free regression for the Phase 9.3 update policy.

   Proves three things the phase promises:

   1. DATA-ONLY UPDATE reaches a returning device. The shell version and the
      shell cache are untouched, no "new version" banner can appear (no waiting
      worker), and the next read of a data file goes to the network and replaces
      the cached copy under the new data version.
   2. SHELL-ONLY UPDATE does not throw the data away. A new shell installs into a
      new cache and activate deletes the old shell cache, but the data cache
      (named by the unchanged data version) survives, so a returning student
      does not re-download 1.4 MB of pools.
   3. OFFLINE still works after either bump, including a data file requested
      without `?v=` while the data version cannot be read.

   The stub is the same one tests/study-offline.cjs uses: real files from disk,
   a Map-backed Cache API, no network, no Chromium.
*/
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT, assert, createRepoFetch } = require('./lib/minidom.cjs');

const BASE = 'https://example.test/Diploma-3rd-sem/';
const SHELL_VERSION = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8')
  .match(/const VERSION = '([^']+)'/)[1];
const DATA_VERSION = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/data-version.json'), 'utf8')).dataVersion;
const DATA_CACHE = 'diploma-3rd-sem-data-' + DATA_VERSION;
const SHELL_CACHE = 'diploma-3rd-sem-' + SHELL_VERSION;

function makeWorker({ shellSource = null, dataVersion = DATA_VERSION, shelf = {} } = {}) {
  const store = new Map();
  let online = true;
  const repoFetch = createRepoFetch('/Diploma-3rd-sem/');
  const listeners = {};
  const fetchImpl = async input => {
    if (!online) throw new Error('offline');
    const href = typeof input === 'string' ? input : input.url;
    if (href.endsWith('/assets/data/data-version.json')) {
      return {
        ok: true, status: 200,
        async json() { return { dataVersion: dataVersion }; },
        clone() { return this; }
      };
    }
    if (Object.prototype.hasOwnProperty.call(shelf, href)) {
      const body = shelf[href];
      return { ok: true, status: 200, url: href, async text() { return body; },
               async json() { return JSON.parse(body); }, clone() { return this; } };
    }
    return repoFetch(href);
  };
  const mockCaches = {
    async open(name) {
      if (!store.has(name)) store.set(name, new Map());
      const bucket = store.get(name);
      return {
        async addAll(urls) {
          for (const url of urls) {
            const response = await repoFetch(url);
            assert(response.ok, `Precache asset missing on disk: ${url}`);
            bucket.set(url, response);
          }
        },
        async put(key, response) { bucket.set(key, response); },
        async keys() { return [...bucket.keys()].map(url => ({ url })); },
        async match(key) { return bucket.get(typeof key === 'string' ? key : key.url); }
      };
    },
    async keys() { return [...store.keys()]; },
    async delete(name) { return store.delete(name); },
    async match(key) {
      for (const bucket of store.values()) if (bucket.has(key)) return bucket.get(key);
      return undefined;
    }
  };
  const source = shellSource || fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const global = {
    URL, URLSearchParams,
    Response: class Response {
      constructor(body, init) { this.body = body; this.status = init?.status || 200; this.ok = this.status < 400; }
      async text() { return String(this.body); }
    },
    caches: mockCaches,
    fetch: fetchImpl,
    self: {
      location: { href: BASE + 'sw.js' },
      clients: { claim: async () => {} },
      skipWaiting: () => {},
      addEventListener(type, fn) { listeners[type] = fn; }
    }
  };
  vm.runInNewContext(source, global, { filename: 'sw.js' });
  async function lifecycle() {
    let install;
    listeners.install({ waitUntil: promise => { install = promise; } });
    await install;
    let activate;
    listeners.activate({ waitUntil: promise => { activate = promise; } });
    await activate;
  }
  async function message(type) {
    let promise;
    listeners.message({ data: { type }, waitUntil: p => { promise = p; } });
    await promise;
  }
  async function request(url, mode = 'cors') {
    let response;
    listeners.fetch({
      request: { url, method: 'GET', mode },
      waitUntil: () => {},
      respondWith: promise => { response = promise; }
    });
    return response;
  }
  return { store, lifecycle, message, request, setOnline: value => { online = value; }, listeners };
}

(async () => {
  // ── 1. data-only update ──────────────────────────────────────────────────
  const worker = makeWorker();
  await worker.lifecycle();
  await worker.message('WARM_STUDY');
  assert(worker.store.has(SHELL_CACHE), 'install must create the shell cache');
  assert(worker.store.has(DATA_CACHE), 'WARM_STUDY must create the data cache named by the data version');
  const shellBytes = new Map(worker.store.get(SHELL_CACHE));
  const shard = 'assets/cards/CST201.json';
  const firstRead = await worker.request(BASE + shard);
  assert.equal(firstRead.status, 200, 'the first data read must succeed');
  assert(worker.store.get(DATA_CACHE).has(`${BASE}${shard}?v=${DATA_VERSION}`),
    'a data read must be cached under the data version key');

  // A corrected data file ships. Only assets/data/data-version.json changes;
  // sw.js (the shell) is byte-identical, so no update or banner is involved.
  const updated = makeWorker({
    dataVersion: 'data-ffffffffffff',
    shelf: { [BASE + shard]: '{"id":"corrected"}' }
  });
  updated.store.clear();
  for (const [name, bucket] of worker.store) updated.store.set(name, new Map(bucket));
  await updated.message('WARM_STUDY');
  const afterBump = await updated.request(BASE + shard);
  assert.equal(afterBump.status, 200, 'a returning device must still read data after a data-only bump');
  assert.equal(await afterBump.text(), '{"id":"corrected"}',
    'a data-only update must reach the returning device without a shell update');
  assert(updated.store.has(DATA_CACHE), 'the previous data cache is kept until the new one is written');
  assert(updated.store.get('diploma-3rd-sem-data-data-ffffffffffff').has(`${BASE}${shard}?v=data-ffffffffffff`),
    'the refreshed file must be cached under the new data version');
  assert.deepEqual([...updated.store.get(SHELL_CACHE).keys()], [...shellBytes.keys()],
    'a data-only update must not touch the cached shell');

  // Offline after the data bump, requested without ?v= and with no reachable
  // data-version.json: any cached copy for that pathname is still the answer.
  const offline = makeWorker({ dataVersion: DATA_VERSION });
  offline.store.clear();
  for (const [name, bucket] of updated.store) offline.store.set(name, new Map(bucket));
  await offline.lifecycle();
  offline.setOnline(false);
  const offlineRead = await offline.request(BASE + shard);
  assert.equal(offlineRead.status, 200, 'a cached data file must serve offline after a version bump');

  // ── 2. shell-only update keeps the data ──────────────────────────────────
  const shellBump = makeWorker({
    shellSource: fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8')
      .replace(/const VERSION = '([^']+)'/, "const VERSION = '$1-next'")
  });
  shellBump.store.clear();
  for (const [name, bucket] of worker.store) shellBump.store.set(name, new Map(bucket));
  await shellBump.lifecycle();
  const newShellCache = 'diploma-3rd-sem-' + SHELL_VERSION + '-next';
  assert(shellBump.store.has(newShellCache), 'a shell bump must install a new shell cache');
  assert(!shellBump.store.has(SHELL_CACHE), 'activate must delete the superseded shell cache');
  assert(shellBump.store.has(DATA_CACHE), 'a shell-only update must keep the data cache');
  shellBump.setOnline(false);
  const afterShellBump = await shellBump.request(BASE + shard);
  assert.equal(afterShellBump.status, 200,
    'data must still read offline after a shell-only update (no re-download needed)');

  // ── 3. the two versions really are separate ──────────────────────────────
  const swSource = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  assert(/DATA_CACHE_PREFIX/.test(swSource), 'the worker must keep data in its own cache namespace');
  assert(/data-version\.json/.test(swSource), 'the worker must read the generated data version');
  assert(!/searchParams\.set\('v', VERSION\)/.test(swSource),
    'data cache keys must not be tied to the shell version');

  console.log('PASS data-only update reaches a returning device, shell update keeps data, offline survives both');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
