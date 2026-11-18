# Phase 15 Record — Computer System Organization

- **Status:** 🚧 Executed 2026-11-18 on `arena/ad819066-diploma-3rd-sem` (base `f0ce76d`) — all six parts carried out, every gate green, **awaiting owner sign-off** (`rule.md` §4.7). Nothing was committed, pushed, PR'd, merged or deployed by the execution.
- **Syllabus authority:** `CST207` (`4` credits, L–T–P `3-1-0`, `60h = 6+20+10+9+15` across 5 official units, PDF p. 10; theory-only, PYQ-backed in Quiz & Flashcards).
- **Shipped files modified during execution:** `5` unit pages, `1` shared JS module (`assets/js/unit-discovery.js`), `2` test files + `1` test helper, `1` revision source (`docs/revision-sheets/CST207.json`), and the generator output of the canonical rebuild (`assets/data/*`, `assets/cards/*`, `assets/js/*.bundle.js`, `revision/*.html`, `suggestions/*`, `assets/vendor/fontawesome/css/used.min.css`, `assets/data/data-version.json`). `_data/` untouched (Mode A); `_quiz-data/` untouched.

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js`, `scripts/build_revision_sheets.py`.
- **ADAPT:** `assets/js/unit-discovery.js` (`entriesFor()` now excludes the generic non-concept sections `overview/mcqs/short-questions/long-questions/practice/revision` and returns `sectionId`; `scoreTitle()` gained a crude plural/participle stemmer so archived topics like `"Buses"` and `"Microprogramming"` can match prose headings); `docs/revision-sheets/CST207.json` (added `CST207-d-09` Macro / Unit 4); `scripts/build_revision_sheets.py` (revision pages now carry a `meta description`).
- **BUILD:** Accessible token-styled architectural SVGs (`13` total), semantic `<pre><code>` RTL & 8086 ALP snippets (`20` blocks), Python-verified arithmetic / EAT / FIFO-LRU trace tables, `25` `<h3 id>` anchors and `15` live-verified plain-`<a>` video callouts across `subjects/CST207/units/unit-{1..5}.html`.
- **REJECT:** `<iframe>` embeds, `i.ytimg.com` thumbnails, unverified fabricated `_quiz-data/CST207/` bank, hardcoded colour literals, and the `6,971w` Unit 4 padding.

---

## 2. Per-Unit Calibration & Verification Ledger (measured at execution)

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | SVGs / `<pre>` | Locked `guides.json` Anchors | `<section id>` Count | Numerical / ALP Check |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `81m` (21.0%) | 4,304w | ~5,800–6,400w | **6,081w** ✅ | 3 / 1 | `#computer-structure`, `#data-representation` | 15 / 15 | ✅ `-75 = 10110101₂`; IEEE-754 `-13.625 → C15A0000` / `C02B400000000000` |
| Unit 2 | `112m` (29.1%) | 6,604w | ~7,600–8,400w | **8,561w** ✅ | 4 / 0 | `#pipelining`, `#arithmetic` | 13 / 13 | ✅ Booth `(-9)×(-13) = +117`; restoring `11 ÷ 3 → Q=3, R=2`; pipeline `n=10 → 3.57`, `n=100 → 4.81` |
| Unit 3 | `78m` (20.3%) | 6,662w | ~6,400–7,000w | **7,302w** ✅ | 3 / 1 | `#block-diagram`, `#addressing` | 15 / 15 | ✅ pins `22 MN/MX, 33 CLK, 34 NMI, 35 RESET`; flags `CF0 PF2 AF4 ZF6 SF7 TF8 IF9 DF10 OF11`; `348AH:4214H → 38AB4H`; DS=2000H EAs `25000H/20300H/20308H/20048H/20340H/20350H`; `(A+B)*(C+D)` = 8 zero-address instructions |
| Unit 4 | `4m` (1.0%) | 6,971w | ~3,400–3,900w | **3,669w** ✅ | 0 / 18 | `#simple-programs`, `#branch-call` | 17 / 17 | ✅ 8086 ALP listings (`MOV`/`ADD`/`ADC`, `REP MOVSB`, `REPNE SCASB` trace `20 − 14 − 1 = 5`, bubble-sort pass, `A×B + C×D`, near vs far `CALL`); revision entry `CST207-d-09` added |
| Unit 5 | `110m` (28.6%) | 7,687w | ~7,400–8,200w | **8,365w** ✅ | 3 / 0 | `#cache-memory`, `#virtual-memory` | 14 / 14 | ✅ EAT `h=0.9 → 13.70/14.50 ns`, `h=0.85 → 16.55/17.75 ns`; FIFO `15` / LRU `13` / OPT `9` faults on the 18-reference string; direct-map 32-bit `23/6/3`; 4-way 16-set `25/4/3` |
| **Total** | **`385m` (100%)** | **32,228w** | **~30.6–33.9kw** | **33,978w** ✅ | **13 / 20** | **10 / 10 preserved** | **74 / 74** | ✅ |

Word counting method: strip tags and entities from the `<main>`…`</main>` region, then count alphanumeric tokens. All `25` required `<h3 id>` anchors from the per-unit routing tables are present; every original `<section id>` survives.

---

## 3. Live-Verified YouTube Curation Log (15 slots, plain `<a>` only)

Every URL below was confirmed live on **2026-11-18** through the public oEmbed endpoint (`https://www.youtube.com/oembed?url=…&format=json`), which returns the current title and channel for a public video. No URL is stored before that check; durations are not claimed because oEmbed does not report them.

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: |
| U1 | 1 | Von Neumann architecture & system buses | Tier A `46m` | `#computer-structure` | Gate Smashers — *L-1.2: Von Neumann's Architecture \| Stored Memory Concept* | https://www.youtube.com/watch?v=j8NnE1YeSN0 | 2026-11-18 |
| U1 | 2 | IEEE-754 single & double precision | Tier A `26m` | `#data-representation` | Education 4u — *Floating point representation \| IEEE 754 \| COA \| Lec-06* | https://www.youtube.com/watch?v=9lLpAFapndo | 2026-11-18 |
| U1 | 3 | Logical vs arithmetic vs circular shifts | Tier C `9m` | `#micro-operations` | Sundeep Saradhi Kanthety — *Shift Micro-Operations in Computer Organization* | https://www.youtube.com/watch?v=jp7O_P-w1bA | 2026-11-18 |
| U2 | 1 | Instruction pipeline & the three hazards | Tier A/B `53m` | `#pipelining` | LUCKY Learning — *5.3. Instruction Pipeline and Instruction Pipeline Hazards* | https://www.youtube.com/watch?v=U4xxoldpBFE | 2026-11-18 |
| U2 | 2 | Microprogrammed control & address sequencing | Tier A `24m` | `#microprogrammed` | TECH COURSE — *Lecture 20: Address Sequencing in Microprogrammed Control Unit* | https://www.youtube.com/watch?v=VlqxXXF8eYc | 2026-11-18 |
| U2 | 3 | Booth's signed multiplication | Tier A `20m` | `#arithmetic` | T V Nagaraju Technical — *Booth Multiplication Algorithm \| 2's Complement Multiplication* | https://www.youtube.com/watch?v=bkpUP-uXXMc | 2026-11-18 |
| U2 | 4 | Flynn's classification | Tier B `15m` | `#vector` | kaushal bhardwaj — *Flynn's Taxonomy of computers* | https://www.youtube.com/watch?v=UiwI03ssJYw | 2026-11-18 |
| U3 | 1 | 8086 BIU/EU and the instruction queue | Tier A `39m` | `#block-diagram` | C 4 Yourself — *8086 Microprocessor Explained: BIU vs EU* | https://www.youtube.com/watch?v=_JVhgrE5wuo | 2026-11-18 |
| U3 | 2 | 40-pin package, min vs max mode | Tier A | `#block-diagram` | Engineering Funda — *PIN Diagram of 8086 Microprocessor* | https://www.youtube.com/watch?v=D3S_J-KaJCU | 2026-11-18 |
| U3 | 3 | Addressing modes with effective address | Tier A/C `34m` | `#addressing` | Padharthi Sai Yashwardhan — *EMU 8086 Tutorial 2 \| Addressing Modes of 8086* | https://www.youtube.com/watch?v=PUyVNWJjIyg | 2026-11-18 |
| U4 | 1 | `MOV`/`ADD`/`SUB` in the emulator | Tier C/S `4m` | `#simple-programs` | Technofa — *MOV, ADD, SUB Instruction \| 8086 instruction set with emu 8086* | https://www.youtube.com/watch?v=G1XgRKe0H0Y | 2026-11-18 |
| U5 | 1 | Direct / associative / set-associative mapping | Tier A `51m` | `#cache-memory` | Learn with Maitrik Shah — *Cache Memory Mapping Techniques* | https://www.youtube.com/watch?v=DJnhfcFBNfM | 2026-11-18 |
| U5 | 2 | Write-through vs write-back, dirty bit | Tier A | `#cache-memory` | CS with SANJOY — *Write Policy in cache Memory* | https://www.youtube.com/watch?v=XhfIMjNyMfA | 2026-11-18 |
| U5 | 3 | FIFO page replacement, reference by reference | Tier A `33m` | `#virtual-memory` | Gate Smashers — *L-5.22: Page Replacement Introduction \| FIFO Page Replacement algorithm* | https://www.youtube.com/watch?v=8rcUs5RutX0 | 2026-11-18 |
| U5 | 4 | Memory hierarchy, SRAM vs DRAM | Tier B/E `26m` | `#memory-interfacing` | Guidance Warehouse Official — *The Memory Hierarchy \| SRAM, DRAM, and Storage* | https://www.youtube.com/watch?v=pcq1Emf1ezY | 2026-11-18 |

Rejected during curation (verified live, then dropped as the wrong level or topic): a Class-9 school explainer of Von Neumann architecture, an Arabic-language 8086 architecture lecture, and a Booth video whose ID returned `Not Found` on oEmbed. Two slots stay narrower than their blueprint wording — U2 slot 3 covers Booth but not restoring division, U4 slot 1 covers `MOV`/`ADD`/`SUB` but not directives — and the pages say so in the callout text instead of over-claiming.

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`103` Questions)

- **Sync mode used:** Mode A (`_data/CST207/*.json` untouched, `check_pyq_integrity.py` = `0` drift). No Mode B approval was requested.
- **Baseline (`f52d2f6`):** `17` same-unit (`16.5%`) · `35` redirect (`34.0%`, incl. 6 wrong-unit collisions) · `50` unmatched (`48.5%`) · `1` generic false positive (`P006-Q24 → #short-questions`).
- **Post-Phase-15 result:** **`22` same-unit (`21.4%`) · `80` exact syllabus redirect (`77.7%`) · `102 / 103` resolved · `1` unmatched · `0` generic false positives · `0` wrong-unit collisions.**
  - The single unmatched item is `CST207-P006-Q24`, topic `"Short notes"` — a prompt format, not a topic. It now falls back to the unit overview instead of jumping to `#short-questions`.
  - Two matcher defects were found and fixed while auditing: `entriesFor()` offered generic sections as topic targets, and `scoreTitle()` compared words literally, so archived topics never matched prose (`"Buses"` vs *System Bus*, `"Microprogramming"` vs *Microprogrammed Control*, `"Advanced architecture / cache"` vs *Parallel Architectures*). A plural/participle stemmer and the generic-section filter closed both.
  - Heading prose was aligned with the blueprints where the archive uses the shorter form (U1 *System Bus (Address, Data and Control Buses)…*, U2 *…Parallel Architectures and Advanced Vector Processors*); all `25` anchor ids are unchanged.
  - Sample redirects: `P003-Q2 → U5 #memory-interfacing`, `P003-Q4 → U2 #comparisons`, `P003-Q7 → U5 #cache-memory`, `P003-Q9 → U2 #microprogrammed`, `P003-Q14 ("Buses") → U1 #computer-structure`, `P005-Q22 ("Advanced architecture / cache") → U2 #vector`, `P006-Q22 → U2 #arithmetic`.

---

## 5. Quality-Gate & Rebuild Evidence (run 2026-11-18, after the canonical rebuild)

| Check / Command | Expected | Result |
| :--- | :--- | :---: |
| `python3 scripts/check_pyq_integrity.py` | `0` changed/added/missing | ✅ `0 changed/added/missing files` |
| `python3 scripts/build_suggestions.py --check` & `build_revision_sheets.py` | `11` pages verified; CSO rev has U1–U5 | ✅ `11 static pages verified`; `45 entries (3 formulas) across 5 subjects`, `CST207` now carries U1–U5 incl. `d-09` |
| `python3 scripts/check_site.py --strict --quiet` | `0` errors, `0` warnings | ✅ `0 error(s), 0 warning(s)` |
| `python3 scripts/validate_pyq.py` & `validate_data.py --check-baseline` | PASS / matches baseline | ✅ both exit `0` |
| `python3 scripts/audit_accessibility.py --fail` & `check_tokens.py --strict` | `0` findings | ✅ `total findings: 0`; `findings: 0`, `0` colour literals outside the token file |
| `python3 scripts/audit_page_weight.py --budget` | `84/84` within budget | ✅ every page within 300 KB CSS / 350 KB JS |
| `python3 scripts/build_icon_subset.py --check` & `build_data_version.py --check` | current | ✅ both exit `0`; data version `data-9fc6fbd9b278` over 81 files |
| `python3 -m unittest discover -s tests -p 'test_*.py'` | all pass | ⚠️ `122 / 123` pass; `test_data_pipeline.PipelineTests.test_no_semantic_or_answer_changes` cannot run in this shallow clone (`git show 664674b:_data/…` → `fatal: Not a valid object name`, history depth `1`). Environment limitation, not a regression |
| `node tests/*.cjs` (15 suites) | all pass | ✅ `15 / 15` PASS, including `discovery-dom` §12 |
| `check_platform.py`, `check_root_rewrite.py`, `check_readme_paths.py` | `0` | ✅ all exit `0` |

Canonical rebuild order used (from `README.md`): `build_data_catalog → build_practice_days → build_cards → build_runtime_data → build_coverage → build_revision_sheets → build_verification → build_runtime_bundles → build_icon_subset → build_suggestions → generate_presence` ×2 `→ build_search_index → build_data_version` (last) `→ check_pyq_integrity`.

---

## 6. Owner Verification & Open Caveats
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST207/index.html`, `subjects/CST207/units/unit-{1..5}.html`, `suggestions/cso/easy-read.html`, `revision/CST207.html` (the new Unit 4 `d-09` entry), and `pyq/viewer.html` (test the `.unit-topic-link` on Cache, Von Neumann, Booth, 8086 and DMA questions, plus `P006-Q24` falling back to the unit overview).
- **Owner decision (`rule.md` §4.7):** _Pending (`mark as pass` / `add for later`)._ No physical-device, screen-reader, zoom, print or offline-cache evidence exists for this phase — the gates above are static and unit-test evidence only.
- **Standing caveats:** Real-device check stays owner-side via Termux; CSO remains PYQ-backed in Quiz (`validate_syllabus.py` warns `CST207: no quiz bank` as designed); PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`; the curated videos are third-party links, verified live but not reviewed end-to-end.
