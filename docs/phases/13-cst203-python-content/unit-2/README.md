# CST203 Unit 2 — Control Statements

> **Target file:** `subjects/CST203/units/unit-2.html` (current: `2,912w` [shortest unit in the repository] → target: **`~4,600–5,200w`**)  
> **Syllabus (`syllabus.json`, PDF p. 5):** **5 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`64 / 387` marks (`16.5%`, #3 in Python)** · avg **`16.0m/paper`** · **`4/4` papers** · **`20m` MCQ + `44m` 8m-subparts** (`P001-2022-06` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#loops`, `#loop-control`  
> **Existing `<section id>`s to preserve (12):** `overview`, `conditionals`, `loops`, `loop-control`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` → **`8` shipped** (13.2). Plan said 5; the `for`/`range` cluster needed four to separate `range()` semantics, nesting and the three set programs. See `../record.md` §4.3.

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 5)
- **Conditional Statements:** The `if` statement and its related statements (`if`, `if...else`, `if...elif...else`, nested `if`); worked decision-making examples.
- **Iteration Statements:** The `while` loop; the `for` loop; the `range()` function; nesting loops.
- **Loop Control & Loop `else`:** The `break` statement; the `continue` statement; the `pass` statement; the `else` clause on loops (`for...else`, `while...else`).

> **Syllabus-Boundary Note:** Zero `0m` Tier S items and zero out-of-syllabus Tier E drift — **100% of Unit 2's printed syllabus is actively tested** across `2023–2026`.

---

## 2. Current Page Audit & Gaps (`subjects/CST203/units/unit-2.html`)
- **Live metrics:** `2,912` words (shortest unit across all 24 units!) · `13` `<pre>` blocks · `6` `<table>`s · `0` `<svg>`s · `0` `<h3 id>`s · `5` MCQs · `5` short Qs · `3` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#conditionals` `313w`, `#loops` `430w`, `#loop-control` `473w` (`1,216w` concept prose total).
- **Specific gaps to fix:**
  1. `#loops` has only `430w` for **`36m` (`56.2%` of Unit 2)** — needs thorough `range(start, stop, step)` output traces (`P004-Q5`, `P005-Q2,Q5,Q22i`), a side-by-side `for` vs `while` comparison table (`P004-Q18i`), a nested-loop example, and all three benchmark exam scripts: prime check (`P003-Q28b`, `P005-Q17iii`), sum of digits (`P004-Q18ii`), and tuple traversal (`P004-Q22i`).
  2. `#loop-control` (`21m`, hit in all `4/4` papers) needs an unmistakable 3-way `break` vs `continue` vs `pass` dry-run plus dedicated `for...else` / `while...else` contrasting traces (`P004-Q22iii`).
  3. Practice bank has only `5` MCQs and `3` long Qs — expand to `9` MCQs, `4` short, and `4` worked 8m multi-part solutions.
  4. **9 Unit 2 `2023–2026` PYQ questions fail to match** (`P004-Q2,Q5,Q18,Q22`, `P005-Q8,Q15,Q17,Q22`, `P006-Q8`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`64m`)

| Topic Cluster | Marks | % of U2 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Loop control: `break`, `continue`, `pass` & loop `else` clause** | **21m** | **32.8%** | **5.4%** | **4/4** | **Tier A** | `P003-Q28a(4m break & continue in for loop)`; `P004-Q22ii(2m pass),Q22iii(2m for-else)`; `P005-Q8` (2m `pass`), `P005-Q15` (2m `while`/`break`), `P005-Q17i(3m continue/break/pass)`; `P006-Q10` (2m), `P006-Q19b(4m break & continue)` |
| **`for` & `while` loops + `range()` semantics** | **20m** | **31.2%** | **5.2%** | 3/4 | **Tier A** | `P004-Q5` (2m `list(range(...))`), `P004-Q11` (2m loop output), `P004-Q18i(3m for vs while)`; `P005-Q2,Q5` (2×2m loop/`range`), `P005-Q22i(3m range() in for loop)`; `P006-Q9` (2m), `P006-Q19a(4m loop def & importance)` |
| **Classic loop programs (prime check, sum of digits, tuple iteration)** | **16m** | 25.0% | 4.1% | 3/4 | **Tier B** | `P003-Q28b(4m prime check)`; `P004-Q18ii(5m sum of digits)`, `P004-Q22i(4m print tuple elements with for)`; `P005-Q17iii(3m prime check)` |
| **Conditional branching (`if`, `if-else`, `if-elif-else`, nested `if`)** | **7m** | 10.9% | 1.8% | 2/4 | **Tier C** | `P004-Q2` (2m conditional output), `P004-Q16iii(3m if + decision example)`; `P006-Q8` (2m `elif` keyword) |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#loops` [LOCKED] — `for`, `while`, `range()`, Nesting & Exam Scripts (Tier A + Tier B · ~52% prose)
- Definition & purpose of loops (`P006-Q19a`); iterable-driven `for item in seq:` vs condition-driven `while cond:`; 6-row **`for` vs `while` Comparison Table** (`P004-Q18i`); explicit note that Python has no `do-while` statement (`while True: ... if done: break` idiom).
- Complete **`range()` Guide** (`P004-Q5`, `P005-Q2,Q5,Q22i`): `range(stop)`, `range(start, stop)`, `range(start, stop, step)`; exclusive `stop` bound; lazy memory-O(1) object materialised via `list(range(...))`; countdown `range(10, 0, -2)`; empty ranges `range(5, 2)` and `range(0, 5, -1)`.
- Concise nested-loop dry-run (3×3 multiplication table & right-triangle pattern) illustrating inner-vs-outer iteration counts.
- **Exam Program Workbench** (each `python3`-tested with sample run & iteration trace table):
  1. **Prime number checker** (`n <= 1` guard, `for d in range(2, int(n**0.5) + 1):` with idiomatic `break` + `for...else` — `P003-Q28b`, `P005-Q17iii`).
  2. **Sum of digits of an integer** (`n = abs(n)`, `digit = n % 10`, `n //= 10` — calling out why `n /= 10` produces floats, `P004-Q18ii`).
  3. **Print all elements of a tuple using a `for` loop** (direct `for x in t:` and indexed `for i, x in enumerate(t):` — `P004-Q22i`).

### 4.2 `#loop-control` [LOCKED] — `break`, `continue`, `pass` & `for...else` (Tier A · ~32% prose)
- Side-by-side execution on the exact same `for n in range(1, 6):` loop at `n == 3` (`P003-Q28a`, `P004-Q22ii`, `P005-Q8,Q15,Q17i`, `P006-Q10,Q19b`):
  - `break` → prints `1, 2` and exits innermost loop immediately.
  - `continue` → prints `1, 2, 4, 5` (skips rest of iteration 3).
  - `pass` → prints `1, 2, 3, 4, 5` (syntactic null statement used where Python grammar requires an indented suite).
- Dedicated **`for...else` & `while...else` Block** (`P004-Q22iii`): rule that `else` executes **only when the loop finishes without encountering `break`** (including on `range(0)`), shown on a linear-search found vs not-found pair.

### 4.3 `#conditionals` — `if`, `elif`, `else` & Truthiness (Tier C · ~16% prose)
- `if`, `if...else`, `if...elif...else` (why Python uses `elif`, never `else if`, and has no C-style `switch`; 1-line note on Python 3.10+ `match-case` — `P006-Q8`), nested `if`, conditional expression `x if cond else y`.
- Falsy values list (`False`, `None`, `0`, `0.0`, `0j`, `""`, `[]`, `()`, `{}`, `set()`) and clean grading / sign-classification script (`P004-Q2,Q16iii`).

### 4.4 Practice & Revision Bank
- `9` MCQs (4 `range`/loop traces, 4 `break`/`continue`/`pass`/`for-else`, 1 `elif`/truthiness), `4` short answers, and `4` worked 8m multi-part problems.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) Side-by-side control flow of `break` vs `continue` vs `pass` inside a `for` loop; (2) `for...else` exit path (normal exhaustion → `else` vs `break` → skip `else`).
- [ ] **Runnable `python3` scripts (7):** grade ladder (`if-elif-else`); `range()` variants table; nested loop grid; prime check (`for...else`); sum of digits; tuple iteration; `break`/`continue`/`pass` side-by-side demo.
- [ ] **Comparison tables (3):** `for` vs `while` loop; `break` vs `continue` vs `pass`; `if-elif-else` vs conditional expression.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST213/index.html`, PDF pp. 16–18)

| `CST213` Practical Area | Unit 2 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 4:** Conditionals and loops | `#conditionals`, `#loops`, `#loop-control` | Direct 1:1 lab match — link from `#loops` & `#practice` for prime check, digit sum, `range()`, and `if-elif-else` lab scripts |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Python `for` & `while` Loops, `range(start, stop, step)` & Prime / Digit-Sum Traces | **Tier A/B** (`36m`) | `#loops` | Python 3.x; covers negative steps, `for` vs `while`, and dry-runs; 18–35 min; verify live |
| **2** | Python `break`, `continue`, `pass` and the `for...else` Clause Explained | **Tier A** (`21m`) | `#loop-control` | Clearly contrasts `continue` vs `pass` and `break` vs `for...else`; 10–20 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 2 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P004-Q2`, `P006-Q8` | 2m, 2m | U2 `Conditionals` | Unmatched | `#if-elif-else-conditionals` — *Decision Making with `if`, `elif` and `else` Conditionals* |
| `P004-Q5`, `P005-Q22` *(part i)* | 2m, 8m | U1 `range() / lists`; U2 `range() / string formatting / mutability` | Unmatched | `#for-loops-while-loops-and-range` — *`for` Loops, `while` Loops and `range()` Sequences* |
| `P004-Q18`, `P005-Q17` *(part iii)* | 8m, 8m | U2 `Loops / digit sum`; U2 `Loop control / list vs dict / prime program` | Unmatched | `#prime-program-digit-sum-and-tuple-loops` — *Loop Programs: Prime Program, Digit Sum and Tuple Iteration* |
| `P005-Q8`, `P005-Q15` | 2m, 2m | U2 `Pass statement`; U2 `while loop / break` | Unmatched | `#break-continue-and-pass-statements` — *Loop Control: `while` Loop, `break`, `continue` and `pass` Statement* |
| `P004-Q22` | 8m | U2 `Tuples / pass / for-else` | Unmatched | `#for-else-and-pass-with-tuples` — *`for-else` Clause, `pass` and Iterating Tuples* |
