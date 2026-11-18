# CST205 Unit 4 — Trees and Graphs

> **Target file:** `subjects/CST205/units/unit-4.html` (current: `9,069w` → target: **`~8,200–9,000w` [high-density worked traces]**)  
> **Syllabus (`syllabus.json`, PDF p. 7):** **15 contact hours** (of `45h`, `3` credits, L–T–P `2-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`145 / 403` marks (`36.0%`, #1 HIGHEST-WEIGHT UNIT IN DATA STRUCTURES)** · avg **`36.2m/paper`** · **`4/4` papers** · **`52m` MCQ + `93m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#traversals`, `#graph-traversals`  
> **Existing `<section id>`s to preserve (14):** `overview`, `trees`, `binary-trees`, `traversals`, `tree-types`, `graphs`, `graph-traversals`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (24):** `trees-tree-terminology`, `binary-trees-*` (3), `traversals-*` (4), `tree-types-*` (7), `graphs-*` (2), `graph-traversals-*` (2), and `comparisons-*` (5)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 7)
- **Trees & Binary Trees:** Tree terminology (root, node, edge, parent, child, sibling, leaf/external vs internal, degree, level, depth, height, forest); Binary Tree properties, sequential (array) and linked memory representations, insertion and deletion; Binary Tree traversals (Pre-order, In-order, Post-order, Level-order) and reconstruction from traversals; Types — Full/Strict, Complete, Perfect, Skewed, Binary Search Tree (BST), Height-Balanced (AVL) Tree, and B-Tree of order `m`.
- **Graphs:** Graph terminology (undirected/directed, weighted, degree/in-degree/out-degree, path, cycle, connected, complete graph `K_n`); memory representations (Adjacency Matrix, Adjacency List, 2-line Incidence Matrix note); Graph Traversal Algorithms — Breadth-First Search (BFS) and Depth-First Search (DFS) with complexity.

> **Syllabus-Boundary Note:** Threaded Binary Trees scored `3m` (`P003-Q7,Q34a.ii`) — include a compact ~160w badged **Tier E** callout in `#binary-trees`. Sorting, MST, shortest paths, and Huffman coding scored `0m` in all `2023–2026` DS papers — do not pad Unit 4 with them (add a 1-line forward link to Algorithms Units 2 & 4).

---

## 2. Current Page Audit & Gaps (`subjects/CST205/units/unit-4.html`)
- **Live metrics:** `9,069` words · `30` `<pre>` blocks · `23` `<table>`s · `0` `<svg>`s · `24` `<h3 id>`s · `15` MCQs · `10` short Qs · `8` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#trees` `481w`, `#binary-trees` `836w`, `#traversals` `781w`, `#tree-types` `768w`, `#graphs` `847w`, `#graph-traversals` `784w` (`4,497w` concept prose).
- **Specific gaps to fix:**
  1. `#tree-types` holds only `768w` for **three entire high-yield exam structures (`43m`: B-tree `17m`, AVL `14m`, BST `12m`)** — needs explicit LL/RR/LR/RL rotation SVGs + step-by-step insertions (`54, 2345, 6172, 5918, 1077, 3422, 44` & month names), Knuth 5-property B-tree checklist + step-by-step order-3 B-tree median-split trace (`P005-Q24b`), and BST insertion of `10, 25, 2, 4, 7, 13, 11, 22` (`P003-Q30b`).
  2. `#binary-trees` needs the textbook algebraic proof of **`n_0 = n_2 + 1`** (`P005-Q23a`), Catalan count **`C_4 = 14`** non-similar 4-node binary trees (`P004-Q21b`), both 1-based (`2i`/`2i+1`) and 0-based array indices (`P005-Q12`), and the badged **Tier E Threaded Binary Tree** box (`P003-Q7,Q34a.ii`).
  3. `#traversals` needs full step-by-step **Inorder + Preorder / Postorder tree reconstruction** worked examples (`P003-Q30a`, `P005-Q23b`, `P006-Q22a`).
  4. **Wrong-unit redirect bug:** `P005-Q12` (`Binary trees / array representation`) redirects to `U2#stacks-array-representation-of-stack`, and `P003-Q34`, `P004-Q7`, `P006-Q24` are unmatched.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`145m`)

| Topic Cluster | Marks | % of U4 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Graphs: terminology (`K_n`), adjacency matrix vs list & BFS / DFS + complexity** | **35m** | **24.1%** | **8.7%** | **4/4** | **Tier A** | `P003-Q16,Q21` (2×1m), `P003-Q31a(6m BFS algo),Q31b(2m complexity)`; `P004-Q3,Q10,Q11` (3×2m), `P004-Q23a(5m graph reps + pref),Q23b(3m draw K_5)`; `P005-Q25b(4m BFS algo + explain)`; `P006-Q2,Q10` (2×2m), `P006-Q24b(3m DFS vs BFS)` |
| **Binary tree properties, `n0 = n2 + 1` proof, Catalan `C_n` & array vs linked rep** | **32m** | **22.1%** | **7.9%** | **4/4** | **Tier A** | `P003-Q8,Q9,Q10,Q14` (4×1m); `P004-Q5,Q6,Q8` (3×2m), `P004-Q21a(5m 2 reps + pref),Q21b(3m 14 4-node BTs)`; `P005-Q10,Q12,Q14,Q15` (4×2m), `P005-Q23a(4m prove n_0 = n_2 + 1)`; `P006-Q4` (2m) |
| **Tree traversals (Pre/In/Post) & reconstruction from Inorder + Pre/Post** | **32m** | **22.1%** | **7.9%** | 3/4 | **Tier A** | `P003-Q12,Q13` (2×1m), `P003-Q30a(4m build from In+Pre)`, `P003-Q34b(4m Pre/In/Post)`; `P005-Q7,Q8,Q13` (3×2m), `P005-Q23b(4m build from Pre+In)`, `P005-Q25a(4m Pre & Post)`; `P006-Q13` (2m), `P006-Q22a(6m build from In+Pre)` |
| **B-trees of order `m`: 5 properties, disk use & step-by-step split insertion** | **17m** | 11.7% | 4.2% | 3/4 | **Tier B** | `P003-Q32b(4m B-tree order m + when preferred)`; `P005-Q9` (2m), `P005-Q24a(2m B-tree + diagram),Q24b(6m order-3 B-tree step-by-step)`; `P006-Q23b(3m B-tree properties)` |
| **AVL trees: balance factor, LL/RR/LR/RL rotations & step-by-step insertion** | **14m** | 9.7% | 3.5% | 3/4 | **Tier B** | `P003-Q32a(4m AVL from month names)`; `P004-Q7` (2m `BF ∈ {-1,0,+1}`); `P006-Q21a(4m AVL + 4 rotations),Q21b(4m AVL from 54,2345,6172,5918,1077,3422,44)` |
| **Binary Search Trees (BST): invariant, sorted inorder, search & insertion** | **12m** | 8.3% | 3.0% | 2/4 | **Tier B** | `P003-Q11` (1m), `P003-Q30b(4m BST + insert 10,25,2,4,7,13,11,22)`; `P006-Q8,Q14` (2×2m), `P006-Q23a(3m BST concept)` |
| **Threaded binary trees (one-way & two-way inorder threads)** | **3m** | 2.1% | 0.7% | 1/4 | **Tier E** | `P003-Q7` (1m), `P003-Q34a.ii(2m short note on Threaded Binary Tree)` |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#trees` & `#binary-trees` — Properties, Proofs & Representations (Tier A + Tier E · ~23% prose)
- Terminology + dual-convention formula box: max nodes at level `l` = `2^l` (root level `0`) or `2^(k-1)` (`k`-th level from `1`); max nodes of height `h` = `2^(h+1) - 1` (edge height) or `2^h - 1` (node-count height); min height `⌈log_2(N+1)⌉` (`P003-Q9`, `P004-Q5,Q6,Q8`).
- Full proof of **`n_0 = n_2 + 1`**: `N = n_0 + n_1 + n_2` and `E = N - 1 = n_1 + 2n_2 ⇒ n_0 = n_2 + 1` (`P003-Q8`, `P005-Q23a`).
- Catalan formula **`C_n = (1/(n+1)) C(2n, n)`** (`C_3 = 5`, **`C_4 = 14`**) with all 14 unlabeled 4-node binary trees drawn (`P004-Q21b`).
- **Sequential (Array) vs Linked Representation:** 1-based (`left = 2i`, `right = 2i+1`, `parent = ⌊i/2⌋` — `P005-Q12`) & 0-based (`2i+1`, `2i+2`, `⌊(i-1)/2⌋`), `O(2^h)` wasted slots on skewed trees, why linked representation wins for general trees (`P004-Q21a`).
- **Badged Tier E Note (~160w):** Threaded Binary Tree replacing `N + 1` null pointers with inorder predecessor/successor threads (`P003-Q7,Q34a.ii`).

### 4.2 `#traversals` [LOCKED] — Pre/In/Post/Level & Reconstruction (Tier A · ~21% prose)
- Recursive C functions + visual walk for Pre-order (`NLR`), In-order (`LNR`), Post-order (`LRN`), and queue-based Level-order (`P003-Q13,Q34b`, `P005-Q7,Q13,Q25a`, `P006-Q13`).
- **Tree Reconstruction Guide:** uniqueness rule (In+Pre and In+Post unique; Pre+Post ambiguous) + complete root-split traces on `Pre: A B D I E J C F G K` + `In: D I B E J A F C K G` (`P005-Q23b`) and an In+Post example (`P003-Q12,Q30a`, `P005-Q8`, `P006-Q22a`).

### 4.3 `#tree-types` — BST, AVL & Order-`m` B-Trees (Tier B + Tier S · ~32% prose)
- Strictly/Full, Complete, Perfect, and Left/Right Skewed binary trees table (`P003-Q14`, `P005-Q15`).
- **BST (`12m`):** `left < root < right` invariant, sorted In-order property (`P003-Q11`, `P006-Q8,Q14,Q23a`), search & insert in C (`O(log n)` avg, `O(n)` worst), step-by-step insertion of `10, 25, 2, 4, 7, 13, 11, 22` (`P003-Q30b`), and compact **Tier S** 3-case delete rule.
- **AVL Tree (`14m`):** `BF(v) = h(L) - h(R) ∈ {-1, 0, +1}` (`P004-Q7`), all 4 rotations (**LL, RR, LR, RL**) drawn cleanly (`P006-Q21a`), plus step-by-step traces for **`54, 2345, 6172, 5918, 1077, 3422, 44`** (`P006-Q21b`) and month names `{March, May, Nov, Aug, Apr, Jan, ...}` (`P003-Q32a`).
- **B-Tree of Order `m` (`17m`):** Knuth 5 properties (max `m` children, max `m-1` keys, non-leaf root `>= 2` children, internal `⌈m/2⌉..m` children / `⌈m/2⌉-1..m-1` keys, all leaves at equal depth — `P003-Q32b`, `P005-Q9,Q24a`, `P006-Q23b`), disk/DB motivation, and complete step-by-step **order-3 (2–3) B-tree** median-promotion split trace (`P005-Q24b`).

### 4.4 `#graphs` & `#graph-traversals` [LOCKED] — Representations, `K_5`, BFS & DFS (Tier A · ~24% prose)
- Terminology, Handshaking Lemma `∑ deg(v) = 2|E|`, complete graph `K_n` (`n(n-1)/2` edges) with **`K_5` (5 vertices, 10 edges) diagram** (`P004-Q23b`).
- **Adjacency Matrix (`O(V²)` space, `O(1)` edge query) vs Adjacency List (`O(V+E)` space, preferred for sparse graphs)** worked side-by-side (`P004-Q23a`).
- **BFS (queue)** & **DFS (stack/recursion):** numbered exam algorithms, C functions, queue/stack step tables, time complexity `O(V + E)` (list) vs `O(V²)` (matrix) (`P003-Q31`, `P005-Q25b`), and 7-row **BFS vs DFS Comparison Table** (`P006-Q24b`).

### 4.5 Practice & Revision Bank
- `14` MCQs, `6` short answers, and `6` worked 8m model answers covering every recurring tree and graph pattern.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (4):** (1) All `C_4 = 14` distinct 4-node binary trees + array vs linked BT; (2) AVL LL, RR, LR, RL rotations; (3) Order-3 B-tree node overflow & median split; (4) `K_5` pentagram + sample graph with Adjacency Matrix, Adjacency List, and BFS/DFS order.
- [ ] **Programs (4 `gcc -std=c99 -Wall -Wextra` verified):** Binary tree Pre/In/Post traversal; BST insert + search + inorder; Graph BFS (queue); Graph DFS (recursive/stack).
- [ ] **Comparison tables (5):** Preserved `comparisons-*` (Tree vs Graph; Pre/In/Post/Level; BFS vs DFS; BT vs BST vs AVL vs B-Tree; Adjacency Matrix vs Adjacency List) + Array vs Linked BT.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST215/index.html`, PDF p. 19)

| `CST215` Practical Area | Unit 4 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 6:** Trees — creation, traversals, deletion, binary search tree | `#binary-trees`, `#traversals`, `#tree-types` | Direct 1:1 match — BST create/insert/delete & Pre/In/Post traversals |
| **Area 9:** Graph theory assignments | `#graphs`, `#graph-traversals` | Adjacency matrix/list representation plus BFS & DFS traversal programs |
| *Areas 7–8 (Sorting & Searching)* | *(Cross-subject reference)* | 1-line link in `#practice` pointing to Algorithms Units 2 & 3 |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Binary Tree Properties (`n0 = n2 + 1`), Traversals & Inorder + Pre/Post Reconstruction | **Tier A** (`64m`) | `#traversals` | Works full In+Pre and In+Post tree reconstruction clearly; 20–35 min; verify live |
| **2** | AVL Trees: Balance Factor, LL/RR/LR/RL Rotations & Step-by-Step Insertion | **Tier B** (`14m`) | `#tree-types-6-avl-tree` | Draws all 4 rotations and recomputes BF after every insert; 20–35 min; plain `<a>` |
| **3** | B-Tree of Order `m`: Knuth Properties & Step-by-Step Insertion with Splits | **Tier B** (`17m`) | `#tree-types-7-b-tree` | Uses standard order-`m` definition (`m` children, `m-1` keys) + order-3 trace; verify live |
| **4** | Graph Representations (Adjacency Matrix vs List) & BFS / DFS with Complexity | **Tier A** (`35m`) | `#graph-traversals` | Shows queue/stack trace & derives `O(V+E)` vs `O(V²)`; 20–35 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 4 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P005-Q12` | 2m | U3 `Binary trees / array representation` | **Wrong redirect** → `U2#stacks-array-representation-of-stack` | `#binary-trees-array-and-linked-representation` — *Binary Trees: Array Representation and Linked Representation* |
| `P003-Q7`, `P003-Q34` | 1m, 8m | U3 `Threaded binary trees`; U4 `ADT / threaded trees / traversal` | `Q34` Unmatched | `#threaded-trees-and-traversal` — *Threaded Binary Trees and Stack-Free Traversal (Exam Note)* |
| `P003-Q12`, `P005-Q8`, `P005-Q23`, `P006-Q22` | 1,2,8,8m | U3/U4 `Tree reconstruction` / `Binary trees / reconstruction` | Coarse → `U4#trees` | `#binary-tree-reconstruction` — *Binary Tree Reconstruction from In-Order, Pre-Order and Post-Order* |
| `P003-Q30`, `P006-Q23` | 8m, 8m | U3 `Binary trees / BST`; U3 `BST / stack / queue / B-tree` | `Q23` → U2 | `#binary-search-tree-bst-property-and-operations` — *Binary Search Tree (BST): BST Property, Search and Insertion* |
| `P004-Q7`, `P006-Q21`, `P003-Q32` | 2,8,8m | U3 `AVL / balance factor`; U3 `AVL trees`; U3 `AVL / B-trees` | `P004-Q7` Unmatched | `#avl-trees-balance-factor-and-rotations` — *AVL Trees: Balance Factor, LL/RR/LR/RL Rotations and Insertion* |
| `P005-Q9`, `P005-Q24` | 2m, 8m | U3 `B-trees` | Coarse → `U4#trees` | Preserved `#tree-types-7-b-tree` + `#b-trees-order-m-and-construction` (*B-Trees of Order `m`: Properties and Construction*) |
| `P006-Q24` | 8m | U4 `Infix / queue / graph traversal` | Unmatched | `#graph-traversal-bfs-vs-dfs` — *Graph Traversal Algorithms: BFS vs DFS and Complexity* |
