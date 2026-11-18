# CST209 Unit 2 — Sorting

> **Target file:** `subjects/CST209/units/unit-2.html` (current: `6,248w` → target: **`~6,200–6,800w`**)  
> **Syllabus (`syllabus.json`, PDF p. 12):** **16 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`79 / 395` marks (`20.0%`, #4 in Algorithms)** · avg **`19.8m/paper`** · **`4/4` papers** · **`23m` MCQ + `56m` 8m-subparts** (`2021–2022` `P001` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#elementary`, `#efficient`  
> **Existing `<section id>`s to preserve (14):** `overview`, `sorting-problem`, `elementary`, `efficient`, `linear`, `complexity-analysis`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve:** all `13` (`elementary-1-bubble-sort`..`elementary-4-shell-sort`, `efficient-1-merge-sort`..`efficient-3-heap-sort`, `linear-1-count-sort-counting-sort`..`linear-3-bucket-sort`, `comparisons-merge-sort-vs-quick-sort-vs-heap-sort`, `comparisons-bubble-vs-selection-vs-insertion`, `comparisons-comparison-vs-non-comparison-sorts`; add `2` targeted `<h3 id>`s)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 12)
- **The Sorting Problem:** Stability, in-place vs out-of-place, adaptive vs non-adaptive, internal vs external, comparison vs non-comparison (`Ω(n log n)` decision-tree bound).
- **Elementary Comparison Sorts (`O(n^2)`):** **Bubble Sort**, **Selection Sort**, **Insertion Sort**, and **Shell Sort**.
- **Efficient Sorts (`O(n log n)`):** **Merge Sort** (divide & conquer), **Quick Sort** (partition divide & conquer), and **Heap Sort** (`MAX-HEAPIFY`, `BUILD-MAX-HEAP`).
- **Sorting in Linear Time:** **Count Sort (Counting Sort)**, **Radix Sort**, and **Bucket Sort**; complete time, space, and stability analysis.

---

## 2. Current Page Audit & Gaps (`subjects/CST209/units/unit-2.html`)
- **Live metrics:** `6,248` words · `10` `<pre>` blocks · `6` `<table>`s · **`0` `<svg>`s** · `13` `<h3 id>`s · `15` MCQs · `10` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#sorting-problem` `165w`, `#elementary` `691w`, `#efficient` `620w`, `#linear` `574w`, `#complexity-analysis` `186w` (`2,236w` concept prose vs `3,392w` practice bank).
- **Specific gaps to fix:**
  1. Shift ~700w from oversized MCQ/short padding into `#efficient`, `#elementary`, and `#linear` so all **three exact multi-pass 2023–2026 exam traces** fit cleanly: Quick Sort on `12` keys (`P005-Q19a`), Bubble Sort on `8` keys (`P006-Q18b`), and 3-pass LSD Radix Sort on `9` keys (`P006-Q19b`).
  2. Add explicit **significance & limitations of linear-time sorting** (`P004-Q19a,b`) and tight **`BUILD-MAX-HEAP` `O(n)`** explanation (`P005-Q14`), while keeping `0m` **Tier S** Shell Sort and standalone Counting Sort concise (~180–200w each).
  3. Close the `2` unmatched Unit 2 MCQs (`P003-Q16` `Sorting / best case`, `P005-Q14` `Heaps`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`79m`)

| Topic Cluster | Marks | % of U2 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Efficient `O(n log n)` sorts: Quick Sort, Merge Sort & Heap Sort (`BUILD-MAX-HEAP`)** | **32m** | **40.5%** | **8.1%** | **4/4** | **Tier A** | `P003-Q20` (1m), `P003-Q31(8m Merge Sort w/ ex)`; `P004-Q2` (2m); `P005-Q4,Q12,Q14` (3×2m), `P005-Q19a(4m Quick Sort on 38,81,22,48,13,69,93,14,45,58,79,72),Q19b(4m Quick Sort best & worst case)`; `P006-Q5,Q7` (2×2m), `P006-Q19a(3m Merge vs Quick vs Heap time & space)` |
| **Elementary `O(n^2)` sorts: Selection Sort, Bubble Sort & Insertion Sort** | **30m** | **38.0%** | **7.6%** | **4/4** | **Tier A** | `P003-Q8,Q13,Q16,Q17` (4×1m); `P004-Q17a(3m Selection algo),Q17b(3m trace),Q17c(2m worst-case)`; `P005-Q18a(4m Selection w/ ex),Q18b(4m Bubble vs Selection vs Insertion)`; `P006-Q8` (2m), `P006-Q18a(4m Bubble algo),Q18b(4m trace on 25,57,48,37,12,92,86,33)` |
| **Linear-time non-comparison sorts: significance/limits, Bucket Sort & Radix Sort** | **17m** | 21.5% | 4.3% | 3/4 | **Tier B** | `P004-Q19a(2m significance),Q19b(2m limitations),Q19c(4m Bucket Sort w/ ex)`; `P005-Q7` (2m); `P006-Q6` (2m), `P006-Q19b(5m Radix Sort on 347,142,361,423,538,126,320,549,365)` |
| **Shell Sort & standalone Counting Sort** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 12), 0 direct marks in 2023–2026 — crisp ~180–200w sections_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#efficient` [LOCKED] — Merge Sort, Quick Sort & Heap Sort (Tier A · ~38% prose)
- **`#efficient-1-merge-sort` (`P003-Q31`, `P006-Q7`):** `MERGE-SORT` + `MERGE` pseudocode, split-and-merge tree SVG, `T(n) = 2T(n/2) + Θ(n) = Θ(n log n)` across best/avg/worst, `O(n)` auxiliary array, stable.
- **`#efficient-2-quick-sort` (`P003-Q20`, `P005-Q12,Q19`):** `QUICKSORT` + `PARTITION` pseudocode, **complete Python-verified partition trace on `38, 81, 22, 48, 13, 69, 93, 14, 45, 58, 79, 72`**, explicit **best case** `T(n) = 2T(n/2) + Θ(n) = O(n log n)` (balanced split) vs **worst case** `T(n) = T(n-1) + Θ(n) = O(n^2)` (sorted/reverse input or extreme pivot), `O(log n)` avg / `O(n)` worst stack, in-place, unstable.
- **`#efficient-3-heap-sort` (`P005-Q14`):** array max-heap indices (`2i`, `2i+1`), `MAX-HEAPIFY` `O(log n)`, **`BUILD-MAX-HEAP` tight `O(n)` bottom-up construction**, repeated root extraction `O(n log n)` worst case, `O(1)` extra space, unstable; plus preserved `#comparisons-merge-sort-vs-quick-sort-vs-heap-sort` (`P006-Q19a`).

### 4.2 `#elementary` [LOCKED] — Selection, Bubble, Insertion & Tier S Shell (Tier A + Tier S · ~34% prose)
- **`#elementary-2-selection-sort` (`P003-Q13`, `P004-Q17`, `P005-Q18a`, `P006-Q8`):** pseudocode, pass trace, arithmetic sum `n(n-1)/2 = Θ(n^2)` in all 3 cases, at most `n - 1 = O(n)` swaps, unstable.
- **`#elementary-1-bubble-sort` (`P003-Q17`, `P006-Q18`):** standard + swapped-flag early-exit pseudocode (`O(n)` best / `O(n^2)` avg & worst), **complete pass-by-pass trace on `25, 57, 48, 37, 12, 92, 86, 33`**, stable.
- **`#elementary-3-insertion-sort` (`P003-Q8,Q16`):** shift-insert pseudocode, sorted-prefix trace, adaptive `O(n)` best case on sorted/nearly sorted input, `O(n^2)` worst, online, stable.
- **`#elementary-4-shell-sort` (Tier S · ~180w):** diminishing-gap (`n/2, n/4, ..., 1`) insertion sort + 6-item gap trace; preserved `#comparisons-bubble-vs-selection-vs-insertion` (`P005-Q18b`).

### 4.3 `#linear`, `#sorting-problem` & `#complexity-analysis` (Tier B + Tier S · ~28% prose)
- **Significance & Limitations of Linear-Time Sorting** (`P004-Q19a,b`, `P006-Q6`): bypassing `Ω(n log n)` via key range/digits/distribution vs bounded-integer/uniform-distribution constraints and extra `O(n + k)` space.
- **`#linear-1-count-sort-counting-sort` (Tier S · ~200w):** frequency + prefix-sum + reverse stable placement in `Θ(n + k)` (Radix Sort's per-digit engine).
- **`#linear-2-radix-sort` (`P005-Q7`, `P006-Q19b`):** LSD pseudocode, why the subroutine must be stable, `Θ(d(n + k))` time, and the **complete 3-pass (1s → 10s → 100s) trace on `347, 142, 361, 423, 538, 126, 320, 549, 365` → `126, 142, 320, 347, 361, 365, 423, 538, 549`**.
- **`#linear-3-bucket-sort` (`P004-Q19c`):** `n` buckets over `[0, 1)`, per-bucket insertion sort, concatenate, `O(n)` expected / `O(n^2)` clustered worst case, 8-value bucket SVG.
- **Master 9-Algorithm Complexity, Space, Stability & In-Place Table** in `#complexity-analysis`.

### 4.4 Practice & Revision Bank
- `10` MCQs, `4` short answers, and `5` worked 8m model answers mirroring every 2023–2026 Unit 2 long question.

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (3):** (1) Merge Sort divide-and-merge recursion tree; (2) Quick Sort partition recursion tree on the 12 exam keys + `BUILD-MAX-HEAP` tree; (3) LSD Radix 3-pass & Bucket Sort scatter-gather diagram.
- [ ] **Python-verified trace tables (5):** Quick Sort (`12` keys); Bubble Sort (`8` keys); Selection Sort (`6` keys); LSD Radix Sort (`9` keys, 3 passes); Bucket Sort (`8` floats).
- [ ] **Comparison tables (4):** Master 9-Sort table; Merge vs Quick vs Heap; Bubble vs Selection vs Insertion; Comparison vs Non-Comparison sorts.

---

## 6. Quiz-Bank, Revision-Sheet & Cross-Subject Links
- Link `#practice` to `_quiz-data/CST209/unit-2.json` (`42` items) and sync the Unit 2 card in `docs/revision-sheets/CST209.json`; cross-link Data Structures (`CST205`) Unit 3 (where sorting repeats for another `75m`!).

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Merge Sort, Quick Sort (Partition + Best/Worst) & Heap Sort (`BUILD-MAX-HEAP`) | **Tier A** (`32m`) | `#efficient` | Full partition trace, `O(n)` build-heap intuition & 3-way compare; verify live |
| **2** | Selection Sort, Bubble Sort & Insertion Sort: Traces, Stability & Swaps | **Tier A** (`30m`) | `#elementary` | Covers `O(n)` adaptive best case vs Selection's `Θ(n^2)` & `O(n)` swaps; plain `<a>` |
| **3** | Non-Comparison Linear Sorting: Counting Sort, LSD Radix Sort & Bucket Sort | **Tier B** (`17m`) | `#linear` | Walks digit-by-digit LSD Radix + `[0,1)` Bucket Sort; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

Preserve all `13` existing `<h3 id>`s (which already match `Bubble`, `Selection`, `Insertion`, `Merge`, `Quick`, `Radix`, `Bucket`, and comparison PYQs) and add `2` new `<h3 id>`s:

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 2 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P005-Q14` | 2m | U2 `Heaps` | Unmatched | `#heaps-and-build-max-heap` — *Binary Heaps, `MAX-HEAPIFY` and `BUILD-MAX-HEAP`* |
| `P003-Q16`, `P004-Q2`, `P005-Q4`, `P006-Q5` | 1–2m | U2 `Sorting / best case`, `Sorting / complexity` | `P003-Q16` Unmatched | `#sorting-best-average-and-worst-case` — *Sorting Complexity: Best Case, Average Case and Worst Case* |
| `P003-Q31`, `P005-Q19`, `P006-Q18,Q19`, `P004-Q17,Q19`, `P005-Q18` | 8m each | U2 `Merge`, `Quick`, `Bubble`, `Selection`, `Radix`, `Bucket` | Same-unit (`1.0`) | Preserved `#efficient-1..3-*`, `#elementary-1..3-*`, `#linear-2..3-*`, `#comparisons-*` |
