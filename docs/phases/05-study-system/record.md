# Phase 5 — Engineering record

Status: **implemented and gate-verified on `arena/4d3997da-diploma-3rd-sem`
(2026-11-17); `🚧` pending owner Termux/browser verification.** Nothing here is
a new answer certification, and no recall-improvement claim is made.

Reuse: ADAPT source model answers/keyed MCQ explanations and Phase 3
history/mistakes; BUILD a small fixed-interval scheduler and Today/review UI. No
FSRS dependency or invented verification.

## Checkpoint 1 — 2026-11-09 (initial implementation)

`build_cards.py` created 1,339 source-linked cards, skipped 456 ineligible items,
and excluded exact PYQ aliases. Original back text unchanged. Model answers were
labelled not independently certified; keyed quiz explanations kept their source
mapping caveat. See the generated `docs/data/cards.md`.

Fixed Leitner intervals 1/3/7/16/35 days, new/learning/review states, four
ratings, versioned namespaced progress through the storage boundary, stable event
IDs, backward-clock clamp, configurable new-card cap (20 default) plus due cards.
Front/reveal/rating screen supported Space/1–4/Esc and moved focus. Ratings saved
before advancing. No claim of improved recall.

Today was one tap from home: local daily goal, card and answered-question counts,
due/new review entry, mistake count, deterministic local-date source question,
another-question action, activity streak and reset-start control. Weak-area rows
showed keyed-MCQ denominators/skips; no percentage below five observations.

Pending at that checkpoint: a separate card-level report of source eligibility,
broader edge-case clock/cap coverage, URL/popstate filtering, and a real
empty-queue fallback set.

## Checkpoint 2 — 2026-11-09 (trends and offline keyboard session)

Implemented last-seven-local-days vs previous-seven trends. Both windows needed
at least five keyed-MCQ observations before a percentage-point delta appeared;
raw correct/attempted denominators stayed visible. Future/abandoned attempts were
excluded from windows and whitespace-only answers counted as skipped. Local
calendar boundaries used `setDate` rather than assuming every day is 24 hours.
Deterministic tests covered thresholds, window boundaries and exclusions.

Weak-area actions checked source-eligible cards before offering review/quiz
links; archived-only units fell back to tagged archive search instead of a
known-empty quiz. `tests/cards-offline.cjs` completed 20 cards with Space/3 in a
warmed offline browser, reloaded without losing progress, and verified Today
counts offline. That focused regression is not a physical-device acceptance pass.

## Checkpoint 3 — 2026-11-17 (gap audit and close-out)

Audit first: the five parts existed, but each had a concrete, recorded gap. These
sentences are the pre-edit audit result and are kept verbatim so the change is
reviewable.

- **5.1** — the report proved only subject totals: skip counts merged every
  reason, there was no per-unit table, CST207's PYQ-only nature and the 456
  unkeyed quiz items were invisible, and the card citation printed raw archive
  filenames/ids.
- **5.2** — the scheduler was deterministic but undocumented beyond one comment
  line; the new-card cap was inferred from lifetime `reps`, so yesterday's
  introductions could eat today's allowance; day rollover, forward clock jump and
  duplicate-rating behaviour had no deterministic tests.
- **5.3** — the review screen handled Space/1–4/Esc and reload, but the unit
  filter was URL-only (no control and no `popstate` restore), the empty queue
  offered no action at all, and the visible citation printed raw course codes and
  question ids.
- **5.4** — denominators and the five-observation threshold were correct, but a
  row never said how many attempts contributed, and below-threshold rows could be
  misread as "weak areas" without an explicit sample disclosure.
- **5.5** — Today showed the pieces, but had no single primary "what now" action,
  no text equivalent for the goal meter, saved settings by reloading the page, and
  no explicit statement that a streak counts only recorded local days.

### What changed

- **5.1 Card generation (`scripts/build_cards.py`, `assets/cards/*`,
  `docs/data/cards.md`).** Eligibility is now a single `collect()` step with a
  reason for every skip (`alias`, `pyq-missing-answer`, `quiz-not-mcq`,
  `quiz-no-explanation`, `quiz-no-key`). Verified outcome on the frozen archive:
  **1,339 cards = 923 previous-year model answers + 416 keyed quiz
  explanations**, 457 skipped (1 exact alias, 456 quiz items with no stored key).
  CST207 is explicitly PYQ-only (195 cards, 0 quiz) and that fact is in the
  report, the manifest notes and a Python test. Every card carries `citation`
  (raw provenance, for audit) and `citationLabel` (display-safe: short subject
  name + session/panel + printed question number). `verification` is a short code
  (`model-answer-not-certified` / `keyed-explanation-unverified-mapping`) whose
  honest sentence lives once in `manifest.verificationNotes`; the UI renders it
  next to every answer. The manifest gained `totals`, `skippedReasons`,
  per-subject `sources`/`units`/`skippedReasons`, and the report gained per-subject,
  per-skip-reason and per-unit tables. Payload stays minified and id-ordered:
  **1.07 MB** for 1,339 cards (a 9% increase for the added provenance), under the
  1.2 MB ceiling asserted in `tests/test_cards.py`. Offline coverage moved into
  the worker: `cards.html`, `today.html`, the study scripts, the attempt store and
  `assets/cards/manifest.json` are precached, and `WARM_STUDY` stores all five
  subject shards under the versioned key.
- **5.2 Scheduler (`assets/js/study-store.js`).** The formula, the four ratings,
  the 1/3/7/16/35 ladder, the day-boundary rule, the two clock clamps and the
  idempotence rule are documented in the file header. Card state gained
  `firstDay`, so the daily new-card allowance counts cards *introduced today*
  instead of lifetime `reps` (yesterday's introductions can no longer consume
  today's cap). `plan()` returns due/fresh counts plus `introducedToday`, and
  `queue()` is due-first ordered by `due` then id. New testable helpers:
  `streak()`, `activityDays()`, `goalProgress()`, `resetStreak()`,
  `questionOfDay()`. A foreign `schemaVersion` or unreadable JSON throws a
  non-destructive error; nothing is migrated or deleted.
- **5.3 Review UI (`cards.html`, `assets/js/study-ui.js`).** Added a unit
  `<select>` alongside the subject filter, URL sync through `pushState` and
  `popstate` restore (`?subject=&unit=`), `1 / N` progress, answer-first →
  reveal → rate, four real buttons that name the next interval (`1 · again · 1
  day`), focus moved to the first rating, an `aria-live` status, Space/1–4/Esc,
  and a clean empty state that explains the allowance and offers the mistake
  queue, the weakest recorded unit (with its denominator), the practice set,
  Today, and a "clear the filter" action. All rendering is `textContent`; the
  citation shows the honest verification sentence plus `citationLabel` and one
  link ("Open this paper and question" / "Practise this unit again").
- **5.4 Weak areas (`today.html`).** Each row now shows `correct / attempted`,
  skipped count, contributing `attempts`, and the percentage only when
  `attempted >= 5`; the summary states how many areas qualify and how many do
  not. Generic placeholder topics collapse into one "Topic not recorded (generic
  placeholder collapsed)" row. Trends keep the both-windows minimum. Rows link
  directly to a keyed practice set (or archive search when the unit has no keyed
  quiz card) and to the filtered card session.
- **5.5 Daily goal and Today (`today.html`, `index.html`).** One primary action
  with a reason line (due cards → new cards → mistakes → weakest area →
  practice), a `<progress>` meter with a text equivalent, visible goal/cap help
  text, settings saved in place (no page reload) with range validation, a streak
  that states it counts only recorded local days and names its reset start date,
  and a deterministic question of the day with citation + "another question".
  Everything uses `subjectLabel()`; the home header keeps the one-tap Today link.

### Evidence — 2026-11-17 (this branch, this tree)

- `python3 scripts/validate_pyq.py`: PASS — 28 papers / 924 questions, 0 errors.
- `python3 scripts/check_pyq_integrity.py`: 0 changed/added/missing files.
- `python3 scripts/validate_data.py --check-baseline`: matches the 9-finding
  ledger (not a full strict pass; the source-review gate is unchanged).
- `python3 scripts/check_platform.py`: 0 errors (precache files exist, presence
  generator idempotent).
- `python3 scripts/check_site.py --strict`: **0 errors / 28 warnings**, byte-for-byte
  the same warning list as the pre-edit baseline.
- `python3 -m unittest discover -s tests`: **22 PASS**, including the new
  `test_cards.py` (source-verbatim copies, citation hygiene, skip accounting,
  per-unit counts, byte-identical regeneration, compact payload).
- Nine deterministic Node suites PASS: `attempt-store`, `quiz-engine-dom`,
  `storage`, `storage-recovery`, **`study-store`** (ladder, clamps, rollover,
  per-day cap, reload, streak/goal/question helpers, attempt counts),
  `data-pipeline-consumers`, `discovery-dom`, **`study-dom`** (cards.html +
  today.html UI/DOM/keyboard/popstate/empty states/no raw identifiers) and
  **`study-offline`** (study shell precache, `WARM_STUDY` shards, offline
  navigation and data lookup).
- Full parse sweep: **55 JS/CJS files** and all **79 JSON files** parse.
- Browser suites (`tests/cards-offline.cjs`, `tests/discovery-study-browser.cjs`)
  were updated to the new markup and assertions but were **not run here** (no
  Chromium in this environment); they run in the owner's local/CI browser step.

### What is still not proven

- No physical-device, screen-reader, iOS/Android or zoom/reflow acceptance — that
  is Phase 10, and this record does not imply it.
- No claim that reviewing cards improves recall or exam marks.
- No claim that any card answer/key is certified: the stored model answers and
  keyed explanations keep their existing caveats (9 data + 3 syllabus
  source-review findings, 456 keyless quiz items, CST207 without a quiz bank).
- Offline coverage is "cached after a prior visit/warm", not a guarantee of
  first-visit offline or of storage survival under browser eviction.
- Hosted CI on this tree is claimed only once the run is recorded in chat.
