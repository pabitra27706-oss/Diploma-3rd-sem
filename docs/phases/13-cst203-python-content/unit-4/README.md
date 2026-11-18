# CST203 Unit 4 — Files & Regular Expressions

> **Target file:** `subjects/CST203/units/unit-4.html` (current: `4,805w` → target: **`~4,800–5,300w`**)  
> **Syllabus (`syllabus.json`, PDF p. 6):** **6 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`49 / 387` marks (`12.7%`, #4 in Python)** · avg **`12.2m/paper`** · **`4/4` papers** · **`8m` MCQ + `41m` 8m-subparts** (`P001-2022-06` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#fileio`, `#regex`  
> **Existing `<section id>`s to preserve (12):** `overview`, `inputoutput`, `fileio`, `regex`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` (add `4` clean semantic `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 6)
- **Console I/O:** Keyboard input (`raw_input` historical Python 2 note and `input()`); printing to the screen (`print()` with `sep`, `end`, `file`).
- **File Handling:** Opening and closing files (`open()`, file object attributes `.name`, `.mode`, `.closed`, `close()`, `with` statement); reading and writing files (`read()`, `readline()`, `readlines()`, `write()`, `writelines()`); file positions (`tell()`, `seek()`); renaming and deleting files (`os.rename()`, `os.remove()`).
- **Regular Expressions (`re`):** Match function (`re.match`), Search function (`re.search`), Matching vs Searching, Search and Replace (`re.sub`), Regular Expression Modifiers/Flags, Regular Expression Patterns (`re.findall`, `re.split`, and `Match` methods `group()`, `start()`, `end()`, `span()`).

> **Syllabus-Boundary Note:** Multithreading (`threading`) and standalone exception-handling chapters are absent from PDF p. 6 and scored `0m` in `2023–2026` — keep only a 3-line `FileNotFoundError` safety tip inside `#fileio`.

---

## 2. Current Page Audit & Gaps (`subjects/CST203/units/unit-4.html`)
- **Live metrics:** `4,805` words (overall length already right on budget!) · `17` `<pre>` blocks · `11` `<table>`s · `0` `<svg>`s · `0` `<h3 id>`s · `8` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#inputoutput` `240w`, `#fileio` `599w`, `#regex` `659w` (`1,498w` concept prose — currently `#regex` is longer than `#fileio` even though `#fileio` earns **3.1× more marks**: `34m` vs `11m`!).
- **Specific gaps to fix:**
  1. Rebalance `#fileio` (`34m = 69.4%` of Unit 4) above `#regex` (`11m = 22.4%`): add a complete 9-row access-mode comparison table (`P003-Q33a`, `P004-Q20i`, `P005-Q3`, `P006-Q13`), side-by-side `read`/`readline`/`readlines` vs `write`/`writelines` output table (`P005-Q20`), and the complete `file.txt` word-count program (`P005-Q21i`).
  2. In `#regex`, explicitly highlight `re.split()` and `Match.start()` / `Match.end()` / `Match.span()` (`P005-Q23i,ii`) alongside `re.match` vs `re.search` vs `re.findall` (`P006-Q24a`).
  3. Add the 3-line Python 2 `raw_input()` → Python 3 `input()` note and `print(..., sep="/", end="")` trace (`P004-Q13`, `P005-Q10`).
  4. Resolve unmatched `P005-Q3,Q10,Q20,Q21(i),Q23(a)` via exact `<h3 id>` headings.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`49m`)

| Topic Cluster | Marks | % of U4 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **File methods (`read`/`readline`/`readlines`, `write`/`writelines`, `open`/`close`) & word-count script** | **20m** | **40.8%** | **5.2%** | 3/4 | **Tier A** | `P003-Q33b(4m read & write)`; `P005-Q20i(3m readline/readlines),Q20ii(3m write/writelines),Q20iii(2m open/close)`, `P005-Q21i(4m count words in file.txt)`; `P006-Q23a(4m read & write w/ examples)` |
| **File opening & access modes (`r`, `w`, `a`, `x`, `r+`, `w+`, `a+`, `t`, `b`)** | **14m** | **28.6%** | 3.6% | **4/4** | **Tier B** | `P003-Q33a(4m access modes)`; `P004-Q20i(6m opening modes w/ examples)`; `P005-Q3` (2m mode MCQ); `P006-Q13` (2m mode MCQ) |
| **Regular expressions (`re.match`, `re.search`, `re.split`, `re.findall` & `start()`/`end()`)** | **11m** | 22.4% | 2.8% | 3/4 | **Tier B** | `P004-Q20ii(2m pattern matching)`; `P005-Q23i(2m start & end),Q23ii(3m match, split, findall)`; `P006-Q24a(4m working of regex w/ examples)` |
| **Console I/O: `input()` & `print(sep, end)`** | **4m** | 8.2% | 1.0% | 2/4 | **Tier C** | `P004-Q13` (2m `input()` returns `str`); `P005-Q10` (2m `print(..., sep="/")`) |
| **File cursor (`tell`/`seek`), `os.rename`/`os.remove`, `re.sub`/flags & `raw_input` note** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 6), 0 hits in 2023–2026_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#fileio` [LOCKED] — Access Modes, Read/Write Methods & Word Count (Tier A + Tier B + Tier S · ~60% prose)
- **Master File Access Modes Table** (`r`, `w`, `a`, `x`, `r+`, `w+`, `a+` + `t` text vs `b` binary): initial cursor position, creates file if missing?, truncates existing content?, allowed ops, and 1-line `open()` call each (`P003-Q33a`, `P004-Q20i`, `P005-Q3`, `P006-Q13`).
- `open(path, mode="r", encoding="utf-8")`, file attributes (`.name`, `.mode`, `.closed`), explicit `f.close()`, and automatic cleanup via `with open(...) as f:` (`P005-Q20iii`).
- **Read & Write Methods Comparison + Runnable Demos** on a 3-line sample file (`P003-Q33b`, `P005-Q20i,ii`, `P006-Q23a`):
  - `f.read(n)` → single `str`; `f.readline()` → next line `str` (retaining `\n`); `f.readlines()` → `list[str]`.
  - `f.write(s)` → returns chars written (no implicit `\n`); `f.writelines(lines)` → writes iterable of strings without adding separators.
- Complete **`file.txt` word-count program** (both concise `len(f.read().split())` and streaming `sum(len(line.split()) for line in f)` — `P005-Q21i`).
- Compact **Tier S** tail (~180w): cursor tracking `f.tell()` & `f.seek(offset, whence)` plus `os.rename(src, dst)` and `os.remove(path)`.

### 4.2 `#regex` [LOCKED] — Pattern Matching & the `re` Module (Tier B + Tier S · ~28% prose)
- Definition of pattern matching, `import re`, and why raw strings `r"\d+"` prevent double escaping (`P004-Q20ii`, `P006-Q24a`).
- Focused metacharacter & special-sequence table (`.`, `^`, `$`, `*`, `+`, `?`, `{m,n}`, `[a-z]`, `[^...]`, `\d`, `\w`, `\s`, `\b`, `|`, `(...)`).
- **Core `re` Functions & `Match` Methods** with exact return values (`P005-Q23i,ii`, `P006-Q24a`):
  - `re.match(pat, s)` (start of string only) vs `re.search(pat, s)` (first match anywhere).
  - `re.findall(pat, s)` (list of all non-overlapping matches) and `re.split(pat, s)` (list of substrings split at pattern).
  - `Match` object inspection: `m.group()`, `m.start()`, `m.end()`, `m.span()` (with `if m:` guard against `None`).
- Compact **Tier S** box (~120w): `re.sub(pat, repl, s, count=0)` and modifiers `re.I`, `re.M`, `re.S`.

### 4.3 `#inputoutput` — Keyboard `input()` & Screen `print()` (Tier C + Tier S · ~12% prose)
- `input(prompt)` always returns `str` (explicit `int()`/`float()` cast + `split()` multi-value idiom — `P004-Q13`); `print(*objs, sep=" ", end="\n", file=sys.stdout)` examples (`P005-Q10`); 3-line **Tier S** note on Python 2 `raw_input()` → Python 3 `input()`.

### 4.4 Practice & Revision Bank
- `8` MCQs (4 file modes/methods, 2 regex, 2 `input`/`print`), `4` short answers, and `4` worked 8m model answers.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVG (1):** File pointer position diagram comparing `'r'` (byte 0, read), `'w'` (byte 0, truncated), `'a'` (EOF, append), plus regex `Match.start()` / `Match.end()` span on a sample string.
- [ ] **Runnable `python3` scripts (6):** `input`/`print(sep, end)` demo; `with open` write + `read`/`readline`/`readlines` demo; `file.txt` word counter; `tell`/`seek` + `os.rename` snippet; `re.match`/`search`/`findall`/`split` + `start()`/`end()` demo; `re.sub` email/phone demo.
- [ ] **Comparison tables (4):** 9-row File Access Modes; `read()` vs `readline()` vs `readlines()`; `write()` vs `writelines()`; `re.match()` vs `re.search()` vs `re.findall()` vs `re.split()`.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST213/index.html`, PDF pp. 16–18)

| `CST213` Practical Area | Unit 4 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 6:** File processing scripts | `#fileio` | Link from `#fileio` for line/word/char counter, copy, and mode-handling lab scripts |
| **Area 7:** Regular expressions | `#regex` | Link from `#regex` for email/mobile/date validation, token splitting, and `re.sub` lab scripts |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Python File Handling: `open()`, Access Modes (`r`, `w`, `a`, `r+`, `rb`) & `with` Block | **Tier B** (`14m`, 4/4) | `#fileio` | Shows exact truncation/append behaviour & UTF-8 best practice; 15–25 min; verify live |
| **2** | Python `read`/`readline`/`readlines`, `write`/`writelines` & File Word-Count Script | **Tier A** (`20m`) | `#fileio` | Demonstrates return types side by side + `seek`/`tell`; 12–25 min; plain `<a>` only |
| **3** | Python Regular Expressions (`re.match`, `search`, `findall`, `split`, `start`/`end`) | **Tier B** (`11m`) | `#regex` | Covers raw strings, metacharacters, and `Match` span methods; 15–30 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 4 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P004-Q13`, `P005-Q10` | 2m, 2m | U1 `Input / output`; U1 `print() / sep` | `Q13` redirect; `Q10` Unmatched | `#console-input-output-print-and-sep` — *Console Input and Output: `input()`, `print()`, `sep` and `end`* |
| `P005-Q3`, `P006-Q13`, `P003-Q33`, `P004-Q20` | 2,2,8,8m | U4 `File opening / modes` / `File I/O` | `P005-Q3` Unmatched | `#file-opening-and-access-modes` — *File Opening, Access Modes (`r`, `w`, `a`, `r+`, `b`) and Closing* |
| `P005-Q20`, `P005-Q21` *(part i)*, `P006-Q23` *(part a)* | 8,8,8m | U4 `File object methods`; U5 `File word count / MVC / Django vs Flask`; U4 `Files / lambda` | All Unmatched | `#file-object-methods-and-word-count` — *Files and File Object Methods (`read`, `readline`, `readlines`, `write`, `writelines`) and File Word Count* |
| `P005-Q23`, `P006-Q24` *(part a)* | 8m, 8m | U4 `Regular expressions / NumPy`; U5 `Regular expressions / Django` | Same-unit / redirect → `#regex` | `#regular-expressions-and-pattern-matching` — *Regular Expressions: Pattern Matching, `re.match`, `re.split`, `re.findall`, `start()` and `end()`* |
