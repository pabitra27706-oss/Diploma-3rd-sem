/* Scope-relative, first-party-only shell. Updates activate only on user request.

   Two versions, deliberately independent (Phase 9.3):
     VERSION      the shell: HTML/CSS/JS bytes. It names the shell cache; a new
                  shell installs as "waiting" and pwa.js asks before reloading.
     dataVersion  the data payload: pools, papers, search/card shards. It is read
                  from the generated assets/data/data-version.json at runtime and
                  names the data cache, so a corrected explanation reaches a
                  returning device without a shell update, a prompt or a reset.
*/
const VERSION = 'study-2026-11-18b';
const CACHE_PREFIX = 'diploma-3rd-sem-';
const CACHE_NAME = CACHE_PREFIX + VERSION;
const DATA_CACHE_PREFIX = CACHE_PREFIX + 'data-';
const BASE = new URL('./', self.location.href);
const OFFLINE_PAGE = new URL('offline.html', BASE).href;
const DATA_VERSION_URL = new URL('assets/data/data-version.json', BASE);
const PRECACHE_ASSETS = [
  './', 'index.html', 'offline.html', 'search.html', 'repeated.html',
  'coverage.html', 'exam-pattern.html', 'suggestions/index.html',
  'assets/css/variables.css', 'assets/css/main.css', 'assets/css/base.css',
  'assets/css/discovery.css', 'assets/css/hub.css',
  'assets/js/theme.js', 'assets/js/storage.js', 'assets/js/shell.bundle.js',
  'assets/i18n/bn.json',
  'assets/js/subject-labels.js', 'assets/js/discovery.js',
  'assets/js/unit-discovery.js', 'assets/js/app.js',
  'assets/js/data-catalog.js', 'assets/icons/sprite.svg',
  'assets/search/manifest.json', 'assets/search/index-pages.json',
  'assets/search/repeated.json', 'manifest.json',
  'cards.html', 'today.html', 'assets/js/study-store.js', 'assets/js/study-ui.js',
  'quiz/js/attempt-store.js', 'assets/cards/manifest.json'
].map(path => new URL(path, BASE).href);

/* One read per worker lifetime. Falls back to the shell version, which can only
   cost a cache miss (the network is still tried) — never a broken screen. */
let dataVersionPromise = null;
function dataVersion() {
  if (!dataVersionPromise) {
    dataVersionPromise = (async () => {
      try {
        const response = await fetch(DATA_VERSION_URL.href, { cache: 'no-store' });
        if (response.ok) {
          const body = await response.json();
          if (body && typeof body.dataVersion === 'string' && body.dataVersion) return body.dataVersion;
        }
      } catch {}
      return VERSION;
    })();
  }
  return dataVersionPromise;
}

function dataCacheName(version) {
  return DATA_CACHE_PREFIX + version;
}

/* Offline must never depend on knowing the current data version: fall back to
   any cached entry for the same pathname. */
async function matchAnyVersion(cache, url) {
  const direct = await cache.match(url.href);
  if (direct) return direct;
  const keys = await cache.keys();
  const hit = keys.find(key => {
    try {
      const keyUrl = new URL(key.url || key);
      return keyUrl.origin === url.origin && keyUrl.pathname === url.pathname;
    } catch { return false; }
  });
  return hit ? cache.match(hit.url || hit) : undefined;
}

async function warmSearchIndex() {
  const version = await dataVersion();
  const cache = await caches.open(dataCacheName(version));
  const manifestUrl = new URL('assets/search/manifest.json', BASE);
  let manifestRes = await cache.match(manifestUrl.href);
  try {
    const fresh = await fetch(manifestUrl.href);
    if (fresh.ok) {
      await cache.put(manifestUrl.href, fresh.clone());
      manifestRes = fresh;
    }
  } catch {}
  if (!manifestRes) return;
  const manifest = await manifestRes.clone().json();
  const entries = [
    ...Object.values(manifest.subjects || {}),
    manifest.pages,
    manifest.repeated
  ].filter(item => item && item.file && item.sha256);
  await Promise.all(entries.map(async item => {
    const shardUrl = new URL('assets/search/' + item.file + '?v=' + item.sha256, BASE).href;
    if (await cache.match(shardUrl)) return;
    try {
      const res = await fetch(shardUrl);
      if (res.ok) await cache.put(shardUrl, res);
    } catch {}
  }));
}

async function warmStudyCards() {
  const version = await dataVersion();
  const cache = await caches.open(dataCacheName(version));
  const manifestUrl = new URL('assets/cards/manifest.json', BASE);
  let manifestRes = await cache.match(manifestUrl.href);
  try {
    const fresh = await fetch(manifestUrl.href);
    if (fresh.ok) {
      await cache.put(manifestUrl.href, fresh.clone());
      manifestRes = fresh;
    }
  } catch {}
  if (!manifestRes) return;
  let manifest;
  try { manifest = await manifestRes.clone().json(); } catch { return; }
  await Promise.all(Object.values(manifest.subjects || {}).map(async meta => {
    if (!meta || !meta.file) return;
    const url = new URL('assets/cards/' + meta.file, BASE);
    const key = new URL(url);
    key.searchParams.set('v', version);
    if (await matchAnyVersion(cache, url)) return;
    try {
      const res = await fetch(url.href);
      if (res.ok) await cache.put(key.href, res);
    } catch {}
  }));
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const version = await dataVersion();
    const keepData = dataCacheName(version);
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME && key !== keepData)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'WARM_SEARCH') event.waitUntil(warmSearchIndex());
  if (event.data?.type === 'WARM_STUDY') event.waitUntil(warmStudyCards());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  const isDataVersionFile = url.pathname === DATA_VERSION_URL.pathname;
  const isData = !isDataVersionFile && /\/(?:_data|_quiz-data|assets\/search|assets\/cards|assets\/data)\//.test(url.pathname);
  event.respondWith((async () => {
    const dataVersionValue = isData ? await dataVersion() : VERSION;
    const key = new URL(url);
    if (isData && !key.searchParams.has('v')) key.searchParams.set('v', dataVersionValue);
    const cacheName = isData ? dataCacheName(dataVersionValue) : CACHE_NAME;
    const cache = await caches.open(cacheName);
    let cached = isData
      ? await matchAnyVersion(cache, url)
      : await cache.match(key.href);
    if (isData && !cached) {
      // The version can be unknown offline (data-version.json unreachable). Any
      // cached copy of the same pathname is still the right offline answer.
      for (const name of await caches.keys()) {
        if (name === cacheName || !name.startsWith(DATA_CACHE_PREFIX)) continue;
        cached = await matchAnyVersion(await caches.open(name), url);
        if (cached) break;
      }
    }
    const refresh = async () => {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(key.href, response.clone());
      return response;
    };
    if (event.request.mode !== 'navigate' && cached) {
      event.waitUntil(refresh().catch(() => {}));
      return cached;
    }
    try { return await refresh(); }
    catch {
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const pageShell = await cache.match(url.origin + url.pathname);
        if (pageShell) return pageShell;
        const offline = await caches.match(OFFLINE_PAGE);
        if (offline) return offline;
      }
      return new Response('Offline: this resource has not been saved on this device.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
