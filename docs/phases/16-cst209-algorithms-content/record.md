# Phase 16 — Algorithms execution record

**2026-11-19 · ✅* Owner accepted; merge authorized.**
Branch `arena/d7aa68ed-diploma-3rd-sem`, clean start and HEAD/base
`47d801b660cea9b417e62f81c2be0803ddc66312` (Phase 15 merge, PR #29).
Mode A: **all `_data/` and `_quiz-data/` files byte-identical**, not just PYQs.
Implementation was initially local-only; subsequent owner-authorized push and merge closeout are recorded below. Phase 15 stays closed.

## Preflight and reuse

Read rule → prompt → status → decisions (including inherited Phase 13) →
roadmap → Phase 16 README/tasks/record/all five blueprints → topic-map standard,
CST201 example map and map tests before implementation. Reused **ADAPT**:
existing unit HTML/shared classes and accessible SVG conventions; CST207's
editorial map generator and real-resolver MiniDOM tests. **BUILD**: independent
algorithm traces and Algorithms editorial assignments. **REJECT**: embeds,
new runtime libraries, retagging stored units, rewriting a generic fuzzy engine.
No new dependencies or third-party source copied into the site.

Baseline local prechecks: integrity, suggestions, advisory syllabus, discovery
Python and DOM tests exit 0; full Python baseline **159/159 PASS**.
The syllabus validator still prints three inherited grouped source-review
errors (CST205 outside-unit PYQs; CST209 outside-unit PYQs and Unit-5 quiz bank)
and CSO's missing-bank warning; its **advisory exit 0 is not strict success**.
The exact nine-finding data ledger remains unchanged.

**Current hosted baseline, checked before editing:** Web CI
[44484813834](https://github.com/pabitra27706-oss/Diploma-3rd-sem/actions/runs/44484813834)
at the merge base is **failure**; GitHub jobs API identifies
“PYQ browser smoke — paper width, icon cluster, print control”. Pages
`44484812632` is success. The earlier Phase 15 run `44483074003` has the same
failing step, but sameness of step is not proof of identical root cause.
`gh run view --log-failed` could not download the old artifact log (outbound
results host returned EOF). **No Phase 16 hosted run/artifact exists** because
nothing was pushed. The inherited browser failure is neither fixed nor waived.

## Calibration contract

Only P003–P006, 2023–2026: 105 questions / 395 **printed set** marks; optional
questions mean these are not all answerable marks. P001 is archived, excluded
from every weight/scope decision. Syllabus authority is the committed
Revised-2022 transcription (`docs/syllabus/syllabus.json`, PDF p.12); no claim of
fresh PDF extraction (`pdftotext` and `pypdf` unavailable). All topic lines of
the four official units remain represented. No answer certification is implied.

| Unit | Tier ledger fixed before writing |
|---|---|
| U4 — 93m | A: MST 38, shortest paths 35; B: graph basics 12; C: DAG/topo 8 |
| U3 — 92m | A: linear/binary 37, hashing 31, BST/balanced 24; S: symbol tables and 2-3 reference |
| U1 — 89m | A: traits/bounds 30, paradigms 26; B: analysis 17, ADT/sets/stacks 16; S: queue |
| U2 — 79m | A: efficient sorts 32, elementary 30; B: linear sorts 17; S: standalone Counting/Shell |
| CO5 U5 — 42m | E supplementary; B: RK 15, KMP 11; C: naive 8, tries 8; five 0m background stubs |

## Sequential implementation and checkpoints

Each unit was finished (prose, headings, diagrams, videos, weighted rehearsal)
and rebuilt/tested before editing the next. Word counts below consistently
strip script/style and HTML, unescape entities and split whitespace; include
chrome/table/code text. They differ from the older blueprint's counting method.
Budgets are advisory and **useful explanations were not trimmed to a quota**.

| Part | Unit | Words before → after | SVG / new h3 | Separate checkpoint |
|---|---|---:|---:|---|
| 1 | U4 | 6,687 → 9,524 | 4 / 5 | 13 README gates + advisory syllabus + 159 tests, exit 0 |
| 2 | U3 | 6,085 → 7,601 | 3 / 2 | 13 README gates + advisory syllabus + 159 tests, exit 0 |
| 3 | U1 | 4,709 → 6,317 | 2 / 6 | 13 README gates + advisory syllabus + 159 tests, exit 0 |
| 4 | U2 | 6,415 → 7,902 | 3 / 2 | 13 README gates + advisory syllabus + 159 tests, exit 0 |
| 5 | U5 | 6,673 → 7,491 | 2 / 5 | 13 README gates + advisory syllabus + 159 tests, exit 0 |
| 6 | Map / final audit | 85 normalized keys, 34 decisions | all 105 questions | 166 tests + runtime and final gates below |

Checkpoint U3/U1/U2/U5 stdout summaries are in `evidence/checkpoint-*.txt`;
U4's same successful command sequence is in the execution transcript. Measured
`unitAnchored` ratchet: 659→664→666→672→674→679. Measured matcher document-order
dependence: 50→48→47→50→49→49. These measurements describe the still-unfixed
matcher and do not claim its tie-break is correct; no Phase 17 engine change.

All **81 live section IDs** survive (the blueprint's 76 omitted five existing
video sections), as do **61 existing h3 IDs**, **8 guide locks**, and the old
Dijkstra compatibility anchor. Added 20 h3s (U4 needed 5, not the planned 4).
14 accessible inline SVGs: 2/3/3/4/2, with title/description, visible edge or
prefix descriptions and current-colour strokes. No stylesheet growth.
See `evidence/anchors-before.json` and `content-metrics.json`.

### Material and exact-dataset verification

- **Graphs:** Union-Find, safe-cut argument, 6-vertex teaching Prim (total 13),
  exact March 2023 Kruskal (10), exact December 2024 seven-vertex Kruskal (39),
  Dijkstra state/predecessor trace and negative-edge counterexample, Bellman–Ford
  pass tables, all five Floyd matrices and Kahn ordering/DFS-cycle reasoning.
  **Blueprint correction:** January 2024's recorded printed Bellman–Ford graph
  has **6 vertices**, not 5. Final A..F distances `[0,1,3,5,0,3]`, no reachable
  negative cycle. Data is read, never rewritten. Other examples are explicitly
  teaching examples, not falsely called exact paper datasets.
- **Searching:** overflow-safe floor midpoint in both pseudocodes, invariant,
  recurrence proof, hit/miss/unsorted cases, shared-key hash table across four
  schemes, BST insertion/deletion and 2-3 tree reference. Ten-slot double hash
  uses step `[1,3,7,9][k mod 4]`, not the blueprint's unsafe generic `R−k mod R`:
  each step must be coprime to 10. Quadratic probing may cycle despite space.
- **Introduction:** characteristic counterexamples, formal polynomial witnesses
  `(3,10,1)`, powerset of `{a,b,c}`, multiplicity conventions, exact doubling
  loop and `T(n)=2T(n/2)+1=2n−1` derivation, stack boundaries and circular queue,
  D&C/DP table, greedy counterexample and qualified Master Theorem.
- **Sorting:** every Lomuto partition on the exact December 2024 12 keys,
  every Bubble pass on January 2026's 8 keys, all three exact Radix digit passes;
  linear-time heap construction proof, Bucket assumptions and corrected Shell
  example/Hibbard claim. Iterative versus recursive heapify space is explicit.
- **CO5:** exact KMP `[0,0,1,2,0]`, all comparisons on the 15-character text,
  match at 10; all 11 naive shifts with match at 6; modulo-11 RK teaching case
  with spurious hit and verified matches; full eight-word trie, 18 non-root
  nodes/19 with root and `do` terminal internally. Five unexamined background
  sections condensed while retaining every old heading ID. Supplementary hub,
  coverage source/generation, and in-body links agree; official nav stays 1–4.

`verify_cst209_graphs.py --check` and `verify_cst209_traces.py --check` reproduce
checked-in JSON evidence using executable Python assertions. MST totals are
cross-checked across Prim/Kruskal, single-source distances against all-pairs,
and Kahn's order against every edge. The first draft's guessed trie count (21)
failed; explicit prefix enumeration established 18 before publication. All
learner code blocks are pseudocode, not claimed as executed Python.

Original practice banks remain as additional drills, rather than deleting
useful questions to meet a planned MCQ quota. New weighted eight-mark rehearsals
have worked answer checkpoints and clearly unofficial self-review rubrics.
Revision entries remain agent drafts; all four official unit groups synced.

## Verified plain external videos — 15/15

Verification means opened watch-page metadata (public title/channel/duration)
and inspected available topic descriptions/transcripts on **2026-11-19**.
It does **not** mean played on a phone or certified every statement. No iframe,
thumbnail, external runtime fetch, or downloaded video. Nothing contacts YouTube
until a learner chooses a link. All are plain external anchors.

| Unit | Title — channel · duration (watch URL) | Checked |
|---|---|---|
| U1 | [1.8.1 Asymptotic Notations Big Oh - Omega - Theta #1 — Abdul Bari · 15:46](https://www.youtube.com/watch?v=A03oI0znAoc) | 2026-11-19 |
| U1 | [2 Divide And Conquer — Abdul Bari · 07:04](https://www.youtube.com/watch?v=2Rr2tW9zvRg) | 2026-11-19 |
| U1 | [2.3.3 Recurrence Relation [ T(n)= 2T(n/2) +n] #3 — Abdul Bari · 11:20](https://www.youtube.com/watch?v=1K9ebQJosvo) | 2026-11-19 |
| U2 | [2.8.1 QuickSort Algorithm — Abdul Bari · 13:42](https://www.youtube.com/watch?v=7h1s2SojIRw) | 2026-11-19 |
| U2 | [Bubble Sort Algorithm | GeeksforGeeks — GeeksforGeeks · 00:58](https://www.youtube.com/watch?v=nmhjrI-aW5o) | 2026-11-19 |
| U2 | [Radix Sort | GeeksforGeeks — GeeksforGeeks · 01:08](https://www.youtube.com/watch?v=nu4gDuFabIM) | 2026-11-19 |
| U3 | [2.6.1 Binary Search Iterative Method — Abdul Bari · 19:35](https://www.youtube.com/watch?v=C2apEw9pgtw) | 2026-11-19 |
| U3 | [Lecture 8: Hashing with Chaining — MIT OpenCourseWare · 51:15](https://www.youtube.com/watch?v=0M_kIqhwbFo) | 2026-11-19 |
| U3 | [Delete a node from Binary Search Tree — mycodeschool · 18:26](https://www.youtube.com/watch?v=gcULXE7ViZw) | 2026-11-19 |
| U4 | [3.5 Prims and Kruskals Algorithms - Greedy Method — Abdul Bari · 20:12](https://www.youtube.com/watch?v=4ZlRH0eK-qQ) | 2026-11-19 |
| U4 | [3.6 Dijkstra Algorithm - Single Source Shortest Path - Greedy Method — Abdul Bari · 18:35](https://www.youtube.com/watch?v=XB4MIexjvY0) | 2026-11-19 |
| U4 | [4.2 All Pairs Shortest Path (Floyd-Warshall) - Dynamic Programming — Abdul Bari · 14:13](https://www.youtube.com/watch?v=oNI0rf2P9gE) | 2026-11-19 |
| U5 | [9.2 Rabin-Karp String Matching Algorithm — Abdul Bari · 23:50](https://www.youtube.com/watch?v=qQ8vS2btsxI) | 2026-11-19 |
| U5 | [9.1 Knuth-Morris-Pratt KMP String Matching Algorithm — Abdul Bari · 18:55](https://www.youtube.com/watch?v=V5-7GzOfADQ) | 2026-11-19 |
| U5 | [Data Structures: Tries — HackerRank · 04:54](https://www.youtube.com/watch?v=zIjfhVPRZCg) | 2026-11-19 |

Selection caveats are visible beside the links: Theta is **tight**, not average;
MST minimum-edge initialization is a variant and its counting shortcut is not
general; Floyd has a flagged arithmetic slip around 6:39; KMP's creator notes a
corrected LPS example. Sorting's Bubble/Radix slots are **short visual previews**
(58s/68s), not full lectures; notes supply the complete exam traces. The hash
lesson is longer (51:15) and chaining-only; don't claim it covers every scheme.
Dijkstra and Floyd slots do not falsely claim Bellman–Ford/topo coverage.
One Rabin–Karp endpoint returned a bot challenge and 0:00 duration; the youtu.be
metadata endpoint returned Public/23:50 plus transcript. Floyd's watch response
also included an error banner alongside title/channel/14:13 and chapter data.
Availability/playback on the owner's device remains an explicit check.

## Mode A map authored last — semantic routing evidence

`assets/data/topic-map-CST209.json`, reproducible from
`scripts/build_topic_map_cst209.py --check`: 85 normalized keys, 105 assignments,
34 written decisions. Every unequal-mark composite is covered, including
5m hashing versus 3m binary, 6m Floyd versus 2m DAG, 4m PUSH/POP versus 2+2m
basics/sets, and 5m Dijkstra versus 3m topo. Flagged shared labels and equal
cross-unit questions are recorded rather than silently guessed.

Important flags: `searching / complexity` is binary in one paper and linear in
another, so uses the explicit shared search/proof heading; `shortest paths`
needs both Dijkstra and Bellman–Ford so uses their named choice section.
January 2026 hashing/RK is equal 4+4: route to specific supplementary RK and
link directly back to collisions. January 2024's disputed cycle/path key is
explained in the learner definitions, not edited in frozen data.

`scripts/audit_cst209_runtime.cjs --baseline` executes the **base commit's real
JS and HTML**; without the flag it executes current sources in MiniDOM. Initial
URLs omit synthetic fragments so no-jumps are measurable; failed-page tests
separately supply the answer action's synthetic fragment and require it cleared.
The older Python matcher-only snapshot in `routing-before.json` includes U5
candidates that the base runtime did not search: it is **not** the runtime baseline.
Older blueprint estimates (`56/22/26/1`, `0/8 CO5`) are superseded by these runs.

| Production-resolver metric (105 questions) | Base 47d801b | Phase 16 |
|---|---:|---:|
| Same stored unit | 74 | 67 |
| Redirect | 23 | 38 |
| No concept jump | 8 | 0 |
| Generic overview-card landings | 9 | 0 |
| Wrong-unit landings against reviewed editorial destinations | 9 | 0 |
| CO5 concept landings | 1 | 8 |
| Changed unit/anchor pairs | — | 76 |

The nine wrong-unit row is distinct from no-jumps; agreement with an editorial
map is not official answer certification. All after destinations are named
concept sections/headings; zero paper-section anchors. Source data unchanged;
38 read-time cross-unit routes include deliberate composite-topic choices; not every redirect proves a source-data error. Specific independent
trap assertions cover trees→graph definitions, binary/hash→collision resolution,
DAG/Floyd→matrices, intro/sets/stacks→PUSH/POP, and hashing/RK→CO5.

`tests/discovery-dom.cjs` exercises all 105 actual question topics against the
production resolver, including 8 CO5 routes, destination highlighting, collapsed
section reveal with no fixed inline height cap, official U4 terminal nav,
stale anchor, missing map, malformed JSON and failed target page. A missing
or malformed map can search CO5 candidates; a failed page leaves no dead
synthetic fragment or blind redirect. Saved collapse preferences are not changed.
The engine's broader fuzzy tie-break problem remains for Phase 17.

## Final verification and limitations

See `evidence/final-verification.txt` for final command exits and presence
idempotence. Canonical README rebuild runs **after** the suite to settle shared
outputs: data catalog → practice days → cards → runtime data → coverage →
revision sheets → verification → runtime bundles → icon subset → suggestions →
presence twice → search index → data version last. Then checks are re-run.
Shell version `study-2026-11-19-algorithms` refreshes changed HTML/JS offline;
the other pages' app-build meta diff is generated shell metadata only, not
Phase 15 content work. Data version is independently generated: `data-58765c5cf7af` over 85 files.

- **166/166 Python tests PASS**, including 7 new Algorithms guards and the
  existing **6/6 section-clipping regression**. Thirteen README script gates
  PASS; advisory syllabus command also exits 0 with inherited findings above.
- **14/14 README deterministic Node suites PASS**, including discovery,
  section-notes and data-version. JS/CJS parse and JSON parse checks recorded.
- New guards ablated: corrupt a displayed Quick trace → test fails (exit 1);
  remove supplementary candidates → missing-map DOM assertion fails (exit 1);
  rename locked MST anchor → preservation test fails (exit 1). All seven new Python guards also had failing ablations (freeze snapshot,
  map concept, runtime evidence, SVG role and official-count mutations). Raw data
  was never modified. Exact bytes restored after each, then 7/7 passed again.
- Strict data/syllabus certification is **not claimed**. No data edits,
  certification entries, official marking scheme or legal/rights change.
- **No browser/device run**: playwright-core and Chromium absent. No screenshot,
  hosted preview artifact, rendered clipping measurement, captions/audio check,
  print/zoom/tap test or real offline-update observation. Source clipping
  invariants and DOM tests are not substitutes for those measurements.

## What the owner should test (local copy only)

The remote live site still lacks Phase 16. §7's updated Termux fetch command
requires a separately authorized push; **do not run it expecting this local
commit until then**. With a complete local copy at `~/study-hub-algorithms-preview/Diploma-3rd-sem`,
serve its parent with `python3 -m http.server 8012 --bind 127.0.0.1`.

1. `http://127.0.0.1:8012/Diploma-3rd-sem/subjects/CST209/units/unit-4.html#mst`
   — compare both exact Kruskal totals, open/collapse long shortest-path sections,
   scroll to the next section on a narrow phone; no clipping or text interleave.
2. `http://127.0.0.1:8012/Diploma-3rd-sem/subjects/CST209/units/unit-3.html#hashing-collision-resolution-techniques`
   — inspect all four collision methods and horizontal-table access.
3. `http://127.0.0.1:8012/Diploma-3rd-sem/subjects/CST209/units/unit-1.html#loop-counting-and-recurrence-substitution`
   — confirm +1 yields 2n−1, not the linked +n video's n log n.
4. `http://127.0.0.1:8012/Diploma-3rd-sem/subjects/CST209/units/unit-2.html#quicksort-exam-partition-trace`
   — check exact Quick table; then the three Radix passes and Bubble passes.
5. `http://127.0.0.1:8012/Diploma-3rd-sem/pyq/answers.html?paper=CST209-P005-2024-12&q=CST209-P005-Q20`
   — Open topic must correct stored Sorting to Searching/collisions (5m half).
6. `http://127.0.0.1:8012/Diploma-3rd-sem/pyq/answers.html?paper=CST209-P005-2024-12&q=CST209-P005-Q22`
   — Open topic selects Floyd matrices (6m), not DAG (2m).
7. `http://127.0.0.1:8012/Diploma-3rd-sem/pyq/answers.html?paper=CST209-P003-2023-03&q=CST209-P003-Q34`
   — Open topic reaches supplementary RK, visibly highlighted and revealed.
8. `http://127.0.0.1:8012/Diploma-3rd-sem/subjects/CST209/units/unit-5.html#tries-prefix-trees`
   — eight words, internal do terminal; review supplementary label in hub and
   `http://127.0.0.1:8012/Diploma-3rd-sem/coverage.html#subject-algorithms`.
9. Try all three Watch & Learn links on each unit; confirm appropriate title,
   usable playback/captions on your device and read the adjacent caveats.
   Check U4 navigation has **no Next Unit 5**; CO5 is an explicit body/hub link.

**Stop:** awaiting “mark as pass” or “add for later”. Neither is assumed.
No next phase or release action is authorized.


## Owner acceptance and merge authorization — 2026-11-19

After the authorized push of `79585e2`, the owner reported “Everything looks
good”, asked about video-selection bias, then explicitly instructed “Ok you can
merged this branch”. Record Phase 16 as **✅*** accepted with caveats, and merge
this session branch through a PR. No Phase 17 or separate deployment/settings
action is authorized.

Video curation is useful but **not demonstrated best-in-class**: 10/15 links
are from Abdul Bari, alternatives were not systematically compared for every
slot, and the 58s/68s sorting links are previews. Full playback/captions remain
unverified. A video-only comparison review was offered but not performed; the
owner instead authorized merging the existing selection. Do not silently claim
that review happened or that every blueprint video-depth preference was met.

Pushed implementation Web CI **44488748038** failed at “PYQ browser smoke —
paper width, icon cluster, print control”, the same step as base **44484813834**.
This establishes an inherited failing step, not identical root cause or a new
hosted pass. Local implementation results remain 166 Python tests, 13 README
gates and 14 deterministic Node suites. This closeout changes documentation
only, not content, frozen data, tests or runtime outputs.
