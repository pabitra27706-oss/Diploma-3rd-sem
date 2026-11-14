# Phase 3 — Tasks

One attempt = one object with one schema version. Every part reads and writes
that object through one module — never through ad-hoc `localStorage` calls.

## 3.1 — Attempt state machine

**Goal:** nothing is lost, nothing is invented.

**Steps**
1. Define the attempt schema:
   `{schemaVersion, id, config{subject, units, count, marks, difficulty, source, mode}, startedAt, endsAt, remainingMs, questionIds[], answers{id: value}, flags{id: marked}, currentIndex, status}`.
2. Autosave every N seconds **and** on visibility change / pagehide; persist
   `remainingMs`, not just `startedAt`.
3. Resume: restore `remainingMs`, current index, answers, flags, and the
   subject label from `config.subject`.
4. Treat `""`, `null`, and missing as **unanswered** everywhere (count, score,
   review).
5. If a subject's bank fails to load, stop with an explicit error state and a
   retry, never an empty quiz.
6. Migrate existing saved attempts into the new schema on first read; keep the
   old keys until the migration is verified.

**Acceptance:** reload-resume test at 30 s, 5 min, and after backgrounding;
answered counts exclude empty strings; a forced fetch failure shows the error
state; old saves still open.

## 3.2 — Setup and filters

**Steps**
1. Derive every option from the data: marks actually present (including 3/5/7),
   years with questions, sources including `EXTRA`.
2. Show a live preview: "42 questions · 120 marks · ~45 min" before starting,
   computed from the selection.
3. Gate CST207 (or any subject with no bank) with a disabled state and a
   one-line reason.
4. Persist the chosen configuration so a retry can reuse it exactly.

**Acceptance:** no offered option yields zero questions (verified by a script
that enumerates options and counts matches); the preview matches the started
quiz.

## 3.3 — Mock paper mode

**Goal:** attempt one real paper, as it is set, without implying unverified marks.

**Steps**
1. Entry: PYQ viewer → "Attempt this paper"; quiz setup → "Full paper".
2. Build the attempt from that paper's records: groups, marks per question,
   duration from the registry (`2.5 Hours` / `3 Hours`).
3. Build answer-any limits from structured `paperFormat` groups/sections and
   source-numbered alternatives. Let the student record which responses count;
   enforce each quota without grading answers or changing paper files. If source
   metadata cannot be reconciled, disclose that and do not guess.
4. Where both printed instruction and structured group identify a timed first
   section, enforce its deadline, prevent opening later sections early, lock it
   after collection, and preserve deadline/lock on resume. Never infer limits
   from marks or total exam duration.
5. Full-paper timer comes from registry duration, with 10-minute and 1-minute
   warnings and auto-submit at zero.
6. Keep supplied answer explanations and paper totals visible, but do not
   calculate official per-question/overall paper marks until allocation and
   syllabus-total sources are reconciled. Display the mismatch banner where
   applicable; review includes answer, model answer, marks and source page.

**Acceptance:** all registered papers have reconciled, non-overlapping answer
choice pools; over-quota selections are blocked; supported timed-section rules
survive reload and cannot be reopened after collection; a paper attempt works
offline after cache warm-up. Official marks remain explicitly ungraded pending
source reconciliation.

## 3.4 — History, export, retry, review

**Steps**
1. History rows show the real outcome: `scored`, `not scored`, `abandoned`;
   never render `null` as 0 or "poor".
2. All-types history computes per-type correctly: MCQ wrong ≠ MCQ unanswered.
3. Export takes an explicit `historyId` and loads that record (not
   `quiz-result`); the exported file names the attempt.
4. Retry rebuilds **from stored question ids**, preserving order and flags;
   "fresh" and "reshuffled" become different and explained, or one is removed.
5. Review edits update the linked history entry (or are explicitly "notes only"
   — pick one and say so).

**Acceptance:** export from a 3-item history list produces three different
correct files; retry reproduces the same questions; an edited review updates the
row or clearly does not.

## 3.5 — Mistake queue

**Steps**
1. On submit, store wrong and skipped items with `{subject, unit, topic,
   difficulty, marks, questionId, firstSeen, attempts}`.
2. Add "Practice my mistakes" to the practice/quiz entry points; it builds a set
   from the queue, newest first, capped.
3. Resolve an item on a later correct answer; keep a count of resolutions.
4. Provide "clear queue" with a confirm, and include it in the reset list.

**Acceptance:** a wrong answer appears in the queue within one submit; a later
correct answer resolves it; the queue survives reload; clearing works.

## 3.6 — Honest labels

**Steps**
1. Replace "AI Eval" with what the control does ("Export for review").
2. Explain each export format in one sentence.
3. Remove or label any control that does nothing yet.

**Acceptance:** grep for "AI" in quiz pages returns only text that describes an
actual behaviour; no control is a no-op.

## Phase checks

```sh
python3 scripts/check_site.py --strict
python3 scripts/validate_data.py --strict
# manual script (recorded in record.md):
#  1. start timed quiz → reload → remaining time within interval
#  2. force a fetch failure → explicit error state
#  3. export 3 history rows → 3 different files
#  4. attempt one paper → marks total matches
```

**Not verifiable here:** real-device timer accuracy, background-tab throttling,
and screen-reader behaviour of the timer. Note them for the phone pass.
