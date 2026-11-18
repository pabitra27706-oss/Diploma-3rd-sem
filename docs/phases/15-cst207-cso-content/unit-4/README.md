# CST207 Unit 4 — Assembly Language Programming

> **Target file:** `subjects/CST207/units/unit-4.html` (current: `6,971w` [severely over-weighted #2 CSO page] → target: **`~3,400–3,900w` [lean, 100% syllabus-complete reference]**)  
> **Syllabus (`syllabus.json`, PDF p. 10):** **9 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`4 / 385` marks (`1.0%`, #5 in CSO — ONLY TWO 2-MARK MCQs, ZERO 8-MARK QUESTIONS ACROSS ALL 4 PAPERS!)** · avg **`1.0m/paper`** · **`2/4` papers** · **`4m` MCQ + `0m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#simple-programs`, `#branch-call`  
> **Existing `<section id>`s to preserve (17):** `overview`, `simple-programs`, `logical-programs`, `branch-call`, `sorting`, `expressions`, `strings`, `directives`, `procedures`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` (add `3` strictly ALP-scoped `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 10)
- **Data Transfer & Arithmetic Programs:** Simple 8086 assembly language programs (`MOV`, `XCHG`, `ADD`, `ADC`, `SUB`, `SBB`, `INC`, `DEC`, `MUL`/`IMUL`, `DIV`/`IDIV`).
- **Logical & Bit Programs:** `AND`, `OR`, `XOR`, `NOT`, `NEG`, `TEST`, `SHL`/`SAL`, `SHR`, `SAR`, `ROL`, `ROR`, `RCL`, `RCR`.
- **Branch, Loop & Call:** Unconditional `JMP`, conditional jumps (`JZ`/`JE`, `JNZ`/`JNE`, `JC`/`JNC`, `JA`/`JB`, `JG`/`JL` after `CMP`), `LOOP`, subroutine `CALL` & `RET`.
- **Sorting, Expressions & Strings:** Byte-array sorting, arithmetic expression evaluation, and string instructions (`MOVSB/W`, `CMPSB/W`, `SCASB/W`, `LODSB/W`, `STOSB/W`, `REP`/`REPE`/`REPNE`, `CLD`/`STD`).
- **Directives, Procedures & Macros:** Assembler directives (`DB`, `DW`, `DD`, `EQU`, `ORG`, `SEGMENT`/`ENDS`, `ASSUME`, `OFFSET`, `PTR`, `PROC`/`ENDP`, `END`), `NEAR`/`FAR` procedures, and `MACRO`/`ENDM`.

---

## 2. Current Page Audit & Defects (`subjects/CST207/units/unit-4.html`)
- **Live metrics:** `6,971` words (21.6% of CSO's words spent on **1.0%** of its exam marks!) · **`0` `<pre>` blocks** (assembly rendered in unsemantic divs) · `8` `<table>`s · `0` `<svg>`s · `15` MCQs · `8` short Qs · `5` long Qs · `0` YouTube links.
- **Concept-section word split today:** `#simple-programs` `388w`, `#logical-programs` `260w`, `#branch-call` `321w`, `#sorting` `252w`, `#expressions` `307w`, `#strings` `366w`, `#directives` `229w`, `#procedures` `267w` (`2,390w` concept + **`4,581w` of oversized practice/comparison padding**!).
- **Revision-sheet defect:** `docs/revision-sheets/CST207.json` currently has **0 entries** for Unit 4 (`U1:3, U2:1, U3:2, U4:0, U5:2`) — add 1 crisp sourced Unit 4 entry.
- **Stored-unit trap:** `_data/CST207/` tagged `24` questions as `unit: 4`, of which `22` are actually Unit 2 (Pipelining, RISC/CISC, Flynn, Control Memory), Unit 3 (8086 arch/addressing), Unit 1 (IEEE-754, 2's comp), and Unit 5 (DMA, VM, Cache). Keep non-ALP keywords completely out of Unit 4 headings so all 22 redirect smoothly to their real units.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`4m`)

| Topic Cluster | Marks | % of U4 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Basic 8086 data-transfer & arithmetic instructions (`MOV`, `ADD`)** | **4m** | **100.0%** | 1.0% | 2/4 | **Tier C** | `P004-Q5` (2m `MOV` copies source to destination leaving source unchanged, no flags changed); `P005-Q3` (2m basic 8086 `MOV`/`ADD` register operation) |
| **Logical, branch/call, sorting, expressions, string ops, directives, procedures & macros** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 10), 0 marks across all 4 `2023–2026` papers — compact, complete reference_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint (Trim ~48%, Keep 100% Syllabus)

Add a brief, transparent study-guidance note in `#overview`: Unit 4 covers the complete 8086 ALP syllabus in a fast-scan reference format sized to its recent MCQ weight, while pointing students to Units 1, 2, 3, and 5 for Group B priorities. Render every ALP listing inside clean `<pre><code>` tags with inline `;` comments:

### 4.1 `#simple-programs` [LOCKED] — `MOV`, Arithmetic & Exam MCQ Rules (Tier C · ~22% prose)
- Highlight tested operand/flag rules up front (`P004-Q5`, `P005-Q3`):
  - `MOV dst, src`: copies `src → dst`, **`src` remains unchanged**, **zero flags affected**; illegal forms: `MOV [M1], [M2]`, `MOV CS, imm`, `MOV DS, imm` (load via `AX`), size mismatch `MOV AX, BL`.
  - `ADD`/`ADC`, `SUB`/`SBB`, `INC`/`DEC` (`INC`/`DEC` preserve `CF`), unsigned `MUL`/`DIV` vs signed `IMUL`/`IDIV` (implicit `AL→AX` and `AX→DX:AX`), updating `CF, ZF, SF, OF, PF, AF`.
- Two crisp commented `<pre><code>` programs: 8-bit add with carry and 16-bit two-number addition storing result in memory.

### 4.2 Seven Compact Tier S Reference Sections (~63% prose, ~200–260w + 1 `<pre><code>`/table each)
- **`#logical-programs`:** `AND` (clear/mask bits), `OR` (set bits), `XOR` (flip bits; `XOR AX, AX` zeroes `AX` & clears `CF/OF`), `NOT` (1's comp, no flags), `NEG` (2's comp), `TEST` (non-destructive `AND`), `SHL/SHR/SAR/ROL/ROR` + 6-line mask snippet.
- **`#branch-call` [LOCKED]:** `JMP` vs `CMP` + conditional jumps (`JZ/JNZ`, `JC/JNC`, unsigned `JA/JB`, signed `JG/JL`), `LOOP label` (`CX ← CX - 1; if CX != 0 jump`), `CALL`/`RET` pushing/popping `IP` (`NEAR`) or `CS:IP` (`FAR`) + 8-line array-max loop.
- **`#sorting`:** One clean 14-line ascending byte-array Bubble Sort (`CH`/`CL`, `SI`, `CMP`, `JBE`, `XCHG`).
- **`#expressions`:** One clean 10-line evaluation of `Z = (A + B) * (C - D)` storing 16-bit product.
- **`#strings`:** `DS:SI` → `ES:DI`, `CLD` (`DF=0` auto-inc) vs `STD` (`DF=1` auto-dec), 5-row table of `MOVSB, CMPSB, SCASB, LODSB, STOSB` + `REP/REPE/REPNE`, and 6-line `REP MOVSB` block copy.
- **`#directives`:** Instruction vs Directive note + compact table of `DB, DW, DD, EQU, ORG, SEGMENT/ENDS, ASSUME, OFFSET, PTR, PROC/ENDP, END`.
- **`#procedures`:** Minimal `PROC NEAR ... RET ... ENDP` vs `MACRO ... ENDM` + 6-row **Procedure vs Macro** comparison table (memory size, speed, `CALL/RET` stack overhead, parameter passing).

### 4.3 Practice, Revision & Revision-Sheet Addition (~15% prose)
- Trim bloated `15 MCQ / 8 short / 5 long` down to `6` high-signal MCQs, `3` short answers (`MOV` rules, directives, Procedure vs Macro), and `2` compact worked ALP questions; add 1 sourced Unit 4 card to `docs/revision-sheets/CST207.json`.

---

## 5. ALP Blocks & Comparison Tables Checklist
- [ ] **Semantic `<pre><code>` 8086 listings (7 concise, register-traced):** 16-bit addition; bit-masking (`AND`/`OR`/`XOR`); array largest (`CMP`/`LOOP`); byte Bubble Sort; `(A+B)*(C-D)`; `REP MOVSB` block transfer; `PROC` vs `MACRO` pair.
- [ ] **Comparison tables (3):** Machine Instruction vs Assembler Directive; `NEAR` vs `FAR` Procedure; Procedure (`PROC`) vs Macro (`MACRO`); Conditional Jumps (unsigned `JA/JB` vs signed `JG/JL`).

---

## 6. Revision-Sheet & Practice Cross-Links (`CST207` — Theory-Only)
- **Fix missing Unit 4 revision card:** Add `1` sourced entry in `docs/revision-sheets/CST207.json` summarizing `MOV`/`ADD` flag rules, key directives, and Procedure vs Macro, pointing to `#simple-programs` and `#procedures`.
- Cross-link back to Unit 3 `#registers` and `#addressing` for operand/flag reference.

---

## 7. YouTube Video Curation Slot (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | 8086 Assembly Language Crash Course: `MOV`/`ADD`, Jumps/`LOOP`, Directives & `PROC` vs `MACRO` | **Tier C/S** (`4m`) | `#simple-programs` | Concise single-video overview (15–30 min); accurate MASM/8086 syntax; plain `<a>`, zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 4 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P004-Q5`, `P005-Q3` | 2m, 2m | U2 `Assembly / data representation`; U4 `8086 instructions / assembly` | `Q5` redirected to U1; `Q3` same-unit → `#simple-programs` | `#8086-assembly-mov-and-add-instructions` — *8086 Assembly Language Instructions: `MOV`, `ADD` and Arithmetic Programs* |
| _(Tier S locked anchor)_ | 0m | Syllabus Branch/Loop/Call | Preserved `#branch-call` | `#8086-branch-loop-call-and-ret` — *8086 Conditional Jumps, `LOOP`, `CALL` and `RET`* |
| _(Tier S reference)_ | 0m | Syllabus Directives & Subroutines | Preserved `#directives`, `#procedures` | `#8086-assembler-directives-procedures-and-macros` — *Assembler Directives, Procedures and Macros* |
| _(22 mis-tagged `unit: 4` PYQs)_ | — | Pipelining, RISC/CISC, Flynn, Control Memory, 8086 BIU, IEEE-754, DMA | Redirect cleanly to U1, U2, U3, U5 | Keep those non-ALP tokens strictly out of Unit 4 `<h2>`/`<h3>` headings |
