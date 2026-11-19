# CST203 Unit 3 — Functions, Modules and Packages

> **Target file:** `subjects/CST203/units/unit-3.html` (current: `4,340w` → target: **`~5,800–6,400w`**)  
> **Syllabus (`syllabus.json`, PDF pp. 5–6):** **6 contact hours** (of `30h`, `2` credits, L–T–P `2-0-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`92 / 387` marks (`23.8%`, #2 in Python)** · avg **`23.0m/paper`** · **`4/4` papers** · **`17m` MCQ + `75m` 8m-subparts** (`P001-2022-06` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#parameters`, `#modules`  
> **Existing `<section id>`s to preserve (14):** `overview`, `functions`, `parameters`, `scope`, `modules`, `packages`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s at planning time:** `0`.
> **Shipped 2026-11-19 (part 13.3) — `12`, not the planned `6`:** `#defining-and-calling-functions`, `#built-in-versus-user-defined-functions`, `#positional-keyword-and-default-arguments`, `#variable-length-arguments`, `#passing-a-list-and-mutating-it`, `#lambda-functions-and-recursion`, `#legb-local-global-and-nonlocal`, `#class-namespace-scope`, `#creating-and-importing-modules`, `#standard-library-math-random-and-sys-argv`, `#module-versus-package`, `#pip-and-installing-packages`. The extra headings were authored because stored PYQ topics had nowhere correct to land without them — the anchor count is a planning number, not a target. Page shipped at `7,494w`.

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF pp. 5–6)
- **Functions:** Function definition (`def`); function calling; function arguments (required/positional, keyword, default, variable-length `*args` and `**kwargs`); returning values (`return`); variable scope (`local` and `global`).
- **Modules:** Creating and using `.py` modules; importing modules (`import`, `import ... as`, `from ... import`); standard library modules (`math`, `random`, `sys` incl. `sys.argv`, `os`, `datetime`).
- **Packages:** Package directory structure (`__init__.py`); importing from packages; installing external packages using `pip`; creating and installing custom packages.

> **Strict Syllabus-Boundary Disclosure (`pandas` / `numpy` / `scipy` / `matplotlib`, `lambda`, recursion):**
> - None of `pandas`, `numpy`, `scipy`, or `matplotlib` appears in PDF pp. 5–7 (`CST203`) or pp. 16–18 (`CST213`). Across `2023–2026`: **`pandas` = `0m`** (exclude), **`scipy` = `0m`** (exclude), **`matplotlib` = `0m`** (MCQ distractor only in `P003-Q6` — exclude), and **`numpy` = `3m`** (`P005-Q23iii`, flagged with `syllabusNote`) — isolate in one compact ~120w badged **Tier E** callout inside `#packages`.
> - Anonymous `lambda` (`11m`: `P005-Q6`, `P006-Q21b`, `P006-Q23b`) and recursive factorial (`4m`: `P005-Q18ii`) are likewise placed in an explicitly badged **Tier E** subsection inside `#functions`.

---

## 2. Current Page Audit & Gaps (`subjects/CST203/units/unit-3.html`)
- **Live metrics:** `4,340` words · `19` `<pre>` blocks · `5` `<table>`s · `0` `<svg>`s · `0` `<h3 id>`s · `8` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#functions` `275w`, `#parameters` `469w`, `#scope` `250w`, `#modules` `285w`, `#packages` `234w` (`1,513w` concept prose — far too thin for `92m` / `75m` Group B!).
- **Specific gaps to fix:**
  1. `#packages` (`234w` for `20m`) needs a crystal-clear **Module vs Package Comparison Table** with directory tree and runnable import demo (`P003-Q32a`, `P005-Q19i`, `P006-Q22a,b`), full `pip` command reference (`P003-Q6`), and the badged ~120w **Tier E `NumPy`** note (`P005-Q23iii`).
  2. `#functions` + `#parameters` (`744w` for `49m`) need a built-in vs user-defined table (`P006-Q21a`), list-passing mutation vs copy demo (`P004-Q23ii`), mutable-default-argument pitfall, and the badged **Tier E `lambda` + recursive factorial** subsection (`P005-Q6,Q18ii`, `P006-Q21b,Q23b`).
  3. `#scope` (`250w` for `11m`) needs an inline SVG LEGB diagram plus `nonlocal` and class-attribute scope to cover all four terms asked in `P005-Q19ii`.
  4. `#modules` (`285w` for `12m`) misses explicit `sys.argv` demo (`P003-Q2`) and `__name__ == "__main__"`.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`92m`)

| Topic Cluster | Marks | % of U3 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Functions, 4 argument types (`*args`, `**kwargs`, default, positional/keyword), list passing & `return`** | **34m** | **37.0%** | **8.8%** | **4/4** | **Tier A** | `P003-Q16,Q23` (2×1m), `P003-Q30a(4m return),Q30b(4m required & default)`, `P003-Q32b(3m arbitrary args)`; `P004-Q10` (2m), `P004-Q19i..iii(8m positional/default/variable-length)`, `P004-Q23ii(4m pass list)`; `P005-Q18i(4m 4 arg types)`; `P006-Q21a(3m user-defined vs built-in)` |
| **Packages & `pip` (and module vs package comparison)** | **17m** | 18.5% | 4.4% | 3/4 | **Tier B** | `P003-Q6` (1m `PIP`), `P003-Q32a(2m module & package)`; `P005-Q19i(4m module vs package)`; `P006-Q12` (2m), `P006-Q22a(2m purpose of packages),Q22b(6m module vs package w/ example)` |
| **Anonymous (`lambda`) & recursive functions** | **15m** | 16.3% | 3.9% | 2/4 | **Tier E** | `P005-Q6` (2m `lambda`), `P005-Q18ii(4m recursive factorial)`; `P006-Q21b(5m lambda + why used)`, `P006-Q23b(4m lambda)` |
| **Modules: `import` forms, `math`/`random` & `sys.argv`** | **12m** | 13.0% | 3.1% | 3/4 | **Tier B** | `P003-Q2` (1m `sys.argv`), `P003-Q5` (1m `math`), `P003-Q31b(4m importing module)`; `P004-Q1,Q14` (2×2m); `P006-Q11` (2m `import`) |
| **Variable scope: `local`, `global`, `nonlocal` & class namespace** | **11m** | 12.0% | 2.8% | 3/4 | **Tier B** | `P003-Q26b(3m local vs global)`; `P004-Q23i(4m local vs global w/ examples)`; `P005-Q19ii(4m global, local, class & nonlocal)` |
| **`NumPy` external-package question (`np.fft` & array add)** | **3m** | 3.3% | 0.8% | 1/4 | **Tier E** | `P005-Q23iii(3m FFT package + add two arrays using NumPy)` |
| **Authoring & installing a custom local package** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 6), 0 hits in 2023–2026_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#functions` & `#parameters` [LOCKED] — Functions, 4 Argument Types & Tier E `lambda`/Recursion (~48% prose)
- `def` syntax, docstring, **Built-in vs User-Defined Functions** comparison table (`P006-Q21a`), and `return` semantics (single value, multiple values packed as tuple + caller unpacking, implicit `None` when omitted — `P003-Q23,Q30a`, `P004-Q10`).
- **Four Argument Styles** with side-by-side runnable scripts (`P003-Q16,Q30b,Q32b`, `P004-Q19`, `P005-Q18i`):
  1. Required (positional) arguments — count & order match.
  2. Keyword arguments `area(width=4, height=5)` — order-independent.
  3. Default arguments `def power(x, exp=2):` — parameter-order rule + mutable-default `def add(x, buf=None):` trap.
  4. Variable-length `*args` (tuple of extra positionals) and `**kwargs` (dict of extra keywords) + signature order `(pos, default, *args, kw_only, **kwargs)`.
- **Passing a list to a function** (`P004-Q23ii`): traversal/sum + in-place `.append()` mutation vs defensive `items.copy()`.
- **Badged Tier E Subsection (`15m`):** `lambda params: expr` syntax, why used (short inline callbacks for `sorted(..., key=...)`, `map()`, `filter()`), `def` vs `lambda` comparison table (`P005-Q6`, `P006-Q21b,Q23b`), plus recursive `factorial(n)` with base case `n <= 1` and call trace (`P005-Q18ii`).

### 4.2 `#packages` — Packages, Module vs Package, `pip` & Tier E `NumPy` (~20% prose)
- Package directory diagram (`shop/__init__.py`, `shop/billing.py`, `shop/cart.py`), purpose of packages (`P006-Q22a`), and full **Module vs Package Comparison Table** with runnable `from shop.billing import total` example (`P003-Q32a`, `P005-Q19i`, `P006-Q12,Q22b`).
- `pip` CLI guide (`pip install`, `uninstall`, `list`, `show`, `freeze > requirements.txt` — `P003-Q6`) + 4-line **Tier S** custom package editable install (`pyproject.toml` + `pip install -e .`).
- **Badged Tier E Exam Note (~120w, `3m`):** State explicitly that third-party scientific packages are not in the printed syllabus; note `numpy` (`numpy.fft.fft`) provides Fast Fourier Transform and give the 4-line `np.add(np.array([1,2,3]), np.array([4,5,6]))` snippet answering `P005-Q23iii` (zero `pandas`/`scipy`/`matplotlib`).

### 4.3 `#modules` [LOCKED] — Custom & Standard Library Modules (~17% prose)
- Creating `calc.py`, all 4 `import` styles (`import math`, `import math as m`, `from math import sqrt, pi`, why wildcard `from math import *` pollutes namespace — `P003-Q31b`, `P004-Q1`, `P006-Q11`), `__name__ == "__main__"` guard, `dir()`, and `sys.path`.
- High-yield stdlib table & demos: `math` (`sqrt, ceil, floor, factorial, gcd, pi` — `P003-Q5`), `random` (`random, randint, randrange, choice, shuffle` — `P004-Q14`), `sys` (`sys.argv` command-line argument list with `sys.argv[0]` script name — `P003-Q2`), cross-linking `datetime` (U1) and `os`/`re` (U4).

### 4.4 `#scope` — LEGB, `local`, `global`, `nonlocal` & Class Scope (~15% prose)
- LEGB resolution chain (`Local → Enclosing → Global → Built-in`), **Local vs Global Comparison Table** + `global` keyword & `UnboundLocalError` demo (`P003-Q26b`, `P004-Q23i`), nested closure `nonlocal count` example, and concise 6-line class-namespace attribute note (`Counter.total` vs `self.val`) covering `P005-Q19ii`.

### 4.5 Practice & Revision Bank
- `10` MCQs, `5` short answers, and `5` worked 8m model answers.

---

## 5. Programs, Diagrams & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) Concentric LEGB scope rings (`Local ⊂ Enclosing ⊂ Global ⊂ Built-in`); (2) Single `.py` Module vs Hierarchical Package directory with `__init__.py`.
- [ ] **Runnable `python3` scripts (8):** 4 argument types in action; passing list to function; `lambda` with `sorted`/`map`/`filter` + recursive `factorial`; `local`/`global`/`nonlocal`/class-attr demo; custom module with `__name__ == "__main__"`; `math`/`random`/`sys.argv` demo; package import demo; `ast.parse`-checked 4-line `numpy` box.
- [ ] **Comparison tables (5):** Built-in vs User-Defined functions; 4 Argument types; `def` vs `lambda`; Local vs Global vs Nonlocal; Module vs Package.

---

## 6. Paired Practical Lab Cross-Links (`subjects/CST213/index.html`, PDF pp. 16–18)

| `CST213` Practical Area | Unit 3 Section Tie-In | Student Cross-Link Prompt |
| :--- | :--- | :--- |
| **Area 5:** Functions and modules | `#functions`, `#parameters`, `#modules`, `#packages` | Direct 1:1 lab match — link from `#modules` & `#practice` for reusable `.py` module, `*args`/`**kwargs`, and stdlib scripts |

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Python Functions, `return`, Positional/Keyword/Default Args, `*args`/`**kwargs` & `lambda` | **Tier A/E** (`49m`) | `#parameters` | Python 3.x; covers all 4 arg styles + mutable-default trap + `lambda`; 20–35 min; verify live |
| **2** | Python Modules vs Packages, `__init__.py`, `import` Forms, `sys.argv` & `pip` | **Tier B** (`29m`) | `#packages` | Shows real folder layout, `__name__ == "__main__"`, and `pip install`; 15–30 min; plain `<a>` |
| **3** | Python Variable Scope (LEGB Rule): `local`, `global` & `nonlocal` | **Tier B** (`11m`) | `#scope` | Demonstrates `UnboundLocalError`, `global`, and nested `nonlocal`; 10–20 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 3 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q16`, `P005-Q18` | 1m, 8m | U3 `Functions / default arguments`; U3 `Function arguments / recursion` | Unmatched | `#default-positional-and-variable-length-arguments` — *Function Arguments: Positional, Keyword, Default Arguments and `*args`/`**kwargs`* |
| `P005-Q6`, `P006-Q21b`, `P006-Q23` *(part b)* | 2,5,8m | U3 `Anonymous functions` / U4 `Files / lambda` | `Q23` Unmatched | `#lambda-functions-and-recursion` — *Anonymous `lambda` Functions and Recursion (Exam Note)* |
| `P003-Q2`, `P003-Q32`, `P006-Q11` | 1,8,2m | U3/U4 `Modules / sys.argv`, `Modules / functions / datetime`, `Modules` | `Q2,Q32` Unmatched; `Q11` redirect | `#importing-modules-and-sys-argv` — *Importing Modules, `math`, `random` and `sys.argv`* |
| `P005-Q19`, `P006-Q12`, `P006-Q22` | 8,2,8m | U3/U4 `Modules / packages / scope`, `Packages`, `Modules / packages` | `Q19` Unmatched; `Q12,Q22` redirect | `#modules-packages-and-pip` — *Python Packages, Module vs Package Comparison and `pip`* |
| `P003-Q26b`, `P004-Q23i`, `P005-Q19ii` | 3,4,4m | U1/U3 `scope` | Routed to `#scope` | `#local-global-nonlocal-and-class-scope` — *Variable Scope: `local`, `global`, `nonlocal` and Class Namespace* |
| `P005-Q23iii` | 3m | U4 `Regular expressions / NumPy` | Routed to U4 `#regex` | `#external-packages-numpy-exam-note` — *External Packages with `pip` (`NumPy` Exam Note)* |
