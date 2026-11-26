# Phase 18 Tasks — PYQ Answer Expansion & Rich Structured Model Answers

> **Standing Authoring Law Across All Six Parts (`18.1`–`18.6`):**
> **Zero Python/Node/shell answer-generation scripts.** Every edit to `_data/CST*/*.json` in Parts `18.2`–`18.6` must be authored directly by the agent using `read_file` + `edit_file`, question-by-question, following [`authoring-standard.md`](authoring-standard.md) (mark-proportional depth, `- **Lead-in:**` problem bulleting, `[!COMPARE]` comparison boxes with parameter columns, `[!KEY]`/`[!FORMULA]`/`[!TRAP]`/`[!MARKS]` callouts, `gcc`/`python3`-verified programs, and step-by-step traces).

---

## Part 18.1 — Cross-Surface Rich-Answer Renderer, Comparison/Callout Boxes, Flashcard/Print/Quiz Parity & Read-Only Answer Linter

### Why first
Expanding 924 PYQ answers before fixing their five runtime consumers would leak raw `|---|---|`, `> [!COMPARE]`, and `**bold**` syntax onto `pyq/answers.html` Print/PDF (`pyq/js/answers.js:1599–1655`), `practice/session.html` (`practice/js/session.js:281–437`), `quiz/review.html` (`quiz/js/review.js:623`), and `cards.html` (`assets/js/study-ui.js:171`), and leave `isCodeLine()` (`pyq/js/answers.js:368`) and `splitTableRow()` (`pyq/js/answers.js:394`) corrupting lists and bitwise-OR table cells.

### Steps
1. **Unify & upgrade rich-answer rendering (`assets/js/rich-content.js` or synced module across consumers):**
   - Fix bullet-vs-code precedence in `pyq/js/answers.js:294, 368` and `practice/js/session.js:358, 491`: parse unordered list markers (`/^[\-\*\•]\s+/`) **before** `isCodeLine()` so `* ` or `- ` bullets never trigger `<pre><code>`.
   - Fix `splitTableRow()` (`pyq/js/answers.js:394`, `practice/js/session.js:451`) to split on unescaped `|` outside inline backticks `` `...` `` and unescape `\|` → `|` inside cell content.
   - Add first-class **Comparison Box** (`> [!COMPARE] Title` + inner Markdown pipe table → `<div class="comparison-box"><div class="comparison-box-header">…</div><div class="table-wrapper"><table>…</table></div></div>`) and **Exam Callout Box** (`> [!MARKS]`, `> [!KEY]`, `> [!FORMULA]`, `> [!TRAP]` → `<aside class="answer-callout answer-callout--<kind>">…</aside>`) support, with XSS-safe HTML escaping of all raw text before inline formatting.
2. **Upgrade all 5 runtime surfaces & print stylesheet:**
   - `pyq/js/answers.js` + `pyq/css/answers.css`: style `.comparison-box` and `.answer-callout` in light, dark, `[data-contrast="high"]`, and `@media print` using **only** `assets/css/variables.css` tokens (`0` raw hex literals); upgrade `printAnswerBody(q)` (`pyq/js/answers.js:1599–1655`) to emit clean print-styled rich HTML (`table`, `ul`/`ol`, `.comparison-box`, `.answer-callout`, `.print-code-block`) instead of `escapeHtml()` raw Markdown.
   - `practice/js/session.js` + `practice/css/session.css`: bring `practice/session.html` to 100% parity (`blockquote`, `hr`, `.comparison-box`, `.answer-callout`, pipe-safe tables).
   - `quiz/js/review.js` (`buildModelAnswerBox`, lines `465, 610–640`) & `quiz/js/result.js`: render PYQ `modelAnswer` and `explanation` via the XSS-safe rich-content renderer instead of raw `textContent`, while keeping `quiz/js/export.js` MD/TXT/JSON export clean.
   - `scripts/build_cards.py` (`line 88`) + `assets/js/study-ui.js` (`line 171`): render `#card-back` via safe structured DOM (so bullets, inline code, comparison tables, and formulas display cleanly instead of raw Markdown), and emit a concise first-flip recall summary + expandable full model answer on long (`>= 5m`) PYQ cards so `cards.html` stays fast on phones and `assets/cards/*.json` stays compact.
3. **Create read-only structural validator `scripts/audit_pyq_answers.py`:**
   - Read-only checker (zero file writes) supporting `--subject CST20x` and `--strict`:
     - Even count of ` ``` ` fences per question (`0` unclosed fences).
     - Matching column count across header, separator, and every data row in every Markdown table (`0` broken pipe rows).
     - Exact match between any `[!MARKS]` / `Mark distribution` header numbers and `q.subparts[].marks` / `q.marks`.
     - Zero `**Model answer:**` stub prefixes; zero `* ` unordered bullet lines; zero raw `CST20[13579]` or `CST20x-P00y-Qz` strings in `answer`.
     - Comparison-prompt check (`differentiate|difference|compare|distinguish|versus|\bvs\b` on non-MCQ → requires `[!COMPARE]` + Markdown table with `>= 3` columns).
     - C-program check (`write a (?:c )?program` in `CST201` with `marks >= 4` → requires `#include` and `main(`).
     - Mark-tier word & bullet floors from [`authoring-standard.md`](authoring-standard.md) §2.
4. **Lock field-level immutability in `tests/test_data_pipeline.py`:**
   - Extend `test_no_semantic_or_answer_changes` (`tests/test_data_pipeline.py:61`) for Phase 18 Mode B so every non-`answer` key (`id`, `question`, `options`, `correct`, `marks`, `markSplit`, `subparts`, `unit`, `group`, `type`, `sourceNumber`, `sourcePage`, `sourceStatus`, `sourceNote`, `syllabusNote`, and `answerStatus == "model-answer"`) is still asserted byte-identical to `sourceCommit` `664674b` (+ existing `unitMoves`), while changed `answer` entries are audited against `audit_pyq_answers.py`.

### Acceptance criteria & evidence to quote
- Node DOM tests (`tests/rich-answer-dom.cjs` or extended `tests/discovery-dom.cjs` + `tests/study-dom.cjs`) verify: XSS payloads escaped (`<img onerror=...>` → inert text), `* ` and `- ` bullets render `<ul><li>`, `` `a | b` `` and `\|` keep exact table column counts, `[!COMPARE]` renders `.comparison-box`, `printAnswerBody()` emits `<table>` / `<ul>` with zero raw `|---|---|`, `quiz/review.html` and `cards.html` render formatted DOM.
- `check_tokens.py --strict` = `0` findings; `audit_page_weight.py --budget` = all pages `< 300 KB` CSS / `< 350 KB` JS.

---

## Part 18.2 — Computer Programming in C (`CST201`) Direct Hand-Authored Answer Expansion (`6` papers · `198` questions)

### Baseline defects to resolve (measured on `06656a9`)
- **198 questions** across `P001` (`28`), `P002` (`65`), `P003` (`34`), `P004` (`23`), `P005` (`24`), `P006` (`24`); overall median `30w`; `40 / 53` (`75.5%`) of `>= 5m` long questions `< 120w`; only `2` tables and `7` bulleted answers in the entire subject.
- **7 unclosed code fences** in `CST201-P006-2026-01.json` (`Q17, Q18, Q20, Q21, Q22, Q23, Q24`).
- **4 mark-split header contradictions** (`CST201-P003-Q32` `[5,3]` vs `[4,4]`, `CST201-P003-Q33` `[3,5]` vs `[4,4]`, `CST201-P005-Q17` `[3,5]` vs `[4,4]`, `CST201-P005-Q22` `[3,5]` vs `[4,4]`).
- **8 "Write a C program" answers missing `#include` / `main()`** (`P001-Q20, Q22, Q25`, `P003-Q31`, `P004-Q19, Q20`, `P005-Q18, Q19`) plus `P001-Q23, Q24, Q26, Q28` (10-mark C program prompts with **zero C code**).
- **7 `type: "program"` output-trace questions** in `P001-Q1..Q7` (`11–30w`, `0` code/trace blocks) and **41 `**Model answer:**` stubs** in `P002`.

### Steps (paper-by-paper direct `edit_file` — zero scripts)
1. Author **2023–2026 calibrated window first** (`P006` → `P005` → `P004` → `P003`: `105` questions), cross-checking every definition, operator-precedence rule, pointer scale-factor note, storage-class table, and function/file idiom against `subjects/CST201/units/unit-1..5.html`.
2. Author **2021–2022 archived papers** (`P002` `65` Qs → `P001` `28` Qs, including all nine 10-mark `P001-Q20..Q28` programs/comparisons and all seven `P001-Q1..Q7` step-by-step macro/pointer/storage-class output traces).
3. Compile **every** standalone C program with `gcc -std=c99 -Wall -Wextra` on a temporary scratch file outside `_data/`, record real sample input/output + dry-run trace table, and remove the scratch file.
4. Run `python3 scripts/validate_pyq.py` and `python3 scripts/audit_pyq_answers.py --subject CST201 --strict` after each paper.

### Acceptance criteria & evidence to quote
- `audit_pyq_answers.py --subject CST201 --strict` = `0` errors (`0` unclosed fences, `0` mark-split mismatches, `0` fragment-only programs, `0` `**Model answer:**` stubs, `100%` comparison prompts in `[!COMPARE]` boxes).
- Before/after word, table, bullet, and `gcc`-compiled program counts per `CST201` paper (`P001`–`P006`) recorded in `record.md`.

---

## Part 18.3 — Scripting Languages — Python (`CST203`) Direct Hand-Authored Answer Expansion (`5` papers · `170` questions)

### Baseline defects to resolve (measured on `06656a9`)
- **170 questions** across `P001` (`66`), `P003` (`34`), `P004` (`23`), `P005` (`23`), `P006` (`24`).
- **18 unclosed code fences** (`P003-Q26, Q27, Q29, Q30, Q32, Q33`; `P004-Q17, Q19, Q22`; `P005-Q20, Q22, Q23`; `P006-Q16, Q18, Q19, Q21, Q22, Q24`).
- **2 broken pipe-table rows** dropping output columns (`CST203-P003-Q31` bitwise row; `CST203-P006-Q20` `print(a | b)` row).
- **42 `**Model answer:**` short stubs** + under-written 6-mark Group C answers (`median = 83w`, `4` questions `< 80w`) in `CST203-P001-2022-06.json`.
- Exact-alias pair **`CST203-P001-Q43` and `CST203-P001-Q44`** must receive **byte-identical** expanded answers so `924 raw / 923 unique / 1 alias` remains invariant.

### Steps (paper-by-paper direct `edit_file` — zero scripts)
1. Author **2023–2026 calibrated window first** (`P006` → `P005` → `P004` → `P003`: `104` questions): close all 18 unclosed fences, upgrade parameter-less 2-column tables into 3-column `[!COMPARE]` Comparison Boxes (List vs Tuple vs Dict, Indexing vs Slicing, `break` vs `continue` vs `pass`, Module vs Package, Built-in vs UDF, `match()` vs `search()` vs `findall()`, MVC vs Django MVT, Shallow vs Deep Copy, `*args` vs `**kwargs`), escape all bitwise `\|` cells, and expand all 2-mark `1+1` MCQs with loose-script-ready explanations.
2. Author **`CST203-P001-2022-06.json`** (`66` questions): replace all 42 `**Model answer:**` stubs, expand all nine 6-mark Group C answers to full structured depth, and keep `Q43 == Q44` byte-identical.
3. Execute every Python snippet under `python3` to verify exact output, mutability/id semantics, and exception names.
4. Run `validate_pyq.py` and `audit_pyq_answers.py --subject CST203 --strict`.

### Acceptance criteria & evidence to quote
- `audit_pyq_answers.py --subject CST203 --strict` = `0` errors (`0` unclosed fences, `0` broken pipe rows, `0` stubs).
- `CST203-P001-Q43` and `CST203-P001-Q44` verified byte-identical in `answer`; before/after metrics per paper recorded in `record.md`.

---

## Part 18.4 — Data Structures (`CST205`) Direct Hand-Authored Answer Expansion (`6` papers · `194` questions)

### Baseline defects to resolve (measured on `06656a9`)
- **194 questions** across `P001` (`25`), `P002` (`63`), `P003` (`34`), `P004` (`23`), `P005` (`25`), `P006` (`24`); `33 / 52` (`63.5%`) of `>= 5m` long answers `< 120w`; **30 of 36** `2023–2026` 8-mark answers `< 80w` (`P003` med `74w`, `P004` `61w`, `P005` `69w`, `P006` `64w`); only `5` tables across all 194 questions.
- **3 mark-split header contradictions** (`CST205-P003-Q31`, `CST205-P005-Q18`, `CST205-P005-Q21`) + `CST205-P004-Q22` `3+1+1+1+1+1` subpart header normalization.
- Missing step-by-step stack/queue/infix-to-postfix/postfix-evaluation tables, missing AVL LL/RR/LR/RL rotation diagrams, missing binary-tree reconstruction splits + ASCII trees (`CST205-P005-Q23`), missing circular/doubly linked list ASCII pointer diagrams (`CST205-P005-Q22`), and 42 `**Model answer:**` stubs in `P002`.

### Steps (paper-by-paper direct `edit_file` — zero scripts)
1. Author **2023–2026 calibrated window first** (`P006` → `P005` → `P004` → `P003`: `106` questions), aligned with `subjects/CST205/units/unit-1..4.html` conventions (explicitly stating both 0-based and 1-based formulas where a scan leaves array indexing unspecified, e.g. `P005-Q12, Q16`).
2. Author **2021–2022 archived papers** (`P002` `63` Qs → `P001` `25` Qs, including all seven 10-mark `P001` questions and the 4 fingerprinted out-of-syllabus `P001` Unit-5 items `Q3, Q21, Q22, Q25` without touching their `unit` or stems).
3. Verify every C data-structure implementation (`gcc -std=c99 -Wall -Wextra`) and every tree/stack/queue/sorting trace step-by-step.
4. Run `validate_pyq.py` and `audit_pyq_answers.py --subject CST205 --strict`.

### Acceptance criteria & evidence to quote
- `audit_pyq_answers.py --subject CST205 --strict` = `0` errors; every trace/reconstruction/rotation prompt includes a step-by-step table and/or ASCII pointer/tree diagram; before/after metrics per paper recorded in `record.md`.

---

## Part 18.5 — Computer System Organization (`CST207`) Direct Hand-Authored Answer Expansion (`6` papers · `195` questions)

### Baseline defects to resolve (measured on `06656a9`)
- **195 questions** across `P001` (`27`), `P002` (`65`), `P003` (`34`), `P004` (`23`), `P005` (`22`), `P006` (`24`); `35 / 51` (`68.6%`) of `>= 5m` long answers `< 120w`; **29 of 34** `2023–2026` 8-mark answers `< 80w` (`P003` med `42w`, `P004` `61w`, `P005` `46w`, `P006` `64w`); only `6` tables across all 195 questions.
- Missing Booth's multiplication register-cycle tables (e.g., `CST207-P005-Q16` `(-9) × (-13)` has zero cycle table), missing Restoring Division step tables, missing IEEE-754 single/double-precision bit breakdowns, missing cache-mapping & write-policy `[!COMPARE]` boxes (`P005-Q19`), missing 8086 BIU/EU, Von Neumann, DMA, and microprogrammed-control ASCII block diagrams, mark-split mismatch on `CST207-P003-Q28`, and 41 `**Model answer:**` stubs in `P002`.

### Steps (paper-by-paper direct `edit_file` — zero scripts)
1. Author **2023–2026 calibrated window first** (`P006` → `P005` → `P004` → `P003`: `103` questions), aligned with `subjects/CST207/units/unit-1..5.html` (register widths, arithmetic right-shift sign extension in Booth's algorithm, EAT formulas, 8086 addressing-mode EA formulas).
2. Author **2021–2022 archived papers** (`P002` `65` Qs → `P001` `27` Qs, including all eight 10-mark `P001` questions and 41 `P002` short stubs).
3. Double-check every binary/2's-complement/IEEE-754/Booth/division/EAT/page-fault calculation mathematically before committing via `edit_file`.
4. Run `validate_pyq.py` and `audit_pyq_answers.py --subject CST207 --strict`.

### Acceptance criteria & evidence to quote
- `audit_pyq_answers.py --subject CST207 --strict` = `0` errors; every Booth/division/IEEE-754/page-fault/EAT numerical shows full working table + `[!FORMULA]` legend; before/after metrics per paper recorded in `record.md`.

---

## Part 18.6 — Algorithms (`CST209`) Direct Hand-Authored Answer Expansion, Mode B Integrity Re-Pin & Full Canonical Gate (`5` papers · `167` questions)

### Baseline defects to resolve (measured on `06656a9`)
- **167 questions** across `P001` (`62`), `P003` (`34`), `P004` (`23`), `P005` (`24`), `P006` (`24`); **only 1 Markdown table in the entire subject**; `34 / 44` (`77.3%`) of `>= 5m` long answers `< 120w`; **32 of 35 (`91.4%`)** `2023–2026` 8-mark answers `< 80w` (`P003` med `48w`, `P004` `50w`, `P005` `42w`, `P006` `63w`).
- Unclosed code fence in `CST209-P006-Q18`; 30-word 8-mark answers (`P005-Q16`); skipped partition/pass traces (`P005-Q18, Q19, Q21, Q22, Q23`); 41 `**Model answer:**` stubs in `P001`.

### Steps
1. Author **2023–2026 calibrated window first** (`P006` → `P005` → `P004` → `P003`: `105` questions, including CO5 String/Trie items aligned with `subjects/CST209/units/unit-1..5.html`): full asymptotic mathematical definitions + `[!COMPARE]` boxes (`O` vs `Ω` vs `Θ`, Bubble vs Selection vs Insertion, Merge vs Quick vs Heap Sort, Linear vs Binary Search, Separate Chaining vs Open Addressing, Prim's vs Kruskal's, BFS vs DFS, Dijkstra vs Bellman-Ford vs Floyd-Warshall, Divide-and-Conquer vs Greedy vs DP), full recurrence derivations, full sorting/MST/shortest-path/LPS/Rabin-Karp/Trie traces.
2. Author **`CST209-P001-2022-06.json`** (`62` questions: 41 short stubs + 12 MCQs + 9 six-mark Group C answers; preserve `unit: 5` on `CST209-P001-Q56` and `CST209-P003-Q34`).
3. **Mode B Integrity & Exception Ledger Reconciliation (only after field-immutability proof passes):**
   - Verify via `tests/test_data_pipeline.py` that across all 28 `_data/CST*/*.json` files, **zero** non-`answer` fields changed relative to `sourceCommit` `664674b` (+ recorded Phase 12 `unitMoves`).
   - Refresh `_data/pyq-integrity.json` SHA-256 hashes for the 28 updated paper JSONs (registries unchanged) and update `contentHash` ONLY on the 6 existing out-of-syllabus PYQ exception entries in `docs/data/validation-exceptions.json` (`CST205-P001-Q3,Q21,Q22,Q25`, `CST209-P001-Q56`, `CST209-P003-Q34`).
   - Bump `sw.js` `VERSION` if shell JS/CSS changed in Part `18.1`.
4. **Run the full 14-step canonical rebuild twice** (proving byte-identical idempotence on pass 2):
   `build_data_catalog.py` → `build_practice_days.py` → `build_cards.py` → `build_runtime_data.py` → `build_coverage.py` → `build_revision_sheets.py` → `build_verification.py` → `build_runtime_bundles.py` → `build_icon_subset.py` → `build_suggestions.py` → `generate_presence.py` (×2) → `build_search_index.py` → `build_data_version.py`.
5. **Run all repository verification gates:**
   - `python3 scripts/audit_pyq_answers.py --strict`
   - `python3 scripts/validate_pyq.py`
   - `python3 scripts/check_pyq_integrity.py`
   - `python3 scripts/validate_data.py --check-baseline`
   - `python3 scripts/validate_syllabus.py`
   - `python3 scripts/check_platform.py`
   - `python3 scripts/build_suggestions.py --check`
   - `python3 scripts/check_site.py --strict --quiet`
   - `python3 scripts/audit_accessibility.py --fail`
   - `python3 scripts/check_tokens.py --strict`
   - `python3 scripts/build_icon_subset.py --check`
   - `python3 scripts/build_data_version.py --check`
   - `python3 scripts/audit_page_weight.py --budget`
   - `python3 scripts/check_root_rewrite.py`
   - `python3 scripts/check_readme_paths.py`
   - `python3 -m unittest discover -s tests -p "test_*.py"`
   - All deterministic Node `.cjs` suites (`tests/discovery-dom.cjs`, `tests/study-dom.cjs`, `tests/data-version.cjs`, etc.).

### Acceptance criteria & evidence to quote
- All 924 questions across 28 papers pass `audit_pyq_answers.py --strict` with `0` errors and `0` warnings; `924 raw / 923 unique / 1 alias` preserved; `0/924` answers certified (`answerStatus == "model-answer"` on every PYQ item); all Python, Node, budget, token, site, and integrity gates exit `0`; `record.md`, `docs/ROADMAP.md`, `docs/STATUS.md`, and `prompt.md` updated; copyable Termux command block printed in chat (`rule.md` §7).
