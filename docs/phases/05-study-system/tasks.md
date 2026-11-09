# Phase 5 — Tasks

Everything here is local-first and additive: no existing page may lose a
feature, and no card may exist without a source.

## 5.1 — Card generation

**Steps**
1. `scripts/build_cards.py` reads PYQs (`answerStatus: model-answer`) and quiz
   MCQs (with `explanation`) and emits `assets/cards/<subject>.json` plus a
   report.
2. Card shape:
   `{id, sourceType, sourceId, subject, unit, topic, front, back, marks, paper, tags, difficulty}`.
3. Front: the question stem, trimmed; Back: the model answer/explanation plus
   the source citation. Never rewrite the answer text.
4. Skip items with `answerStatus: missing`; count them per subject in the
   report.
5. Deterministic ordering; regenerate idempotently.

**Acceptance:** report lists created/skipped per subject; every card's
`sourceId` resolves; two runs produce identical bytes.

## 5.2 — Scheduler

**Steps**
1. Implement a small scheduler with documented states:
   `new → learning → review`; ratings `again / hard / good / easy`.
2. Use FSRS-style stability/difficulty if it stays under ~150 lines and is
   unit-tested; otherwise use fixed Leitner intervals (1, 3, 7, 16, 35 days) and
   say so. Record the choice and the reason.
3. Store per-card `{state, due, interval, easeOrStability, reps, lapses,
   lastRating}` in the Phase 6 storage module, namespaced and versioned.
4. Cap the daily queue (default 20 new + all due) and make the cap configurable.

**Acceptance:** unit tests with fixed dates produce expected due dates for each
rating; changing the device clock forward does not corrupt state (clamp);
re-running a review is idempotent per card.

## 5.3 — Review UI

**Steps**
1. Session screen: progress "7 / 20", front, "Show answer", then four rating
   buttons with the next interval shown on each ("Good · 4 days").
2. Keyboard: Space reveals, 1–4 rate, Esc exits with progress saved.
3. Accessibility: real buttons, focus moved after reveal, no colour-only
   ratings; `aria-live` announces the next interval.
4. Offline: works entirely from cached cards.

**Acceptance:** a 20-card session completes offline; progress persists on exit;
keyboard-only completion possible; screen-reader labels name the interval.

## 5.4 — Weak areas

**Steps**
1. Aggregate attempts by subject/unit/topic: `attempted`, `correct`, `skipped`,
   `lastSeen`.
2. Rank by accuracy with a minimum sample (default 5); show the denominator and
   a "not enough data" state.
3. Link each weak area to a filtered practice/quiz set and to its cards.
4. Show trend (last 7 days vs previous) only when both windows have data.

**Acceptance:** numbers match history exports; no percentage shown below the
sample threshold; each row's action produces a non-empty set.

## 5.5 — Daily goal and "Today"

**Steps**
1. Daily goal: cards reviewed + questions answered against a local target;
   progress ring with a text equivalent.
2. Question of the day: deterministic pick from the date + seed, with "another"
   and a link to its paper.
3. "Today" screen: due cards, mistakes from 3.5, weakest unit, goal, and one
   primary action.
4. Streak: consecutive local days with any activity; resettable; no guilt copy.

**Acceptance:** the screen is reachable from home in one tap; each module has an
empty state; the date rollover uses local time consistently (see 6.2).

## Phase checks

```sh
python3 scripts/build_cards.py --report docs/data/cards.md
python3 scripts/validate_data.py --strict
python3 scripts/check_site.py --strict
```

**Not verifiable here:** recall improvement (do not claim it), real-device
timing, and notification behaviour (out of scope).
