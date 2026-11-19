# Phase 16 — Execution Checklist (`tasks.md`)

> **Phase:** 16 — Algorithms (`CST209`) Weight-Calibrated Content, Video Curation & PYQ Sync  
> **Rule:** Execute in **6 strictly bounded parts** (`4–6` parts per phase per `rule.md`). Run gates after every part and log evidence in [`record.md`](record.md). Default to **Mode A** (zero `_data/CST209/` edits; `SYLLABUS_UNITS.CST209 = 4` immutable).

---

## Pre-Execution Reuse & Anchor Audit (Run Before Part 1)

- [ ] Inventory all **76 existing `<section id>`s** (`58` in `unit-{1..4}.html` + `18` in `unit-5.html`) and **61 existing `<h3 id>`s** (`26 + 13 + 8 + 8 + 6`) so zero `section-notes.js` keys break.
- [ ] Confirm all **8 locked `docs/suggestions/guides.json` anchors**: U1 `asymptotic`, `complexity`; U2 `elementary`, `efficient`; U3 `binary-search`, `hashing-collision-resolution-techniques`; U4 `mst`, `shortest-path` — plus search/DOM anchors `shortest-path-1-dijkstra-s-algorithm` and `dijkstras-algorithm`.
- [ ] Reuse shared classes in `assets/css/` rather than expanding inline `<style>` blocks, and verify existing CO5 disclosures on `subjects/CST209/index.html` and root `coverage.html`.

```bash
python3 scripts/check_pyq_integrity.py && python3 scripts/build_suggestions.py --check && python3 scripts/validate_syllabus.py && python3 -m unittest tests/test_discovery.py && node tests/discovery-dom.cjs
```

---

## Part 1 — Unit 4 (Graphs, `93m` / `23.5%`) Upgrade (`unit-4.html`)

- [ ] Calibrate `subjects/CST209/units/unit-4.html` (`6,512w → ~6,800–7,500w`) per [`unit-4/README.md`](unit-4/README.md), preserving all `13` `<section id>`s, `8` existing `<h3 id>`s, and locked `#mst` & `#shortest-path`.
- [ ] Author full **Tier A** `#mst` (`38m`, `4/4`: Prim & Kruskal pseudocode, Union-Find, 6-/7-vertex trace tables & SVGs, 7-row comparison) and **Tier A** `#shortest-path` (`35m`, `4/4`: Dijkstra + negative-edge counter-example, Bellman-Ford negative-edge trace, Floyd-Warshall `D^(0)..D^(4)` 4×4 matrices, 8-row comparison).
- [ ] Author crisp **Tier B** `#graph-basics` (`12m`, `4/4` + CO5 Unit 5 pointer) and **Tier C** `#dag-topo` (`8m`, `4/4`: Kahn's & DFS topological sort).
- [ ] Embed `4` accessible inline SVGs, add `4` new `<h3 id>` anchors (including `#dijkstras-algorithm`), verify all traces via a scratch Python script, and sync U4 in `docs/revision-sheets/CST209.json`.

---

## Part 2 — Unit 3 (Searching, `92m` / `23.3%`) Upgrade (`unit-3.html`)

- [ ] Calibrate `subjects/CST209/units/unit-3.html` (`5,915w → ~6,600–7,200w`) per [`unit-3/README.md`](unit-3/README.md), preserving all `15` `<section id>`s, `8` existing `<h3 id>`s, and locked `#binary-search` & `#hashing-collision-resolution-techniques`.
- [ ] Author **Tier A** `#linear-search` + `#binary-search` (`37m`, `4/4`: iterative & recursive pseudocode, overflow-safe `mid`, `O(log n)` recurrence proof, Linear vs Binary table).
- [ ] Author **Tier A** `#hashing` (`31m`, `4/4`: division/multiplication/mid-square/folding hash functions, Separate Chaining + Linear/Quadratic Probing + Double Hashing traced on one shared key set).
- [ ] Author **Tier A** `#bst` + `#balanced` (`24m`: `BST-INSERT`, 3-case `BST-DELETE`, height-balancing significance, AVL/2-3/Red-Black/B-Tree overview) and compact **Tier S** `#symbol-tables` (`0m`, ~200w); embed `3` SVGs and add `2` new `<h3 id>`s.

---

## Part 3 — Unit 1 (Introduction, `89m` / `22.5%`) Upgrade (`unit-1.html`)

- [ ] Upgrade `subjects/CST209/units/unit-1.html` (`4,572w → ~5,800–6,400w`) per [`unit-1/README.md`](unit-1/README.md), preserving all `16` `<section id>`s, `26` existing `<h3 id>`s, and locked `#asymptotic` & `#complexity`.
- [ ] Expand **Tier A** `#definitions` + `#asymptotic` (`30m`, `4/4`: 5 Knuth characteristics w/ examples, formal `O/Ω/Θ` proofs & bound SVG) and **Tier A** `#programming-models` (`26m`, `4/4`: D&C, DP, Greedy + 7-row D&C vs DP table).
- [ ] Expand **Tier B** `#complexity` (`17m`: `while(i<=n) i=i*2 → O(log n)`, `O(n^2)` nested loop, step-by-step substitution `T(n)=2T(n/2)+1 = 2n-1 = Θ(n)`, Master Theorem card) and **Tier B/S** `#data-abstraction` + `#sets-multisets` (`|P(S)|=2^n`, multiplicity) + `#stacks-queues` (`PUSH`/`POP` + concise Tier S queue); embed `2` SVGs and add `6` new `<h3 id>`s.

---

## Part 4 — Unit 2 (Sorting, `79m` / `20.0%`) Upgrade (`unit-2.html`)

- [ ] Calibrate `subjects/CST209/units/unit-2.html` (`6,248w → ~6,200–6,800w`) per [`unit-2/README.md`](unit-2/README.md), preserving all `14` `<section id>`s, `13` existing `<h3 id>`s, and locked `#elementary` & `#efficient`.
- [ ] Author **Tier A** `#efficient` (`32m`, `4/4`: Merge Sort recursion tree, exact 12-item Quick Sort trace on `38,81,22,48,13,69,93,14,45,58,79,72` + best/worst derivations, Heap Sort + `BUILD-MAX-HEAP` `O(n)`, 3-way table) and **Tier A** `#elementary` (`30m`, `4/4`: Selection Sort, exact 8-item Bubble Sort trace on `25,57,48,37,12,92,86,33`, Insertion Sort, 3-way table + concise **Tier S** Shell Sort).
- [ ] Author **Tier B** `#linear` (`17m`: linear-sort significance & limits, concise **Tier S** Counting Sort, exact 3-pass LSD Radix Sort trace on `347,142,361,423,538,126,320,549,365`, Bucket Sort) + 9-sort master table; embed `3` SVGs, add `2` new `<h3 id>`s, and verify all traces in Python.

---

## Part 5 — Unit 5 CO5 Supplementary Right-Sizing & Topic-Link Wiring (`unit-5.html`)

- [ ] Refocus `subjects/CST209/units/unit-5.html` (`6,477w → ~4,600–5,200w`) per [`unit-5-supplementary/README.md`](unit-5-supplementary/README.md), preserving all `18` existing `<section id>`s and `6` existing `<h3 id>`s.
- [ ] Expand the `42m` examined CO5 core: `#rabin-karp` (`15m`, `4/4`, rolling hash + spurious hit), `#kmp` (`11m`, LPS `[0,0,1,2,0]` + full trace of `"ababd"` in `"ababcabcabababd"` + RK vs KMP table), `#naive-search` (`8m`, shift-by-shift trace of `"101110"` in `"1110101011101100"` → shift `6`), and `#tries` (`8m`, SVG + insertion of `{bat, ball, doll, dork, do, dorm, send, sense}`); embed `2` SVGs and add `5` new `<h3 id>`s.
- [ ] Condense the 5 `0m` legacy sections (`#string-sort`, `#horspool`, `#boyer-moore`, `#regex`, `#compression`) to ~80–120w stubs with preserved IDs.
- [ ] Wire `SUPPLEMENTARY_UNITS = { CST209: [5] }` into `focusQuestionTopic()` in `assets/js/unit-discovery.js` while keeping `SYLLABUS_UNITS.CST209 = 4` and keeping `unit-4.html` Prev/Next nav strictly free of `Next: Unit 5` (`tests/discovery-dom.cjs:405–421`); verify plain-English CO5 disclosure on `subjects/CST209/index.html` and `coverage.html`.

---

## Part 6 — YouTube Curation, Topic Map, Full PYQ Routing Audit & 13-Gate Verification

> **Topic map required.** Follow [`docs/phases/topic-map-standard.md`](../topic-map-standard.md)
> — the Phase 12 CST201 map is the worked example. Author it **last**, after the
> CO5 supplementary anchors exist (the map must cover the `unit 5` items too).

- [ ] Curate and live-verify all **15 plain-`<a>` YouTube links** (`3` each in U1–U5; zero `<iframe>`, zero `ytimg.com` thumbnails) and record video titles, channels, durations, and verification dates in [`record.md`](record.md).
- [ ] Author `assets/data/topic-map-CST209.json` per the standard: every question in the `P00[3-6]` window mapped (including the `8 / 8` CO5 supplementary items), zero raw paper-section anchors, every anchor verified present in its unit page, and `tests/test_topic_map.py` repointed at this subject passing. Record before/after generic-landing counts in `record.md` (baseline: 9 of 167 questions land on a generic card today).
- [ ] Run canonical `README.md:187–215` regeneration (`build_revision_sheets.py`, `build_suggestions.py`, `build_icon_subset.py`, `generate_presence.py` **twice** for idempotence across all `84` HTML pages, `build_search_index.py` updating `assets/search/index-CST209.json`, and `build_data_version.py` updating `assets/data/data-version.json` last); verify `105 / 105` `2023–2026` `CST209` PYQs resolve to exact concept anchors (including `8 / 8` CO5 items) and update `unitAnchored` in `tests/test_discovery.py:111`.
- [ ] Run the full `README.md:161–173` verification suite plus Python/Node tests and log exit codes in [`record.md`](record.md):

```bash
python3 scripts/build_revision_sheets.py && python3 scripts/build_suggestions.py && python3 scripts/build_icon_subset.py
python3 scripts/generate_presence.py && python3 scripts/generate_presence.py && python3 scripts/build_search_index.py && python3 scripts/build_data_version.py
python3 scripts/check_pyq_integrity.py && python3 scripts/check_platform.py && python3 scripts/build_suggestions.py --check && python3 scripts/check_site.py --strict --quiet
python3 scripts/validate_pyq.py && python3 scripts/validate_data.py --check-baseline && python3 scripts/validate_syllabus.py
python3 scripts/audit_accessibility.py --fail && python3 scripts/check_tokens.py --strict && python3 scripts/build_icon_subset.py --check && python3 scripts/build_data_version.py --check
python3 scripts/audit_page_weight.py --budget && python3 scripts/check_root_rewrite.py && python3 scripts/check_readme_paths.py
python3 -m unittest discover -s tests -p 'test_*.py' -v && node tests/discovery-dom.cjs && node tests/section-notes.cjs && node tests/data-version.cjs
```
