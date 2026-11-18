# Phase 16 — Algorithms: Weight-Calibrated Content, Video Curation & PYQ Sync

> **Status:** 📋 Planned (documentation blueprint — zero shipped files modified)  
> **Execution Priority:** **#3 of 5** (`15 → 13 → 16 → 14 → 12` — most uniform exam split + unreachable `42m` CO5 module)  
> **Subject:** Algorithms (`CST209` — theory-only, no companion lab course)  
> **Syllabus authority:** `docs/syllabus/syllabus.json` & `docs/syllabus/syllabus-3rd-sem-2022.pdf` **p. 12** — **4 credits, L–T–P `3-1-0`, 60 contact hours (`6 + 16 + 18 + 20`)** across **4 official syllabus units**, plus Course Outcome **CO5** (*"Learn various string processing algorithms"*, p. 12) whose detailed unit table was omitted from the printed PDF but is tested in **every `2023–2026` paper (`4/4`)**  
> **PYQ weighting window (strict `2023–2026`):** **4 papers, 105 scan-verified questions, 395 printed set marks** (`P003-2023-03` [34 Qs / 97m], `P004-2024-01` [23 Qs / 94m], `P005-2024-12` [24 Qs / 102m], `P006-2026-01` [24 Qs / 102m]; each paper max 60 answerable marks).  
> **Excluded legacy paper:** `P001-2022-06` (1 paper, 62 Qs, including the legacy Colpitts-oscillator misprint) stays archived read-only in `_data/CST209/` and is **excluded from all topic weights and scope decisions**.

---

## 1. Goal & Why This Phase Matters (2023–2026 Evidence)

Algorithms is the **most evenly weighted subject in the semester** — all four official units sit inside a razor-thin `20.0%–23.5%` band — while a recurring **`42-mark (10.6%, 4/4 papers)` CO5 String Matching & Tries block** lives in existing `subjects/CST209/units/unit-5.html` (`6,477w`) completely disconnected from `.unit-topic-link` discovery and diluted by five `0m` non-exam sections:

| Unit | Official Title (`syllabus.json`, p. 12) | Hrs | Stored Tag (Q / m) | True 2023–2026 Weight | Share | Avg / Paper | MCQ + Long | Papers | Current Words → Target | Unit Blueprint |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Unit 1** | Introduction | 6h | 20 Q / 62m | **89m** | **22.5%** | 22.2m | 33m + 56m | **4/4** | 4,572w → ~5,800–6,400w | [`unit-1/README.md`](unit-1/README.md) |
| **Unit 2** | Sorting | 16h | 33 Q / 125m | **79m** | **20.0%** | 19.8m | 23m + 56m | **4/4** | 6,248w → ~6,200–6,800w | [`unit-2/README.md`](unit-2/README.md) |
| **Unit 3** | Searching | 18h | 26 Q / 97m | **92m** | **23.3%** | 23.0m | 24m + 68m | **4/4** | 5,915w → ~6,600–7,200w | [`unit-3/README.md`](unit-3/README.md) |
| **Unit 4** | Graphs | 20h | 25 Q / 103m | **93m** | **23.5%** | 23.2m | 29m + 64m | **4/4** | 6,512w → ~6,800–7,500w | [`unit-4/README.md`](unit-4/README.md) |
| **Unit 5*** | String Matching & Tries *(CO5 Supplementary)* | — | 1 Q / 8m* | **42m** | **10.6%** | 10.5m | 6m + 36m | **4/4** | 6,477w → ~4,600–5,200w | [`unit-5-supplementary/README.md`](unit-5-supplementary/README.md) |
| **Total** | **4 Official + 1 CO5 Supplementary** | **60h** | **105 Q / 395m** | **395m** | **100.0%** | **98.8m** | **115m + 280m** | **4/4** | **29,724w → ~30.0–33.1kw** | **5 unit blueprints** |

*\*CO5 storage note:* `CST209-P003-Q34` is tagged `unit: 5` (tracked in `docs/data/validation-exceptions.json` as `unit 5 outside syllabus`), whereas `P004-Q15,Q23`, `P005-Q11,Q15,Q23,Q24`, and `P006-Q22b` are tagged `unit: 4` with `syllabusNote` explaining the CO5 omission.

### Live Baseline Audit (Units 1–5 & Companion Data)
- **Unit HTMLs (`subjects/CST209/units/unit-{1..5}.html`):** `29,724` words · `44` `<pre>` blocks (`13+10+6+7+8`) · `57` `<table>`s (`11+6+10+14+16`) · **`0` `<svg>`s** · `76` `<section id>`s (`58` in U1–U4 [`16+14+15+13`] + `18` in U5) · `61` existing `<h3 id>`s (`55` in U1–U4 [`26+13+8+8`] + `6` in U5) · `0` YouTube links · `0` raw code leaks.
- **PYQ topic-link baseline (`105` Qs in `P003–P006`):** `56` same-unit hits (`53.3%`, including 4 subtle false-positive topic matches such as `P004-Q12` `Graphs / trees` → `U3#bst`), `22` accurate cross-unit redirects (`21.0%`), **`26` unmatched (`24.8%`)**, and **`1` out-of-unit (`P003-Q34`)** — with **`0 / 8` CO5 questions** reaching `unit-5.html`.
- **Quiz banks & revision sheet:** 5 JSON files in `_quiz-data/CST209/` totalling **`196` items** (`unit-1: 34`, `unit-2: 42`, `unit-3: 40`, `unit-4: 45`, `unit-5: 35` [flagged `bank-unit`]); `docs/revision-sheets/CST209.json` has `8` draft entries (`U1: 4, U2: 1, U3: 2, U4: 1`).

### Key 2023–2026 Calibration Findings
1. **Right-size & wire existing `unit-5.html` (`42m = 10.6%`, `6,477w → ~4,600–5,200w`):** 100% of CO5 marks hit exactly **four** sections — `#rabin-karp` (`15m`, **4/4 papers**), `#kmp` (`11m`, LPS table + RK vs KMP), `#naive-search` (`8m`, binary shift trace), and `#tries` (`8m`, 8-word trie). Condense the five `0m` legacy sections (`#string-sort`, `#horspool`, `#boyer-moore`, `#regex`, `#compression`) to ~80–120w stubs preserving every `<section id>`/`<h3 id>`, keep `SYLLABUS_UNITS.CST209 = 4` (and Prev/Next nav strictly `1..4` per `tests/discovery-dom.cjs:405–421`), and add `SUPPLEMENTARY_UNITS = { CST209: [5] }` solely to `focusQuestionTopic()` candidate lookup.
2. **Unit 4 Graphs (`93m`, 23.5%) is 78.5% MST + Shortest Paths (`73m`):** Prim + Kruskal (`38m`, `4/4`) and Dijkstra + Bellman-Ford + Floyd-Warshall (`35m`, `4/4`), plus graph types/cycles/spanning trees (`12m`, `4/4`) and DAG + topological sort (`8m`, `4/4`).
3. **Unit 3 Searching (`92m`, 23.3%) guarantees two 8m questions every year:** Binary + Linear Search (`37m`, `4/4`), Hashing + Collision Resolution (`31m`, `4/4`), and BST + Balanced Trees (`24m`, `3/4`); Symbol Tables scored **`0m`** (compact **Tier S**).
4. **Unit 1 Introduction (`89m`, 22.5%) delivers `14.8 marks/hour` (#1 in the semester!):** Algorithm properties + `O/Ω/Θ` (`30m`, `4/4`), Divide & Conquer + DP + Greedy (`26m`, `4/4`), loop counting + substitution `T(n)=2T(n/2)+1` (`17m`), and sets/multisets/power set + stack `PUSH`/`POP` (`16m`).
5. **Unit 2 Sorting (`79m`, 20.0%):** Efficient `O(n log n)` sorts (`32m`, `4/4`), elementary `O(n^2)` sorts (`30m`, `4/4`), and linear-time Radix + Bucket (`17m`, `3/4`); Shell Sort & standalone Counting Sort scored **`0m`** (compact **Tier S**).
6. **Intra-phase execution order:** **Unit 4 (`23.5%`) → Unit 3 (`23.3%`) → Unit 1 (`22.5%`) → Unit 2 (`20.0%`) → Unit 5 CO5 Supplementary (`10.6%`)**.

---

## 2. Weight-Tier System (`P003–P006`, 395 Set Marks)

| Tier | 2023–2026 Rule | Algorithms Topic Clusters | Depth Policy |
| :--- | :--- | :--- | :--- |
| **Tier A (Core Heavyweight)** | `>= 20m` (`>= 5.0%`) | U4 MST Prim & Kruskal (`38m`), U3 Binary & Linear Search (`37m`), U4 Shortest paths Dijkstra/Bellman-Ford/Floyd-Warshall (`35m`), U2 Efficient Quick/Merge/Heap (`32m`), U3 Hashing & collision resolution (`31m`), U1 Algo traits & `O/Ω/Θ` (`30m`), U2 Elementary Selection/Bubble/Insertion (`30m`), U1 D&C/DP/Greedy (`26m`), U3 BST & balanced trees (`24m`) | Formal pseudocode, inline SVG, exact exam dataset trace, proof/complexity & 8m model answer |
| **Tier B (Regular)** | `10–19m` (`2.5–4.9%`) | U1 Loop complexity & recurrences (`17m`), U2 Linear sorts Radix & Bucket (`17m`), U1 ADT/sets/multisets/power set & stack (`16m`), U5 Rabin-Karp (`15m`, `4/4` — CO5), U4 Graph basics/cycles/spanning trees (`12m`), U5 KMP & LPS (`11m` — CO5) | Clear pseudocode, full exam trace, complexity card & practice |
| **Tier C (Low-Weight)** | `1–9m` (`< 2.5%`) | U4 DAG & topological sort (`8m`, `4/4`), U5 Naive string matching (`8m` — CO5), U5 Tries / prefix trees (`8m` — CO5) | Focused pseudocode + exact worked exam trace |
| **Tier S (Syllabus `0m`)** | In PDF p. 12, `0m` in `P003–P006` | U1 Queue primitive; U2 Shell Sort & standalone Counting Sort (Radix subroutine); U3 Symbol Tables & 2-3 tree split note | Concise ~180–220w reference blocks; zero omission |
| **Tier E (CO5 Exam Module)** | CO5 p. 12, omitted from unit table, `42m` | Dedicated transparently labelled `subjects/CST209/units/unit-5.html` (`15+11+8+8 = 42m`); 5 `0m` legacy sections kept as ~100w stubs | Full exam traces on the 4 active topics; honest CO5 disclosure |

---

## 3. Deliverables Summary

- **5 upgraded HTML pages (`subjects/CST209/units/unit-{1..5}.html`):** `~30,000–33,100` calibrated words, **14 accessible inline SVGs** (`2+3+3+4+2`), Python-verified algorithm traces for every exact exam dataset, **19 new semantic `<h3 id>` anchors** (`6+2+2+4+5`) while preserving all **76 existing `<section id>`s**, **61 existing `<h3 id>`s**, and **8 locked `guides.json` anchors**.
- **CO5 routing & disclosure sync:** Targeted `SUPPLEMENTARY_UNITS = { CST209: [5] }` lookup support in `assets/js/unit-discovery.js` (keeping `SYLLABUS_UNITS.CST209 = 4` and Prev/Next nav strictly `1..4`), clear CO5 supplementary labelling on `subjects/CST209/index.html` and root `coverage.html`, and synced `docs/revision-sheets/CST209.json`.
- **15 live-verified plain-`<a>` YouTube resource slots** (`3+3+3+3+3`, zero embeds/iframes/thumbnails) logged in [`record.md`](record.md).
- **Index & test sync:** Run `generate_presence.py` twice (idempotence), rebuild `assets/search/index-CST209.json` via `build_search_index.py`, `assets/data/revision-sheets.json` via `build_revision_sheets.py`, and `assets/data/data-version.json` last via `build_data_version.py`; raise `unitAnchored` baseline in `tests/test_discovery.py:111` with `105 / 105` `2023–2026` PYQ topic links resolving.

---

## 4. Scope In / Scope Out

### In Scope (during Phase 16 execution)
- Rewriting/calibrating `subjects/CST209/units/unit-{1..5}.html` per the 5 unit blueprints; preserving `#dijkstras-algorithm` / `#shortest-path-1-dijkstra-s-algorithm` search & DOM-test invariants (`tests/test_discovery.py:178–181`, `tests/discovery-dom.cjs:365–395`).
- Adding `SUPPLEMENTARY_UNITS = { CST209: [5] }` for `.unit-topic-link` fallback in `assets/js/unit-discovery.js` (without changing `SYLLABUS_UNITS` or Prev/Next unit bars) and verifying CO5 disclosure on `subjects/CST209/index.html` and `coverage.html`.
- Cross-linking `_quiz-data/CST209/unit-{1..5}.json` (`196` items) and syncing `docs/revision-sheets/CST209.json`.
- Adding `15` live-verified plain-`<a>` YouTube links and regenerating search/presence/version artifacts across all `84` shipped HTML pages.

### Out of Scope
- Claiming `CST209` has 5 official syllabus units or adding `Next: Unit 5` to `unit-4.html`'s footer navigation.
- Editing `_data/CST209/*.json`, `_quiz-data/CST209/*.json` unit tags, or `docs/data/validation-exceptions.json` under default **Mode A** (deferred to optional owner-approved **Mode B**).
- Expanding `0m` legacy string-sort, Horspool, Boyer-Moore, regex, or compression sections; adding YouTube `<iframe>` embeds or thumbnails; modifying Phases 1–10; deploying.

---

## 5. Dependencies, Technical Gates & Owner Gates

- **Dependencies:** Closed Phases 0–10 + locked `guides.json` anchors (Phase 11). Runs independently of Phases 12–15 (recommended #3 after Phases 15 and 13).
- **Technical gates:** All 13 repository gates in `README.md:161–173` (`check_pyq_integrity.py`, `check_platform.py`, `build_suggestions.py --check`, `check_site.py --strict --quiet`, `validate_pyq.py`, `validate_data.py --check-baseline`, `audit_accessibility.py --fail`, `check_tokens.py --strict`, `build_icon_subset.py --check`, `build_data_version.py --check`, `audit_page_weight.py --budget`, `check_root_rewrite.py`, `check_readme_paths.py`) plus `validate_syllabus.py` (keeping `CST209` at 4 official units), `python3 -m unittest discover -s tests -p 'test_*.py' -v`, and `node tests/discovery-dom.cjs`; scratch Python verification of every sorting, recurrence, hashing, MST, shortest-path, Naive, Rabin-Karp, KMP LPS, and Trie trace; `0` raw code leaks (`CST20x`, `P00x-Qy`); idempotent double-pass `generate_presence.py` across all `84` HTML pages.
- **Owner gates:** Mode A default (zero `_data/` edits); Mode B and GitHub Pages deployment require explicit owner approval.

---

## 6. Done Means

All 6 execution parts in [`tasks.md`](tasks.md) are checked off, Units 1–4 + CO5 Supplementary Unit 5 cover 100% of PDF p. 12 and all `395` `2023–2026` marks proportionally, every algorithm trace and YouTube URL is verified and logged in [`record.md`](record.md), `105 / 105` `2023–2026` Algorithms PYQs resolve to exact concept anchors (including all `8` CO5 string/trie items), and every repository validator and DOM/discovery test exits `0`.
