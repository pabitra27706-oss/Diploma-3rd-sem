# Phase 12 — Computer Programming in C: Weight-Calibrated Content, Video Curation & PYQ Sync

> **Status:** 📋 Planned (documentation blueprint — zero shipped files modified)  
> **Subject:** Computer Programming in C (`CST201`, paired practical `CST211` [printed `COPC211` on syllabus p. 2])  
> **Syllabus authority:** `docs/syllabus/syllabus.json` & `docs/syllabus/syllabus-3rd-sem-2022.pdf` **p. 3** — **2 credits, L–T–P `2-0-0`, 30 contact hours (`5 + 5 + 7 + 7 + 6`)** across 5 official units  
> **Paired practical:** `CST211` Computer Programming Lab in C — **PDF p. 14** (`2` credits, L–T–P `0-0-2`, `30` contact hours, 7 practical areas; honest reference page at `subjects/CST211/index.html`)  
> **PYQ weighting window (strict 2023–2026):** **4 papers, 105 scan-verified questions, 395 printed set marks** (`P003-2023-03` [34 Qs / 97m], `P004-2024-01` [23 Qs / 94m], `P005-2024-12` [24 Qs / 102m], `P006-2026-01` [24 Qs / 102m]; each paper = 60 max answerable marks = 20m Group A MCQ + 40m Group B 8-mark questions). Older `2021–2022` papers (`P001-2021-03`, `P002-2022-06` — 2 papers, 93 Qs) stay untouched in `_data/CST201/` and are strictly excluded from topic weighting and depth sizing.  
> **Execution order:** #5 in the recommended `15 → 13 → 16 → 14 → 12` sequence (fully independent — may execute in any order).

---

## 1. Goal & 2023–2026 Exam-Weight Baseline

Right-size and upgrade all five C unit pages (`subjects/CST201/units/unit-{1..5}.html`) so prose balance, dry-run boxes, `gcc`-verified programs, inline SVG diagrams, practice sets, curated YouTube links, lab cross-links, and PYQ `.unit-topic-link` anchors directly match **actual 2023–2026 WBSCTE exam weight**:

| Unit | Official Title (`syllabus.json`, p. 3) | Hrs | Stored PYQ Tag (Q / m) | True 2023–2026 Weight | Share | Avg / Paper | MCQ + Long | Papers | Current Words → Target | Unit Blueprint |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Unit 1** | Introduction to C | 5h | 39 Q / 76m | **86m** | **21.8%** | 21.5m | 62m + 24m | 4/4 | 5,418w → ~5,800–6,400w | [`unit-1/README.md`](unit-1/README.md) |
| **Unit 2** | Decision & Loop Control Statements | 5h | 18 Q / 94m | **95m** | **24.1%** | 23.8m | 8m + 87m | 4/4 | 5,406w → ~6,200–6,800w | [`unit-2/README.md`](unit-2/README.md) |
| **Unit 3** | Arrays & Strings | 7h | 21 Q / 103m* | **66m** | **16.7%** | 16.5m | 14m + 52m | 4/4 | 5,848w → ~5,400–6,000w | [`unit-3/README.md`](unit-3/README.md) |
| **Unit 4** | Functions in C | 7h | 22 Q / 94m* | **97m** | **24.6%** | 24.2m | 17m + 80m | 4/4 | 6,749w → ~6,500–7,200w | [`unit-4/README.md`](unit-4/README.md) |
| **Unit 5** | Pointers in C | 6h | 5 Q / 28m | **51m** | **12.9%** | 12.8m | 14m + 37m | 4/4 | 7,558w → ~5,000–5,600w | [`unit-5/README.md`](unit-5/README.md) |
| **Total** | **5 Official Units** | **30h** | **105 Q / 395m** | **395m** | **100.0%** | **98.8m** | **115m + 280m** | **4/4** | **30,979w → ~28.9–32.0kw** | **5 unit folders** |

*\*Stored Unit 3 ↔ Unit 4 swap:* `_data/CST201/` and `_quiz-data/CST201/` historically tagged Functions as `unit: 3` and Arrays/Strings/Pointers as `unit: 4`, whereas the Revised-2022 syllabus (`syllabus.json` p. 3) places **Unit 3 = Arrays & Strings** and **Unit 4 = Functions in C** (also recorded in `docs/data/validation-exceptions.json`). Across the 105 `2023–2026` C PYQs, `focusQuestionTopic()` in `assets/js/unit-discovery.js` currently achieves:
- **46 same-unit hits (`43.8%`)**
- **29 cross-unit redirects (`27.6%`)** — including wrong-unit collisions such as `P006-Q21` (`Functions / recursion` → `U1#overview-i-o-functions`), `P006-Q6` (`Functions` → `U5#overview-functions`), `P005-Q15` (`Storage classes / data types` → `U1#fundamentals`), and `P003-Q8` (`Arrays / loops` → `U2#overview-loops`)
- **30 unmatched questions (`28.6%`)** that fall back to the top of the unit with no topic highlight

### Key 2023–2026 Calibration Findings
1. **Three units carry 70.4% (`278 / 395m`) of the C exam:**
   - **Unit 4 Functions, Storage Classes & Recursion (`97m`, 24.6%)** — #1 unit overall (`80m` of Group B marks).
   - **Unit 2 Loops, Conditionals & Classic Programs (`95m`, 24.1%)** — #1 in Group B long-answer weight (`87m`), led by loops & number/series/pattern programs alone at `52m` (`13.2%`).
   - **Unit 1 Operators, Tokens & C Basics (`86m`, 21.8%)** — #1 in Group A MCQ weight (`62 / 115m = 53.9%` of all MCQs), led by operators & precedence at `43m` (`10.9%`).
2. **Storage classes appear in all `4/4` papers (`35m`, 8.9%):** `P003-Q12,Q30a`, `P004-Q1,Q8,Q17b,Q19b`, `P005-Q12,Q15,Q23`, `P006-Q14,Q19a` (in `P004` alone, storage classes appeared in two 8m questions plus two MCQs = `12m`), yet `#scope` currently holds only `562w` vs `946w` on `#recursion` (`19m`).
3. **Unit 3 (`66m`, 16.7%) splits cleanly between matrices (`30m`) and strings (`36m`):** identity matrix (`P003-Q29a`), 4×4 diagonal sum (`P005-Q19b`), matrix transpose (`P006-Q22b`), `strlen`/`strcpy`/`strcat`/`strcmp` (`23m`), and three no-library string loops — case toggle (`P003-Q31b`), reverse (`P004-Q19a`), palindrome (`P006-Q20b`). `3D` multidimensional arrays scored `0m` (**Tier S**).
4. **Unit 5 Pointers (`51m`, 12.9%) is over-expanded at `7,558w` (#1 longest C unit, #5 in marks):** `49 / 51m` (`96.1%`) come from `malloc`/`calloc`/`realloc`/`free` (`17m`), `&`/`*`/scale-factor arithmetic (`17m`), and pointers with functions & 1D arrays (`15m`). `#strings`, `#array-of-ptrs`, `#function-ptrs`, and `#ptr-to-ptr` (`1,057w` combined today) earned `0m` — condense them to tight **Tier S** blocks while preserving all `<section id>`s.
5. **Zero diagrams (`0` SVGs across all 5 units):** Add clean, token-styled accessible inline SVGs for compilation pipeline (U1), nested `if-else` flowchart (`P005-Q17a`, U2), row-major 2D array & null-terminated string (U3), recursion call stack & call-by-value vs call-by-address (U4), and stack-vs-heap DMA + pointer dereference (U5).
6. **Strict out-of-syllabus guard:** Zero `argc`/`argv` and zero `fopen`/`fclose` file I/O appeared in `2023–2026` and neither is in PDF p. 3 — do not add them. Only `#include` / unparenthesized `#define SQR(x)` scored `3m` (`P003-Q17`, `P005-Q2`) — present as an honestly badged **Tier E** callout in Unit 1.
7. **Recommended intra-phase priority order:** **Unit 4 (24.6%) → Unit 2 (24.1%) → Unit 1 (21.8%) → Unit 3 (16.7%) → Unit 5 (12.9%)**.

---

## 2. Weight-Tier System Applied Across Units 1–5

| Tier | 2023–2026 Threshold | Depth & Practice Budget | C Topic Clusters |
| :--- | :--- | :--- | :--- |
| **Tier A — Core Heavyweight** | `>= 20m` (`>= 5.0%`) or `4/4` papers w/ repeated 8m | Full intuition, diagram, `gcc`-tested programs, dry-run trace, traps callout, heavy MCQ + 8m drill | U2 Loops & number/series/pattern programs (`52m`), U1 Operators & precedence (`43m`), U4 Storage classes & scope (`35m`), U3 1D/2D arrays & matrices (`30m`), U4 Function basics/params/`return` (`29m`), U2 `if-else` & selection programs (`25m`), U3 `string.h` functions (`23m`), U1 Tokens/identifiers/keywords/types/`sizeof` (`21m`), U4 Recursion vs iteration (`19m`, `4/4`) |
| **Tier B — Regular** | `10–19m` (`2.5–4.9%`), `3–4` papers | Clear theory, comparison table, 1–3 complete programs, 2–3 MCQs + 1–2 long answers | U5 Dynamic memory (`17m`), U5 Pointer basics `&`/`*`/arithmetic (`17m`), U5 Pointers with functions & 1D arrays (`15m`), U4 Call by value vs call by address (`14m`), U1 History/compilation/headers/comments (`13m`), U3 Manual string programs (`13m`), U2 Jump statements `break`/`continue`/`goto` (`11m`) |
| **Tier C — Low-Weight** | `1–9m` (`< 2.5%`) | Concise rule box + 1 runnable example + 1–2 practice items | U2 `switch-case` (`7m`), U1 Formatted I/O, ASCII & escapes (`4m`), U1 Type conversion & casting (`2m`), U5 Pointer to struct & `union` size (`2m`) |
| **Tier S — Syllabus-Only (`0m`)** | In PDF p. 3, `0m` in `P003–P006` | Compact ~120–200w syllabus-completeness block + 1 minimal snippet | U1 Unformatted I/O (`getchar`/`putchar`/`fgets`/`puts`), U3 3D arrays, U4 Passing arrays to functions & nested calls, U5 Pointer to string, array of pointers, function pointers, pointer to pointer (`**p`), returning pointers |
| **Tier E — Exam Extension** | Tested in `P003–P006`, outside unit list | Explicitly badged *"Exam note (outside printed unit list)"* callout sized to marks | U1 Preprocessor `#` directive & unparenthesized `#define SQR(x)` macro trap (`3m`: `P003-Q17`, `P005-Q2`) |

---

## 3. Live Shipped-Asset Inventory (`CST201` + `CST211`)

| Asset | Current State on Disk | Phase 12 Action |
| :--- | :--- | :--- |
| `subjects/CST201/units/unit-{1..5}.html` | `30,979w` total (`5,418 + 5,406 + 5,848 + 6,749 + 7,558`), `161` `<pre>`, `51` `<table>`, `0` `<svg>`, `0` YouTube links, `0` code/ID leaks | Right-size to `~28.9–32.0kw`, add accessible SVGs, `16` verified plain-`<a>` YouTube links, and Mode A `<h3 id>` targets |
| `docs/suggestions/guides.json` (`CST201`) | `10` locked reading anchors (`operators`, `typecasting`, `loops`, `jump`, `2d-arrays`, `strings`, `parameters`, `recursion`, `declaration`, `dma`) | Preserve 10/10 unchanged; verify via `build_suggestions.py --check` |
| `docs/revision-sheets/CST201.json` | `10` entries covering all 5 units (`U1:3, U2:2, U3:1, U4:2, U5:2`) | Keep in sync with updated unit anchors; re-verify `revision/CST201.html` |
| `subjects/CST211/index.html` | Paired C Lab syllabus page (7 practical areas, PDF p. 14) | Cross-link from Units 1–5 `#practice` sections (never fabricate lab records) |
| `_data/CST201/*.json` & `_quiz-data/CST201/*.json` | `6` PYQ files (`198` total Qs; `105` in `P003–P006`), `5` quiz files (`211` MCQs; U3↔U4 order exception) | **Read-only in Mode A** (`check_pyq_integrity.py` = 0 drift); Mode B requires explicit owner approval |

---

## 4. Scope In, Scope Out & Reuse Scan

### In Scope (when Phase 12 executes)
- Rewriting and weight-calibrating `subjects/CST201/units/unit-{1..5}.html` per [`unit-1/README.md`](unit-1/README.md)–[`unit-5/README.md`](unit-5/README.md).
- Preserving all **10 locked `docs/suggestions/guides.json` anchors**, all **78 existing `<section id>`s** (`14+14+15+15+20`), and all **26 existing `overview-*` `<h3 id>`s** so `section-notes.js` saved notes and suggestion deep links never break.
- Adding semantic `<h3 id>` topic anchors (and skipping generic `#mcqs`/`#short-questions`/`#long-questions`/`#practice`/`#revision` in `unit-discovery.js` if not yet applied) so **105 / 105** `2023–2026` C PYQ questions resolve to exact concept headings in **Mode A** with zero `_data/` edits.
- Live-verifying **16 plain external YouTube `<a href="https://www.youtube.com/watch?v=..." target="_blank" rel="noopener noreferrer">` links** (`3+3+3+4+3`) at execution time — zero `<iframe>`, zero `i.ytimg.com`, zero runtime third-party requests.
- Cross-linking paired practical areas on `subjects/CST211/index.html` and running the complete `README.md:161–215` rebuild + verification pipeline.

### Out of Scope
- Editing `_data/CST201/*.json`, `_quiz-data/CST201/*.json`, `_data/pyq-integrity.json`, or `docs/data/validation-exceptions.json` unless the owner explicitly invokes **Mode B**.
- Adding YouTube embeds, thumbnail images, unverified URLs, third-party fonts/scripts, or out-of-syllabus `argc`/`argv` and `fopen` chapters.
- Reopening closed Phases 1–10 or deploying to production.

### Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js` — keep existing unit chrome, collapsible `.unit-section` structure, and CSS tokens verbatim (zero new CSS/JS files).
- **ADAPT:** Existing `<h3 id>` heading-match mechanism in `assets/js/unit-discovery.js` (`focusQuestionTopic()`) for Mode A topic resolution.
- **REJECT:** Embedded video players (`<iframe>`), external thumbnail CDNs (`i.ytimg.com`), or custom per-unit colour literals (`check_tokens.py --strict`).

---

## 5. Dependencies, Gates & Risks

| Area | Constraint / Gate | Mitigation |
| :--- | :--- | :--- |
| **Dependencies** | Closed Phases 0–10 + `guides.json` anchor contract (Phase 11) | Self-contained; no dependency on Phases 13–16 |
| **C standards accuracy** | WBSCTE mixes C89/16-bit (`32` keywords, `2B int`) with modern C99/64-bit (`4B int`) and has one UB MCQ (`P005-Q4`) | Compile all authored programs with `gcc -std=c99 -Wall -Wextra -Werror`; state both 16-bit and 32/64-bit sizes and flag UB explicitly |
| **Student-copy hygiene** | Zero raw `CST201`, `CST211`, or `P00X-QY` strings in rendered HTML | Grep check in Part 12.6 before rebuild |
| **Accessibility & budget** | Strict `h1 → h2 → h3`, contrast AA, CSS ≤ 300 KB, JS ≤ 350 KB | Use only `variables.css` tokens; keep inline `<style>` ≤ baseline; run `audit_accessibility.py --fail` & `audit_page_weight.py --budget` |
| **Discovery test ratchet** | Adding `<h3 id>` changes `unitAnchored` in `tests/test_discovery.py:111` | Update exact count after `build_search_index.py` and run `unittest` + `node tests/discovery-dom.cjs` |
| **Owner gates** | Mode B PYQ/quiz U3↔U4 retagging & deployment | Both remain strictly off until explicit owner instruction |

---

## 6. Done Means

- [ ] All 6 parts in [`tasks.md`](tasks.md) completed with evidence recorded in [`record.md`](record.md).
- [ ] `subjects/CST201/units/unit-{1..5}.html` match their 2023–2026 word budgets, Tier A/B/C/S/E proportions, and `gcc -std=c99 -Wall -Wextra` compile check.
- [ ] All 10 `guides.json` anchors and all 78 existing `<section id>`s preserved (`build_suggestions.py --check` green).
- [ ] All 16 YouTube links verified live during execution, rendered as plain external `<a>` tags, and logged in `record.md`.
- [ ] `105 / 105` `2023–2026` C PYQ questions resolve to accurate syllabus concept headings via `focusQuestionTopic()` with `check_pyq_integrity.py` = `0` drift.
- [ ] Full `README.md:161–215` rebuild and verification suite passes, owner "What to test on the website" steps and `rule.md` §7 Termux preview command are printed, and execution pauses at the owner gate (`mark as pass` / `add for later`).
