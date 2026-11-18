# Phase 15 Record — Computer System Organization

- **Status:** 📋 Planned — **Recommended #1 First Phase** (blueprint calibrated 2026-11-18 to strict **2023–2026** PYQ weights: `P003–P006`, `4` papers, `103` Qs, `385` printed set marks; `2021–2022` `P001`/`P002` excluded).
- **Syllabus authority:** `CST207` (`4` credits, L–T–P `3-1-0`, `60h = 6+20+10+9+15` across 5 official units, PDF p. 10; theory-only, PYQ-backed in Quiz & Flashcards).
- **Shipped files modified during planning:** `0` (nothing committed, pushed, PR'd, merged, or deployed).

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js`, `scripts/build_revision_sheets.py`.
- **ADAPT:** `assets/js/unit-discovery.js` (`entriesFor()` excludes generic non-concept sections `overview/mcqs/short-questions/long-questions/practice/revision`); `docs/revision-sheets/CST207.json` (add missing Unit 4 entry).
- **BUILD:** Accessible token-styled architectural SVGs (`13` total), semantic `<pre><code>` RTL & 8086 ALP snippets, Python-verified arithmetic/EAT/LRU-FIFO trace tables, and `25` `<h3 id>` anchors across `subjects/CST207/units/unit-{1..5}.html`.
- **REJECT:** `<iframe>` embeds, `i.ytimg.com` thumbnails, unverified fabricated `_quiz-data/CST207/` bank, hardcoded colour literals, and `6,971w` Unit 4 padding.

---

## 2. Per-Unit Calibration & Verification Ledger (fill at execution)

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | SVGs / `<pre>` | Locked `guides.json` Anchors | `<section id>` Count | Numerical / ALP Check |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `81m` (21.0%) | 4,304w | ~5,800–6,400w | _TBD_ | _TBD_ | `#computer-structure`, `#data-representation` | 15 / 15 | _TBD_ (`-75`, IEEE-754) |
| Unit 2 | `112m` (29.1%) | 6,604w | ~7,600–8,400w | _TBD_ | _TBD_ | `#pipelining`, `#arithmetic` | 13 / 13 | _TBD_ (Booth, Restoring) |
| Unit 3 | `78m` (20.3%) | 6,662w | ~6,400–7,000w | _TBD_ | _TBD_ | `#block-diagram`, `#addressing` | 15 / 15 | _TBD_ (40-pin, EA, 0-addr) |
| Unit 4 | `4m` (1.0%) | 6,971w | ~3,400–3,900w | _TBD_ | _TBD_ | `#simple-programs`, `#branch-call` | 17 / 17 | _TBD_ (8086 ALP + rev U4) |
| Unit 5 | `110m` (28.6%) | 7,687w | ~7,400–8,200w | _TBD_ | _TBD_ | `#cache-memory`, `#virtual-memory` | 14 / 14 | _TBD_ (EAT, LRU/FIFO) |
| **Total** | **`385m` (100%)** | **32,228w** | **~30.6–33.9kw** | _TBD_ | _TBD_ | **10 / 10 preserved** | **74 / 74** | _TBD_ |

---

## 3. Live-Verified YouTube Curation Log (15 slots, plain `<a>` only)

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Duration | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| U1–U5 | 1–15 | _Populate at execution after live verification_ | — | — | — | _No URLs stored before live check_ | — | _TBD_ |

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`103` Questions)

- **Sync mode used:** Mode A (`_data/CST207/*.json` untouched) / Mode B (owner approval date: _N/A_)
- **Baseline (`f52d2f6`):** `17` same-unit (`16.5%`) · `35` redirect (`34.0%`, incl. 6 wrong-unit collisions) · `50` unmatched (`48.5%`) · `1` generic false positive (`P006-Q24 → #short-questions`)
- **Post-Phase-15 result:** _TBD_ same-unit · _TBD_ exact syllabus redirect · `0` generic false positives · `0` wrong-unit collisions (only unlabelled `P006-Q24` `"Short notes"` cleanly falls back to unit overview)

---

## 5. Quality-Gate & Rebuild Evidence (fill at execution)

| Check / Command | Expected | Result |
| :--- | :--- | :---: |
| `python3 scripts/check_pyq_integrity.py` | `0` changed/added/missing | _TBD_ |
| `python3 scripts/build_suggestions.py --check` & `build_revision_sheets.py` | `11` pages verified; CSO rev has U1–U5 | _TBD_ |
| `python3 scripts/check_site.py --strict --quiet` | `0` errors, `0` warnings | _TBD_ |
| `python3 scripts/validate_pyq.py` & `validate_data.py --check-baseline` | PASS / matches baseline | _TBD_ |
| `python3 scripts/audit_accessibility.py --fail` & `check_tokens.py --strict` | `0` findings | _TBD_ |
| `python3 scripts/audit_page_weight.py --budget` | `84/84` within budget | _TBD_ |
| `python3 scripts/build_icon_subset.py --check` & `build_data_version.py --check` | current | _TBD_ |
| `python3 -m unittest discover -s tests` & `node tests/discovery-dom.cjs` | all pass | _TBD_ |

---

## 6. Owner Verification & Open Caveats
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST207/index.html`, `subjects/CST207/units/unit-{1..5}.html`, `suggestions/cso/easy-read.html`, `revision/CST207.html` (verify new Unit 4 entry), and `pyq/viewer.html` (test `.unit-topic-link` on Cache, Von Neumann, Booth, 8086, DMA, and `P006-Q24`).
- **Owner decision (`rule.md` §4.7):** _Pending execution (`mark as pass` / `add for later`)._
- **Standing caveats:** Real-device check stays owner-side via Termux; CSO remains PYQ-backed in Quiz (`validate_syllabus.py` warns `CST207: no quiz bank` as designed); PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`.
