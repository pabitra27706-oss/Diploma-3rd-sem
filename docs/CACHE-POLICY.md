# Current cache policy

- Scope-relative URLs; no browser-facing localhost endpoints.
- Shell dependencies are pre-cached in the versioned service-worker cache
  (`VERSION = 'study-2026-11-17c'`), including core discovery shells and compact
  metadata (`search.html`, `repeated.html`, `coverage.html`, `exam-pattern.html`,
  `assets/css/discovery.css`, `assets/js/subject-labels.js`,
  `assets/js/discovery.js`, `assets/js/unit-discovery.js`,
  `assets/search/manifest.json`, `assets/search/index-pages.json`, and
  `assets/search/repeated.json`) plus the Phase 7 UI language layer
  (`assets/js/i18n.js`, `assets/i18n/en.json`, `assets/i18n/bn.json`) plus the Phase 5 study shell (`cards.html`,
  `today.html`, `assets/js/study-store.js`, `assets/js/study-ui.js`,
  `quiz/js/attempt-store.js`, and `assets/cards/manifest.json`).
- Pages: network-first; on failure, returns the cached response, the pre-cached
  pathname shell (so deep links such as `search.html?q=...` and
  `repeated.html?subject=...` work offline), or `offline.html`.
- Other successful same-origin GET resources: cached response when present,
  refreshed in background. Uncached resources need a successful first load.
- Search shards (`assets/search/index-CST20x.json`, `index-pages.json`,
  `repeated.json`) keep their explicit manifest `?v=<sha256>` cache key instead
  of being overwritten by the worker version. Visiting `search.html` sends a
  one-shot `WARM_SEARCH` message so the service worker caches all remaining
  subject shards in the background for offline cross-subject queries.
- Card shards (`assets/cards/CST20x.json`) are cached per subject at
  `?v=<VERSION>`. Loading `cards.html` or `today.html` sends a one-shot
  `WARM_STUDY` message, so the worker caches the five subject shards plus the
  card manifest in the background; a device can then review cards offline after
  that first study-page load. A cold first visit and an installed-but-never-opened
  study page are not covered.
- Generated pools/cards without explicit content hashes add `?v=<VERSION>` and
  are refreshed in the background at their stable URLs; a cached response may be
  from the previous version until the next request. This limitation is visible
  here; no instantaneous data freshness guarantee is made.
- Worker activation remains user-triggered via the existing update banner;
  student storage uses a different namespace (`d3s:`) and is not cleared by
  cache cleanup.
- Data changes to manifest-hashed search shards invalidate automatically via
  their SHA-256 query parameter; shell dependency changes require a worker
  version bump. Current shared cache is not an independently versioned
  shell/data adapter; that refinement remains pending for Phase 9.

Real-device installation, cache-eviction and update acceptance belongs to the
owner-requested final device phase (Phase 10). Offline service-worker and
warmed-cache tests are focused engineering checks, not proof of all offline
journeys.
