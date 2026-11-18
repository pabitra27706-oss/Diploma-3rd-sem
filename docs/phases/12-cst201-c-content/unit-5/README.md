# CST201 Unit 5 — Pointers in C

> **Target file:** `subjects/CST201/units/unit-5.html` (current: `7,558w` [over-weighted #1 longest C page] → target: **`~5,000–5,600w` [right-sized]**)  
> **Syllabus (`syllabus.json`, PDF p. 3):** **6 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`51 / 395` marks (`12.9%`, #5 in C)** · avg **`12.8m/paper`** · **`4/4` papers** · **`14m` MCQ + `37m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#declaration`, `#dma`  
> **Existing `<section id>`s to preserve (20):** `overview`, `intro`, `declaration`, `types`, `arithmetic`, `functions`, `arrays`, `strings`, `array-of-ptrs`, `function-ptrs`, `ptr-to-ptr`, `dma`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve (6):** `overview-basics`, `overview-declaration`, `overview-arithmetic`, `overview-functions`, `overview-arrays-strings`, `overview-advanced`

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 3)
- **Pointer Fundamentals:** Introduction to Pointers; Understanding Pointers; Accessing the Address of a Variable (`&`); Declaring and Initializing Pointer Variables; Accessing a Variable through its Pointer (`*`).
- **Pointer Expressions & Indirection:** Chain of Pointers (`**p`); Pointer Expressions; Pointer Increments and Scale Factor (pointer arithmetic).
- **Pointers with Arrays & Strings:** Pointers and Arrays; Pointers and Character Strings; Array of Pointers.
- **Pointers with Functions:** Pointers as Function Arguments; Functions Returning Pointers; Pointers to Functions.
- **Structures & Heap Memory:** Pointers and Structures (`->`); Dynamic Memory Allocation (`malloc`, `calloc`, `realloc`, `free`).

> **Syllabus-Boundary Note:** Command-line arguments (`argc`/`argv`) and `<stdio.h>` file handling (`fopen`/`fclose`) are **not** in PDF p. 3 and scored `0m` across `2023–2026` — do not add them.

---

## 2. Current Page Audit & Gaps (`subjects/CST201/units/unit-5.html`)
- **Live metrics:** `7,558` words (#1 longest C unit, #5 in exam marks) · `48` `<pre>` blocks · `11` `<table>`s · `0` `<svg>`s · `15` MCQs · `10` short Qs · `3` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#intro` `256w`, `#declaration` `369w`, `#types` `471w`, `#arithmetic` `340w`, `#functions` `324w`, `#arrays` `261w`, `#strings` `271w`, `#array-of-ptrs` `214w`, `#function-ptrs` `278w`, `#ptr-to-ptr` `294w`, `#dma` `724w` (`3,802w` concept prose across 11 sections).
- **Specific defects & right-sizing targets:**
  1. **96.1% of Unit 5 marks (`49 / 51m`)** hit just three clusters — `#dma` (`17m`), `#intro`/`#declaration`/`#types`/`#arithmetic` (`17m`), and `#functions`/`#arrays` (`15m`) — while `#strings`, `#array-of-ptrs`, `#function-ptrs`, and `#ptr-to-ptr` take `1,057w` and ~18 `<pre>` blocks for **`0m`**. Trim those four sections ~45% (`~140–190w` + 1 snippet each) while keeping every `<section id>` intact.
  2. Trim MCQ bloat (`15 → 8`) and short-Q bloat (`10 → 4`), and raise worked 8m answers (`3 → 4`) to match actual exam patterns (`P003-Q32,Q34`, `P004-Q20`, `P006-Q23`).
  3. Add a compact `struct` arrow `ptr->member` + `union` shared-memory size note (`sizeof(union)` = largest member, answering `P005-Q11`), plus `2` inline SVGs (`0` today).
  4. Resolve unmatched `P005-Q8`, `P005-Q10` and mis-targeted `P005-Q11` (`Unions / memory` currently landing on `#dma`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`51m`)

| Topic Cluster | Marks | % of U5 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Dynamic memory allocation (`malloc`, `calloc`, `realloc`, `free`)** | **17m** | **33.3%** | 4.3% | 3/4 | **Tier B** | `P003-Q34a..d(8m: 2m each malloc/calloc/realloc/free)`; `P004-Q21a(3m calloc vs malloc)`; `P006-Q15` (2m `free()`), `P006-Q23b(4m pointer + free/calloc/malloc)` |
| **Pointer basics, `&` / `*`, type safety & scale-factor arithmetic** | **17m** | **33.3%** | 4.3% | **4/4** | **Tier B** | `P003-Q1` (1m `*` dereference), `P003-Q6` (1m `ptr + 5` scaling), `P003-Q32b(3m pointer def + advantages)`; `P004-Q20a(4m `&` and `*` w/ example)`; `P005-Q8` (2m `*p++`), `P005-Q10` (2m type mismatch), `P005-Q24a(2m pointer def)`; `P006-Q13` (2m stores address) |
| **Pointers with functions & 1D arrays (add, traverse, sum)** | **15m** | **29.4%** | 3.8% | **4/4** | **Tier B** | `P003-Q32a(5m add two numbers via pointers & function)`; `P004-Q20b(4m access 1D array via pointers)`; `P005-Q9` (2m `*(a + i)` identity); `P006-Q23a(4m sum of array elements via pointer)` |
| **Pointers to structures (`->`) & `union` memory sharing** | **2m** | 3.9% | 0.5% | 1/4 | **Tier C** | `P005-Q11` (2m `sizeof(union)` = size of largest member) |
| **Chain of pointers (`**p`), pointer to string, array of pointers, function pointers, returning pointers** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 3), 0 hits in 2023–2026 — keep concise, preserve all section IDs_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#dma` [LOCKED] — Dynamic Memory Allocation on the Heap (Tier B · ~28% prose)
- Stack (compile-time/automatic) vs Heap (runtime dynamic) diagram; `#include <stdlib.h>` prototypes, `NULL` check on allocation failure, and complete dynamic `int` array lifecycle (`P003-Q34`, `P006-Q15,Q23b`):
  - `malloc(n * sizeof *p)` — single uninitialized byte block.
  - `calloc(n, sizeof *p)` — `n` contiguous elements zero-initialized.
  - `realloc(p, new_n * sizeof *p)` — resizes block preserving prefix (assign via temporary pointer).
  - `free(p); p = NULL;` — releases heap block and avoids dangling pointer / memory leak.
- Full **`malloc()` vs `calloc()`** comparison table (`P004-Q21a`) and Static Array vs Dynamic Memory table.

### 4.2 `#intro`, `#declaration` [LOCKED], `#types` & `#arithmetic` — Core Pointer Mechanics (Tier B · ~30% prose)
- Definition & 4 core advantages of pointers (`P003-Q32b`, `P005-Q24a`, `P006-Q13`); `&` (address-of) and `*` (indirection/dereference) annotated snippet (`P003-Q1`, `P004-Q20a`).
- Strict base-type compatibility (`int *p` cannot safely store `float *` — `P005-Q10`), plus tight 4-row table of `NULL`, `void *` (generic pointer requiring type context before `*`), wild (uninitialized), and dangling pointers.
- Scale-factor formula `addr(p + k) = addr(p) + k * sizeof(*p)` worked for both `4B int` (`1000 + 5*4 = 1020`) and `2B int` (`1010`) (`P003-Q6`); legal (`p ± k`, `p2 - p1`, relational) vs illegal (`p1 + p2`, `p * 2`) operations; and precedence trace of `*p++` (`*(p++)`), `(*p)++`, and `*++p` (`P005-Q8`).

### 4.3 `#functions` & `#arrays` — Exam Pointer Programs (Tier B · ~24% prose)
- Three complete `gcc -std=c99` exam programs:
  1. **Add two integers using pointers and a function** (`P003-Q32a`).
  2. **Access and display 1D array elements using a pointer** (`*(arr + i) == arr[i]`, noting array name `arr` is non-modifiable — `P004-Q20b`, `P005-Q9`).
  3. **Sum of all elements of a 1D array using a pointer** (`P006-Q23a`).
- Compact 3-line Tier S warning on functions returning pointers: return caller-passed/static/heap pointer, never `&local_auto`.

### 4.4 `#strings`, `#array-of-ptrs`, `#function-ptrs`, `#ptr-to-ptr` — Compact Tier S + Tier C Blocks (~18% combined)
- Preserve all four `<section id>`s, trimming each to `~150–200w` + 1 minimal 6-line snippet:
  - `#strings`: `const char *s = "Hi"` (pointer to read-only literal) vs `char s[] = "Hi"` (modifiable array).
  - `#array-of-ptrs`: `const char *days[]` vs `int (*p)[N]` pointer-to-array one-liner.
  - `#function-ptrs`: `int (*op)(int, int) = add; op(3, 4);` callback syntax.
  - `#ptr-to-ptr`: `int **pp = &p;` double indirection + compact **Pointers to Structures (`sptr->id == (*sptr).id`) & `struct` vs `union` Memory Size** box (explaining why `sizeof(union)` equals its largest member modulo alignment — `P005-Q11`).

### 4.5 Practice & Revision Bank
- `8` MCQs (3 `&`/`*`/scale/`*p++`, 2 DMA, 2 array-pointer, 1 `union` size), `4` short answers, and `4` worked 8m model answers.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) Variable `x = 42` at `0x1000` pointed to by `int *p` (`&x` vs `*p`) + `p + 1` at `0x1004`; (2) C process memory segments (Code, Static/Global, Stack vs Heap for `malloc`/`calloc`/`free`).
- [ ] **Programs (6 `gcc -std=c99 -Wall -Wextra` verified):** `&`/`*` & `*p++` demo; pointer-function add; 1D array traverse via pointer; 1D array sum via pointer; `malloc` + `realloc` + `free` lifecycle; compact `struct->` & `sizeof(union)` demo (plus 4 tiny 6-line Tier S snippets).
- [ ] **Comparison tables (4):** `malloc()` vs `calloc()`; Static vs Dynamic memory allocation; `&` vs `*`; `NULL` vs `void *` vs Wild vs Dangling pointer; `struct` vs `union` memory.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST211/index.html`, PDF p. 14)

| `CST211` Practical Area | Unit 5 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 7:** Pointers and dynamic memory allocation (arrays, strings, structures, linked list, stack, queue) | `#declaration`, `#arrays`, `#ptr-to-ptr`, `#dma` | Link from `#dma` & `#practice` for pointer-array traversal, structure pointers, and `malloc`/`calloc`/`free` lab work (plus forward link to Data Structures Unit 3) |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Dynamic Memory Allocation in C: `malloc()`, `calloc()`, `realloc()` & `free()` | **Tier B** (`17m`) | `#dma` | Draws stack vs heap, compares `malloc`/`calloc`, shows `NULL` check & `free`; 15–30 min; verify live |
| **2** | C Pointers: `&` and `*`, Scale-Factor Arithmetic, Type Safety & `*p++` Precedence | **Tier B** (`17m`) | `#declaration` | Clear byte-address diagrams and `*p++` vs `(*p)++` dry-run; 15–30 min; plain `<a>` only |
| **3** | Pointers with 1D Arrays and Functions in C | **Tier B** (`15m`) | `#arrays` | Covers `*(a + i)`, pointer sum of array, and passing pointers to functions; 12–25 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 5 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P005-Q8`, `P005-Q10` | 2m, 2m | U4 `Pointers / evaluation order`; U4 `Pointers / type checking` | Unmatched | `#pointers-type-checking-and-evaluation` — *Pointers: Type Checking, Scale Factor and `*p++` Evaluation Order* |
| `P003-Q1`, `P003-Q6`, `P003-Q32` | 1,1,8m | U4 `Pointers`; U4 `Pointer arithmetic` | Redirect → `U5#intro` / `U5#arithmetic` | Preserved `#intro`, `#declaration`, `#arithmetic` (clean exact match) |
| `P004-Q20`, `P005-Q9` | 8m, 2m | U4 `Pointers / arrays`; U4 `Arrays / pointers` | Redirect → `U5#arrays` | `#pointers-and-one-dimensional-arrays` — *Accessing and Summing Arrays Using Pointers* |
| `P005-Q11` | 2m | U4 `Unions / memory` | Redirect → `U5#dma` *(partial word match on `memory`)* | `#pointers-to-structures-and-unions` — *Pointers to Structures and Unions Memory Size* |
| `P003-Q34`, `P004-Q21`, `P006-Q15`, `P006-Q23` | 8,8,2,8m | U5 `Dynamic memory allocation` / `Pointers / dynamic memory` | Same-unit → `U5#dma` | `#dynamic-memory-malloc-calloc-realloc-free` — *Dynamic Memory Allocation: `malloc`, `calloc`, `realloc` and `free`* |

---

## Delivery note (part 12.5, executed 2026-11-18)

- **Shipped:** `subjects/CST201/units/unit-5.html` at **`5,572w`** on the recipe in `record.md` §1 — a **`−17.2%`** cut from the `6,732w` measured baseline. All `21` `<section id>`s and all `6` `overview-*` `<h3 id>`s intact, both `guides.json` anchors (`#declaration`, `#dma`) live, `7` `<h3 id>` anchors authored (`2` retired with the consolidation), `2` inline SVGs, `3` verified plain-`<a>` YouTube links, `16/16` programmes compiled clean with `gcc -std=c99 -Wall -Wextra -O2` and every embedded output reproduced from real stdout.
- **Honest budget note:** the `5,000–5,600w` band implied a `26–34%` cut; delivery landed at `−17.2%`. The page is nonetheless right-sized by intent — it was the longest C unit at ~`1.9×` its mark share and is now the second-shortest. Cutting the final ~`500w` would have meant dropping the `#dma` comparisons the paper names or one of the two SVGs. Recorded in `record.md` §6.2.
- **Consolidations (no content lost):** `#types` and `#arithmetic` survive as short sections that cross-link the new `#understanding-pointers-and-addresses` / `#pointers-type-checking-and-evaluation` anchors; `#comparisons` became a signpost to the four tables now printed beside the material they explain.

