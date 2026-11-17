/* Scope-relative, first-party-only shell. Updates activate only on user request. */
const VERSION = 'study-safety-2026-11-09';
const CACHE_PREFIX = 'diploma-3rd-sem-';
const CACHE_NAME = CACHE_PREFIX + VERSION;
const BASE = new URL('./', self.location.href);
const OFFLINE_PAGE = new URL('offline.html', BASE).href;
const PRECACHE_ASSETS = [
  './', 'index.html', 'offline.html', 'search.html', 'repeated.html',
  'coverage.html', 'exam-pattern.html',
  'assets/css/variables.css', 'assets/css/main.css', 'assets/css/pwa.css',
  'assets/css/discovery.css', 'assets/css/accessibility.css',
  'assets/js/theme.js', 'assets/js/storage.js', 'assets/js/accessibility.js',
  'assets/js/subject-labels.js', 'assets/js/discovery.js',
  'assets/js/unit-discovery.js', 'assets/js/app.js',
  'assets/js/pwa.js', 'assets/js/data-catalog.js', 'assets/icons/sprite.svg',
  'assets/search/manifest.json', 'assets/search/index-pages.json',
  'assets/search/repeated.json', 'manifest.json'
].map(path => new URL(path, BASE).href);

async function warmSearchIndex() {
  const cache = await caches.open(CACHE_NAME);
  const manifestUrl = new URL('assets/search/manifest.json', BASE);
  const manifestKey = new URL(manifestUrl);
  manifestKey.searchParams.set('v', VERSION);
  let manifestRes = await cache.match(manifestKey.href) || await cache.match(manifestUrl.href);
  try {
    const fresh = await fetch(manifestUrl.href);
    if (fresh.ok) {
      await cache.put(manifestKey.href, fresh.clone());
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

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'WARM_SEARCH') event.waitUntil(warmSearchIndex());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  const isData = /\/(?:_data|_quiz-data|assets\/search|assets\/cards|assets\/data)\//.test(url.pathname);
  const key = new URL(url);
  if (isData && !key.searchParams.has('v')) key.searchParams.set('v', VERSION);
  const refresh = async () => {
    const response = await fetch(event.request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(key.href, response.clone());
    }
    return response;
  };
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(key.href) || (isData ? await cache.match(url.href) : undefined);
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
        const offline = await cache.match(OFFLINE_PAGE);
        if (offline) return offline;
      }
      return new Response('Offline: this resource has not been saved on this device.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
