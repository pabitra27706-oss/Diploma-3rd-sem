# Current cache policy

Scope-relative URLs; no browser-facing localhost endpoints. Two cache namespaces
and two independent versions (Phase 9.3, 2026-11-17):

| Class | Cache | Version | Behaviour |
|---|---|---|---|
| shell (HTML, CSS, JS, icons, manifest) | `diploma-3rd-sem-<shell>` | `study-2026-11-18e` (manual roadmap, greeting and app icon update) | precached on install; a new shell waits and `pwa.js` asks before reloading |
| data (pools, papers, search shards, card shards, catalog) | `diploma-3rd-sem-data-<dataVersion>` | generated `assets/data/data-version.json` (`data-85d29b750f55` for the current search index) | stale-while-revalidate, keyed by the data version; refreshed silently |

## What each class does

- **Shell.** `PRECACHE_ASSETS` covers the shared head assets (`assets/css/variables.css`,
  `assets/css/main.css`, `assets/css/base.css`, `assets/css/discovery.css`), the
  generated `assets/js/shell.bundle.js` (accessibility + i18n + pwa), the storage
  boundary, the home logo and roadmap checklist shell, the discovery/study shells and the study scripts plus
  `assets/cards/manifest.json`. Installs into a fresh cache name; `activate`
  deletes superseded shell caches. A shell change therefore never forces a reload:
  the student is asked once.
- **Pages.** Network-first. On failure the worker returns the cached response, the
  pre-cached pathname shell (so `search.html?q=…` and `repeated.html?subject=…`
  work offline) or `offline.html`. The Suggestions hub at `suggestions/index.html`
  is precached. Individual guides are cached on successful visits controlled
  by the worker. Archive pages, notes and paper data follow their own cache
  rules; opening a Suggestions guide does not download its sources.
- **Data.** Any same-origin GET under `_data/`, `_quiz-data/`, `assets/data/`,
  `assets/search/`, `assets/cards/` is served from the data cache when present and
  refreshed in the background (stale-while-revalidate). The cache key carries
  `?v=<dataVersion>`; a data-only change therefore misses, fetches and stores new
  bytes **without touching the shell**. Search shards keep their own manifest
  `?v=<sha256>` keys, which are stricter than the data version and stay valid.
- **Offline.** If `data-version.json` cannot be read (or the version changed while
  offline) the worker still answers from any cached copy of the same pathname, so
  a version bump can never turn a saved page into a 503.
- **Warmers.** `WARM_SEARCH` (from `search.html`) and `WARM_STUDY` (from
  `cards.html`/`today.html`) cache the remaining shards in the background. A cold
  first visit, or an install that never opens a study page, is still not covered.
- **Student storage** lives under the `d3s:` prefix in `localStorage` (plus the
  IndexedDB recovery mirror) and is never touched by cache cleanup.

## Update flow (proved without a browser)

`tests/data-version.cjs` asserts all three cases against the real `sw.js`:

1. data-only bump → returning device reads the corrected file from the network,
   stores it under the new key, the shell cache is byte-identical and no update
   banner can appear (the worker script itself did not change);
2. shell-only bump → new shell cache installed, old shell cache deleted, data
   cache kept (no re-download of ~1.4 MB of pools);
3. offline after either bump → the previously cached copy is still served.

## Regenerating

Order matters; the data version must be last because it hashes the data it ships.
See the root README's "Regenerating checked-in outputs" block. `tests/test_data_version.py`
fails when `assets/data/data-version.json` is stale, and a stale shell version
fails `check_platform.py`'s idempotence check.

Real-device installation, cache eviction and update acceptance belong to Phase 10.
These are focused engineering checks, not proof of every offline journey.
