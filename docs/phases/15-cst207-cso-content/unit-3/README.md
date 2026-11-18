# CST207 Unit 3 — CPU Architecture (Intel 8086 & Instruction Formats)

> **Target file:** `subjects/CST207/units/unit-3.html` (current: `6,662w` → target: **`~6,400–7,000w`**)  
> **Syllabus (`syllabus.json`, PDF p. 10):** **10 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`78 / 385` marks (`20.3%`, #4 in CSO — right beside U1 at `21.0%`)** · avg **`19.5m/paper`** · **`4/4` papers** · **`16m` MCQ + `62m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#block-diagram`, `#addressing`  
> **Existing `<section id>`s to preserve (15):** `overview`, `block-diagram`, `registers`, `segmentation`, `interrupts`, `addressing`, `instructions`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` (add `5` clean semantic `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 10)
- **CPU Organization & Formats:** General register organization & stack organization; Instruction formats (Three-, Two-, One-, and Zero-Address instructions); CPU addressing modes.
- **Intel 8086 Architecture & Pinout:** Key features (16-bit ALU/data bus, 20-bit address bus, 1 MB space, 6-byte queue); Internal architecture (**BIU** & **EU**); Register set (GPRs `AX–DX`, Segment `CS/DS/SS/ES`, Pointer/Index `SP/BP/SI/DI/IP`, 16-bit Flag/Status register); 40-pin DIP configuration; **Minimum Mode (`MN/MX# = 1`)** and **Maximum Mode (`MN/MX# = 0`)**.
- **Segmentation, Addressing, Instruction Set & Interrupts:** 20-bit physical address (`Segment × 10H + Offset`); 8086 addressing modes; 8086 instruction groups overview; hardware/software/exception interrupts & IVT.

---

## 2. Current Page Audit & Gaps (`subjects/CST207/units/unit-3.html`)
- **Live metrics:** `6,662` words · `0` `<pre>` blocks · `12` `<table>`s · **`0` `<svg>`s** · `0` `<h3 id>`s · `15` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#block-diagram` `530w`, `#registers` `370w`, `#segmentation` `236w`, `#interrupts` `331w`, `#addressing` `304w`, `#instructions` `529w` (`2,300w` concept prose; plus `4,278 B` inline `<style>` — highest in CSO).
- **Specific gaps to fix:**
  1. **84.6% (`66 / 78m`) of Unit 3 hits just two `4/4`-paper questions:** (a) 8086 BIU/EU block diagram + 40-pin diagram + Min/Max modes (`39m`), and (b) 8086 addressing modes (`27m`, currently only `304w`!). Expand `#addressing` with an 8-mode master table, `<pre><code>` instruction examples, and hex Effective Address numericals (`P006-Q12`).
  2. **Zero SVGs (`0`):** Add crisp, printable inline SVGs for the **8086 BIU/EU Internal Architecture** and the **8086 40-Pin DIP Pinout** (with Min vs Max pins `24–31` side by side).
  3. Add the exact **Zero-Address (Stack) evaluation of `X = (A + B) * (C + D)`** contrasted with 1-, 2-, and 3-address code (`P004-Q17b`).
  4. Resolve unmatched `P003-Q17`, `P004-Q21b`, `P006-Q19` and wrong redirect `P006-Q6` (`Status register` → `U1#register-transfer`), and ensure `#segmentation` headings focus on *Memory Segmentation* so Unit 5 *Memory Hierarchy* PYQs stop colliding.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`78m`)

| Topic Cluster | Marks | % of U3 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **8086 internal architecture (BIU & EU), 40-pin diagram & Min vs Max mode** | **39m** | **50.0%** | **10.1%** | **4/4** | **Tier A** | `P003-Q27b(4m BIU & EU)`, `P003-Q32a(4m 8086 pin diagram),Q32b(4m Max & Min mode)`; `P004-Q18a(4m Min vs Max mode)`, `P004-Q21b(6m 8086 arch + pin diagram)`; `P005-Q10` (2m), `P005-Q17a(5m 8086 internal arch)`; `P006-Q15` (2m), `P006-Q19a(5m BIU & EU),Q19b(3m Max & Min modes)` |
| **8086 & CPU addressing modes (with instruction examples & EA)** | **27m** | **34.6%** | **7.0%** | **4/4** | **Tier A** | `P003-Q24` (1m), `P003-Q30b(4m addressing modes w/ ex)`; `P004-Q18b(4m any 4 8086 modes w/ ex)`; `P005-Q1,Q7` (2×2m), `P005-Q15b(4m 8086 modes)`; `P006-Q12` (2m EA), `P006-Q17a(2m define),Q17b(6m 8086 modes w/ ex)` |
| **Instruction formats & zero-address stack instructions** | **7m** | 9.0% | 1.8% | 2/4 | **Tier C** | `P003-Q17` (1m stack `PUSH`/`POP`); `P004-Q2` (2m zero-address), `P004-Q17b(4m zero-address code for X=(A+B)*(C+D))` |
| **8086 interrupts & status/control flag register** | **5m** | 6.4% | 1.3% | 2/4 | **Tier C** | `P005-Q17b(3m types of interrupts)`; `P006-Q6` (2m status/flag register) |
| **8086 segmentation (`PA = Seg × 10H + Offset`) & 1/2/3-address comparison** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 10), 0 direct hits in 2023–2026 — keep crisp & complete_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#block-diagram` [LOCKED] & `#registers` — BIU/EU, Registers, 40-Pin DIP & Min/Max (Tier A · ~46% prose)
- 8086 core specs box (`16-bit` ALU/data bus, `20-bit` address bus = `2^20 = 1 MB`, `6-byte` FIFO prefetch queue, pipelined fetch/execute overlap, `40-pin` DIP, `+5V` — `P005-Q10`, `P006-Q15`).
- Labelled **BIU & EU Internal Architecture SVG** + **BIU vs EU Table** (`P003-Q27b`, `P004-Q21b`, `P005-Q17a`, `P006-Q19a`):
  - **BIU:** `CS, DS, SS, ES`, `IP`, 20-bit address summer `Σ`, 6-byte instruction queue, external bus control.
  - **EU:** 16-bit ALU, `AX (AH:AL)`, `BX`, `CX`, `DX` (with special implicit roles), `SP, BP, SI, DI`, 16-bit **Flag/Status Register** (6 conditional status flags `CF, PF, AF, ZF, SF, OF` + 3 control flags `TF, IF, DF` with bit-position strip — `P006-Q6`), control/decoder.
- Labelled **40-Pin 8086 DIP Pinout SVG** + grouped signal table: multiplexed `AD0–AD15`, `A16/S3–A19/S6`, `BHE#/S7`, `RD#`, `READY`, `INTR`, `NMI`, `TEST#`, `RESET`, `CLK`, `MN/MX#` (pin 33), and **pins 24–31** in Min mode (`INTA#, ALE, DEN#, DT/R#, M/IO#, WR#, HLDA, HOLD`) vs Max mode (`QS1, QS0, S0#, S1#, S2#, LOCK#, RQ#/GT1#, RQ#/GT0#` + 8288 bus controller) (`P003-Q32a`, `P004-Q21b`).
- 7-row **Minimum Mode vs Maximum Mode Comparison Table** (`P003-Q32b`, `P004-Q18a`, `P006-Q19b`).

### 4.2 `#addressing` [LOCKED] — Intel 8086 Addressing Modes (Tier A · ~28% prose)
- Definition & why multiple addressing modes exist (`P006-Q17a`).
- **Master 8086 Addressing Modes Table** (`P003-Q24,Q30b`, `P004-Q18b`, `P005-Q1,Q7,Q15b`, `P006-Q12,Q17b`) with `<pre><code>` example, default segment, and hex EA trace (assuming `DS=2000H, BX=0300H, SI=0040H`):
  1. Immediate (`MOV AX, 1234H`) · 2. Register (`MOV AX, BX`) · 3. Direct (`MOV AX, [5000H]`) · 4. Register Indirect (`MOV AX, [BX]`) · 5. Based (`MOV AX, [BX+08H]`) · 6. Indexed (`MOV AX, [SI+08H]`) · 7. Based-Indexed (`MOV AX, [BX+SI]`) · 8. Based-Indexed with Displacement (`MOV AX, [BX+SI+10H]`), plus Implied (`CLC`/`STC`), Relative branch, and I/O Port (`IN`/`OUT`).

### 4.3 `#instructions` — Stack Organization & 0/1/2/3-Address Formats (Tier C + Tier S · ~11% prose)
- Register/memory stack (`SP`, `PUSH`, `POP` — `P003-Q17`) and full side-by-side `<pre><code>` evaluation of **`X = (A + B) * (C + D)`** in **Zero-Address (Stack)** (`PUSH A; PUSH B; ADD; PUSH C; PUSH D; ADD; MUL; POP X` — `P004-Q2,Q17b`) alongside Tier S 1-Address, 2-Address, and 3-Address programs + 6-category 8086 instruction overview.

### 4.4 `#interrupts` (Tier C · ~8%) & `#segmentation` (Tier S · ~7%)
- `#interrupts`: Hardware (`NMI` non-maskable Type 2 vs `INTR` maskable via `IF`/`STI`/`CLI`), Software (`INT 00H–FFH`), and Exceptions (Type 0 divide error, Type 1 single-step, Type 3 breakpoint, Type 4 `INTO`), plus IVT at `00000H–003FFH` (`256 × 4B` `IP:CS`) (`P005-Q17b`).
- `#segmentation`: four 64 KB segments, default offset pairs (`CS:IP`, `DS:BX/SI/DI`, `SS:SP/BP`, `ES:DI`), and `PA = Segment × 10H + Offset` worked hex example (`CS=348AH, IP=4214H → PA=38AB4H`).

### 4.5 Practice & Revision Bank
- `8` MCQs, `4` short answers, and `5` worked 8m model answers (`BIU/EU + Min/Max`, `8086 Arch + 40-Pin`, `8086 Addressing Modes`, `Zero-Address X=(A+B)*(C+D) + Interrupts`, `Registers/Flags + Segmentation`).

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (3):** (1) Intel 8086 BIU & EU Internal Architecture; (2) Intel 8086 40-Pin DIP Package (with dual Min/Max labels on pins 24–31); (3) 16-bit 8086 Flag Register bit layout (`OF, DF, IF, TF, SF, ZF, AF, PF, CF`).
- [ ] **Worked `<pre><code>` & hex traces (3):** 8 addressing-mode EA + PA hex computations; `X = (A+B)*(C+D)` in 0/1/2/3-address code; `PA = CS × 10H + IP` calculation.
- [ ] **Comparison tables (4):** BIU vs EU; Minimum Mode vs Maximum Mode; 8-row 8086 Addressing Modes; 0- vs 1- vs 2- vs 3-Address formats; `NMI` vs `INTR` vs `INT n`.

---

## 6. Revision-Sheet & Practice Cross-Links (`CST207` — Theory-Only)
- Keep both Unit 3 entries in `docs/revision-sheets/CST207.json` (8086 BIU/EU/modes & addressing/PA formula) synced with `#block-diagram` and `#addressing`; cross-link Unit 4 `#simple-programs` for concise ALP syntax.

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Intel 8086 Internal Architecture (BIU & EU), Registers & 16-Bit Flag Register | **Tier A** (`39m`) | `#block-diagram` | Draws full BIU/EU split, 6-byte queue, and all 9 flags accurately; verify live |
| **2** | Intel 8086 40-Pin Diagram & Minimum Mode vs Maximum Mode Operation | **Tier A** (sub-cluster) | `#block-diagram` | Structured pin-group explanation incl. pins 24–31 & 8288; 15–30 min; plain `<a>` |
| **3** | 8086 Addressing Modes (with Effective Address) & 0/1/2/3-Address Instructions | **Tier A/C** (`34m`) | `#addressing` | Works hex EA examples & stack evaluation of `(A+B)*(C+D)`; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 3 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P006-Q19`, `P004-Q21b`, `P003-Q32`, `P005-Q10,Q17`, `P006-Q15` | 2–8m | U2/U4/U5 `8086 BIU / EU / modes`, `8086 / pinout`, `8086 architecture` | `P006-Q19` Unmatched; others redirect | `#8086-architecture-biu-eu-pinout-and-modes` — *Intel 8086 Architecture: BIU, EU, 40-Pin Pinout and Minimum / Maximum Modes* |
| `P006-Q6`, `P005-Q17b` | 2m, 3m | U2 `Status register`; U2 `8086 / interrupts` | `Q6` wrong redirect → `U1#register-transfer` | `#8086-status-register-flags-and-interrupts` — *8086 Status (Flag) Register and Interrupts* |
| `P003-Q24,Q30b`, `P004-Q18`, `P005-Q1,Q7,Q15b`, `P006-Q12,Q17` | 1–8m | U2/U3/U4 `Addressing modes` / `8086 / addressing modes` | Redirect/same → `U3#addressing` | `#8086-addressing-modes-and-effective-address` — *8086 Addressing Modes and Effective Address Calculation* |
| `P003-Q17`, `P004-Q2,Q17b` | 1,2,4m | U2 `Memory / CPU / stacks`; U2 `Instruction formats`; U2 `Instruction cycle / stack instructions` | `Q17` Unmatched | `#instruction-formats-and-zero-address-stack-instructions` — *Instruction Formats and Zero-Address CPU Stack Instructions* |
| _(Collision fix)_ | — | `#segmentation` `<h2>` heading | Attracted U5 `Memory hierarchy` PYQs | `#8086-segmentation-and-physical-address` — *8086 Segment Registers and 20-Bit Physical Address* |
