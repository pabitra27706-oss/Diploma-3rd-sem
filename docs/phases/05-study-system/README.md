# Phase 5 — Study system

**Status:** ✅* implemented, gate-verified and owner-verified (device/Termux pass
2026-11-17) with the caveats in [`record.md`](record.md) · **Parts:** 5 ·
**Depends on:** 2 (keys), 3 (mistakes), 6 (storage) · **Owner gates:** content
verification for card backs

## Goal

Turn stored answers into a study loop: cards built from content you already
have, a scheduler that decides what is due today, an honest view of weak units,
and a one-screen "what should I do now".

## Why now — the measured evidence

- The site records results but never re-uses them: wrong answers are discarded
  after the result screen, and no queue exists.
- 992 PYQs have answers; 416 quiz MCQs have explanations — enough to build
  cards without writing content, **once Phase 2.5 closes the 456 gaps**.
- Topics are the join key for weak-area analytics, and 321 records still carry
  placeholder topics (Phase 2.3 fixes that).
- Research on spacing and retrieval practice supports scheduled recall, with
  modest effects and a clear caveat: multiple-choice retrieval **without
  feedback** shows weak effects in classroom STEM studies — so every card must
  reveal the answer, never just record a click.
- FSRS is an MIT-licensed open algorithm suitable for clean re-implementation;
  a Leitner-style schedule is the fallback if FSRS proves too heavy for a
  phone-only workflow.

## Scope

- **In:** card generation, scheduler, review UI, due queue, weak-area analytics,
  daily goal, question of the day, "Today" screen.
- **Out:** new question content, handwriting/OCR, social features, notifications
  that need a server.

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 5.1 | Card generation | Cards come from existing verified content only |
| 5.2 | Scheduler | Tomorrow's queue is decided tonight, offline |
| 5.3 | Review UI | Answer first, reveal after, rate honestly |
| 5.4 | Weak areas | Percentages are computed from real attempts and say their sample size |
| 5.5 | Daily goal and "Today" | One screen answers "what now" |

Details: [`tasks.md`](tasks.md).

## Design constraints

- Everything is local: no accounts, no sync, no telemetry.
- A card always has a visible source (`paperCode`, `sourceNumber`, unit) — an
  unsourced card is a defect.
- Any card whose answer is unverified is not generated; the count of skipped
  items is shown, not hidden.
- Scheduling state belongs to the Phase 6 storage module (one schema version).

## Current state — 2026-11-17

All five parts are implemented on `arena/4d3997da-diploma-3rd-sem`; `record.md`
holds the pre-edit gap audit, the changes and the measured evidence.

| Part | Implemented evidence |
|---|---|
| 5.1 | 1,339 deterministic cards (923 PYQ model answers + 416 keyed quiz explanations) with a reason for every one of the 457 skips, per subject **and per unit**, CST207-PYQ-only disclosure, display-safe `citationLabel` + raw `citation`, minified 1.07 MB payload, precached shell + `WARM_STUDY` shard warmer |
| 5.2 | Documented Leitner ladder, `firstDay`-based per-day new-card cap, due-first ordering, local-midnight rollover, backwards/forwards clock clamps, duplicate-rating idempotence, reload survival, one schema version, non-destructive corrupt-state error |
| 5.3 | Answer-first → reveal → rate, four interval-named buttons, Space/1–4/Esc, focus + `aria-live`, subject **and unit** filters with URL + `popstate`, empty queue with mistake/weak-unit/practice/Today fallbacks, zero raw codes or question ids |
| 5.4 | `correct / attempted` + skipped + contributing attempts, percentage only at ≥ 5 observations with an explicit below-threshold statement, collapsed generic topics, both-window trend minimum, direct practice/card links |
| 5.5 | Due cards, mistake queue, sample-qualified weakest area, configurable goal and cap, one primary action with a reason, goal meter with text equivalent, honest resettable local streak, deterministic question of the day, `subjectLabel()` throughout, one-tap home entry |

Still open elsewhere: answer certification (owner/source gate), 456 keyless quiz
items, no CST207 quiz bank, and the whole Phase 10 device matrix.

## Done means

- `python3 scripts/build_cards.py` produces a deterministic card set and a
  report: cards created, items skipped for missing keys, per subject/unit.
- A review session shows one card at a time, reveals the answer, records a
  rating, and updates the next due date; the schedule survives reload.
- The due queue is capped and ordered; an empty queue says so and offers a
  fallback (mistakes, weak unit, random paper).
- Weak areas show `correct / attempted` and the attempt count, and hide
  percentages below a stated minimum (e.g. 5 attempts).
- "Today" screen composes: due cards, mistakes, weakest unit, daily goal.
- The streak is local, resettable, and never claims more than days opened.

## Risks

- A scheduler that is wrong is worse than none: keep the algorithm small,
  document the formula, and unit-test the interval progression with fixed
  inputs.
- Card generation can balloon storage; cap per subject and store ids, not copies
  of the text.
- Weak-area views invite over-confidence: always show the denominator.
