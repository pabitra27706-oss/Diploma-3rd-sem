# CST203 Unit 1 — Introduction

> **Target file:** `subjects/CST203/units/unit-1.html` (current: `5,304w` → target: **`~7,200–8,000w`**)  
> **Syllabus (`syllabus.json`, PDF p. 5):** **7 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`152 / 387` marks (`39.3%`, #1 HIGHEST-WEIGHT UNIT IN THE ENTIRE 5-SUBJECT REPOSITORY)** · avg **`38.0m/paper`** · **`4/4` papers** · **`64m` MCQ + `88m` 8m-subparts** (`P001-2022-06` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#collections`, `#strings`  
> **Existing `<section id>`s to preserve (14):** `overview`, `intro`, `variables`, `strings`, `collections`, `operators`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` (add `9` clean semantic `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 5)
- **Foundations & Environment:** A Brief History of Python; Python Versions (2 vs 3); Installing Python; Environment Variables (`PATH`, `PYTHONPATH`); Executing Python from the Command Line; Editing Python Files; Basic Python Syntax; Language Components — Indenting Requirements; Debugging.
- **Data Types & Strings:** String Values, String Operations, The String Format Operator (`%`, `.format()`, f-strings); Numeric Data Types (`int`, `float`, `complex`, `bool`); Conversion Functions; Simple Output & Simple Input *(cross-linked to Unit 4 `#inputoutput`)*.
- **Built-in Collections, Operators & Time:** Lists, Tuples, Dictionaries; Basic Python Operators & Precedence; Date and Time (`datetime`).

> **Syllabus-Boundary Note:** `set` is omitted from the printed Unit 1 bullet list but tested once in `P005-Q13` (`2m` `s1 | s2` union) — include as a compact badged **Tier E** callout (~100w) inside `#collections`.

---

## 2. Current Page Audit & Gaps (`subjects/CST203/units/unit-1.html`)
- **Live metrics:** `5,304` words (shorter than `7.8%`-weight Unit 5!) · `18` `<pre>` blocks · `15` `<table>`s · `0` `<svg>`s · **`0` `<h3 id>`s** · `10` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#intro` `373w`, `#variables` `275w`, `#strings` `313w`, `#collections` `662w`, `#operators` `619w` (`2,242w` concept prose).
- **Specific gaps to fix:**
  1. `#collections` holds **`56m` (`14.5%` of the entire Python exam)** in just `662w` — missing aliasing vs shallow vs `copy.deepcopy` (`P004-Q8`), slicing vs indexing table (`P006-Q18b`), in-place mutation during iteration trap (`P005-Q14`), dict immutable-key proof (`P003-Q9`), master 3-way List vs Tuple vs Dict table (`P006-Q18a`), and `set` union (`P005-Q13`).
  2. `#strings` (`313w` for `25m`) lacks side-by-side comparison of the 3 formatting styles (`P005-Q22ii`), `split`/`join` drills (`P003-Q27a`, `P004-Q15`), immutability object diagram (`P003-Q27c`), and string palindrome script (`P006-Q17b`).
  3. `#variables` (`275w` for `25m`) misses full implicit vs explicit conversion (`P005-Q16ii`), mutable vs immutable `id()` proof (`P003-Q27b`, `P005-Q22iii`), and `datetime.now()` (`P003-Q18,Q32c`).
  4. `#operators` needs the exact bitwise output trace on `a, b = 5, 3` including two's-complement `~5 = -6` (`P006-Q20b`).
  5. **35 Unit 1 `2023–2026` PYQ questions fail to match** because `#intro..#operators` have zero `<h3 id>`s.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`152m`)

| Topic Cluster | Marks | % of U1 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Lists, tuples, dictionaries, indexing vs slicing & copy semantics** | **54m** | **35.5%** | **14.0%** | **4/4** | **Tier A** | `P003-Q1,Q7,Q8,Q9,Q12,Q14,Q15,Q21,Q25` (9×1m), `P003-Q29a(4m dict+methods),Q29b(4m tuple vs list)`; `P004-Q4,Q6,Q7,Q8,Q12` (5×2m), `P004-Q16ii(3m list vs tuple)`, `P004-Q17i(4m list slicing),Q17ii(4m dictionary)`; `P005-Q4,Q7,Q14` (3×2m), `P005-Q17ii(2m list vs dict)`; `P006-Q18a(5m list vs tuple vs dict),Q18b(3m slicing vs indexing)` |
| **Strings: quotes, slicing, methods, 3 formatting styles, immutability & palindrome** | **25m** | 16.4% | **6.5%** | **4/4** | **Tier A** | `P003-Q3,Q10,Q20,Q22` (4×1m), `P003-Q27a(3m join/split),Q27c(3m why immutable)`; `P004-Q15` (2m `join`); `P005-Q22ii(3m 3 formatting ways)`; `P006-Q4` (2m), `P006-Q17a(3m representation),Q17b(5m palindrome)` |
| **History, features, syntax, indentation, comments/docstrings, keywords & built-ins** | **23m** | 15.1% | **5.9%** | **4/4** | **Tier A** | `P003-Q17,Q19,Q24` (3×1m), `P003-Q26a(5m Python + features)`; `P004-Q3` (2m comments/docstrings), `P004-Q16i(2m indentation)`; `P005-Q1,Q12` (2×2m); `P006-Q1,Q2` (2×2m), `P006-Q16b(3m indentation)` |
| **Operators (`//`, `**`, `%`, logical, `is`/`in`, bitwise) & precedence** | **23m** | 15.1% | **5.9%** | **4/4** | **Tier A** | `P003-Q4,Q11,Q13` (3×1m), `P003-Q31a(4m operator types)`; `P004-Q9` (2m `//`); `P005-Q9` (2m precedence); `P006-Q6,Q7` (2×2m), `P006-Q20a(2m logical & identity),Q20b(6m bitwise on 5, 3)` |
| **Built-in data types, mutable vs immutable & type conversion** | **21m** | 13.8% | **5.4%** | 3/4 | **Tier A** | `P003-Q27b(2m mutable vs immutable)`; `P005-Q16i(5m basic types),Q16ii(3m implicit/explicit conversion)`, `P005-Q22iii(2m classify mutability)`; `P006-Q3,Q5` (2×2m), `P006-Q16a(5m built-in types)` |
| **Date and time (`datetime` module)** | **4m** | 2.6% | 1.0% | 1/4 | **Tier C** | `P003-Q18` (1m), `P003-Q32c(3m print current date & time)` |
| **Set literal & union operator `\|`** | **2m** | 1.3% | 0.5% | 1/4 | **Tier E** | `P005-Q13` (2m `s1 \| s2` unique elements) |
| **Installing Python, `PATH`/`PYTHONPATH`, CLI execution & debugging** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 5), 0 hits in 2023–2026_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#collections` [LOCKED] — Lists, Tuples, Dictionaries & Slicing (Tier A + Tier E · ~36% prose)
- **Lists:** literals & mixed types (`P004-Q12`); **Indexing vs Slicing** table + `lst[start:stop:step]` negative index/step rules (`lst[::-1]`, out-of-range slice safety — `P003-Q12,Q14`, `P004-Q17i`, `P006-Q18b`); mutating methods returning `None` (`append` vs `extend`, `insert`, `remove`, `pop`, `clear`, `sort(reverse=...)`, `reverse()` vs built-in `sorted()` — `P003-Q21`, `P004-Q4`); sequence built-ins (`len`, `min`, `max`, `sum` — `P004-Q7`); aliasing `b = a` vs shallow copy `a[:]`/`a.copy()`/`list(a)` vs `copy.deepcopy(a)` (`P004-Q8`); and loop-mutation trap `for s in x: x.append(s.upper())` (`P005-Q14`).
- **Tuples:** syntax, singleton `(5,)` vs `(5)`, packing/unpacking, slicing (`P005-Q7`), `count()`/`index()`, immutability (including mutating an inner list inside a tuple — `P003-Q1,Q25`).
- **Dictionaries:** `{k: v}`, hashable/immutable key rule (why `tuple` key works and `list` raises `TypeError` — `P003-Q9`), `d[k]` vs `d.get(k, default)`, methods table (`keys`, `values`, `items`, `update`, `pop`, `popitem`, `setdefault`, `clear` — `P003-Q7,Q29a`, `P004-Q6,Q17ii`).
- **Master 3-Way Comparison Table:** List vs Tuple vs Dictionary (`P003-Q29b`, `P004-Q16ii`, `P005-Q17ii`, `P006-Q18a`).
- **Badged Tier E Note (`2m`):** `set` deduplication, empty `set()` vs `{}`, union `s1 | s2`, intersection `&`, difference `-` (`P005-Q13`).

### 4.2 `#strings` [LOCKED] — Representation, Slicing, Methods, Formatting & Immutability (Tier A · ~18% prose)
- Single, double, triple multi-line, and raw `r"..."` literals (`P006-Q17a`); positive/negative indexing diagram & slicing (`P003-Q3,Q22`); proof of **string immutability** (`s[0] = 'X' → TypeError`, rebinding creates new object — `P003-Q27c`).
- Core methods with outputs: `split()`, `sep.join(iterable)`, `strip()`, `lower()`, `upper()`, `title()`, `replace()`, `find()` vs `index()`, `count()`, `startswith()`/`endswith()` (`P003-Q10,Q20,Q27a`, `P004-Q15`).
- **Three String Formatting Methods** side by side: `%` operator (`"%s: %.2f" % ...`), `str.format()`, and f-strings `f"{name}: {score:.2f}"` (`P005-Q22ii`).
- Complete **string palindrome script** (normalized slice `s == s[::-1]` + two-index loop — `P006-Q17b`).

### 4.3 `#operators` — All 7 Operator Families & Precedence (Tier A · ~16% prose)
- Arithmetic (`/`, floor `//` incl. `-7 // 2 == -4`, `%`, right-associative `2 ** 3 ** 2 == 512`), relational/chained `1 < x < 10`, logical (`and`, `or`, `not` returning operand values — `P006-Q20a`), assignment, identity (`is`/`is not` comparing `id()` vs `==` value — `P006-Q20a`), membership (`in`/`not in`).
- Full **bitwise dry-run on `a, b = 5, 3`**: `5 & 3 = 1`, `5 | 3 = 7`, `5 ^ 3 = 6`, `~5 = -6` (`-(x+1)`), `5 << 1 = 10`, `5 >> 1 = 2` (`P006-Q20b`), plus complete precedence/associativity table (`P003-Q11,Q31a`, `P004-Q9`, `P005-Q9`, `P006-Q6,Q7`).

### 4.4 `#variables` — Built-in Types, Mutability, Conversions & `datetime` (Tier A + Tier C · ~16% prose)
- Name-to-object binding; complete built-in type taxonomy (`int`, `float`, `complex`, `bool`, `str`, `list`, `tuple`, `dict`, `NoneType` — `P005-Q16i`, `P006-Q16a`).
- **Mutable vs Immutable Classification Table** verified with `id()` (`P003-Q27b`, `P005-Q22iii`).
- **Implicit coercion** (`int + float → float`, `True + 1 == 2`, why `"3" + 4` raises `TypeError`) vs **Explicit conversions** (`int(s, base)`, `float()`, `str()`, `bool()`, `list()`, `tuple()`, `dict()`, `ord()`, `chr()` — `P005-Q16ii`).
- Concise `datetime` script printing current date/time via `datetime.now()` and `strftime("%Y-%m-%d %H:%M:%S")` (`P003-Q18,Q32c`).

### 4.5 `#intro` — History, Features, Indentation, Keywords & Tier S Setup (Tier A + Tier S · ~14% prose)
- Guido van Rossum (1991), Python 2 vs 3 key differences, 8 core features (`P003-Q17,Q26a`), `.py` extension (`P005-Q1`), **block indentation rules & why indentation matters** (`IndentationError` demo — `P004-Q16i`, `P006-Q16b`), `#` comment vs `__doc__` docstring (`P004-Q3`), identifier/keyword rules (`keyword.kwlist`, capitalized `True`/`False`/`None` — `P003-Q24`), and built-ins `all()`, `any()`, `len()`, `type()`, `id()` (`P003-Q19`, `P005-Q12`).
- Compact **Tier S** box (~120w): installing Python, `PATH`/`PYTHONPATH`, `python3 script.py` vs REPL, and reading common tracebacks (`SyntaxError`, `IndentationError`, `NameError`, `TypeError`, `IndexError`, `KeyError`).

### 4.6 Practice & Revision Bank
- `14` MCQs, `6` short answers, and `6` complete 8m multi-part solutions covering every Unit 1 Group B combination.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) Positive `0..n-1` & negative `-n..-1` string/list indexing + slice window `[1:4]`; (2) List aliasing (`b = a`) vs shallow copy (`a.copy()`) vs `copy.deepcopy(a)` on a nested list.
- [ ] **Runnable `python3` scripts (8):** list slicing/methods/copy demo; dict methods demo; string `split`/`join`/3-format styles + palindrome; bitwise `a, b = 5, 3` trace; mutability `id()` & type conversion; `datetime.now()` + `strftime`; docstring & `all()`/`any()` demo; `set` union snippet.
- [ ] **Comparison tables (6):** List vs Tuple vs Dictionary; Indexing vs Slicing; Shallow vs Deep Copy; Mutable vs Immutable types; Implicit vs Explicit conversion; `==` vs `is`; `%` vs `.format()` vs f-string.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST213/index.html`, PDF pp. 16–18)

| `CST213` Practical Area | Unit 1 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 1:** Installing Python on Windows/Linux/Ubuntu/macOS | `#intro` | Link from `#intro` Tier S setup box |
| **Area 2:** Basic coding syntax | `#intro`, `#operators` | Link for indentation, docstrings, and operator-precedence scripts |
| **Area 3:** Scripts on data types | `#variables`, `#strings`, `#collections` | Link from `#collections` & `#practice` for string, list, tuple, and dict lab scripts |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Python Lists, Tuples & Dictionaries + Slicing and Shallow vs Deep Copy | **Tier A** (`54m`) | `#collections` | Python 3.x; covers slicing, methods, mutability, and 3-way comparison; 25–45 min; verify live |
| **2** | Python Strings: Indexing, Slicing, `split`/`join`, Immutability & f-Strings | **Tier A** (`25m`) | `#strings` | Covers all 3 format styles + immutability + palindrome; 15–30 min; plain `<a>` only |
| **3** | Python Operators (`//`, `**`, Logical, `is` vs `==`, `in`, Bitwise) & Precedence | **Tier A** (`23m`) | `#operators` | Explicitly works bitwise `& \| ^ ~ << >>` incl. `~x = -(x+1)`; 15–25 min; verify live |
| **4** | Python Fundamentals: Indentation, Built-in Data Types, Mutability & Casting | **Tier A** (`44m`) | `#variables` | Explains `id()`, mutable vs immutable, and implicit/explicit conversion; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A — resolves 35 misses)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 1 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q19,Q24,Q26`, `P004-Q3,Q16`, `P005-Q12` | 1–8m | U1 `Built-ins / all`, `Keywords`, `Python basics / scope`, `Comments / docstrings`, `Basics / sequences / conditionals`, `Built-in functions` | 5 Unmatched + 1 wrong redirect (`P005-Q12→U3`) | `#python-basics-keywords-comments-and-builtins` — *Python Basics, Indentation, Keywords, Comments, Docstrings and Built-in Functions (`all`, `any`)* |
| `P003-Q27`, `P005-Q22`, `P006-Q5` | 8,8,2m | U1/U2 `Strings / mutability`, `range() / string formatting / mutability`, `Mutability` | Unmatched | `#data-types-mutability-and-type-conversion` — *Built-in Data Types, Mutability and Type Conversion* |
| `P003-Q18,Q32c` | 1m, 3m | U1/U3 `datetime` | Unmatched (`Q32`) | `#datetime-in-python` — *Date and Time Using `datetime`* |
| `P003-Q3,Q10,Q20,Q22`, `P004-Q15`, `P006-Q17` | 1–8m | U1/U2 `Strings / slicing`, `Strings / methods`, `Strings / len`, `Strings / join`, `Strings / palindromes` | All Unmatched | `#strings-slicing-methods-join-and-palindromes` — *Strings: Slicing, `len`, `split`, `join` Methods, String Formatting and Palindromes* |
| `P003-Q8,Q12,Q14,Q15,Q21`, `P004-Q4,Q7,Q8,Q12,Q17`, `P005-Q14`, `P006-Q18` | 1–8m | U1/U2 `Lists`, `Slicing`, `Lists / sort / reverse`, `Lists / methods`, `Lists / built-ins`, `Copy semantics`, `Lists / literals`, `List mutation during iteration` | 11 Unmatched + 1 redirect | `#lists-slicing-methods-and-copy-semantics` — *Lists: Literals, Slicing, Methods (`sort`, `reverse`), List Mutation During Iteration and Copy Semantics* |
| `P003-Q1,Q25`, `P005-Q7` | 1,1,2m | U1 `Tuples`, `Lists / tuples` | All Unmatched | `#tuples-and-sequences` — *Tuples, Sequences and List vs Tuple Comparison* |
| `P003-Q7,Q9,Q29`, `P004-Q6` | 1–8m | U1 `Dictionaries`, `Dictionaries / keys`, `Dictionaries / sequences` | All Unmatched | `#dictionaries-keys-and-methods` — *Dictionaries, Hashable Keys and Dictionary Methods* |
| `P005-Q13` | 2m | U1 `Sets / union` | Unmatched | `#sets-and-union` — *Sets and Set Union Operations (Exam Note)* |
| `P003-Q11`, `P006-Q7,Q20` | 1,2,8m | U1/U2 `Operator precedence`, `Logical / identity / bitwise operators` | All Unmatched | `#logical-identity-bitwise-and-operator-precedence` — *Logical, Identity, Bitwise Operators and Operator Precedence* |
