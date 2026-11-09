# Phase 4 — Tasks

## 4.1 — Search index builder

**Steps**
1. `scripts/build_search_index.py` reads `_data/**`, `_quiz-data/**` and the
   unit pages' headings, and emits `assets/search/index-<subject>.json` plus a
   small `manifest.json` (version, counts, checksum).
2. Index fields: `id`, `type` (pyq|quiz|note|unit), `subject`, `unit`, `topic`,
   `title` (question stem, truncated), `text` (searchable, lowercased,
   accent-folded, punctuation-stripped), `year`, `month`, `marks`, `paper`.
3. Deterministic output: stable ordering, no timestamps, sorted keys.
4. Cache-bust by version in the filename or query; register the index in the
   service worker's data strategy.

**Acceptance:** index byte size per subject ≤ 40% of that subject's source
JSON; two runs produce identical bytes; every index entry links to a real page
(validated by the script).

## 4.2 — Search UI

**Steps**
1. Add a search entry point in the header and a `/search.html` page; `?q=` puts
   the query in the URL (shareable, back-button friendly).
2. Load the index for the subject(s) selected, or lazily by first keystroke;
   debounce 120 ms; show grouped results with counts.
3. Keyboard: `/` or `Ctrl/Cmd+K` focuses, arrows move, Enter opens, Esc clears.
4. Empty state explains what can be searched; no-results state suggests a
   broader term and shows the nearest topics.
5. Escape all inserted text (Phase 1 policy) — results are data, not markup.

**Acceptance:** search works offline after one load; a query with `<` does not
break the page; 200 ms budget measured on the heaviest index; no console errors.

## 4.3 — Repeated-question explorer

**Steps**
1. Consume the duplicate map from Phase 2.4 (`canonicalId` + `alsoAppearedIn`).
2. New page: list of repeated questions, grouped by subject and unit, showing
   year/month chips and the number of appearances.
3. Each row links to the canonical question and to every paper it appeared in.
4. Add a per-subject "most repeated units" summary from the syllabus join; state
   the sample size so it is not read as a prediction.

**Acceptance:** numbers match `docs/data/duplicates.md`; every chip links to a
real paper; the page states its method in one line.

## 4.4 — Deep links and share

**Steps**
1. Canonical question URL: `pyq/answers.html?paper=CST201-P001-2021-03&q=CST201-P001-Q1`.
2. On load, resolve id → paper → scroll to the question, add a focus ring and a
   transient highlight; update `document.title`.
3. "Copy link" every question (clipboard with fallback), plus
   `navigator.share({title, text, url})` where available.
4. Same for quiz review entries and unit sections (`#unit-3` style anchors).

**Acceptance:** opening each URL form in a fresh tab lands on the right item;
sharing twice produces the same URL; no broken anchor when the paper is missing.

## 4.5 — Browse and cross-links

**Steps**
1. Unit pages: add "PYQs from this unit" (count + first few + link to filtered
   PYQ view) and "topics in this unit" from the data.
2. Add breadcrumbs (Subject → Unit → Section) and prev/next unit links.
3. Subject page: show per-unit question counts and a jump list.
4. Filters on the PYQ page accept the unit/topic from the URL.

**Acceptance:** unit page → filtered PYQ list preserves the unit; breadcrumbs
reflect the path; counts agree with `validate_syllabus.py`.

## Phase checks

```sh
python3 scripts/build_search_index.py && git diff --exit-code assets/search/
python3 scripts/check_site.py --strict
# manual: search offline, deep link in a fresh tab, share fallback
```

**Not verifiable here:** real phone input latency and keyboard behaviour.
Record them in the phone pass.
