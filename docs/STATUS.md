# Current status and remaining work

Documentation checkpoint: **2026-11-09**; reconciled **2026-11-16** (branch/
license audit — see `docs/AUDIT-2026-11-16.md`) and **2026-11-17** (sub-phase 8A,
Phase 7 merge, and **Phase 8 content depth**
— see `docs/phases/08-content-depth/record.md`). This is the current handoff;
older phase evidence remains historical unless explicitly superseded here.

## Phase 8 — content depth and syllabus coverage (2026-11-17) — `✅*`, merged

Implemented on `arena/e0da0bec-diploma-3rd-sem` (from `main` at `84e99aa`, the
PR #15 merge). Full evidence: [`phases/08-content-depth/record.md`](phases/08-content-depth/record.md).

- **Measured first, and three of the phase README's claims were already false**
  for this tree: the lab/internship pages existed, CST201's *pages* were already
  in syllabus order (the **quiz bank** is reversed), and the CST203 skew was
  117/170, not 140/204. The old coverage page also printed `quizCount: 0` for all
  23 units and a raw `{None: 211}` out-of-syllabus dict.
- **8.1 ✅** Coverage map rebuilt: 23 declared units, both out-of-syllabus rows
  (CST205 and CST209 Unit 5) listed instead of hidden, real per-unit quiz counts,
  note sections/words per unit, flag legend, and the Unit-1 skew published as a
  table — 496 of 924 records (53.7%) — with the June-2022 tagging explanation.
- **8.5 ✅** The p.14 ESE table is reproduced and sums to 60; **all 28 paper
  maxima reconcile** with the answer-any quotas printed on the papers. The old
  comparison (marks on *all set* questions vs the maximum) could never match.
  Three printed shapes are shown; which applies to a session stays unverified.
  Decision recorded in `docs/DECISIONS.md`.
- **8.3 ✅ (static side)** `print.css` now loads on **74/74** pages (was 33/68),
  is precached, adds break control and answers-on-a-new-page, and one shared
  labelled print control exists. A paper prints with or without answers and no
  longer leaks `[Correct]` markers into a question sheet. No fake running header:
  browser `@page` margin boxes are unsupported. **No real PDF export observed.**
- **8.4 ✅** Lab/internship pages rewritten with credits, L-T-P, hours, assessment
  fields, the supported theory course and every transcribed task area; still no
  solution or completion claim.
- **8.2 ⛔ owner gate** 44 sourced draft entries (41 definitions, 3 formulas with
  symbol legends) across five sheets; every citation is validated as a verbatim
  syllabus topic by `scripts/build_revision_sheets.py`. **0 verified**, not linked
  from navigation.
- **8.6 ⛔ owner gate** Register (`docs/data/answer-verification.json`) plus a
  fail-closed validator and a derived ledger: **924 records, 924 with a source
  page, 0 with a verification date, 0 certified**. Per-answer provenance is now an
  expandable "Source … not certified" line.
- **Accepted `✅*` by the owner on 2026-11-17** — reported "everything is pass on
  a smoke use test, nothing breaks" — and **merged to `main` as PR #16**. The
  asterisk is the whole story: acceptance covers the implementation, not the
  content. **0 of 44** revision entries and **0 of 924** answers are
  source-verified, and no real print/PDF export was observed.
- **Still open:** 8.2/8.6 sign-off; 456 unkeyed quiz items; the reversed CST201
  bank units and the six Unit-5 tags (source gate, never re-tagged); a real print
  export on hardware (Phase 10).

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
`365b8f7`, PR #10 `8f6eb97`, PR #11 `9d47c7c7`, PR #14 `5b7eb66`). No such
permission authorizes deployment, Pages or domain changes, and none closes an
unfinished phase gate.

- Branch: `arena/e0da0bec-diploma-3rd-sem` (active session branch, branched
  from `main` at `84e99aad91d1baf9b4e1110b0767a0ea0b4cd6c2`, the PR #15 merge of
  the Phase 7 branch).
  Earlier branches `arena/c56bb630-...` (PR #15 `84e99aa`), `arena/be90e07e-...` (PR #14 `5b7eb66`), `arena/4d3997da-...`
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
  reported no failures, and **merged as PR #15 (`84e99aa`)**. The acceptance rests on static
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
  Worker version is now `study-2026-11-17d` (Phase 8 added the print sheet); the
  2026-11-17 Phase 7 measurement covers the 68-page tree, and Phase 8 regenerated
  the audit baseline for 74 pages with identical findings. See
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
| 8 — Content depth `✅*` | Measured coverage map with out-of-syllabus rows and Unit-1 skew, reconciled paper maxima, print sheet on 74/74 pages, sourced practical/internship pages, 44 cited draft sheet entries, fail-closed answer-verification register | **Owner/source GATE only:** sign off the revision sheets (0 of 44) and the answer batches (0 of 924, ≤40 per batch with citation + date); resolve the reversed CST201 bank units and the six Unit-5 tags; observe a real print/PDF export (Phase 10). |
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

- Python unittest discovery: **63 PASS** (33 before Phase 8). The 30 extra cover
  Phase 8: coverage-map determinism, the validate_syllabus recount, out-of-syllabus
  rows, the CST201 bank-reversal disclosure, exam-pattern reconciliation of all 28
  papers, print-sheet reach on 74/74 pages, lab/internship page citations, verbatim
  revision-sheet citations and symbol legends, the fail-closed verification
  register (five rejection cases plus one acceptance), and the "0 certified" lock.
  Earlier suites still cover card eligibility, discovery shard budgets, the
  74-page scope partition and SW discovery cache registration.
- Sixteen deterministic Node suites (`tests/*.cjs` minus the Chromium ones): attempt state + 28-paper rule/quota/section-timer/explanation-split verification, quiz DOM/export/label contracts, scheduler/trends/clock/day-rollover/streak/goal helpers, storage, interruption/quota recovery, Phase 2 derived-pipeline consumers, Phase 4 discovery DOM/XSS/keyboard/repeat/deep-link/share-fallback/unit/SW offline simulation (`tests/discovery-dom.cjs`), Phase 5 study DOM/UI/keyboard/popstate/empty states (`tests/study-dom.cjs`) and the study worker precache/`WARM_STUDY`/offline navigation (`tests/study-offline.cjs`) — **PASS**. The remaining `.cjs` files (`paper-offline`, `cards-offline`, and every `*-browser.cjs`) need Chromium and were **not run** here, so they are not evidence for this tree.
- Seven focused Chromium suites: Practice/data, quiz engine, discovery/study,
  storage/notes, cached-paper offline, feedback, cached 20-card offline keyboard
  review — PASS at the Phase 4 checkpoint. They were updated for the Phase 5
  markup but **not re-run** in the 2026-11-17 environment (no Chromium there); no
  broad device compatibility is inferred.
- Full parse sweep: **55 JS/CJS files and all 79 JSON files passed** (Phase 8
  added no JSON under `_data`; the new derived files are `assets/data/coverage.json`,
  `assets/data/verification.json` and `assets/data/revision-sheets.json`).
- Accessibility audit: **74 pages, 0 findings**, 47 contrast pairs all passing,
  74/74 pages load the global reduced-motion override. `check_readme_paths`: 0 missing.
- Site strict: **0 errors / 0 warnings** (the 28 warnings recorded earlier were
  paid down across Phases 6–8); platform check: **0 errors**.
- PYQ integrity: **0 changed/added/missing original files**.
- Exact data baseline matches; **full strict data/syllabus validation still
  fails on the recorded findings**.
- Phase 8 regeneration order (README): builders → `generate_presence.py` ×2 →
  `build_search_index.py` → `check_pyq_integrity.py`; the second presence pass is
  required and a test now proves the tree ends byte-identical.
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

1. **Phase 9 — performance and launch** is next and is the last engineering
   phase. It is already partially done (9.1 data loading shipped and measured:
   Practice 43 → 12 requests, 36 → 1 JSON; quiz setup 28 → 12). Remaining:
   9.2 CSS/JS consolidation with one token file, 9.3 independent data-cache
   versioning plus an update-flow regression, 9.4 the measurement gate (owner
   answer recorded), 9.5 base-path rewrite proof, 9.6 launch checklist and
   Lighthouse/deep-metrics measurement. Re-measure from the **74-page**,
   worker-`study-2026-11-17d` tree, not the 68-page numbers in the 11-09 record.
2. Phase 8's two content gates stay open in parallel and are **owner work**:
   sign off revision entries, then answer batches of ≤40 with a citation and a
   date. Nothing in this branch certified content.
3. Phase 7 is `✅*` and merged as PR #15; its acceptance left these unmeasured,
   and they remain Phase 10 items together with Phase 8's print export:
   rendered contrast after compositing, 200 % zoom/reflow on the longest unit
   page, dialog and tab focus behaviour, screen-reader output
   (NVDA/TalkBack/VoiceOver), tap accuracy, Bengali conjunct rendering and
   keyboard-only core-flow completion.
4. Finish Phase 9, then Phase 10 (one device-acceptance phase) — the last
   phase;
   retain source and rights gates explicitly if evidence is unavailable.
4. Run final implementation gates and hosted CI when the branch is pushed;
   update records with real results, not forecasts.
5. Run the dedicated Phase 10 device matrix and fix/retest failures.
6. Stop at the separate release-authorization gate. Nothing here authorizes a
   merge, domain change or deployment.
