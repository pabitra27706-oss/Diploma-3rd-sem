# Phase 18 — PYQ Answer Expansion & Rich Structured Model Answers

- **Status:** 🚧 In Progress (`2026-11-26`: Mode B owner-approved; **Part `18.1` Rich Renderer/Linter ✅**, **Part `18.5` CSO `195/195` Q ✅** owner-passed on Termux, and **Part `18.6` Algorithms `167/167` Q ✅** complete & gate-verified; Parts `18.2` C, `18.3` Python, `18.4` DS remaining)
- **Scope:** All **28 archived WBSCTE PYQ papers / 924 questions** (`_data/CST{201,203,205,207,209}/*.json`) plus all **5 runtime answer consumers** (`pyq/answers.html` screen + print, `practice/session.html`, `quiz/review.html` + `quiz/result.html`, and `cards.html`)
- **Companion Spec:** [`authoring-standard.md`](authoring-standard.md) — mandatory mark-proportional depth rubric, structured bulleting rules, `[!COMPARE]` comparison-box & callout-box syntax, and before/after exemplars

---

## 1. Goal

Replace terse, telegraph-style, and script-stubbed PYQ model answers across all five 3rd-semester Computer Science & Technology theory subjects (**C**, **Python**, **DS**, **CSO**, **Algorithms** — 28 papers, 924 questions) with **exam-complete, mark-proportional, directly hand-authored model answers** featuring:

1. **Structured problem bulleting** (`- **Lead-in Concept:** ...` for unordered points; `1.` for sequential steps/derivations — never walls of prose and never one-line fragments),
2. **First-class Comparison Boxes** (`> [!COMPARE] Title` + parameter-anchored Markdown comparison tables rendered inside a styled `.comparison-box` panel) on every comparison / differentiation prompt,
3. **Structured Exam Callout Boxes** (`> [!KEY]`, `> [!FORMULA]`, `> [!TRAP]`, `> [!MARKS]`) for formulas with symbol legends, complexity summaries, mark-split headers, and WBSCTE exam pitfalls,
4. **Complete, compiler/interpreter-verified programs + dry-run traces** on programming prompts and step-by-step register/stack/matrix/graph trace tables + ASCII diagrams on numerical and architecture prompts, and
5. **Cross-surface rich-content rendering** across PYQ Answers (screen + print/PDF), Practice Session, Quiz Review/Result, and Spaced-Repetition Flashcards (`cards.html`).

---

## 2. Non-Negotiable Authoring Law — Zero Sloppy Python Script Generation

> **HARD PROHIBITION (Owner Directive, 2026-11-26):**
> Agents executing Phase 18 are **strictly forbidden** from writing, running, or committing Python scripts (or Node/shell/jq/regex scripts, template expanders, bulk JSON mutators, or automated batch text generators) to author, expand, paraphrase, or rewrite `answer` fields in `_data/**/*.json`.

### Why scripted answer generation is banned (measured repository damage)

Earlier bulk/scripted passes produced concrete, measurable defects across `_data/`:

- **207 questions** in June 2022 papers still begin with the robotic stub `**Model answer:** ...` averaging **10.2 words** (e.g., `CST201-P002-Q52`: `"**Model answer:** \`10100111₂\`."` — 3 words for a 2-mark binary conversion with zero division steps).
- **26 unclosed Markdown code fences (` ``` `)** across `CST201-P006` (7), `CST203-P003` (6), `CST203-P004` (3), `CST203-P005` (3), `CST203-P006` (6), and `CST209-P006` (1) where scripted string assembly dropped closing fences.
- **2 broken Markdown pipe-table rows** (`CST203-P003-Q31` and `CST203-P006-Q20`) where literal bitwise OR `|` inside a cell splits a 3-column row into 4 cells and **drops the final column (`Operate on bits` / output `7`)** in the browser.
- **13 mark-distribution header mismatches** (including 8 flat contradictions where the answer header claims `a) 4 marks + b) 4 marks` or `a) 2 marks + b) 6 marks` while `q.subparts` / `q.markSplit` is `3+5`, `5+3`, or `6+2`: `CST201-P003-Q32`, `CST201-P003-Q33`, `CST201-P005-Q17`, `CST201-P005-Q22`, `CST205-P003-Q31`, `CST205-P005-Q18`, `CST205-P005-Q21`, `CST207-P003-Q28`).
- **8 "Write a C program" long questions without `#include` or `main()`** (`CST201-P001-Q20, Q22, Q25`, `CST201-P003-Q31`, `CST201-P004-Q19, Q20`, `CST201-P005-Q18, Q19`) — plus 10-mark `CST201-P001-Q24, Q26, Q28` that contain **zero C code at all** despite asking for complete C programs.

### Mandatory direct-authoring workflow vs permitted verification tools

| Activity | Allowed? | Rule |
| :--- | :---: | :--- |
| Writing or mutating `_data/CST*/*.json` `answer` fields | **ONLY `edit_file` by the agent, question-by-question** | Read the paper JSON via `read_file`, inspect `question`, `subparts`, `marks`, `markSplit`, `options`, `correct`, `sourceNote`, `syllabusNote`, and the matching unit page (`subjects/CST20x/units/unit-*.html`), then craft each answer directly via `edit_file` in small paper-sized batches. |
| Python / shell / Node scripts that generate, template, or rewrite `answer` strings | **STRICTLY FORBIDDEN** | Zero `.py` / `-c` / heredoc / regex scripts may write to `_data/CST*/*.json`. Any commit or diff produced by bulk text-generation scripts fails Phase 18 review immediately. |
| Compiling C code (`gcc -std=c99 -Wall -Wextra`) or running Python snippets (`python3`) on scratch files outside `_data/` to verify outputs & traces | **REQUIRED** | Every embedded C/Python program and numerical trace must be executed to verify real stdout before hand-authoring into `_data/` (delete scratch files immediately). |
| Read-only audit/validation scripts (`validate_pyq.py`, `audit_pyq_answers.py`, `check_site.py`, `unittest`) & the 14-step canonical derived-data rebuild (`build_*.py`) | **REQUIRED** | Existing deterministic pipeline builders transform `_data/` into `assets/` sidecars without inventing prose; read-only gates verify structural & schema compliance. |

---

## 3. Why This Phase Matters Now — Senior-Researcher Empirical Audit (`06656a9`)

A full read-only audit of all **28 PYQ JSON files (924 questions)** on `main` (`06656a9`) establishes that answer brevity is systemic across every subject, mark tier, and question type:

### 3.1 Word-count & structure distribution by mark value (`924` questions)

| Marks | Count | Min Words | p25 | Median Words | Mean Words | p75 | Max Words | `< 60w` | `< 100w` | Has Table | Has Bullets/List | Has Code Fence |
| :---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **1m** | `378` | `3` | `10` | **`31`** | `24.9` | `36` | `55` | `378 (100%)` | `378 (100%)` | `0 (0%)` | `0 (0%)` | `0 (0%)` |
| **2m** | `303` | `3` | `15` | **`19`** | `21.1` | `26` | `55` | `303 (100%)` | `303 (100%)` | `0 (0%)` | `0 (0%)` | `0 (0%)` |
| **6m** | `45` | `39` | `181` | **`209`** | `205.8` | `265` | `316` | `3 (6.7%)` | `8 (17.8%)` | `9 (20.0%)` | `31 (68.9%)` | `37 (82.2%)` |
| **8m** | `174` | `27` | `48` | **`63`** | `104.4` | `141` | `629` | **`74 (42.5%)`** | **`119 (68.4%)`** | `24 (13.8%)` | `33 (19.0%)` | `87 (50.0%)` |
| **10m** | `24` | `34` | `52` | **`64`** | `64.8` | `78` | `102` | **`11 (45.8%)`** | **`23 (95.8%)`** | **`0 (0%)`** | **`0 (0%)`** | **`0 (0%)`** |

### 3.2 Word-count & structure distribution by subject (`924` questions)

| Subject | Papers / Qs | All-Q Median | `>= 5m` Long Qs | `>= 5m` `< 120w` | Tables | Bullets | Code Fences | Headline Deficit |
| :--- | :---: | :---: | :---: | :---: | ---: | ---: | ---: | :--- |
| **C (`CST201`)** | `6 / 198` | `30w` | `53` | `40 / 53 (75.5%)` | `2` | `7` | `40` | `P001` 10m med `70w` (0 code fences!); `P003` 8m med `43w`; `P004` `64w`; `P005` `63w`; `P006` `76w` (7 unclosed fences). |
| **Python (`CST203`)** | `5 / 170` | `32w` | `43` | `14 / 43 (32.6%)` | `19` | `23` | `43` | **18 unclosed code fences** in `P003–P006`; **2 broken pipe tables**; `P001` 6m med `83w` + 42 short stubs; terse `1+1` MCQs. |
| **DS (`CST205`)** | `6 / 194` | `32w` | `52` | `33 / 52 (63.5%)` | `5` | `12` | `20` | `P001` 10m med `59w`; `P003–P006` 8m med `61–74w` (`30/36` `< 80w` — missing trace tables, diagrams, comparisons). |
| **CSO (`CST207`)** | `6 / 195` | `33w` | `51` | `35 / 51 (68.6%)` | `6` | `11` | `5` | `P003` 8m med `42w`; `P005` 8m med `46w` (Booth `-9 × -13` has zero cycle table!); `P004/P006` med `61–64w`. |
| **Algorithms (`CST209`)** | `5 / 167` | `30w` | `44` | `34 / 44 (77.3%)` | `1` | `11` | `16` | **Only 1 table in the entire subject!** `P003–P006` 8m med `42–63w` (`32/35` `< 80w`). |

### 3.3 Concrete examples of under-written answers (with exact IDs)

- **`CST209-P005-Q16` (`_data/CST209/CST209-P005-2024-12.json:820`, 8 marks, split `3+5`):** Asks for key algorithm characteristics (3m) + asymptotic notation and its types (5m). Entire answer is **30 words** (two bare lists of nouns, zero mathematical definitions `f(n) <= c·g(n)`, zero bullet explanations, zero comparison table).
- **`CST201-P005-Q20` (`_data/CST201/CST201-P005-2024-12.json:966`, 8 marks, split `3+2+3`):** Advantages of user-defined functions + declaration vs definition + actual vs formal parameters with example. Entire answer is **38 words** — zero bullets, zero comparison box, zero complete C example.
- **`CST207-P005-Q16` (`_data/CST207/CST207-P005-2024-12.json:815`, 8 marks, split `4+4`):** Restoring Division Algorithm for unsigned integers + Multiply `(-9) × (-13)` using Booth's algorithm. Entire answer is **50 words** — zero Booth register-trace table (`A`, `Q`, `Q_-1`, `M`, arithmetic right shift), zero restoring-division flowchart/steps.
- **`CST207-P005-Q19` (`_data/CST207/CST207-P005-2024-12.json:941`, 8 marks, split `5+3`):** Compare direct-mapped, set-associative, and associative cache (5m) + differentiate write-through and write-back cache (3m). Entire answer is **47 words** — two explicit comparison subparts with **zero comparison tables/boxes**.
- **`CST205-P005-Q22` (`_data/CST205/CST205-P005-2024-12.json:1126`, 8 marks, split `2+6`):** Draw a diagram of a circular linked list and explain it + write and explain the algorithm to insert at the end of a singly linked list. Entire answer is **46 words** — no diagram drawn and zero explanation written.
- **`CST201-P001-Q28` (`_data/CST201/CST201-P001-2021-03.json`, 10 marks):** Write C programs to implement `strcpy()` and `strlen()` yourself + role of `\0`. Entire answer is **73 words of prose with zero C code**.
- **54 non-MCQ comparison/differentiation questions** across the corpus currently contain **zero Markdown tables**, and **140 of 224 (62.5%)** `2024–2026` 2-mark MCQs (`1m option + 1m written explanation`) are under **25 words**.

### 3.4 Seven cross-surface renderer & consumer defects discovered during audit

Expanding `q.answer` without upgrading its five runtime consumers would break printouts, quiz review, and flashcards:

1. **`isCodeLine()` `* ` bullet collision (`pyq/js/answers.js:368`, `practice/js/session.js:491`):** `isCodeLine()` matches `/^\s*\*\s+/` (intended for C block comments) *before* unordered bullet detection (`/^[\-\*\•]\s/`). Any 2+ consecutive `* ` bullets render as a `<pre><code>` dark code block.
2. **Naive `splitTableRow()` pipe splitting (`pyq/js/answers.js:394`, `practice/js/session.js:451`):** `trimmed.split('|')` ignores escaped `\|` and inline code `` `a | b` ``, corrupting cells containing bitwise/logical OR (`CST203-P003-Q31`, `CST203-P006-Q20`).
3. **No `.comparison-box` or structured callout blocks in PYQ / Practice / Quiz CSS & JS:** `pyq/js/answers.js` only renders generic `<blockquote>`, while `practice/js/session.js` lacks even `<blockquote>` and `<hr>` (rendering `> ...` as literal `&gt;`).
4. **Raw Markdown leak in Print / Save-as-PDF (`pyq/js/answers.js:1599–1655`, `printAnswerBody()`):** `printAnswerBody(q)` uses `escapeHtml()` inside `<div class="print-answer-text">` (`white-space: pre-wrap`) instead of rich HTML, printing literal `**bold**`, `|---|---|`, and `> [!COMPARE]` markers onto exported PDFs.
5. **Raw Markdown leak in Quiz Review (`quiz/js/review.js:465, 623` via `quiz/js/paper-attempt.js:154–155`):** Full-paper mock attempts copy `q.answer` into `q.explanation` and `q.modelAnswer`, which `buildModelAnswerBox()` injects via `textContent` (unparsed Markdown).
6. **Raw Markdown dump & payload bloat on Flashcards (`scripts/build_cards.py:88` + `assets/js/study-ui.js:171`):** `build_cards.py` copies `question['answer']` verbatim into `card.back`, and `cards.html` assigns `$('#card-back').textContent = card.back`. Multi-hundred-word Markdown answers with tables and C programs will render raw pipe/fence walls on flashcards unless `cards.html` renders safe rich DOM + concise recall summary / collapsible full answer.
7. **Runtime pool & integrity baseline coupling (`scripts/build_runtime_data.py`, `scripts/data_pipeline.py:55`, `tests/test_data_pipeline.py:61`):** `assets/data/practice-pool.json` is currently `979,550 bytes` (`check_site.py` checks `_data` / `_quiz-data` against `1 MB` per file; `sw.js` caches runtime pools/cards under `dataVersion`), `data_pipeline.fingerprint()` hashes `answer` (affecting `docs/data/validation-exceptions.json` `contentHash` on 6 out-of-syllabus PYQs and exact-alias detection on `CST203-P001-Q43/Q44`), and `test_no_semantic_or_answer_changes` locks `answer` against `sourceCommit` `664674b`.

---

## 4. Scope

### In scope

1. **Shared Rich-Answer Renderer & CSS (`Part 18.1`):** One XSS-safe rich-content module supporting `- ` problem bullets, numbered steps, `[!COMPARE]` **Comparison Boxes**, `[!KEY]` / `[!FORMULA]` / `[!TRAP]` / `[!MARKS]` **Callout Boxes**, pipe-safe Markdown tables (`\|` and inline `` `|` ``), fenced code blocks, and ASCII diagrams across **all 5 consumers**: `pyq/answers.html` (screen + print/PDF), `practice/session.html`, `quiz/review.html` (+ `quiz/result.html` explanation view), and `cards.html`.
2. **Read-Only Structural Answer Validator (`scripts/audit_pyq_answers.py` in `Part 18.1`):** Automated read-only gate enforcing fence parity, table-column parity, `subparts`/`markSplit` parity, zero `**Model answer:**` stubs, zero raw `CST20x` codes in prose, comparison-box presence on comparison prompts, compilable `#include` C programs, and mark-proportional word/bullet floors.
3. **Direct Hand-Authored Expansion of All 924 PYQ Answers (`Parts 18.2–18.6`):**
   - **Priority Tier 1 (Calibrated `2023–2026` Window — `P003–P006`, 20 papers, 523 questions):** Full gold-standard expansion aligned 1-to-1 with Phases 12–16 unit notes.
   - **Priority Tier 2 (Archived `2021–2022` Papers — `P001–P002`, 8 papers, 401 questions):** Elimination of all 207 `**Model answer:**` stubs, full expansion of all 24 ten-mark `2021` answers and 45 six-mark `2022` answers, and complete 1m/2m explanations.
4. **Mode B Pipeline & Integrity Reconciliation (`Part 18.1` + `18.6`):** Field-level immutability test proving **only `answer`** changed against `664674b` (+ existing `unitMoves`), refreshed `_data/pyq-integrity.json` and `docs/data/validation-exceptions.json` `contentHash` entries (with owner Mode B sign-off), and idempotent 14-step canonical rebuild.

### Out of scope

- Altering any question stem (`question`), `options`, `correct` key, `marks`, `markSplit`, `subparts`, `unit`, `topic`, `group`, `sourceNumber`, `sourcePage`, `sourceStatus`, `sourceNote`, or `syllabusNote`.
- Promoting `answerStatus` from `"model-answer"` to `"verified"` / certified (`0/924` answers remain uncertified model answers per the `2026-11-18` owner closure decision in `docs/DECISIONS.md:591`).
- Rewriting `_quiz-data/` standalone quiz banks (covered separately if requested later) or editing unit HTML prose (`subjects/CST20x/units/unit-*.html`, completed in Phases 12–16).
- Any PR, merge, `main` push, or deployment without explicit owner command.

---

## 5. Dependencies & Owner Gates

- **Depends on:** Phases 12–16 unit content (✅ complete) and Phase 17 topic-map cross-check (✅* owner-passed), so expanded PYQ answers use the exact same terminology, conventions, and complexity tables as the unit notes they link to.
- **⛔ Owner Gate — Mode B Data Authorization (Required before editing `_data/`):** Per `rule.md`, `prompt.md` §2, and `docs/phases/README.md` Shared Rule 3, `_data/CST*/*.json` and `_data/pyq-integrity.json` are byte-frozen in Mode A. Executing Parts `18.2`–`18.6` requires explicit owner Mode B approval to update `answer` fields in `_data/CST*/*.json`, re-pin `_data/pyq-integrity.json`, and refresh `contentHash` on the 6 fingerprinted out-of-syllabus PYQ exceptions in `docs/data/validation-exceptions.json` while enforcing strict test-locked immutability on every non-`answer` field.

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| Temptation to use Python scripts or templates across 924 questions | Produces repetitive filler, unclosed fences, wrong mark splits, or unverified code | Hard prohibition in §2; paper-by-paper `edit_file` checkpoints; `audit_pyq_answers.py` structural checks; manual `gcc` / `python3` verification of every program. |
| Single `_data/*.json` paper exceeding `check_site.py` `DATA_BUDGET_SINGLE` (`1,024 KB`) | `check_site.py` warning | Even a 5× answer expansion keeps the largest paper (`CST201-P002`, currently `79 KB`) around `~220–280 KB` — well under `1,024 KB`. Verified after every subject part. |
| `assets/data/practice-pool.json` & `assets/cards/*.json` growth on low-end phones | Slower initial Practice / Cards fetch over mobile data | Keep prose crisp and high-signal (structured bullets + compact tables, zero fluff); in `build_cards.py` / `cards.html`, store/render a concise recall digest on first flip with full rich answer on demand if shard size exceeds budget; keep all CSS within the `300 KB` per-page ceiling (`audit_page_weight.py --budget`). |
| Exact-duplicate alias drift (`CST203-P001-Q43` & `Q44`) | Changes `uniqueCount` (`923`) if their `answer` strings diverge | `data_pipeline.fingerprint()` includes `answer`; author identical canonical answers for exact-duplicate stems so `924 raw / 923 unique / 1 alias` stays invariant. |
| Palette / token violations in new `.comparison-box` & `.answer-callout` CSS | Fails `check_tokens.py --strict` or dark/high-contrast WCAG 2.2 AA contrast | Author styles exclusively with existing `assets/css/variables.css` semantic tokens (`var(--bg-*)`, `var(--c-*)`), zero hex literals, and verify light, dark, and `[data-contrast="high"]` + `@media print`. |

---

## 7. Done Means

1. **Zero scripted prose:** All 924 PYQ `answer` entries across all 28 papers were authored directly via `edit_file` following [`authoring-standard.md`](authoring-standard.md), with every C program compiled under `gcc -std=c99 -Wall -Wextra` and every Python snippet executed under `python3`.
2. **Structural & pedagogical completeness (`audit_pyq_answers.py --strict` = `0` errors, `0` warnings):**
   - `0` unclosed code fences (down from `26`), `0` broken pipe-table rows (down from `2`), `0` mark-split header mismatches (down from `13`), `0` `**Model answer:**` stub prefixes (down from `207`), `0` raw `CST20x` / `P00y-Qz` leaks in prose.
   - `100%` of comparison/differentiation questions include a `[!COMPARE]` Comparison Box with a parameter column; `100%` of `>= 4m` C/Python program questions include complete runnable code + sample output/dry-run trace; `100%` of multi-part `>= 5m` questions carry exact subpart mark headers and structured `- **Concept:**` bulleting.
3. **Cross-surface rich rendering verified:** `pyq/answers.html` (Practice, Review, and Print/Save-as-PDF), `practice/session.html`, `quiz/review.html` (+ `result.html`), and `cards.html` all render Comparison Boxes, Callout Boxes, pipe-escaped tables, bullet lists, and code blocks cleanly without raw Markdown leaks or XSS vectors (`innerHTML` escaped before inline formatting, DOM tests in Node).
4. **Field-level immutability proven:** Automated test proves against `664674b` (+ recorded `unitMoves`) that **only `answer`** changed across all 28 `_data/CST*/*.json` files (`0` changes to stems, options, keys, marks, units, or `answerStatus: "model-answer"`).
5. **All repository gates green:** Full 14-step canonical rebuild is byte-identical on a second pass; `validate_pyq.py`, `audit_pyq_answers.py --strict`, `check_pyq_integrity.py`, `validate_data.py --check-baseline`, `check_site.py --strict --quiet`, `check_tokens.py --strict`, `audit_accessibility.py --fail`, `audit_page_weight.py --budget`, `build_data_version.py --check`, `check_readme_paths.py`, Python `unittest`, and all deterministic Node `.cjs` suites pass (`0` errors).
6. **Phase record & Termux preview delivered:** `record.md` documents before/after word, table, bullet, and code counts per paper plus every verified program/trace; chat reply ends with the copyable Termux command block (`rule.md` §7); no PR, merge, or deploy without explicit owner instruction.
