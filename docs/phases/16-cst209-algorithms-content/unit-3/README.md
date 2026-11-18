# CST209 Unit 3 — Searching

> **Target file:** `subjects/CST209/units/unit-3.html` (current: `5,915w` → target: **`~6,600–7,200w`**)  
> **Syllabus (`syllabus.json`, PDF p. 12):** **18 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`92 / 395` marks (`23.3%`, CO-#1 HIGHEST-WEIGHT UNIT IN ALGORITHMS)** · avg **`23.0m/paper`** · **`4/4` papers** · **`24m` MCQ + `68m` 8m-subparts** (`2021–2022` `P001` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#binary-search`, `#hashing-collision-resolution-techniques`  
> **Existing `<section id>`s to preserve (15):** `overview`, `linear-search`, `binary-search`, `bst`, `balanced`, `hashing`, `symbol-tables`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve:** all `8` (`balanced-1-avl-trees`, `balanced-2-red-black-trees`, `balanced-3-b-trees`, `hashing-hash-functions`, `hashing-collision-resolution-techniques`, `comparisons-linear-search-vs-binary-search`, `comparisons-bst-vs-avl-tree-vs-red-black-tree`, `comparisons-chaining-vs-open-addressing`; add `2` targeted `<h3 id>`s)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 12)
- **Symbol Tables & Elementary Search:** Symbol Table ADT; **Sequential (Linear) Search** and **Binary Search** (iterative & recursive, `O(log n)` analysis).
- **Binary Search Trees (BST):** Ordering invariant, Search, **Insertion**, **Deletion** (0, 1, 2 children), average vs worst-case performance.
- **Balanced Search Trees:** Significance of height balancing; **AVL Trees**, **2-3 Trees**, **Red-Black Trees**, and **B-Trees**.
- **Hash Tables:** Hash functions (division, multiplication, mid-square, folding), load factor `α`, and **Collision Resolution Techniques** (Separate Chaining; Open Addressing — Linear Probing, Quadratic Probing, Double Hashing).

---

## 2. Current Page Audit & Gaps (`subjects/CST209/units/unit-3.html`)
- **Live metrics:** `5,915` words · `6` `<pre>` blocks (fewest in Algorithms!) · `10` `<table>`s · **`0` `<svg>`s** · `8` `<h3 id>`s · `12` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#linear-search` `178w`, `#binary-search` `258w`, `#bst` `281w`, `#balanced` `638w`, `#hashing` `668w`, `#symbol-tables` `182w` (`2,205w` concept prose).
- **Specific gaps to fix:**
  1. **Highest-certainty unit in the degree:** Binary Search hit an 8m question in **`4/4` papers** (`37m`) and Hashing hit an 8m question in **`4/4` papers** (`31m`), yet `#binary-search` is only `258w`! Add both iterative and recursive pseudocode, overflow-safe `mid`, formal `T(n)=T(n/2)+c` proof, unsorted-array pitfall (`P004-Q20b`), and when Linear Search wins (`P003-Q28a`).
  2. `#bst` (`281w`) needs formal `BST-INSERT` pseudocode (`P003-Q29b`), illustrated 3-case `BST-DELETE` (`P006-Q21a`), and `#balanced` lacks the syllabus-listed **2-3 Trees** subsection alongside an explicit *"Significance & Advantages of Height Balancing"* box (`P003-Q29a`, `P006-Q21b`).
  3. Generic single-word `"Searching"` 8m PYQs (`P003-Q28`, `P006-Q20`) are currently **unmatched** (`16m` lost!).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`92m`)

| Topic Cluster | Marks | % of U3 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Binary search (iterative & recursive, `O(log n)` proof) & linear search + comparison** | **37m** | **40.2%** | **9.4%** | **4/4** | **Tier A** | `P003-Q3,Q4` (2×1m), `P003-Q28a(2m when linear),Q28b.i(4m binary algo),Q28b.ii(2m why O(log n))`; `P004-Q4` (2m), `P004-Q20a(4m recursive binary),Q20b(1m unsorted?),Q20c(3m complexity)`; `P005-Q3` (2m), `P005-Q20a(3m binary algo)`; `P006-Q9,Q10` (2×2m), `P006-Q20a(5m binary + ex),Q20b(3m linear vs binary)` |
| **Hashing: hash table/function uses & collision resolution (chaining + open addressing)** | **31m** | **33.7%** | **7.8%** | **4/4** | **Tier A** | `P003-Q14,Q19` (2×1m), `P003-Q32a(2m hashing),Q32b(6m collision resolution)`; `P004-Q10` (2m), `P004-Q21a(2m hashing),Q21b(3m uses),Q21c(3m chaining)`; `P005-Q8` (2m), `P005-Q20b(5m collision + types)`; `P006-Q22a(4m hashing + collision resolution)` |
| **Binary Search Trees (insert, delete, complexity) & significance of balanced trees** | **24m** | **26.1%** | **6.1%** | 3/4 | **Tier A** | `P003-Q29a(4m significance of height balancing),Q29b(4m BST insert pseudocode)`; `P004-Q13,Q14` (2×2m); `P006-Q11,Q12` (2×2m), `P006-Q21a(5m BST + insert & delete),Q21b(3m significance of balanced trees)` |
| **Symbol tables (dictionary ADT & implementation comparison)** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 12), 0 hits in 2023–2026 — concise ~200w section_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#linear-search` & `#binary-search` [LOCKED] — Sequential vs Binary Search (Tier A · ~34% prose)
- **Linear Search:** pseudocode, `O(1)` best / `O(n)` avg & worst, and 4 exact cases when Linear Search is preferred (unsorted input, tiny `n`, singly linked list lacking `O(1)` indexing, one-time lookup where `O(n log n)` sort overhead loses — `P003-Q28a`).
- **Binary Search:** sorted random-access requirement + concrete 5-element counter-example showing failure on an unsorted array (`P004-Q20b`), both **iterative** and **recursive** `<pre><code>` pseudocode with `mid = low + ⌊(high - low)/2⌋` (`P003-Q28b.i`, `P004-Q20a`, `P005-Q20a`, `P006-Q20a`), full `(low, mid, high, A[mid])` hit & miss trace, **`T(n) = T(n/2) + c ⇒ ⌊log_2 n⌋ + 1 = Θ(log n)`** derivation + `O(1)` vs `O(log n)` space (`P003-Q28b.ii`, `P004-Q20c`), and 7-row **Linear vs Binary Search Table** (`P006-Q20b`).

### 4.2 `#hashing` & `#hashing-collision-resolution-techniques` [LOCKED] — Hash Tables & Collisions (Tier A · ~35% prose)
- Definition, `O(1)` expected operations, real applications (compilers, caches, database indexes, dictionaries) & properties of a good hash function (`P004-Q21a,b`); 4 hash functions with numeric examples (**Division `k mod m`**, **Multiplication `⌊m(kA mod 1)⌋`**, **Mid-Square**, **Folding**); load factor `α = n / m`.
- Collision definition (`h(k_1) = h(k_2), k_1 ≠ k_2`) + **4 Collision Resolution Methods** traced on a **single shared key list** (`m = 10`) (`P003-Q32b`, `P004-Q21c`, `P005-Q20b`, `P006-Q22a`):
  1. **Separate Chaining (Open Hashing):** array of linked lists, `O(1 + α)` expected, tolerates `α > 1`.
  2. **Linear Probing:** `(h(k) + i) mod m` — cache-friendly, suffers **primary clustering**.
  3. **Quadratic Probing:** `(h(k) + i^2) mod m` — avoids primary clustering, **secondary clustering**.
  4. **Double Hashing:** `(h_1(k) + i·h_2(k)) mod m` (`h_2(k) = R - (k mod R)`) — near-uniform probing + `DELETED` tombstone note + **Chaining vs Open Addressing Table**.

### 4.3 `#bst` & `#balanced` — BST Operations & Balanced Search Trees (Tier A · ~25% prose)
- BST invariant, `BST-SEARCH`, iterative & recursive **`BST-INSERT` pseudocode** (`P003-Q29b`), 3-case **`BST-DELETE`** (leaf, 1 child, 2 children via inorder successor) with SVG (`P006-Q21a`), `O(log n)` average vs `O(n)` skewed worst case.
- Dedicated **Significance & Advantages of Height-Balanced Trees** card (`P003-Q29a`, `P006-Q21b`) + structured overviews of `#balanced-1-avl-trees` (`BF ∈ {-1,0,1}`, LL/RR/LR/RL), **2-3 Trees** (2-/3-nodes, bottom-up median split, equal leaf depth), `#balanced-2-red-black-trees` (5 invariants, `h <= 2 log_2(n+1)`), and `#balanced-3-b-trees` (order-`m` disk tree) + comparison table.

### 4.4 `#symbol-tables` (Tier S · ~6% prose) & Practice Bank
- Concise key-value ADT (`put, get, delete, contains`) + 5-row structure cost table (unordered array, sorted array, BST, AVL/RB tree, hash table); `10` MCQs, `4` short answers, and `5` worked 8m model answers.

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (3):** (1) Binary Search interval-halving & decision tree; (2) Separate Chaining vs Linear/Quadratic/Double Hashing on one key sequence (`m=10`); (3) BST 3-case deletion + skewed `O(n)` vs AVL/2-3 balanced `O(log n)` height comparison.
- [ ] **Pseudocode & traces (5):** Linear Search; Iterative & Recursive Binary Search; `BST-INSERT` & `BST-DELETE`; Chaining + 3 Open Addressing probe tables; `T(n)=T(n/2)+c` expansion.
- [ ] **Comparison tables (4):** Linear vs Binary Search (7 rows); Separate Chaining vs Open Addressing; BST vs AVL vs 2-3 vs Red-Black vs B-Tree; Symbol Table implementations.

---

## 6. Quiz-Bank, Revision-Sheet & Cross-Subject Links
- Link `#practice` to `_quiz-data/CST209/unit-3.json` (`40` items) and sync both Unit 3 entries in `docs/revision-sheets/CST209.json`; cross-link Data Structures (`CST205`) Unit 3 (Linear/Binary Search & Hashing) and Unit 4 (BST & AVL rotations).

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Linear vs Binary Search (Iterative, Recursive & `O(log n)` Proof) | **Tier A** (`37m`) | `#binary-search` | Clear `(low, mid, high)` trace + recurrence solution; 12–22 min; verify live |
| **2** | Hashing, Hash Functions & Collision Resolution (Chaining, Linear/Quad, Double) | **Tier A** (`31m`) | `#hashing` | Works numeric collision examples across all 4 schemes; 20–35 min; plain `<a>` |
| **3** | BST Insertion/Deletion & Balanced Search Trees (AVL, 2-3, Red-Black, B-Tree) | **Tier A** (`24m`) | `#bst` | Covers 3 deletion cases & why height balancing prevents `O(n)` skew; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

Preserve all `8` existing `<h3 id>`s and add `2` new `<h3 id>`s fixing unmatched `P003-Q28`, `P006-Q20` and tightening `P003-Q4,Q14`, `P004-Q4`:

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 3 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q28`, `P006-Q20`, `P003-Q3,Q4`, `P004-Q4,Q20`, `P005-Q3,Q20a` | 1–8m | U2/U3/U4 `Searching`, `Searching / complexity`, `Binary search` | `P003-Q28`, `P006-Q20` Unmatched; `Q4`s hit U2 | `#searching-linear-and-binary` — *Searching Algorithms and Searching Complexity: Linear and Binary Search* |
| `P003-Q14,Q19,Q32`, `P004-Q10,Q21`, `P005-Q8,Q20b` | 1–8m | U3/U4 `Hashing`, `Hashing / search`, `Hashing / collision resolution` | Same/redirect → U3 `#hashing` | `#hashing-search-and-collision-overview` — *Hashing Search, Hash Tables and Collision Resolution* (plus locked `#hashing-collision-resolution-techniques`) |
| `P003-Q29`, `P004-Q13,Q14`, `P006-Q11,Q12,Q21` | 2–8m | U3 `BST / AVL`, `Balanced trees`, `BST / balanced trees` | All same-unit (`1.0`) | Preserved `#bst`, `#balanced`, `#balanced-1-avl-trees`, `#comparisons-bst-vs-avl-tree-vs-red-black-tree` |
