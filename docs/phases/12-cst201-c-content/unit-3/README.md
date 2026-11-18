# CST201 Unit 3 — Arrays & Strings

> **Target file:** `subjects/CST201/units/unit-3.html` (current: `5,848w` → target: **`~5,400–6,000w`**)  
> **Syllabus (`syllabus.json`, PDF p. 3):** **7 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`) — official Unit 3 *(swapped with Unit 4 in legacy `_data`/`_quiz-data` tags)*  
> **2023–2026 Exam Weight (`P003–P006` only):** **`66 / 395` marks (`16.7%`, #4 in C)** · avg **`16.5m/paper`** · **`4/4` papers** · **`14m` MCQ + `52m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#2d-arrays`, `#strings`  
> **Existing `<section id>`s to preserve (15):** `overview`, `arrays-intro`, `2d-arrays`, `multidim`, `strings`, `string-functions`, `applications`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (5):** `overview-1d-arrays`, `overview-2d-arrays`, `overview-multidimensional`, `overview-strings`, `overview-string-functions`

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 3)
- **One-Dimensional Arrays:** Declaration and initialization of one-dimensional arrays; accessing and traversing elements.
- **Two-Dimensional Arrays:** Declaration and initialization of two-dimensional arrays; matrix representation and operations.
- **Multidimensional Arrays:** Declaration and memory layout of 3D arrays.
- **Character Arrays and Strings:** Declaring and initializing string variables; reading strings from terminal; writing strings to screen; putting strings together (concatenation); comparison of two strings; introduction to string handling functions (`<string.h>`).

---

## 2. Current Page Audit & Gaps (`subjects/CST201/units/unit-3.html`)
- **Live metrics:** `5,848` words · `34` `<pre>` blocks · `4` `<table>`s · `0` `<svg>`s · `12` MCQs · `8` short Qs · `3` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#arrays-intro` `586w`, `#2d-arrays` `418w`, `#multidim` `146w`, `#strings` `374w`, `#string-functions` `711w`, `#applications` `347w` (`2,582w` concept prose).
- **Specific gaps to fix:**
  1. `#2d-arrays` (`418w`) is underweight relative to `#string-functions` (`711w`) even though 2D matrix programs drive `30m` — explicitly include identity-matrix verification (`P003-Q29a`), 4×4 diagonal sum (`P005-Q19b`), and matrix display + transpose (`P006-Q22b`).
  2. `#applications` (`347w`) needs all three recurring no-`<string.h>` character-loop programs side by side: ASCII case toggle (`P003-Q31b`), two-pointer reverse (`P004-Q19a`), and palindrome check (`P006-Q20b`).
  3. Zero diagrams (`0` SVGs) — add contiguous 1D/row-major 2D memory layout + null-terminated `char` array SVG.
  4. Legacy `unit: 4` tagging in `_data/CST201/` causes `10` redirects to Unit 3 (with `P003-Q8` mis-redirecting to `U2#overview-loops` and several landing on `#overview-*` cards instead of actual concept sections) plus `P004-Q5` unmatched.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`66m`)

| Topic Cluster | Marks | % of U3 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **1D & 2D arrays + matrix programs (identity, diagonal sum, transpose)** | **30m** | **45.5%** | **7.6%** | 3/4 | **Tier A** | `P003-Q3,Q8` (2×1m), `P003-Q29a(5m identity matrix)`, `P003-Q29b(3m array def + advantages)`; `P005-Q7` (2m array indexing/decay), `P005-Q19a(2m array def)`, `P005-Q19b(6m 4×4 diagonal sum)`; `P006-Q11` (2m 0-based index), `P006-Q22a(3m 1D array def + decl)`, `P006-Q22b(5m print matrix & transpose)` |
| **Strings (`'\0'`) & `<string.h>` library (`strlen`, `strcpy`, `strcat`, `strcmp`)** | **23m** | **34.8%** | **5.8%** | 3/4 | **Tier A** | `P003-Q31a(3m strcmp & strcat)`; `P004-Q5` (2m string header), `P004-Q18a(1m string def)`, `P004-Q18b(7m any 4 string.h functions w/ examples)`; `P006-Q7` (2m `strlen`), `P006-Q10` (2m `'\0'` terminator), `P006-Q12` (2m `strcmp`), `P006-Q20a(4m strcpy & strcat)` |
| **Manual string programs (no `<string.h>`: case toggle, reverse, palindrome)** | **13m** | 19.7% | 3.3% | 3/4 | **Tier B** | `P003-Q31b(5m lower↔upper without string.h)`; `P004-Q19a(4m reverse string without library)`; `P006-Q20b(4m string palindrome check)` |
| **Multidimensional (3D+) arrays** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 3), 0 hits in 2023–2026_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#arrays-intro` — One-Dimensional Arrays (Tier A · ~18% prose)
- Formal definition (fixed-size homogeneous contiguous sequence), 0-based index bounds `0 .. n - 1` (`P003-Q3`, `P006-Q11`), out-of-bounds hazard.
- Compile-time initialization (`int a[5] = {10, 20}` zero-fills remaining elements; unsized `int a[] = {1, 2, 3}` sets length 3 — `P003-Q8`), runtime loop I/O, base-address formula `addr(a[i]) = base + i * sizeof(T)` (`P005-Q7`).
- Crisp advantages (O(1) indexed access, cache locality) vs limitations (fixed size, costly middle insert/delete — `P003-Q29b`, `P005-Q19a`, `P006-Q22a`).

### 4.2 `#2d-arrays` [LOCKED] — Two-Dimensional Arrays & Matrix Programs (Tier A · ~27% prose)
- Declaration & row-major initialization (why column bound is required in `int m[][3]`), row-major address formula `base + (i * cols + j) * sizeof(T)`, nested-loop read/print.
- **Three complete exam matrix programs** (`gcc -std=c99`, with index rule callouts):
  1. **Identity matrix check:** square `n × n`, diagonal `a[i][i] == 1`, off-diagonal `a[i][j] == 0` (`P003-Q29a`).
  2. **4×4 matrix diagonal sum:** primary `i == j` + secondary `i + j == n - 1`, noting middle-element guard `if (i != n - 1 - i)` for odd `n` (`P005-Q19b`).
  3. **Display matrix and compute transpose:** `t[j][i] = a[i][j]` for general `r × c → c × r` (`P006-Q22b`), plus a short matrix-addition snippet.

### 4.3 `#multidim` — Multidimensional Arrays (Tier S · ~4% prose)
- Keep tight (~150w): `int cube[p][r][c]` as `p` layers of `r × c` matrices, element count `p * r * c`, memory `p * r * c * sizeof(int)`, and 1 compact initializer.

### 4.4 `#strings` [LOCKED] — Character Arrays, `'\0'` & Terminal I/O (Tier A · ~15% prose)
- C string = `char` array terminated by null byte `'\0'` (ASCII `0`, `P004-Q18a`, `P006-Q10`).
- Contrast `"Hello"` (6 bytes) vs `{'H','e','l','l','o'}` (5 bytes, not a valid C string) and **`strlen(s)` (excludes `'\0'`) vs `sizeof(s)` (array capacity including `'\0'`)** (`P006-Q7`).
- Safe terminal I/O: `scanf("%49s", s)` (stops at whitespace) vs `fgets(s, sizeof s, stdin)` (reads full line + newline strip; why `gets()` was removed in C11), `printf("%s", s)` and `puts(s)`, and why `s1 == s2` compares pointers rather than content.

### 4.5 `#string-functions` — Standard `<string.h>` Library (Tier A · ~18% prose)
- Summary table + individual runnable mini-programs for the 4 core exam functions (`P004-Q5,Q18b`):
  - `strlen(s)` — length before `'\0'`.
  - `strcpy(dest, src)` — copies including `'\0'` (buffer-size rule + `strncpy` safety note, `P006-Q20a`).
  - `strcat(dest, src)` — appends `src` onto `dest` (`P003-Q31a`, `P006-Q20a`).
  - `strcmp(s1, s2)` — lexicographical ASCII comparison returning `< 0`, `0` (equal), or `> 0` (`P003-Q31a`, `P006-Q12`).

### 4.6 `#applications` — No-Library String Programs (Tier B · ~18% prose)
- Three self-contained `while (s[i] != '\0')` programs answering every manual string prompt:
  1. **Lowercase ↔ uppercase toggle without `<string.h>`/`<ctype.h>`** using `'a'..'z' → c - 32` and `'A'..'Z' → c + 32` (`P003-Q31b`).
  2. **In-place string reversal without library functions** using manual length scan + `left`/`right` swap (`P004-Q19a`).
  3. **String palindrome check** stripping trailing `'\n'` and comparing `s[i]` with `s[len - 1 - i]` (`P006-Q20b`).

### 4.7 Practice & Revision Bank
- `8` MCQs, `4` short answers, and `5` worked 8m questions covering identity matrix, 4×4 diagonal sum, transpose, 4 `<string.h>` functions, and manual reverse/case/palindrome.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) Row-major 2D matrix layout showing primary (`i == j`) and secondary (`i + j == n-1`) diagonals + flattened memory cells; (2) Null-terminated string `"CODE\0"` illustrating `strlen == 4` vs `sizeof == 5`.
- [ ] **Programs (8 `gcc -std=c99 -Wall -Wextra` verified):** 1D traverse/sum; identity matrix; 4×4 diagonal sum; matrix transpose; 4-in-1 `<string.h>` demo; ASCII case toggle; manual string reverse; palindrome check.
- [ ] **Comparison tables (4):** 1D vs 2D array; Character array vs C string literal; `strlen()` vs `sizeof()`; Master `<string.h>` 4-function table (`strlen`, `strcpy`, `strcat`, `strcmp`).

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST211/index.html`, PDF p. 14)

| `CST211` Practical Area | Unit 3 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 5:** Arrays and strings (search, sort, matrices, vowels, standard string functions, palindrome) | `#arrays-intro`, `#2d-arrays`, `#string-functions`, `#applications` | Exact 1:1 lab match — link from `#practice` for matrix operations, `<string.h>` drills, and palindrome lab exercise |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | 1D & 2D Arrays in C + Matrix Programs (Identity, Diagonal Sum, Transpose) | **Tier A** (`30m`) | `#2d-arrays` | Visual row-major grid + index conditions `i==j` & `i+j==n-1`; 20–35 min; verify live |
| **2** | C Strings, `'\0'` Null Terminator & `<string.h>` (`strlen`, `strcpy`, `strcat`, `strcmp`) | **Tier A** (`23m`) | `#string-functions` | Explains `strlen` vs `sizeof`, `strcmp` return sign, and buffer safety; 15–30 min; plain `<a>` |
| **3** | Manual String Programs in C: Reverse, Palindrome & ASCII Case Conversion | **Tier B** (`13m`) | `#applications` | Character-by-character dry-run without `<string.h>`; 12–25 min; no embeds/thumbnails |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 3 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q3`, `P003-Q8`, `P005-Q7` | 1,1,2m | U4 `Arrays / initialization`; U4 `Arrays / loops`; U4 `Arrays / memory` | Redirect (`P003-Q8` wrong → `U2#overview-loops`) | `#arrays-initialization-memory-and-loops` — *1D Arrays: Initialization, Memory Layout and Loop Traversal* |
| `P003-Q29`, `P005-Q19`, `P006-Q22` | 8,8,8m | U4/U3 `Arrays / matrices` | Redirect/same → `#2d-arrays` | `#arrays-and-matrices` — *Two-Dimensional Arrays and Matrices (Identity, Diagonal Sum, Transpose)* |
| `P004-Q5`, `P004-Q18` | 2m, 8m | U4 `Strings / library functions`; U4 `Strings / string.h` | `Q5` Unmatched; `Q18` → `#overview-strings` | `#strings-and-library-functions` — *Strings and `string.h` Library Functions (`strlen`, `strcpy`, `strcat`, `strcmp`)* |
| `P003-Q31`, `P006-Q10`, `P006-Q20` | 8,2,8m | U4 `Strings`; U4 `String functions / palindromes` | Redirect → `#overview-*` | `#string-reverse-case-and-palindromes` — *String Functions, Reverse, Case Toggle and Palindromes* |

> *Mode B note (owner-gated):* Retagging U4 array/string items (`P003-Q3,Q8,Q29,Q31`, `P004-Q5,Q18`, `P005-Q7,Q19`, `P006-Q7,Q10,Q11,Q12,Q20`) to `unit: 3` remains off unless explicitly approved.

---

## Delivery note (part 12.3, executed 2026-11-18)

- **Shipped:** `subjects/CST201/units/unit-3.html` at **`5,932w`** on the calibrated metric (`5,848w` in, `5,400–6,000` band) — `16` sections, both `guides.json` anchors (`#2d-arrays`, `#strings`) live, `4` new Mode A `<h3 id>` anchors, `2` inline SVGs, `5` verified plain-`<a>` YouTube links, `8/8` programmes compiled clean with `gcc -std=c99 -Wall -Wextra -O2` and every embedded output reproduced.
- **Anchors created:** `#arrays-initialization-memory-and-loops` (`#arrays-intro`), `#arrays-and-matrices` (`#2d-arrays`), `#strings-and-library-functions` (`#string-functions`), `#string-reverse-case-and-palindromes` (`#applications`). Note the second pair sits in the *later* section than the section name suggests — the `guides.json` anchor `#strings` owns the section, and the `<string.h>` heading lives in `#string-functions`, matching the routing table's target.
- **Traded away to stay inside the band:** 1D bubble sort, the input/max-min demo, matrix addition, matrix multiplication, the four legacy `<string.h>` "Application 1–4" programmes, four duplicate MCQs and half of the revision list. `#multidim` was left untouched (`147w`, already ~4%).

