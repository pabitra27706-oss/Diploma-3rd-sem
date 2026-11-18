# CST205 Unit 2 — Stacks, Queues and Recursion

> **Target file:** `subjects/CST205/units/unit-2.html` (current: `6,239w` → target: **`~7,400–8,200w`**)  
> **Syllabus (`syllabus.json`, PDF p. 7):** **12 contact hours** (of `45h`, `3` credits, L–T–P `2-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`143 / 403` marks (`35.5%`, #2 in DS — #1 IN GROUP B LONG-ANSWER MARKS ACROSS ALL 5 SUBJECTS AT `113m`!)** · avg **`35.8m/paper`** · **`4/4` papers** · **`30m` MCQ + `113m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#stacks-operations-on-stack`, `#queues-types-of-queues`  
> **Existing `<section id>`s to preserve (12):** `overview`, `stacks`, `queues`, `recursion`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (16):** `stacks-introduction-to-stack`, `stacks-array-representation-of-stack`, `stacks-operations-on-stack`, `stacks-applications-of-stack`, `queues-introduction-to-queue`, `queues-array-representation-of-queue`, `queues-operations-on-queue`, `queues-types-of-queues`, `queues-application-round-robin-cpu-scheduling`, `recursion-introduction-to-recursion`, `recursion-example-1-gcd-using-euclidean-algorithm`, `recursion-example-2-tower-of-hanoi`, `comparisons-stack-vs-queue`, `comparisons-linear-queue-vs-circular-queue`, `comparisons-recursion-vs-iteration`, `comparisons-infix-vs-postfix-notation`

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 7)
- **Stacks:** LIFO principle; Array representation of stack; Operations (`PUSH`, `POP`, `PEEK`, overflow and underflow conditions); Applications — Infix-to-Postfix & Infix-to-Prefix conversion, Evaluation of Postfix expressions, reversal/parenthesis balancing, and recursion support.
- **Queues:** FIFO principle; Array representation of queue; Operations (`INSERT`/`ENQUEUE`, `DELETE`/`DEQUEUE`); Types of Queues — Circular Queue, Deque (Input-Restricted and Output-Restricted), Priority Queue; Applications of Queue (including Round-Robin CPU scheduling).
- **Recursion:** Principles of recursion (base case & call stack); Recursive vs Iterative comparison; Euclidean GCD; Tower of Hanoi.

---

## 2. Current Page Audit & Gaps (`subjects/CST205/units/unit-2.html`)
- **Live metrics:** `6,239` words (`1,619w` shorter than Unit 3 despite earning **1.9× more marks**!) · `45` `<pre>` blocks · `12` `<table>`s · `0` `<svg>`s · `16` `<h3 id>`s · `12` MCQs · `10` short Qs · `7` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#stacks` `1,177w`, `#queues` `903w`, `#recursion` `774w` (`2,854w` concept prose).
- **Specific gaps to fix:**
  1. `#queues` earns **`59m` (`14.6%` of the entire DS exam — single #1 topic across all 5 subjects)** in just `903w`: add a full 6-step `front`/`rear` array trace demonstrating linear-queue false overflow (`P004-Q22`), formal textbook `CQINSERT`/`CQDELETE` pseudocode alongside C (`P003-Q28a`, `P006-Q18`), explicit Input-Restricted vs Output-Restricted Deque diagrams (`P003-Q24,Q28b`, `P006-Q17b`), and Priority Queue representations + applications (`P004-Q17a`).
  2. `#stacks` needs side-by-side **numbered textbook algorithms** (`PUSH(STACK, TOP, MAXSTK, ITEM)` & `POP`) alongside C (asked verbatim in `4/4` papers), a full **Infix → Prefix** trace on `(A - D/C) * (D + E - F) = *-A/DC-+DEF` (`P003-Q27b`), a full **Postfix Evaluation** trace on `5, 6, 2, +, 8, +, 4, /, − = 1` (`P005-Q18b`), and an explicit **Array vs Stack** table (`P004-Q16b`).
  3. Zero inline SVGs (`0`) — add circular queue wrap-around ring, input/output-restricted deque, and 3-disk Tower of Hanoi recursion tree.
  4. Resolve unmatched `P003-Q24`, `P003-Q27`, `P003-Q28`, and `P004-Q19` via precision `<h3 id>` headings.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`143m`)

| Topic Cluster | Marks | % of U2 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Queues: linear, circular, input/output-restricted deque & priority queue** | **59m** | **41.3%** | **14.6%** | **4/4** | **Tier A** | `P003-Q1,Q3,Q24,Q25` (4×1m), `P003-Q28a(5m CQ + insert/delete),Q28b(3m deque + ex)`; `P004-Q4,Q13` (2×2m), `P004-Q17a(3m priority Q + apps),Q17b(5m CQ vs LQ)`, `P004-Q22i..vi(8m queue trace A..M)`; `P005-Q6` (2m), `P005-Q20a(4m LQ vs CQ),Q20b(4m LQ insert)`; `P006-Q3` (2m), `P006-Q17a(2m Q apps),Q17b(2m IR/OR deque)`, `P006-Q18a+b(8m CQ + insert)`, `P006-Q24a(3m Q delete)` |
| **Stacks: LIFO, `top`, overflow/underflow, `PUSH` & `POP`, stack vs array/queue** | **36m** | **25.2%** | **8.9%** | **4/4** | **Tier A** | `P003-Q4,Q23` (2×1m), `P003-Q27a(4m PUSH & POP algo)`; `P004-Q2` (2m), `P004-Q16a(2m overflow/underflow),Q16b(2m array vs stack),Q16c(4m PUSH & POP)`; `P005-Q1,Q2,Q11` (3×2m), `P005-Q17b(2m LIFO + top),Q17c(4m PUSH & POP)`; `P006-Q7` (2m), `P006-Q17a(4m stack + PUSH/POP)`, `P006-Q23a(2m stack vs queue)` |
| **Polish notation: infix→postfix, infix→prefix & postfix stack evaluation** | **26m** | 18.2% | **6.5%** | **4/4** | **Tier A** | `P003-Q17,Q18` (2×1m), `P003-Q27b(4m infix→prefix (A-D/C)*(D+E-F))`, `P003-Q33b(4m postfix eval algo)`; `P004-Q14` (2m), `P004-Q19b(4m infix→postfix + eval)`; `P005-Q18a(3m postfix def + ex),Q18b(5m eval 5,6,2,+,8,+,4,/,−)`; `P006-Q24a(2m infix)` |
| **Recursion: Euclidean GCD, Tower of Hanoi & recursion vs iteration** | **22m** | 15.4% | **5.5%** | **4/4** | **Tier A** | `P003-Q33a(4m recursive GCD)`; `P004-Q19a(4m iterative vs recursive + preference)`; `P005-Q19a(4m recursion vs iteration),Q19b(4m recursive TOH)`; `P006-Q6` (2m), `P006-Q19a(4m recursive TOH)` |
| **Round-Robin CPU scheduling queue application** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 7), 0 hits in 2023–2026 — keep concise (~150w)_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#queues` & `#queues-types-of-queues` [LOCKED] — All 4 Queue Variants (Tier A + Tier S · ~40% prose)
- **Linear Queue:** FIFO rule, `front = rear = -1` empty invariant, `front == rear` last-element reset, `rear == MAX - 1` overflow, formal **`QINSERT` & `QDELETE` pseudocode + C** (`P005-Q20b`, `P006-Q24a`), and worked **6-step `front`/`rear` array trace** (`Add A..F → Del 2 → Add G,H → Del 4 → Add M`, exposing false overflow — `P004-Q22`).
- **Circular Queue:** Modulo ring diagram, overflow `(rear + 1) % MAX == front`, empty `front == -1`, wrap-around `(rear + 1) % MAX`, formal **`CQINSERT` & `CQDELETE` pseudocode + C** (`P003-Q28a`, `P006-Q18`), and 6-row **Linear vs Circular Queue** table (`P004-Q17b`, `P005-Q20a`).
- **Deque (Double-Ended Queue):** 4 end operations and clear comparison of **Input-Restricted Deque** (insert one end, delete both) vs **Output-Restricted Deque** (delete one end, insert both) + real examples (work-stealing scheduler, palindrome checker — `P003-Q24,Q28b`, `P006-Q17b`).
- **Priority Queue:** Ascending vs descending priority, unsorted array vs sorted list vs binary-heap `O(log n)` costs, applications (OS job scheduling, Dijkstra, interrupts — `P004-Q17a`, `P006-Q17a`).
- **Tier S `#queues-application-round-robin-cpu-scheduling` (~150w):** Preserved heading with a concise 3-process time-quantum FIFO cycle note.

### 4.2 `#stacks` & `#stacks-operations-on-stack` [LOCKED] — Stack ADT & Polish Notation (Tier A · ~43% prose)
- LIFO principle, `top = -1`, **Overflow (`top == MAX - 1`) & Underflow (`top == -1`)** (`P004-Q16a`, `P005-Q17b`), formal **`PUSH` & `POP` textbook pseudocode + runnable C** (`P003-Q27a`, `P004-Q16c`, `P005-Q17c`, `P006-Q17a`), `PEEK`, `O(1)` time complexity, plus **Array vs Stack** (`P004-Q16b`) and **Stack vs Queue** (`P006-Q23a`) tables.
- **Expression Conversion & Evaluation Workbench:**
  - Operator precedence/associativity (`^` right-assoc > `* /` left > `+ -` left) & why Prefix/Postfix need zero parentheses (`P006-Q24a`).
  - **Infix → Postfix:** formal stack algorithm + C + complete symbol/stack/output table (`P004-Q19b`).
  - **Infix → Prefix:** formal reverse-swap-postfix-reverse algorithm traced step-by-step on `(A - D/C) * (D + E - F)` yielding `*-A/DC-+DEF` (`P003-Q27b`).
  - **Postfix Evaluation:** formal algorithm + C + row-by-row stack trace on `5, 6, 2, +, 8, +, 4, /, −` → `5 - ((6+2+8)/4) = 5 - 4 = 1`, highlighting non-commutative pop order `b = pop(); a = pop(); push(a op b)` (`P003-Q33b`, `P004-Q19b`, `P005-Q18b`).

### 4.3 `#recursion` — Recursion vs Iteration, GCD & Tower of Hanoi (Tier A · ~17% prose)
- Base case, progress toward base case, system call-stack activation frames, **Recursion vs Iteration Comparison Table** + when to prefer each (`P004-Q19a`, `P005-Q19a`).
- Recursive **Euclidean `gcd(a, b)`** algorithm + C + trace (`P003-Q33a`).
- **Tower of Hanoi `TOH(n, src, aux, dest)`:** 3-step algorithm + C + complete 7-move `n = 3` table + recurrence `T(n) = 2T(n-1) + 1 = 2^n - 1` (`O(2^n)`) (`P005-Q19b`, `P006-Q6,Q19a`).

### 4.4 Practice & Revision Bank
- `12` MCQs, `6` short answers, and `6` complete 8m model answers covering every recurring Group B pair.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (3):** (1) Linear Queue false overflow vs Circular Queue modulo wrap-around ring; (2) Input-Restricted vs Output-Restricted Deque endpoints; (3) 3-disk Tower of Hanoi recursion call tree (`7` moves).
- [ ] **Programs (7 `gcc -std=c99 -Wall -Wextra` verified):** array Stack (`push`/`pop`/`peek`); Infix→Postfix converter; Postfix evaluator; array Linear Queue; array Circular Queue; recursive `gcd`; recursive `towerOfHanoi`.
- [ ] **Comparison tables (6):** Stack vs Array; Stack vs Queue; Infix vs Prefix vs Postfix; Linear Queue vs Circular Queue; Input-Restricted vs Output-Restricted Deque; Recursion vs Iteration.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST215/index.html`, PDF p. 19)

| `CST215` Practical Area | Unit 2 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 2:** Stacks — push/pop, infix to postfix, postfix evaluation | `#stacks-operations-on-stack`, `#stacks-applications-of-stack` | Exact 1:1 lab match — all 3 programs compile & run directly |
| **Area 3:** Recursive programs — factorial, Fibonacci, Ackermann, Tower of Hanoi | `#recursion` | Link from `#recursion` (noting Ackermann in lab reference) |
| **Area 4:** Queue operations; recursion converted to iteration | `#queues`, `#comparisons-recursion-vs-iteration` | Link from `#queues` for linear & circular queue C implementations |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Linear Queue vs Circular Queue (`CQINSERT`/`CQDELETE`), Deque & Priority Queue | **Tier A** (`59m`) | `#queues-types-of-queues` | Shows modulo wrap-around, full/empty checks, and IR/OR deque; 20–35 min; verify live |
| **2** | Stack ADT: Array Implementation, Overflow/Underflow, `PUSH` & `POP` in C | **Tier A** (`36m`) | `#stacks-operations-on-stack` | Covers both textbook pseudocode and C code; 12–25 min; plain `<a>` only |
| **3** | Infix to Postfix, Infix to Prefix & Postfix Evaluation Using Stack (Tabular Trace) | **Tier A** (`26m`) | `#stacks-applications-of-stack` | Draws complete symbol/stack/output exam tables + `^` associativity; 20–35 min; verify live |
| **4** | Recursion & Tower of Hanoi (Call-Stack Trace & `2^n - 1` Derivation) | **Tier A** (`22m`) | `#recursion-example-2-tower-of-hanoi` | Visualizes 3-disk tree & stack unwinding clearly; 12–22 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 2 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q27` | 8m | U1 `Stacks / prefix conversion` | Unmatched | `#infix-postfix-and-prefix-conversion` — *Infix, Postfix and Prefix Conversion Using Stacks* |
| `P004-Q19`, `P003-Q33`, `P005-Q18` | 8,8,8m | U2 `Recursion / postfix evaluation`; U1 `Recursion / postfix`; U1 `Stacks / postfix` | `P004-Q19` Unmatched | `#postfix-evaluation-using-stack` — *Postfix Expression Evaluation Using Stack* |
| `P003-Q24`, `P003-Q28`, `P004-Q13` | 1,8,2m | U1 `Deques`; U1 `Circular queues / deque`; U1 `Circular queues` | `Q24,Q28` Unmatched | `#circular-queues-deques-and-priority-queues` — *Circular Queues, Deques (Input/Output Restricted) and Priority Queues* |
| `P003-Q1,Q4,Q17,Q23,Q25`, `P004-Q2,Q4,Q16,Q17`, `P005-Q1,Q2,Q6,Q11,Q20` | 1–8m | U1 `Stacks` / `Queues` | Clean redirect `U1 → U2` | Preserved locked `#stacks-operations-on-stack` & `#queues-types-of-queues` |
