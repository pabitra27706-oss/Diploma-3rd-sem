# Phase 12 Record — Computer Programming in C

- **Status:** 🚧 In progress — part **12.4 (Unit 4)** executed; parts `12.1`, `12.2`, `12.3`, `12.5`, `12.6` outstanding. Blueprint calibrated 2026-11-18 to strict **2023–2026** PYQ weights: `P003–P006`, `4` papers, `105` Qs, `395` printed set marks; `2021–2022` `P001`/`P002` excluded.
- **Syllabus authority:** `CST201` (`2` credits, L–T–P `2-0-0`, `30h = 5+5+7+7+6`, PDF p. 3); paired lab `CST211` (`2` credits, `0-0-2`, `30h`, PDF p. 14).
- **Shipped files modified so far:** `subjects/CST201/units/unit-4.html` plus the regenerated `assets/search/*`, `assets/data/{coverage,data-version}.json`, `assets/vendor/fontawesome/*`, `coverage.html`, and the `unitAnchored` lock in `tests/test_discovery.py`. `_data/` and `_quiz-data/` untouched (Mode A).
- **Commit / PR / deploy state:** Committed to `arena/08838a66-diploma-3rd-sem`; not merged or deployed.

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js` (shared unit layout, collapsible sections, notes keys, CSS custom properties).
- **ADAPT:** `assets/js/unit-discovery.js` (`focusQuestionTopic()` heading-token match + generic-section exclusion if not applied in an earlier content phase); `docs/revision-sheets/CST201.json` (anchor check).
- **BUILD:** Subject-specific C programs (`gcc -std=c99` verified), inline accessible SVGs, dry-run tables, and semantic `<h3 id>` anchors inside `subjects/CST201/units/unit-{1..5}.html`.
- **REJECT:** `<iframe>` YouTube embeds, `i.ytimg.com` thumbnails, hardcoded hex/rgba colours, new CSS/JS bundles, and out-of-syllabus `argc`/`argv` or `fopen` content.

---

## 2. Per-Unit Calibration & Verification Ledger (fill at execution)

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | SVGs | Locked `guides.json` Anchors | `<section id>` Count | `gcc -std=c99 -Wall` |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `86m` (21.8%) | 5,418w | ~5,800–6,400w | _TBD_ | _TBD_ | `#operators`, `#typecasting` | 14 / 14 | _TBD_ |
| Unit 2 | `95m` (24.1%) | 5,406w | ~6,200–6,800w | _TBD_ | _TBD_ | `#loops`, `#jump` | 14 / 14 | _TBD_ |
| Unit 3 | `66m` (16.7%) | 5,848w | ~5,400–6,000w | _TBD_ | _TBD_ | `#2d-arrays`, `#strings` | 15 / 15 | _TBD_ |
| Unit 4 | `97m` (24.6%) | 6,749w | ~6,500–7,200w | **7,195w** | **2** | `#parameters`, `#recursion` ✅ | 16 / 16 ✅ | **16/16 programs clean** |
| Unit 5 | `51m` (12.9%) | 7,558w | ~5,000–5,600w | _TBD_ | _TBD_ | `#declaration`, `#dma` | 20 / 20 | _TBD_ |
| **Total** | **`395m` (100%)** | **30,979w** | **~28.9–32.0kw** | _TBD_ | _TBD_ | **10 / 10 preserved** | **78 / 78** | _TBD_ |

---

## 3. Live-Verified YouTube Curation Log (16 slots, plain `<a>` only)

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Duration | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| U4 | 1 | Storage classes (`auto`/`static`/`extern`/`register`) | Tier A · `35m` | `#scope` | Success GATEway — Storage Classes in C, part 1 | `https://www.youtube.com/watch?v=3gaSYmYpcjo` | n/a | 2026-11-18 |
| U4 | 2 | Introduction to functions | Tier A · `29m` | `#functions-intro` | Neso Academy — Introduction to Functions in C | `https://www.youtube.com/watch?v=3lqgdqoY83o` | n/a | 2026-11-18 |
| U4 | 3 | Recursion + worked program | Tier A · `19m` | `#recursion` | Neso Academy — Recursion in C | `https://www.youtube.com/watch?v=kepBmgvWNDw` | n/a | 2026-11-18 |
| U4 | 4 | Call by value vs call by reference | Tier B · `14m` | `#parameters` | Neso Academy — Call by Value and Call by Reference | `https://www.youtube.com/watch?v=HEiPxjVR8CU` | n/a | 2026-11-18 |
| U1–U3, U5 | 5–16 | _Outstanding — populate after live verification_ | — | — | — | _No URLs stored before live check_ | — | _TBD_ |

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`105` Questions)

- **Sync mode used:** Mode A (`_data/CST201/*.json` untouched) / Mode B (owner approval date: _N/A_)
- **Baseline (`f52d2f6`):** `46` same-unit (`43.8%`) · `29` redirect (`27.6%`, incl. 5 wrong-unit collisions) · `30` unmatched (`28.6%`) · `0` out-of-unit
- **After Unit 4 (part 12.4 only):** `48` same-unit (`45.7%`) · `35` redirect (`33.3%`) · `22` unmatched (`21.0%`).
- **Fixed by the Unit 4 anchors:** `P004-Q1`, `P004-Q8`, `P004-Q16`, `P003-Q33` now resolve (previously unmatched); `P005-Q15` no longer lands on `U1#fundamentals`; `P003-Q30`, `P006-Q19` land on the parameter-passing heading.
- **Still wrong-unit / unmatched (need U1, U2, U3 anchors):** `P003-Q8` (`Arrays / loops` → `U2#overview-loops`), `P005-Q11` (`Unions / memory` → `U5#dma`), the seven U1 items (`P003-Q7,Q14,Q17,Q22`, `P005-Q2,Q4,Q14`, `P006-Q1,Q3`), and the U2 items (`P003-Q21,Q28`, `P004-Q10,Q23`, `P005-Q17`, `P006-Q8,Q9,Q17`).
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
| `python3 -m unittest discover -s tests` | all pass | ⚠️ `122/123` pass. The one error is `test_data_pipeline.test_no_semantic_or_answer_changes`, which runs `git show 664674b…` — that commit is absent from this shallow clone. **Pre-existing, environment-only, unrelated to this part.** |
| `node tests/*.cjs` (14 files) | all pass | ⚠️ `13/14` pass. `section-notes.cjs` fails when building its *synthetic* fixture: the fixture's `MiniNode` has no `childNodes` and `section-notes.js` iterates it. The same test's real-page phase (`24 unit pages`) prints PASS. **Pre-existing, unmodified files, unrelated to this part.** |

---

## 6. Owner Verification & Open Caveats
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST201/index.html`, `subjects/CST201/units/unit-{1..5}.html`, `suggestions/c/easy-read.html`, `revision/CST201.html`, `pyq/viewer.html` (spot-checking `.unit-topic-link` jumps from 2023–2026 C papers), and `subjects/CST211/index.html`.
- **Part 12.4 caveats:**
  1. **Word metric is mine, not the blueprint's.** The blueprint's `6,749w` baseline is reproduced in-file by the tag-strip/prose metric in `/tmp/wc.py`; a plain tag-strip gives `6,831w`. Unit 4 now reports **7,195w** on the calibrated metric (and `9,190w` with `<pre>`/table text included). The budget verdict holds only against the calibrated metric — the recipe is documented in `record.md` so it is auditable.
  2. **Two blueprint anchor names differ slightly.** The blueprint asked for `#storage-classes-and-parameter-passing` (created, heading *Parameter Passing and Storage Classes*) and `#prime-numbers-using-functions` (created, heading *Finding Primes in an Interval Using Functions*). Both resolve in the routing sim.
  3. **`unitAnchored` lock moved `539 → 548`** in `tests/test_discovery.py`, matching the 9 new `<h3 id>` anchors.
  4. **`P006-Q6` remains a cross-unit collision** (see §4) and needs an owner decision if part 12.4 is expected to close it.
- **Owner decision (`rule.md` §4.7):** _Pending — this is part 12.4 only, not the phase gate._
- **Standing caveats:** Real-device browser check remains owner-side via Termux; PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`; legacy U3↔U4 tag order in `_data/CST201/` and `_quiz-data/CST201/` remains documented in `docs/data/validation-exceptions.json` unless Mode B is requested.
