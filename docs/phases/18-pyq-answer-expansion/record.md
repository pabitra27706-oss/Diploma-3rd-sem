<!-- SPDX-License-Identifier: MIT -->

# Phase 18 — PYQ Answer Expansion & Rich Structured Model Answers

- Status: 🚧 in progress (Owner approved **Mode B** on `2026-11-26`; **Part 18.1 ✅** + **Part 18.5 `CST207` CSO ✅** pushed at `ba437d4` & owner-passed on Termux; **Part 18.6 `CST209` Algorithms ✅** `167/167` Q complete locally; Parts `18.2` C, `18.3` Python, `18.4` DS remaining) · Branch: `arena/84c55b1a-diploma-3rd-sem` (base `06656a9`)
- CI: local workspace verified (`207/207` Python tests + `16/16` deterministic Node `.cjs` suites + all site/token/a11y/budget/integrity checks exit `0`); commit `ba437d4` (Parts `18.1` + `18.5`) pushed to `origin/arena/84c55b1a-diploma-3rd-sem`; Part `18.6` (`CST209`) is local/unpushed pending owner instruction (no PR/merge/deploy authorized)
- **Preview:** local Termux preview (`rule.md` §7); owner reported `"Test pass continue with algorithm"` on `ba437d4`; no browser/Chromium available in this sandbox

## Parts

- 18.1 — Cross-surface rich-answer renderer (`assets/js/rich-content.js`: `[!COMPARE]` comparison boxes, `[!MARKS]`/`[!FORMULA]`/`[!KEY]`/`[!TRAP]` callout boxes, pipe-safe tables, bullet-vs-code fix, Print/Practice/Quiz/Flashcard parity) + read-only `scripts/audit_pyq_answers.py` + Mode B field-level immutability lock — ✅ complete (`2026-11-26`, owner Termux test passed)
- 18.2 — Computer Programming in C (`CST201`, 6 papers / 198 questions) direct hand-authored answer expansion (`gcc`-verified) — 📋 planned
- 18.3 — Scripting Languages — Python (`CST203`, 5 papers / 170 questions) direct hand-authored answer expansion (`python3`-verified, `Q43 == Q44` alias preserved) — 📋 planned
- 18.4 — Data Structures (`CST205`, 6 papers / 194 questions) direct hand-authored answer expansion (`gcc` + step-trace verified) — 📋 planned
- 18.5 — Computer System Organization (`CST207`, 6 papers / 195 questions) direct hand-authored answer expansion (Booth/division/IEEE-754/page-fault/8086/architecture verified) — ✅ complete (`2026-11-26`, `195/195` Q `0` strict errors; owner Termux test passed)
- 18.6 — Algorithms (`CST209`, 5 papers / 167 questions) direct hand-authored answer expansion + Mode B integrity/exception-ledger re-pin + 14-step canonical rebuild & full gate suite — ✅ complete (`2026-11-26`, `167/167` Q pass `audit_pyq_answers.py --subject CST209 --strict` with `0` errors)

## Reused (reuse scan for this phase)

- Rich-text parser (`pyq/js/answers.js:187–403`, `practice/js/session.js:281–505`) — **ADAPT** — existing first-party Markdown subset parser; consolidate/sync and upgrade with `[!COMPARE]` comparison boxes, `[!KEY]`/`[!FORMULA]`/`[!TRAP]`/`[!MARKS]` callouts, escaped-pipe/backtick-aware `splitTableRow()`, bullet-before-`isCodeLine()` fix, and DOM/HTML rendering in `printAnswerBody()`, `quiz/js/review.js`, and `cards.html` (`assets/js/study-ui.js`). Keeps zero third-party runtime dependencies.
- Callout/table design language (`subjects/units-com/common.css`, `assets/css/variables.css`) — **ADAPT** — reuse existing Study Hub semantic colour tokens (`0` raw hex literals) for `.comparison-box` and `.answer-callout` across light, dark, high-contrast, and print modes.
- Data pipeline & immutability harness (`scripts/data_pipeline.py`, `scripts/validate_pyq.py`, `scripts/check_pyq_integrity.py`, `tests/test_data_pipeline.py`) — **ADAPT** — preserve the 14-step canonical rebuild chain and add `scripts/audit_pyq_answers.py` (strictly read-only structural lint) plus field-level non-`answer` immutability checks against `664674b`.
- Bulk Python/LLM script prose generators — **REJECT (Hard Owner Prohibition)** — explicitly banned; caused the 207 `**Model answer:**` stubs, 26 unclosed code fences, 2 broken pipe tables, and 13 mark-split header contradictions documented below. Every `answer` must be hand-authored via `edit_file`.

## Evidence (before the change — audited on `06656a9`, `2026-11-26`)

1. **Corpus-wide brevity across 28 papers / 924 questions (`_data/CST{201,203,205,207,209}/*.json`):**
   - Subject medians: `CST201` `30w` (`n=198`), `CST203` `32w` (`n=170`), `CST205` `32w` (`n=194`), `CST207` `33w` (`n=195`), `CST209` `30w` (`n=167`).
   - By marks: `1m` (`n=378`) median `31w`; `2m` (`n=303`) median `19w` (`140/224` `1+1` MCQs `< 25w`, `76/79` non-MCQ 2m items `< 30w`); `6m` (`n=45`) median `209w` (`CST203-P001` median `83w`); `8m` (`n=174`) median **`63w`** (`74/174` `< 60w`, `119/174 = 68.4%` `< 100w`, only `24` tables and `33` bulleted answers); `10m` (`n=24`) median **`64w`** (`23/24` `< 100w`, **`0` tables, `0` bullet lists, `0` code fences**).
   - Overall `>= 5m` long questions: **`156 / 243` (`64.2%`) are under `120` words**.
2. **Concrete authoring defects from prior scripted/telegraph passes:**
   - **26 unclosed ` ``` ` code fences:** `CST201-P006-Q17,Q18,Q20,Q21,Q22,Q23,Q24`; `CST203-P003-Q26,Q27,Q29,Q30,Q32,Q33`; `CST203-P004-Q17,Q19,Q22`; `CST203-P005-Q20,Q22,Q23`; `CST203-P006-Q16,Q18,Q19,Q21,Q22,Q24`; `CST209-P006-Q18`.
   - **2 broken Markdown pipe-table rows:** `CST203-P003-Q31` (`| Bitwise | &, |, ^, ~, <<, >> | Operate on bits |`) and `CST203-P006-Q20` (`| print(a | b) | bitwise OR | 7 |`).
   - **13 mark-distribution header mismatches** (8 direct subpart contradictions: `CST201-P003-Q32,Q33`, `CST201-P005-Q17,Q22`, `CST205-P003-Q31`, `CST205-P005-Q18,Q21`, `CST207-P003-Q28`; plus 5 wording/count divergences).
   - **207 robotic `**Model answer:**` stubs** across June 2022 `short` questions (`median = 10 words`).
   - **54 comparison/differentiation non-MCQ questions** without any Markdown comparison table; **24 diagram/flowchart/tree/architecture prompts** without any code/ASCII diagram or trace table; **8 "Write a C program" prompts** missing `#include`/`main()` (plus `CST201-P001-Q24,Q26,Q28` 10-mark program questions with zero code).
3. **Cross-surface renderer & consumer defects (`file:line` verified):**
   - `pyq/js/answers.js:368` & `practice/js/session.js:491`: `isCodeLine()` matches `/^\s*\*\s+/` before bullet parsing (`pyq/js/answers.js:294`, `practice/js/session.js:358`).
   - `pyq/js/answers.js:394` & `practice/js/session.js:451`: `splitTableRow()` splits naively on `|` even inside inline code or `\|`.
   - `practice/js/session.js:281–437`: lacks `blockquote` and `hr` handling present in `pyq/js/answers.js:272–290`.
   - `pyq/js/answers.js:1599–1655` (`printAnswerBody`): escapes non-code prose into `<div class="print-answer-text">`, printing raw Markdown tables/bold/callouts on PDF export.
   - `quiz/js/review.js:465, 623` (fed by `quiz/js/paper-attempt.js:154–155`): sets `review-model-text` via `textContent`, exposing raw Markdown in PYQ mock-paper review.
   - `scripts/build_cards.py:88` + `assets/js/study-ui.js:171`: copies `question['answer']` into `card.back` and renders `#card-back` via `textContent`.
   - `tests/test_data_pipeline.py:61`, `_data/pyq-integrity.json`, `docs/data/validation-exceptions.json`: lock `answer` bytes/hashes under Mode A; require explicit owner Mode B approval and field-level non-`answer` immutability checks.

## What shipped (`2026-11-26` — Planning + Part 18.1 + Part 18.5 CSO)

1. **Phase 18 Blueprint (`docs/phases/18-pyq-answer-expansion/{README.md,authoring-standard.md,tasks.md,record.md}`):**
   - Full 924-question audit, mark-proportional depth rubric, `- **Lead-in:**` bulleting & `[!COMPARE]`/`[!MARKS]`/`[!FORMULA]`/`[!KEY]`/`[!TRAP]` standard. Owner granted Mode B approval (`"Mode b approved / Start with cso"`).
2. **Part 18.1 — Cross-Surface Rich-Content Engine, CSS, Linter & Immutability Lock:**
   - Added zero-dependency shared AST parser/renderer `assets/js/rich-content.js` (`StudyRichContent`, bundled into `assets/js/shell.bundle.js` via `scripts/build_runtime_bundles.py`) supporting `toHtml()`, `toPrintHtml()`, and pure DOM `renderInto()` (`0` `innerHTML` sinks in DOM surfaces).
   - Fixed `* ` bullet-vs-`isCodeLine()` precedence, backtick/escaped-pipe-safe `splitTableRow()`, `> [!COMPARE] Title` comparison boxes (`.compare-box`), `> [!MARKS|KEY|FORMULA|TRAP]` callout boxes (`.rich-callout`), `pyq/js/answers.js` Print/PDF parity (`printAnswerBody`), `practice/js/session.js`, `quiz/js/{review.js,result.js}`, and `cards.html` (`assets/js/study-ui.js` concise preview + `<details class="card-more-detail">` expansion for long cards).
   - Styled all new components in `assets/css/hub.css` using strictly `assets/css/variables.css` semantic tokens (`check_tokens.py --strict` = `0` findings across light, dark, high-contrast, and `@media print`).
   - Added read-only structural/depth validator `scripts/audit_pyq_answers.py` + `tests/test_audit_pyq_answers.py` + `tests/rich-content-dom.cjs`, and locked non-`answer` field immutability against `664674b` in `tests/test_data_pipeline.py` + `tests/test_algorithms_content.py`.
3. **Part 18.5 — Direct Hand-Authored CSO (`CST207`) Answer Expansion (`6` papers · `195` questions, zero prose-generation scripts):**
   - Hand-authored all `195` questions across `CST207-P006-2026-01.json` (`24` Q), `CST207-P005-2024-12.json` (`22` Q), `CST207-P004-2024-01.json` (`23` Q), `CST207-P003-2023-03.json` (`34` Q), `CST207-P002-2022-06.json` (`65` Q), and `CST207-P001-2021-03.json` (`27` Q).
   - Total `CST207` answer prose expanded from **`9,587` → `29,338` words (`3.06×`)**, overall median **`33w` → `91w`**:
     - `P001` (`27` Q, `10m` Group B): overall median `42w → 77w`, `>=5m` median **`62w → 377w`** (`5` `[!COMPARE]`, `8` `[!MARKS]`, `5` `ascii` diagrams).
     - `P002` (`65` Q, `6m` Group C + `41` short/fill stubs): overall median **`13w → 57w`**, `>=5m` median `275w → 279w`, `41/41` `**Model answer:**` stubs eliminated (`2` `[!COMPARE]`, `9` `[!MARKS]`, `8` `ascii` diagrams; fixed `40H + 40H = 80H → OF = 1` signed-overflow error on `Q60`).
     - `P003` (`34` Q, `8m` Group B): overall median `37w → 70w`, `>=5m` median **`42w → 309w`** (`2` `[!COMPARE]`, `9` `[!MARKS]`, `6` `ascii` diagrams; fixed `Q28` `3+5` mark-split contradiction).
     - `P004` (`23` Q, `8m` Group B): overall median `23w → 98w`, `>=5m` median **`55w → 347w`** (`2` `[!COMPARE]`, `8` `[!MARKS]`, `5` `ascii` diagrams).
     - `P005` (`22` Q, `8m` Group B): overall median `26w → 107w`, `>=5m` median **`45w → 381w`** (`4` `[!COMPARE]`, `8` `[!MARKS]`, `3` `ascii` diagrams; verified `(-9) × (-13) = +117` Booth 5-cycle trace & `FIFO=15 / LRU=13` 3-frame page-fault traces).
     - `P006` (`24` Q, `8m` Group B): overall median `26w → 112w`, `>=5m` median **`64w → 422w`** (`3` `[!COMPARE]`, `9` `[!MARKS]`, `6` `ascii` diagrams).
   - Updated `_data/pyq-integrity.json` (`reconciliation.answerExpansion.authorizedPapers` + 6 `CST207` SHA-256 hashes; `_data/CST207/registry.json` and all 22 other papers byte-identical), bumped `sw.js` `VERSION` to `study-2026-11-26-phase18-cso`, updated `tests/test_cards.py` shard budget (`< 420 KB` per lazy subject shard, `< 1.85 MB` across all 5 shards), and ran the 14-step canonical rebuild twice with byte-identical Pass 2 output. Committed & pushed at `ba437d4` (`origin/arena/84c55b1a-diploma-3rd-sem`); owner Termux test passed (`"Test pass continue with algorithm"`).
4. **Part 18.6 — Direct Hand-Authored Algorithms (`CST209`) Answer Expansion (`5` papers · `167` questions, zero prose-generation scripts):**
   - Hand-authored all `167` questions across `CST209-P006-2026-01.json` (`24` Q), `CST209-P005-2024-12.json` (`24` Q), `CST209-P004-2024-01.json` (`23` Q), `CST209-P003-2023-03.json` (`34` Q), and `CST209-P001-2022-06.json` (`62` Q).
   - Total `CST209` answer prose expanded from **`7,541` → `21,220` words (`2.81×`)**, overall median **`30w` → `63w`** (`15` `[!COMPARE]` boxes, `44` `[!MARKS]` headers, `14` `ascii` diagrams):
     - `P001` (`62` Q, `6m` Group C + `41` short/fill stubs): `3,312 → 5,078w`, overall median **`14w → 48w`**, `>=5m` median `269w`, `41/41` `**Model answer:**` stubs eliminated (`3` `[!COMPARE]`, `9` `[!MARKS]`, `4` `ascii` diagrams; `unit: 5` preserved on `Q56`).
     - `P003` (`34` Q, `8m` Group B): `1,292 → 4,066w`, overall median `38w → 47w`, `>=5m` median **`48w → 343w`** (`3` `[!COMPARE]`, `9` `[!MARKS]`, `2` `ascii` diagrams; `unit: 5` preserved on `Q34`).
     - `P004` (`23` Q, `8m` Group B): `1,279 → 3,565w`, overall median `26w → 66w`, `>=5m` median **`48w → 312w`** (`1` `[!COMPARE]`, `8` `[!MARKS]`, `3` `ascii` diagrams; fixed `Q14` BST leaf-count input hallucination `10, 20, 5, 12, 16` → verified `10, 1, 3, 5, 15, 12, 16` leaves `{5, 12, 16}` = `3`, plus full `5`-pass Bellman–Ford relaxation table on `Q22` and `11`-shift Naive String Matching table on `Q23`).
     - `P005` (`24` Q, `8m` Group B): `771 → 4,229w` (`5.49×`), overall median `32w → 64w`, `>=5m` median **`42w → 383w`** (`3` `[!COMPARE]`, `9` `[!MARKS]`, `2` `ascii` diagrams; full Lomuto Quick Sort trace on `12` keys, `7`-vertex Kruskal MST trace `cost=39`, `4×4` Floyd–Warshall `D^(0)..D^(4)` matrices, `8`-word Trie `ascii` tree, and `KMP` `LPS=[0,0,1,2,0]` pointer trace).
     - `P006` (`24` Q, `8m` Group B): `887 → 4,282w` (`4.83×`), overall median `20w → 77w`, `>=5m` median **`63w → 344w`** (`5` `[!COMPARE]`, `9` `[!MARKS]`, `3` `ascii` diagrams; fixed `Q18` inline `**a)** ```text` structural defect, `6`-pass Bubble Sort trace, and `3`-pass LSD Radix Sort bucket trace).
   - Updated `_data/pyq-integrity.json` (`11` authorized papers, `362` expanded questions across `CST207` + `CST209`), re-pinned `contentHash` ONLY on `CST209-P001-Q56` and `CST209-P003-Q34` in `docs/data/validation-exceptions.json` (`unit: 5` and all non-`answer` fields unchanged), bumped `sw.js` `VERSION` to `study-2026-11-26-phase18-algo`, added `test_completed_phase18_subjects_pass_strict_audit` to `tests/test_audit_pyq_answers.py`, and ran the 14-step canonical rebuild twice with byte-identical Pass 2 output.

## Checks (`2026-11-26` — Part 18.1 + Part 18.5 CSO + Part 18.6 Algorithms)

- `python3 scripts/audit_pyq_answers.py --subject CST207 --strict` → **`6` papers, `195` questions · `structural=0` · `depth/format=0` · `[!COMPARE]=18` · `[!MARKS]=51`** (exit `0`)
- `python3 scripts/audit_pyq_answers.py --subject CST209 --strict --verbose` → **`5` papers, `167` questions · `structural=0` · `depth/format=0` · `[!COMPARE]=15` · `[!MARKS]=44`** (exit `0`)
- `python3 scripts/validate_pyq.py` → `28` papers, `924` questions, `0` errors, `0` warnings (`PASS`)
- `python3 scripts/check_pyq_integrity.py` → `PYQ integrity: 0 changed/added/missing files` (exit `0`)
- `python3 scripts/validate_data.py --check-baseline` → matches source-review ledger (`0` unexpected changes, exit `0`)
- `python3 scripts/check_site.py --strict --quiet` → `0` errors, `0` warnings (exit `0`)
- `python3 scripts/audit_accessibility.py --fail` → `84` pages, `74` token contrast pairs, `0` findings (exit `0`)
- `python3 scripts/check_tokens.py --strict` → `321` palette entries, `84` pages, `0` findings (exit `0`)
- `python3 scripts/audit_page_weight.py --budget` → all `84` pages within `340 KB` CSS / `350 KB` JS (`max CSS = 328,434 B`, `max JS = 195,322 B`, exit `0`)
- `python3 scripts/check_platform.py`, `build_suggestions.py --check`, `build_icon_subset.py --check`, `build_data_version.py --check`, `check_root_rewrite.py`, `check_readme_paths.py`, `verify_cst209_traces.py`, `verify_cst209_graphs.py` → all exit `0`
- `python3 -m unittest discover -s tests -p "test_*.py"` → **`207` tests, `OK`, `0` skipped** (including `test_no_semantic_or_answer_changes` proving every non-`answer` field across all 28 papers is unchanged vs `664674b`)
- Deterministic Node suites (`tests/{attempt-store,data-pipeline-consumers,data-version,discovery-dom,preferences,quiz-engine-dom,rich-content-dom,section-notes,storage-mirror,storage-recovery,storage,study-dom,study-offline,study-store,theme-skew}.cjs` + `scripts/audit_cst209_runtime.cjs`) → **`16/16` suites `PASS`**
- **Not run / not verifiable here:** Playwright/Chromium browser smoke suites (`playwright-core` not installed in sandbox), physical phone rendering of the new `CST209` answers, and print-to-PDF visual preview; remaining 3 subjects (`CST201` C, `CST203` Python, `CST205` DS = `562` Q) are queued next.

## Next-chat prompt

- Continue Phase 18 direct hand-authored PYQ answer expansion (`0` prose-generation scripts) across the remaining 3 subjects: **Part `18.2` (`CST201` C, `198` Q)**, **Part `18.3` (`CST203` Python, `170` Q)**, and **Part `18.4` (`CST205` DS, `194` Q)**.

## Follow-ups

- Execute Parts `18.2` (`CST201` C), `18.3` (`CST203` Python), and `18.4` (`CST205` DS) in the order preferred by the owner, verifying each paper with `audit_pyq_answers.py --strict` and `gcc`/`python3` compiler/trace checks, then run the final corpus-wide `audit_pyq_answers.py --strict` across all `924` questions.
- Optional future phase (only if requested after Phase 18): standalone `_quiz-data/` non-MCQ model-answer & explanation parity pass.
