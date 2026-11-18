# CST201 Unit 4 — Functions in C

> **Target file:** `subjects/CST201/units/unit-4.html` (current: `6,749w` → target: **`~6,500–7,200w`**)  
> **Syllabus (`syllabus.json`, PDF p. 3):** **7 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`) — official Unit 4 *(swapped with Unit 3 in legacy `_data`/`_quiz-data` tags)*  
> **2023–2026 Exam Weight (`P003–P006` only):** **`97 / 395` marks (`24.6%`, #1 HIGHEST-WEIGHT UNIT IN C)** · avg **`24.2m/paper`** · **`4/4` papers** · **`17m` MCQ + `80m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#parameters`, `#recursion`  
> **Existing `<section id>`s to preserve (15):** `overview`, `functions-intro`, `components`, `scope`, `parameters`, `return`, `recursion`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (5):** `overview-function-basics`, `overview-scope-storage`, `overview-parameter-passing`, `overview-return-values`, `overview-recursion`

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 3)
- **Concept of Function:** Why are functions needed (modular programming)? Using functions; library vs user-defined functions; function prototype (declaration); function definition; calling a function.
- **Scope & Storage Classes:** Local and global variables; lifetime, visibility, default initialization, and C storage classes (`auto`, `register`, `static`, `extern`).
- **Passing Parameters:** Actual vs formal parameters; Call by Value; Call by Reference (call by address using pointers); Passing Arrays to Functions.
- **Return, Nesting & Recursion:** Return values and `void`; nesting of functions; recursion (base case, call stack, recursion vs iteration).

---

## 2. Current Page Audit & Gaps (`subjects/CST201/units/unit-4.html`)
- **Live metrics:** `6,749` words · `27` `<pre>` blocks · `14` `<table>`s · `0` `<svg>`s · `12` MCQs · `8` short Qs · `3` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#functions-intro` `178w`, `#components` `484w`, `#scope` `562w`, `#parameters` `533w`, `#return` `273w`, `#recursion` `946w` (`2,976w` concept prose).
- **Specific gaps to fix:**
  1. **Inverted internal emphasis:** `#scope` drives **`35m` (`36.1%` of Unit 4, `4/4` papers)** yet has only `562w`, while `#recursion` (`19m`) takes `946w`. Expand `#scope` with runnable `auto`/`register`/`static`/`extern` examples, global zero-init (`P004-Q1`), and the `typedef` grammar-specifier trap (`P003-Q12`).
  2. `#functions-intro` (`178w`) and `#components` (`484w`) need explicit exam tables for **library vs user-defined** (`P006-Q21a`), **declaration vs definition vs call** (`P005-Q20b`), **actual vs formal parameters** (`P005-Q20c`, `P006-Q24b`), modular programming (`P004-Q16c`), and the **primes-in-interval function program** (`P003-Q33b`).
  3. Only `3` long questions today despite `80m` of Group B weight — expand to `5` complete 8m solutions, and add `2` inline SVGs (call-by-value vs call-by-address + recursion stack frames).
  4. **3 wrong-unit redirects** (`P005-Q15 → U1#fundamentals`, `P006-Q6 → U5#overview-functions`, `P006-Q21 → U1#overview-i-o-functions`) and **3 unmatched items** (`P003-Q33`, `P004-Q1`, `P004-Q16`) need exact `<h3 id>` anchors in Unit 4.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`97m`)

| Topic Cluster | Marks | % of U4 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Storage classes (`auto`, `extern`, `static`, `register`) & local/global scope** | **35m** | **36.1%** | **8.9%** | **4/4** | **Tier A** | `P003-Q12` (1m `typedef` not object storage), `P003-Q30a(4m)`; `P004-Q1` (2m global init `0`), `P004-Q8` (2m `auto` default), `P004-Q17b(4m)`, `P004-Q19b(4m)`; `P005-Q12` (2m default storage), `P005-Q15` (2m `static` lifetime), `P005-Q23a+b(8m)`; `P006-Q14` (2m `register` in CPU register), `P006-Q19a(4m)` |
| **Function basics, modular design, prototype vs definition, actual/formal params & `return`** | **29m** | **29.9%** | **7.3%** | **4/4** | **Tier A** | `P003-Q4,Q18,Q23` (3×1m), `P003-Q33b(5m primes in interval via function)`; `P004-Q16c(3m modular programming)`; `P005-Q20a(3m advantages),Q20b(2m decl vs def),Q20c(3m actual vs formal)`, `P005-Q21a(2m return)`; `P006-Q6` (2m `main()`), `P006-Q21a(4m library vs user-defined)`, `P006-Q24b(2m actual vs formal)` |
| **Recursion (GCD, Fibonacci, factorial) & recursion vs iteration** | **19m** | 19.6% | 4.8% | **4/4** | **Tier A** | `P003-Q11` (1m call stack); `P004-Q21b(2m recursion vs iteration)`, `P004-Q22a(4m recursive Fibonacci)`; `P005-Q22a(3m recursion + example),Q22b(5m recursive GCD)`; `P006-Q21b(4m recursive factorial)` |
| **Parameter passing: call by value vs call by address/reference** | **14m** | 14.4% | 3.5% | 3/4 | **Tier B** | `P003-Q30b(4m call by value vs call by address)`; `P005-Q24b(6m call-by-value & call-by-address w/ example)`; `P006-Q19b(4m call by value vs call by reference w/ example)` |
| **Passing arrays to functions & nesting of functions** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 3), 0 direct marks in 2023–2026_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#scope` — Storage Classes & Local/Global Scope (Tier A · ~34% prose)
- Local (block), parameter, and global (file) scope rules; variable shadowing demo; default initialization contrast (globals & `static` zero-initialized to `0`/`0.0`/`'\0'`/`NULL` vs `auto`/`register` indeterminate garbage — `P004-Q1`).
- **Master 4-Storage-Class Table** (`auto`, `register`, `static` [block persistence & file internal linkage], `extern`) with columns: Keyword, Storage Area (RAM vs CPU register hint — `P006-Q14`, why `&r` is illegal), Default Initial Value, Scope, Lifetime, and Typical Use (`P003-Q30a`, `P004-Q8,Q17b,Q19b`, `P005-Q12,Q15,Q23`, `P006-Q19a`).
- Runnable short demos for `static` call counter, `extern` cross-scope access, `auto`, and `register`.
- Exam trap callout: `typedef` sits in C's storage-class-specifier grammar slot for syntax convenience, but defines a type alias and allocates zero runtime storage (`P003-Q12`).

### 4.2 `#functions-intro`, `#components` & `#return` — Modular Design & Function Anatomy (Tier A + Tier S · ~28% prose)
- Why modular programming matters (reusability, top-down decomposition, easier debugging, team split — `P004-Q16c`, `P005-Q20a`), entry point `main()` (`P006-Q6`), and **Library vs User-Defined Functions** comparison table (`P006-Q21a`).
- Three-part anatomy table: **Prototype (declaration, ends with `;`) vs Definition (header + body) vs Call** (`P005-Q20b`), plus **Actual Parameters (arguments at call site) vs Formal Parameters (variables in header)** table (`P005-Q20c`, `P006-Q24b`).
- `return` rules (`void` procedure vs single scalar return, multiple `return` paths, exit code from `main` — `P005-Q21a`) and complete runnable **`isPrime(int n)` printing all primes in `[low, high]`** (`P003-Q33b`).
- Compact **Tier S** subsection (~180w): nesting of function calls (`max3(a, b, c)` calling `max2`) — noting ISO C forbids nested function definitions — and passing a 1D array `int sum(const int a[], int n)` (pointer decay + explicit length parameter).

### 4.3 `#recursion` [LOCKED] — Recursion, Stack Trace & Exam Programs (Tier A · ~22% prose)
- Base case + smaller-subproblem step, activation records on the runtime call stack (`P003-Q11`), and stack-overflow hazard on missing base case.
- All **three 2023–2026 exam recursive functions** with call/return traces:
  1. `long long factorial(int n)` with base `n <= 1 → 1` (`P006-Q21b`).
  2. `int gcd(int a, int b)` via `b == 0 ? a : gcd(b, a % b)` (`P005-Q22b`).
  3. `int fib(int n)` printing `n` terms (`P004-Q22a`, noting overlapping calls).
- Side-by-side **Recursion vs Iteration** comparison table (termination, stack overhead, execution speed, code clarity — `P004-Q21b`).

### 4.4 `#parameters` [LOCKED] — Call by Value vs Call by Address (Tier B · ~16% prose)
- Step-by-step memory-box walkthrough of `swap_val(int x, int y)` (copies modified, caller `a, b` unchanged) vs `swap_ptr(int *x, int *y)` called as `swap_ptr(&a, &b)` (caller updated via dereference), noting C achieves "call by reference" through pointer addresses (`P003-Q30b`, `P005-Q24b`, `P006-Q19b`), plus a 6-row comparison table.

### 4.5 Practice & Revision Bank
- `10` MCQs (5 storage classes/scope, 3 function anatomy/`return`, 2 recursion/stack), `5` short answers, and `5` worked 8m model answers.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) Call stack frames winding & unwinding for `factorial(4)` and `gcd(48, 18)`; (2) Call by Value (copied locals) vs Call by Address (`*x`, `*y` pointing to caller `a, b`).
- [ ] **Programs (7 `gcc -std=c99 -Wall -Wextra` verified):** `static`/`extern`/local-vs-global demo; `isPrime` in `[low, high]`; `swap_val` vs `swap_ptr`; recursive `factorial`, `gcd`, and `fib`; Tier S 1D array sum function.
- [ ] **Comparison tables (6):** 4 Storage classes; Local vs Global variables; Library vs User-Defined functions; Prototype vs Definition; Actual vs Formal parameters; Call by Value vs Call by Address; Recursion vs Iteration.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST211/index.html`, PDF p. 14)

| `CST211` Practical Area | Unit 4 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 6:** Functions and parameter passing (`nCr`, series, factorial, call by value/reference, recursion) | `#functions-intro`, `#parameters`, `#recursion` | Exact 1:1 lab match — link from `#parameters` and `#recursion` for swap, factorial, GCD, and Fibonacci lab programs |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Storage Classes in C (`auto`, `register`, `static`, `extern`) — Scope, Lifetime & Memory | **Tier A** (`35m`) | `#scope` | Covers all 4 keywords, RAM vs register, default init, and static persistence; 15–30 min; verify live |
| **2** | Functions in C: Prototype, Definition, Actual vs Formal Parameters & Modular Design | **Tier A** (`29m`) | `#functions-intro` | Clean C99 prototypes (no `void main()`); covers library vs user-defined; 15–25 min; plain `<a>` |
| **3** | Recursion in C with Call-Stack Trace (Factorial, GCD, Fibonacci) vs Iteration | **Tier A** (`19m`) | `#recursion` | Draws activation frames clearly and contrasts stack cost with loops; 15–30 min; verify live |
| **4** | Call by Value vs Call by Reference (Address) in C — Pointer Swap Walkthrough | **Tier B** (`14m`) | `#parameters` | Memory-address diagram of `swap(&a, &b)` vs `swap(a, b)`; 10–20 min; zero embeds/thumbnails |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 4 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q12`, `P004-Q17`, `P005-Q12`, `P005-Q15`, `P005-Q23`, `P006-Q14` | 1–8m | U3 `Storage classes` / `Storage classes / data types` / `Storage classes / qualifiers` | Redirect (`P005-Q15` wrong → `U1#fundamentals`) | `#storage-classes-in-c` — *Storage Classes (`auto`, `register`, `static`, `extern`), Qualifiers and Data Types* |
| `P004-Q1`, `P004-Q8` | 2m, 2m | U1 `Global variables / initialization`; U1 `Scope / declarations` | `Q1` Unmatched; `Q8` → `#overview-scope-storage` | `#global-and-local-variables-initialization` — *Local and Global Variables: Scope, Declarations and Initialization* |
| `P004-Q16`, `P006-Q6` | 8m, 2m | U3 `Comments / conditionals / modular programming`; U2 `Functions` | `Q16` Unmatched; `Q6` wrong → `U5#overview-functions` | `#modular-programming-and-functions` — *Functions and Modular Programming (Library vs User-Defined)* |
| `P003-Q33` | 8m | U3 `ASCII / functions / primes` | Unmatched | `#prime-numbers-using-functions` — *Finding Prime Numbers in an Interval Using Functions* |
| `P003-Q30`, `P006-Q19` | 8m, 8m | U3 `Storage classes / parameter passing` | Redirect → `#overview-parameter-passing` | `#storage-classes-and-parameter-passing` — *Call by Value vs Call by Address Parameter Passing* |
| `P003-Q11`, `P005-Q22`, `P006-Q21` | 1,8,8m | U3 `Recursion / stack`; U3 `Recursion / GCD`; U2 `Functions / recursion` | `P006-Q21` wrong → `U1#overview-i-o-functions` | `#functions-and-recursion` — *Functions, Recursion, Call Stack, Factorial, Fibonacci and GCD* |

> *Mode B note (owner-gated):* Retagging U3 function/storage/recursion items to `unit: 4` (with `_quiz-data/CST201/unit-{3,4}.json` alignment) remains off unless explicitly authorized.
