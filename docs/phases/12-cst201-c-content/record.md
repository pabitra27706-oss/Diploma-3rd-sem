# Phase 12 Record — Computer Programming in C

- **Status:** 📋 Planned — not yet executed (blueprint calibrated 2026-11-18 to strict **2023–2026** PYQ weights: `P003–P006`, `4` papers, `105` Qs, `395` printed set marks; `2021–2022` `P001`/`P002` excluded).
- **Syllabus authority:** `CST201` (`2` credits, L–T–P `2-0-0`, `30h = 5+5+7+7+6`, PDF p. 3); paired lab `CST211` (`2` credits, `0-0-2`, `30h`, PDF p. 14).
- **Shipped files modified during planning:** `0` (documentation-only).
- **Commit / PR / deploy state:** Uncommitted planning blueprint; nothing pushed, opened as PR, merged, or deployed.

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
| Unit 4 | `97m` (24.6%) | 6,749w | ~6,500–7,200w | _TBD_ | _TBD_ | `#parameters`, `#recursion` | 15 / 15 | _TBD_ |
| Unit 5 | `51m` (12.9%) | 7,558w | ~5,000–5,600w | _TBD_ | _TBD_ | `#declaration`, `#dma` | 20 / 20 | _TBD_ |
| **Total** | **`395m` (100%)** | **30,979w** | **~28.9–32.0kw** | _TBD_ | _TBD_ | **10 / 10 preserved** | **78 / 78** | _TBD_ |

---

## 3. Live-Verified YouTube Curation Log (16 slots, plain `<a>` only)

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Duration | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| U1–U5 | 1–16 | _Populate at execution after live verification_ | — | — | — | _No URLs stored before live check_ | — | _TBD_ |

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`105` Questions)

- **Sync mode used:** Mode A (`_data/CST201/*.json` untouched) / Mode B (owner approval date: _N/A_)
- **Baseline (`f52d2f6`):** `46` same-unit (`43.8%`) · `29` redirect (`27.6%`, incl. 5 wrong-unit collisions) · `30` unmatched (`28.6%`) · `0` out-of-unit
- **Post-Phase-12 result:** _TBD_ same-unit · _TBD_ accurate syllabus redirect · `0` unmatched · `0` wrong-unit collisions

---

## 5. Quality-Gate & Rebuild Evidence (fill at execution)

| Check / Command | Expected | Result |
| :--- | :--- | :---: |
| `python3 scripts/check_pyq_integrity.py` | `0` changed/added/missing | _TBD_ |
| `python3 scripts/build_suggestions.py --check` | `11` static pages verified | _TBD_ |
| `python3 scripts/check_site.py --strict --quiet` | `0` errors, `0` warnings | _TBD_ |
| `python3 scripts/validate_pyq.py` & `validate_data.py --check-baseline` | PASS / matches baseline | _TBD_ |
| `python3 scripts/audit_accessibility.py --fail` & `check_tokens.py --strict` | `0` findings | _TBD_ |
| `python3 scripts/audit_page_weight.py --budget` | `84/84` within 300 KB CSS / 350 KB JS | _TBD_ |
| `python3 scripts/build_icon_subset.py --check` & `build_data_version.py --check` | current | _TBD_ |
| `python3 -m unittest discover -s tests` & `node tests/discovery-dom.cjs` | all pass | _TBD_ |

---

## 6. Owner Verification & Open Caveats
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST201/index.html`, `subjects/CST201/units/unit-{1..5}.html`, `suggestions/c/easy-read.html`, `revision/CST201.html`, `pyq/viewer.html` (spot-checking `.unit-topic-link` jumps from 2023–2026 C papers), and `subjects/CST211/index.html`.
- **Owner decision (`rule.md` §4.7):** _Pending execution (`mark as pass` / `add for later`)._
- **Standing caveats:** Real-device browser check remains owner-side via Termux; PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`; legacy U3↔U4 tag order in `_data/CST201/` and `_quiz-data/CST201/` remains documented in `docs/data/validation-exceptions.json` unless Mode B is requested.
