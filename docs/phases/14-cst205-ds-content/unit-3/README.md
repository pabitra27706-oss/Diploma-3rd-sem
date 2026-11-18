# CST205 Unit 3 — Linked Lists

> **Target file:** `subjects/CST205/units/unit-3.html` (current: `7,858w` → target: **`~6,400–7,000w` [streamlined, high-signal]**)  
> **Syllabus (`syllabus.json`, PDF p. 7):** **15 contact hours** (of `45h`, `3` credits, L–T–P `2-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`75 / 403` marks (`18.6%`, #3 in DS)** · avg **`18.8m/paper`** · **`4/4` papers** · **`21m` MCQ + `54m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#singly-insertion-operations`, `#comparisons-all-four-types-of-linked-lists`  
> **Existing `<section id>`s to preserve (14):** `overview`, `introduction`, `singly`, `circular-singly`, `doubly`, `circular-doubly`, `applications`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (24):** all authored `introduction-*` (3), `singly-*` (4), `circular-singly-*` (3), `doubly-*` (4), `circular-doubly-*` (4), `applications-*` (3), and `comparisons-*` (3) IDs

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 7)
- **Foundations:** Introduction to Linked Lists; node structure & dynamic representation in memory; comparison of sequential (Array) and linked representations.
- **Singly Linked List (SLL):** Traversing, linear searching, insertion (beginning, end, given position/after node), and deletion (beginning, end, given key).
- **Circular Linked List (CLL):** Representation, stopping invariant (`p->next == head`), operations, and applications.
- **Doubly & Circular Doubly Linked Lists (DLL & CDLL):** Bidirectional node layout (`prev | data | next`), advantages over SLL, and insertion/deletion operations.
- **Applications of Linked Lists:** Linked stack, linked queue, and dynamic list uses.

> **Syllabus-Boundary Note:** Header linked lists and linked polynomial representation earned **`11m` across `3/4` papers** (`P003-Q29a.i`, `P004-Q20a,b`, `P006-Q20b`) — cover thoroughly inside an explicitly badged **Tier E** subsection under `#applications`.

---

## 2. Current Page Audit & Gaps (`subjects/CST205/units/unit-3.html`)
- **Live metrics:** `7,858` words (`1,619w` longer than `143m` Unit 2!) · **`59` `<pre>` blocks** (highest in entire repo!) · `8` `<table>`s · `0` `<svg>`s · `24` `<h3 id>`s · `15` MCQs · `10` short Qs · `8` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#introduction` `303w`, `#singly` `811w`, `#circular-singly` `543w`, `#doubly` `708w`, `#circular-doubly` `400w`, `#applications` `563w` (`3,328w` concept prose).
- **Specific defects & right-sizing targets:**
  1. **Repetitive C boilerplate (`59` `<pre>` blocks)** across `#circular-doubly` (`0m` in `2023–2026`!) hides the exact questions WBSCTE repeats year after year: **SLL insert at beginning** (`3/4` papers: `P003-Q29b`, `P005-Q21b`, `P006-Q19b`) & **insert at end** (`P005-Q22b`) written as clean numbered exam pseudocode + C.
  2. **Missing Header Linked List & Bivariate Polynomial diagram:** `P003-Q29a.i` and `P004-Q20a` ask header-node uses, `P006-Q20b` asks `3x³ + 2x² + 5x + 2`, and `P004-Q20b` asks bivariate `7x³y² − 8x²y + 3xy + 11x + 4`.
  3. Zero inline SVGs (`0`) — pointer rewiring diagrams are mandatory for scoring full marks on SLL, DLL, CLL, and polynomial questions.
  4. Stored `unit: 2` linked-list PYQs (`P004-Q12,Q20`, `P005-Q3,Q4,Q5`) currently redirect coarsely to `U3#introduction` instead of `#circular-singly`, `#doubly`, `#singly`, and `#applications`.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`75m`)

| Topic Cluster | Marks | % of U3 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Singly linked list: node layout, insert begin/end, delete, traverse, search & advantages** | **26m** | **34.7%** | **6.5%** | 3/4 | **Tier A** | `P003-Q19` (1m), `P003-Q29b(4m insert at beginning algo)`; `P005-Q21b(5m insert at beginning algo + explain)`, `P005-Q22b(6m insert at end algo + explain)`; `P006-Q12,Q15` (2×2m), `P006-Q19b(4m insert at beginning algo)`, `P006-Q22b(2m advantages)` |
| **Circular & doubly linked lists: diagrams, links, stopping condition & advantages** | **22m** | **29.3%** | **5.5%** | **4/4** | **Tier A** | `P003-Q29a.ii(2m CLL w/ ex)`; `P004-Q9,Q12` (2×2m), `P004-Q18c(2m DLL vs SLL),Q18d(2m CLL uses)`, `P004-Q20c(2m CLL vs SLL)`; `P005-Q4,Q5` (2×2m), `P005-Q22a(2m draw & explain CLL)`; `P006-Q11` (2m), `P006-Q20a(2m DLL advantages over SLL)` |
| **Array vs linked list comparison & selection guide** | **12m** | 16.0% | 3.0% | 3/4 | **Tier B** | `P004-Q18a(2m compare),Q18b(2m which to prefer & when)`; `P005-Q3` (2m `O(n)` search), `P005-Q21a(3m array vs LL)`; `P006-Q20c(3m LL vs linear array)` |
| **Header linked list & polynomial representation using linked list** | **11m** | 14.7% | 2.7% | 3/4 | **Tier E** | `P003-Q29a.i(2m header LL w/ ex)`; `P004-Q20a(2m header node use),Q20b(4m linked rep of 7x³y²−8x²y+3xy+11x+4)`; `P006-Q20b(3m linked rep of 3x³+2x²+5x+2)` |
| **Linked stack & linked queue applications** | **4m** | 5.3% | 1.0% | 2/4 | **Tier C** | `P004-Q15` (2m); `P006-Q9` (2m) |
| **Circular doubly linked list** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 7), 0 hits in 2023–2026 — keep concise, preserve all 4 `h3` IDs_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#introduction` — Node Anatomy & Array vs Linked List (Tier B · ~15% prose)
- Self-referential `struct Node { int data; struct Node *next; };`, non-contiguous heap chain vs contiguous array, advantages & trade-offs (`P006-Q22b`).
- 8-row **Linear Array vs Linked List Table** + explicit **"When to Prefer Each"** rule (array for known size, `O(1)` index lookup, binary search, zero pointer overhead; linked list for unknown dynamic size and frequent `O(1)` head/cursor insert-delete — `P004-Q18a,b`, `P005-Q3,Q21a`, `P006-Q20c`).

### 4.2 `#singly` & `#singly-insertion-operations` [LOCKED] — SLL Core Algorithms (Tier A · ~34% prose)
- Pair **numbered textbook exam algorithms** (with `AVAIL`/`malloc == NULL` overflow check) and clean C functions for:
  - **Insert at Beginning (`O(1)`)** — `new->next = head; head = new;` (`P003-Q29b`, `P005-Q21b`, `P006-Q19b`).
  - **Insert at End (`O(n)`)** — explicit `head == NULL` empty-list branch + walk `while (p->next != NULL)` (`P005-Q22b`).
  - **Insert after Given Position/Key**, **Delete Beginning (`O(1)`) / End (`O(n)`) / Key** (with `free(temp)`), **Traverse (`O(n)`)**, and **Linear Search (`O(n)`)** (plus why binary search is impractical on SLL — `P005-Q3`), plus 3-pointer iterative reverse sketch for lab tie-in.

### 4.3 `#circular-singly`, `#doubly`, `#circular-doubly` & `#comparisons-all-four-types-of-linked-lists` [LOCKED] (~31% prose)
- **Circular Singly LL (`#circular-singly`):** SVG showing `last->next == head` (zero `NULL` — `P005-Q22a`), `do...while (p != head)` loop, **CLL vs SLL table**, real uses (OS round-robin, multiplayer turn loop, tail-pointer `O(1)` enqueue/dequeue — `P003-Q29a.ii`, `P004-Q12,Q18d,Q20c`), and concise head/tail insert & delete.
- **Doubly LL (`#doubly`):** `[prev | data | next]` node, **DLL Advantages over SLL** (two-way walk, `O(1)` delete given node pointer, browser back/forward & undo/redo; cost = extra pointer + 4 link updates on middle insert — `P004-Q18c`, `P005-Q4,Q5`, `P006-Q11,Q20a`), and clean insert/delete functions.
- **Circular Doubly LL (`#circular-doubly`, Tier S · ~5% prose):** Preserve all 4 `circular-doubly-*` `h3` IDs with concise 3–4 line pointer-update rules (`head->prev == tail`, `tail->next == head`) instead of repetitive full drivers, anchored by `#comparisons-all-four-types-of-linked-lists`.

### 4.4 `#applications` — Tier E Header LL & Polynomials + Linked Stack/Queue (~20% prose)
- **Badged Tier E — Header Linked List (`P003-Q29a.i`, `P004-Q20a`):** Grounded (`last->next == NULL`) vs circular (`last->next == header`) header lists; storing metadata (count/max) and eliminating empty-list special cases.
- **Badged Tier E — Polynomial Representation (`P004-Q20b`, `P006-Q20b`):**
  - Univariate `struct Poly { int coeff, exp; struct Poly *next; };` drawn step-by-step for **`3x³ + 2x² + 5x + 2`** (`[3|3] → [2|2] → [5|1] → [2|0] → NULL`, zero `x` terms omitted).
  - Bivariate `struct BiPoly { int coeff, ex, ey; struct BiPoly *next; };` drawn step-by-step for **`7x³y² − 8x²y + 3xy + 11x + 4`** (`[7|3|2] → [-8|2|1] → [3|1|1] → [11|1|0] → [4|0|0] → NULL`).
- **Tier C — Linked Stack & Linked Queue (`#applications-1-*`, `#applications-2-*`):** `O(1)` push/pop at `top` (`head`) and `O(1)` enqueue at `rear` / dequeue at `front` with dynamic growth (`P004-Q15`, `P006-Q9`).

### 4.5 Practice & Revision Bank
- `8` MCQs, `5` short answers, and `5` worked 8m model answers.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (3):** (1) SLL insert-at-beginning & insert-at-end pointer rewiring; (2) CLL loop (`last->next = head`) & DLL 4-pointer middle insertion; (3) Univariate `3x³+2x²+5x+2` & bivariate `7x³y²−8x²y+3xy+11x+4` node chains + header node.
- [ ] **Programs (5 clean `gcc -std=c99 -Wall -Wextra` C modules):** SLL insert/delete/search/reverse; CLL insert/traverse; DLL insert/delete; Linked Stack & Linked Queue; univariate Polynomial node builder.
- [ ] **Comparison tables (4):** Array vs Linked List (+ when to choose); SLL vs DLL; SLL vs CLL; All 4 Linked List types (`#comparisons-all-four-types-of-linked-lists`).

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST215/index.html`, PDF p. 19)

| `CST215` Practical Area | Unit 3 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 5:** Linked lists — singly, doubly, circular; merge and reverse | `#singly`, `#circular-singly`, `#doubly` | Direct 1:1 lab match — link from `#singly` & `#practice` for SLL/DLL/CLL and iterative list reverse/merge |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Singly Linked List in C: Node Struct, Insert at Beginning/End, Delete & Array vs LL | **Tier A/B** (`38m`) | `#singly-insertion-operations` | Draws every pointer assignment before modifying `head`/`next`; 20–35 min; verify live |
| **2** | Doubly Linked List & Circular Linked List: Pointer Diagrams, Operations & Uses | **Tier A** (`22m`) | `#doubly` | Clearly explains `do-while` CLL traversal & 4-pointer DLL insert; 18–30 min; plain `<a>` |
| **3** | Header Linked Lists & Polynomial Representation Using Linked Lists | **Tier E** (`11m`, 3/4) | `#applications` | Covers grounded/circular header nodes + 1- and 2-variable polynomial nodes; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 3 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P005-Q3` | 2m | U2 `Linked lists / searching` | Coarse redirect → `U3#introduction` | `#singly-linked-lists-searching-and-traversal` — *Searching and Traversing Singly Linked Lists* |
| `P004-Q12`, `P005-Q22` | 2m, 8m | U2 `Circular linked lists`; U2 `Circular / singly linked lists` | `Q12` coarse → `U3#introduction` | Preserved `#circular-singly` (`<h2>` includes *Circular Linked Lists*) |
| `P005-Q4`, `P005-Q5` | 2m, 2m | U2 `Doubly linked lists`; U2 `Doubly linked lists / insertion` | Coarse redirect → `U3#introduction` | `#doubly-linked-lists-insertion-and-deletion` — *Doubly Linked Lists: Pointer Insertion and Deletion* |
| `P004-Q20`, `P003-Q29a`, `P006-Q20b` | 8,4,3m | U2/U3 `Linked lists / polynomials` | Coarse redirect → `U3#introduction` | `#header-linked-lists-and-polynomials` — *Header Linked Lists and Polynomials Representation (Exam Note)* |
| `P004-Q18`, `P005-Q21`, `P006-Q19,Q20` | 8,8,8,8m | U2/U3 `Arrays / linked lists` | Redirect/same → `U3#introduction-array-vs-linked-list` | Preserved `#introduction-array-vs-linked-list` & locked `#singly-insertion-operations` |
