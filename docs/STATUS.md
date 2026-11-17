# Current status and remaining work

Documentation checkpoint: **2026-11-09**; reconciled **2026-11-16** (branch/
license audit — see `docs/AUDIT-2026-11-16.md`) and **2026-11-17** (sub-phase 8A
— see `docs/phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/`). This is the current handoff;
older phase evidence remains historical unless explicitly superseded here.

## Sub-phase 8A — answer prose and subject labels (2026-11-17)

Owner-requested work delivered on `arena/637a5a31-diploma-3rd-sem` (PR #10,
**merged 2026-11-17 as `8f6eb97`**) after the Python pilot merged as PR #9
(`365b8f7`). `main` now carries this sub-phase. Recorded in
[`phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/`](phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/README.md).

- **Prose:** 337 quiz-bank explanations (CST201/CST205/CST209) and 226 PYQ
  answers now carry a short reason sized for a 1-mark item. Only `explanation`
  and `answer` changed; a field-by-field diff against `365b8f7` shows zero change
  to question, options, stored key, type, unit, topic or marks.
- **Duplicates:** CST209-P002-2023-03 was deleted under the owner's rule (only
  where the subject has no 2021 sitting); CST203's duplicate went in PR #9.
  Repo now holds **28 papers / 924 raw PYQs / 923 unique / 1 alias**;
  CST201, CST205 and CST207 keep every paper.
- **Labels:** every page a learner sees names the subject (C · Python · DS · CSO ·
  Algorithms) instead of showing a course code, and raw paper/question IDs are no
  longer printed. Display only: no path, file, question ID, URL parameter,
  `data-*` value, storage key or JSON payload changed.
- **Gates:** `validate_pyq` PASS (28 papers / 924 questions),
  `check_pyq_integrity` 0 changed, `validate_data --check-baseline` matches the
  ledger (**9** open findings — the CST209-P002-Q34 finding closed with the
  deleted paper), `check_platform` 0 errors, Python `unittest` 13 PASS, six Node
  suites PASS, `check_site.py --strict` identical to `main` (17 pre-existing
  accessibility labels). Playwright browser suites run in CI only here.
- **Still open:** content verification (8.6) including the six CST203 key
  conflicts, no quiz bank for CST207, 456 unkeyed quiz items, phase 7
  accessibility findings, and device acceptance (phase 10).

## Current source reconciliation

Owner approved preserving newer main for PR #7. Papers/registries now match
`cfe3a63decb270826da40ea50b9392efc58b2f1d` byte-for-byte; the immutable manifest
pins that commit. Derived data is regenerated and all local regression suites
pass again. Existing source-review findings remain open; no new answer
certification is inferred. Delivery history below is the earlier checkpoint;
use PR #7/Git for the current CI and merge result.

## Delivery state

**Merge authorization update:** the owner authorized merging on 2026-11-09
(PR #7, `125eb94`), 2026-11-16 (PR #8, `3e3cb2e1`), and 2026-11-17 (PR #9
`365b8f7`, PR #10 `8f6eb97`, PR #11 `9d47c7c7`, PR #14 `5b7eb66`, PR #15
`84e99aa`). No such
permission authorizes deployment, Pages or domain changes, and none closes an
unfinished phase gate.

- Branch: `arena/c56bb630-diploma-3rd-sem` (active session branch, branched
  from `main` at `5b7eb663799614a826231f668920f8d597793943`, the PR #14 merge of
  the Phase 6 branch).
  Earlier branches `arena/be90e07e-...` (PR #14 `5b7eb66`), `arena/4d3997da-...`
  (PR #13 `a92a1ff`), `arena/637a5a31-...` (PR #10 `8f6eb97`, PR #11
  `9d47c7c7`), `arena/858a50c7-...` (PR #9 `365b8f7`),
  `arena/47d8bf99-...` (PR #8 `3e3cb2e1`), `arena/be3d9178-...` (PR #7
  `125eb94`), and `arena/26856d99-...` (`8405b15`) are merged and retired.
- Phase 2 engineering passed owner Termux verification (`✅*` at commit
  `021c4f2f94f387f4dd4e020d09e82a12b8720bec`, Web CI `43917224887` green);
  strict source-verification items (`9` data findings + `3` grouped syllabus
  findings) remain tracked under the separate content-verification gate.
- Phase 3 (`03-quiz-engine`) is owner-approved (`✅*`, merged via PR #11
  `9d47c7c7`), with explicit caveats recorded in
  [`phases/03-quiz-engine/record.md`](phases/03-quiz-engine/record.md) (no
  standalone CST207 quiz bank; 456 unkeyed quiz items and subjective / 1-mark
  written MCQ explanations stay manual self-review; 9 data + 3 syllabus
  source-review findings; hardware/browser acceptance in Phase 10).
- Phase 4 (`04-discovery`) is **`✅*`**: parts 4.1–4.5 gate-verified on
  `arena/80b11bcf-diploma-3rd-sem`, merged via PR #12 (`7c20a55`), and
  **owner-verified on device/Termux on 2026-11-17 ("device test pass")**; see
  [`phases/04-discovery/record.md`](phases/04-discovery/record.md).
- Phase 5 (`05-study-system`) is **`✅*`**: parts 5.1–5.5 gate-verified and
  owner-verified on device/Termux on 2026-11-17, merged to `main` on owner
  instruction; see
  [`phases/05-study-system/record.md`](phases/05-study-system/record.md). The
  offline worker version is `study-2026-11-17b`.
- Phase 6 (`06-state-portability`) is **`✅*`**: parts 6.1–6.6 gate-verified on
  `arena/be90e07e-diploma-3rd-sem` (2026-11-17) and **merged to `main` on owner
  instruction as `5b7eb66`** (PR #14; Web CI `44034450353` and Pages
  `44034449241` green): one storage boundary, one preference record with a
  pre-paint theme, registry-counted reset groups, notes on unit pages plus
  practice and quiz review, backup with `appVersion`, and an IndexedDB
  **recovery mirror** (6.6-3 partially met). Real eviction/Safari behaviour,
  private-mode IndexedDB on hardware and real-phone backup download remain
  **unverified** and move to Phase 10; see
  [`phases/06-state-portability/record.md`](phases/06-state-portability/record.md).
- Phase 7 (`07-inclusion-trust`) is **`✅*`**: parts 7.1–7.5 implemented and
  gate-verified on `arena/c56bb630-diploma-3rd-sem` (2026-11-17) and
  **accepted by the owner on 2026-11-17** after an Android/Chrome smoke pass
  reported no failures, and **merged to `main` on owner instruction as merge
  commit `84e99aa`** (PR #15; Web CI `44042637676` and Pages `44042636441`
  green). The acceptance rests on static
  measurement plus a general click-through, not a per-criterion device audit —
  the items named below stay open and unupgraded. Delivered: all 68 pages have
  one `<main>`, one `<h1>` and a skip link (0 of 68 missing, from 11); 134
  heading-order jumps across 32 pages are 0; the one unlabelled control is
  labelled; **all 47 measured contrast pairs pass, 27 failed before** (187
  total findings → 0); 21 of 22 first-party CSS files declare a reduced-motion
  rule (from 7) and all 68 pages
  load the global override; no control box is pinned below 24×24 CSS px; a
  38-key English/Bengali UI catalog loads on every page; and the privacy, offline
  and about claims that the build could not support are corrected. **No WCAG
  conformance claim** — rendered contrast, 200 % zoom/reflow, screen-reader
  output, real tap accuracy, Bengali glyph rendering and keyboard-only core-flow
  completion remain unverified and move to Phase 10 — the owner's Android/Chrome
  smoke pass showed the branch runs on real hardware but measured none of them.
  Worker version is `study-2026-11-17c`. See
  [`phases/07-inclusion-trust/record.md`](phases/07-inclusion-trust/record.md).
- Historical note: `docs/phases/02-data-pipeline/record.md` and
  `docs/phases/03-quiz-engine/record.md` still name
  `arena/be3d9178-diploma-3rd-sem` as the branch that work was performed on. That
  is accurate history and is preserved intentionally; the *active* branch is the
  one named above.
- Hosted CI evidence for the older committed tree is not evidence that the
  current changes passed hosted CI. No new PR, merge or deployment occurred.
- **Documentation handoff is updated; phases 1–9 are not all complete.**
- Owner requests implementation first, then one dedicated cross-device phase.
  Routine syntax, integrity and focused regression checks continue meanwhile.
- The 28 remaining PYQ papers and five registries are byte-frozen. Fixes/mappings
  must use derived metadata rather than editing those originals.

## Phase-by-phase implementation remainder

| Phase | Present implementation | Still needed before closing implementation |
|---|---|---|
| 1 — Platform | Subpath-safe PWA, local assets, presence metadata, install/update controller | Preserve regressions as later modules change. Original platform implementation is complete; final hardware/install acceptance moves to Phase 10. Full source/syllabus gates remain separate. |
| 2 — Data (`✅*`) | Deterministic inventory/scheduling, enriched catalog & derived pools, all 5 subject + 24 unit HTML pages syllabus-aligned & validator-checked, alias deep links & PYQ repeat cross-refs, generic topics filtered, no-key labels, source-review ledger, immutable-PYQ guard | Owner/source GATE only: resolve 9 source-backed data findings and 3 grouped syllabus errors; verify the 15 normalized-stem candidate clusters and CST207/Jan-2026 bank additions. No guessed keys or raw retags. |
| 3 — Quiz (`✅*`) | Timed snapshots/resume, flags, grading boundaries, history/export/retry/edit, mistakes, full paper practice enforcing `paperFormat` `answerAny` section/choiceSet quotas across 28 papers, 30m `2023-03` Group A loose-script window, `1m option + 1m written explanation` split, ESE pattern warnings, Print/PDF export | Owner-approved with recorded caveats: no standalone CST207 quiz bank; 456 unkeyed items and subjective/written-explanation marks remain manual self-review; Phase 10 cross-device acceptance pending. |
| 4 — Discovery (`✅*`) | 2,410 search entries across 5 subject shards + `index-pages.json` (50/68 HTML pages indexed, 18 explicitly excluded in `manifest.json`, all shards ≤ 40%), offline SW precache + `WARM_SEARCH`, XSS-safe keyboard/URL/`popstate` search UI, 1 exact alias + 15 unverified candidate repeat clusters (32 records), deep links + `navigator.share`/clipboard/input fallbacks across PYQ/Practice/Quiz, authored unit heading anchors + breadcrumbs + hub counts + filtered-PYQ URL handoff, `subjectLabel()` everywhere | Owner-verified 2026-11-17 ("device test pass") and merged via PR #12. Normalized candidate clusters remain pending source-verified dedup; physical phone latency/share-sheet/screen-reader testing stays in Phase 10. |
| 5 — Study system (`✅*`) | Source-linked cards with per-unit eligibility reporting, documented Leitner scheduling (clock/day-rollover/new-card-cap edges tested), review UI with URL+`popstate` filters and empty-queue fallbacks, Today dashboard with one primary action, weak-area denominators/attempt counts/trends, offline card caching (`WARM_STUDY`) | Owner-verified 2026-11-17 ("device test pass") and merged to `main` on owner instruction. Cards use existing model/keyed material, not new certification; answer certification stays a separate source gate. Device/screen-reader acceptance is Phase 10. |
| 6 — Storage/portability (`✅*`) | Central namespaced boundary, verified legacy copy migration, notes on 24 unit pages + practice + quiz review, one preference record, group reset with live counts, previewed backup/merge/replace, recovery journal, IndexedDB recovery mirror with `hydrate()` | Merged via PR #14 (`5b7eb66`). Still needed if IndexedDB is to become a *primary* store: an async render contract, threshold/cutover evidence, concurrent-tab transaction isolation/state sync, and typed validation of further legacy variants. Current primary API remains synchronous local storage, and 6.6-3 stays a partial meet. |
| 7 — Inclusion/trust | Static landmarks/skip links on many legacy pages, shared focus/motion/reading controls, settings en/bn labels, truthful feedback/privacy | Remaining structure/heading/form warnings, full dialog/tab keyboard behavior, measured contrast/target/zoom evidence, wider Bengali UI catalog, credits/README maintenance and license/content-rights decision. No WCAG compliance claim yet. |
| 8 — Content depth | Derived 23-unit coverage/provenance, historical-total caveats, sourced practical/internship task pages, shared print styles | Cited formula/definition sheets, answer-verification batches, exam-total/source mapping reconciliation. No invented pedagogical sign-off. Physical print acceptance moves to Phase 10. |
| 9 — Performance/launch | Derived pools and checked-in bundles, measured request reduction, cache/measurement/domain docs, local-only usefulness prompt | CSS tokens/dead-code/payload consolidation, finer data loading, independent data/shell cache versioning and update regression, root-path rewritten-copy test, Lighthouse measurement and completed launch checklist. Publication remains separately authorized. |

Detailed evidence and qualifications live in each phase's `record.md` under
[phases](phases/README.md). The table is a remainder list, not a waiver of task
acceptance criteria.

## Separate verification and rights gates

These cannot be solved by declaring a feature complete:

1. **Source truth:** six archived questions have stored Unit-5 tags in
   four-unit subjects (4 in CST205, 2 in CST209); a 35-question CST209 Unit-5
   quiz bank is outside the declared course; CST201 U3/U4 bank mappings are
   reversed relative to the syllabus. The ledger contains 9 data findings /
   3 grouped syllabus errors (plus 1 warning for missing CST207 quiz bank).
   See [exceptions](data/validation-exceptions.json) and
   [source review](data/source-review-batch-01.md).
2. **Answer certification:** unknown keys remain ungraded. Existing model
   answers and scan-source verification do not establish answer certification.
   Imported keys/reprint relationships need source evidence and recorded review.
3. **Marks reconciliation:** historical printed maxima, set-question sums and
   the current 60-mark ESE pattern are not interchangeable. Keep visible warnings.
4. **Rights/license:** repository is **MIT** (chosen 2026-11-16; `LICENSE`
   added) for its own code/authored content. Third-party examination-source
   material keeps unresolved rights and is a separate gate — do not invent rights
   to that material or imply the MIT license covers it.
5. **Release:** hosted CI on the new tree, PR/merge, deployment and domain actions
   have not happened. A green local check is not permission to publish.

## Latest recorded engineering evidence

These are local results from the latest implementation checkpoint, not a claim
that documentation-only edits reran all browser suites:

- Python unittest discovery: **22 PASS** (including 6 Phase 5 card-eligibility
  tests — source-verbatim copies, citation hygiene, skip accounting, per-unit
  counts, byte-identical regeneration, compact payload — and 5 discovery tests verifying
  shard determinism, ≤ 40% byte budgets, 68-page scope partition, 2,410-entry
  file/anchor resolution, 1 exact + 15 unverified candidate repeat clusters, and
  SW discovery cache registration).
- Nine deterministic Node suites: attempt state + 28-paper rule/quota/section-timer/explanation-split verification, quiz DOM/export/label contracts, scheduler/trends/clock/day-rollover/streak/goal helpers, storage, interruption/quota recovery, Phase 2 derived-pipeline consumers, Phase 4 discovery DOM/XSS/keyboard/repeat/deep-link/share-fallback/unit/SW offline simulation (`tests/discovery-dom.cjs`), Phase 5 study DOM/UI/keyboard/popstate/empty states (`tests/study-dom.cjs`) and the study worker precache/`WARM_STUDY`/offline navigation (`tests/study-offline.cjs`) — **PASS**.
- Seven focused Chromium suites: Practice/data, quiz engine, discovery/study,
  storage/notes, cached-paper offline, feedback, cached 20-card offline keyboard
  review — PASS at the Phase 4 checkpoint. They were updated for the Phase 5
  markup but **not re-run** in the 2026-11-17 environment (no Chromium there); no
  broad device compatibility is inferred.
- Full parse sweep: **55 JS/CJS files and all 79 JSON files passed**.
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

1. Phase 7 is `✅*` and merged (`84e99aa`). Next sequential phase is Phase 8
   (`08-content-depth`), with Phase 9 after it. Nothing here authorizes a
   deployment setting change, tag or release.
2. Phase 7's acceptance left these unmeasured, and they are Phase 10 items:
   rendered contrast after compositing, 200 % zoom/reflow on the longest unit
   page, dialog and tab focus behaviour, screen-reader output
   (NVDA/TalkBack/VoiceOver), tap accuracy, Bengali conjunct rendering and
   keyboard-only core-flow completion.
3. Finish the remaining content-depth work (cited formula/definition sheets,
   lab/internship pages).
3. Complete cited content/reference work and performance/cache/root-path work;
   retain source and rights gates explicitly if evidence is unavailable.
4. Run final implementation gates and hosted CI when the branch is pushed;
   update records with real results, not forecasts.
5. Run the dedicated Phase 10 device matrix and fix/retest failures.
6. Stop at the separate release-authorization gate. Nothing here authorizes a
   merge, domain change or deployment.
