# Current status and remaining work

Documentation checkpoint: **2026-11-09**. This is the current handoff; older
phase evidence remains historical unless explicitly superseded here.

## Continuation checkpoint — 2026-11-12

The latest Arena session is on `arena/71382686-diploma-3rd-sem`, based on
`125eb947413eb3901f4d3e98cd63c6fc31aa7fae` (the PR #7 merge). This supersedes
historical branch/tip labels below for this session. At the Phase 2 continuation
checkpoint, immutable PYQ guard/PYQ validation passed, five focused data tests
passed, the exact source-review baseline matched, site strict was 0 errors / 28
warnings and platform check was 0 errors. Strict data/syllabus findings remain
source-gated; see the Phase 2 record. No PYQ or registry changes were made then.

### Phase 3 continuation — 2026-11-12

Paper answer-choice tracking and explicit timed-section rules are now
implemented from existing immutable paper metadata. Fresh local evidence:
12 Python tests, 6 Node suites, JS/CJS parse sweep, PYQ guard/validation, site
strict (0 errors / 28 warnings), and platform check (0 errors) pass. The 30-paper
rules mapper reports no unsupported/uncovered question pools; 7 source-stated
30-minute sections are recognized. Official paper marks remain withheld; strict
Phase 2 findings remain. Chromium/browser acceptance and hosted CI were not run
on this continuation. The implementation is pushed to the active Arena branch;
no PR, merge, deployment or publication was performed. See the Phase 3 record
for exact scope and limitations.

## Current source reconciliation

Owner approved preserving newer main for PR #7. Papers/registries now match
`cfe3a63decb270826da40ea50b9392efc58b2f1d` byte-for-byte; the immutable manifest
pins that commit. Derived data is regenerated and all local regression suites
pass again. Existing source-review findings remain open; no new answer
certification is inferred. Delivery history below is the earlier checkpoint;
use PR #7/Git for the current CI and merge result.

## Delivery state

**Merge authorization update:** on 2026-11-09 the owner requested merging this
branch into main. The checkpoint below describes the pre-merge state; consult
the PR/Git history for the operation result. This permission does not authorize
deployment/domain changes or close unfinished phase gates.


- Branch: `arena/be3d9178-diploma-3rd-sem` (active).
- Committed tip: `ac428d1` (Phase 2 evidence). Later engineering and this
  documentation are saved in the working tree, **not committed/pushed**.
- Hosted CI evidence for the older committed tree is not evidence that the
  current changes passed hosted CI. No new PR, merge or deployment occurred.
- **Documentation handoff is updated; phases 1–9 are not all complete.**
- Owner requests implementation first, then one dedicated cross-device phase.
  Routine syntax, integrity and focused regression checks continue meanwhile.
- Original 30 PYQ papers and five registries are byte-frozen. Fixes/mappings
  must use derived metadata rather than editing those originals.

## Phase-by-phase implementation remainder

| Phase | Present implementation | Still needed before closing implementation |
|---|---|---|
| 1 — Platform | Subpath-safe PWA, local assets, presence metadata, install/update controller | Preserve regressions as later modules change. Original platform implementation is complete; final hardware/install acceptance moves to Phase 10. Full source/syllabus gates remain separate. |
| 2 — Data | Deterministic inventory/scheduling, aliases, no-key labels, source-review ledger, immutable-PYQ guard | Resolve 10 source-backed data findings and 3 grouped syllabus errors; verify reprint relationships/key candidates and bank currency. No guessed keys or raw retags. |
| 3 — Quiz | Timed snapshots/resume, flags, grading boundaries, history/export/retry/edit, mistakes; paper answer-choice quotas and seven explicit 30-minute section locks | Fresh Chromium acceptance for the new paper tracker/lock; reconcile explanation-mark splits and printed totals before official paper grading. No overall paper grade is claimed. |
| 4 — Discovery | Compact search shards, safe search UI, exact-repeat explorer, question links, subject/unit related material | Finish remaining informational-page indexing and authored heading anchors; focused offline-search, back-button, share-fallback and keyboard acceptance. Do not describe current search as indexing every page. |
| 5 — Study system | Source-linked cards, fixed Leitner reviews, Today/goals/streaks, weak-area denominators, local seven-day trends | Broader clock/day-rollover/new-card-cap edge cases and clearer card-level source-eligibility reporting. Cards use existing model/keyed material, not new certification. |
| 6 — Storage/portability | Central namespaced boundary, verified legacy copy migration, notes, preferences, group reset, previewed backup/merge/replace, recovery journal | Implement IndexedDB threshold/async cutover/fallback and migration evidence; concurrent-tab transaction isolation/state sync; typed validation of further legacy variants. Current primary API remains synchronous local storage. |
| 7 — Inclusion/trust | Static landmarks/skip links on many legacy pages, shared focus/motion/reading controls, settings en/bn labels, truthful feedback/privacy | Remaining structure/heading/form warnings, full dialog/tab keyboard behavior, measured contrast/target/zoom evidence, wider Bengali UI catalog, credits/README maintenance and license/content-rights decision. No WCAG compliance claim yet. |
| 8 — Content depth | Derived 23-unit coverage/provenance, historical-total caveats, sourced practical/internship task pages, shared print styles | Cited formula/definition sheets, answer-verification batches, exam-total/source mapping reconciliation. No invented pedagogical sign-off. Physical print acceptance moves to Phase 10. |
| 9 — Performance/launch | Derived pools and checked-in bundles, measured request reduction, cache/measurement/domain docs, local-only usefulness prompt | CSS tokens/dead-code/payload consolidation, finer data loading, independent data/shell cache versioning and update regression, root-path rewritten-copy test, Lighthouse measurement and completed launch checklist. Publication remains separately authorized. |

Detailed evidence and qualifications live in each phase's `record.md` under
[phases](phases/README.md). The table is a remainder list, not a waiver of task
acceptance criteria.

## Separate verification and rights gates

These cannot be solved by declaring a feature complete:

1. **Source truth:** seven archived questions have stored Unit-5 tags in
   four-unit subjects; a 35-question CST209 Unit-5 quiz bank is outside the
   declared course; CST201 U3/U4 bank mappings are reversed relative to the
   syllabus. The ledger contains 10 data findings / 3 grouped syllabus errors.
   See [exceptions](data/validation-exceptions.json) and
   [source review](data/source-review-batch-01.md).
2. **Answer certification:** unknown keys remain ungraded. Existing model
   answers and scan-source verification do not establish answer certification.
   Imported keys/reprint relationships need source evidence and recorded review.
3. **Marks reconciliation:** historical printed maxima, set-question sums and
   the current 60-mark ESE pattern are not interchangeable. Keep visible warnings.
4. **Rights/license:** no root license has been selected. Do not invent rights
   to copied educational material or add a false license badge.
5. **Release:** hosted CI on the new tree, PR/merge, deployment and domain actions
   have not happened. A green local check is not permission to publish.

## Prior broad implementation evidence — 2026-11-09

These are historical local results from the broad implementation checkpoint;
they are not fresh browser evidence for the 2026-11-12 paper-rule changes:

- Python unittest discovery: **12 PASS**.
- Four deterministic Node suites: attempt state, scheduler/trends, storage and
  interruption/quota recovery — PASS.
- Seven focused Chromium suites: Practice/data, quiz engine, discovery/study,
  storage/notes, cached-paper offline, feedback, cached 20-card offline keyboard
  review — PASS. No broad device compatibility is inferred.
- Full parse sweep: **48 JS/CJS files and all JSON passed**.
- Site strict: **0 errors / 28 warnings**; platform check: **0 errors**.
- PYQ integrity: **0 changed/added/missing original files**.
- Exact data baseline matches; **full strict data/syllabus validation still
  fails on the recorded findings**.
- Cold local Chromium requests, service workers blocked: Practice **43 → 12**,
  quiz setup **28 → 12**. These are request counts, not real-device speed or
  Lighthouse scores. See [measurement data](phases/09-performance-launch/request-measurements.json).

For repeatable commands, see [tests](../tests/README.md). For the actual
incomplete cache guarantees, see [cache policy](CACHE-POLICY.md).

## Dedicated final device phase — not started

[Phase 10](phases/10-device-acceptance/README.md) follows implementation 1–9.
It consolidates actual Android/iOS/tablet/desktop, browser, keyboard/screen-reader,
zoom/reflow, background timer/screen lock, install/update/offline, backup download,
and print acceptance. Emulation and actual hardware must be identified separately.
Unavailable device access is **untested**, never silently passed.

## Recommended remaining order

1. Paper rule enforcement and storage/IndexedDB engineering (largest functional
   and data-safety gaps), with focused regression checks.
2. Finish discovery/study edges and accessibility/language implementation.
3. Complete cited content/reference work and performance/cache/root-path work;
   retain source and rights gates explicitly if evidence is unavailable.
4. Run final implementation gates and hosted CI when the branch is pushed;
   update records with real results, not forecasts.
5. Run the dedicated Phase 10 device matrix and fix/retest failures.
6. Stop at the separate release-authorization gate. Nothing here authorizes a
   merge, domain change or deployment.
