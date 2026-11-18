# CST201 Unit 2 — Decision & Loop Control Statements

> **Target file:** `subjects/CST201/units/unit-2.html` (shipped: **`7,532w`** — owner-approved overrun over the `~6,200–6,800w` target, see `record.md` §6.1)  
> **Syllabus (`syllabus.json`, PDF p. 3):** **5 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`95 / 395` marks (`24.1%`, #2 in C — #1 in Group B long-answer marks at `87m`!)** · avg **`23.8m/paper`** · **`4/4` papers** · **`8m` MCQ + `87m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#loops`, `#jump`  
> **Existing `<section id>`s to preserve (14):** `overview`, `decision`, `switch`, `goto`, `loops`, `jump`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (5):** `overview-decision-making`, `overview-switch-case`, `overview-goto-statement`, `overview-loops`, `overview-jump-statements`

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 3)
- **Decision Making and Branching:**
  - Decision making with `if` statement: simple `if`, `if...else`, nesting of `if...else`, `else if` ladder.
  - The `switch` statement.
  - The `?:` conditional operator *(cross-linked to Unit 1 `#operators`)*.
  - The `goto` statement.
- **Decision Making and Looping:**
  - Entry-controlled `while` statement, exit-controlled `do` (`do...while`) statement, and `for` statement.
  - Jumps in loops (`break` and `continue`) and nested loops.

> **Syllabus-Boundary Note:** Zero `0m` Tier S topics and zero out-of-syllabus Tier E topics — **100% of Unit 2's syllabus is actively tested** in Group B across `2023–2026`.

---

## 2. Current Page Audit & Gaps (`subjects/CST201/units/unit-2.html`)
- **Live metrics:** `5,406` words · `36` `<pre>` blocks · `6` `<table>`s · `0` `<svg>`s · `10` MCQs · `8` short Qs · `3` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#decision` `473w`, `#switch` `337w`, `#goto` `188w`, `#loops` `718w`, `#jump` `235w` (`1,951w` concept prose).
- **Specific gaps to fix:**
  1. `#loops` earns **`52m` (`13.2%` of the entire C exam — #1 topic cluster in C!)** but has only `718w` and omits several recurring 2023–2026 benchmark programs: factorial reciprocal series `1/1! + ... + 1/n!` (`P005-Q21b`), cumulative triangular sum `1 + (1+2) + ... + (1+...+n)` (`P006-Q18b`), Armstrong range `100..1000` (`P004-Q23b`), and descending-start pattern `5 / 45 / 345 / 2345 / 12345` (`P003-Q28b`).
  2. `#decision` lacks the nested `if-else` flowchart explicitly asked in `P005-Q17a` (`0` SVGs today), the 5-subject percentage/grade ladder (`P003-Q27b`), and divisibility by 5 & 11 (`P003-Q26b`).
  3. Only `3` long questions today despite `87m` of Group B exam weight — expand to `6` worked 8m pairs with variable dry-run trace tables.
  4. **9 Unit 2 `2023–2026` PYQ questions are currently unmatched** (`P003-Q21,Q26,Q28`, `P004-Q23`, `P005-Q5,Q17`, `P006-Q8,Q17,Q24`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`95m`)

| Topic Cluster | Marks | % of U2 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Loops (`for`, `while`, `do-while`) & classic number / series / pattern programs** | **52m** | **54.7%** | **13.2%** | **4/4** | **Tier A** | `P003-Q10` (1m), `P003-Q26a(4m GCD)`, `P003-Q27a(3m for vs while)`, `P003-Q28b(5m pattern 5/45/../12345)`; `P004-Q17a(4m GCD)`, `P004-Q22b(4m Fibonacci loop)`, `P004-Q23b(4m Armstrong 100..1000)`; `P005-Q13` (2m), `P005-Q18a(3m while vs do-while)`, `P005-Q18b(5m digit sum)`, `P005-Q21b(6m sum 1/1!+..+1/n!)`; `P006-Q17b(3m do-while vs while)`, `P006-Q17c(3m GCD)`, `P006-Q18b(5m sum 1+(1+2)+..+(1..n))` |
| **Decision making (`if`, `if-else`, nested `if`, `else-if`) & branching programs** | **25m** | **26.3%** | **6.3%** | **4/4** | **Tier A** | `P003-Q26b(4m divisible by 5 & 11)`, `P003-Q27b(5m 5-subject % & grade)`; `P004-Q16b(3m if-else program)`; `P005-Q17a(3m nested if-else flowchart)`, `P005-Q17b(5m max of 3 ints)`; `P006-Q17a(2m nested if-else)`, `P006-Q24c(3m leap year)` |
| **Jump statements (`break`, `continue`, `goto`) & structured flow** | **11m** | 11.6% | 2.8% | 3/4 | **Tier B** | `P003-Q21` (1m `continue`), `P003-Q28a(3m goto use + example)`; `P005-Q5` (2m avoiding `goto` in structured programming); `P006-Q8` (2m loop control), `P006-Q16b(3m break & goto)` |
| **`switch-case` multi-way selection** | **7m** | 7.4% | 1.8% | 2/4 | **Tier C** | `P004-Q23a(4m switch-case program)`; `P006-Q18a(3m switch-case + example)` |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#loops` [LOCKED] — `for`, `while`, `do-while` & Exam Program Workbench (Tier A · ~54% prose)
- Syntax, control-flow order, and full comparison tables for **`for` vs `while`** (`P003-Q27a`) and **entry-controlled `while` vs exit-controlled `do-while`** (`P005-Q18a`, `P006-Q17b` — minimum executions `0` vs `1`, trailing `;` syntax).
- Loop-trap box: stray semicolon `for(...);`, off-by-one `<=` vs `<`, `for(;;)` infinite loop, zero-trip condition (`P003-Q10`, `P005-Q13`).
- **Seven-Program Exam Workbench** (each with `gcc -std=c99` source, sample I/O, and 3-row variable dry-run):
  1. **GCD of two positive integers** via Euclidean `while (b != 0)` — hit `3/4` papers (`P003-Q26a`, `P004-Q17a`, `P006-Q17c`), plus 1-line `LCM = (a / gcd) * b`.
  2. **Sum of digits of an integer** using `n % 10` and `n /= 10` (`P005-Q18b`, handling negative input cleanly).
  3. **Armstrong numbers in `100..1000`** (`P004-Q23b`, printing `153, 370, 371, 407`).
  4. **Iterative Fibonacci series** (`n` terms, `P004-Q22b`).
  5. **Reciprocal factorial series** `sum = 1/1! + 1/2! + ... + 1/n!` (`P005-Q21b`, highlighting `1.0 / fact` to avoid integer division `0`).
  6. **Triangular cumulative sum** `s = 1 + (1+2) + (1+2+3) + ... + (1+...+n)` (`P006-Q18b`, both nested loop and running-`term` `O(n)` version).
  7. **Nested-loop pattern** `5 / 45 / 345 / 2345 / 12345` (`P003-Q28b`, teaching outer `i = 5..1`, inner `j = i..5` invariant).

### 4.2 `#decision` — `if`, `if-else`, Nested `if` & `else-if` Ladder (Tier A · ~26% prose)
- Syntax and control rules for simple `if`, `if-else`, nested `if-else` **with inline accessible SVG flowchart** (`P005-Q17a`, `P006-Q17a`), dangling-`else` binding to nearest unmatched `if`, and `else-if` ladder; brief cross-link to Unit 1 `#conditional-ternary-operator`.
- Four runnable branching programs:
  - Largest of three integers (`P005-Q17b`).
  - Divisibility by both `5` and `11` (`P003-Q26b`).
  - Five-subject percentage and letter-grade calculator (`P003-Q27b`).
  - Full Gregorian leap-year check `(y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)` (`P006-Q24c`).

### 4.3 `#jump` [LOCKED] & `#goto` — `break`, `continue` & `goto` (Tier B · ~12% prose)
- Side-by-side trace on `i = 1..5` skipping/stopping at `i == 3`: `break` exits innermost loop/`switch`; `continue` skips rest of iteration (jumps to update in `for`, directly to condition in `while`/`do-while` — `P003-Q21`, `P006-Q8`).
- `goto label;` forward/backward syntax, legitimate deep-nested error-exit snippet (`P003-Q28a`, `P006-Q16b`), and why structured programming avoids spaghetti `goto` (`P005-Q5`).

### 4.4 `#switch` — Multi-Way Branching (Tier C · ~8% prose)
- Integral constant expression rules (accepts `int`/`char`/enum; rejects `float`, strings, variable cases, duplicate values), role of `break`, deliberate fall-through, optional `default`, `switch` vs `else-if` table, and a clean menu calculator / weekday program (`P004-Q23a`, `P006-Q18a`).

### 4.5 Practice & Revision Bank
- `8` MCQs, `5` short answers, and `6` complete 8m program pairs mirroring the exact 2023–2026 Group B style.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [x] **Inline SVGs (2):** (1) Nested `if-else` decision flowchart (`P005-Q17a`); (2) Entry-controlled `while` vs exit-controlled `do-while` loop flowchart.
- [x] **Programs (12 `gcc -std=c99 -Wall -Wextra` verified):** 7 loop programs + 4 `if-else` programs + 1 `switch-case` calculator (plus `break`/`continue`/`goto` snippets).
- [x] **Comparison tables (4):** `for` vs `while`; `while` vs `do-while`; `break` vs `continue` vs `goto`; `switch` vs `else-if` ladder.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST211/index.html`, PDF p. 14)

| `CST211` Practical Area | Unit 2 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 3:** Decision making and branching programs | `#decision`, `#switch` | Link from `#decision` for max-of-3, leap-year, grade-ladder, and `switch` calculator lab practice |
| **Area 4:** Loop programs (GCD, LCM, series, patterns, primes, Armstrong) | `#loops`, `#jump` | Direct 1:1 overlap with all 7 workbench programs; cross-link prominently in `#loops` & `#practice` |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | C Loops (`for`, `while`, `do-while`) + Dry-Runs for GCD, Digit Sum, Armstrong & Fibonacci | **Tier A** (`52m`) | `#loops` | Shows iteration-by-iteration variable tables & `while` vs `do-while`; 20–40 min; verify live |
| **2** | Nested Loops, Series Summation & Number Triangle Pattern Logic in C | **Tier A** (sub-cluster) | `#loops` | Teaches row/column index derivation rather than rote memorisation; 15–30 min; plain `<a>` only |
| **3** | Nested `if-else` Flowchart, `switch-case`, `break`, `continue` & `goto` in C | **Tier A/B** (`43m`) | `#decision` | Covers flowchart, fall-through, and `break` vs `continue` loop trace; 15–30 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 2 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P005-Q17`, `P006-Q17` | 8m, 8m | U2 `Conditionals / flowchart`; U2 `Conditionals / loops / GCD` | Unmatched | `#conditionals-and-flowchart` — *Nested `if-else` Conditionals and Flowchart* |
| `P003-Q26` | 8m | U2 `GCD / divisibility` | Unmatched | `#gcd-armstrong-and-divisibility` — *GCD, Divisibility and Armstrong Number Programs* |
| `P004-Q23` | 8m | U2 `Switch / Armstrong numbers` | Unmatched | `#switch-and-menu-programs` (*`switch` Statement Programs*) + `#gcd-armstrong-and-divisibility` |
| `P003-Q28` | 8m | U2 `goto / nested loops` | Unmatched | `#series-and-nested-loops` — *Series Summation and Nested Loops for Patterns* (plus `#goto`) |
| `P003-Q21`, `P005-Q5`, `P006-Q8` | 1,2,2m | U2 `Control flow / continue`; U2 `Structured programming`; U2 `Loop control` | Unmatched | `#loop-control-break-continue` — *Loop Control Flow (`break`, `continue`) and Structured Programming* |
| `P006-Q24` *(part c)* | 8m (3m U2) | U2 `Conditional operator / parameters / leap year` | Unmatched | `#divisibility-grading-and-leap-year` — *Divisibility, Grading and Leap Year Programs* |
| `P004-Q22` *(part b)* | 8m (4m U2) | U3 `Recursion / loops` | Redirect `U3→U2#overview-loops` | Keep U2 iterative Fibonacci in `#loops`; U4 `#recursion-and-iterative-loops` resolves recursive half |
