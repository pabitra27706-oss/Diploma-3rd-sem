# CST207 Unit 5 — Memory and Digital Interfacing

> **Target file:** `subjects/CST207/units/unit-5.html` (current: `7,687w` → target: **`~7,400–8,200w` [rebalanced onto the `110m` Memory + DMA core]**)  
> **Syllabus (`syllabus.json`, PDF p. 10):** **15 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0`)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`110 / 385` marks (`28.6%`, CO-#1 HIGHEST-WEIGHT UNIT IN CSO — #1 IN MCQs AT `41m`!)** · avg **`27.5m/paper`** · **`4/4` papers** · **`41m` MCQ + `69m` 8m-subparts** (`2021–2022` `P001`/`P002` excluded)  
> **Locked `guides.json` anchors (must preserve):** `#cache-memory`, `#virtual-memory`  
> **Existing `<section id>`s to preserve (14):** `overview`, `address-decoding`, `memory-interfacing`, `ppi-8255`, `cache-memory`, `virtual-memory`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s:** `0` (add `6` clean semantic `<h3 id>` anchors)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 10)
- **Memory Hierarchy & Main Memory:** Memory hierarchy pyramid (registers, cache, main memory, secondary/archival); Semiconductor RAM (`SRAM`, `DRAM`) and ROM (`ROM`, `PROM`, `EPROM`, `EEPROM`/Flash); memory chip organization (`2^a × d`) and capacity expansion.
- **Address Decoding & Digital Interfacing:** Full vs partial/linear address decoding (e.g., 74LS138); interfacing RAM, ROM, and EPROM with microprocessor; Programmable Peripheral Interface (**Intel 8255 PPI** — Ports A/B/C, Modes 0/1/2, BSR & I/O control word).
- **Cache Memory:** Locality of reference; Hit & Miss ratio; Average / Effective Access Time (EAT); Cache mapping techniques (**Direct**, **Fully Associative**, **Set-Associative**); Replacement & Write policies (**Write-Through**, **Write-Back**).
- **Virtual Memory:** Logical/virtual address space vs physical memory space; **Paging** & Page Table; **Translation Lookaside Buffer (TLB)**; Page faults and **FIFO / LRU** page replacement algorithms.

> **Syllabus-Boundary Note:** Direct Memory Access (**DMA**) is not printed as a separate bullet in PDF p. 10, yet scored **`10m` across `3/4` papers** (`P003-Q18,Q25,Q33`, `P004-Q20b`, `P005-Q20c`) — cover thoroughly via an explicitly badged **Tier E** subsection.

---

## 2. Current Page Audit & Gaps (`subjects/CST207/units/unit-5.html`)
- **Live metrics:** `7,687` words · `0` `<pre>` blocks · `13` `<table>`s · **`0` `<svg>`s** · `0` `<h3 id>`s · `12` MCQs · `10` short Qs · `7` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#address-decoding` `431w`, `#memory-interfacing` `537w`, `#ppi-8255` `495w` (**`1,463w` on `0m`!**) vs `#cache-memory` `547w`, `#virtual-memory` `519w` (**only `1,066w` on `84m`!**).
- **Specific gaps & rebalancing fixes:**
  1. **Flip the 0m-vs-110m ratio:** Condense `#address-decoding`, chip-interfacing prose, and `#ppi-8255` to crisp ~200w **Tier S** reference blocks (preserving all 3 `<section id>`s), freeing full space for `#cache-memory` (`51m`), `#virtual-memory` (`33m`), Memory Hierarchy/SRAM-DRAM (`16m`), and badged **Tier E DMA** (`10m`).
  2. Add worked **Cache EAT numericals** for both `t_c = 8 ns, t_m = 65 ns` (`P003-Q28b`) and `t_c = 8 ns, t_m = 80 ns` (`P004-Q19b`), showing both simultaneous and sequential formulas, plus Write-Through vs Write-Back (`P005-Q19b`).
  3. Add the exact **18-step frame-by-frame FIFO & LRU Page-Replacement tables** on `5, 0, 2, 1, 0, 3, 0, 2, 4, 3, 0, 3, 2, 1, 3, 0, 1, 5` (`P005-Q18a,b`) plus TLB lookup SVG (`P003-Q33`, `P006-Q24`).
  4. Resolve **11 unmatched Unit 5 PYQs** (`Cache / hit ratio`, `Cache mapping / write policy`, `Paging`, `Page replacement`, `I/O / DMA`, `Addressing / memory size`) and **3 wrong-unit redirects** (`P004-Q9,Q14`, `P006-Q2` → `U3#segmentation`).

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`110m`)

| Topic Cluster | Marks | % of U5 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Cache memory: hit/miss ratio, EAT numericals, 3 mapping methods & write-through vs write-back** | **51m** | **46.4%** | **13.2%** | **4/4** | **Tier A** | `P003-Q7,Q10` (2×1m), `P003-Q28a(3m hit/miss),Q28b(5m EAT 8ns/65ns)`, `P003-Q29a(3m mapping),Q29b(5m direct + disadvantage)`; `P004-Q11,Q12` (2×2m), `P004-Q19a(4m mapping),Q19b(4m EAT 8ns/80ns)`; `P005-Q6,Q12` (2×2m), `P005-Q19a(5m 3-way compare),Q19b(3m write-through vs back)`, `P005-Q22(2m* hit/miss note)`; `P006-Q8` (2m), `P006-Q20a(5m direct mapping)` |
| **Virtual memory, paging, page table, address math, TLB & LRU/FIFO replacement** | **33m** | **30.0%** | **8.6%** | **4/4** | **Tier A** | `P003-Q15` (1m), `P003-Q33(5m* TLB & VM notes)`; `P004-Q3,Q4,Q6,Q15` (4×2m), `P004-Q20b(2m* VM note)`; `P005-Q2` (2m), `P005-Q18a(4m LRU on 18 refs),Q18b(4m FIFO on 18 refs)`; `P006-Q4` (2m), `P006-Q20b(3m VM)`, `P006-Q24(2m* TLB note)` |
| **Memory hierarchy, SRAM vs DRAM, ROM types & `2^a × d` chip capacity** | **16m** | 14.5% | 4.2% | 3/4 | **Tier B** | `P003-Q2,Q12,Q13,Q23` (4×1m); `P004-Q9,Q10,Q14` (3×2m); `P006-Q2,Q13` (2×2m), `P006-Q24(2m* Memory hierarchy note)` |
| **Direct Memory Access (DMA) controller & transfer modes** | **10m** | 9.1% | 2.6% | 3/4 | **Tier E** | `P003-Q18,Q25` (2×1m), `P003-Q33(3m* DMA note)`; `P004-Q20b(2m* DMA note)`; `P005-Q20c(3m what is DMA)` |
| **Address decoding, RAM/ROM/EPROM interfacing & Intel 8255 PPI** | **0m** | 0.0% | 0.0% | 0/4 | **Tier S** | _Syllabus-listed (p. 10), 0 marks across all 4 `2023–2026` papers — compact summaries_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#cache-memory` [LOCKED] — Hit Ratio, EAT, Mapping & Write Policies (Tier A · ~38% prose)
- Temporal & spatial locality; transfer granularity (**word** CPU↔Cache vs **block/line** Cache↔Main Memory — `P004-Q11`).
- **Hit ratio `h = N_hit / (N_hit + N_miss)`**, miss ratio `1 - h`, miss penalty, and both textbook **EAT formulas** (`T_avg = h·t_c + (1 - h)·t_m` simultaneous vs `T_avg = t_c + (1 - h)·t_m` sequential), worked step-by-step on **`t_c = 8 ns, t_m = 65 ns`** (`P003-Q28b`) and **`t_c = 8 ns, t_m = 80 ns`** (`P004-Q19b`).
- **Three Cache Mapping Techniques** (`P003-Q29`, `P004-Q19a`, `P005-Q19a`, `P006-Q20a`):
  1. **Direct Mapping:** `i = j mod M`, address split `[Tag | Line | Word]`, concrete bit-field numerical, key drawback = **conflict misses (thrashing)** when two active blocks share a line.
  2. **Fully Associative Mapping:** `[Tag | Word]`, any block in any line, expensive parallel CAM tag check.
  3. **`k`-Way Set-Associative Mapping:** `s = j mod S` (`M = S × k`), `[Tag | Set | Word]`, practical L1/L2 sweet spot.
- **8-row 3-Way Mapping Table** + **6-row Write-Through vs Write-Back Table** (dirty bit, bus traffic, coherence, write-allocate note — `P005-Q19b`).

### 4.2 `#virtual-memory` [LOCKED] — Paging, Page Table, TLB & LRU/FIFO (Tier A · ~30% prose)
- Virtual memory motivation, logical address `[Page p | Offset d]` → physical `[Frame f | Offset d]`, worked bit/size math (`35` address bits → `2^35 = 32 GB`, page count & frame count — `P004-Q3,Q4,Q6,Q15`, `P006-Q20b`).
- **Page Table & TLB:** associative cache of recent `(page → frame)` entries, valid/dirty/protection bits, TLB hit (1 memory access) vs TLB miss (2 memory accesses) + EAT-with-TLB formula (`P003-Q15,Q33`, `P005-Q2`, `P006-Q24`).
- Page fault trap sequence + complete **18-column FIFO & LRU Page-Replacement Trace Tables** on `5, 0, 2, 1, 0, 3, 0, 2, 4, 3, 0, 3, 2, 1, 3, 0, 1, 5` (for 3 frames, verified via Python: every hit/fault marked, plus Belady's anomaly note — `P005-Q18a,b`).

### 4.3 Memory Hierarchy, RAM/ROM & Badged Tier E DMA (~22% prose)
- **Memory Hierarchy Pyramid (`16m`):** Registers → L1/L2/L3 Cache → Main Memory (DRAM) → SSD/HDD → Tape (latency, cost/bit, capacity, volatility — `P006-Q2,Q24`); **SRAM vs DRAM** table (`P003-Q13`, `P004-Q9`); ROM/PROM/EPROM/EEPROM table; chip size `2^a × d` & array chip count `(Total_words / Chip_words) × (Word_bits / d)` (`P004-Q10`).
- **Badged Tier E — Direct Memory Access (`10m`):** DMA controller registers (Address, Word Count, Control/Status), handshake `Peripheral → DRQ → DMAC → HOLD → CPU → HLDA → DACK → Memory bus transfer` (`P003-Q18,Q25,Q33`, `P004-Q20b`, `P005-Q20c`), and **Burst vs Cycle-Stealing vs Transparent DMA** table.

### 4.4 Compact Tier S Interfacing (`#address-decoding`, `#memory-interfacing` chip part, `#ppi-8255` · ~10% combined)
- Preserve all three `<section id>`s (~200w each): linear vs full decoding (74LS138), `CS#` + `MEMR#`/`MEMW#` RAM/EPROM hookup, and Intel 8255 Ports A/B/C + Mode 0/1/2 + `D7` BSR/I/O control word bit strip.

### 4.5 Practice & Revision Bank
- `12` MCQs, `5` short answers (`TLB`, `DMA`, `VM`, `Memory Hierarchy`, `Cache Hit/Miss`), and `5` worked 8m model answers.

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (3):** (1) Memory Hierarchy Pyramid + Direct/Associative/Set-Associative address bit splits; (2) Paging + Page Table + TLB address translation; (3) DMA controller `DRQ/DACK` & `HOLD/HLDA` bus transfer.
- [ ] **Python-verified numericals (5):** Cache EAT (`8ns/65ns` & `8ns/80ns`); Direct/Set-Associative tag-set-word bit split; Paging `p+d` & `2^35` address space; 18-step FIFO & LRU page-fault tables; `2^a × d` chip expansion.
- [ ] **Comparison tables (5):** SRAM vs DRAM; Direct vs Associative vs Set-Associative Cache; Write-Through vs Write-Back; FIFO vs LRU; Burst vs Cycle-Stealing vs Transparent DMA.

---

## 6. Revision-Sheet & Practice Cross-Links (`CST207` — Theory-Only)
- Sync both Unit 5 entries in `docs/revision-sheets/CST207.json` (Cache EAT/mapping & Paging/TLB/LRU-FIFO) with `#cache-memory` and `#virtual-memory`.

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Cache Memory: Hit Ratio, EAT & Direct / Associative / Set-Associative Mapping | **Tier A** (`51m`) | `#cache-memory` | Derives `[Tag \| Line/Set \| Word]` bit counts & EAT numericals; 20–35 min; verify live |
| **2** | Cache Write Policies (Write-Through vs Write-Back) & Replacement | **Tier A** (sub-cluster) | `#cache-memory` | Covers dirty bit, write-allocate, and bus bandwidth clearly; 10–18 min; plain `<a>` |
| **3** | Virtual Memory, Paging, Page Table, TLB & FIFO / LRU Page Replacement | **Tier A** (`33m`) | `#virtual-memory` | Works full FIFO & LRU reference-string tables + TLB hit/miss; 20–35 min; verify live |
| **4** | Memory Hierarchy (SRAM vs DRAM) & Direct Memory Access (DMA Modes) | **Tier B/E** (`26m`) | `#memory-interfacing` | Covers `HOLD`/`HLDA` bus cycle stealing & burst transfer; 15–25 min; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 5 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P004-Q9,Q10,Q14`, `P006-Q2` | 2,2,2,2m | U2 `Memory organization`, `Addressing / memory size`, `Memory hierarchy` | 3 **wrong redirects** → `U3#segmentation` + `Q10` Unmatched | `#memory-hierarchy-organization-and-memory-size` — *Memory Hierarchy, Memory Organization (SRAM vs DRAM) and Memory Size* |
| `P003-Q28`, `P004-Q11`, `P005-Q6` | 8,2,2m | U3 `Cache / hit ratio`; U3 `Cache / data transfer` | All 3 Unmatched | `#cache-hit-ratio-data-transfer-and-eat` — *Cache Hit Ratio, Data Transfer and Average Access Time (EAT)* |
| `P005-Q19`, `P003-Q29`, `P006-Q20a` | 8,8,5m | U3 `Cache mapping / write policy`; U3 `Cache mapping` | `P005-Q19` Unmatched | `#cache-mapping-and-write-policy` — *Cache Mapping (Direct, Associative, Set-Associative) and Write Policy* |
| `P004-Q4,Q15`, `P005-Q2`, `P003-Q33` | 2,2,2,8m | U3 `Paging`; U3 `Paging / address space`; U3 `Virtual memory / TLB` | `Q4,Q15` Unmatched | `#virtual-memory-paging-address-space-and-tlb` — *Virtual Memory, Paging, Address Space, Page Table and TLB* |
| `P005-Q18` | 8m | U3 `Page replacement` | Unmatched | `#fifo-and-lru-page-replacement` — *Page Replacement Algorithms: FIFO and LRU* |
| `P003-Q18,Q25`, `P004-Q20b`, `P005-Q20c` | 1,1,4,3m | U5/U4 `I/O / DMA`, `CISC/RISC / DMA / VM`, `Number representation / DMA` | All Unmatched | `#io-and-direct-memory-access-dma` — *I/O and Direct Memory Access (DMA) Controller (Exam Note)* |
