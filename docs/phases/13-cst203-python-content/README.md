# Phase 13 — Scripting Languages (Python): Weight-Calibrated Content, Video Curation & PYQ Sync

> **Status:** 📋 Planned (documentation blueprint — zero shipped files modified)  
> **Subject:** Scripting Languages (Python) (`CST203`, paired practical `CST213` Scripting Languages Lab)  
> **Syllabus authority:** `docs/syllabus/syllabus.json` & `docs/syllabus/syllabus-3rd-sem-2022.pdf` **pp. 5–7** — **2 credits, L–T–P `2-0-0`, 30 contact hours (`7 + 5 + 6 + 6 + 6`)** across 5 official units  
> **Paired practical:** `CST213` Scripting Languages Lab — **PDF pp. 16–18** (`2` credits, L–T–P `0-0-4`, 4 hrs/week, 8 practical areas; honest reference page at `subjects/CST213/index.html`)  
> **PYQ weighting window (strict 2023–2026):** **4 papers, 104 scan-verified questions, 387 printed set marks** (`P003-2023-03` [34 Qs / 97m], `P004-2024-01` [23 Qs / 94m], `P005-2024-12` [23 Qs / 94m], `P006-2026-01` [24 Qs / 102m]; each paper = 60 max answerable marks). Older `P001-2022-06` (1 paper, 66 Qs) remains archived in `_data/CST203/` and is strictly excluded from topic weighting and scope sizing.  
> **Execution order:** **#2 priority** in the recommended `15 → 13 → 16 → 14 → 12` sequence (fully independent — may execute in any order).

---

## 1. Goal & 2023–2026 Exam-Weight Baseline

Eliminate the site's upside-down Python word-count distribution (where `7.8%`-weight Django Unit 5 at `5,657w` is currently **longer** than `39.3%`-weight Unit 1 at `5,304w` and nearly **double** `16.5%`-weight Unit 2 at `2,912w`) and fix the repository's highest PYQ topic-link miss rate (**55 / 104 = 52.9% unmatched** caused by **0** authored `<h3 id>` headings across all five Python pages):

| Unit | Official Title (`syllabus.json`, pp. 5–7) | Hrs | Stored PYQ Tag (Q / m) | True 2023–2026 Weight | Share | Avg / Paper | MCQ + Long | Papers | Current Words → Target | Unit Blueprint |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Unit 1** | Introduction | 7h | 51 Q / 131m | **152m** | **39.3%** | 38.0m | 64m + 88m | 4/4 | 5,304w → ~7,200–8,000w | [`unit-1/README.md`](unit-1/README.md) |
| **Unit 2** | Control Statements | 5h | 19 Q / 92m | **64m** | **16.5%** | 16.0m | 20m + 44m | 4/4 | 2,912w → ~4,600–5,200w | [`unit-2/README.md`](unit-2/README.md) |
| **Unit 3** | Functions, Modules and Packages | 6h | 17 Q / 70m | **92m** | **23.8%** | 23.0m | 17m + 75m | 4/4 | 4,340w → ~5,800–6,400w | [`unit-3/README.md`](unit-3/README.md) |
| **Unit 4** | Files & Regular Expressions | 6h | 10 Q / 56m | **49m** | **12.7%** | 12.2m | 8m + 41m | 4/4 | 4,805w → ~4,800–5,300w | [`unit-4/README.md`](unit-4/README.md) |
| **Unit 5** | Framework | 6h | 7 Q / 38m | **30m** | **7.8%** | 7.5m | 6m + 24m | 4/4 | 5,657w → ~3,800–4,300w | [`unit-5/README.md`](unit-5/README.md) |
| **Total** | **5 Official Units** | **30h** | **104 Q / 387m** | **387m** | **100.0%** | **96.8m** | **115m + 272m** | **4/4** | **23,018w → ~26.2–29.2kw** | **5 unit folders** |

*Baseline `focusQuestionTopic()` routing across all 104 `2023–2026` Python questions:*
- **42 same-unit hits (`40.4%`)**
- **7 cross-unit redirects (`6.7%`)** — including `P005-Q12` (`Built-in functions` → `U3#functions` instead of U1 basics)
- **55 unmatched questions (`52.9%`)** — because all 5 Python unit pages currently have **zero** `<h3 id>` subheadings (`Tuples`, `Lists`, `Dictionaries`, `Slicing`, `Keywords`, `Conditionals`, `Pass statement`, `Django static files`, etc. never hit `>= 0.5`)

### Key 2023–2026 Calibration & Syllabus-Fidelity Findings
1. **Unit 1 alone carries nearly 40% of every Python exam (`152m = 39.3%`, #1 unit in the entire repository):** Lists, tuples, dictionaries, slicing, and shallow/deep copy alone earn **`54m` (`14.0%`, 22 hits across `4/4` papers)**, followed by strings & immutability (`25m`), syntax/indentation/features/keywords/built-ins (`23m`), operators & precedence (`23m`, incl. `P006-Q20b` 6m bitwise output trace), and built-in data types/mutability/conversion (`21m`).
2. **Unit 3 is the strong #2 pillar (`92m = 23.8%`, `75m` of it in Group B):** Functions, the 4 argument styles (positional, keyword, default, `*args`/`**kwargs`), passing lists, and `return` score `34m`, packages + `pip` vs modules `17m`, `lambda` + recursion `15m`, standard modules + `sys.argv` `12m`, and `local`/`global`/`nonlocal`/class scope `11m`.
3. **Strict scientific-stack syllabus audit (`pandas` / `numpy` / `scipy` / `matplotlib`):** None of these four libraries appears anywhere in the Revised-2022 `CST203` syllabus (PDF pp. 5–7) or `CST213` lab syllabus (PDF pp. 16–18). Across `2023–2026`:
   - **`pandas` = `0m`** — do **not** teach `pandas` (appeared only in excluded 2022 archive).
   - **`scipy` = `0m`** — omit completely.
   - **`matplotlib` = `0m`** — appeared only as a wrong MCQ distractor for `PIP` in `P003-Q6`; omit.
   - **`numpy` = `3m`** — single out-of-syllabus subquestion `P005-Q23(iii)` (flagged with `syllabusNote`: FFT package + adding two arrays using `numpy`). Cover solely in a compact, explicitly badged **Tier E** callout (~120w) in Unit 3 `#packages`.
4. **All four 2023–2026 Tier E extensions are bounded (`22m = 5.7%` total):**
   - `lambda` (`11m`: `P005-Q6`, `P006-Q21b`, `P006-Q23b`) + recursive factorial (`4m`: `P005-Q18ii`) → badged **Tier E** subsection in U3 `#functions`.
   - `numpy` FFT & array addition (`3m`: `P005-Q23iii`) → badged **Tier E** callout in U3 `#packages`.
   - `set` literal & union `|` (`2m`: `P005-Q13`) → badged **Tier E** callout in U1 `#collections`.
   - `Django vs Flask` comparison (`2m`: `P005-Q21iii`) → badged **Tier E** table in U5 `#django-intro`.
   - Zero OOP class/inheritance chapters and zero `threading` in `2023–2026` — excluded (only a 2-line class-namespace note for `P005-Q19ii`).
5. **Unit 2 expanded (`2,912w → ~4,600–5,200w`) & Unit 5 right-sized (`5,657w → ~3,800–4,300w`):** In Unit 5, `#forms` currently takes `757w` for **`0m`** (condense to ~250w **Tier S**), while `93%` of Unit 5 marks repeat MVC/MVT + why Django + project steps + static/templates.
6. **Recommended intra-phase priority order:** **Unit 1 (39.3%) → Unit 3 (23.8%) → Unit 2 (16.5%) → Unit 4 (12.7%) → Unit 5 (7.8%)**.

---

## 2. Weight-Tier System Applied Across Units 1–5

| Tier | 2023–2026 Threshold | Depth & Practice Budget | Python Topic Clusters |
| :--- | :--- | :--- | :--- |
| **Tier A — Core Heavyweight** | `>= 20m` (`>= 5.0%`) or `4/4` papers w/ repeated 8m | Full visual model, `python3`-verified code, output traces, comparison table, heavy MCQ + 8m practice | U1 Lists/tuples/dicts/slicing/copy (`54m`), U3 Functions/4 arg types/`return` (`34m`), U1 Strings/methods/formatting/immutability (`25m`), U1 History/features/indentation/keywords (`23m`), U1 Operators & precedence (`23m`), U1 Data types/mutability/conversion (`21m`), U2 `break`/`continue`/`pass`/`for-else` (`21m`), U2 `for`/`while`/`range()` (`20m`), U4 File read/write & word-count (`20m`), U5 MVC/MVT & why Django (`19m`, `4/4`) |
| **Tier B — Regular** | `10–19m` (`2.5–4.9%`), `3–4` papers | Clear theory, comparison table, 2–3 runnable scripts, 2–3 MCQs + 1–2 long answers | U3 Packages & `pip` vs modules (`17m`), U2 Loop programs (prime, digit sum, tuple loop) (`16m`), U4 File access modes (`14m`), U3 Modules & `sys.argv` (`12m`), U3 Scope `local`/`global`/`nonlocal`/class (`11m`), U4 Regex `re` (`11m`) |
| **Tier C — Low-Weight** | `1–9m` (`< 2.5%`) | Concise explanation + 1–2 runnable snippets + 1–2 practice items | U5 Django setup, URLs, templates & static files (`9m`), U2 `if`/`elif`/`else` (`7m`), U1 `datetime` (`4m`), U4 Console `input()`/`print(sep,end)` (`4m`) |
| **Tier S — Syllabus-Only (`0m`)** | In PDF pp. 5–7, `0m` in `P003–P006` | Compact ~120–250w syllabus summary + 1 minimal snippet | U1 Install/env vars/debugging; U3 Custom package authoring; U4 `tell()`/`seek()`, `os.rename`/`os.remove`, `re.sub`/flags, Python 2 `raw_input` note; U5 Django forms (`forms.Form`, CSRF) |
| **Tier E — Exam Extension** | Tested in `P003–P006`, outside unit list | Explicitly badged out-of-syllabus exam callout sized strictly to marks | U3 `lambda` (`11m`) + recursive factorial (`4m`), U3 `NumPy` FFT & array-add (`3m`), U1 `set` & `\|` union (`2m`), U5 `Django vs Flask` (`2m`) |

---

## 3. Live Shipped-Asset Inventory (`CST203` + `CST213`)

| Asset | Current State on Disk | Phase 13 Action |
| :--- | :--- | :--- |
| `subjects/CST203/units/unit-{1..5}.html` | `23,018w` (`5,304 + 2,912 + 4,340 + 4,805 + 5,657`), `93` `<pre>`, `45` `<table>`, `0` `<svg>`, **`0` `<h3 id>`**, `0` YouTube links, `0` code leaks | Rebalance to `~26.2–29.2kw` (`U1 > U3 > U4 ≈ U2 > U5`), add SVGs, `14` verified plain-`<a>` YouTube links, and `28` semantic `<h3 id>` anchors |
| `docs/suggestions/guides.json` (`CST203`) | `10` locked reading anchors (`collections`, `strings`, `loops`, `loop-control`, `parameters`, `modules`, `fileio`, `regex`, `mvc`, `urls-templates`) | Preserve 10/10 unchanged; verify via `build_suggestions.py --check` |
| `docs/revision-sheets/CST203.json` | `10` entries across all 5 units (`U1:4, U2:1, U3:2, U4:2, U5:1`) | Keep anchor links aligned; rebuild via `build_revision_sheets.py` |
| `subjects/CST213/index.html` | Paired Scripting Languages Lab page (8 practical areas, PDF pp. 16–18) | Cross-link matching areas from every unit's `#practice` section |
| `_data/CST203/*.json` & `_quiz-data/CST203/*.json` | `5` PYQ files (`170` total Qs; `104` in `P003–P006`), `5` quiz files (`217` MCQs) | **Read-only in Mode A** (`check_pyq_integrity.py` = `0` drift) |

---

## 4. Scope In, Scope Out & Reuse Scan

### In Scope (when Phase 13 executes)
- Rebalancing and upgrading `subjects/CST203/units/unit-{1..5}.html` per [`unit-1/README.md`](unit-1/README.md)–[`unit-5/README.md`](unit-5/README.md).
- Preserving all **10 locked `guides.json` anchors** and all **65 existing `<section id>`s** (`14+12+14+12+13`).
- Authoring **28 clean `<h3 id>` subheadings** across Units 1–5 so **104 / 104** `2023–2026` Python PYQ questions resolve via `focusQuestionTopic()` in Mode A (eliminating all `55` baseline misses).
- Executing every standalone Python 3 snippet with `python3` (and `ast.parse` on Django/NumPy snippets) to guarantee zero output bugs.
- Live-verifying **14 plain external `<a>` YouTube links** (`4+2+3+3+2`), cross-linking `subjects/CST213/index.html`, and passing every `README.md:161–215` rebuild and verification gate.

### Out of Scope
- Adding `pandas`, `scipy`, `matplotlib`, `threading`, or full OOP class/inheritance tutorials.
- Editing `_data/CST203/*.json`, `_quiz-data/CST203/*.json`, or `_data/pyq-integrity.json` without explicit Mode B owner approval.
- Adding `<iframe>` embeds, `i.ytimg.com` thumbnails, new CSS/JS bundles, reopening Phases 1–10, or deploying.

### Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js`.
- **ADAPT:** `assets/js/unit-discovery.js` heading-search (`focusQuestionTopic()`) via newly authored `<h3 id>` subheadings.
- **REJECT:** Third-party embeds/CDNs, Python 2 active syntax (except the required 3-line `raw_input` historical note), and unexamined scientific-library padding.

---

## 5. Dependencies, Gates & Risks

| Area | Constraint / Gate | Mitigation |
| :--- | :--- | :--- |
| **Dependencies** | Closed Phases 0–10 + `guides.json` (Phase 11) | Independent of Phases 12, 14–16 |
| **Code correctness** | Python floor division, slicing, aliasing, LEGB, and `re` outputs are subtle | Run all standalone code blocks under `python3` in sandbox; `ast.parse` on Django/NumPy snippets |
| **Syllabus honesty** | `22m` of 2023–2026 PYQs touch `lambda`, recursion, `numpy`, `set`, Flask | Badge every Tier E item transparently as *"Exam note (outside printed syllabus)"* |
| **Accessibility & budget** | Strict `h1 → h2 → h3`, AA tokens, CSS ≤ 340 KB, JS ≤ 350 KB | Verify via `audit_accessibility.py --fail`, `check_tokens.py --strict`, `audit_page_weight.py --budget` |
| **Discovery tests** | New `<h3 id>`s raise `unitAnchored` in `tests/test_discovery.py:111` | Update exact count after `build_search_index.py`; run `unittest` + `node tests/discovery-dom.cjs` |

---

## 6. Done Means

- [ ] All 6 parts in [`tasks.md`](tasks.md) complete with evidence in [`record.md`](record.md).
- [ ] Word counts follow true 2023–2026 weight order (`U1 > U3 > U4 ≈ U2 > U5`), all Tier E callouts carry honest out-of-syllabus badges, and zero `pandas`/`scipy`/`matplotlib` drift appears.
- [ ] All 10 `guides.json` anchors and all 65 `<section id>`s preserved; all Python snippets pass `python3` / `ast.parse`.
- [ ] All 14 YouTube links live-verified as plain external `<a>` tags and logged in `record.md`.
- [ ] `104 / 104` `2023–2026` Python PYQs resolve to exact concept headings (`0` unmatched, `check_pyq_integrity.py` = `0` drift).
- [ ] Full `README.md:161–215` rebuild & verification gates pass; owner test steps + `rule.md` §7 Termux block printed; paused for owner sign-off.
