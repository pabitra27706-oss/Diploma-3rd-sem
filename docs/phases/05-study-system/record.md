# Phase 5 — Engineering record

Status: in progress; 2026-11-09. Reuse: ADAPT source model answers/keyed MCQ
explanations and Phase 3 history/mistakes; BUILD a small fixed-interval scheduler
and Today/review UI. No FSRS dependency or invented verification.

`build_cards.py` creates 1,339 source-linked cards, skips 456 ineligible items,
and excludes exact PYQ aliases. Original back text is unchanged. Model answers
are labelled not independently certified; keyed quiz explanations retain source
mapping caveats. See generated `docs/data/cards.md`.

Fixed Leitner intervals 1/3/7/16/35 days, new/learning/review states, four ratings,
versioned namespaced progress through the storage boundary, stable event IDs,
backward-clock clamp, configurable new-card cap (20 default) plus due cards.
Front/reveal/rating screen supports Space/1–4/Esc and moves focus. Ratings save
before advancing; failure stays visible. No claim of improved recall.

Today is one tap from home: local daily goal, card and answered-question counts,
due/new review entry, mistake count, deterministic local-date source question,
another-question action, activity streak and reset-start control. Weak-area
rows show keyed-MCQ denominators/skips; no percentage below five observations.

Evidence: deterministic scheduler VM tests PASS (ratings/dates/idempotence,
clock/cap/weak denominators); browser reveal/rate/reload + Today counts PASS;
Python tests resolve every source ID and compare exact back text/idempotence.

Pending: separate card-level report of source eligibility and broader edge-case
clock/cap coverage.
Real-device and screen-reader acceptance moves to Phase 10; not marked complete.


## Follow-up — trends and offline keyboard session

Implemented last-seven-local-days vs previous-seven trends. Both windows need
at least five keyed-MCQ observations before a percentage-point delta appears;
raw correct/attempted denominators remain visible. Future/abandoned attempts
are excluded from windows and whitespace-only answers count as skipped. Local
calendar boundaries use setDate rather than assuming every day is 24 hours.
Deterministic tests cover thresholds, window boundaries and exclusions.

Weak-area actions now check source-eligible cards before offering review/quiz
links; archived-only units fall back to tagged archive search instead of a
known-empty quiz. `tests/cards-offline.cjs` completes 20 cards with Space/3 in
a warmed offline browser, reloads without losing progress, and verifies Today
counts offline. This focused regression is not a physical-device acceptance pass.
