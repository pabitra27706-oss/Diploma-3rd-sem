/* Scope-relative, first-party-only shell. Updates activate only on user request. */
const VERSION = 'platform-2026-11-09';
const CACHE_PREFIX = 'diploma-3rd-sem-';
const CACHE_NAME = CACHE_PREFIX + VERSION;
const BASE = new URL('./', self.location.href);
const OFFLINE_PAGE = new URL('offline.html', BASE).href;
const PRECACHE_ASSETS = [
  './', 'index.html', 'offline.html', 'assets/css/variables.css',
  'assets/css/main.css', 'assets/css/pwa.css', 'assets/js/theme.js',
  'assets/js/app.js', 'assets/js/pwa.js', 'assets/icons/sprite.svg', 'manifest.json'
].map(path => new URL(path, BASE).href);
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
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  const isData = /\/(?:_data|_quiz-data)\//.test(url.pathname);
  const key = new URL(url);
  if (isData) key.searchParams.set('v', VERSION);
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
    const cached = await cache.match(key.href);
    if (event.request.mode !== 'navigate' && cached) {
      event.waitUntil(refresh().catch(() => {}));
      return cached;
    }
    try { return await refresh(); }
    catch {
      return cached || (event.request.mode === 'navigate' && await cache.match(OFFLINE_PAGE)) ||
        new Response('Offline: this resource has not been saved on this device.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
