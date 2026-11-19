# Phase 14 Tasks — Data Structures (5 Parts)

> **Execution order:** Weight-priority (`14.4 → 14.2 → 14.3 → 14.1 → 14.5`) or sequential (`14.1 → 14.5`).  
> **Weighting basis:** Strict **2023–2026 PYQ window** (`P003–P006`: `4` papers, `106` scan-verified Qs, `403` set marks; `2021–2022` `P001`/`P002` excluded).  
> **Standing rules:** Keep `SYLLABUS_UNITS.CST205 = 4`; preserve all `8` locked `guides.json` anchors, `54` `<section id>`s (`12+12+15+15`), and `81` existing `<h3 id>`s (`17+16+24+24`); zero sorting/MST/Huffman/sparse-matrix drift; zero raw `CST205`/`CST215`/`P00X` strings; plain `<a>` YouTube links only.

---

## Part 14.1 — Unit 1: Introduction to Data Structures (`40m / 9.9%`, 3h, PDF p. 7)
- **Target file:** `subjects/CST205/units/unit-1.html` (`3,485w → ~3,400–3,900w`) · Blueprint: [`unit-1/README.md`](unit-1/README.md)
- **Implementation checklist:**
  - [ ] Sharpen **Tier A `#classification` (~35% prose)**: inline SVG taxonomy tree + 3 exam tables (Primitive vs Non-Primitive, Linear vs Non-Linear, Static vs Dynamic).
  - [ ] Sharpen **Tier A `#operations` (~25% prose)**: all 6 syllabus operations (`Traversal, Insertion, Deletion, Searching, Sorting, Merging` + preserved `Updating`) with array-vs-linked complexity summary.
  - [ ] Sharpen **Tier A + Tier C `#terminology` (~22% prose)**: Data, Data Item (group/elementary), Entity/Attribute/Record/File, Data Type vs Data Structure table, and 2–3m ADT model note (`#terminology-5-abstract-data-type-adt`).
  - [ ] Add badged **Tier E Arrays & Address Formula subsection (`7m`, ~18% prose)**: 1D formula + 2D Row-Major vs Column-Major formulas + worked `8×3`, `w = 4B` numerical showing both 0-based and 1-based results (`P005-Q16d`).
  - [ ] Calibrate practice (`6` MCQs, `4` short, `3` worked 8m), add `#arrays-and-index-addressing`, cross-link `subjects/CST215/index.html` (Area 1), and insert `2` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locks `#classification`, `#terminology-5-abstract-data-type-adt` & all `17` existing `<h3 id>`s preserved; row/column-major math verified; 2 URLs logged in `record.md`.

---

## Part 14.2 — Unit 2: Stacks, Queues and Recursion (`143m / 35.5%`, 12h, PDF p. 7 — #1 Long-Answer Unit)
- **Target file:** `subjects/CST205/units/unit-2.html` (`6,239w → ~7,400–8,200w`) · Blueprint: [`unit-2/README.md`](unit-2/README.md)
- **Implementation checklist:**
  - [ ] Expand **Tier A + Tier S `#queues` (`59m`, 4/4 papers, ~40% prose)**: linear `INSERT`/`DELETE` + C + 6-step `front`/`rear` array trace (`A..M` showing false overflow, `P004-Q22`); inline SVG circular queue ring + `(rear+1)%MAX == front` + `CQINSERT`/`CQDELETE` + Linear vs Circular table; Input-Restricted vs Output-Restricted Deque; Priority Queue + applications; compact ~150w **Tier S** Round-Robin note.
  - [ ] Expand **Tier A `#stacks` (`36m` + `26m = 62m`, 4/4 papers, ~43% prose)**: LIFO, `top`, overflow/underflow, textbook `PUSH`/`POP` pseudocode + C, Array vs Stack & Stack vs Queue tables; full Infix→Postfix algorithm + trace, Infix→Prefix trace on `(A - D/C) * (D + E - F) → *-A/DC-+DEF`, and Postfix Evaluation trace on `5, 6, 2, +, 8, +, 4, /, − = 1`.
  - [ ] Expand **Tier A `#recursion` (`22m`, 4/4 papers, ~17% prose)**: activation-record SVG, Recursion vs Iteration table + preference guide, recursive Euclidean `gcd(a, b)`, and Tower of Hanoi `TOH(n, A, B, C)` algorithm + C + 7-move `n = 3` trace + `2^n - 1` derivation.
  - [ ] Calibrate practice (`12` MCQs, `6` short, `6` worked 8m), add `3` Mode A `<h3 id>` anchors, cross-link `subjects/CST215/index.html` (Areas 2–4), and insert `4` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locks `#stacks-operations-on-stack`, `#queues-types-of-queues` & all `16` existing `<h3 id>`s preserved; all C programs pass `gcc -std=c99 -Wall -Wextra`; all traces verified; 4 URLs logged in `record.md`.

---

## Part 14.3 — Unit 3: Linked Lists (`75m / 18.6%`, 15h, PDF p. 7 — Signal Sharpening)
- **Target file:** `subjects/CST205/units/unit-3.html` (`7,858w → ~6,400–7,000w`) · Blueprint: [`unit-3/README.md`](unit-3/README.md)
- **Implementation checklist:**
  - [ ] Sharpen **Tier B `#introduction` (`12m`, ~15% prose)**: self-referential C `struct Node`, advantages/drawbacks, and 8-row Array vs Linked List table + "when to prefer each" guide.
  - [ ] Sharpen **Tier A `#singly` (`26m`, ~34% prose)**: inline SVG pointer relinking, textbook `AVAIL`/`malloc` pseudocode + C for Insert at Beginning (`O(1)`, 3/4 papers), Insert at End (`O(n)`), Insert at Position, Delete Begin/End/Key (`free()`), Traverse, and Search.
  - [ ] Sharpen **Tier A `#circular-singly` & `#doubly` (`22m`, 4/4 papers, ~26% prose)** + trim **Tier S `#circular-doubly` (`0m`, ~5%)**: CLL ring SVG, `do...while (p != head)`, CLL vs SLL & uses; DLL `prev|data|next` SVG, DLL vs SLL advantages, insert/delete; compact CDLL invariants + `#comparisons-all-four-types-of-linked-lists`.
  - [ ] Build **Tier E + Tier C `#applications` (`11m` + `4m = 15m`, ~20% prose)**: badged Header LL (grounded vs circular + dummy-header benefit), badged Polynomial LL drawing both `3x³ + 2x² + 5x + 2` and bivariate `7x³y² − 8x²y + 3xy + 11x + 4`, plus concise Linked Stack & Linked Queue.
  - [ ] Calibrate practice (`8` MCQs, `5` short, `5` worked 8m), add `3` Mode A `<h3 id>` anchors, cross-link `subjects/CST215/index.html` (Area 5), and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locks `#singly-insertion-operations`, `#comparisons-all-four-types-of-linked-lists` & all `24` existing `<h3 id>`s preserved; word count in `~6,400–7,000w`; C code passes `gcc -std=c99 -Wall -Wextra`; 3 URLs logged in `record.md`.

---

## Part 14.4 — Unit 4: Trees and Graphs (`145m / 36.0%`, 15h, PDF p. 7 — #1 DS Unit)
- **Target file:** `subjects/CST205/units/unit-4.html` (`9,069w → ~8,200–9,000w`) · Blueprint: [`unit-4/README.md`](unit-4/README.md)
- **Implementation checklist:**
  - [ ] Upgrade **Tier A + Tier E `#trees` & `#binary-trees` (`32m` + `3m`, ~23% prose)**: terminology, level/height max-node formulas (stating 0-based & 1-based conventions), `n_0 = n_2 + 1` proof, Catalan `C_4 = 14` 4-node BT SVG, array (`2i`/`2i+1` and `2i+1`/`2i+2`) vs linked representation + preference, and badged ~160w **Tier E Threaded Binary Tree** callout.
  - [ ] Upgrade **Tier A `#traversals` (`32m`, ~21% prose)**: Pre/In/Post/Level-order in C + worked traces, uniqueness rule (In+Pre and In+Post unique; Pre+Post ambiguous), and full step-by-step tree reconstructions including `Pre: A B D I E J C F G K` + `In: D I B E J A F C K G`.
  - [ ] Upgrade **Tier B `#tree-types` (`17m` B-tree + `14m` AVL + `12m` BST = `43m`, ~32% prose)**: Full/Complete/Perfect/Skewed table; BST search/insert + trace on `10,25,2,4,7,13,11,22` + compact **Tier S** 3-case delete; AVL `BF ∈ {-1,0,+1}` + inline SVG LL/RR/LR/RL rotations + both numeric (`54,2345,6172,5918,1077,3422,44`) and month-name insertions; Knuth order-`m` B-tree 5 properties + why disk-friendly + full order-3 B-tree split trace.
  - [ ] Upgrade **Tier A `#graphs` & `#graph-traversals` (`35m`, 4/4 papers, ~24% prose)**: terminology, `K_5` (10 edges) SVG, Adjacency Matrix vs Adjacency List worked comparison, BFS (queue) & DFS (stack) algorithms + C + traces + `O(V+E)` vs `O(V^2)` analysis + 7-row BFS vs DFS table.
  - [ ] Calibrate practice (`14` MCQs, `6` short, `6` worked 8m), add `6` Mode A `<h3 id>` anchors (fixing `P005-Q12` collision too), cross-link `subjects/CST215/index.html` (Areas 6 & 9; note Areas 7–8 link to Algorithms), and insert `4` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locks `#traversals`, `#graph-traversals` & all `24` existing `<h3 id>`s preserved; every BST/AVL/B-tree/reconstruction/BFS/DFS trace script-verified; C compiles cleanly; 4 URLs logged in `record.md`.

---

## Part 14.5 — PYQ ↔ Unit Sync, Topic Map, Canonical Rebuild & Gate Verification

> **Topic map required.** Follow [`docs/phases/topic-map-standard.md`](../topic-map-standard.md)
> — the Phase 12 CST201 map is the worked example. Because this phase rewrites the
> unit pages, author the map **last**, after the `<h3 id>` anchors exist.
- **Target files:** `subjects/CST205/units/unit-{1..4}.html`, `docs/revision-sheets/CST205.json` (if needed), `tests/test_discovery.py`, generated indices, `record.md`, `docs/ROADMAP.md`, `docs/STATUS.md`, `prompt.md`.
- **Verification & rebuild checklist:**
  - [ ] Run `focusQuestionTopic()` simulation across all **106 `2023–2026` DS PYQs**: verify `0` unmatched (down from `11`), `0` wrong-unit collisions (`P005-Q12` lands on `U4#binary-trees-array-and-linked-representation`), and `check_pyq_integrity.py` = `0` drift.
  - [ ] Verify `SYLLABUS_UNITS.CST205 = 4`, zero raw `CST205`/`CST215`/`P00\d`, zero `<iframe>`/`ytimg`, and zero sorting/MST/Huffman drift.
  - [ ] Author `assets/data/topic-map-CST205.json` per the standard: every question in the `P00[3-6]` window mapped, zero raw paper-section anchors, every anchor verified present in its unit page, and `tests/test_topic_map.py` repointed at this subject passing. Record before/after generic-landing counts in `record.md` (baseline: 0 of 194 questions land on a generic card, so measure specificity by anchor choice instead).
  - [ ] Execute `README.md:187–215` canonical rebuild (`generate_presence.py` twice, `build_data_version.py` last), update `unitAnchored` in `tests/test_discovery.py:111`, and pass all 13 Python gates + `unittest` + `node tests/discovery-dom.cjs`.
  - [ ] Write `record.md`, update `docs/ROADMAP.md`, `docs/STATUS.md`, `prompt.md`, print **"What to test on the website"** + `rule.md` §7 Termux preview command, and pause for owner sign-off.
- **Acceptance & evidence:**
  - [ ] All static, accessibility, token, page-weight, syllabus, integrity, Python, and Node gates pass with zero regressions.
