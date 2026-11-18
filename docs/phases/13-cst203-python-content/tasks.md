# Phase 13 Tasks — Scripting Languages (Python) (6 Parts)

> **Execution order:** Weight-priority (`13.1 → 13.3 → 13.2 → 13.4 → 13.5 → 13.6`) or sequential (`13.1 → 13.6`).  
> **Weighting basis:** Strict **2023–2026 PYQ window** (`P003–P006`: `4` papers, `104` scan-verified Qs, `387` set marks; `P001-2022-06` excluded).  
> **Standing rules:** Preserve all `10` locked `guides.json` anchors & `65` `<section id>`s (`14+12+14+12+13`); zero `pandas`/`scipy`/`matplotlib`/`threading`/OOP chapters; badge all 4 Tier E callouts honestly; zero raw `CST203`/`CST213`/`P00X` strings; plain external `<a>` YouTube links only.

---

## Part 13.1 — Unit 1: Introduction (`152m / 39.3%`, 7h, PDF p. 5 — #1 Unit in Repo)
- **Target file:** `subjects/CST203/units/unit-1.html` (`5,304w → ~7,200–8,000w`) · Blueprint: [`unit-1/README.md`](unit-1/README.md)
- **Implementation checklist:**
  - [ ] Expand **Tier A `#collections` (`54m` + `2m` Tier E `set`, ~36% prose)**: lists (indexing vs slicing `[start:stop:step]`, negative steps, `append`/`extend`/`insert`/`remove`/`pop`/`sort`/`reverse`, built-ins, aliasing vs shallow vs `deepcopy` SVG, loop-mutation trap), tuples (`(42,)`, packing/unpacking, immutability), dictionaries (hashable-key rule, `get`/`keys`/`values`/`items`/`update`/`pop`/`clear`), master 3-way List vs Tuple vs Dict table, and badged ~100w **Tier E `set` & `|` union box**.
  - [ ] Expand **Tier A `#strings` (`25m`, ~18% prose)**: quotes/raw strings, slicing, immutability proof & diagram, `split`/`join`/`strip`/`lower`/`upper`/`replace`/`find`/`count`, all 3 formatting styles (`%`, `.format()`, f-strings), and palindrome program.
  - [ ] Expand **Tier A `#operators` (`23m`, ~16% prose)**: all 7 operator groups, `-7 // 2 == -4`, right-associative `**`, `and`/`or`/`not`, `is` vs `==`, `in`, full bitwise output trace on `a, b = 5, 3` (`& | ^ ~ << >>`), and precedence table.
  - [ ] Expand **Tier A + Tier C `#variables` (`21m` + `4m`, ~16% prose)**: built-in types, Mutable vs Immutable table with `id()`, implicit coercion vs explicit conversions, and `datetime.now()` / `strftime()`.
  - [ ] Build **Tier A + Tier S `#intro` (`23m`, ~14% prose)**: history, features, `.py` CLI run, indentation rules & `IndentationError`, `#` comments vs `__doc__` docstrings, identifiers/keywords (`True`/`False`/`None`), `all()`/`any()`, and compact ~120w **Tier S** installation/`PATH`/traceback note.
  - [ ] Calibrate practice (`14` MCQs, `6` short, `6` worked 8m), add `9` `<h3 id>` anchors, cross-link `subjects/CST213/index.html` (Areas 1–3), and insert `4` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#collections`, `#strings` & all `14` `<section id>`s preserved; every snippet runs cleanly in `python3`; 4 verified URLs logged in `record.md`.

---

## Part 13.2 — Unit 2: Control Statements (`64m / 16.5%`, 5h, PDF p. 5 — Under-Sized Fix)
- **Target file:** `subjects/CST203/units/unit-2.html` (`2,912w → ~4,600–5,200w`) · Blueprint: [`unit-2/README.md`](unit-2/README.md)
- **Implementation checklist:**
  - [ ] Expand **Tier A + Tier B `#loops` (`20m` + `16m = 36m`, ~52% prose)**: purpose of loops, `for` vs `while` comparison table (plus no `do-while` note), complete `range(start, stop, step)` guide (stop exclusion, negative step, empty range), nested-loop example, and verified programs for prime check (`for...else`), digit sum (`// 10` & `% 10`), and tuple traversal (`for` & `enumerate`).
  - [ ] Expand **Tier A `#loop-control` (`21m`, 4/4 papers, ~32% prose)**: inline SVG + trace comparing `break` vs `continue` vs `pass`, plus dedicated `for...else` / `while...else` trace (normal exhaustion vs `break`).
  - [ ] Build **Tier C `#conditionals` (`7m`, ~16% prose)**: `if`, `if-else`, `if-elif-else`, nested `if`, ternary `a if c else b`, truthiness/falsiness rules, and worked decision script.
  - [ ] Calibrate practice (`9` MCQs, `4` short, `4` worked 8m), add `5` `<h3 id>` anchors, cross-link `subjects/CST213/index.html` (Area 4), and insert `2` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#loops`, `#loop-control` & all `12` `<section id>`s preserved; word count in `~4,600–5,200w`; all scripts verified in `python3`; 2 URLs logged in `record.md`.

---

## Part 13.3 — Unit 3: Functions, Modules and Packages (`92m / 23.8%`, 6h, PDF pp. 5–6)
- **Target file:** `subjects/CST203/units/unit-3.html` (`4,340w → ~5,800–6,400w`) · Blueprint: [`unit-3/README.md`](unit-3/README.md)
- **Implementation checklist:**
  - [ ] Expand **Tier A + Tier E `#functions` & `#parameters` (`34m` + `15m = 49m`, ~48% prose)**: `def`, docstrings, built-in vs user-defined table, `return` (single, tuple, implicit `None`), all 4 argument types (positional, keyword, default + mutable-default trap, `*args` & `**kwargs`), passing a list to a function, plus badged **Tier E** subsection on `lambda` (`def` vs `lambda` + `sorted`/`map`/`filter`) and recursive `factorial(n)`.
  - [ ] Expand **Tier B + Tier S + Tier E `#packages` (`17m` + `3m`, ~20% prose)**: package tree (`__init__.py`), Module vs Package table + demo, `pip` CLI commands, 4-line **Tier S** `pyproject.toml` editable install note, and badged ~120w **Tier E `NumPy` callout** (`numpy.fft.fft` + `np.add(a, b)` for `P005-Q23iii`; zero `pandas`/`scipy`/`matplotlib`).
  - [ ] Expand **Tier B `#modules` (`12m`, ~17% prose)**: custom `.py` module, 4 `import` styles, `__name__ == "__main__"`, `dir()`, `sys.path`, and `math`, `random`, `sys.argv` quick-reference.
  - [ ] Expand **Tier B `#scope` (`11m`, ~15% prose)**: inline SVG LEGB diagram, Local vs Global table + `global` / `UnboundLocalError`, `nonlocal`, and concise class-attribute scope note (`P005-Q19ii`).
  - [ ] Calibrate practice (`10` MCQs, `5` short, `5` worked 8m), add `6` `<h3 id>` anchors, cross-link `subjects/CST213/index.html` (Area 5), and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#parameters`, `#modules` & all `14` `<section id>`s preserved; zero `pandas`/`scipy`/`matplotlib` content; all snippets verified via `python3` / `ast.parse`; 3 URLs logged in `record.md`.

---

## Part 13.4 — Unit 4: Files & Regular Expressions (`49m / 12.7%`, 6h, PDF p. 6)
- **Target file:** `subjects/CST203/units/unit-4.html` (`4,805w → ~4,800–5,300w`) · Blueprint: [`unit-4/README.md`](unit-4/README.md)
- **Implementation checklist:**
  - [ ] Build **Tier A + Tier B + Tier S `#fileio` (`20m` + `14m = 34m`, ~60% prose)**: complete access-modes table (`r, w, a, x, r+, w+, a+, t, b`), `open`/`close`/`with` context manager + `.name`/`.mode`/`.closed`, side-by-side `read`/`readline`/`readlines` and `write`/`writelines` demos, `file.txt` word-count script, and compact ~180w **Tier S** `tell()`/`seek()` + `os.rename()`/`os.remove()`.
  - [ ] Build **Tier B + Tier S `#regex` (`11m`, ~28% prose)**: pattern matching + raw strings `r"..."`, metacharacter/quantifier table, `re.match` vs `re.search`, `re.findall`, `re.split`, `Match.group/start/end/span`, and compact ~120w **Tier S** `re.sub()` + flags (`IGNORECASE`, `MULTILINE`, `DOTALL`).
  - [ ] Keep **Tier C + Tier S `#inputoutput` (`4m`, ~12% prose)** concise: `input()` returning `str` + type casts, `print(..., sep, end)`, and 3-line Python 2 `raw_input()` historical note.
  - [ ] Calibrate practice (`8` MCQs, `4` short, `4` worked 8m), add `4` `<h3 id>` anchors, cross-link `subjects/CST213/index.html` (Areas 6–7), and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#fileio`, `#regex` & all `12` `<section id>`s preserved; file & regex scripts tested under `python3` in `/tmp`; 3 URLs logged in `record.md`.

---

## Part 13.5 — Unit 5: Framework (`30m / 7.8%`, 6h, PDF p. 6 — Right-Sizing Pass)
- **Target file:** `subjects/CST203/units/unit-5.html` (`5,657w → ~3,800–4,300w`) · Blueprint: [`unit-5/README.md`](unit-5/README.md)
- **Implementation checklist:**
  - [ ] Sharpen **Tier A `#mvc` (~32% prose)**: MVC concepts + inline SVG request cycle + MVC vs Django MVT (MTV) mapping table (`Model ↔ models.py`, `View ↔ template`, `Controller ↔ views.py + urls.py`).
  - [ ] Sharpen **Tier A + Tier C + Tier E `#django-intro` (~32% prose)**: what Django is & 6 batteries-included advantages, numbered 6-step create/run checklist (`venv → pip install django → startproject → migrate → startapp → runserver`), minimal project tree, Project vs App table, and badged ~110w **Tier E Django vs Flask** table.
  - [ ] Keep **Tier C `#urls-templates` (~24% prose)** focused: minimal `urls.py` + `views.py` + DTL (`{{ var }}`, `{% for %}`, `{% if %}`, `{% extends %}`) + static files (`STATIC_URL`, `{% load static %}`, `{% static %}`).
  - [ ] Condense **Tier S `#forms` (`0m`, `757w → ~250w`, ~12% prose)**: preserve `<section id="forms">`, keep one 8-line `forms.Form`, `is_valid()`/`cleaned_data`, and `{% csrf_token %}`.
  - [ ] Calibrate practice (`6` MCQs, `4` short, `3` worked 8m), add `4` `<h3 id>` anchors, cross-link `subjects/CST213/index.html` (Area 8), and insert `2` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [ ] Locked `#mvc`, `#urls-templates` & all `13` `<section id>`s preserved; word count reduced into `~3,800–4,300w`; Python files pass `ast.parse`; 2 URLs logged in `record.md`.

---

## Part 13.6 — PYQ ↔ Unit Sync, Canonical Rebuild & Gate Verification
- **Target files:** `subjects/CST203/units/unit-{1..5}.html`, `docs/revision-sheets/CST203.json` (if needed), `tests/test_discovery.py`, generated search/presence/SW indices, `record.md`, `docs/ROADMAP.md`, `docs/STATUS.md`, `prompt.md`.
- **Verification & rebuild checklist:**
  - [ ] Run `focusQuestionTopic()` simulation across all **104 `2023–2026` Python PYQs**: verify all `55` baseline unmatched items (`42 → ~96+` same-unit + clean redirects, `0` unmatched) resolve to exact authored headings with `0` `_data/CST203/*.json` edits.
  - [ ] Grep-check zero `CST203`/`CST213`/`P00\d`, zero `pandas`/`scipy`/`matplotlib` teaching prose, and zero `<iframe>`/`ytimg` references.
  - [ ] Execute `README.md:187–215` canonical rebuild (`generate_presence.py` twice, `build_data_version.py` last), update `unitAnchored` in `tests/test_discovery.py:111`, and pass all 13 Python gates + `unittest` + `node tests/discovery-dom.cjs`.
  - [ ] Record evidence in `record.md`, update `docs/ROADMAP.md`, `docs/STATUS.md`, `prompt.md`, print **"What to test on the website"** + `rule.md` §7 Termux block, and wait for owner sign-off.
- **Acceptance & evidence:**
  - [ ] `check_pyq_integrity.py` = `0` drift; `build_suggestions.py --check`, `check_site.py --strict --quiet`, `audit_accessibility.py --fail`, `check_tokens.py --strict`, `audit_page_weight.py --budget`, `unittest`, and `discovery-dom.cjs` all pass.
