# Phase 3 — Quiz and exam engine

- Status: 🚧 in progress · Date: 2026-11-09
- Branch: arena/be3d9178-diploma-3rd-sem · starting tip ac428d1
- Owner delegation permits independent engine work; Phase 2 source gates remain.
- Owner confirms immutable authoritative PYQs; hash guard added before coding.

## Reused (before implementation)

- 3.1 ADAPT — existing quiz snapshots/timer/UI contracts; BUILD one versioned
  attempt persistence module with legacy migration; no dependency.
- 3.2 ADAPT — Phase 2 loaded inventory/availability; derive missing marks too.
- 3.3 ADAPT — raw paper registry, options/key compatibility and paperFormat
  instructions; no new marks/keys or silent syllabus reconciliation.
- 3.4 ADAPT — existing export serializers and question snapshots; explicit IDs.
- 3.5 BUILD — small local-only mistake collection owned by attempt module.
- 3.6 ADAPT — existing labels/format descriptions; no model or network service.

## Evidence before change

- `play.js:282-339,790`: resume resets full timer; autosave stores no deadline.
- `play.js:586`: clearing text does not delete the old answer.
- `index.js:654`: resume subject incorrectly reads saved.subject.
- `common.js:1006`: bank failure becomes empty array; partial quizzes possible.
- `export.js:93`: always current result; history omits question snapshots.
- `result.js:699` and `export.js:472`: retries regenerate instead of stored IDs.
- `review.js:553`: edits update only current result, not linked history.
- User explicitly says no PYQ changes: freeze existing 30 paper + 5 registry
  bytes and move future scheduling updates to sidecars. No unit retags applied.


## Implemented and locally verified

- **3.1 implemented:** versioned `QuizAttempts` boundary, question snapshots,
  wall-clock deadlines, five-second / visibility / pagehide persistence,
  immediate navigation saves, verified legacy migration with source retention,
  empty-answer deletion, retryable bank-load error, marked flags.
- **3.2 implemented:** inventory-derived marks/types/source/year availability,
  exact snapshot preview and start (questions/marks/time), persisted config.
  Browser regression caught a seconds/minutes conversion bug; corrected and
  exact-start assertion added. Existing Phase 2 availability tests also pass.
- **3.3 PARTIAL:** paper entry from viewer/setup, original questions/options,
  registry duration and displayed instructions, 10m/1m warnings, expiry path,
  cached-paper offline flow. Answer-any/group constraints are NOT enforced.
  Explanation splits are NOT inferred; paper MCQ correctness can be checked,
  but automatic paper marks and overall grades are explicitly withheld.
- **3.4 implemented:** scored/not-scored/abandoned history, wrong vs unanswered,
  explicit historyId export, own answers and filenames, exact retry/order/flags,
  separately labelled shuffled retry, linked review edits. Snapshot-less legacy
  history refuses exact retry/export rather than substituting another attempt.
- **3.5 implemented:** local newest-first queue capped at 200 question snapshots,
  newest 40 practice entry, wrong/skipped/unanswered metadata, resolution count,
  idempotent completion handling, confirmed clear on quiz and Practice home.
- **3.6 implemented:** manual-review language, format guidance and attempt
  identity; no model/API/evaluation fiction. Privacy names actual storage/reset
  boundaries; homepage reset is not falsely presented as clearing all quiz data.

## Immutable originals / derived metadata

`_data/pyq-integrity.json` freezes 30 papers and five registries. The guard
rejects changed, missing and added subject JSON files. Mutation tests cover
all three. Catalog/schedule generators no longer rewrite originals; Practice
reads ID-to-day assignments from the derived schedule sidecar. No questions,
keys, paper metadata, source IDs or original bytes were changed. Unknown
answers remain ungraded; Phase 2 mapping/reprint/key gates remain unresolved.

## Local evidence — 2026-11-09

- `node tests/attempt-store.cjs`: five PASS groups (timer resume/expiry,
  migration, scoring/retry/mistakes, linked edits, storage failure/no guessed
  explanation marks).
- Python unittest discovery: seven PASS tests (including integrity mutations).
- `tests/quiz-engine-browser.cjs`: seven PASS groups in headless Chromium,
  under `/after/Diploma-3rd-sem/`; virtual-clock 30s/5m reload + visibility,
  flags/index/answers, exact preview start/retry, three selected exports,
  linked edit, forced bank failure and paper practice. No page errors.
- `tests/data-browser.cjs`: five Phase 2 browser regression groups PASS.
- `tests/paper-offline.cjs`: warmed service-worker cache, then browser offline,
  paper/registry/engine/review worked end-to-end. First visit offline is NOT
  promised. Tests use development-only Playwright outside runtime dependencies.
- Full syntax sweep: 29 JS/CJS and 61 JSON parsed. Site strict: 0 errors,
  97 existing warnings. Platform: 0 errors. PYQ schema: 30 papers PASS.
- PYQ byte guard: 0 changed/added/missing. Data exact baseline matches;
  this is NOT a full strict-data pass (10 data / 3 syllabus findings retained).
- Added deterministic attempt tests and immutable-source guard to CI workflow;
  hosted CI for these unpushed changes has not run.
- Screenshots in `screenshots/`: before/after quiz index/setup/play,
  after-history and after-paper. Before is the committed ac428d1 tree.

## Remaining gates / limits

Phase 3 is NOT complete: official choice-rule and explanation-mark enforcement
(3.3) is deferred rather than fabricated. Real-device background throttling,
screen-reader acceptance, complete keyboard audit, and broad device coverage
are not verified by headless tests. Phase 2 authoritative mapping/answer-key
issues and the repository license gate remain open. Phases 4–9 are not claimed
complete. No PR, merge or deployment was performed for this work.

### Storage integration follow-up

The later Phase 6 boundary now namespaces the compatibility keys under `d3s:`;
legacy save snapshots remain logically retained until attempt migration and
completion/discard, even after verified namespace-copy migration. Focused quiz,
Practice and warmed-paper offline regressions pass against the real boundary.
Setup now consumes a generated 872-question pool and a checked-in concatenated
script; snapshot/preview/filter behavior is unchanged and regression-tested.


## Continuation — paper rules implementation, 2026-11-12

- **Reused:** ADAPT the repo's existing immutable `paperFormat.groups`, nested
  `sections`, question IDs, source-number labels, registry duration and printed
  instructions. BUILD a small dependency-free rule adapter because no compatible
  first-party enforcement module existed. No external library or data rewrite.
- `quiz/js/paper-rules.js` derives group/section quotas from structured source
  metadata. For explicit “one alternative from each Q…” instructions, it
  partitions the existing source-number labels into per-question pools; it
  rejects ambiguous, overlapping or incomplete metadata instead of guessing.
  A cross-file test confirms all 30 registered papers map every question into
  exactly one supported quota, with no unsupported pools.
- The paper screen now has an accessible choice tracker. It prevents selecting
  above each printed quota, saves intended choices through reload/history, and
  includes them in review and Markdown/JSON/TXT exports. It remains an answer
  choice aid: written responses and explanation marks are not machine graded.
- Where the general instruction explicitly states a 30-minute collection rule
  and exactly one structured group identifies the same first section, a separate
  deadline is derived. For those **7** registered papers, the attempt starts in
  that section, later groups stay closed until its deadline or confirmed early
  finish, and the collected group cannot be reopened. The deadline/lock survive
  resume. Papers without such an explicit matched rule receive no invented
  section clock.
- PYQ and registry bytes remain immutable. The service-worker cache version was
  bumped to `quiz-paper-rules-2026-11-12`; checked-in quiz setup bundle and
  generated page build metadata were regenerated.

### Fresh local checks

- Python unittest discovery: **12 PASS**.
- Node suites: **6 PASS** — attempts (including paper selection/timed-state
  persistence), paper rules across all 30 registries, paper export formats,
  study scheduler/trends, storage/backup and recovery.
- JS/CJS parse sweep across assets, quiz, practice and tests: PASS. Asset report:
  37 JS files / 751,972 bytes (largest generated setup bundle 95,556 bytes),
  23 CSS files / 579,028 bytes, and 80 JSON files / 5,221,885 bytes; these are
  uncompressed source/check-out sizes, not transfer or Lighthouse measurements.
- PYQ integrity: **0 changed/added/missing**; PYQ validation: 30 papers / 992
  questions, 0 errors/warnings.
- Exact data baseline: PASS as ledger match only; Phase 2's source findings
  remain. Site strict: **0 errors / 28 warnings**; platform check: **0 errors**;
  `git diff --check`: PASS.
- Fresh browser/Chromium run: **not run** in this environment (Playwright and a
  Chromium executable are absent). The updated quiz browser regression includes
  answer-any limits, reload, timed-section lock, and paper export, but its result
  remains unverified until run in a browser. Historical 2026-11-09 browser
  evidence is not counted as a pass for this change.

### Remaining in Phase 3

Official paper marks/overall grade remain withheld: explanation-mark splits and
printed maxima still need the source reconciliation tracked under Phase 8.5.
Source-stated paper-section timer evidence has been implemented for the 7
matched records, but no real device/background timer behavior has been observed;
that acceptance belongs to Phase 10. Hosted CI has not run for this continuation. Phase 3 remains **in progress**,
not complete. The implementation is pushed on the active Arena branch; no PR,
merge, deployment or publication was performed.
