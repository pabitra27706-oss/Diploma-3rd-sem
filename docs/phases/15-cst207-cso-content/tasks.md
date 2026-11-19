# Phase 15 Tasks — Computer System Organization (6 Parts)

> **Execution order:** Weight-priority (`15.2 → 15.5 → 15.1 → 15.3 → 15.4 → 15.6`) or sequential (`15.1 → 15.6`).  
> **Weighting basis:** Strict **2023–2026 PYQ window** (`P003–P006`: `4` papers, `103` scan-verified Qs, `385` set marks; `2021–2022` `P001`/`P002` excluded).  
> **Standing rules:** Preserve all `10` locked `guides.json` anchors and all `79` runtime `<section id>`s (74 content sections + five Watch & Learn sections); wrap RTL/ALP in `<pre><code>`; accessible token-only SVGs; zero raw `CST207`/`P00X` strings; plain external `<a>` YouTube links only; zero `_data/` edits in Mode A.

---

## Part 15.1 — Unit 1: Structure of Computers (`81m / 21.0%`, 6h, PDF p. 10 — `13.5m/h`)
- **Target file:** `subjects/CST207/units/unit-1.html` (`4,304w → ~5,800–6,400w`) · Blueprint: [`unit-1/README.md`](unit-1/README.md)
- **Implementation checklist:**
  - [x] Expand **Tier A + Tier C `#computer-structure` (`39m` + `7m = 46m`, 4/4 papers, ~48% prose)**: inline SVG Von Neumann architecture + stored-program & bottleneck + Harvard contrast; inline SVG System Bus (Address/Data/Control) + comparison table; processor–memory connection (`PC, IR, MAR, MDR/MBR, AC, ALU, CU`) + Memory Read & Write micro-step sequences.
  - [x] Expand **Tier A `#data-representation` (`26m`, 4/4 papers, ~32% prose)**: sign-magnitude, 1's & 2's complement + exact 8-bit `-75 = 10110101₂` derivation; 7-row Fixed-Point vs Floating-Point table; inline SVG IEEE-754 Single (1+8+23, bias 127) & Double (1+11+52, bias 1023) bit layouts, biased-exponent rationale, special encodings, and worked decimal → IEEE-754 hex trace.
  - [x] Keep **Tier C + Tier S `#register-transfer`, `#micro-operations`, `#error-codes` & `#alu` (`9m`, ~20% prose)** crisp: RTL `<pre><code>` notation, 4 micro-op classes, Logical vs Circular vs Arithmetic Shift Right (ASR sign-bit preservation), even/odd parity bit, and compact ~160w **Tier S** ALSU block.
  - [x] Calibrate practice (`10` MCQs, `5` short, `4` worked 8m), add `6` `<h3 id>` anchors, and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [x] Locks `#computer-structure`, `#data-representation` & all `16` runtime `<section id>`s preserved (including videos); `-75` & IEEE-754 math verified; 3 URLs logged in `record.md`.

---

## Part 15.2 — Unit 2: Micro Programmed Control, Arithmetic & Pipelining (`112m / 29.1%`, 20h — #1 CSO Unit)
- **Target file:** `subjects/CST207/units/unit-2.html` (`6,604w → ~7,600–8,400w`) · Blueprint: [`unit-2/README.md`](unit-2/README.md)
- **Implementation checklist:**
  - [x] Expand **Tier A + Tier B `#pipelining` (`37m` + `16m = 53m`, 4/4 papers, ~42% prose)**: `k`-stage space-time SVG + `T = (k+n-1)τ` speedup, Arithmetic vs Instruction pipeline, 5-stage RISC pipeline (`IF/ID/EX/MEM/WB`) + delayed load/branch, Structural/Data (`RAW, WAR, WAW`)/Control hazards + solutions (forwarding, stalls, branch prediction), and 8-row RISC vs CISC comparison table.
  - [x] Expand **Tier A + Tier S `#microprogrammed` (`24m`, 4/4 papers, ~22% prose)**: Basic Instruction Cycle SVG, Functional Block Diagram of Microprogrammed Control Unit & Control Memory (`Sequencer → CAR → Control Memory ROM → CDR → Control Signals`), horizontal vs vertical microinstructions, and compact **Tier S** Hardwired vs Microprogrammed table.
  - [x] Upgrade **Tier A + Tier S `#arithmetic` (`20m`, ~22% prose)**: Booth's algorithm flowchart + both exact 5-bit exam tables **`(-9) × (-13) = +117`** and **`(-11) × (-9) = +99`**; Unsigned Restoring Division flowchart + 4-bit `11 ÷ 3` cycle table; compact ~180w **Tier S** non-restoring & FP add/sub summary.
  - [x] Build **Tier B + Tier S `#vector` (`15m`, 4/4 papers, ~14% prose)**: Flynn's 2×2 SISD/SIMD/MISD/MIMD SVG & examples, 4m Vector Processor model note, and 4-line **Tier S** Array Processor contrast.
  - [x] Calibrate practice (`10` MCQs, `5` short, `6` worked 8m), add `5` `<h3 id>` anchors, and insert `4` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [x] Locks `#pipelining`, `#arithmetic` & all `14` runtime `<section id>`s preserved (including videos); Booth & restoring-division cycle tables verified via Python; 4 URLs logged in `record.md`.

---

## Part 15.3 — Unit 3: CPU Architecture — Intel 8086 & Instruction Formats (`78m / 20.3%`, 10h, PDF p. 10)
- **Target file:** `subjects/CST207/units/unit-3.html` (`6,662w → ~6,400–7,000w`) · Blueprint: [`unit-3/README.md`](unit-3/README.md)
- **Implementation checklist:**
  - [x] Build **Tier A `#block-diagram` & `#registers` (`39m`, 4/4 papers, ~46% prose)**: 8086 specs, inline SVG BIU/EU block diagram + BIU vs EU table, GPRs/Segment/Pointer-Index/16-bit Flag Register (6 status + 3 control), accessible 40-pin DIP SVG + grouped pin cheat-sheet (highlighting Min vs Max pins 24–31), and 7-row Minimum vs Maximum Mode table.
  - [x] Build **Tier A `#addressing` (`27m`, 4/4 papers, ~28% prose)**: purpose + master 8-mode 8086 addressing table (Immediate, Register, Direct, Register Indirect, Based, Indexed, Based-Indexed, Based-Indexed with Displacement + Implied & Port I/O) with `<pre><code>` examples and hex EA calculations.
  - [x] Build **Tier C + Tier S `#instructions` (`7m`, ~11% prose)**: stack `PUSH`/`POP` + full Zero-Address code for `X = (A + B) * (C + D)` contrasted with 1/2/3-address forms + 6-group 8086 instruction overview.
  - [x] Keep **Tier C `#interrupts` (`5m`, ~8%) & Tier S `#segmentation` (`0m`, ~7%)** sharp: hardware (`NMI`/`INTR`) vs software (`INT n`) vs exceptions + IVT; four 64 KB segments + `PA = Seg × 10H + Offset` hex example (keeping generic phrase "memory hierarchy" out of `#segmentation` heading so U5 PYQs stop colliding).
  - [x] Calibrate practice (`8` MCQs, `4` short, `5` worked 8m), add `5` `<h3 id>` anchors, and insert `3` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [x] Locks `#block-diagram`, `#addressing` & all `16` runtime `<section id>`s preserved (including videos); 40-pin numbers, flag positions, and hex EA math double-checked; 3 URLs logged in `record.md`.

---

## Part 15.4 — Unit 4: Assembly Language Programming (`4m / 1.0%`, 9h — Lean Right-Sizing + Revision Entry)
- **Target files:** `subjects/CST207/units/unit-4.html` (`6,971w → ~3,400–3,900w`), `docs/revision-sheets/CST207.json` · Blueprint: [`unit-4/README.md`](unit-4/README.md)
- **Implementation checklist:**
  - [x] Add honest `#overview` scope note (`1%` 2023–2026 weight, 100% syllabus coverage) and convert all assembly examples into indented `<pre><code>` blocks with register-state comments.
  - [x] Focus **Tier C `#simple-programs` (`4m`, ~22% prose)** on `MOV` rules (source unchanged, zero flags affected, illegal `MOV [M1],[M2]` & `MOV CS,imm`), `ADD`/`ADC`/`SUB`/`MUL`/`DIV` flag effects (`P004-Q5`, `P005-Q3`), and crisp 8-bit & 16-bit addition programs.
  - [x] Condense all seven **Tier S** sections (`#logical-programs`, `#branch-call`, `#sorting`, `#expressions`, `#strings`, `#directives`, `#procedures` — ~63% combined) to `~220–280w` + 1 clean `<pre><code>` snippet/table each (incl. Procedure vs Macro table).
  - [x] Calibrate practice (`6` MCQs, `3` short, `2` worked ALP), add `3` strictly ALP-scoped `<h3 id>` anchors, add `1` sourced Unit 4 entry in `docs/revision-sheets/CST207.json`, and insert `1` live-verified plain-`<a>` YouTube link.
- **Acceptance & evidence:**
  - [x] Locks `#simple-programs`, `#branch-call` & all `18` runtime `<section id>`s preserved; lean `3,336w` actual (advisory budget); `build_revision_sheets.py` succeeds with Unit 4 present; 1 URL logged in `record.md`.

---

## Part 15.5 — Unit 5: Memory and Digital Interfacing (`110m / 28.6%`, 15h — Co-#1 CSO Unit)
- **Target file:** `subjects/CST207/units/unit-5.html` (`7,687w → ~7,400–8,200w`) · Blueprint: [`unit-5/README.md`](unit-5/README.md)
- **Implementation checklist:**
  - [x] Expand **Tier A `#cache-memory` (`51m`, 4/4 papers, ~38% prose)**: locality, word vs block transfer, hit/miss ratio, simultaneous & sequential EAT formulas + worked **`8 ns / 65 ns`** and **`8 ns / 80 ns`** problems, inline SVG address splits for Direct, Fully Associative, and `k`-Way Set-Associative mapping, 8-row 3-way mapping comparison, and 6-row Write-Through vs Write-Back table.
  - [x] Expand **Tier A `#virtual-memory` (`33m`, 4/4 papers, ~30% prose)**: virtual vs physical address-bit math (incl. `2^35` bytes = 32 GiB), inline SVG Paging + Page Table + TLB lookup & TLB-EAT, page fault steps, and complete **18-step frame-by-frame FIFO and LRU tables** on `5, 0, 2, 1, 0, 3, 0, 2, 4, 3, 0, 3, 2, 1, 3, 0, 1, 5`.
  - [x] Add dedicated **Tier B Memory Hierarchy & RAM/ROM (`16m`, ~12% prose)** (SVG pyramid, SRAM vs DRAM, ROM family, `2^a × d` chip sizing) and badged **Tier E DMA subsection (`10m`, 3/4 papers, ~10% prose)** (DMA controller SVG, `DRQ`/`DACK` & `HOLD`/`HLDA`, Burst vs Cycle-Stealing vs Transparent).
  - [x] Condense **Tier S `#address-decoding`, interfacing part of `#memory-interfacing` & `#ppi-8255` (`0m`, ~10% combined)** to `~200w` each while keeping all `<section id>`s intact.
  - [x] Calibrate practice (`12` MCQs, `5` short, `5` worked 8m), add `6` `<h3 id>` anchors, and insert `4` live-verified plain-`<a>` YouTube links.
- **Acceptance & evidence:**
  - [x] Locks `#cache-memory`, `#virtual-memory` & all `15` runtime `<section id>`s preserved; EAT, paging, `2^a×d`, and 18-step FIFO/LRU counts script-verified; 4 URLs logged in `record.md`.

---

## Part 15.6 — Topic Map, PYQ Sync, Canonical Rebuild & Gate Verification

> **Topic map required.** Follow [`docs/phases/topic-map-standard.md`](../topic-map-standard.md)
> — the Phase 12 CST201 map is the worked example. This subject has the worst
> baseline in the corpus (**58 unmatched / 60 redirects** of 195 questions), so its
> map is the highest-value authoring job; author it **last**, after the anchors exist.
- **Verification & rebuild checklist:**
  - [x] Keep the shared fallback scorer; for CST207 explicitly leave “Short notes” at the unit overview. Verify real resolver highlights, visible collapsed-section landings and stale-anchor fallback in the DOM shim.
  - [x] Simulate all 103 questions: 102 labelled destinations and one intentional no-jump. Record base/content-only/map-first specificity in [`routing-audit.tsv`](routing-audit.tsv).
  - [x] Generate `assets/data/topic-map-CST207.json` from the audited editorial groups, document unequal-mark cases, and run the CST207 map tests without changing the existing subject tests.
  - [x] Run the README rebuild, update the heading/ordering ratchets, re-stabilise generated bytes after the full suite, and pass 13 scripts, Python unittest and deterministic Node.
  - [x] Update record, roadmap, status, handoff and the session Termux block in `rule.md`.
  - [x] Zero PYQ drift, generic false positives and wrong-unit collisions in the strict mapped window.
  - [x] Owner accepted Phase 15 (“Mark as pass”, 2026-11-19). No separate phone test result was supplied; no PR or deployment was authorized.
