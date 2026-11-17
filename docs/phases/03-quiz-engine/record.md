# Phase 3 — Quiz and exam engine

- Status: ✅* owner-approved with recorded caveats (merged to `main` via PR #11 `9d47c7c7`; status reconciled 2026-11-17 on `arena/80b11bcf-diploma-3rd-sem`)
- Branch: arena/be3d9178-diploma-3rd-sem **(retired — PR #7 `125eb94`; completed across `arena/47d8bf99-diploma-3rd-sem` PR #8 `3e3cb2e1` and `arena/637a5a31-diploma-3rd-sem` PR #11 `9d47c7c7`)** · starting tip ac428d1
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
- **3.3 implemented:** paper entry from PYQ viewer (`pyq/js/viewer.js`) and quiz
  setup (`quiz/setup.html`), original questions/options, registry duration (`2.5 Hours`
  = 150m / `3 Hours` = 180m) and displayed instructions, 10m/1m warnings, expiry
  auto-submit path, cached-paper offline flow. `QuizPaper.derivePaperRules()` and
  `QuizAttempts.questionAccess()` now enforce explicit `answerAny` quotas across all
  30 frozen PYQ papers (`group`, `group.sections[]`, and Group C `group.choiceSets[]`
  on `2022-06` papers), allow clearing/switching answered MCQ choices under section
  quotas, and enforce the compulsory 30-minute Group A loose-script window (plus
  early `"Lock Group A & unlock Group B"` hand-in) across reloads on all seven
  `2023-03` papers. On the 15 `2024-01`/`2024-12`/`2026-01` papers with `2`-mark
  Answer+Explanation MCQs, `optionMarks: 1` is auto-checked while `explanationMarks: 1`
  provides a saved/editable written explanation field for manual self-review without
  guessing explanation marks or inventing an official overall paper grade; ESE
  `60`-mark pattern differences (`70`-mark `2021-03` papers and choice-set totals)
  surface explicit banners in play and review.
- **3.4 implemented:** scored/not-scored/abandoned history, wrong vs unanswered,
  explicit historyId export, own answers/written MCQ explanations and filenames,
  exact retry/order/flags, separately labelled shuffled retry, linked review edits
  (both answers and 1-mark written MCQ explanations). Snapshot-less legacy
  history refuses exact retry/export rather than substituting another attempt.
- **3.5 implemented:** local newest-first queue capped at 200 question snapshots,
  newest 40 practice entry, wrong/skipped/unanswered metadata, resolution count,
  idempotent completion handling, confirmed clear on quiz and Practice home,
  `attempt-store.js` loaded before `mistakes.js` on `quiz/index.html`, and
  `diploma-3rd-sem-quiz-mistakes` governed in `assets/js/storage.js`.
- **3.6 implemented:** manual-review language, one-sentence explanations for MD,
  TXT, JSON, and Print / Save as PDF (`#btn-print-export` wired to `window.print()`
  on `quiz/export.html`), and attempt identity; zero `"AI"` fiction across `quiz/`.
  Privacy names actual storage/reset boundaries; homepage reset is not falsely
  presented as clearing all quiz data.

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

All engineering parts 3.1–3.6 are implemented and verified on
`arena/47d8bf99-diploma-3rd-sem` (`node tests/attempt-store.cjs` 8 PASS groups
including all 30 PYQ papers' rule partitions, `answerAny` section/choiceSet
quotas, 30m `2023-03` loose-script Group A lock/unlock across reloads, and `1+1`
explanation mark split; `node tests/quiz-engine-dom.cjs` 5 PASS groups; Python
`unittest` 13 PASS; `check_site.py --strict` 0 errors; `check_platform.py`
0 errors; `check_pyq_integrity.py` 0 changes). Official overall paper grades
remain intentionally withheld where subjective answers and 1-mark written MCQ
explanations require manual self-review. Real-device background throttling,
screen-reader acceptance, complete keyboard audit, and broad device coverage
are deferred to Phase 10 / owner phone check. Phase 2 source-verification
items remain tracked under the content gate; MIT license covers authored code
while third-party exam-source rights remain separate. No PR, merge or deployment
was performed for this work.

## Owner sign-off and recorded caveats — 2026-11-17

Owner approved closing Phase 3 (`🚧` → `✅*`) after PR #11 merged to `main` as
`9d47c7c76b2384c72944a0880df058a2518394ec`, with these explicit open caveats:

1. **No standalone CST207 (CSO) quiz bank:** CSO practice and timed mocks use
   its 6 frozen PYQ papers (195 archived questions) until a verified quiz bank
   is authored under the content gate.
2. **Unkeyed items and subjective marks stay ungraded:** 456 of 872 quiz-bank
   items are non-MCQ without automatic keys; subjective paper sections and
   1-mark written MCQ explanations on the 15 `2024–2026` papers require manual
   self-review (no fabricated overall paper grade).
3. **Source-verification ledger stays separate:** 9 fingerprinted data findings
   (`docs/data/validation-exceptions.json`) and 3 grouped syllabus findings
   remain tracked under the Phase 2 / Phase 8.6 content-verification gate.
4. **Cross-device / hardware acceptance deferred to Phase 10:** physical phone
   background throttling, screen-lock timers, screen-reader testing and browser
   matrix belong to `10-device-acceptance`.

### Storage integration follow-up

The later Phase 6 boundary now namespaces the compatibility keys under `d3s:`;
legacy save snapshots remain logically retained until attempt migration and
completion/discard, even after verified namespace-copy migration. Focused quiz,
Practice and warmed-paper offline regressions pass against the real boundary.
Setup now consumes a generated 872-question pool and a checked-in concatenated
script; snapshot/preview/filter behavior is unchanged and regression-tested.
