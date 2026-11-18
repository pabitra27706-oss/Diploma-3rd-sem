# CST207 Unit 2 — Micro Programmed Control, Computer Arithmetic & Pipelining

> **Target file:** `subjects/CST207/units/unit-2.html` (current: `6,604w` → target: **`~7,600–8,400w`**)  
> **Syllabus (`syllabus.json`, PDF p. 10):** **20 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0` — largest syllabus unit in CSO)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`112 / 385` marks (`29.1%`, #1 HIGHEST-WEIGHT UNIT IN CSO)** · avg **`28.0m/paper`** · **`4/4` papers** · **`23m` MCQ + `89m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#pipelining`, `#arithmetic`  
> **Existing `<section id>`s to preserve (13):** `overview`, `microprogrammed`, `arithmetic`, `pipelining`, `vector`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` (add `5` clean semantic `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 10)
- **Micro-Programmed Control:** Basic Instruction Cycle (Fetch, Decode, Effective Address, Execute, Interrupt); Control Memory; Address Sequencing (`CAR`, `CDR`/`CBR`, next-address generator/sequencer); Micro-Program Example; Design of Control Unit (Hardwired vs Micro-Programmed).
- **Computer Arithmetic:** Addition and subtraction of signed binary numbers; Multiplication algorithm (**Booth's Algorithm** for signed 2's complement); Division algorithms (**Restoring** and Non-Restoring division); Floating-point arithmetic operations.
- **Pipeline and Vector Processing:** Parallel processing & **Flynn's Classification** (`SISD`, `SIMD`, `MISD`, `MIMD`); Pipelining — Arithmetic pipeline, Instruction pipeline, **RISC Pipeline**, **Pipeline Hazards** (Structural, Data, Control) & remedies, **RISC vs CISC**; Vector Processing; Array Processors.

---

## 2. Current Page Audit & Gaps (`subjects/CST207/units/unit-2.html`)
- **Live metrics:** `6,604` words · `0` `<pre>` blocks · `13` `<table>`s · **`0` `<svg>`s** · `0` `<h3 id>`s · `15` MCQs · `10` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#microprogrammed` `528w`, `#arithmetic` `998w`, `#pipelining` `471w`, `#vector` `289w` (`2,286w` concept prose).
- **Specific gaps to fix:**
  1. **Severe under-coverage of `#pipelining` (`471w` for `53m = 47.3%` of Unit 2!):** Needs `k`-stage space-time SVG, Arithmetic vs Instruction pipeline (`P004-Q23a`), dedicated 5-stage RISC pipeline + delayed load/branch (`P005-Q22`, `P006-Q24`), all 3 hazard classes (`RAW`/`WAR`/`WAW`, structural, branch) with cycle diagrams (`4/4` papers!), and an 8-row RISC vs CISC comparison table (`P003-Q30a`, `P004-Q20a`, `P006-Q18b`).
  2. `#arithmetic` needs **flowcharts + both exact 5-bit Booth multiplication cycle tables** — **`(-9) × (-13) = +117`** (`P005-Q16b`) and **`(-11) × (-9) = +99`** (`P006-Q22b`) — alongside a full Unsigned Restoring Division flowchart + 4-bit cycle table (`P003-Q27a`, `P005-Q16a`).
  3. `#microprogrammed` needs a labelled SVG **Functional Block Diagram of Control Memory & Sequencer** (`P003-Q34b`, `P006-Q23b`) and Basic Instruction Cycle SVG (`P004-Q17a`, `P006-Q23a`).
  4. **16 Unit 2 `2023–2026` PYQ questions fail to match** (and `P003-Q9` & `P006-Q10` redirect to the wrong units `U1#alu` and `U3#instructions`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`112m`)

| Topic Cluster | Marks | % of U2 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Pipelining, pipeline types, RISC pipeline & structural/data/control hazards** | **37m** | **33.0%** | **9.6%** | **4/4** | **Tier A** | `P003-Q22` (1m), `P003-Q31a(4m hazards)`; `P004-Q23a(4m pipeline + types),Q23b(4m hazards)`; `P005-Q4,Q11` (2×2m), `P005-Q21a(3m pipelining),Q21b(5m hazards)`, `P005-Q22(3m* RISC pipeline)`; `P006-Q11` (2m), `P006-Q18a(2m pipelining),Q18c(3m hazards)`, `P006-Q24(2m* RISC pipelining)` |
| **Control unit, control memory block diagram, microprogramming & instruction cycle** | **24m** | **21.4%** | **6.2%** | **4/4** | **Tier A** | `P003-Q9` (1m), `P003-Q34b(5m microprogrammed CU)`; `P004-Q17a(4m instruction cycle w/ diagram)`; `P005-Q9` (2m sequencer/`CAR`); `P006-Q9,Q10` (2×2m), `P006-Q23a(2m instruction cycle),Q23b(6m block diagram of control memory)` |
| **Computer arithmetic: Booth's signed multiplication & unsigned restoring division** | **20m** | 17.9% | **5.2%** | 3/4 | **Tier A** | `P003-Q27a(4m restoring division w/ flowchart & ex)`; `P005-Q14` (2m Booth), `P005-Q16a(4m unsigned restoring division),Q16b(4m Booth (-9)×(-13))`; `P006-Q22b(6m Booth (-11)×(-9))` |
| **RISC vs CISC architectures** | **16m** | 14.3% | 4.2% | 3/4 | **Tier B** | `P003-Q4,Q8,Q16` (3×1m), `P003-Q30a(4m RISC vs CISC)`; `P004-Q20a(4m CISC vs RISC)`; `P006-Q7` (2m), `P006-Q18b(3m RISC vs CISC)` |
| **Flynn's classification (SISD, SIMD, MISD, MIMD), parallel & vector processors** | **15m** | 13.4% | 3.9% | **4/4** | **Tier B** | `P003-Q31b(4m Flynn)`; `P004-Q8` (2m parallel), `P004-Q22a(4m Flynn)`; `P005-Q22(3m* Vector Processor)`; `P006-Q24(2m* Flynn)` |
| **Hardwired vs microprogrammed, non-restoring division, FP arithmetic & array processors** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 10), 0 direct marks in 2023–2026 — compact summaries_ |

*(\*Pro-rated shares of choice-pool short-note questions `P005-Q22` and `P006-Q24`, worth `4m` each when selected.)*

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#pipelining` [LOCKED] — Pipelining, RISC Pipeline, Hazards & RISC vs CISC (Tier A + Tier B · ~42% prose)
- Stage-plus-latch model, `k`-stage timing `T_pipe = (k + n - 1)τ` vs `T_seq = n·k·τ`, speedup `S = nk / (k + n - 1) → k`, efficiency & throughput; **Arithmetic Pipeline vs Instruction Pipeline** (`P004-Q23a`).
- **RISC Pipeline** (`P005-Q22`, `P006-Q24`): 5-stage load-store pipeline (`IF → ID → EX → MEM → WB`), register-file simplicity, single-cycle ALU ops, delayed load (`NOP`/independent fill) & delayed branch.
- **Three Pipeline Hazards + Hardware/Compiler Fixes** (`4/4` papers):
  1. **Structural (Resource) Hazard:** unified memory/ALU conflict → Harvard split I-cache/D-cache, duplicated units.
  2. **Data Hazard:** `RAW` (true), `WAR` (anti), `WAW` (output) → data forwarding/bypassing, stall bubble, instruction reordering.
  3. **Control (Branch) Hazard:** PC target unknown until `ID`/`EX` → pipeline flush/stall, static/dynamic branch prediction, delayed branch.
- 8-row **RISC vs CISC Comparison Table** (instruction count/format, CPI, addressing modes, GPR count, load-store vs memory operands, hardwired vs microprogrammed CU, pipeline friendliness, ARM/RISC-V vs x86 — `P003-Q30a`, `P004-Q20a`, `P006-Q18b`).

### 4.2 `#microprogrammed` — Instruction Cycle & Control Memory (Tier A + Tier S · ~22% prose)
- Labelled **Basic Instruction Cycle** diagram (`Fetch → Instruction Decode → Effective Address → Execute → Interrupt Check` — `P004-Q17a`, `P006-Q10,Q23a`).
- Labelled **Microprogrammed Control Unit & Control Memory** block diagram (`External Opcode → Next-Address Generator / Sequencer → CAR → Control Memory [ROM] → CDR/CBR → Control Word + Branch Address` — `P003-Q9,Q34b`, `P005-Q9`, `P006-Q9,Q23b`), microinstruction hierarchy, horizontal vs vertical encoding, and compact **Tier S** Hardwired vs Microprogrammed table.

### 4.3 `#arithmetic` [LOCKED] — Booth's Multiplication & Restoring Division (Tier A + Tier S · ~22% prose)
- **Booth's Signed 2's Complement Algorithm:** `(Q_0, Q_{-1})` table (`01: A ← A + M`, `10: A ← A - M`, `00/11: nop`, then **ASR** `[A, Q, Q_{-1}]`), flowchart, and **both exact 5-bit worked exam traces**:
  - `(-9) × (-13)`: `M = 10111 (-9)`, `-M = 01001 (+9)`, `Q = 10011 (-13)` → 5 cycles → `0001110101₂ = +117` (`P005-Q16b`).
  - `(-11) × (-9)`: `M = 10101 (-11)`, `-M = 01011 (+11)`, `Q = 10111 (-9)` → 5 cycles → `0001100011₂ = +99` (`P006-Q22b`).
- **Unsigned Restoring Division Algorithm:** flowchart + 4-bit cycle-by-cycle trace (`11 = 1011₂` ÷ `3 = 0011₂` → `Q = 0011₂ (3)`, `A = 0010₂ (2)` — `P003-Q27a`, `P005-Q16a`).
- Compact **Tier S** summary (~180w): Non-restoring division rule + 4-stage floating-point add/subtract alignment.

### 4.4 `#vector` — Flynn's Classification & Vector Processors (Tier B + Tier S · ~14% prose)
- **Flynn's Taxonomy** (`P003-Q31b`, `P004-Q8,Q22a`, `P006-Q24`): 2×2 Instruction-Stream × Data-Stream grid + block schematics and real examples for `SISD` (uniprocessor), `SIMD` (GPU/AVX/array), `MISD` (systolic/triple-modular redundancy), and `MIMD` (multicore SMP & clusters).
- Crisp 4-mark **Vector Processor** model note (vector registers, deep arithmetic pipelines, chaining, matrix/scientific computing — `P005-Q22`) + 4-line **Tier S** Vector vs Array Processor contrast.

### 4.5 Practice & Revision Bank
- `10` MCQs, `5` short answers, and `6` complete 8m model answers covering every recurring Unit 2 combination.

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (4):** (1) 5-stage Instruction/RISC Pipeline space-time chart + RAW stall vs forwarding; (2) Basic Instruction Cycle + Microprogrammed Control Memory block diagram; (3) Booth's Multiplication & Restoring Division side-by-side flowcharts; (4) Flynn's 4-quadrant SISD/SIMD/MISD/MIMD diagram.
- [ ] **Python-verified trace tables (4):** 5-bit Booth `(-9)×(-13)=+117`; 5-bit Booth `(-11)×(-9)=+99`; 4-bit Restoring Division `11÷3`; 5-stage pipeline speedup numerical.
- [ ] **Comparison tables (5):** RISC vs CISC (8 rows); Hardwired vs Microprogrammed CU; Horizontal vs Vertical microinstruction; Structural vs Data vs Control hazards; Flynn's SISD/SIMD/MISD/MIMD.

---

## 6. Revision-Sheet & Practice Cross-Links (`CST207` — Theory-Only)
- Keep `docs/revision-sheets/CST207.json` Unit 2 entry aligned with `#pipelining` and `#arithmetic` formulas; link `#practice` to CSO PYQ viewer and PYQ-backed practice decks.

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Pipelining, RISC Pipeline, Structural/Data/Control Hazards & RISC vs CISC | **Tier A/B** (`53m`) | `#pipelining` | Shows space-time diagram, `RAW`/`WAR`/`WAW`, forwarding & RISC/CISC; verify live |
| **2** | Microprogrammed Control Unit, Control Memory (`CAR`/`CDR`) & Instruction Cycle | **Tier A** (`24m`) | `#microprogrammed` | Morris Mano control-memory block diagram + sequencer; 15–28 min; plain `<a>` |
| **3** | Booth's Signed Multiplication & Unsigned Restoring Division (Full Cycle Tables) | **Tier A** (`20m`) | `#arithmetic` | Works signed negative×negative 5-bit trace & restoring step cleanly; verify live |
| **4** | Flynn's Classification (SISD, SIMD, MISD, MIMD) & Vector Processors | **Tier B** (`15m`) | `#vector` | Clear block diagrams & modern CPU/GPU/cluster examples; 10–20 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 2 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q9,Q34`, `P004-Q17`, `P006-Q9,Q10,Q23` | 1–8m | U2/U4 `Control unit`, `Microprogramming`, `Instruction decoding`, `Instruction cycle / control memory` | 4 Unmatched + 2 wrong redirects (`U1#alu`, `U3#instructions`) | `#instruction-cycle-control-unit-and-control-memory` — *Instruction Cycle, Instruction Decoding, Microprogramming and Control Unit / Control Memory* |
| `P005-Q14,Q16`, `P006-Q22` | 2,8,8m | U3 `Booth multiplication`, `Division / Booth multiplication`, `Shifts / Booth algorithm` | All Unmatched | `#booth-multiplication-and-restoring-division` — *Booth Multiplication Algorithm and Unsigned Restoring Division* |
| `P006-Q11`, `P003-Q22,Q31`, `P004-Q23`, `P005-Q4,Q11,Q21` | 1–8m | U4 `Pipeline hazards`, `Pipelining / hazards` | `P006-Q11` Unmatched; others redirect | `#pipelining-risc-pipeline-and-pipeline-hazards` — *Pipelining, RISC Pipeline and Pipeline Hazards* |
| `P003-Q4,Q8,Q16,Q30`, `P004-Q20`, `P006-Q7,Q18` | 1–8m | U2/U4 `RISC / CISC`, `RISC`, `CISC`, `Pipelining / RISC / CISC` | All 7 Unmatched | `#risc-and-cisc-architectures` — *RISC vs CISC Architecture Comparison* |
| `P004-Q1,Q8,Q22`, `P005-Q22` | 2–8m | U1/U4 `Computer architecture / Flynn`, `Parallel architectures`, `Flynn / IEEE-754`, `Advanced architecture / cache` | All Unmatched | `#flynn-classification-parallel-and-vector-architectures` — *Flynn's Classification, Parallel Architectures and Advanced Vector Processors* |
