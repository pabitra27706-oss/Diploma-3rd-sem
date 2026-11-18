# Phase 14 Record — Data Structures

- **Status:** 📋 Planned — not yet executed (blueprint calibrated 2026-11-18 to strict **2023–2026** PYQ weights: `P003–P006`, `4` papers, `106` Qs, `403` printed set marks; `2021–2022` `P001`/`P002` excluded).
- **Syllabus authority:** `CST205` (`3` credits, L–T–P `2-1-0`, `45h = 3+12+15+15` across **4 official units**, PDF p. 7); paired lab `CST215` (`2` credits, `0-0-4`, `60h`, 9 practical areas, PDF p. 19).
- **Shipped files modified during planning:** `0` (nothing committed, pushed, PR'd, merged, or deployed).

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js` (`SYLLABUS_UNITS.CST205 = 4`).
- **ADAPT:** Existing 81 `<h3 id>` anchors across Units 1–4 + `13` targeted additions for 100% Mode A PYQ routing; `docs/revision-sheets/CST205.json`.
- **BUILD:** Inline token-styled SVGs (queues, linked lists, polynomials, `C_4=14` trees, AVL rotations, B-tree split, `K_5`/BFS/DFS), `gcc -std=c99` C programs, and step-by-step trace tables.
- **REJECT:** `<iframe>` embeds, `i.ytimg.com` thumbnails, hardcoded colour literals, and unexamined sorting/MST/Huffman/sparse-matrix tutorials.

---

## 2. Per-Unit Calibration & Verification Ledger (fill at execution)

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | SVGs | Locked `guides.json` Anchors | Existing `<h3 id>`s | `gcc` & Trace Check |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `40m` (9.9%) | 3,485w | ~3,400–3,900w | _TBD_ | _TBD_ | `#classification`, `#terminology-5-abstract-data-type-adt` | 17 / 17 | _TBD_ |
| Unit 2 | `143m` (35.5%) | 6,239w | ~7,400–8,200w | _TBD_ | _TBD_ | `#stacks-operations-on-stack`, `#queues-types-of-queues` | 16 / 16 | _TBD_ |
| Unit 3 | `75m` (18.6%) | 7,858w | ~6,400–7,000w | _TBD_ | _TBD_ | `#singly-insertion-operations`, `#comparisons-all-four-types-of-linked-lists` | 24 / 24 | _TBD_ |
| Unit 4 | `145m` (36.0%) | 9,069w | ~8,200–9,000w | _TBD_ | _TBD_ | `#traversals`, `#graph-traversals` | 24 / 24 | _TBD_ |
| **Total** | **`403m` (100%)** | **26,651w** | **~25.4–28.1kw** | _TBD_ | _TBD_ | **8 / 8 preserved** | **81 / 81** | _TBD_ |

---

## 3. Live-Verified YouTube Curation Log (13 slots, plain `<a>` only)

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Duration | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| U1–U4 | 1–13 | _Populate at execution after live verification_ | — | — | — | _No URLs stored before live check_ | — | _TBD_ |

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`106` Questions)

- **Sync mode used:** Mode A (`_data/CST205/*.json` untouched) / Mode B (owner approval date: _N/A_)
- **Baseline (`f52d2f6`):** `40` same-unit (`37.7%`) · `55` redirect (`51.9%`, incl. wrong-unit `P005-Q12 → U2`) · `11` unmatched (`10.4%`) · `0` out-of-unit
- **Post-Phase-14 result:** _TBD_ same-unit · _TBD_ exact syllabus redirect · `0` unmatched · `0` wrong-unit collisions

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
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST205/index.html`, `subjects/CST205/units/unit-{1..4}.html`, `suggestions/data-structures/easy-read.html`, `revision/CST205.html`, `pyq/viewer.html` (spot-checking 2023–2026 DS `.unit-topic-link` redirects), and `subjects/CST215/index.html`.
- **Owner decision (`rule.md` §4.7):** _Pending execution (`mark as pass` / `add for later`)._
- **Standing caveats:** Physical-device check stays owner-side via Termux; PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`; stored U1/U2/U3 unit shift in `_data/CST205/` remains untouched in Mode A unless Mode B is requested.
