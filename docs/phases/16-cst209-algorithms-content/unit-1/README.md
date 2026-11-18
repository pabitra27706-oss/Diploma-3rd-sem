# CST209 Unit 1 — Introduction

> **Target file:** `subjects/CST209/units/unit-1.html` (current: `4,572w` → target: **`~5,800–6,400w`**)  
> **Syllabus (`syllabus.json`, PDF p. 12):** **6 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0` — **#1 marks-per-hour unit across all 5 subjects at `14.8m/h`!**)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`89 / 395` marks (`22.5%`, #3 in Algorithms)** · avg **`22.2m/paper`** · **`4/4` papers** · **`33m` MCQ + `56m` 8m-subparts** (`2021–2022` `P001` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#asymptotic`, `#complexity`  
> **Existing `<section id>`s to preserve (16):** `overview`, `definitions`, `data-abstraction`, `sets-multisets`, `stacks-queues`, `asymptotic`, `complexity`, `programming-models`, `formulas`, `definitions-list`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve:** all `26` (add `6` targeted semantic `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 12)
- **Algorithm Fundamentals:** Definition and five essential characteristics of an algorithm (Input, Output, Definiteness, Finiteness, Effectiveness).
- **Data Abstraction & Basic Structures:** Abstract Data Types (ADTs); linear vs non-linear classification; **Sets and Multisets** (operations, multiplicity, power set `2^n`); **Stacks** (`PUSH`, `POP`) and **Queues** (`ENQUEUE`, `DEQUEUE`) as algorithmic primitives.
- **Asymptotic Notations & Complexity:** Big-Oh (`O`), Big-Omega (`Ω`), and Theta (`Θ`); time and space complexity (best, average, worst case); loop step-counting and recurrence relations.
- **Basic Programming / Design Models:** **Divide and Conquer**, **Dynamic Programming**, and **Greedy Method**.

---

## 2. Current Page Audit & Gaps (`subjects/CST209/units/unit-1.html`)
- **Live metrics:** `4,572` words (shortest page in Algorithms) · `13` `<pre>` blocks · `11` `<table>`s · **`0` `<svg>`s** · `26` `<h3 id>`s · `8` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#definitions` `330w`, `#data-abstraction` `160w`, `#sets-multisets` `215w`, `#stacks-queues` `267w`, `#asymptotic` `359w`, `#complexity` `379w`, `#programming-models` `503w` (`2,213w` concept prose).
- **Specific gaps to fix:**
  1. In **3 of 4 papers** (`P003`, `P005`, `P006`), Group B opens with **two consecutive 8-mark Unit 1 questions** (`16m` from just `6h` of syllabus!), yet `#asymptotic` lacks visual bound curves (`cg(n)` vs `f(n)` after `n_0`) and a step-by-step `(c, n_0)` polynomial proof.
  2. `#complexity` (`379w`) misses the exact **substitution / repeated-expansion recurrence `T(n) = 2T(n/2) + 1`** (`P005-Q17b`) and explicit trace proofs for `while (i <= n) i = i * 2 → O(log n)` (`P003-Q27a`) and nested `0..n-1` loops (`P005-Q17c`).
  3. `#programming-models` needs a dedicated 7-row **Divide & Conquer vs Dynamic Programming** table (`P006-Q17b`), and `#sets-multisets` needs explicit **Power Set `|P(S)| = 2^n`** (`P003-Q9`) plus multiset multiplicity operations (`P003-Q2,Q10`, `P004-Q16b`, `P005-Q2`).
  4. **6 Unit 1 `2023–2026` PYQs are currently unmatched** (`P003-Q9,Q12`, `P004-Q1,Q16`, `P005-Q16`, `P006-Q16`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`89m`)

| Topic Cluster | Marks | % of U1 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Algorithm definition, 5 characteristics & asymptotic notations (`O`, `Ω`, `Θ`)** | **30m** | **33.7%** | **7.6%** | **4/4** | **Tier A** | `P003-Q26a.i(2m define),Q26a.ii(2m Big-O)`; `P004-Q3` (2m), `P004-Q16a(2m define)`; `P005-Q1` (2m), `P005-Q16a(3m characteristics),Q16b(5m asymptotic notations)`; `P006-Q2,Q4` (2×2m), `P006-Q16a(4m define + traits w/ ex),Q16b(4m asymptotic notations)` |
| **Algorithmic paradigms: Divide & Conquer, Dynamic Programming & Greedy** | **26m** | **29.2%** | **6.6%** | **4/4** | **Tier A** | `P003-Q5` (1m DP), `P003-Q27b(4m D&C concept)`; `P004-Q5` (2m D&C); `P005-Q5,Q6` (2×2m), `P005-Q17a(3m D&C)`; `P006-Q3,Q15` (2×2m), `P006-Q17a(4m D&C w/ ex),Q17b(4m D&C vs DP)` |
| **Time & space complexity, loop step-counting & recurrence solving** | **17m** | 19.1% | 4.3% | 3/4 | **Tier B** | `P003-Q11,Q18` (2×1m), `P003-Q26b.i(2m time),Q26b.ii(2m why time & space matter)`, `P003-Q27a(4m while(i<=n) i=i*2 → O(log n))`; `P005-Q17b(3m substitution T(n)=2T(n/2)+1),Q17c(2m nested 0..n-1 → O(n^2))`; `P006-Q1` (2m) |
| **ADT, linear/non-linear classification, sets vs multisets (`2^n`) & stack `PUSH`/`POP`** | **16m** | 18.0% | 4.1% | 3/4 | **Tier B** | `P003-Q1,Q2,Q9,Q10,Q12,Q21` (6×1m); `P004-Q1` (2m), `P004-Q16b(2m set vs multiset),Q16c(4m PUSH & POP pseudocode)`; `P005-Q2` (2m) |
| **Queue primitive (`ENQUEUE` / `DEQUEUE`)** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 12), 0 direct hits in 2023–2026 — keep concise beside Stack_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#definitions` & `#asymptotic` [LOCKED] — Algorithm Traits & `O, Ω, Θ` (Tier A · ~32% prose)
- Formal algorithm definition + **5 Knuth Characteristics** (**Input** `>= 0`, **Output** `>= 1`, **Definiteness**, **Finiteness**, **Effectiveness**), each with a 1-line valid example and violating counter-example (`P003-Q26a.i`, `P004-Q16a`, `P005-Q16a`, `P006-Q16a`).
- Formal `(c, n_0)` definitions, 3-panel inline SVG bound curves, and complete worked witness proofs on `f(n) = 3n^2 + 5n + 2` for **`O(g(n))`** (upper bound), **`Ω(g(n))`** (lower bound), and **`Θ(g(n))`** (tight sandwich `c_1 g(n) <= f(n) <= c_2 g(n)`), plus 2-line `o`/`ω` note and growth hierarchy `O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)` (`P003-Q26a.ii`, `P005-Q16b`, `P006-Q16b`).

### 4.2 `#programming-models` — Divide & Conquer, DP & Greedy (Tier A · ~28% prose)
- **Divide & Conquer:** `Divide → Conquer → Combine` control abstraction, recurrence `T(n) = aT(n/b) + f(n)`, Merge Sort & Binary Search walkthroughs (`P003-Q27b`, `P005-Q17a`, `P006-Q17a`).
- **Dynamic Programming:** overlapping subproblems + optimal substructure, top-down memoization vs bottom-up tabulation, Fibonacci & Floyd-Warshall (`P003-Q5`, `P006-Q17b`).
- **Greedy Method:** greedy-choice property + optimal substructure, Prim/Kruskal/Dijkstra & fractional vs 0/1 knapsack (`P006-Q15`).
- Dedicated **7-row Divide & Conquer vs Dynamic Programming Table** (`P006-Q17b`) alongside preserved 3-way `#comparisons-algorithm-design-paradigms`.

### 4.3 `#complexity` [LOCKED] — Time/Space, Loop Traces & Recurrences (Tier B · ~22% prose)
- Elementary-operation time model vs fixed + auxiliary/recursion-stack space, why both govern real-world algorithm choice (`P003-Q26b`), and best/average/worst cases.
- **Worked Loop Step-Counting Table:** single loop `Θ(n)`; halving/doubling **`i = 1; while (i <= n) i = i * 2`** (`i = 1, 2, 4, ..., 2^k <= n ⇒ k = ⌊log_2 n⌋ + 1 = O(log n)` — `P003-Q27a`); nested `0..n-1 × 0..n-1` (`n^2 = O(n^2)` — `P005-Q17c`); triangular `n(n-1)/2 = O(n^2)`.
- **Solving Recurrences:** full step-by-step substitution/expansion of **`T(n) = 2T(n/2) + 1`, `T(1) = 1`** (`n = 2^k ⇒ 2^k T(1) + (2^k - 1) = 2n - 1 = Θ(n)` — `P005-Q17b`), `T(n) = T(n/2) + 1 = Θ(log n)`, `T(n) = 2T(n/2) + n = Θ(n log n)`, plus a concise 3-case Master Theorem card.

### 4.4 `#data-abstraction`, `#sets-multisets` & `#stacks-queues` (Tier B + Tier S · ~18% prose)
- ADT specification vs representation + linear vs non-linear classification (`P003-Q1,Q12`).
- Set equality (`{1,2,3} = {3,1,2}`), **Power Set `P(S)` with `|P(S)| = 2^n`** worked on `{a,b,c}` (`P003-Q9,Q10`), **Set vs Multiset (Bag)** table with multiplicity union `max(m_A, m_B)`, sum `m_A + m_B`, intersection `min(m_A, m_B)` (`P003-Q2`, `P004-Q16b`, `P005-Q2`).
- Clean array **`PUSH(S, x)`** (overflow check) and **`POP(S)`** (underflow check) pseudocode + recursion-stack role (`P003-Q21`, `P004-Q1,Q16c`), followed by compact **Tier S** `ENQUEUE`/`DEQUEUE` pseudocode.

### 4.5 Practice & Revision Bank
- `10` MCQs, `5` short answers, and `5` worked 8m model answers aligned with `P003-Q26,Q27`, `P004-Q16`, `P005-Q16,Q17`, and `P006-Q16,Q17`.

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) 3-panel `O(g(n))`, `Ω(g(n))`, `Θ(g(n))` asymptotic bound curves showing `n_0`; (2) Divide & Conquer independent subproblem tree vs DP overlapping-subproblem DAG.
- [ ] **Worked proofs & traces (5):** `3n^2+5n+2 = Θ(n^2)` witness proof; `while(i<=n) i=i*2` step table; `T(n)=2T(n/2)+1 = 2n-1` expansion; `P({a,b,c})` 8-subset listing; `PUSH`/`POP` pseudocode trace.
- [ ] **Comparison tables (5):** `O` vs `Ω` vs `Θ`; Divide & Conquer vs Dynamic Programming (7 rows); D&C vs DP vs Greedy; Time vs Space Complexity; Set vs Multiset; Stack vs Queue.

---

## 6. Quiz-Bank, Revision-Sheet & Cross-Subject Links
- Link `#practice` to `_quiz-data/CST209/unit-1.json` (`34` items) and sync the `4` Unit 1 cards in `docs/revision-sheets/CST209.json`; cross-link Data Structures (`CST205`) Unit 1 for extended ADT coverage and Unit 2 for full Stack/Queue implementations.

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Algorithm Characteristics & Asymptotic Notations (`O`, `Ω`, `Θ`) with Witness Proofs | **Tier A** (`30m`) | `#asymptotic` | Formal `c, n_0` definitions + bound graphs + polynomial example; verify live |
| **2** | Divide & Conquer vs Dynamic Programming vs Greedy Design Paradigms | **Tier A** (`26m`) | `#programming-models` | Contrasts independent vs overlapping subproblems & greedy choice; plain `<a>` |
| **3** | Loop Time Complexity (`O(log n)`, `O(n^2)`) & Solving Recurrences by Substitution | **Tier B** (`17m`) | `#complexity` | Solves `T(n)=2T(n/2)+1` and `T(n)=2T(n/2)+n` cleanly; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

Preserve all `26` existing `<h3 id>`s and add `6` semantic anchors closing all `6` unmatched Unit 1 questions:

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 1 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P005-Q16`, `P006-Q16` | 8m, 8m | U1 `Algorithm basics / asymptotics`; U1 `Algorithms / asymptotic notation` | Both Unmatched | `#algorithm-basics-and-asymptotic-notation` — *Algorithm Basics, Characteristics and Asymptotic Notation (`O`, `Ω`, `Θ`)* |
| `P003-Q12` | 1m | U1 `Data structures / classification` | Unmatched | `#adt-and-data-structures-classification` — *Data Abstraction and Classification of Data Structures* |
| `P003-Q9`, `P004-Q16` | 1m, 8m | U1 `Sets / power set`; U1 `Algorithm basics / sets / stacks` | Both Unmatched | `#sets-multisets-and-power-set` — *Algorithm Basics of Sets, Multisets, Power Set and Stacks* |
| `P004-Q1` | 2m | U1 `Stacks / algorithm primitives` | Unmatched | `#stacks-and-algorithm-primitives` — *Stacks (`PUSH`, `POP`) and Queue Algorithm Primitives* |
| `P005-Q17`, `P003-Q27a` | 8m, 4m | U1 `Recurrences / complexity`; U2 `Complexity / divide and conquer` | Same/redirect → sharpen | `#recurrences-and-substitution-method` — *Recurrences, Substitution Method and Loop Complexity* |
| `P006-Q17`, `P003-Q5`, `P004-Q5`, `P005-Q5,Q6`, `P006-Q3,Q15` | 1–8m | U2/U3/U4 `Divide and conquer / dynamic programming`, `Greedy algorithms` | Redirects → U1 | `#divide-and-conquer-vs-dynamic-programming` — *Divide and Conquer vs Dynamic Programming and Greedy Algorithms* |
