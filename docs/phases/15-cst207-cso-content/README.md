# Phase 15 — Computer System Organization: Weight-Calibrated Content, Video Curation & PYQ Sync

> **Status:** ✅* Owner-passed 2026-11-19; all five theory units and six implementation parts complete. The hosted browser-smoke caveat is recorded. See the [execution record](record.md) for actual measurements and verification limits.
> **Subject:** Computer System Organization (`CST207`, theory-only; no separate lab code; PYQ-backed in Quiz & Flashcards)  
> **Syllabus authority:** `docs/syllabus/syllabus.json` & `docs/syllabus/syllabus-3rd-sem-2022.pdf` **p. 10** — **4 credits, L–T–P `3-1-0`, 60 contact hours (`6 + 20 + 10 + 9 + 15`)** across **5 official units**  
> **PYQ weighting window (strict 2023–2026):** **4 papers, 103 scan-verified questions, 385 printed set marks** (`P003-2023-03` [34 Qs / 97m], `P004-2024-01` [23 Qs / 94m], `P005-2024-12` [22 Qs / 92m — 14×2m MCQ + 8×8m], `P006-2026-01` [24 Qs / 102m]; each paper = 60 max answerable marks). Older `2021–2022` papers (`P001-2021-03`, `P002-2022-06` — 2 papers, 92 Qs) remain archived in `_data/CST207/` and are strictly excluded from topic weighting and scope calibration.  
> **Execution order:** **#1 highest-ROI phase** in `15 → 13 → 16 → 14 → 12` (fully independent — may execute in any order).

> **Inherited decisions — read before planning.** `docs/DECISIONS.md`
> §"Phase 13 accepted, and the decisions Phases 14–17 must inherit" records what
> is already settled and must not be re-asked: word budgets are **waived**
> (owner: *"No problem over budget"*), calibrate to the 2023–2026 window only,
> an anchor plan is a planning number rather than a target, maps live in
> `assets/data/` and never `_data/<subject>/`, `_data/`/`_quiz-data/` are
> byte-frozen in Mode A, videos are verified plain `<a>` links, and there are
> seven repeating defects (prose hygiene, vacuous routing criteria, layout bugs
> invisible to tests, …) with how to prevent each. Phase 13 closed at 157/157
> unittest and 13/13 gates; use its `record.md` as the pattern.

---

## 1. Planning Baseline & Why Phase 15 Was Prioritised (2023–2026 Evidence)

Historical blueprint snapshots below are superseded by the measured [execution ledger](record.md).

CSO carries **both** the sharpest exam-weight distortion **and** the worst PYQ topic-link accuracy (**`17 / 103 = 16.5%` same-unit hits**) in the entire repository: **99.0% (`381 / 385m`)** of all 2023–2026 marks sit in Units 1, 2, 3, and 5 while **Unit 4 (Assembly Language Programming) received just `4m = 1.0%` (two 2m MCQs, zero 8m questions)** — yet Unit 4 is currently the #2 longest CSO page (`6,971w`), and all five CSO pages ship **`0` `<pre>` blocks, `0` `<svg>` diagrams, and `0` `<h3 id>` headings**:

| Unit | Official Title (`syllabus.json`, p. 10) | Hrs | Stored PYQ Tag (Q / m)* | True 2023–2026 Weight† | Share | Avg / Paper | MCQ + Long | Papers | Current Words → Target | Unit Blueprint |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Unit 1** | Structure of Computers | 6h | 12 Q / 40m | **81m** | **21.0%** | 20.2m | 29m + 52m | 4/4 | 4,304w → ~5,800–6,400w | [`unit-1/README.md`](unit-1/README.md) |
| **Unit 2** | Micro Programmed Control, Arithmetic & Pipelining | 20h | 33 Q / 93m | **112m** | **29.1%** | 28.0m | 23m + 89m | 4/4 | 6,604w → ~7,600–8,400w | [`unit-2/README.md`](unit-2/README.md) |
| **Unit 3** | CPU Architecture (8086 & Instruction Formats) | 10h | 30 Q / 113m | **78m** | **20.3%** | 19.5m | 16m + 62m | 4/4 | 6,662w → ~6,400–7,000w | [`unit-3/README.md`](unit-3/README.md) |
| **Unit 4** | Assembly Language Programming | 9h | 24 Q / 121m* | **4m** | **1.0%** | 1.0m | 4m + 0m | 2/4 | 6,971w → ~3,400–3,900w | [`unit-4/README.md`](unit-4/README.md) |
| **Unit 5** | Memory and Digital Interfacing | 15h | 4 Q / 18m* | **110m** | **28.6%** | 27.5m | 41m + 69m | 4/4 | 7,687w → ~7,400–8,200w | [`unit-5/README.md`](unit-5/README.md) |
| **Total** | **5 Official Units** | **60h** | **103 Q / 385m** | **385m** | **100.0%** | **96.2m** | **113m + 272m** | **4/4** | **32,228w → ~30.6–33.9kw** | **5 unit folders** |

*\*Stored-unit skew & routing baseline (`103` Qs):* `_data/CST207/` placed Cache/VM in `unit: 3`, Pipelining/RISC/Flynn in `unit: 4`, and 8086 across `unit: 2/4/5`:
- **17 same-unit hits (`16.5%`)**
- **1 generic-section false positive (`1.0%`):** `P006-Q24` (`"Short notes"`) hijacked by `#short-questions`
- **35 cross-unit redirects (`34.0%`)** — including wrong-unit collisions `P004-Q9,Q14` & `P006-Q2` (`Memory hierarchy` → `U3#segmentation`), `P003-Q9` (`Control unit` → `U1#alu`), `P006-Q6` (`Status register` → `U1#register-transfer`), `P006-Q10` (`Instruction decoding` → `U3#instructions`), and `P004-Q5` (`Assembly` → `U1#data-representation`)
- **50 unmatched questions (`48.5%`)** — including guaranteed every-year topics (`Von Neumann`, `Buses`, `IEEE-754`, `Booth multiplication`, `RISC / CISC`, `Page replacement`, `I/O / DMA`)

*†Choice-pool pro-rating rule:* Four short-note choice pools (`P003-Q33` 8m [any 2 of TLB, DMA, VM], `P004-Q20b` 4m [any 1 of DMA, VM], `P005-Q22` 8m [any 2 of Vector Processor, RISC Pipeline, Cache hit/miss], `P006-Q24` 8m [any 2 of Flynn, RISC pipelining, Memory hierarchy, TLB]) are pro-rated across their listed choices so unit and topic totals reconcile strictly to `385 / 385m`.

### Key 2023–2026 Calibration Findings
1. **Unit 2 (`112m = 29.1%`) + Unit 5 (`110m = 28.6%`) = 57.7% of every CSO exam:** Cache memory alone carries **`51m` (`13.2%`, 4/4 papers)**, Pipelining + RISC pipeline + hazards carries **`37m` (`9.6%`, 4/4 papers)**, and Virtual Memory + Paging + TLB + LRU/FIFO carries **`33m` (`8.6%`, 4/4 papers)**.
2. **Unit 1 (`81m = 21.0%`, `13.5m/h`) + Unit 3 (`78m = 20.3%`) = 41.3% of near-100% repeat questions:** Von Neumann + buses (`39m`, 4/4), Fixed vs Floating + IEEE-754 + 2's complement (`26m`, 4/4), 8086 BIU/EU + 40-pin diagram + Min/Max modes (`39m`, 4/4), and 8086 addressing modes (`27m`, 4/4).
3. **Flip Unit 5's upside-down internal allocation:** Today `#address-decoding` (`431w`) + `#memory-interfacing` (`537w`) + `#ppi-8255` (`495w`) spend `1,463w` on **`0m`** of unexamined interfacing topics, while `#cache-memory` (`547w`) + `#virtual-memory` (`519w`) spend only `1,066w` on **`84m`** (and Memory Hierarchy `16m` + DMA `10m` lack dedicated blocks). Condense the three `0m` hardware sections to crisp **Tier S** summaries (~200w each) and expand Cache EAT, 3-way mapping, write-through/back, paging math, TLB, 18-step LRU/FIFO, memory hierarchy, and badged **Tier E DMA**.
4. **Right-size Unit 4 ALP (`6,971w → ~3,400–3,900w`) & fix semantic `<pre><code>` + revision sheet:** Convert unsemantic assembly blocks into clean indented `<pre><code>` snippets, retain all 8 concept `<section id>`s + `#simple-programs`/`#branch-call` locks, highlight `MOV`/`ADD` rules (`P004-Q5`, `P005-Q3`), and add the missing Unit 4 entry in `docs/revision-sheets/CST207.json` (currently `U1:3, U2:1, U3:2, U4:0, U5:2`).
5. **Recommended intra-phase priority order:** **Unit 2 (29.1%) → Unit 5 (28.6%) → Unit 1 (21.0%) → Unit 3 (20.3%) → Unit 4 (1.0%, lean right-size)**.

---

## 2. Weight-Tier System Applied Across Units 1–5

| Tier | 2023–2026 Threshold | Depth & Practice Budget | CSO Topic Clusters |
| :--- | :--- | :--- | :--- |
| **Tier A — Core Heavyweight** | `>= 20m` (`>= 5.0%`) | Labelled accessible SVG, step-by-step numerical/table trace, comparison table, heavy MCQ + 8m practice | U5 Cache (`51m`), U1 Von Neumann & buses (`39m`), U3 8086 BIU/EU, 40-pin & Min/Max (`39m`), U2 Pipelining, RISC pipeline & hazards (`37m`), U5 VM, paging, TLB & LRU/FIFO (`33m`), U3 8086 addressing modes (`27m`), U1 Fixed/floating, IEEE-754 & 2's comp (`26m`), U2 Control unit, control memory & instruction cycle (`24m`), U2 Booth & restoring division (`20m`) |
| **Tier B — Regular** | `10–19m` (`2.5–4.9%`) | SVG/matrix diagram, 7–8 row comparison table, 4m short-note model + 8m answer | U2 RISC vs CISC (`16m`), U5 Memory hierarchy, SRAM/DRAM & chip capacity (`16m`), U2 Flynn's taxonomy & vector processor (`15m`) |
| **Tier C — Low-Weight** | `1–9m` (`< 2.5%`) | Crisp theory + 1 worked example + 1–2 practice questions | U1 RTL, micro-ops, ASR & parity (`9m`), U1 `MAR`/`MBR`/`PC`/`IR` & R/W cycle (`7m`), U3 Zero-address stack code (`7m`), U3 8086 interrupts & flags (`5m`), U4 `MOV`/`ADD` basics (`4m`) |
| **Tier S — Syllabus-Only (`0m`)** | In PDF p. 10, `0m` in `P003–P006` | Compact ~160–260w reference summary + 1 table/snippet | U1 ALSU; U2 Hardwired vs microprogrammed, non-restoring div, FP add, array processor; U3 Segmentation `PA = Seg×10H+Off` & 1/2/3-address; U4 Logical/branch/sort/expr/string ALP, directives, PROC vs MACRO; U5 Address decoding, RAM/EPROM interfacing & 8255 PPI |
| **Tier E — Exam Extension** | Tested in `P003–P006`, outside unit list | Explicitly badged exam subsection with block diagram & transfer modes | U5 Direct Memory Access (DMA) controller, `HOLD`/`HLDA` & burst/cycle-stealing (`10m`, 3/4 papers) |

---

## 3. Live Shipped-Asset Inventory (`CST207` — Theory-Only)

| Asset | Current State on Disk | Phase 15 Action |
| :--- | :--- | :--- |
| `subjects/CST207/units/unit-{1..5}.html` | `32,228w` (`4,304 + 6,604 + 6,662 + 6,971 + 7,687`), **`0` `<pre>`**, `57` `<table>`, **`0` `<svg>`**, **`0` `<h3 id>`**, `0` YouTube links, `0` leaks | Rebalance to `~30.6–33.9kw` (cutting U4 ~48%, deepening U1/U2/U5), add `13` architectural SVGs, semantic `<pre><code>` blocks, `15` verified YouTube links, and `25` `<h3 id>` anchors |
| `assets/js/unit-discovery.js` | `entriesFor()` indexes generic `#short-questions`/`#mcqs` headings (causes `P006-Q24` false positive) | Skip non-concept generic sections (`overview`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`) inside `entriesFor()` |
| `docs/suggestions/guides.json` (`CST207`) | `10` locked reading anchors (`computer-structure`, `data-representation`, `pipelining`, `arithmetic`, `block-diagram`, `addressing`, `simple-programs`, `branch-call`, `cache-memory`, `virtual-memory`) | Preserve 10/10 unchanged; verify via `build_suggestions.py --check` |
| `docs/revision-sheets/CST207.json` | `8` entries (`U1:3, U2:1, U3:2, U4:0, U5:2` — Unit 4 missing!) | Add 1 sourced Unit 4 entry (`9` total) and rebuild `revision/CST207.html` |
| `_data/CST207/*.json` & Quiz status | `6` PYQ files (`195` total Qs; `103` in `P003–P006`); no standalone `_quiz-data/CST207/` (PYQ-backed by design) | **Read-only in Mode A** (`check_pyq_integrity.py` = `0` drift; never fabricate an unverified quiz bank) |

---

## 4. Scope In, Scope Out & Reuse Scan

### In Scope (when Phase 15 executes)
- Rebalancing and upgrading `subjects/CST207/units/unit-{1..5}.html` per [`unit-1/README.md`](unit-1/README.md)–[`unit-5/README.md`](unit-5/README.md).
- Preserving all **10 locked `guides.json` anchors** and all **74 existing `<section id>`s** (`15+13+15+17+14`).
- Adding **25 semantic `<h3 id>` anchors** and filtering generic practice section IDs in `assets/js/unit-discovery.js` so CSO PYQ topics resolve accurately (`102 / 103` direct topic matches + clean fallback on unlabelled `P006-Q24` `"Short notes"`).
- Script-verifying every binary/hex/timing/page-fault numerical (`-75 = 10110101₂`, IEEE-754 single/double, Booth `(-9)×(-13)=+117` & `(-11)×(-9)=+99`, restoring division, Cache EAT `8ns/65ns` & `8ns/80ns`, 18-step LRU & FIFO, `2^a × d`, `PA = Seg×10H + Off`).
- Adding a sourced Unit 4 summary in `docs/revision-sheets/CST207.json`, live-verifying **15 plain external `<a>` YouTube links** (`3+4+3+1+4`), and running the complete `README.md:161–215` rebuild & verification suite.

### Out of Scope
- Modifying `_data/CST207/*.json` or `_data/pyq-integrity.json` without explicit Mode B owner approval.
- Fabricating an unverified `_quiz-data/CST207/` bank (`QUIZ_BANK_SUBJECTS` in `unit-discovery.js` stays honest).
- Adding `<iframe>` embeds, `i.ytimg.com` thumbnails, hardcoded colours, reopening Phases 1–10, or deploying.

### Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js`, `scripts/build_revision_sheets.py`.
- **ADAPT:** `assets/js/unit-discovery.js` (`entriesFor()` generic-section guard, benefiting all 5 subjects) and `docs/revision-sheets/CST207.json` (+1 U4 entry).
- **REJECT:** Unsemantic `<div>` pseudo-code for 8086 ALP/RTL (replace with `<pre><code>`), YouTube embeds/CDNs, and excessive inline `<style>` bloat.

---

## 5. Dependencies, Gates & Risks

| Area | Constraint / Gate | Mitigation |
| :--- | :--- | :--- |
| **Dependencies** | Closed Phases 0–10 + `guides.json` (Phase 11) | Self-contained; recommended #1 first phase |
| **Hardware arithmetic accuracy** | Sign-extension error in 5-bit Booth or simultaneous vs sequential Cache EAT loses exam marks | Verify every cycle/frame table via Python; show both simultaneous & sequential EAT conventions |
| **ALP right-sizing safety** | Unit 4 has `9` concept sections & 2 locked anchors | Preserve every `<section id>`, keep non-ALP words (`RISC`, `Flynn`, `DMA`) out of U4 headings so mis-tagged U4 PYQs redirect cleanly |
| **Accessibility & budget** | SVGs require `role="img"` + `<title>` and CSS tokens only | Verify via `audit_accessibility.py --fail`, `check_tokens.py --strict`, `audit_page_weight.py --budget` |
| **Unit-discovery change** | Editing `assets/js/unit-discovery.js` affects DOM & search tests | Add unit coverage in `tests/discovery-dom.cjs`, update `tests/test_discovery.py:111`, run `build_data_version.py` last |

---

## 6. Done Means

- [x] All 6 parts in [`tasks.md`](tasks.md) pass with evidence logged in [`record.md`](record.md).
- [x] Word counts match CSO's real 2023–2026 distribution (`U2 ≈ U5 > U3 ≈ U1 >> U4`) while maintaining 100% Revised-2022 syllabus coverage.
- [x] All 10 `guides.json` anchors & 74 content `<section id>`s (plus five video sections) preserved; all numericals, architectural SVGs, and `<pre><code>` blocks verified; `revision/CST207.html` includes Unit 4.
- [x] All 15 YouTube links verified live as plain external `<a>` tags and recorded in `record.md`.
- [x] Zero generic `#short-questions` false positives, zero wrong-unit collisions, `102/102` topic-labelled CSO PYQs resolved cleanly, and `check_pyq_integrity.py` = `0` drift.
- [x] All root README engineering gates pass locally; the owner test guide and `rule.md` §7 Termux instructions are ready.
- [x] Owner sign-off received (“Mark as pass”). No separate phone test result was supplied.
