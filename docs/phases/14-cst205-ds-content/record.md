# Phase 14 Record — Data Structures

- **Status:** 🚧 Implemented 2026-11-19 on branch `arena/c5ca91cb-diploma-3rd-sem` (base `cdf001c`, Phase 16 PR #30 merge) — **awaiting owner review. Not pushed, no PR, no merge, no deploy.**
- **Syllabus authority:** `CST205` (`3` credits, L–T–P `2-1-0`, `45h = 3+12+15+15` across **4 official units**, PDF p. 7); paired lab `CST215` (`2` credits, `0-0-4`, `60h`, 9 practical areas, PDF p. 19).
- **Calibration (unchanged from blueprint):** strict **2023–2026** PYQ window `P003–P006`, `4` papers, `106` Qs, `403` printed set marks; `2021–2022` `P001`/`P002` excluded. U4 `145m` 36.0%, U2 `143m` 35.5%, U3 `75m` 18.6%, U1 `40m` 9.9%.
- **Sync mode:** Mode A — `_data/` and `_quiz-data/` byte-for-byte unchanged (`check_pyq_integrity.py`: `0` changed/added/missing; frozen-md5 sweep re-verified after every unit edit).
- **Scope kept:** only 3 Tier E extensions (21m): header LL + polynomials (U3), array address formulas (U1), threaded binary trees (U4). Sorting, MST, shortest path, Huffman and sparse matrices stayed out, per blueprint.

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js` (`SYLLABUS_UNITS.CST205 = 4`).
- **ADAPT:** All 81 pre-existing `<h3 id>` anchors and all 54 section IDs across Units 1–4 preserved (verified against `HEAD` file-by-file); 17 new `<h3 id>` anchors authored around existing prose.
- **BUILD:** 11 inline token-styled SVGs (taxonomy, 2-D array layout, circular queue wrap, Tower of Hanoi, singly/doubly linked-list pointer surgery, polynomial nodes, `C_4` reconstruction tree, AVL rotations, B-tree splits, `K_5` BFS/DFS), machine-generated trace tables, and `gcc -std=c99`-checked C fragments.
- **REJECT:** `<iframe>` embeds, `i.ytimg.com` thumbnails, hardcoded colour literals, unexamined sorting/MST/Huffman/sparse-matrix tutorials.
- **One shared-runtime change (additive):** `assets/js/unit-discovery.js` reveal-on-landing gate extended to CST205 *mapped* entries (`(CST207 || CST205) && mappedEntry`), mirroring the CST207 pattern. Before this, CST205 mapped landings were highlighted inside still-collapsed sections. No other subject's behaviour changes; CST207/CST209 resolver audits still pass unchanged.

---

## 2. Per-Unit Calibration & Verification Ledger

Word counts are visible-text counts measured at execution (the planning draft used a different counter: 26,651w total before). Over-budget rows are informational only — the standing owner instruction is not to trim useful prose.

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | SVGs | New `<h3 id>`s | Locked `guides.json` Anchors | Existing `<h3 id>`s | Trace Check |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `40m` (9.9%) | 3,626 | ~3,400–3,900 | 4,086 | 2 | 1 (`arrays-and-index-addressing`) | `#classification`, `#terminology-5-abstract-data-type-adt` | 17 / 17 | Address formulas 3552/3568/3548 hand- + script-verified |
| Unit 2 | `143m` (35.5%) | 6,379 | ~7,400–8,200 | 7,677 | 2 | 4 | `#stacks-operations-on-stack`, `#queues-types-of-queues` | 16 / 16 | Circular-queue wrap + false-overflow reproduced in C; postfix eval = 1; Hanoi(3) = 7 moves; GCD(48,18) = 6 |
| Unit 3 | `75m` (18.6%) | 8,011 | ~6,400–7,000 | 8,987 | 3 | 3 | `#singly-insertion-operations`, `#comparisons-all-four-types-of-linked-lists` | 24 / 24 | Four-pointer DLL insert/delete sequences diagram-checked; polynomial layout vs exam items |
| Unit 4 | `145m` (36.0%) | 9,225 | ~8,200–9,000 | 11,784 | 4 | 9 | `#traversals`, `#graph-traversals` | 24 / 24 | BST insert/inorder reproduced in C; AVL numeric + month traces; B-tree order-3 final root `[50]`; reconstruction postorder machine-verified |
| **Total** | **`403m` (100%)** | **27,241** | **~25.4–28.1kw** | **32,534** | **11** | **17** | **8 / 8 preserved** | **81 / 81** | see §2.1 |

All displayed traces were generated independently by `scripts/verify_cst205_traces.py` and frozen in `evidence/ds-traces.json` (`--check` green). Spot re-verification in C this phase: BST `10,25,2,4,7,13,11,22` → inorder `2 4 7 10 11 13 22 25`; circular queue (cap 5) E rear=4, F wraps rear=0, G rear=1, H FULL — both match the page tables exactly. AVL numeric `54,2345,6172,5918,1077,3422,44` rotates only at 6172 (RR@54) and 3422 (LL@6172), root 2345; AVL month-names rotate at November (RR@March), April (LL@March), January (LR@May), root March — the exact sequences the papers ask for. Reconstruction In+Pre `1,2,4,7,9,5,3,6,8` / `7,9,4,2,5,1,3,6,8` → postorder `9,7,4,5,2,8,6,3,1`. Address numerical `A[5][2]`, 8×3, w=4, base 3500 → 3552 (1-based row-major), 3568 (0-based), 3548 (1-based column-major); the convention is stated on the page.

---

## 3. YouTube Curation Log (13 slots, plain `<a>` only, no embeds)

Selection rule applied per slot: compare relevant alternatives, prefer the complete syllabus-matched lecture over short previews, record why. Jenny's Lectures' DSA playlist (122 videos) maps closely onto this syllabus and won most slots *on comparison*, not by default; Neso Academy won two slots on merit. **Verification limit, stated plainly: no browser exists in this environment — playback and captions were NOT verified for any video.** Watch-page metadata + description were fetched for all 13 on 2026-11-19; full transcripts were reviewed for slots 7, 8, 10, 13; transcript text was fetched for slots 1 and 9, and the opening chunk for slot 6.

| # | Unit | Topic Cluster | Channel & Video | URL | Duration | Views at check | Why this one (alternatives considered) |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 1 | U1 | DS classification (linear/non-linear, static/dynamic) | Neso Academy — Types of Data Structures | https://www.youtube.com/watch?v=T9DSBhBR_I4 | 4:28 | 541k | Short but definitional and syllabus-shaped; transcript fetched. Jenny's 1.1 covers the same ground inside a longer intro lecture. |
| 2 | U1 | 2-D arrays, row/column-major addressing | Jenny's Lectures — 2D Arrays in C | https://www.youtube.com/watch?v=KDQXUysHLL8 | 37:43 | 545k | Complete English treatment incl. column-major. Gate Smashers' 8:21 (Hindi, transcript fetched) derives row-major only in the lecture proper. |
| 3 | U2 | Stack array implementation (push/pop/peek) | Jenny's Lectures — Stack using Array (3.2) | https://www.youtube.com/watch?v=VmsTAVpz0xo | 17:27 | 1.59M | Full C implementation matching the unit's pseudocode. |
| 4 | U2 | Infix → postfix conversion | Jenny's Lectures — Infix to Postfix using Stack (3.8) | https://www.youtube.com/watch?v=PAceaOSnxQs | 20:09 | 2.55M | Worked conversion algorithm, the highest-weight U2 skill. |
| 5 | U2 | Circular queue (array) + linear-queue drawback | Jenny's Lectures — Circular Queue (4.4) | https://www.youtube.com/watch?v=dn01XST9-bI | 24:18 | 1.09M | Includes the false-overflow drawback the papers probe; metadata-screened alternatives were shorter treatments. |
| 6 | U2 | Tower of Hanoi (recursive trace) | Neso Academy — Towers of Hanoi (Implementation) | https://www.youtube.com/watch?v=dvhausEOcvg | 17:09 | 25.9k | 2025 lecture; transcript chunk confirms recursion-tree trace for n=3. Monalisa CS (495 views, poor auto-transcript) rejected. |
| 7 | U3 | Singly linked list insertion | Jenny's Lectures — Insertion in Singly Linked List (2.4) | https://www.youtube.com/watch?v=dq3F3e9o2DM | 27:07 | 1.86M | Beginning/end/position with C code; transcript reviewed. |
| 8 | U3 | Doubly linked list insertion | Jenny's Lectures — Insertion in Doubly Linked List (2.11) | https://www.youtube.com/watch?v=v4szCPs9yEY | 35:15 | 612k | Includes tail-pointer O(1) end insertion; transcript reviewed. |
| 9 | U3 | Polynomial representation via linked list | Rapid Tutor — 56: Implement Polynomial Using Linked List | https://www.youtube.com/watch?v=Dze2Em2EazE | 7:39 | 623 | Only clean coeff/exp create-insert-print treatment found; transcript fetched. **Risk recorded:** very low view count (2025 upload). Alternatives were polynomial *addition* (different operation) or 2017-era recordings. The page teaches the full algorithm itself; the video is reinforcement. |
| 10 | U4 | Binary-tree reconstruction (Pre+In) | Jenny's Lectures — Construct BT from Preorder & Inorder (5.7) | https://www.youtube.com/watch?v=PoBGyrIWisE | 9:44 | 1.44M | Exactly the syllabus construction; transcript reviewed (root-from-preorder, split-at-inorder). Longer full-tree reconstructions cover unasked cases. |
| 11 | U4 | AVL balance factor + LL/RR/LR/RL rotations | Jenny's Lectures — AVL Trees (5.13) | https://www.youtube.com/watch?v=YWqla0UX-38 | 24:30 | 2.03M | All four rotations with balance factors; three metadata-only alternatives not preferred. |
| 12 | U4 | B-tree construction, order 3 | Jenny's Lectures — B-Tree of Order 3 (5.24) | https://www.youtube.com/watch?v=Ay2AbTk_QEg | 9:51 | — | Order matches the page's worked construction. Order-4 lecture rejected (order mismatch); 4-minute B-tree preview deprioritised as a preview, not a treatment. |
| 13 | U4 | BFS vs DFS graph traversal | Jenny's Lectures — BFS and DFS (6.2) | https://www.youtube.com/watch?v=vf-cxgUXcMk | 20:26 | 3.51M | Queue-vs-stack worked example on one graph; transcript reviewed. |

Coverage gaps / unclaimed verification: durations and view counts are watch-page metadata at check time and will drift; no claim is made that any video plays, has captions, or stays available. If slot 9's low-view video disappears, the U3 polynomial heading is self-sufficient and the link should be swapped, not the content.

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`106` Questions)

- **Sync mode used:** Mode A (`_data/CST205/*.json` untouched) / Mode B: N/A (not requested).
- **Baseline measured at execution (`cdf001c`, `scripts/audit_topic_routing.py --subject CST205 --verbose`):** `50` same-unit · `55` redirect · `1` unmatched (`CST205-P003-Q24`, topic `Deques`). The blueprint's planning figures (40/55/11 at `f52d2f6`) were **not reproduced**; the measured numbers are the ones reported here.
- **Root cause the map had to fix:** stored unit tags in `_data/CST205/` are systematically shifted (Stacks/Queues tagged U1, Linked Lists U2, Trees U3), so a topic-only authored map — not tag edits — carries the correction (Mode A).
- **Post-Phase-14 result (`assets/data/topic-map-CST205.json`, 80 normalised topics, 23 recorded decisions):**
  - `106/106` questions mapped; `0` unmatched; `0` generic-card landings (bare `overview`/`introduction`-style section targets).
  - `67` of 106 landings changed versus the fuzzy matcher; `71` of 106 land on a different unit than their stored tag (measured through the real resolver, see §5).
  - Landing distribution by true unit: U4 `43`, U2 `34`, U3 `17`, U1 `12` — consistent with the 36.0/35.5/18.6/9.9 mark weights.
  - Wrong-unit traps pinned by `tests/test_topic_map_cst205.py`: `P003-Q24` (Deques → U2 deque heading), `P005-Q12`, `P003-Q11` (→ U4 BST), `P005-Q9` (→ U4 B-tree), `P006-Q21` (→ U4 AVL).
  - Unequal-mark multi-part topics: `23` written decisions in the map file (keyed by normalised topic per `topic-map-standard.md`), including flagged cross-unit composites (`adt / threaded trees / traversal`, `bst / stack / queue / b-tree`, `infix / queue / graph traversal`) and the shared-label compromise for `linked lists` (one stored label serving five unlike questions; least-wrong single entry, specific headings one section away — recorded, not hidden).
- **Builder/checker:** `scripts/build_topic_map_cst205.py` (`--check` asserts the committed file is current); `tests/test_topic_map_cst205.py` (12 tests) guards anchors, coverage, normalisation, paper-section exclusion, decision completeness and the trap set.

---

## 5. Quality-Gate & Rebuild Evidence

All results are **local automated checks in this sandbox**. There is no browser here: rendering, playback, captions, offline behaviour and physical-device behaviour are **not** claimed. DOM behaviour is evidenced through the repo's deterministic mini-DOM harness (`tests/discovery-dom.cjs`), which runs the real `assets/js/unit-discovery.js`.

| Check / Command | Expected | Result |
| :--- | :--- | :---: |
| `python3 scripts/check_pyq_integrity.py` | `0` changed/added/missing | ✅ `0` (also md5-swept after each unit) |
| `python3 scripts/build_suggestions.py --check` | `11` static pages verified | ✅ `11` verified |
| `python3 scripts/check_site.py --strict` | `0` errors, `0` warnings | ✅ exit 0, none |
| `python3 scripts/validate_pyq.py` | PASS | ✅ `0` errors / `0` warnings, 28/28 papers |
| `python3 scripts/validate_data.py --check-baseline` | matches baseline | ✅ matches (script itself notes: NOT a full strict pass) |
| `python3 scripts/audit_accessibility.py --fail` | `0` findings | ✅ `0` |
| `python3 scripts/check_tokens.py --strict` | `0` findings | ✅ `0` (391 legacy rgba = ratcheted baseline) |
| `python3 scripts/audit_page_weight.py --budget` | within budget | ✅ every page within 340 KB CSS / 350 KB JS |
| `python3 scripts/build_icon_subset.py --check` | current | ✅ 25,926 B, 228 icons |
| `python3 scripts/build_data_version.py --check` | current | ✅ `data-2efb05fdca52` over 86 files |
| `python3 scripts/verify_cst205_traces.py --check` | traces match pages | ✅ green |
| `python3 scripts/build_topic_map_cst205.py --check` | map current | ✅ 80 topics / 106 assignments / 23 decisions |
| `python3 -m unittest discover -s tests` | all pass | ✅ **178/178** (baseline 166; +12 CST205 map tests). Includes `tests/test_section_clipping.py` regression. |
| `node tests/discovery-dom.cjs` | all pass | ✅ 11/11 suites, incl. **CST205 106/106 concept landings (71 stored-unit corrections), revealed highlights, stale/missing/malformed fallbacks**; CST207 102/102 and CST209 105/105 unchanged |
| Canonical rebuild (README order) | byte-stable | ✅ run twice in full; second run produced zero further diff (identical tree hash both times) |

Two pre-existing ratchets moved because content legitimately changed, and were re-pinned with reasons in the test files: `tests/test_discovery.py` unit-anchored headings `679 → 696` (exactly the 17 new anchors) and `tests/test_routing_order.py` CST205 document-order-dependence `35 → 33` (new named headings removed two position-decided ties; the matcher itself is untouched and Phase 17 still owns the tie-break defect — CST205 map routing makes this a fuzzy-fallback metric only).

**Hosted CI (read-only inspection, branch not pushed):** at base `cdf001c`, Web CI run `44490460318` failed, isolated earlier to the *PYQ browser smoke* step; Pages (`44490459397`) succeeded. The PR #29 merge commit's Web CI also failed, so the red predates this phase and is inherited. An identical root cause between the base failure and Phase 16's browser-smoke failure is **not** established. No CI run exists for this branch because it has not been pushed.

---

## 6. Owner Verification & Open Caveats

- **Owner decision (`rule.md` §4.7):** _Pending — awaiting owner review (`mark as pass` / `add for later`)._
- **Branch state:** `arena/c5ca91cb-diploma-3rd-sem` is committed **locally only**. Until the owner authorizes a push, a Termux/phone clone cannot fetch this branch; the commands below work (a) in this checkout now, or (b) on the owner's device after an authorized push + `git pull` of the branch.
- **Exact owner-test URLs** (serve the repo's *parent* folder so the `/Diploma-3rd-sem/` prefix exists, exactly as on GitHub Pages):
  ```sh
  # Termux / desktop, from the folder CONTAINING the Diploma-3rd-sem checkout:
  python3 -m http.server 8000
  ```
  - `http://127.0.0.1:8000/Diploma-3rd-sem/subjects/CST205/index.html`
  - `http://127.0.0.1:8000/Diploma-3rd-sem/subjects/CST205/units/unit-1.html`
  - `http://127.0.0.1:8000/Diploma-3rd-sem/subjects/CST205/units/unit-2.html`
  - `http://127.0.0.1:8000/Diploma-3rd-sem/subjects/CST205/units/unit-3.html`
  - `http://127.0.0.1:8000/Diploma-3rd-sem/subjects/CST205/units/unit-4.html`
  - Routing spot-checks (each should land on the named heading, section open, heading outlined): from `pyq/answers.html`, open any 2023–2026 CST205 question and follow its unit link — recommended probes: a *Deques* question (→ Unit 2 circular-queues heading), a *B-tree* question (→ Unit 4 B-tree heading), a *Tower of Hanoi* question (→ Unit 2 recursion traces).
  - Also unchanged-but-adjacent: `suggestions/data-structures/easy-read.html`, `revision/CST205.html`, `subjects/CST215/index.html`.
- **Standing caveats:** Physical-device check stays owner-side via Termux; no playback/caption/device claim is made for the 13 videos (slot 9 carries a recorded low-view risk); PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`; the stored U1/U2/U3 unit shift in `_data/CST205/` remains untouched under Mode A and is corrected at read time by the topic map — a Mode B source fix would need separate owner approval; word budgets exceeded on U1/U3/U4 are informational per the standing owner instruction.
- **Continuation:** after owner review, the natural next step (only if separately authorized) is Phase 17 — Topic-map cross-check across all five subjects. Nothing is pushed, PR'd, merged or deployed by this phase.
