# Phase 15 Record — Computer System Organization

**Engineering complete 2026-11-19; owner device sign-off pending.** Branch
`arena/fbc84d5d-diploma-3rd-sem`, based on `e83cd64` (PR #28 merge). No Phase 15
PR, merge, Pages change or deployment. All weighting is limited to P003–P006:
103 questions and 385 printed set marks. P001/P002 remain archived and were
not used for weight calculations. Mode A: `_data/` and `_quiz-data/` are byte-identical.

## Measured delivery ledger

Words are whitespace-delimited visible main-source tokens including labels and
practice, excluding tags and comments. These are measurements, not budget caps.
Section figures count all on-disk `section[id]`, including one Watch & Learn per
unit: the blueprint counted 74 content sections, plus five Watch & Learn sections
in the live baseline. All 79 survived in their original order.

| Unit | Marks / hours | Words before → after | Runtime sections | Guide locks retained | New h3 IDs | SVG / pre-code | Videos |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: |
| 1 · Structure of Computers | 81m / 6h | 4,363 → 6,138 | 16/16 | `#computer-structure`, `#data-representation` | 6 | 4 / 3 | 3 |
| 2 · Control, Arithmetic & Pipelining | 112m / 20h | 6,667 → 7,829 | 14/14 | `#pipelining`, `#arithmetic` | 5 | 6 / 0 | 4 |
| 3 · Intel 8086 | 78m / 10h | 6,733 → 7,046 | 16/16 | `#block-diagram`, `#addressing` | 5 | 2 / 3 | 3 |
| 4 · Assembly Language Programming | 4m / 9h | 7,046 → 3,336 | 18/18 | `#simple-programs`, `#branch-call` | 3 | 0 / 12 | 1 |
| 5 · Memory and Digital Interfacing | 110m / 15h | 7,759 → 7,972 | 15/15 | `#cache-memory`, `#virtual-memory` | 6 | 5 / 0 | 4 |
| **Total** | **385m / 60h** | **32,568 → 32,321** | **79/79** | **10/10** | **25** | **17 / 18** | **15** |

### Revised-2022 syllabus check (PDF p. 10, 22/22 topic lines retained)

- **U1:** `#computer-structure` covers functional units, Von Neumann, buses and basic operation; `#data-representation` and `#error-codes` cover representation/parity; `#register-transfer`, `#micro-operations`, `#alu` cover transfers, micro-operations and the ALSU.
- **U2:** `#microprogrammed` covers design/address sequencing/control memory; `#arithmetic` covers integer and floating arithmetic, Booth and division; `#pipelining` covers arithmetic, instruction and RISC pipelines; `#vector` covers vectors and arrays.
- **U3:** `#instructions` covers ISA and operand-field formats; `#block-diagram`, `#registers`, `#segmentation`, `#interrupts`, `#addressing` cover the remaining silicon and programmer-model scope.
- **U4:** `#simple-programs`, `#logical-programs`, `#branch-call`, `#sorting`, `#expressions`, `#strings`, `#directives` and `#procedures` retain every syllabus topic without treating them as equally weighted. The revision page includes Unit 4.
- **U5:** `#address-decoding`, `#memory-interfacing`, `#ppi-8255`, `#cache-memory`, `#virtual-memory` cover all five lines; DMA explicitly marked as an exam extension.

## 15.1 execution — Unit 1 (starting at `e83cd64`)

- **DEPEND** on existing unit CSS, section folding, responsive table wrapper and Watch & Learn list. **ADAPT** the existing concept boxes, handouts and practice. **STUDY** the accessible inline SVG in CST201 Unit 1 and the section-clipping guard. **BUILD** original vector diagrams and worked RTL/representation traces. **REJECT** embeds, remote thumbnails, search-result placeholders and a CSS change to the resting open state.
- **Tier ledger before editing:** A — architecture/buses 39m, representation 26m; C — RTL/shifts/parity 9m, registers/read-write 7m; S — ALSU 0m. These are the blueprint's reconciled P003–P006 clusters; archived papers excluded. Whole-phase A/B/C/S/E ranking is in the phase README §2.
- **Live baseline correction:** `audit_topic_routing.py --subject CST207 --verbose` on this base reports 24 same-unit / 53 cross-unit / 26 unmatched in-window, not the planning triple. Same-unit means agreement with the stored tag, not correctness. All 77 successful landings are section-level (0 heading-level), including one practice-section false positive, `P006-Q24`. Actual Unit 1 has 16 section IDs, not 15: the blueprint omitted `#videos`; preserve it too.
- **15.1 result:** From 4,363 to 5,753 words (whitespace tokens from main visible source text, comments removed; different from the blueprint counting method), 0→4 SVGs, 0→3 semantic code blocks (two RTL, one bit trace), 0→6 concept headings, both locks and 16/16 runtime section IDs intact. Ten MCQs, five short and four long answers. Independent Python mask and `struct.pack` checks: `10110101`, `C15A0000`, `C02B400000000000`; ASR produces −38. Three public watch pages opened on 2026-11-19: Solid State Tech [Von Neumann](https://www.youtube.com/watch?v=5kH2A40tbIA) 8:20; Neso Academy [IEEE 754 Single and Double Precision](https://www.youtube.com/watch?v=TaDrBnRS0_Q) 10:41; Hira Naqvi [Shift Microoperation](https://www.youtube.com/watch?v=Cy1a0fUxJTw) 37:31. Verification is public page + metadata, not local playback.
- **15.1 routing (matcher only):** 31 same-unit / 57 redirect / 15 unmatched; 29 heading-level / 59 section-level (including one generic false positive). A named heading is not by itself a correct match; exact destinations wait for the authored map. `unitAnchored` 634→640; CST207 order-dependent count 10→15. No learner-visible IDs/code labels or stray backticks found; metadata still correctly uses the subject code in URLs.
- **15.1 gates green:** 157/157 unittest (initial generated index mismatch cleared with the ordered repeat); discovery DOM pass; all 13 README gates pass, including zero PYQ drift; advisory syllabus command exits 0 with the three existing CST205/CST209 findings and CST207 quiz-bank warning. No rendered evidence or site-preview artifact. Base PR #28 is merged; hosted main Web CI run 44480060397 failed at browser smoke, not part of this local result.

## 15.2 execution — Unit 2

- **DEPEND** on the common unit shell, table wrappers and answer toggles. **ADAPT** the existing Booth example, four-instruction timing table and control-memory prose. **STUDY** Unit 1's token-only diagram pattern. **BUILD** checked signed/unsigned register traces and stream diagrams. **REJECT** treating uniform stages or zero stalls as facts about all RISC machines.
- **Tier ledger:** A — pipeline/hazards 37m, control/instruction cycle 24m, Booth/division 20m; B — RISC/CISC 16m, Flynn/vector 15m; S — hardwired comparison, non-restoring, FP arithmetic, array processor (0m as independent topics).
- **15.2 result:** 6,667→8,184 main-text words; 14/14 runtime sections, including videos, and both guide locks preserved; 4 SVGs and 5 new headings. Python computed each register trace and checked both Booth products (10-bit `0001110101` = 117 and `0001100011` = 99) and `divmod(11,3)` = (3,2). Corrected the throughput denominator and distinguished ideal throughput from latency and stalls. Existing practice retained; the new examples are additional worked practice, not additional toggle cards.
- **15.2 videos, public pages fetched 2026-11-19:** Gate Smashers [Pipeline hazards](https://www.youtube.com/watch?v=srlgaJgaxRE) 10:29; Ekeeda [Control Memory](https://www.youtube.com/watch?v=n0dkX_nAiAs) 14:58; Semesters Simplified [Booth’s Algorithm](https://www.youtube.com/watch?v=MeD8iWb8wlo) 7:44; Shanu Kuttan CSE Classes [Flynn’s Classification](https://www.youtube.com/watch?v=qgbt9mrQ7Gs) 18:35 (Hindi).
- **15.2 gates green:** 157/157 unittest, 13/13 README scripts, advisory syllabus, discovery DOM and hygiene. Matcher-only same/redirect/unmatched 40/56/7; `unitAnchored` 640→645, order-dependent count unchanged at 15. No browser evidence.

## 15.3 execution — Unit 3

- **DEPEND** on existing pin/register tables, shared cards and section anchors. **ADAPT** the existing addressing table rather than adding a competing list. **STUDY** the established diagonal-free layouts and existing comparison tables. **BUILD** BIU/EU and DIP figures plus machine-model traces. **REJECT** presenting generic stack-ISA or three-address notation as executable 8086 code and a members-only IVT video.
- **Tier ledger:** A — architecture, pins and modes 39m, addressing 27m; C — zero-address stack 7m, flags and interrupts 5m; S — physical-address reference and 1/2/3-address forms as standalone topics.
- **15.3 result:** 6,733→7,012 words, 16/16 runtime sections and both guide locks, two SVGs, three `<pre><code>` blocks, and five headings. The two-column pin lookup covers all 40 pins and duplicates the diagram for text access. Checked EA `0248H`, PA `30248H` / `12396H`, 20-bit wrap and IVT entry `0084H` → physical `21234H`. The four abstract assembly forms are labelled not assembled; the trace combines 5 and 9 to get 45. Eight MCQs, four short and five long answers retained.
- **15.3 videos, public pages fetched 2026-11-19:** kaasu panam [8086 Architecture Pin Diagram](https://www.youtube.com/watch?v=4csJRRzTxBw) 1:20; Learn Online [Based, Indexed and Based-Indexed Addressing](https://www.youtube.com/watch?v=1iCBqYsSssE) 28:07; Electro-NICKS [Interrupt Vector Table in 8086](https://www.youtube.com/watch?v=BZqffRrcTw0) 8:00. Rejected an Engineering Funda members-only watch page.
- **15.3 gates green:** 157/157 unittest, 13/13 README scripts, advisory syllabus, discovery DOM. Matcher-only 31/65/7; `unitAnchored` 645→650; order-dependent count 15→17. The segmentation heading no longer mentions memory, but the map still must override stored-unit precedence and bad matches.

## 15.4 execution — Unit 4

- **DEPEND** on the static sheet builder and existing practice widgets. **ADAPT** MASM/TASM-style fragments and retain the 18-section structure. **STUDY** Revised-2022 Unit 4's three exact topic phrases and the revision citation schema. **BUILD** compact examples and one cited revision definition. **REJECT** expanding unexamined topics to compete with the weighted units, or claiming assembler execution.
- **Tier ledger:** C — `MOV`/`ADD` basics 4m (two MCQs); S — logical/branch/call, sorting, expressions, strings, assembler directives, procedures and macros (0m).
- **15.4 result:** 7,046→3,336 words (−53%); 18/18 runtime sections and both guide locks preserved, three headings and 12 `<pre><code>` listings. No assembler run; the snippets are labelled classroom fragments and arithmetic was traced. Six MCQs, three short answers and two worked ALP answers. The revision builder emitted 45 entries site-wide, including the new Unit 4 MOV/ADD definition citing the exact Revised-2022 phrase; it is still uncertified. One public watch page fetched 2026-11-19: prashant upadhyay [Assembly Program to Add Two 8-Bit Numbers](https://www.youtube.com/watch?v=IkXn85fMuS4), 25:15.
- **15.4 gates green:** 157/157 unittest, 13/13 README scripts, advisory syllabus, discovery DOM. Matcher-only 33/63/7; `unitAnchored` 650→653; order-dependent count 17→18. Icon subset regenerated after removing unused styles; the unknown-icon guard still passes.

## 15.5 execution — Unit 5

- **DEPEND** on the shared table wrapper, folded section structure and existing cache/virtual-memory locks. **ADAPT** the current address-split examples and 8255 reference. **STUDY** the printed timing and replacement stems (both ask for 90% cache hits; the replacement question specifies three frames). **BUILD** source-labelled SVGs and trace both page-replacement policies. **REJECT** treating a TLB miss as a page fault or presenting one memory timing model as universal.
- **Tier ledger:** A — cache 51m and virtual memory/TLB/replacement 33m; B — hierarchy/chip capacity 16m; E — DMA 10m (exam extension); S — address decoding, RAM/ROM/EPROM interfacing and PPI 0m.
- **15.5 result:** 7,759→8,722 words, 15/15 runtime sections and both locks; six headings, five SVGs. Parallel EATs 13.7/15.2 ns versus sequential 14.5/16 ns; the 18-reference trace gives 15 FIFO faults and 13 LRU faults with three initially empty frames. Also worked: cache address fields, 35-bit paging, TLB EAT, 8-chip expansion, RAM/EPROM selection and DMA handshakes. Original practice bank retained as well as the new worked examples.
- **15.5 videos, public pages fetched 2026-11-19:** PacketPrep [Understanding Associative Mapping](https://www.youtube.com/watch?v=Pg6bqkekAXY) 8:06; Gate Smashers [Least Recently Used Page Replacement](https://www.youtube.com/watch?v=dYIoWkCvd6A) 7:56; PacketPrep [Memory Hierarchy](https://www.youtube.com/watch?v=Ou-D8x72xBc) 8:12; Shanu Kuttan CSE Classes [Direct Memory Access](https://www.youtube.com/watch?v=RLbOHCyhOr4) 19:00 (Hindi).
- **15.5 gates green:** 157/157 unittest, 13/13 README scripts, advisory syllabus and discovery DOM. Matcher-only 35/65/3; `unitAnchored` 653→659; order-dependent count 18→25. Named anchors help, but matcher precedence still causes misroutes.

## 15.6 execution — Mode A map and canonical rebuild

- **DEPEND** on generic map-first lookup and the matched-topic evidence in immutable paper JSON. **ADAPT** CST201/CST203 map/schema and deterministic regression patterns. **STUDY** the actual unequal-mark stems and full-corpus matcher-only output. **BUILD** the CST207 editorial mapping and targeted regressions. **REJECT** rewriting any stored PYQ/quiz data, globally changing fallback weights or document ordering, or inventing a single destination for the unlabelled short-note choice pool.

### Final reconciliations and per-question audit

- Final practice (MCQ / short / long): U1 10/5/4, U2 10/5/6, U3 8/4/5,
  U4 6/3/2, U5 12/5/5. The earlier per-part word counts above describe those
  snapshots, not the final ledger. Final audit also added the instruction-cycle
  and restoring-division flow diagrams, fetch/store and fixed-point traces,
  and a direct link from Von Neumann to processor–memory transfers.
- `scripts/build_topic_map_cst207.py` generates the 82 normalised keys and 36
  decision records. Each unequal-mark composite has a written rationale.
  `P006-Q16` shares a stored label with `P005-Q8`; its common heading explains
  the register path and links straight to the heavier processor–memory part.
  The map records this and the ambiguous stems without modifying their keys.
- [Per-question route evidence](routing-audit.tsv) compares the base matcher,
  the matcher after the content rewrite, and the final map-first route.
  Wrong-unit counts compare the matcher destination to the independently
  selected editorial unit, not to the potentially incorrect stored tag.

| In-window evidence (103 questions) | Base matcher | Rewritten notes, matcher only | Map-first |
| --- | ---: | ---: | ---: |
| Named concept heading (h3 ID) | 0 | 65 | 102 |
| Broad section (non-generic) | 76 | 34 | 0 |
| Generic false positive | 1 | 1 | 0 |
| Unmatched topic or unlabelled choice pool | 26 | 3 | 1, intentionally no jump |
| Wrong-unit collision among matched topics | 28 | 26 | 0 |

The map uses 17 stored units and corrects 85 stale tags at read time. The
single no-jump item is the unlabelled `P006-Q24` four-choice pool; it stays at
the unit overview, not the short-question practice card. Generic `overview-*`
cards alone were 0→0; the non-vacuous metrics are broad-section landings
76→0 and the practice false positive 1→0. The immutable paper store remains the
source of dashboard/PYQ unit filtering, not this map.

### Gate results and limitations

- **159/159 Python tests**; **13/13 README script gates**, plus advisory
  syllabus validation; **14/14 deterministic Node suites**. Integrity: zero
  PYQ drift and no tracked `_data/` or `_quiz-data/` changes. Site strict and
  accessibility: zero findings. Unit heading ratchet 634→659; CST207
  matcher-only order-dependence 10→25 is recorded, not fixed (Phase 17).
- The real JS resolver ran in the Node DOM shim against **all 103 stems**:
  102/102 named, highlighted destinations, with collapsed parents revealed and
  old inline height cleared. Stale-map fallback remains live. Ablations failed
  as expected when removing the no-topic guard, the reveal, or stale-anchor
  verification; independent Python ablations caught a deleted topic and an
  incorrect status-register unit. The focused clipping suite passed 6/6.
- The README canonical builders ran, then the unittest-mutated outputs were
  re-stabilised in search → coverage → icons → presence twice → version order
  with one final search refresh after stable presence changes. The service
  worker shell stamp changed because the resolver is a precached JS asset;
  other subjects' page diffs are generated build stamps, not content edits.
- Source-level checks confirmed 17 named SVGs with title/description, 18
  semantic code blocks, 79 original section IDs, 15 direct YouTube watch links
  and no embed, thumbnail, raw question IDs or subject codes in learner prose.
  Video verification is public-watch-page metadata, not playback.
- No local browser. Source-only 360px estimates put Unit 1 computer structure at 6,464px,
  Unit 2 arithmetic at 8,355px, and Unit 5 cache/paging at 6,339/6,173px
  in the clipping model;
  these are not rendered measurements. The inherited open-state rule is
  uncapped. Long tables, SVG text, scroll/focus and playback still need the
  owner's phone check. Eleven Chromium suites were not run locally, and no
  screenshots or hosted preview artifact are claimed.
- Syllabus advisory still reports three pre-existing groups outside CST207 and
  the expected CST207 no-quiz-bank warning. No question answers or revision
  entries were certified. A marking/ambiguity decision here is navigation only.

**Owner test:** Use the Phase 15 Termux command in `rule.md` §7. Check all five
unit pages, Unit 4 on `revision/CST207.html`, and the “Open topic” link on
an answer page. Test a collapsed target and the unlabelled short-note fallback.
Wait for **mark as pass** or **add for later** before starting another phase.
