# CST205 Unit 1 — Introduction to Data Structures

> **Target file:** `subjects/CST205/units/unit-1.html` (current: `3,485w` → target: **`~3,400–3,900w`**)  
> **Syllabus (`syllabus.json`, PDF p. 7):** **3 contact hours** (of `45h`, `3` credits, L–T–P `2-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`40 / 403` marks (`9.9%`, #4 in DS)** · avg **`10.0m/paper`** · **`4/4` papers** · **`12m` MCQ + `28m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#classification`, `#terminology-5-abstract-data-type-adt`  
> **Existing `<section id>`s to preserve (12):** `overview`, `terminology`, `classification`, `operations`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (17):** `terminology-1-data`..`terminology-5-abstract-data-type-adt`, `classification-1-primitive-data-structures`, `classification-2-non-primitive-data-structures`, `operations-1-traversal`..`operations-7-updating`, `comparisons-primitive-vs-non-primitive-data-structures`, `comparisons-linear-vs-non-linear-data-structures`, `comparisons-adt-vs-data-structure`

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 7)
- **Basic Terminology:** Elementary data organization — Data, Data Item, Group Item, Elementary Item, Entity, Entity Set, Attribute/Field, Record, File, and Abstract Data Type (ADT).
- **Classification of Data Structures:** Primitive (`int`, `float`, `char`, `pointer`) vs Non-Primitive; Linear (Array, Stack, Queue, Linked List) vs Non-Linear (Tree, Graph); Static vs Dynamic note.
- **Data Structure Operations:** Traversing, Inserting, Deleting, Searching, Sorting, and Merging *(plus preserved Updating)*.

> **Syllabus-Boundary Note:** 1D/2D array indexing and row-major / column-major address calculation (`7m` across `3/4` papers: `P003-Q5,Q6,Q15`, `P004-Q1`, `P005-Q16d`) are covered via a compact, explicitly badged **Tier E** subsection. Sparse matrices scored `0m` and are outside PDF p. 7 — do not add.

---

## 2. Current Page Audit & Gaps (`subjects/CST205/units/unit-1.html`)
- **Live metrics:** `3,485` words (already well sized!) · `6` `<pre>` blocks · `9` `<table>`s · `0` `<svg>`s · `17` `<h3 id>`s · `6` MCQs · `6` short Qs · `4` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#terminology` `509w`, `#classification` `368w`, `#operations` `506w` (`1,383w` concept prose).
- **Specific gaps to fix:**
  1. Missing the **1D/2D array indexing & row-major / column-major address calculation** formula + `8 × 3` (`w = 4B`) worked problem (`P005-Q16d`), which also leaves **4 Unit 1 MCQs unmatched** (`P003-Q5,Q6,Q15`, `P004-Q1`).
  2. Missing an explicit **Data Type vs Data Structure** comparison table (`P003-Q26c`).
  3. Zero diagrams (`0` SVGs) — add a clean taxonomy hierarchy tree + row-major vs column-major memory strip.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`40m`)

| Topic Cluster | Marks | % of U1 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **DS definition, primitive vs non-primitive, linear vs non-linear, data type vs DS & operations** | **29m** | **72.5%** | **7.2%** | 3/4 | **Tier A** | `P003-Q2,Q20,Q22` (3×1m), `P003-Q26a(3m prim vs non-prim),Q26b(3m linear vs non-linear),Q26c(2m data type vs DS)`; `P005-Q16a(2m define DS),Q16b(2m prim vs non-prim),Q16c(2m linear vs non-linear)`; `P006-Q1,Q5` (2×2m), `P006-Q16a(5m define DS + ops),Q16b(3m linear vs non-linear)` |
| **1D & 2D array indexing & row/column-major address formula** | **7m** | 17.5% | 1.7% | 3/4 | **Tier E** | `P003-Q5,Q6,Q15` (3×1m array contiguous/index); `P004-Q1` (2m array index/address); `P005-Q16d(2m 8×3 matrix, 4B element, row-major address)` |
| **Abstract Data Type (ADT) concept & examples** | **4m** | 10.0% | 1.0% | 2/4 | **Tier C** | `P003-Q34a.i(2m short note on ADT)`; `P005-Q17a(2m define ADT w/ suitable example)` |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#classification` [LOCKED] — DS Taxonomy & Core Comparisons (Tier A · ~35% prose)
- Accessible inline SVG classification hierarchy: `Data Structure → Primitive (int, float, char, pointer) | Non-Primitive → Linear (Array [static], Linked List / Stack / Queue [dynamic]) | Non-Linear (Tree, Graph)`.
- Three guaranteed-marks comparison tables:
  1. **Primitive vs Non-Primitive Data Structures** (`P003-Q26a`, `P005-Q16b`).
  2. **Linear vs Non-Linear Data Structures** — element relationships, single-level vs multi-level, single-run traversal, memory utilization, implementation complexity, examples (`P003-Q26b`, `P005-Q16c`, `P006-Q16b`).
  3. **Static (Array) vs Dynamic (Linked) Structures**.

### 4.2 `#operations` — Fundamental Operations & Cost Overview (Tier A · ~25% prose)
- Preserve `#operations-1-traversal` through `#operations-7-updating`: crisp definition, illustrative example, and Big-O comparison across unsorted array, sorted array, and singly linked list (`P003-Q20`, `P006-Q16a`).

### 4.3 `#terminology` & `#terminology-5-abstract-data-type-adt` [LOCKED] (Tier A + Tier C · ~22% prose)
- Preserve `#terminology-1-data`..`#terminology-5-abstract-data-type-adt`: student-record example distinguishing elementary item (`RollNo`) vs group item (`Name = First + Last`), Field → Record → File hierarchy, **Data Type vs Data Structure** table (`P003-Q26c`), and a crisp 2–3 mark **ADT** model note (`Stack` / `Queue` logical contract decoupled from array/pointer representation — `P003-Q34a.i`, `P005-Q17a`).

### 4.4 Badged Tier E Subsection — Array Indexing & Row/Column-Major Address (`7m` · ~18% prose)
- Contiguous storage, length `UB - LB + 1`, 1D formula `LOC(A[i]) = Base + w * (i - LB)` (`P003-Q5,Q6,Q15`, `P004-Q1`).
- 2D `m × n` matrix formulas:
  - **Row-Major (used by C):** `LOC(A[i][j]) = Base + w * [(i - L_r) * n + (j - L_c)]`.
  - **Column-Major (Fortran/MATLAB):** `LOC(A[i][j]) = Base + w * [(j - L_c) * m + (i - L_r)]`.
- Worked `8 × 3` matrix (`w = 4` bytes) numerical showing **both 0-based (`L_r = L_c = 0`) and 1-based (`L_r = L_c = 1`)** step-by-step solutions (`P005-Q16d`).

### 4.5 Practice & Revision Bank
- `6` MCQs, `4` short answers, and `3` complete 8m opening-question model answers (`P003-Q26`, `P005-Q16`, `P006-Q16`).

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVG (1):** Complete Data Structures Classification Tree (`Primitive` vs `Non-Primitive → Linear / Non-Linear`).
- [ ] **Code & worked numericals (3):** C 1D array insert & delete snippet (lab Area 1 tie-in); Stack ADT interface illustration; worked 1D & `8×3` 2D row-major/column-major numericals.
- [ ] **Comparison tables (4):** Primitive vs Non-Primitive; Linear vs Non-Linear; Data Type vs Data Structure vs ADT; Row-Major vs Column-Major.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST215/index.html`, PDF p. 19)

| `CST215` Practical Area | Unit 1 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 1:** Array operations — insertion and deletion | `#operations-2-insertion`, `#operations-3-deletion`, `#arrays-and-index-addressing` | Link from `#operations` & `#practice` for 1D array shift-insert and shift-delete lab implementation |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Data Structures Classification (Primitive/Non-Primitive, Linear/Non-Linear), Operations & ADT | **Tier A** (`33m`) | `#classification` | Concise visual taxonomy + ADT explanation; 12–22 min; verify HTTP 200 & active video |
| **2** | 1D & 2D Array Row-Major and Column-Major Address Calculation (0-Based & 1-Based) | **Tier E** (`7m`, 3/4) | `#formulas` | Works both 0-based and 1-based exam numericals step by step; 10–20 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 1 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q5,Q6,Q15`, `P004-Q1` | 1,1,1,2m | U1 `Arrays`; U1 `Arrays / index` | All 4 Unmatched | `#arrays-and-index-addressing` — *Arrays, Array Index and Row-Major / Column-Major Address Calculation* |
| `P003-Q2,Q20,Q22,Q26`, `P005-Q16`, `P006-Q1,Q5,Q16` | 1–8m | U1 `Classification` / `Operations` / `Data structures` | Same-unit → `#classification`, `#operations`, `#terminology` | Preserved locked `#classification`, `#operations`, `#terminology` (100% clean) |
| `P003-Q34` *(part a.i)*, `P005-Q17a` | 8m, 2m | U4 `ADT / threaded trees / traversal`; U1 `ADT / stacks` | `Q34` resolved in U4; `Q17` same-unit | Preserved locked `#terminology-5-abstract-data-type-adt` |
