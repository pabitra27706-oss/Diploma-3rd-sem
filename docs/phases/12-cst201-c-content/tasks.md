# Phase 12 Tasks — Computer Programming in C (6 Parts)

> **Execution order:** Weight-priority (`12.4 → 12.2 → 12.1 → 12.3 → 12.5 → 12.6`) or sequential (`12.1 → 12.6`).  
> **Weighting basis:** Strict **2023–2026 PYQ window** (`P003-2023-03`, `P004-2024-01`, `P005-2024-12`, `P006-2026-01` — `4` papers, `105` scan-verified Qs, `395` set marks; `2021–2022` `P001`/`P002` excluded).  
> **Standing rules:** Preserve every existing `<section id>`, `<h3 id>`, and locked `guides.json` anchor; zero raw `CST201`/`CST211`/`P00X` codes in student HTML; plain external `<a>` YouTube links only (verified live at execution); zero `_data/` edits in Mode A.

---

## Part 12.1 — Unit 1: Introduction to C (`86m / 21.8%`, 5h, PDF p. 3)
- **Target file:** `subjects/CST201/units/unit-1.html` (`5,418w → ~5,800–6,400w`) · Blueprint: [`unit-1/README.md`](unit-1/README.md)
- **Implementation checklist:**
  - [ ] Allocate ~48% of concept prose to **Tier A `#operators` (`43m`, 4/4 papers)**: all 8 operator groups, `%` integer-only rule, integer division truncation, `=` vs `==`, short-circuit `&&`/`||`, prefix/postfix `++/--`, max-munch `a+++b`, unsequenced `x++` UB warning, ternary `?:` + program, 8-bit bitwise traces, `sizeof`, comma operator, and ranked precedence/associativity table.
  - [ ] Allocate ~25% to **Tier A `#fundamentals` (`21m`, 4/4 papers)**: character set, 6 token classes, valid/invalid identifiers (`$main`, `1st`, `int`), C89 32 keywords (+ C99/C11 note), primitive types with 16-bit (`2B`) vs 32/64-bit (`4B`) sizes, constants, `const` vs `#define`.
  - [ ] Allocate ~15% to **Tier B `#history` (`13m`, 4/4 papers)** + badged **Tier E preprocessor callout (`3m`)**: annotated `Hello World`, inline SVG 4-stage build pipeline (`.c → .i → .s/.o → executable`), `.h` header vs library table, `/* */` & `//` comments, and `#define SQR(x) x*x` vs `((x)*(x))` trap (`SQR(3+2) = 11`).
  - [ ] Keep **Tier C `#typecasting` (`2m`)** (~5%) and **Tier C + Tier S `#io` (`4m` + `0m`)** (~7%) crisp: implicit/explicit casts, C89 implicit-`int` historical note, `printf`/`scanf` specifiers, escapes, ASCII-value program, and compact `getchar`/`putchar`/`fgets`/`puts` table.
  - [ ] Calibrate practice (`12` MCQs, `5` short, `4` worked 8m), add `8` Mode A `<h3 id>` anchors, cross-link `subjects/CST211/index.html` (Areas 1–2), and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#operators`, `#typecasting`, all `14` `<section id>`s, and `5` `overview-*` `h3` IDs intact; all snippets pass `gcc -std=c99 -Wall -Wextra -fsyntax-only`; 3 verified URLs logged in `record.md`.

---

## Part 12.2 — Unit 2: Decision & Loop Control Statements (`95m / 24.1%`, 5h, PDF p. 3)
- **Target file:** `subjects/CST201/units/unit-2.html` (`5,406w → ~6,200–6,800w`) · Blueprint: [`unit-2/README.md`](unit-2/README.md)
- **Implementation checklist:**
  - [ ] Allocate ~54% of concept prose to **Tier A `#loops` (`52m`, 4/4 papers)**: `for` vs `while` and `while` vs `do-while` comparison tables, loop-trap traces, and the 7-program workbench (Euclidean GCD, sum of digits, Armstrong `100..1000`, iterative Fibonacci, `1/1!+...+1/n!`, `1+(1+2)+...+(1..n)`, and nested pattern `5 / 45 / 345 / 2345 / 12345`) with sample I/O and dry-run tables.
  - [ ] Allocate ~26% to **Tier A `#decision` (`25m`, 4/4 papers)**: simple `if`, `if-else`, accessible inline SVG nested `if-else` flowchart, dangling-`else`, `else-if` ladder, plus 4 programs (max of 3, divisible by 5 & 11, 5-subject percentage/grade, Gregorian leap year) and `?:` cross-link to Unit 1.
  - [ ] Allocate ~12% to **Tier B `#jump` & `#goto` (`11m`, 3/4 papers)**: `break` vs `continue` trace table, `goto` label syntax + nested-exit demo, and structured-programming rationale against `goto`.
  - [ ] Allocate ~8% to **Tier C `#switch` (`7m`, 2/4 papers)**: integral selector rules, `break`/fall-through/`default`, `switch` vs `if-else` table, and calculator/day program.
  - [ ] Calibrate practice (`8` MCQs, `5` short, `6` worked 8m), add `5` Mode A `<h3 id>` anchors, cross-link `subjects/CST211/index.html` (Areas 3–4), and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#loops`, `#jump`, all `14` `<section id>`s, and `5` `overview-*` `h3` IDs intact; all 12 benchmark programs compile and match verified sample outputs; 3 verified URLs logged in `record.md`.

---

## Part 12.3 — Unit 3: Arrays & Strings (`66m / 16.7%`, 7h, PDF p. 3)
- **Target file:** `subjects/CST201/units/unit-3.html` (`5,848w → ~5,400–6,000w`) · Blueprint: [`unit-3/README.md`](unit-3/README.md)
- **Implementation checklist:**
  - [ ] Build **Tier A `#arrays-intro` (~18%) & `#2d-arrays` (~27%) (`30m`, 3/4 papers)**: contiguous memory SVG, 0-based indexing, partial/unsized initialization, advantages/limits, row-major 2D storage, and complete programs for identity-matrix check, 4×4 diagonal sum, and matrix display + transpose.
  - [ ] Trim **Tier S `#multidim` (`0m`)** to ~4% (`~150w`): `type a[p][r][c]` declaration, element count `p*r*c`, byte formula, 1 short snippet.
  - [ ] Build **Tier A `#strings` (~15%) & `#string-functions` (~18%) (`23m`, 3/4 papers)**: `'\0'` terminator diagram, `"Hello"` vs char array, `strlen` vs `sizeof`, safe `scanf`/`fgets` I/O, and complete `<string.h>` reference + demos for `strlen`, `strcpy`, `strcat`, and `strcmp`.
  - [ ] Build **Tier B `#applications` (~18%, `13m`, 3/4 papers)**: manual no-library ASCII case toggle (`±32`), two-index in-place string reverse, and string palindrome check.
  - [ ] Calibrate practice (`8` MCQs, `4` short, `5` worked 8m), add `4` Mode A `<h3 id>` anchors, cross-link `subjects/CST211/index.html` (Area 5), and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#2d-arrays`, `#strings`, all `15` `<section id>`s, and `5` `overview-*` `h3` IDs intact; all matrix/string programs compile cleanly with `gcc -std=c99 -Wall -Wextra`; 3 verified URLs logged in `record.md`.

---

## Part 12.4 — Unit 4: Functions in C (`97m / 24.6%`, 7h, PDF p. 3 — #1 C Unit)
- **Target file:** `subjects/CST201/units/unit-4.html` (`6,749w → ~6,500–7,200w`) · Blueprint: [`unit-4/README.md`](unit-4/README.md)
- **Implementation checklist:**
  - [x] Expand **Tier A `#scope` (`35m`, 4/4 papers)** to ~34% of unit prose: local/global scope, shadowing, zero-init vs garbage rule, master 4-row `auto`/`register`/`static`/`extern` table, runnable demos for each, and `typedef` specifier callout.
  - [x] Build **Tier A `#functions-intro`, `#components` & `#return` (`29m`, 4/4 papers, ~28%)**: modular programming, `main()`, library vs user-defined table, prototype vs definition vs call table, actual vs formal parameters table, `return` semantics, prime-interval `isPrime()` program, and compact **Tier S** (~180w) nested calls + passing 1D array `fn(const int a[], int n)`.
  - [x] Calibrate **Tier A `#recursion` (`19m`, 4/4 papers, ~22%)**: base case, inline SVG call-stack activation frames, recursive `factorial`, `gcd`, and `fib` programs with unwinding traces, and Recursion vs Iteration comparison table.
  - [x] Build **Tier B `#parameters` (`14m`, 3/4 papers, ~16%)**: inline SVG memory trace + runnable `swap_val` vs `swap_ptr(&a, &b)` and Call by Value vs Call by Address comparison table.
  - [x] Calibrate practice (`10` MCQs, `5` short, `5` worked 8m), add `6` Mode A `<h3 id>` anchors, cross-link `subjects/CST211/index.html` (Area 6), and insert `4` live-verified plain-`<a>` YouTube links. *(Delivered: `8` MCQs + `5` short + `5` long + `5` practice — the two dropped MCQs duplicated the storage-class table and the tail-recursion table verbatim; `9` `<h3 id>` anchors; `4` links.)*
- **Acceptance & evidence:**
  - [x] Locked `#parameters`, `#recursion`, all `15` `<section id>`s, and `5` `overview-*` `h3` IDs intact; all function/storage/recursion programs pass `gcc -std=c99 -Wall -Wextra`; 4 verified URLs logged in `record.md`. *(16/16 extracted programs compile clean with `-Wall -Wextra`; every embedded output block matches the program's real stdout.)*

---

## Part 12.5 — Unit 5: Pointers in C (`51m / 12.9%`, 6h, PDF p. 3 — Right-Sizing Pass)
- **Target file:** `subjects/CST201/units/unit-5.html` (`7,558w → ~5,000–5,600w`) · Blueprint: [`unit-5/README.md`](unit-5/README.md)
- **Implementation checklist:**
  - [ ] Lead with **Tier B `#dma` (`17m`, 3/4 papers, ~28%)**: inline SVG stack-vs-heap diagram, `<stdlib.h>` `malloc`, `calloc`, `realloc`, `free` prototypes/checks/demos, `malloc` vs `calloc` table, and static vs dynamic allocation table.
  - [ ] Consolidate **Tier B `#intro`, `#declaration`, `#types` & `#arithmetic` (`17m`, 4/4 papers, ~30%)**: pointer advantages, `&` and `*` memory diagram + demo, type-mismatch trap, `NULL`/`void*`/wild/dangling summary, scale-factor `p + k * sizeof(*p)` (4B and 2B cases), and `*p++` vs `(*p)++` vs `*++p` trace.
  - [ ] Build **Tier B `#functions` & `#arrays` (`15m`, 4/4 papers, ~24%)**: add two numbers via pointers & function, traverse 1D array via `*(arr + i)`, sum 1D array via pointer, and 3-line warning on returning `&local`.
  - [ ] Condense **Tier S `#strings`, `#array-of-ptrs`, `#function-ptrs`, `#ptr-to-ptr` (`0m`)** + **Tier C structure/union note (`2m`)** to ~18% combined (`~150–220w` + 1 snippet each, preserving all `<section id>`s); omit out-of-syllabus `argc`/`argv` and `fopen`.
  - [ ] Calibrate practice (`8` MCQs, `4` short, `4` worked 8m), add `4` Mode A `<h3 id>` anchors, cross-link `subjects/CST211/index.html` (Area 7), and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#declaration`, `#dma`, all `20` `<section id>`s, and `6` `overview-*` `h3` IDs intact; total word count inside `~5,000–5,600w`; all snippets pass `gcc -std=c99 -Wall -Wextra`; 3 verified URLs logged in `record.md`.

---

## Part 12.6 — PYQ ↔ Unit Sync, Canonical Rebuild & Gate Verification
- **Target files:** `subjects/CST201/units/unit-{1..5}.html`, `docs/revision-sheets/CST201.json` (if anchor labels shift), `assets/js/unit-discovery.js` (only if generic-section filter not yet applied), `tests/test_discovery.py`, generated indices, `docs/phases/12-cst201-c-content/record.md`, `docs/ROADMAP.md`, `docs/STATUS.md`, `prompt.md`.
- **Verification & rebuild checklist:**
  - [ ] Run the `focusQuestionTopic()` simulation across all **105 `2023–2026` C PYQs** (`P003–P006`): verify all `30` baseline unmatched items and all wrong-unit redirects (`P003-Q8`, `P005-Q11`, `P005-Q15`, `P006-Q6`, `P006-Q21`) resolve to their exact syllabus unit & heading in Mode A (`0` `_data/` edits).
  - [ ] Verify zero raw `CST201`/`CST211`/`P00\d` strings and zero `<iframe>`/`ytimg` markup in `subjects/CST201/units/unit-*.html`.
  - [ ] Run canonical `README.md:187–215` rebuild sequence (`build_suggestions.py`, `build_revision_sheets.py`, `generate_presence.py` twice for idempotence, `build_search_index.py`, `build_icon_subset.py`, `build_data_version.py` last) and update `unitAnchored` in `tests/test_discovery.py:111`.
  - [ ] Run full verification gate suite: `check_pyq_integrity.py`, `check_platform.py`, `build_suggestions.py --check`, `check_site.py --strict --quiet`, `validate_pyq.py`, `validate_data.py --check-baseline`, `validate_syllabus.py`, `audit_accessibility.py --fail`, `check_tokens.py --strict`, `build_icon_subset.py --check`, `build_data_version.py --check`, `audit_page_weight.py --budget`, `check_readme_paths.py`, `python3 -m unittest discover -s tests -p "test_*.py"`, and `node tests/discovery-dom.cjs`.
  - [ ] Populate `record.md`, update `docs/ROADMAP.md`, `docs/STATUS.md`, and `prompt.md`, print **"What to test on the website"** + `rule.md` §7 Termux preview command, and pause for owner sign-off (`mark as pass` / `add for later`).
- **Acceptance & evidence:**
  - [ ] Every gate exits `0` (matching tracked baseline on `validate_data.py` / `validate_syllabus.py`), `check_pyq_integrity.py` reports `0` changed/added/missing files, and `105/105` 2023–2026 C PYQs route cleanly.
