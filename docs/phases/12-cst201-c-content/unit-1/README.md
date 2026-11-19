# CST201 Unit 1 — Introduction to C

> **Target file:** `subjects/CST201/units/unit-1.html` (shipped: **`6,389w`**, inside the `~5,800–6,400w` band — see `record.md` §6)  
> **Syllabus (`syllabus.json`, PDF p. 3):** **5 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`86 / 395` marks (`21.8%`, #3 in C — #1 in Group A MCQs at `62m`!)** · avg **`21.5m/paper`** · **`4/4` papers** · **`62m` MCQ + `24m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#operators`, `#typecasting`  
> **Existing `<section id>`s to preserve (14):** `overview`, `history`, `fundamentals`, `operators`, `typecasting`, `io`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (5):** `overview-history-files`, `overview-fundamentals`, `overview-operators`, `overview-type-conversion`, `overview-i-o-functions`

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 3)
- **History & Program Execution:** History of C; Structure of a C Program; Compilers & Linkers; Header and Library files.
- **Tokens, Variables & Constants:** Character Set; C Tokens — Keywords and Identifiers; Constants, Variables, Data Types & Storage; Declaration of Variables; Assigning Value to Variables; Defining Symbolic Constants; Declaring a Variable as Constant (`const`).
- **Operators & Expressions:** Arithmetic, Relational, Logical, Assignment, Increment/Decrement, Conditional (`?:`), Bitwise, and Special operators (`sizeof`, comma); Evaluation of Expressions; Precedence of Arithmetic Operators.
- **Conversions & Precedence:** Type Conversions in Expressions (implicit & explicit); Operator Precedence and Associativity.
- **Console I/O:** Unformatted Input/Output (`getchar`, `putchar`, `fgets`, `puts`) and Formatted Input/Output (`printf`, `scanf`).

> **Syllabus-Boundary Note:** Preprocessor macro substitution (`#define SQR(x) x*x`) is not listed as a separate syllabus topic, but `#` directives and unparenthesized macro expansion appeared for `3m` (`P003-Q17`, `P005-Q2`) — cover via a compact, explicitly badged **Tier E** callout inside `#history`. File handling (`fopen`) and `argc/argv` are absent (`0m`) — omit.

---

## 2. Current Page Audit & Gaps (`subjects/CST201/units/unit-1.html`)
- **Live metrics:** `5,418` words · `16` `<pre>` blocks · `16` `<table>`s · `0` `<svg>`s · `10` MCQs · `8` short Qs · `3` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#history` `408w`, `#fundamentals` `482w`, `#operators` `849w`, `#typecasting` `264w`, `#io` `291w` (`2,294w` concept prose vs `3,124w` overview/reference/practice).
- **Specific gaps to fix:**
  1. `#operators` carries **50.0% of Unit 1's marks (`43m`)** across 21 questions, yet misses explicit dry-runs for `%` on floats (`P003-Q20`, `P004-Q12`, `P006-Q3`), max-munch `a+++b` (`P006-Q9`), comma precedence `x = (1,2,3)` vs `x = 1,2,3` (`P005-Q3`), unsequenced `x++` UB (`P005-Q4`), and unparenthesized `#define SQR(3+2) = 11` (`P005-Q2`).
  2. `#history` lacks a visual `.c → .i → .s/.o → executable` diagram (`P003-Q22`) and a side-by-side **header file vs library file** table (`P005-Q16a`, `P006-Q16a`).
  3. `#fundamentals` needs an explicit 16-bit (`int = 2B`) vs 32/64-bit (`int = 4B`) size table so students handle both WBSCTE MCQ styles (`P003-Q2`, `P004-Q4`, `P005-Q6`, `P006-Q2`).
  4. Zero authored `<h3 id>`s outside `#overview`, leaving **14 Unit 1 `2023–2026` PYQ questions unmatched** (`P003-Q5,Q7,Q14,Q17,Q22`, `P004-Q2,Q10,Q11`, `P005-Q2,Q4,Q14`, `P006-Q1,Q3,Q9,Q16`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`86m`)

| Topic Cluster | Marks | % of U1 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Operators, precedence, `++/--`, `%`, `?:` & bitwise** | **43m** | **50.0%** | **10.9%** | **4/4** | **Tier A** | `P003-Q9,Q20,Q24,Q25` (4×1m); `P004-Q6,Q7,Q9,Q10,Q12,Q13,Q14,Q15` (8×2m); `P005-Q1,Q3,Q4` (3×2m), `P005-Q16b(4m),Q16c(2m)`; `P006-Q3,Q4,Q9` (3×2m), `P006-Q16b(2m bitwise)`, `P006-Q24a(3m ternary)` |
| **Tokens, identifiers, keywords, data types & `sizeof`** | **21m** | **24.4%** | **5.3%** | **4/4** | **Tier A** | `P003-Q2,Q14,Q15,Q16,Q19` (5×1m); `P004-Q2,Q3,Q4` (3×2m); `P005-Q6,Q14` (2×2m); `P006-Q1,Q2,Q5` (3×2m) |
| **C history, structure, compilation, headers & comments** | **13m** | 15.1% | 3.3% | **4/4** | **Tier B** | `P003-Q7,Q13,Q22` (3×1m); `P004-Q16a(2m comments)`, `P004-Q21c(3m Hello World + headers)`; `P005-Q16a(2m header vs library)`; `P006-Q16a(3m header + comments)` |
| **Formatted I/O (`printf`/`scanf`), ASCII & escape sequences** | **4m** | 4.7% | 1.0% | 1/4 | **Tier C** | `P003-Q5` (1m escape sequence), `P003-Q33a` (3m program printing ASCII value of a character) |
| **Preprocessor `#include` & `#define` macros** | **3m** | 3.5% | 0.8% | 2/4 | **Tier E** | `P003-Q17` (1m `#` preprocessor), `P005-Q2` (2m `#define SQR(x) x*x` on `SQR(3+2) = 11`) |
| **Type conversions & explicit typecasting** | **2m** | 2.3% | 0.5% | 1/4 | **Tier C** | `P004-Q11` (2m default C89 implicit return type `int`) |
| **Unformatted console I/O (`getchar`, `putchar`, `fgets`, `puts`)** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 3), 0 hits in 2023–2026_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#history` — C Program Structure, Build Pipeline & Headers (Tier B + Tier E · ~15% prose)
- Brief origin note (Dennis Ritchie, Bell Labs, 1972) and annotated `Hello World` explaining `#include <stdio.h>`, `int main(void)`, statement `;`, and `return 0;` (`P004-Q21c`).
- Four-stage translation flow `hello.c → preprocessor (.i) → compiler (.s / .o) → linker + libc → executable` (`P003-Q7,Q22`).
- Side-by-side **Header File (`.h` declarations/prototypes) vs Library File (`.a`/`.so`/`.lib` compiled implementations)** table (`P005-Q16a`, `P006-Q16a`), plus `/* ... */` block (non-nesting) vs `//` C99 single-line comments (`P004-Q16a`, `P006-Q16a`).
- Badged **Tier E Exam Note (`3m`):** `#` preprocessor runs before compilation (`P003-Q17`); trace textual macro trap `#define SQR(x) x*x` giving `SQR(3+2) → 3 + 2 * 3 + 2 = 11` vs parenthesized `#define SQR(x) ((x)*(x)) = 25` (`P005-Q2`).

### 4.2 `#fundamentals` — Tokens, Identifiers, Keywords, Types & Constants (Tier A · ~25% prose)
- C character set & 6 token types (keywords, identifiers, constants, string literals, operators, punctuators).
- Identifier formation rules + valid vs invalid exam gallery (`_count`, `sum2` valid vs `$main`, `1num`, `total-sum`, `float` invalid — `P003-Q14`, `P004-Q2`, `P005-Q14`, `P006-Q1`).
- C89's **32 keywords** table with a one-line C99 (`+5`) / C11 (`+7`) note (`P003-Q19`).
- Primitive types (`char`, `int`, `float`, `double` + `short`, `long`, `signed`, `unsigned`) showing both classic 16-bit (`int = 2B`) and modern 32/64-bit (`char = 1B`, `int = 4B`, `float = 4B`, `double = 8B`) sizes & ranges (`P003-Q2`, `P004-Q4`, `P005-Q6`, `P006-Q2`).
- Variable declaration vs initialization, `'A'` (1-char integer constant) vs `"A"` (2-byte string `'A','\0'`), and `const` variable vs `#define` symbolic constant table.

### 4.3 `#operators` [LOCKED] — All 8 Operator Classes & Precedence (Tier A · ~48% prose)
- **Arithmetic & modulo:** integer truncation `7 / 2 == 3`, `%` legal **only on integer types** (compile error on `float`/`double`), sign of `a % b` follows dividend (`P003-Q20`, `P004-Q12`, `P006-Q3`).
- **Relational & assignment:** `=` (stores & yields assigned value) vs `==` (yields `0`/`1`) comparison table + `if (x = 5)` always-true trap (`P005-Q16c`); compound `+=, -=, *=, /=, %=`.
- **Logical:** `!`, short-circuit `&&` (RHS skipped if LHS is `0`) and `||` (RHS skipped if LHS is non-zero) with side-effect traces (`P004-Q13,Q14`).
- **Increment/decrement & lexer rule:** `++x` vs `x++` dry-run, maximal-munch tokenization `a+++b → (a++) + b` (`P006-Q9`), and explicit C99/C11 undefined-behaviour alert on unsequenced `x++ + ++x` (`P005-Q4`).
- **Conditional (ternary) `cond ? e1 : e2`:** syntax, nesting, and runnable max-of-two/three snippet (`P004-Q10`, `P006-Q24a`).
- **Bitwise `&`, `|`, `^`, `~`, `<<`, `>>`:** 8-bit truth table and worked binary traces (`5 & 3`, `5 | 3`, `5 ^ 3`, `5 << 1`, `20 >> 2` — `P004-Q15`, `P006-Q16b`).
- **Special operators:** compile-time `sizeof` (operand not evaluated except VLAs) and comma operator precedence (`x = (1, 2, 3)` sets `x = 3` vs `x = 1, 2, 3` sets `x = 1` — `P005-Q3`).
- **Complete Operator Precedence & Associativity table** + 3 step-by-step parenthesization and evaluation traces (`P003-Q9`, `P005-Q16b`).

### 4.4 `#typecasting` [LOCKED] — Implicit Promotion & Explicit Casts (Tier C · ~5% prose)
- Usual arithmetic conversion ladder (`char/short → int → unsigned int → long → float → double`), assignment narrowing truncation, explicit `(double)sum / count`, and historical C89 default `int` return type note (removed in C99 — `P004-Q11`).

### 4.5 `#io` — Formatted & Unformatted Console I/O (Tier C + Tier S · ~7% prose)
- `printf`/`scanf` specifiers (`%d`, `%i`, `%u`, `%ld`, `%f`, `%lf`, `%c`, `%s`, `%p`), field-width/precision (`%6.2f`), why `scanf` needs `&var`, escape sequences (`\n`, `\t`, `\r`, `\\`, `\"`, `\0` — `P003-Q5`), and runnable program printing a character's ASCII code (`P003-Q33a`).
- Compact **Tier S** summary table (~120w) of `getchar()`, `putchar()`, `fgets()`, and `puts()` (noting `gets()` removal in C11).

### 4.6 Practice & Revision Bank
- `12` MCQs (7 operators/precedence/`%`/`++/--`/comma/macro, 4 identifiers/keywords/`sizeof`, 1 headers/escape), `5` short answers, and `4` full 8m multi-part solutions covering header-vs-library + precedence + `=`/`==`, bitwise + comments, ternary program, and Hello World + ASCII value.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [x] **Inline SVG:** 4-stage C compilation & linking pipeline (`hello.c → .i → .s → .o + libc → a.out`) using CSS theme tokens.
- [x] **Programs (`gcc -std=c99 -Wall -Wextra`):** annotated `Hello World`; ASCII code of input char (`P003-Q33a`); ternary max program (`P006-Q24a`); bitwise operators demo (`P006-Q16b`); precedence/comma/cast demo; `#define SQR` safe vs unsafe demo.
- [x] **Comparison tables:** Header (`.h`) vs Library file; `const` vs `#define`; `=` vs `==`; `++x` vs `x++`; Logical (`&&`,`||`) vs Bitwise (`&`,`|`); Formatted vs Unformatted I/O; 16-bit vs 32/64-bit type sizes.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST211/index.html`, PDF p. 14)

| `CST211` Practical Area | Unit 1 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 1:** Familiarisation with programming environment (editor, compiler) | `#history` | Link from `#practice` for compiling & linking `.c` files with `gcc` |
| **Area 2:** Formatted input and output (number formats, justification, specifiers) | `#io`, `#typecasting` | Link from `#io` / `#practice` for `printf` width/precision & `scanf` specifier drills |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | C Operators, Precedence, Associativity, `%`, Comma & `++/--` Dry-Runs | **Tier A** (`43m`) | `#operators` | Clear step-by-step whiteboard/IDE traces; flags unsequenced UB accurately; 15–35 min; verify HTTP 200 & active video |
| **2** | Bitwise Operators (`&`, `\|`, `^`, `~`, `<<`, `>>`) & Ternary `?:` in C | **Tier A** (sub-cluster) | `#operators` | Binary bit-level examples matching 8-bit exam sums; 10–25 min; plain `<a target="_blank" rel="noopener noreferrer">` |
| **3** | C Program Structure, Compilation Pipeline, Tokens, Identifiers & Data Types | **Tier A/B** (`34m`) | `#history` | Covers `.c → .i → .s → .o → exe`, `.h` vs library, keywords, and `sizeof`; no `<iframe>` or `i.ytimg.com` |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 1 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q7`, `P006-Q16` | 1m, 8m | U1 `Headers`; U1 `Headers / comments / operators` | Unmatched | `#headers-and-library-files` — *Headers, Library Files and Comments in C* |
| `P004-Q16` *(part a)* | 8m (2m U1) | U3 `Comments / conditionals / modular programming` | Unmatched | `#headers-and-library-files` (or U4 `#modular-programming-and-functions`) |
| `P003-Q22` | 1m | U1 `Compilation process` | Unmatched | `#compilation-process` — *Compilation Process, Compiler and Linker* |
| `P003-Q17`, `P005-Q2` | 1m, 2m | U1 `Preprocessor`; U1 `Preprocessor / macros` | Unmatched | `#preprocessor-and-macros` — *Preprocessor Directives and `#define` Macros* |
| `P003-Q14`, `P004-Q2`, `P005-Q14`, `P006-Q1` | 1,2,2,2m | U1 `Identifiers` / `Identifiers / variables` / `C identifiers` | Unmatched | `#identifiers-and-keywords` — *C Identifiers, Keywords and Variables* |
| `P006-Q3` | 2m | U1 `Modulo operator` | Unmatched | `#modulo-and-arithmetic-operators` — *Arithmetic and Modulo Operator* |
| `P004-Q10`, `P006-Q24` *(part a)* | 2m, 8m | U2 `Conditional operator / statements`; U2 `Conditional operator / parameters / leap year` | Unmatched | `#conditional-ternary-operator` — *Conditional (Ternary) Operator Statements* |
| `P005-Q4`, `P006-Q9` | 2m, 2m | U1 `Evaluation order / undefined behavior`; U2 `Operator parsing` | Unmatched | `#operator-precedence-and-parsing` — *Operator Precedence, Operator Parsing, Evaluation Order and Undefined Behavior* |
| `P004-Q11` | 2m | U3 `Functions / return type` | Unmatched | `#implicit-and-explicit-conversions` (plus U4 `#return-type-and-return-values`) |
| `P003-Q5` | 1m | U1 `Strings / escape sequences` | Unmatched | `#escape-sequences-and-ascii` — *Formatted I/O, Escape Sequences and ASCII Values* |
