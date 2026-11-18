# Phase 13 Record — Scripting Languages (Python)

- **Status:** 📋 Planned — not yet executed (blueprint calibrated 2026-11-18 to strict **2023–2026** PYQ weights: `P003–P006`, `4` papers, `104` Qs, `387` printed set marks; `P001-2022-06` excluded).
- **Syllabus authority:** `CST203` (`2` credits, L–T–P `2-0-0`, `30h = 7+5+6+6+6`, PDF pp. 5–7); paired lab `CST213` (`2` credits, `0-0-4`, 8 practical areas, PDF pp. 16–18).
- **Syllabus-boundary verification:** `pandas` (`0m`), `scipy` (`0m`), `matplotlib` (`0m`), `threading` (`0m`), and OOP chapters (`0m`) excluded; `lambda`/recursion (`15m`), `numpy` (`3m`), `set` (`2m`), and `Django vs Flask` (`2m`) isolated in badged **Tier E** callouts.
- **Shipped files modified during planning:** `0` (nothing committed, pushed, PR'd, merged, or deployed).

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js`.
- **ADAPT:** `assets/js/unit-discovery.js` `focusQuestionTopic()` heading match via newly authored `<h3 id>` anchors across Units 1–5; `docs/revision-sheets/CST203.json`.
- **BUILD:** `python3`-verified code blocks, output traces, inline token-safe SVGs, and 28 semantic `<h3 id>` subheadings inside `subjects/CST203/units/unit-{1..5}.html`.
- **REJECT:** `<iframe>` embeds, `i.ytimg.com` thumbnails, hardcoded colours, and unexamined `pandas`/`scipy`/`matplotlib`/OOP/threading bloat.

---

## 2. Per-Unit Calibration & Verification Ledger (fill at execution)

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | `<h3 id>`s Added | Locked `guides.json` Anchors | `<section id>` Count | `python3` Check |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `152m` (39.3%) | 5,304w | ~7,200–8,000w | _TBD_ | _TBD_ (plan: 9) | `#collections`, `#strings` | 14 / 14 | _TBD_ |
| Unit 2 | `64m` (16.5%) | 2,912w | ~4,600–5,200w | _TBD_ | _TBD_ (plan: 5) | `#loops`, `#loop-control` | 12 / 12 | _TBD_ |
| Unit 3 | `92m` (23.8%) | 4,340w | ~5,800–6,400w | _TBD_ | _TBD_ (plan: 6) | `#parameters`, `#modules` | 14 / 14 | _TBD_ |
| Unit 4 | `49m` (12.7%) | 4,805w | ~4,800–5,300w | _TBD_ | _TBD_ (plan: 4) | `#fileio`, `#regex` | 12 / 12 | _TBD_ |
| Unit 5 | `30m` (7.8%) | 5,657w | ~3,800–4,300w | _TBD_ | _TBD_ (plan: 4) | `#mvc`, `#urls-templates` | 13 / 13 | _TBD_ (`ast.parse`) |
| **Total** | **`387m` (100%)** | **23,018w** | **~26.2–29.2kw** | _TBD_ | _TBD_ (plan: 28) | **10 / 10 preserved** | **65 / 65** | _TBD_ |

---

## 3. Live-Verified YouTube Curation Log (14 slots, plain `<a>` only)

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Duration | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| U1–U5 | 1–14 | _Populate at execution after live verification_ | — | — | — | _No URLs stored before live check_ | — | _TBD_ |

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`104` Questions)

- **Sync mode used:** Mode A (`_data/CST203/*.json` untouched) / Mode B (owner approval date: _N/A_)
- **Baseline (`f52d2f6`):** `42` same-unit (`40.4%`) · `7` redirect (`6.7%`) · **`55` unmatched (`52.9%`)** · `0` out-of-unit
- **Post-Phase-13 result:** _TBD_ same-unit · _TBD_ accurate redirect · `0` unmatched

---

## 5. Quality-Gate & Rebuild Evidence (fill at execution)

| Check / Command | Expected | Result |
| :--- | :--- | :---: |
| `python3 scripts/check_pyq_integrity.py` | `0` changed/added/missing | _TBD_ |
| `python3 scripts/build_suggestions.py --check` | `11` static pages verified | _TBD_ |
| `python3 scripts/check_site.py --strict --quiet` | `0` errors, `0` warnings | _TBD_ |
| `python3 scripts/validate_pyq.py` & `validate_data.py --check-baseline` | PASS / matches baseline | _TBD_ |
| `python3 scripts/audit_accessibility.py --fail` & `check_tokens.py --strict` | `0` findings | _TBD_ |
| `python3 scripts/audit_page_weight.py --budget` | `84/84` within budget | _TBD_ |
| `python3 scripts/build_icon_subset.py --check` & `build_data_version.py --check` | current | _TBD_ |
| `python3 -m unittest discover -s tests` & `node tests/discovery-dom.cjs` | all pass | _TBD_ |

---

## 6. Owner Verification & Open Caveats
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST203/index.html`, `subjects/CST203/units/unit-{1..5}.html`, `suggestions/python/easy-read.html`, `revision/CST203.html`, `pyq/viewer.html` (spot-checking 2023–2026 Python `.unit-topic-link` jumps), and `subjects/CST213/index.html`.
- **Owner decision (`rule.md` §4.7):** _Pending execution (`mark as pass` / `add for later`)._
- **Standing caveats:** Physical-device check stays owner-side via Termux; PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`.
