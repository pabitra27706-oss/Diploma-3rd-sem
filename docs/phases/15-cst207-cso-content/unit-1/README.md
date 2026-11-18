# CST207 Unit 1 — Structure of Computers

> **Target file:** `subjects/CST207/units/unit-1.html` (current: `4,304w` → target: **`~5,800–6,400w`**)  
> **Syllabus (`syllabus.json`, PDF p. 10):** **6 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`81 / 385` marks (`21.0%`, #3 in CSO — #2 highest marks-per-hour in the entire repo at `13.5m/h`!)** · avg **`20.2m/paper`** · **`4/4` papers** · **`29m` MCQ + `52m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#computer-structure`, `#data-representation`  
> **Existing `<section id>`s to preserve (15):** `overview`, `computer-structure`, `data-representation`, `error-codes`, `register-transfer`, `micro-operations`, `alu`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` (add `6` clean semantic `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 10)
- **Functional Units & Bus Organization:** Computer functional units (Input, Memory, ALU, Control Unit, Output); Von-Neumann stored-program architecture; Bus structures (Address, Data, and Control buses; single-bus structure); Basic operational concepts — processor–memory connection (`PC`, `IR`, `MAR`, `MDR`/`MBR`, `AC`, GPRs) and memory read/write cycles.
- **Data Representation & Error Codes:** Fixed-point signed integer representation (sign-magnitude, 1's complement, 2's complement); Floating-point representation (IEEE-754 32-bit single and 64-bit double precision, biased exponent, normalization); Error-detecting codes (even/odd parity bit).
- **Register Transfer & Micro-Operations:** Register Transfer Language (RTL); Arithmetic, Logic, and Shift micro-operations (`shl`, `shr`, `cil`, `cir`, `ashl`, `ashr`/ASR); Arithmetic Logic Shift Unit (ALSU).

---

## 2. Current Page Audit & Gaps (`subjects/CST207/units/unit-1.html`)
- **Live metrics:** `4,304` words (`2,667w` shorter than `4m` Unit 4!) · `0` `<pre>` blocks · `11` `<table>`s · **`0` `<svg>`s** · `0` `<h3 id>`s · `8` MCQs · `6` short Qs · `3` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#computer-structure` `449w`, `#data-representation` `203w`, `#error-codes` `329w`, `#register-transfer` `167w`, `#micro-operations` `300w`, `#alu` `224w` (`1,672w` concept prose).
- **Specific gaps to fix:**
  1. **Critical under-coverage of `#data-representation` (`203w` for `26m`, tested in ALL `4/4` papers!):** Currently shorter than `#error-codes` (`329w`, `1–2m`) and `#alu` (`224w`, `0m`)! Must include IEEE-754 32-bit & 64-bit field SVGs, biased exponent `127`/`1023` (`P004-Q21a`), full 7-row Fixed vs Floating-Point table (`P005-Q20a`, `P006-Q21a`), worked decimal → IEEE-754 hex conversion, and exact 8-bit 2's complement of `-75 = 10110101₂` (`P005-Q20b`).
  2. **Zero diagrams (`0` SVGs) for diagram-mandatory 8m questions:** `P003-Q26a`, `P004-Q16a,b`, `P005-Q15a`, and `P006-Q16b` explicitly command *"Draw and label Von Neumann / BUS architecture / internal processor–memory connection"*.
  3. **19 Unit 1 `2023–2026` PYQ questions are currently unmatched** (`Von Neumann`, `Buses`, `CPU registers`, `Memory write cycle`, `IEEE-754`, `Digital logic / parity`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`81m`)

| Topic Cluster | Marks | % of U1 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Von Neumann architecture, CPU functional units, buses & processor–memory connection** | **39m** | **48.1%** | **10.1%** | **4/4** | **Tier A** | `P003-Q1,Q5,Q14` (3×1m), `P003-Q26a(4m draw & label Von Neumann)`; `P004-Q1,Q7` (2×2m), `P004-Q16a(4m draw Von Neumann),Q16b(4m draw & explain BUS)`; `P005-Q8` (2m), `P005-Q15a(4m explain Von Neumann)`; `P006-Q1,Q3,Q14` (3×2m), `P006-Q16a(3m Von Neumann key concept),Q16b(5m memory–processor connection)` |
| **Fixed vs floating-point, IEEE-754 single/double, biased exponent & 2's complement** | **26m** | **32.1%** | **6.8%** | **4/4** | **Tier A** | `P003-Q20` (1m IEEE-754), `P003-Q26b(4m IEEE single & double)`; `P004-Q21a(2m biased exponent)`, `P004-Q22b(4m IEEE-754 single & double)`; `P005-Q5` (2m IEEE-754), `P005-Q20a(3m fixed vs floating),Q20b(2m -75 in 8-bit 2's comp)`; `P006-Q21a(4m fixed vs floating),Q21b(4m IEEE single & double)` |
| **Register transfer, micro-operations, Arithmetic Shift Right (ASR) & parity bit** | **9m** | 11.1% | 2.3% | 3/4 | **Tier C** | `P003-Q3` (1m parity), `P003-Q6` (1m shift), `P003-Q34a(3m micro-operation)`; `P005-Q13` (2m micro-ops); `P006-Q22a(2m ASR)` |
| **Special-purpose CPU registers (`MAR`, `MBR`/`MDR`, `PC`, `IR`) & memory R/W cycle** | **7m** | 8.6% | 1.8% | 3/4 | **Tier C** | `P003-Q11,Q19,Q21` (3×1m registers); `P004-Q13` (2m memory write cycle); `P006-Q5` (2m `PC`/`MAR`/`IR`) |
| **Arithmetic Logic Shift Unit (ALSU)** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 10), 0 hits in 2023–2026 — keep concise (~160w)_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#computer-structure` [LOCKED] — Von Neumann, Buses & Processor–Memory Link (Tier A + Tier C · ~48% prose)
- **Von Neumann Architecture** (`4/4` papers: `P003-Q1,Q26a`, `P004-Q16a`, `P005-Q8,Q15a`, `P006-Q1,Q16a`): labelled SVG block diagram (Input, Unified Memory, CPU [CU + ALU + Registers], Output, data & control lines), 4 stored-program principles, Von Neumann bottleneck, and compact Von Neumann vs Harvard table.
- **System Bus Architecture** (`P003-Q14`, `P004-Q16b`, `P006-Q3,Q14`): labelled 3-bus SVG + comparison table covering Address Bus (unidirectional, `k` lines → `2^k` addresses), Data Bus (bidirectional, `w`-bit word transfer), and Control Bus (`MEMR#`, `MEMW#`, `IOR#`, `IOW#`, `INTR`/`INTA#`, `HOLD`/`HLDA`, `CLK`, `RESET`).
- **Internal Processor–Memory Connection & R/W Cycles** (`P003-Q11,Q19,Q21`, `P004-Q7,Q13`, `P006-Q5,Q16b`): labelled SVG of `PC`, `IR`, `MAR`, `MDR`/`MBR`, `AC`, `R0..Rn-1`, ALU, and CU, plus RTL `<pre><code>` sequences for **Memory Read** (`MAR ← addr; Read; MDR ← M[MAR]`) and **Memory Write** (`MAR ← addr; MDR ← val; Write; M[MAR] ← MDR`).

### 4.2 `#data-representation` [LOCKED] — Fixed/Floating, 2's Complement & IEEE-754 (Tier A · ~32% prose)
- Signed integer formats (sign-magnitude, 1's complement, **2's complement** range `-2^(n-1) .. 2^(n-1) - 1`, unique zero, hardware adder reuse) + full worked **8-bit 2's complement of `-75`**: `+75 = 01001011₂ → 1's = 10110100₂ → +1 = 10110101₂` (weighted check `-128+32+16+4+1 = -75`, `P005-Q20b`).
- 7-row **Fixed-Point vs Floating-Point Comparison Table** (`P005-Q20a`, `P006-Q21a`).
- **IEEE-754 Standard** (`4/4` papers: `P003-Q20,Q26b`, `P004-Q21a,Q22b`, `P005-Q5`, `P006-Q21b`):
  - Single precision (`32` bits = `1` Sign + `8` Exponent [bias `127`] + `23` Fraction; `(-1)^S × 1.F × 2^(E - 127)`).
  - Double precision (`64` bits = `1` Sign + `11` Exponent [bias `1023`] + `52` Fraction; `(-1)^S × 1.F × 2^(E - 1023)`).
  - Why **biased exponent** is used (non-negative stored `E = e + bias` enables fast unsigned magnitude comparison), implicit leading `1.`, special cases (`±0`, denormals, `±∞`, `NaN`), and worked conversion of `-13.625` to 32-bit IEEE-754 (`1 10000010 10110100000000000000000₂ = C15A0000₁₆`).

### 4.3 `#register-transfer`, `#micro-operations`, `#error-codes` & `#alu` (Tier C + Tier S · ~20% prose)
- `#register-transfer` & `#micro-operations`: `<pre><code>` RTL syntax (`R2 ← R1`, `P: R2 ← R1`, `DR ← M[AR]`), definition & 4 families of **micro-operations** (`P003-Q34a`, `P005-Q13`), and shift table + bit diagram emphasizing **Arithmetic Shift Right (`ashr` / ASR)** preserving sign bit `R[n-1]` for signed `÷2` (`11101000₂ (-24) → 11110100₂ (-12)` — `P003-Q6`, `P006-Q22a`).
- `#error-codes`: crisp even vs odd **parity bit** generation/check table (`P003-Q3`) + single-bit error detection limit.
- `#alu` (**Tier S**, ~160w): 1-bit ALSU stage combining arithmetic, logic, and shift via MUX select lines.

### 4.4 Practice & Revision Bank
- `10` MCQs, `5` short answers, and `4` full 8m model answers (`Von Neumann + System Bus`, `Von Neumann + Processor–Memory Connection`, `Fixed vs Floating + IEEE-754 Single/Double`, `-75 2's complement + Biased Exponent + ASR/Micro-ops`).

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (3):** (1) Labelled Von Neumann architecture + Internal Processor–Memory register interconnection; (2) Three-bus system architecture (Address, Data, Control); (3) IEEE-754 32-bit Single vs 64-bit Double bit-field diagram + ASR sign-bit shift.
- [ ] **Script-verified traces & `<pre><code>` blocks (4):** `-75 → 10110101₂`; `-13.625 → C15A0000₁₆`; ASR on `-24 → -12`; Memory Read/Write RTL sequences.
- [ ] **Comparison tables (5):** Von Neumann vs Harvard; Address vs Data vs Control Bus; Sign-Magnitude vs 1's vs 2's Complement; Fixed-Point vs Floating-Point; IEEE-754 Single vs Double Precision; Logical vs Circular vs Arithmetic Shift.

---

## 6. Revision-Sheet & Practice Cross-Links (`CST207` — Theory-Only)
- **Revision sheet (`revision/CST207.html`):** Align the `3` existing Unit 1 entries in `docs/revision-sheets/CST207.json` (Von Neumann/buses, IEEE-754, RTL/shifts) with updated `#` anchors.
- **Practice flow:** Link `#practice` to `pyq/viewer.html` (CSO papers) and `practice/index.html` (PYQ-backed flashcards & quiz — never claim a separate CSO lab).

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Von Neumann Architecture, System Buses & CPU Registers (`PC`, `IR`, `MAR`, `MDR`) | **Tier A** (`46m`) | `#computer-structure` | Draws complete register-to-memory read/write cycle & 3 buses; 15–30 min; verify live |
| **2** | Fixed vs Floating-Point, 2's Complement & IEEE-754 Single/Double Precision | **Tier A** (`26m`) | `#data-representation` | Covers bias `127`/`1023`, implicit `1.`, and worked binary-to-hex example; plain `<a>` |
| **3** | Register Transfer Language & Arithmetic / Logic / Shift Micro-Operations (ASR) | **Tier C** (`9m`) | `#micro-operations` | Morris Mano aligned; clearly traces logical vs circular vs arithmetic shifts; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 1 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q1,Q26`, `P004-Q7,Q16`, `P005-Q8,Q15a`, `P006-Q16` | 1–8m | U1/U2 `Computer architecture / Von Neumann`, `CPU organization`, `Von Neumann / buses` | All Unmatched | `#von-neumann-architecture-and-cpu-organization` — *Computer Architecture, CPU Organization and Von Neumann Architecture* |
| `P003-Q11,Q14,Q19,Q21`, `P004-Q13`, `P006-Q3,Q5,Q14` | 1–2m | U1/U2 `Buses`, `System bus`, `CPU registers`, `Memory write cycle` | All Unmatched | `#system-bus-cpu-registers-and-memory-write-cycle` — *System Bus (Address, Data, Control), CPU Registers and Memory Write Cycle* |
| `P005-Q20a,b`, `P006-Q21` | 8m, 8m | U4/U3 `Number representation / DMA`, `Number representation` | `Q20` Unmatched; `Q21` redirect | `#number-representation-fixed-point-and-twos-complement` — *Number Representation: Fixed-Point and 2's Complement* |
| `P003-Q20`, `P004-Q21a,Q22b`, `P005-Q5` | 1–8m | U2/U4 `Floating point / IEEE 754`, `IEEE-754 / floating point` | All Unmatched | `#floating-point-and-ieee-754` — *Floating-Point Representation, Biased Exponent and IEEE-754 Standard* |
| `P003-Q3` | 1m | U2 `Digital logic / parity` | Unmatched | `#digital-logic-parity-and-error-codes` — *Digital Logic Parity Bit and Error-Detecting Codes* |
| `P003-Q6,Q34a`, `P005-Q13`, `P006-Q22a` | 1–8m | U2/U3/U4 `Shift operations`, `Micro-operations`, `Shifts / Booth algorithm` | Redirect / Unmatched | `#micro-operations-and-shift-operations` — *Register Transfer, Micro-Operations and Arithmetic Shift Right (ASR)* |
