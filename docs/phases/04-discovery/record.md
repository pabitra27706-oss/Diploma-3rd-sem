# Phase 4 — Discovery and sharing (engineering record)

- Status: 🚧 in progress (all engineering parts 4.1–4.5 implemented and gate-verified; awaiting owner local/Termux verification) · Updated: 2026-11-17
- Active branch: `arena/80b11bcf-diploma-3rd-sem` (branched from `main` @ `9d47c7c76b2384c72944a0880df058a2518394ec`, PR #11 merge)
- Reuse: ADAPT Phase 2 `data_pipeline.py` (`stores`, `duplicates`, `generic_topic`), existing `subject-labels.js`, `sw.js`, `pyq/js/{index,answers}.js`, `practice/js/session.js`, `quiz/js/{review,result}.js`, and `build_coverage.py`; BUILD extended `index-pages.json` shard, unverified-candidate repeat export, shared `StudyShare` helper, and zero-dependency `tests/discovery-dom.cjs`. Zero npm runtime dependencies, zero network calls, zero edits to frozen `_data/<subject>/*.json`.

## Pre-edit audit gaps (one sentence per part)

- **4.1 (Search index):** `scripts/build_search_index.py` indexed only PYQ/quiz stems+topics and unanchored unit headings (including duplicate `#mobileDrawer` `<h3>` and dropping all 347 enclosing `<section id>` anchors), leaving all 26 informational/hub/lab/course/study HTML pages unindexed, omitting an explicit manifest scope record, and leaving discovery pages/shards out of full offline SW caching.
- **4.2 (Search UI):** `search.html` and `assets/js/discovery.js` never loaded an informational-page shard, lacked `type`/`topic` filter handoffs and search links on secondary hub headers (`pyq`, `practice`, `quiz`), omitted a live manifest-backed scope disclosure, and risked exposing raw `CST20x` codes on shared discovery views.
- **4.3 (Repeated-question explorer):** `assets/search/repeated.json` and `repeated.html` emitted and rendered only the 1 exact-content alias pair (while printing raw `CST20x` codes and question IDs) and omitted the 15 normalized-text candidate clusters (32 records) with their required "unverified candidate, not a confirmed duplicate" label and per-subject counts.
- **4.4 (Canonical question deep links + share):** `pyq/js/answers.js` leaked raw course codes/question IDs in `document.title`/print headers, lost Copy/Share buttons on single-question re-renders, and lacked clipboard fallback on `navigator.share` failure; `practice/js/session.js` lacked per-question Copy/Share controls and deep-link focus/highlight/missing notices while printing raw `CST20x` filter chips and alias IDs; and `quiz/js/review.js` (plus `quiz/js/result.js`) lacked `navigator.share` with fallback and printed raw `q.id` in card footers.
- **4.5 (Unit-to-PYQ cross-links & anchors):** All 24 unit pages and 5 theory subject hubs omitted `subject-labels.js` (printing raw `CST20x`), lacked `Subject → Unit → Section` breadcrumbs, lacked authored IDs on all 168 content `<h3>` while `unit-discovery.js` skipped authored `<section id>` anchors, and `pyq/index.html` ignored `?subject=`/`?unit=`/`?topic=` URL filters on filtered-PYQ handoffs.

## Implemented (parts 4.1–4.5)

### 4.1 — Search index generator, scope inventory, and offline cache
- Rewrote `scripts/build_search_index.py` (deterministic, sorted keys, pinned SHA-256 hashes per shard) producing **2,410 entries**: 924 PYQs + 872 quiz items + 539 unit-note headings across `index-CST201..CST209.json`, plus **75 page/section rows** in `index-pages.json`.
- **Per-shard size budget (≤ 40% of source bytes):**
  - `CST201` (C): 138,115 / 436,070 B (**31.7%**, 518 entries)
  - `CST203` (Python): 117,844 / 389,642 B (**30.2%**, 457 entries)
  - `CST205` (DS): 155,628 / 443,871 B (**35.1%**, 581 entries)
  - `CST207` (CSO): 71,977 / 292,227 B (**24.6%**, 274 entries)
  - `CST209` (Algorithms): 145,151 / 392,015 B (**37.0%**, 505 entries)
  - `pages`: 41,392 / 394,582 B (**10.5%**, 75 entries)
- **Exact HTML scope partition (recorded in `assets/search/manifest.json` `scope` and verified by `tests/test_discovery.py`):** all **68 shipped HTML pages** partition cleanly into **50 indexed** (24 unit note pages + 26 informational, subject-hub, practical-lab `CST211`/`CST213`/`CST215`, internship `SI201`, `courses.html`, `coverage.html`, `exam-pattern.html`, `cards.html`, `today.html`, `settings.html`, `roadmap/index.html`, and 9 `info/*.html` pages) and **18 deliberately excluded** (14 dynamic data/app shells whose underlying questions or controls are indexed directly, 2 unshipped `bookmarks`/`suggestions` placeholders, and 2 `404`/`offline` fallback shells). Device-local `section-note:*` records are merged client-side only; full PYQ model-answer bodies, option lists/explanations, and full unit body prose are explicitly recorded as not full-text indexed to keep shards ≤ 40%.
- **Target & anchor validation:** Builder verifies every generated target file and every `#anchor` ID against parsed HTML before writing.
- **Offline registration (`sw.js` + `docs/CACHE-POLICY.md`):** Pre-caches `search.html`, `repeated.html`, `coverage.html`, `exam-pattern.html`, `discovery.css`, `subject-labels.js`, `discovery.js`, `unit-discovery.js`, `manifest.json`, `index-pages.json`, and `repeated.json`; preserves explicit `?v=<sha256>` cache keys on search shards; supports one-shot `WARM_SEARCH` caching of all 5 subject shards; falls back to pre-cached pathname shells for query-string navigations offline. Worker `VERSION` remains `'study-safety-2026-11-09'` to keep existing feedback build-tag contracts intact.

### 4.2 — Search UI
- `search.html`, `assets/js/discovery.js`, and `assets/css/discovery.css` build all DOM exclusively with `createElement`/`textContent` (zero `innerHTML`/`outerHTML`/`insertAdjacentHTML` sinks).
- Added `type` filter (`pyq`, `quiz`, `unit`, `page`, `note`), URL `?topic=` chip handoff, live manifest-backed `#search-scope` disclosure, grouped result headings with exact per-group counts, 120 ms debounced input, `replaceState`/`popstate` back-button support, full keyboard navigation (`/`, `Ctrl/Cmd+K`, `ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter`, `Escape`), empty/no-match/error+Retry states, and `subjectLabel()` everywhere (zero raw `CST20x`/`SI201` codes or raw question IDs in visible UI).
- Added direct `Search` entry links on `coverage.html`, `exam-pattern.html`, `pyq/index.html`, `practice/index.html`, and `quiz/index.html` alongside the home header.

### 4.3 — Repeated-question explorer
- `assets/search/repeated.json` (22,447 B) and `repeated.html` honestly present both datasets for the 28-paper / 924-PYQ archive:
  - **1 exact-content alias group** (`CST203-P001-Q43` / `CST203-P001-Q44`, identical stem, options, key, answer, marks and stored unit).
  - **15 normalized-text candidate clusters covering 32 archived records** (`C`: 2 clusters / 5 records; `Python`: 3 / 6 incl. the exact pair; `DS`: 2 / 4; `CSO`: 4 / 8; `Algorithms`: 4 / 9).
- Every candidate cluster carries `status: "unverified-candidate"` in JSON and a visible **"Unverified candidate, not a confirmed duplicate"** badge, explicit `differsIn` explanation, per-subject archive sample sizes, method/non-prediction disclaimer, URL/popstate subject filter, links to real `pyq/answers.html?paper=<paperId>&q=<qid>` targets, and `subjectLabel()` display names with zero raw codes or question IDs.

### 4.4 — Canonical question deep links and share
- Extended `assets/js/subject-labels.js` with `window.StudyShare` (`copy`, `share`, `highlight`): invokes `navigator.share({ title, text, url })` when available, respects `AbortError` cancellation, falls back automatically to `navigator.clipboard.writeText(url)` when Web Share is unavailable or fails, and falls back to a focused, pre-selected readonly `<input class="share-fallback-input">` with `role="status"` feedback when clipboard access is unavailable or denied.
- Wired across `pyq/answers.html` (`?paper=<paperId>&q=<qid>`, `?subject=CST20x&paper=P00n&q=<qid>`, and bare `?q=CST20x-P00n-Qk`; persistent across single-question/review re-renders; canonical URL byte-identical on repeat calls), `practice/session.html` (`?q=<qid>` including exact-alias redirect `CST203-P001-Q44` → `CST203-P001-Q43`, canonical copy/share + `Open in <Subject> paper` link), `quiz/review.html`, and `quiz/result.html` (explicit `this device` local-attempt disclosure, public `pyq/answers.html` share/open link on PYQ mock questions, preserved query string on MCQ `review.html` → `result.html` redirect).
- Removed raw `CST20x` codes and raw question IDs from PYQ titles/print headers, Practice filter chips/`alsoAppearedIn`, and Quiz Review footers while preserving every internal ID in URLs and `data-question-id` attributes. Missing papers/questions/local attempts show polite status messages without crashing.

### 4.5 — Unit-to-PYQ cross-links, breadcrumbs, and authored anchors
- Authored 168 unique `<h3>` IDs across all 24 `subjects/CST20*/units/unit-*.html` pages (avoiding `section-\d+` so `section-notes.js` storage keys `section-note:CST20x/units/unit-Y.html#section-N` stay untouched) and 7 `<h2>` IDs on `coverage.html`/`exam-pattern.html`; indexed all 347 unit `<h2>` headings via their authored `<section id>` attributes (515 anchored unit headings total; 24 page-top `<h1>` recorded explicitly as `noAnchor: true` / `data-anchor-status="page-top"`, 24 `#mobileDrawer` chrome headings excluded).
- Loaded `subject-labels.js` across all 24 unit pages and 5 theory subject hubs.
- Updated `assets/js/unit-discovery.js`: injects `Subject → Unit → Section` breadcrumbs (synced with `#hash`, clicks, and `IntersectionObserver`, automatically expanding collapsed sections on `#hash` arrival), authored `#` anchor links (never fabricating runtime IDs), syllabus-accurate Prev/Next unit navigation (treating Algorithms Unit 5 as supplementary), per-unit PYQ counts + sample links + up to 10 topic filter links, and subject-hub per-unit PYQ counts + jump lists with out-of-syllabus tag notices.
- Updated `pyq/index.html` + `pyq/js/index.js`: accepts `?subject=`, `?unit=`, and `?topic=` URL filters (with `popstate`, topic filter chips, clear button, Practice/Search/Notes handoffs, 0-count state, and `textContent`-only XSS-safe rendering).

## Verification evidence

- `validate_pyq.py`: PASS (28 papers, 924 question objects, 0 errors, 0 warnings).
- `check_pyq_integrity.py`: PASS (0 changed/added/missing frozen files).
- `validate_data.py --check-baseline`: PASS (exact match on the 9 recorded findings + 1 candidate-cluster warning).
- `check_platform.py`: PASS (0 errors; deterministic presence/sitemap/robots verified).
- `check_site.py --strict`: PASS (0 errors, 28 pre-existing warnings — 0 new findings).
- `python3 -m unittest discover -s tests -p 'test_*.py' -v`: **16 PASS** (including 5 discovery tests covering shard idempotence/≤40% budget, 68-page scope partition, 2,410-entry file+anchor resolution, 1-exact/15-candidate repeat integrity, and SW cache registration).
- Deterministic Node suites: **7 PASS** (`attempt-store.cjs`, `quiz-engine-dom.cjs`, `storage.cjs`, `storage-recovery.cjs`, `study-store.cjs`, `data-pipeline-consumers.cjs`, and new `discovery-dom.cjs` wired into `.github/workflows/ci-web.yml`).
- Updated `tests/discovery-study-browser.cjs` for 28-paper/924-PYQ/1-alias/15-candidate counts and `subjectLabel()` titles without loosening assertions (Playwright/Chromium absent in this sandbox; ready for dev-Chromium / Phase 10 runs).

## Remaining caveats / gates

- Owner local/Termux review of `search.html`, `repeated.html`, deep links/share sheet, unit breadcrumbs/anchors, and filtered-PYQ handoffs is required before flipping Phase 4 from `🚧` to `✅*`.
- The 15 normalized-text candidate clusters (32 records) remain unverified candidates pending manual source comparison under Phase 2.5 / Phase 8.6; they are intentionally not merged or counted as confirmed duplicates.
- Physical phone latency on low-end Android, native OS share-sheet UX, screen-reader announcements, and real browser offline/update flows are consolidated in Phase 10 (`10-device-acceptance`).
