# Phase 12 Record — Computer Programming in C

- **Status:** 🚧 In progress — parts **12.4 (Unit 4)**, **12.2 (Unit 2)**, **12.1 (Unit 1)**, **12.3 (Unit 3)** and **12.5 (Unit 5)** executed; part `12.6` (the phase gate) outstanding. Blueprint calibrated 2026-11-18 to strict **2023–2026** PYQ weights: `P003–P006`, `4` papers, `105` Qs, `395` printed set marks; `2021–2022` `P001`/`P002` excluded.
- **Syllabus authority:** `CST201` (`2` credits, L–T–P `2-0-0`, `30h = 5+5+7+7+6`, PDF p. 3); paired lab `CST211` (`2` credits, `0-0-2`, `30h`, PDF p. 14).
- **Shipped files modified so far:** `subjects/CST201/units/unit-{4,2,1,3,5}.html` plus the regenerated `assets/search/*`, `assets/data/{coverage,data-version}.json`, `assets/vendor/fontawesome/*`, `coverage.html`, and the `unitAnchored` lock in `tests/test_discovery.py`. `_data/` and `_quiz-data/` untouched (Mode A).
- **Commit / PR / deploy state:** Committed to `arena/08838a66-diploma-3rd-sem`; not merged or deployed.

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js` (shared unit layout, collapsible sections, notes keys, CSS custom properties).
- **ADAPT:** `assets/js/unit-discovery.js` (`focusQuestionTopic()` heading-token match + generic-section exclusion if not applied in an earlier content phase); `docs/revision-sheets/CST201.json` (anchor check).
- **BUILD:** Subject-specific C programs (`gcc -std=c99` verified), inline accessible SVGs, dry-run tables, and semantic `<h3 id>` anchors inside `subjects/CST201/units/unit-{1..5}.html`.
- **REJECT:** `<iframe>` YouTube embeds, `i.ytimg.com` thumbnails, hardcoded hex/rgba colours, new CSS/JS bundles, and out-of-syllabus `argc`/`argv` or `fopen` content.

---

> **Word-count recipe (supersedes `/tmp/wc.py`, which is not reproducible — see §6.1).** Drop `<style>`, `<script>` and HTML comments; strip every tag; unescape entities; count whitespace-separated tokens that contain at least one letter or digit. `prose` repeats the count with `<pre>` and `<table>` blocks removed. Every number in this file from part 12.5 onward uses this recipe, and `python3 /tmp/wc.py unit-N` reproduces it against the pristine `d9fe014` baseline. The blueprint's budgets are applied as **relative** cuts, because the earlier absolute anchors were produced by a different script.

---

## 2. Per-Unit Calibration & Verification Ledger (fill at execution)

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | SVGs | Locked `guides.json` Anchors | `<section id>` Count | `gcc -std=c99 -Wall` |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `86m` (21.8%) | 5,418w | ~5,800–6,400w | **6,389w** | **1** | `#operators`, `#typecasting` ✅ | 15 / 15 ✅ | **6/6 programs clean** |
| Unit 2 | `95m` (24.1%) | 5,406w | ~6,200–6,800w | **7,532w** | **1** | `#loops`, `#jump` ✅ | 15 / 15 ✅ | **12/12 programs clean** |
| Unit 3 | `66m` (16.7%) | 5,848w | ~5,400–6,000w | **5,932w** | **2** | `#2d-arrays`, `#strings` ✅ | 16 / 16 ✅ | **8/8 programs clean** |
| Unit 4 | `97m` (24.6%) | 6,749w | ~6,500–7,200w | **7,195w** | **2** | `#parameters`, `#recursion` ✅ | 16 / 16 ✅ | **16/16 programs clean** |
| Unit 5 | `51m` (12.9%) | 7,558w | ~5,000–5,600w | **5,572w** | **2** | `#declaration`, `#dma` ✅ | 21 / 21 ✅ | **16/16 programs clean** |
| **Total** | **`395m` (100%)** | **30,979w** | **~28.9–32.0kw** | **32,693w** | **7** | **10 / 10 preserved** | **82 / 82** | **all clean** |

---

## 3. Live-Verified YouTube Curation Log (16 slots, plain `<a>` only)

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Duration | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| U4 | 1 | Storage classes (`auto`/`static`/`extern`/`register`) | Tier A · `35m` | `#scope` | Success GATEway — Storage Classes in C, part 1 | `https://www.youtube.com/watch?v=3gaSYmYpcjo` | n/a | 2026-11-18 |
| U4 | 2 | Introduction to functions | Tier A · `29m` | `#functions-intro` | Neso Academy — Introduction to Functions in C | `https://www.youtube.com/watch?v=3lqgdqoY83o` | n/a | 2026-11-18 |
| U4 | 3 | Recursion + worked program | Tier A · `19m` | `#recursion` | Neso Academy — Recursion in C | `https://www.youtube.com/watch?v=kepBmgvWNDw` | n/a | 2026-11-18 |
| U4 | 4 | Call by value vs call by reference | Tier B · `14m` | `#parameters` | Neso Academy — Call by Value and Call by Reference | `https://www.youtube.com/watch?v=HEiPxjVR8CU` | n/a | 2026-11-18 |
| U2 | 5 | `for`, `while` and `do-while` loops | Tier A · `52m` | `#loops` | Neso Academy — for and while Loops | `https://www.youtube.com/watch?v=qUPXsPtWGoY` | n/a | 2026-11-18 |
| U2 | 6 | Loop dry-runs / solved problem | Tier A · sub-cluster | `#loops` | Neso Academy — Conditionals and Loops (Solved Problem 1) | `https://www.youtube.com/watch?v=SQCPZYAXoZs` | n/a | 2026-11-18 |
| U2 | 7 | `switch-case` fall-through | Tier C · `7m` | `#switch` | Neso Academy — Conditionals (Switch) | `https://www.youtube.com/watch?v=-JMSaLRqsgo` | n/a | 2026-11-18 |
| U2 | 8 | `break` / `continue` loop control | Tier B · `11m` | `#jump` | Neso Academy — Loop Control Statements: break and continue | `https://www.youtube.com/watch?v=obJcPlAtGVM` | n/a | 2026-11-18 |
| U1 | 9 | Precedence and associativity | Tier A · `43m` | `#operators` | Neso Academy — Precedence and Associativity of Operators | `https://www.youtube.com/watch?v=8H9G621pQq0` | n/a | 2026-11-18 |
| U1 | 10 | Bitwise operators | Tier A · sub-cluster | `#operators` | Neso Academy — Bitwise Operators in C (Part 1) | `https://www.youtube.com/watch?v=jlQmeyce65Q` | n/a | 2026-11-18 |
| U1 | 11 | Program structure and headers | Tier B · `13m` | `#history` | Self Study Tutorials — Basic Structure of C Program | `https://www.youtube.com/watch?v=fEqexgUuj9A` | n/a | 2026-11-18 |
| U3 | 12 | 2D arrays — declaration and traversal | Tier A · `30m` | `#2d-arrays` | Jenny's Lectures CS IT — Introduction to Two-Dimensional (2D) Arrays in C | `https://www.youtube.com/watch?v=HMBYWhpP8i4` | n/a | 2026-11-18 |
| U3 | 13 | Strings — the `'\0'` terminator | Tier A · `23m` | `#strings` | Jenny's Lectures CS IT — Strings in C (part 1) | `https://www.youtube.com/watch?v=x_3FKTDkGT8` | n/a | 2026-11-18 |
| U3 | 14 | `strcat` with and without the library | Tier A · sub-cluster | `#string-functions` | Jenny's Lectures CS IT — Concatenate two strings, `strcat()` and manual | `https://www.youtube.com/watch?v=LFPoPHBiWCE` | n/a | 2026-11-18 |
| U3 | 15 | Array initialisation rules | Tier A · sub-cluster | `#arrays-intro` | Neso Academy — Initializing an Array | `https://www.youtube.com/watch?v=GtcRReso9Xk` | n/a | 2026-11-18 |
| U3 | 16 | 2D arrays — why the column bound matters | Tier A · sub-cluster | `#2d-arrays` | Neso Academy — Introduction to Two-Dimensional (2D) Arrays | `https://www.youtube.com/watch?v=J1aQ9JN4vZY` | n/a | 2026-11-18 |
| U5 | 17 | Pointer basics: `&`, `*` and addresses | Tier B · `17m` | `#intro` | Neso Academy — Introduction to Pointers in C | `https://www.youtube.com/watch?v=f2i0CnUOniA` | n/a | 2026-11-18 |
| U5 | 18 | Array name as a pointer | Tier B · `15m` | `#arrays` | Neso Academy — Using Array Name as a Pointer | `https://www.youtube.com/watch?v=gv-y9hIhvq4` | n/a | 2026-11-18 |
| U5 | 19 | Dynamic memory: `malloc` | Tier B · `17m` | `#dma` | Neso Academy — Dynamic Memory Allocation using malloc() | `https://www.youtube.com/watch?v=Vch7_YeGKH4` | n/a | 2026-11-18 |

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`105` Questions)

- **Sync mode used:** **Mode B**, owner-approved 2026-11-18 (see §6 "Owner decisions"). The earlier parts ran Mode A by design; part 12.6 was authorised to correct `_data/CST201/` because the routing misses could not be closed from the JS side alone (see §4.1).

### 4.1 Part 12.6 result — `105/105` route cleanly (`103` same-unit / `2` correct redirect / `0` unmatched)

| Stage | Same-unit | Redirect | Unmatched |
| :--- | ---: | ---: | ---: |
| Baseline (`f52d2f6`) | 46 | 29 | 30 |
| After 12.1–12.5 (all five unit pages shipped) | 66 | 35 | 4 |
| After the discovery fix only (`3440211`, "part B") | 77 | 28 | 0 |
| After the `unit` re-tag (part C1) | 103 | 2 | 0 |

- **Part B — the discovery defect, fixed first.** `assets/js/unit-discovery.js` had two independent faults that only showed together: it required the *whole* stored topic to appear as a heading string, and it compared plural topics against singular headings. `scoreTitle()` now splits topics on `/ , ;` and scores each segment separately (best wins), and singularises terms. Recorded as the reproducible gauge `scripts/audit_topic_routing.py` (`--verbose`, `--fail-unmatched`) so the number can be re-derived without a browser.
- **Part B follow-up — the overview tie-break.** With segments scoring, `"Arrays / loops"` reached `90` against BOTH the generic `#overview` card and the specific `#arrays-initialization-memory-and-loops` section, and document order sent it to the overview. Ties are now broken on **how many of the topic's own segments the heading covers**, so the specific section wins. 17 anchors improve under this rule and none regress; the five questions named in the part 12.6 brief all land on a specific authored heading:

| Question | Topic | Resolves to |
| :--- | :--- | :--- |
| `P003-Q8` | Arrays / loops | U3 `#arrays-initialization-memory-and-loops` |
| `P005-Q11` | Unions / memory | U5 `#pointers-to-structures-and-unions` |
| `P005-Q15` | Storage classes / data types | U4 `#storage-classes-in-c` |
| `P006-Q6` | Functions | U4 `#functions-intro` |
| `P006-Q21` | Functions / recursion | U4 `#overview-recursion` |

- **Part C1 — the data defect (`44` questions re-tagged, `unit` only).** The stored `unit` on 44 of the 105 `P003`–`P006` questions was simply wrong — mostly the legacy U3/U4 inversion, plus a 23-mark under-count in Unit 5. Each move was read against the question stem and options, not inferred from the old tag. **Zero non-`unit` fields changed**: ids, order, stems, options, marks, topics, tags and `subparts` are byte-identical, verified field-by-field against `sourceCommit` and now pinned by a test. The four paper files (`P003`–`P006`) were re-hashed and the integrity baseline re-frozen with the exact 44 `{from, to}` moves recorded in `_data/pyq-integrity.json → reconciliation.unitMoves`.
  - Distribution before → after: `{1:39, 2:18, 3:21, 4:22, 5:5}` → `{1:40, 2:16, 3:15, 4:21, 5:13}`. **Unit 4 lands exactly on the blueprint's `97m`** — an independent check that the moves are right, not just plausible.
- **The remaining `2` redirects are correct, not misses.** `P004-Q8` (scope/declarations, filed U1) belongs to U4 `#overview-scope-storage`, and `P006-Q9` (operator parsing, filed U2) belongs to U1 `#operator-precedence-and-parsing`. A redirect into `90`-scoring syllabus content is the feature working.
- **Part C2 — deliberately NOT done, and why.** The blueprint's per-unit mark figures (`{1:86, 2:95, 3:66, 4:97, 5:51}`) are attributed **per subpart**, while `_data` stores one `unit` per *question*. 35 of the 105 questions are composites (e.g. `P004-Q16` splits across U1/U2/U4), so no whole-question re-tag can ever reproduce those totals — the residual is exactly the six 8-mark composites. Reaching them needs a new `subparts[].unit` field plus pipeline, viewer and re-baseline work; it is recorded as scoped follow-up in `tasks.md` rather than smuggled into this pass.

### 4.2 Quiz-bank reversal — resolved at source (not waived)

- `_quiz-data/CST201/unit-3.json` held **User Defined Functions** and `unit-4.json` held **Arrays & Strings**: the `unit-order` finding recorded in `docs/data/validation-exceptions.json` since Phase 11. The banks were swapped and their `unit`/`unitTitle` corrected, so Unit 3 now carries `38` items on Arrays/Strings and Unit 4 `42` on Functions.
- **Question ids were deliberately left unchanged.** The id encodes the old unit (`CST201-U4-Q001` now lives in `unit-3.json`). Renumbering was rejected because content moved *with* its id, so a learner's stored attempt history still resolves to the same question text; `q.unit` is authoritative in `quiz-setup`, with `extractUnit(q.id)` only a fallback.
- The stale disclosure went with it: `build_coverage.py`'s `BANK_UNIT_REVERSAL` map, both "counts shown both ways" renderers, the legend row and the hub paragraph are **deleted**, and `quiz/js/common.js` no longer labels CST201 units 3/4 "mapping under review" (only genuinely out-of-syllabus units keep a label). `coverage.html` now prints `38` and `42` with no inventory flag.
- **Both `unit-order` findings were removed from the source-review ledger as RESOLVED**, so `validate_data.py --check-baseline` reports *"Baseline matches source-review ledger"* for the first time.

---

### 4.3 Historical routing detail (parts 12.1–12.5, Mode A)
- **Sync mode used:** Mode A (`_data/CST201/*.json` untouched) / Mode B (owner approval date: _N/A_)
- **Baseline (`f52d2f6`):** `46` same-unit (`43.8%`) · `29` redirect (`27.6%`, incl. 5 wrong-unit collisions) · `30` unmatched (`28.6%`) · `0` out-of-unit
- **After Unit 4 (part 12.4 only):** `48` same-unit (`45.7%`) · `35` redirect (`33.3%`) · `22` unmatched (`21.0%`).
- **After Unit 2 (parts 12.4 + 12.2):** `54` same-unit (`51.4%`) · `33` redirect (`31.4%`) · `18` unmatched (`17.1%`) — up from `46 / 29 / 30` at baseline.
- **After Unit 1 (parts 12.4 + 12.2 + 12.1):** **`66` same-unit (`62.9%`) · `35` redirect (`33.3%`) · `4` unmatched (`3.8%`)** — the remaining four are `P005-Q11`, `P005-Q20`, `P005-Q21` and `P004-Q23`.
- **Fixed by the Unit 1 anchors:** every U1 item the blueprint listed now resolves — `P003-Q7`/`P006-Q16`→`#headers-and-library-files` (`90` / `0.667`), `P003-Q22`→`#compilation-process` (`90`), `P003-Q17`/`P005-Q2`→`#preprocessor-and-macros` (`90` / `1.0`), `P003-Q14`/`P004-Q2`/`P005-Q14`/`P006-Q1`→`#identifiers-and-keywords` (`90` / `1.0` / `90` / `90`), `P006-Q3`→`#modulo-and-arithmetic-operators` (`90`), `P005-Q4`→`#operator-precedence-and-parsing` (`0.5`), `P003-Q5`→`#escape-sequences-and-ascii` (`0.667`). `P006-Q9` (U2 `Operator parsing`) and `P004-Q10` (U2 `Conditional operator`) now redirect into Unit 1, and `P004-Q11` lands on `U4#return-type-and-return-values`.
- **Fixed by the Unit 2 anchors:** all seven blueprint rows now resolve — `P003-Q26`→`#gcd-armstrong-and-divisibility` (`1.0`), `P005-Q17`→`#conditionals-and-flowchart` (`1.0`), `P003-Q21`/`P005-Q5`→`#loop-control-break-continue` (`1.0` / `90`), `P006-Q8`→`#loop-control-and-counting` (`90`), `P003-Q28`→`#series-and-nested-loops` (`0.667`), `P004-Q23`/`P006-Q17`→`#gcd-armstrong-and-divisibility` (`0.333`), `P006-Q24`→`#divisibility-grading-and-leap-year` (`0.4`), and `P004-Q22` now redirects `U3→U2#series-and-nested-loops` instead of `U2#overview-loops`.
- **Fixed by the Unit 4 anchors:** `P004-Q1`, `P004-Q8`, `P004-Q16`, `P003-Q33` now resolve (previously unmatched); `P005-Q15` no longer lands on `U1#fundamentals`; `P003-Q30`, `P006-Q19` land on the parameter-passing heading.
- **After Unit 3 (parts 12.4 + 12.2 + 12.1 + 12.3):** **`66` same-unit (`62.9%`) · `35` redirect (`33.3%`) · `4` unmatched (`3.8%`)** — the totals are unchanged from the Unit 1 run, because Unit 3's seven same-unit items already resolved. What changed is *which* heading they resolve to: `P006-Q11`→`U3#overview-1d-arrays` (`90`), `P006-Q22`→`U3#2d-arrays` (`1.0`), and the string items now land on `#strings-and-library-functions` / `#string-reverse-case-and-palindromes` instead of the generic `U3#overview-string-functions` card.
- **Deliberately not chased:** seven Unit 3 items (`P003-Q4,Q18,Q23`, `P005-Q20,Q21`, and the two `P006` array rows) arrive tagged `U3` with the topic text *"Functions"*, *"Functions / void"*, *"Functions / return"* or *"Functions / series"* — a legacy `unit: 4` mistag that belongs to Unit 4 by syllabus. They score `90` / `0.5` against the Unit 3 `#overview-*` card headings and therefore count as same-unit. Deleting those cards would push the mistagged seven back towards Unit 4 but would also drop five currently-correct `P006` array/string routings, so the trade was rejected. Correcting it needs a `_data/` topic edit (Mode B), which this phase does not own.
- **After Unit 5 (all five units):** all **`7`** of the blueprint's Unit 5 rows now resolve to their intended heading &mdash; `P003-Q1`→`#understanding-pointers-and-addresses` (`1.0`), `P005-Q10`→`#pointers-type-checking-and-evaluation` (`1.0`), `P005-Q8`→the same anchor (`0.6`), `P003-Q6`→`#overview-arithmetic` (`0.5`), `P004-Q20`/`P005-Q9`→`#pointers-and-one-dimensional-arrays` (`1.0`), `P005-Q11`→`#pointers-to-structures-and-unions` (`1.0`) and `P003-Q34`/`P004-Q21`/`P006-Q15`/`P006-Q23`→`#dynamic-memory-malloc-calloc-realloc-free` (`0.67`). `P005-Q11` no longer falls onto `#dma` by the accidental word "memory".
- **Still unmatched (4):** `P004-Q23` / `P006-Q17` (switch + Armstrong, `0.333` against `U2#gcd-armstrong-and-divisibility`), `P005-Q20` (`0.5`), and `P006-Q10` (`1.0` on `U3#overview-strings`, but it is filed as Unit 4 so no in-unit heading clears the `0.5` floor first). All four need `_data/` topic text or a `unit-discovery.js` tie-break rule.
- **Known limitation:** `P006-Q6` ("What is the purpose of the `return` statement") still scores `100` on the *other* unit's identical heading "Functions" (`U5#overview-functions`), because `focusQuestionTopic()` searches in-unit first and only then falls back to exact-title ties across units. Fixing it needs a `U5` heading rename or a tie-break rule in `assets/js/unit-discovery.js`, neither of which part 12.4 owns.

---

## 5. Quality-Gate & Rebuild Evidence (fill at execution)

| Check / Command | Expected | Result |
| :--- | :--- | :---: |
| `python3 scripts/check_pyq_integrity.py` | `0` changed/added/missing | ✅ `0` changed/added/missing |
| `python3 scripts/build_suggestions.py --check` | `11` static pages verified | ✅ `11` static pages verified |
| `python3 scripts/check_site.py --strict --quiet` | `0` errors, `0` warnings | ✅ `0` errors, `0` warnings |
| `python3 scripts/validate_pyq.py` & `validate_data.py --check-baseline` | PASS / matches baseline | ✅ PASS (28 papers) / ✅ matches baseline (15 clusters) |
| `python3 scripts/audit_accessibility.py --fail` & `check_tokens.py --strict` | `0` findings | ✅ `0` findings / ✅ `0` findings |
| `python3 scripts/audit_page_weight.py --budget` | `84/84` within 300 KB CSS / 350 KB JS | ✅ all pages within 340 KB CSS / 350 KB JS (unit-4: 319,885 B CSS, unchanged — no new CSS file) |
| `python3 scripts/build_icon_subset.py --check` & `build_data_version.py --check` | current | ✅ current after regeneration |
| `python3 -m unittest discover -s tests -p "test_*.py"` | all pass | ✅ **`130/130` pass.** The two long-standing blockers were cleared in 12.6, not waived: `test_data_pipeline.test_no_semantic_or_answer_changes` now passes because the missing `664674b` commit was fetched into the shallow clone **and** the test was taught to honour the recorded `unitMoves` list (an unlisted change, a non-`unit` change, or a grown move list still fails, and quiz origins stay byte-identical); `test_content_depth` was inverted to assert the *resolved* bank order instead of the old reversed state. |
| `node tests/*.cjs` (14 files) | all pass | ✅ **`14/14` pass.** `section-notes.cjs` was a real shim gap, not a test bug: `assets/js/section-notes.js:labelFor` iterates `heading.childNodes`, which `tests/lib/minidom.cjs` never exposed (it had only `children`). Added the alias. |
| `python3 scripts/validate_syllabus.py` (first time run in Phase 12) | `0` CST201 errors | ✅ `3` errors, all pre-existing out-of-syllabus unit-5 records (`CST205` 4 PYQ, `CST209` 2 PYQ + 35 quiz); **`0` CST201 errors** and the `unit-order` error is gone. |
| `python3 scripts/check_platform.py` / `check_readme_paths.py` / `check_root_rewrite.py` | clean | ✅ `0` errors / `39` paths, `0` missing / PASS |
| `python3 scripts/audit_topic_routing.py` | `105/105` route | ✅ `103` same-unit · `2` redirect · `0` unmatched |
| Raw-code / iframe sweep of the five unit pages | `0` | ✅ `0` `CST201`/`CST211`/`P00\d` strings in rendered text, `0` `<iframe>`, `0` `ytimg` |
| Canonical rebuild (`README.md:187–215`) | tree unchanged | ✅ run in the documented order; `check_pyq_integrity.py` `0` changed/added/missing afterwards |
| `unitAnchored` lock (`tests/test_discovery.py:111`) | current | ✅ **`580`, unchanged** — part 12.6 added no headings, only a tie-break rule, so the 12.5 refresh still holds |

---

## 6. Owner Verification & Open Caveats
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST201/index.html`, `subjects/CST201/units/unit-{1..5}.html`, `suggestions/c/easy-read.html`, `revision/CST201.html`, `pyq/viewer.html` (spot-checking `.unit-topic-link` jumps from 2023–2026 C papers), and `subjects/CST211/index.html`.
- **Part 12.4 caveats:**
  1. **Word metric is mine, not the blueprint's.** The blueprint's `6,749w` baseline is reproduced in-file by the tag-strip/prose metric in `/tmp/wc.py`; a plain tag-strip gives `6,831w`. Unit 4 now reports **7,195w** on the calibrated metric (and `9,190w` with `<pre>`/table text included). The budget verdict holds only against the calibrated metric — the recipe is documented in `record.md` so it is auditable.
  2. **Two blueprint anchor names differ slightly.** The blueprint asked for `#storage-classes-and-parameter-passing` (created, heading *Parameter Passing and Storage Classes*) and `#prime-numbers-using-functions` (created, heading *Finding Primes in an Interval Using Functions*). Both resolve in the routing sim.
  3. **`unitAnchored` lock moved `539 → 548`** in `tests/test_discovery.py`, matching the 9 new `<h3 id>` anchors.
  4. **`P006-Q6` remains a cross-unit collision** (see §4) and needs an owner decision if part 12.4 is expected to close it.
- **Part 12.6 caveats:**
  1. **Mode B was used, and the phase brief said Mode A.** The 12.6 checklist literally reads "in Mode A (`0` `_data/` edits)". That could not close the four remaining misses: they were wrong *data*, not wrong discovery, so the owner was asked and authorised Mode B on 2026-11-18 with the constraint **"Don't break anything"**. B and C were then approved together. Nothing was force-pushed, `reset --hard`-ed, or re-frozen without the diff being shown.
  2. **The C1/C2 split was the owner's delegated call.** Whole-question re-tagging (C1) was done because it is reversible, field-scoped and provable; per-subpart `subparts[].unit` (C2) was deferred because it needs a new field plus pipeline, viewer and re-baseline work. **No whole-question re-tag can ever reproduce the blueprint's per-subpart mark totals**, and the residual is exactly the six 8-mark composites — so C2 is a real requirement for *those* numbers, not a nicety.
  3. **`44` questions re-tagged, not `43`.** An earlier draft of the policy text said 43; the authoritative field-by-field diff against `sourceCommit` says 44, and the integrity file now records all 44 `{from, to}` moves individually so the count is checkable rather than asserted.
  4. **Quiz question ids no longer match their bank.** `CST201-U4-Q001` lives in `unit-3.json` after the swap. This is deliberate and safe (`q.unit` wins; the id is only a fallback, and content moved with its id so attempt history still resolves), but it *is* cosmetic debt — the ids read as the old unit to anyone inspecting `_quiz-data` by hand.
  5. **Two things looked like regressions and were not.** `test_content_depth.test_coverage_file_is_reproducible` failed only when `build_coverage.py` and `generate_presence.py` were run *alternately*; under the documented order (`build`, `build`, `presence`, `presence`) the tree is byte-stable. And `data-version.json` "staleness" was my own ordering mistake — it must be the last script, because it hashes everything else.
  6. **`17` anchors changed by the tie-break, beyond the five named.** All were checked to exist in their unit page and all are more specific than the generic `#overview` they replaced; no same-unit/redirect/unmatched total moved.
- **Part 12.5 caveats:**
  1. **The word metric changed, and every number in this file changed with it.** The `/tmp/wc.py` script from parts 12.1–12.3 did not survive between sessions and is not recoverable. It turned out to anchor a *constant recorded baseline* and report only a measured delta, so its absolute output can never be reproduced. §1 below re-derives a single, documented recipe (drop `<style>`/`<script>`/comments, strip tags, unescape entities, count tokens containing a letter or digit) and uses it for every unit from here on. Under it the pristine pages measure `5,418→4,882`, `5,406→4,957`, `5,848→5,149`, `6,749→6,086`, `7,558→6,732` against the old anchors. **The blueprint's budget is therefore applied as a relative cut**, which is metric-independent.
  2. **Unit 5 shipped at `5,572w` = `−1,160w` (`−17.2%`), not the `26–34%` the blueprint's band implies.** The page really was over-weighted (`6732w`, the longest C unit, for `12.9%` of marks) and it is now the second-shortest, so the right-sizing *intent* is met. Reaching `≈5,100w` would have cost either the `#dma` comparisons the paper asks for by name or the two new SVGs. Following the Unit 2 precedent, depth was kept and the miss is recorded here rather than concealed.
  3. **Four sections were consolidated, not deleted.** `#types` and `#arithmetic` still exist as `<section id>`s but are now short bridging sections that cross-link the new anchors `#understanding-pointers-and-addresses` and `#pointers-type-checking-and-evaluation`, where the material actually lives. All `21` shipped section ids and all `6` `overview-*` `h3` ids survive.
  4. **`#comparisons` became a signpost.** All four of its tables (the `&`/`*` table, array-name-vs-pointer, `char str[]` vs `char *`, stack-vs-heap) were already printed verbatim in the sections they explain, so the bank now links to each one instead of repeating it. That is the single largest saving in the pass and loses no content.
  5. **Two token violations were caught and fixed.** The first draft of the scoped `.unit-figure` CSS used raw `rgba(120,130,150,.35)` fallbacks; `check_tokens.py --strict` flagged both. The block now copies Unit 1's canonical token-only version (`--bg-secondary`, `--border-color`, `--card-radius`, `--text-secondary`, `--text-tertiary`) exactly.
  6. **The `unitAnchored` lock was refreshed `548 → 580` in this part**, not deferred to 12.6 as 12.1–12.3 intended. The deferral had left `test_discovery` red for three parts, which makes every later gate run ambiguous; doing it now means the suite is green (bar the shallow-clone error) and 12.6 inherits a trustworthy baseline. Unit 5 contributed `7` new `<h3 id>`s and retired `2` with the consolidation, for a net `+8` over the `572` measured after 12.3.
  7. **Two programme outputs were wrong on the first draft and were caught by re-running them**, not by reading them: a polymorphic `printf` in `#array-of-ptrs` claimed `(3)` row lengths for three strings of different lengths (`sizeof days[0]` is the *pointer* size, not the string length), and `#ptr-to-ptr` never printed a `struct` size the text then described. Both were rewritten against real compiler output. A third programme in `#intro` had genuine undefined behaviour (`*q++` and `*q` in one `printf` call); the increments were split across statements before it shipped.
- **Part 12.3 caveats:**
  1. **This was a rebalance, not a growth pass.** Unit 3 entered at `5,848w`, already inside its `5,400–6,000` band, so the four new anchors had to be paid for by cutting legacy material. Dropped: the 1D bubble sort, the "input / display / max-min" demo, matrix addition, matrix multiplication, the four `<string.h>` "Application 1–4" programs, four of the twelve MCQs and the duplicated half of the 32-bullet revision list. Nothing the blueprint lists as a pitfall or a table was removed.
  2. **Five verified YouTube links, not three.** `LFPoPHBiWCE` (Jenny's, `strcat` with and without the library) covers the exact no-library programme the blueprint asks for, and `GtcRReso9Xk` + `J1aQ9JN4vZY` (Neso, initialisation and 2D arrays) were oEmbed-verified during this part, so both were added. All five are plain `<a target="_blank" rel="noopener noreferrer">`.
  3. **Two inline SVGs, both new, both `role="img"` + `aria-label` + `currentColor`.** The row-major figure deliberately shows the *same nine cells* twice — as a matrix with both diagonals drawn, and as the flattened row-major strip — because that identity is what the address formula means. The `"CODE\0"` figure carries the `strlen = 4` / `sizeof = 5` split as a labelled strip rather than as text.
  4. **`#multidim` was left alone at `147w`.** It already sits inside the blueprint's ~4% allocation, so no edit was justified.
  5. **`unitAnchored` will move `548 → 572`** (11 from Unit 2, 9 from Unit 1, 4 from Unit 3). Still deferred to the single refresh after 12.5, per the 12.2 decision; `test_discovery` therefore reports `572 != 548` until then.
  6. **Same two environment-only failures** as 12.4 / 12.2 / 12.1 (`test_data_pipeline` shallow clone, `node tests/section-notes.cjs` fixture). Also unchanged: `validate_data.py --check-baseline` reports the recorded U3↔U4 unit-order source-review error for `_quiz-data/CST201/unit-4.json` — a tracked baseline exception, not a regression.
- **Part 12.2 caveats:**
  1. **Word budget overrun, owner-approved.** Unit 2 ships at **`7,532w`** on the calibrated metric (a plain tag-strip including `<pre>`/table text gives `7,633`) against the `6,200–6,800` band. Asked to choose, the owner picked "accept as a documented overrun" rather than trimming the Tier A depth the blueprint asks for — the same treatment as Unit 4 (`7,195`). The `#formulas`, `#definitions`, `#comparisons` and `#revision` banks were cut first (`592w → 133 / 243 / 187 / 243`) to keep the overrun at `+732` instead of `+1,613`.
  2. **Five `overview-*` `<h3 id>`s had to be re-created, not preserved.** The blueprint listed `overview-decision-making`, `overview-switch-case`, `overview-goto-statement`, `overview-loops` and `overview-jump-statements` as "existing"; none were in the shipped page (only the 5 `overview-*` anchors belong to Unit 1's `#overview` section — the U2 page only ever had section ids). Re-created as real `<h3 id>` headings inside their sections, as the owner directed.
  3. **`#videos` is new** (`15` sections shipped vs `14` listed), matching the Unit 4 precedent; `guides.json` still has exactly 2 reading entries (`#loops`, `#jump`), both intact.
  4. **`unitAnchored` lock will move `548 → 559`** (11 new `<h3 id>` anchors: the 5 re-created `overview-*` ones plus the 6 Mode A anchors). **Deliberately not updated here** — parts 12.1, 12.3 and 12.5 add ~17 more anchors, so the lock is refreshed once, after 12.5, as planned.
  5. **Two fixed-recipe metric artefacts worth knowing:** a `<h4>` in the overview cards created a heading-order jump (`h2→h4`) that `audit_accessibility.py --fail` caught; the cards now use `h3` with a `.loop-card-title` class so the visual hierarchy is unchanged. And a duplicated `<!-- LOOPS -->` assembly comment was removed from the `#goto` part.
  6. **Same environment-only test failures as 12.4:** `test_data_pipeline.test_no_semantic_or_answer_changes` (shallow clone, no `664674b`) and `node tests/section-notes.cjs` (synthetic `MiniNode` fixture). Both predate this part and are untouched.
- **Part 12.1 caveats:**
  1. **Nine anchors, not eight.** The blueprint's §4 header listed 8 Mode A headings but its own §8 routing table needs `#implicit-and-explicit-conversions` for `P004-Q11`, so that one was created too — the totals match the routing table, which is the thing students feel.
  2. **Unit 1 hit the band (`6,389w`) by trimming, not by thinning rules.** The first draft overshot at `6,996w` with inverted proportions (`#history` 25%, `#operators` 28%); the prose was re-cut so `#operators` now carries the largest share of concept prose and every pitfall the blueprint lists — `%` integer-only, truncation, `=`/`==`, short-circuit order, maximal munch, unsequenced UB, comma precedence — survives in a box or table.
  3. **The shipped page's `#videos` section contained three `youtube.com/results?search_query=…` links**, not videos. Those were replaced with three oEmbed-verified video IDs; the remaining search links are in Unit 3 and Unit 5 and belong to parts 12.3 / 12.5.
  4. **Only one inline SVG was authored** (`#compilation-process`). The blueprint's §5 checklist asks for one; Unit 1's other gaps are tables, not diagrams.
  5. **`unitAnchored` will now move `548 → 568`** (11 from Unit 2, 9 from Unit 1). Still deferred to the single update after 12.5.
  6. **Same two environment-only failures** as 12.4 and 12.2 (`test_data_pipeline` shallow clone, `node tests/section-notes.cjs` fixture).
- **Owner decisions (`rule.md` §4.7):**
  - **12.4 (Unit 4):** accepted — word overrun (`7,195w`) acknowledged, not re-cut.
  - **12.2 (Unit 2):** accepted — word overrun (`7,532w`) acknowledged as a documented overrun; the `_data/` U3↔U4 unit-order exception stays in Mode A.
  - **12.1 (Unit 1):** accepted.
  - **12.3 (Unit 3):** accepted.
  - **12.5 (Unit 5):** **passed by the owner on 2026-11-18** after a Termux local-browser check of the branch — the `−17.2%` right-sizing was accepted **without** requiring the full `26–34%` cut, so `5,572w` stands as the final Unit 5 figure. The `P005-Q11` anchor fix and the two inline SVGs were confirmed rendering.
  - **12.6 (the phase gate):** **submitted for sign-off 2026-11-18.** Two decisions were taken with owner authorisation rather than on my own judgement: (a) **Mode B** was used, overriding the brief's "Mode A" wording, because the residual misses were wrong data; (b) the **C1-vs-C2** choice was explicitly delegated ("do what will be best") and C1 was chosen with C2 recorded as scoped follow-up. Both are disclosed above rather than presented as the original plan.
  - **Phase 12 as a whole:** _awaiting the 12.6 verdict_ — every gate above is green, and the only remaining work is owner-side device verification.
- **Standing caveats:** Real-device browser check remains owner-side via Termux; PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md` (`0/924` certified — a scan check is not a certification). The legacy U3↔U4 tag order in `_data/CST201/` and `_quiz-data/CST201/` is **no longer open**: Mode B was authorised and both were corrected on 2026-11-18 (§4.1, §4.2). What remains open in `docs/data/validation-exceptions.json` is the pre-existing out-of-syllabus unit-5 content for `CST205` and `CST209`, untouched by this phase.
