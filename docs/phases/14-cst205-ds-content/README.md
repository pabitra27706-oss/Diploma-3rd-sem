# Phase 14 — Data Structures: Weight-Calibrated Content, Video Curation & PYQ Sync

> **Status:** 📋 Planned (documentation blueprint — zero shipped files modified)  
> **Subject:** Data Structures (`CST205`, paired practical `CST215` Data Structures Lab)  
> **Syllabus authority:** `docs/syllabus/syllabus.json` & `docs/syllabus/syllabus-3rd-sem-2022.pdf` **p. 7** — **3 credits, L–T–P `2-1-0`, 45 contact hours (`3 + 12 + 15 + 15`)** across **4 official units**  
> **Paired practical:** `CST215` Data Structures Lab — **PDF p. 19** (`2` credits, L–T–P `0-0-4`, `60` contact hours, 9 practical areas; honest reference page at `subjects/CST215/index.html`)  
> **PYQ weighting window (strict 2023–2026):** **4 papers, 106 scan-verified questions, 403 printed set marks** (`P003-2023-03` [34 Qs / 97m], `P004-2024-01` [23 Qs / 94m], `P005-2024-12` [25 Qs / 110m], `P006-2026-01` [24 Qs / 102m]; each paper = 60 max answerable marks). Older `2021–2022` papers (`P001-2021-03`, `P002-2022-06` — 2 papers, 88 Qs) remain archived in `_data/CST205/` and are strictly excluded from topic weighting and scope calibration.  
> **Execution order:** **#4 priority** in the recommended `15 → 13 → 16 → 14 → 12` sequence (fully independent — may execute in any order).

> **Inherited decisions — read before planning.** `docs/DECISIONS.md`
> §"Phase 13 accepted, and the decisions Phases 14–17 must inherit" records what
> is already settled and must not be re-asked: word budgets are **waived**
> (owner: *"No problem over budget"*), calibrate to the 2023–2026 window only,
> an anchor plan is a planning number rather than a target, maps live in
> `assets/data/` and never `_data/<subject>/`, `_data/`/`_quiz-data/` are
> byte-frozen in Mode A, videos are verified plain `<a>` links, and there are
> seven repeating defects (prose hygiene, vacuous routing criteria, layout bugs
> invisible to tests, …) with how to prevent each. Phase 13 closed at 157/157
> unittest and 13/13 gates; use its `record.md` as the pattern.

---

## 1. Goal & 2023–2026 Exam-Weight Baseline

Calibrate all four Data Structures unit pages (`subjects/CST205/units/unit-{1..4}.html`) to the real 2023–2026 WBSCTE mark split, pair every formal textbook algorithm with runnable `gcc -std=c99` C code, inline SVG node/pointer/tree/graph diagrams, and row-by-row dry-run tables, embed live-verified plain-`<a>` YouTube links, and reach `106 / 106` clean PYQ `.unit-topic-link` resolution:

| Unit | Official Title (`syllabus.json`, p. 7) | Hrs | Stored PYQ Tag (Q / m)* | True 2023–2026 Weight | Share | Avg / Paper | MCQ + Long | Papers | Current Words → Target | Unit Blueprint |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Unit 1** | Introduction to Data Structures | 3h | 35 Q / 129m | **40m** | **9.9%** | 10.0m | 12m + 28m | 4/4 | 3,485w → ~3,400–3,900w | [`unit-1/README.md`](unit-1/README.md) |
| **Unit 2** | Stacks, Queues and Recursion | 12h | 20 Q / 93m | **143m** | **35.5%** | 35.8m | 30m + 113m | 4/4 | 6,239w → ~7,400–8,200w | [`unit-2/README.md`](unit-2/README.md) |
| **Unit 3** | Linked Lists | 15h | 38 Q / 128m | **75m** | **18.6%** | 18.8m | 21m + 54m | 4/4 | 7,858w → ~6,400–7,000w | [`unit-3/README.md`](unit-3/README.md) |
| **Unit 4** | Trees and Graphs | 15h | 13 Q / 53m | **145m** | **36.0%** | 36.2m | 52m + 93m | 4/4 | 9,069w → ~8,200–9,000w | [`unit-4/README.md`](unit-4/README.md) |
| **Total** | **4 Official Units** | **45h** | **106 Q / 403m** | **403m** | **100.0%** | **100.8m** | **115m + 288m** | **4/4** | **26,651w → ~25.4–28.1kw** | **4 unit folders** |

*\*Stored-unit shift across `_data/CST205/`:* Earlier paper tags placed many Stack/Queue items in `unit: 1`, Linked Lists in `unit: 2`, and Trees in `unit: 3` (with Graphs in `unit: 4`), resulting in:
- **40 same-unit hits (`37.7%`)**
- **55 cross-unit redirects (`51.9%`)** — including wrong-unit redirect `P005-Q12` (`Binary trees / array representation` → `U2#stacks-array-representation-of-stack`) and coarse section hits (`Doubly linked lists` → `U3#introduction`, `AVL / B-trees` → `U4#trees`)
- **11 unmatched questions (`10.4%`)** (`P003-Q5,Q6,Q15,Q24,Q27,Q28,Q34`, `P004-Q1,Q7,Q19`, `P006-Q24`)

### Key 2023–2026 Calibration Findings
1. **Twin 36% pillars carry 71.5% (`288 / 403m`) of the entire DS exam:**
   - **Unit 4 Trees & Graphs (`145m = 36.0%`)** — #1 in DS (`52m` MCQs + `93m` Group B).
   - **Unit 2 Stacks, Queues & Recursion (`143m = 35.5%`)** — #1 in Group B long-answer weight across the **entire 5-subject repository** (`113m`, ~3–4 full 8m questions per paper!), yet currently `1,619w` shorter than `18.6%`-weight Unit 3 (`7,858w`).
2. **Queues alone (`59m = 14.6%`, `4/4` papers) are the #1 topic cluster across all 5 subjects:** circular queues (`CQINSERT`/`CQDELETE` + vs linear), linear queue insert/delete + 6-step `front`/`rear` array trace (`P004-Q22`), input/output-restricted deque (`P003-Q24,Q28b`, `P006-Q17b`), and priority queue (`P004-Q17a`).
3. **Unit 3 Linked Lists (`75m = 18.6%`) needs signal sharpening (`7,858w → ~6,400–7,000w`):** SLL insert-at-beginning appeared in `3/4` papers, DLL vs SLL & CLL diagram/uses in `4/4`, Array vs LL in `3/4`, and Header LL + polynomial lists in `3/4` — while `#circular-doubly` (`400w`, verbose code) scored `0m` (**Tier S**).
4. **Zero overlap bloat with Algorithms (`CST209`):** Sorting (`0m`), MST (`0m`), shortest paths (`0m`), Huffman coding (`0m`), and sparse matrices (`0m`) never appeared once in `2023–2026` DS papers — keep them out of DS theory notes (with 1-line cross-links to Algorithms Units 2 & 4 and `CST215` lab Areas 7–8).
5. **Only three compact, verified Tier E extensions (`21m = 5.2%`):**
   - Header linked list & polynomial representation (`11m`, 3/4 papers: `P003-Q29a`, `P004-Q20a,b` bivariate `7x³y² − 8x²y + 3xy + 11x + 4`, `P006-Q20b` `3x³ + 2x² + 5x + 2`) → badged **Tier E** subsection in U3 `#applications`.
   - 1D/2D array indexing & row/column-major address formula (`7m`, 3/4 papers: `P003-Q5,Q6,Q15`, `P004-Q1`, `P005-Q16d` `8×3` matrix) → badged **Tier E** subsection in U1.
   - Threaded binary tree (`3m`, 1/4 papers: `P003-Q7,Q34a.ii`) → badged **Tier E** callout in U4 `#binary-trees`.
6. **Zero inline diagrams (`0` SVGs across all 4 units):** Visual structure diagrams (circular queue ring, SLL/DLL/CLL/polynomial pointers, tree reconstruction, AVL LL/RR/LR/RL rotations, order-3 B-tree split, `K_5` & BFS/DFS) are critical for DS exam marks.
7. **Recommended intra-phase priority order:** **Unit 4 (36.0%) → Unit 2 (35.5%) → Unit 3 (18.6%) → Unit 1 (9.9%)**.

---

## 2. Weight-Tier System Applied Across Units 1–4

| Tier | 2023–2026 Threshold | Depth & Practice Budget | Data Structures Topic Clusters |
| :--- | :--- | :--- | :--- |
| **Tier A — Core Heavyweight** | `>= 20m` (`>= 5.0%`) | Inline SVG, textbook pseudocode + `gcc`-verified C, full trace table, comparison table, heavy MCQ + 8m practice | U2 Queues (`59m`), U2 Stacks `PUSH`/`POP`/LIFO (`36m`), U4 Graphs & BFS/DFS (`35m`), U4 BT properties/`n0=n2+1`/Catalan/rep (`32m`), U4 Traversals & In+Pre/Post reconstruction (`32m`), U1 Classification/terminology/ops (`29m`), U2 Infix↔prefix/postfix & evaluation (`26m`), U3 Singly LL (`26m`), U2 Recursion/GCD/Hanoi (`22m`), U3 Circular & doubly LL (`22m`) |
| **Tier B — Regular** | `10–19m` (`2.5–4.9%`) | SVG diagram, rules/algorithm, step-by-step construction trace, 2–3 MCQs + 1–2 worked 8m | U4 B-trees of order `m` (`17m`), U4 AVL balance factor, 4 rotations & insert (`14m`), U3 Array vs linked list (`12m`), U4 Binary Search Trees (`12m`) |
| **Tier C — Low-Weight** | `1–9m` (`< 2.5%`) | Crisp model note + C struct/example + 1–2 questions | U1 Abstract Data Type (`4m`), U3 Linked stack & linked queue (`4m`) |
| **Tier S — Syllabus-Only (`0m`)** | In PDF p. 7, `0m` in `P003–P006` | Compact ~150–200w overview + complexity table row | U2 Round-Robin queue note; U3 Circular doubly LL; U4 BST 3-case deletion |
| **Tier E — Exam Extension** | Tested in `P003–P006`, outside unit list | Explicitly badged exam subsection/callout with exact worked examples | U3 Header LL & univariate/bivariate polynomials (`11m`), U1 Array row/column-major address (`7m`), U4 Threaded binary tree (`3m`) |

---

## 3. Live Shipped-Asset Inventory (`CST205` + `CST215`)

| Asset | Current State on Disk | Phase 14 Action |
| :--- | :--- | :--- |
| `subjects/CST205/units/unit-{1..4}.html` | `26,651w` (`3,485 + 6,239 + 7,858 + 9,069`), `140` `<pre>`, `52` `<table>`, `0` `<svg>`, `81` `<h3 id>`s, `0` YouTube links, `0` leaks | Rebalance to `~25.4–28.1kw` (boosting U2, tightening U3), add `11` SVGs, `13` verified plain-`<a>` YouTube links, and `13` Mode A `<h3 id>` anchors |
| `docs/suggestions/guides.json` (`CST205`) | `8` locked reading anchors (`classification`, `terminology-5-abstract-data-type-adt`, `stacks-operations-on-stack`, `queues-types-of-queues`, `singly-insertion-operations`, `comparisons-all-four-types-of-linked-lists`, `traversals`, `graph-traversals`) | Preserve 8/8 + all `81` existing `<h3 id>`s unchanged |
| `docs/revision-sheets/CST205.json` | `8` entries across all 4 units (`U1:1, U2:4, U3:1, U4:2`) | Keep in sync with unit anchors; verify `revision/CST205.html` |
| `subjects/CST215/index.html` | Paired Data Structures Lab page (`60h`, 9 practical areas, PDF p. 19) | Cross-link matching areas from Units 1–4 `#practice` |
| `_data/CST205/*.json` & `_quiz-data/CST205/*.json` | `6` PYQ files (`194` total Qs; `106` in `P003–P006`), `4` quiz files (`248` MCQs) | **Read-only in Mode A** (`SYLLABUS_UNITS.CST205 = 4` unchanged; `check_pyq_integrity.py` = `0` drift) |

---

## 4. Scope In, Scope Out & Reuse Scan

### In Scope (when Phase 14 executes)
- Upgrading `subjects/CST205/units/unit-{1..4}.html` per [`unit-1/README.md`](unit-1/README.md)–[`unit-4/README.md`](unit-4/README.md).
- Preserving all **8 locked `guides.json` anchors**, all **54 existing `<section id>`s** (`12+12+15+15`), and all **81 existing `<h3 id>`s** (`17+16+24+24`).
- Adding **13 precision `<h3 id>` anchors** so **106 / 106** `2023–2026` DS PYQs resolve cleanly under Mode A (eliminating all `11` misses plus wrong-unit collision `P005-Q12`).
- Compiling every C implementation with `gcc -std=c99 -Wall -Wextra` and script-verifying every expression, queue, tree-reconstruction, AVL, B-tree, and BFS/DFS trace.
- Adding **13 live-verified plain-`<a>` YouTube links** (`2+4+3+4`), cross-linking `subjects/CST215/index.html`, and passing every `README.md:161–215` gate.

### Out of Scope
- Adding sorting, MST, shortest-path, Huffman, or sparse-matrix chapters to DS units.
- Modifying `_data/CST205/*.json`, `_quiz-data/CST205/*.json`, or `docs/data/validation-exceptions.json` without explicit Mode B owner approval.
- Adding `<iframe>` embeds, `i.ytimg.com` thumbnails, new CSS/JS bundles, reopening Phases 1–10, or deploying.

### Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js` (`SYLLABUS_UNITS.CST205 = 4`).
- **ADAPT:** Existing rich `<h3 id>` anchor pattern across DS Units 1–4 for 100% Mode A `focusQuestionTopic()` resolution.
- **REJECT:** YouTube embeds/thumbnails, raw colour literals, and verbose multi-hundred-line circular-doubly C dumps.

---

## 5. Dependencies, Gates & Risks

| Area | Constraint / Gate | Mitigation |
| :--- | :--- | :--- |
| **Dependencies** | Closed Phases 0–10 + `guides.json` (Phase 11) | Independent of Phases 12–13, 15–16 |
| **Indexing conventions** | WBSCTE mixes 0-based and 1-based indexing in row-major (`P005-Q16d`) and array BT (`P005-Q12`), and root-height `0` vs `1` (`P004-Q6`) | State both conventions side by side in formula boxes |
| **C & trace correctness** | Pointer bugs in SLL/DLL/BST or reversed operand order `op1 - op2` in postfix evaluation cost marks | Compile all C with `gcc -std=c99 -Wall -Wextra` and verify every dry-run programmatically |
| **Accessibility & budget** | Strict `h1 → h2 → h3`, AA contrast, CSS ≤ 340 KB, JS ≤ 350 KB | Verify via `audit_accessibility.py --fail`, `check_tokens.py --strict`, `audit_page_weight.py --budget` |
| **Discovery tests** | New `<h3 id>`s update `unitAnchored` in `tests/test_discovery.py:111` | Update exact count after `build_search_index.py`; pass `unittest` + `node tests/discovery-dom.cjs` |

---

## 6. Done Means

- [ ] All 5 parts in [`tasks.md`](tasks.md) complete with evidence recorded in [`record.md`](record.md).
- [ ] Units 1–4 match their 2023–2026 weight budgets (`U4 ≈ U2 > U3 > U1`), all C snippets compile cleanly, and all worked traces are script-verified.
- [ ] All 8 locked `guides.json` anchors, 54 `<section id>`s, and 81 existing `<h3 id>`s preserved (`build_suggestions.py --check` green).
- [ ] All 13 YouTube links verified live as plain external `<a>` tags and logged in `record.md`.
- [ ] `106 / 106` `2023–2026` DS PYQs route cleanly to exact syllabus concept headings with `check_pyq_integrity.py` = `0` drift.
- [ ] Full `README.md:161–215` rebuild & verification gates pass; owner verification steps + `rule.md` §7 Termux block printed; paused at owner gate.
