/* Deterministic zero-dependency service-worker regression for the Phase 5 study
   shell (no browser, no network):
   - install precaches cards.html, today.html, the study scripts, the attempt
     store and the card manifest
   - WARM_STUDY stores every subject card shard under the versioned cache key
     the fetch handler looks up, so a warmed device reviews cards offline
   - with the network cut, cards.html?subject=… and today.html still navigate,
     and the card shards/manifest still resolve (with and without ?v=…)
   This proves cache wiring and lookup keys, not real-device storage eviction.
*/
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT, assert, createRepoFetch } = require('./lib/minidom.cjs');

const BASE = 'https://example.test/Diploma-3rd-sem/';

(async () => {
  const store = new Map();
  let online = true;
  const repoFetch = createRepoFetch('/Diploma-3rd-sem/');
  const listeners = {};

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
        async match(key) { return bucket.get(key); }
      };
    },
    async keys() { return [...store.keys()]; },
    async delete(name) { return store.delete(name); },
    async match(key) {
      for (const bucket of store.values()) if (bucket.has(key)) return bucket.get(key);
      return undefined;
    }
  };

  const swGlobal = {
    URL,
    URLSearchParams,
    Response: class Response {
      constructor(body, init) { this.body = body; this.status = init?.status || 200; this.ok = this.status < 400; }
    },
    caches: mockCaches,
    fetch: async request => {
      if (!online) throw new Error('offline');
      return repoFetch(typeof request === 'string' ? request : request.url);
    },
    self: {
      location: { href: BASE + 'sw.js' },
      clients: { claim: async () => {} },
      skipWaiting: () => {},
      addEventListener(type, fn) { listeners[type] = fn; }
    }
  };
  const source = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  vm.runInNewContext(source, swGlobal, { filename: 'sw.js' });

  assert(/cards\.html/.test(source) && /today\.html/.test(source), 'sw.js must precache the study pages');
  assert(/WARM_STUDY/.test(source), 'sw.js must expose the WARM_STUDY warmer');
  assert(/assets\/cards/.test(source), 'sw.js must treat the card shards as cacheable data');

  let installPromise;
  listeners.install({ waitUntil: promise => { installPromise = promise; } });
  await installPromise;

  const cacheName = [...store.keys()].find(name => /^diploma-3rd-sem-[a-z0-9]/.test(name) && !name.startsWith('diploma-3rd-sem-data-'));
  const bucket = store.get(cacheName);
  const findCached = key => {
    for (const candidate of store.values()) if (candidate.has(key)) return candidate.get(key);
    return undefined;
  };
  for (const asset of ['cards.html', 'today.html', 'assets/js/study-store.js', 'assets/js/study-ui.js',
    'quiz/js/attempt-store.js', 'assets/cards/manifest.json', 'search.html', 'index.html']) {
    assert(bucket.has(BASE + asset), `install must precache ${asset}`);
  }

  let warmPromise;
  listeners.message({ data: { type: 'WARM_STUDY' }, waitUntil: promise => { warmPromise = promise; } });
  await warmPromise;

  // Phase 9.3: data has its own version, generated from the data bytes.
  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/data-version.json'), 'utf8')).dataVersion;
  assert(version.startsWith('data-'), 'data version must be generated, not the shell version');
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/cards/manifest.json'), 'utf8'));
  assert.equal(Object.keys(manifest.subjects).length, 5, 'expected five subject card shards');
  for (const [code, meta] of Object.entries(manifest.subjects)) {
    const warmed = findCached(`${BASE}assets/cards/${meta.file}?v=${version}`);
    assert(warmed, `WARM_STUDY must cache the ${code} shard under ?v=${version}`);
    assert(warmed.ok);
  }
  assert(findCached(`${BASE}assets/cards/manifest.json`), 'the card manifest must be cached for offline origin checks');

  async function swFetch(url, mode = 'cors') {
    let responsePromise;
    listeners.fetch({
      request: { url, method: 'GET', mode },
      waitUntil: () => {},
      respondWith: promise => { responsePromise = promise; }
    });
    return responsePromise;
  }

  online = false;
  const cardsPage = await swFetch(BASE + 'cards.html?subject=CST201', 'navigate');
  assert.equal(cardsPage.status, 200, 'cards.html?subject=CST201 must navigate offline (pathname fallback)');
  const todayPage = await swFetch(BASE + 'today.html', 'navigate');
  assert.equal(todayPage.status, 200, 'today.html must navigate offline');

  for (const meta of Object.values(manifest.subjects)) {
    const withVersion = await swFetch(`${BASE}assets/cards/${meta.file}?v=${version}`);
    assert.equal(withVersion.status, 200, `${meta.file} must serve offline with the versioned key`);
    const withoutVersion = await swFetch(`${BASE}assets/cards/${meta.file}`);
    assert.equal(withoutVersion.status, 200, `${meta.file} must serve offline when requested without ?v=`);
  }
  const offlineManifest = await swFetch(`${BASE}assets/cards/manifest.json?v=${version}`);
  assert.equal(offlineManifest.status, 200, 'the card manifest must serve offline');

  const scripts = await swFetch(`${BASE}assets/js/study-ui.js`);
  assert.equal(scripts.status, 200, 'the study UI script must serve offline');
  console.log('PASS study shell precache, WARM_STUDY card shards, and offline cards/today navigation');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
