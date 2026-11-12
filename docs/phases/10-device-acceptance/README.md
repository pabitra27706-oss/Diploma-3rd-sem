# Phase 10 — Dedicated cross-device acceptance

**Status:** planned, not started · **Parts:** 5 · **Depends on:** implementation phases 1–9

Owner-directed sequencing: finish implementation work first, then run the full
cross-device acceptance sweep here. Focused automated regression checks continue
throughout engineering; deferred real-device checks must not be marked passed.

## Acceptance scope

- Android (including Termux-served site), iOS, tablet and desktop: record actual
  device, OS, browser, viewport and date; distinguish emulation from hardware.
- Responsive navigation, touch targets, keyboard and screen-reader flows,
  zoom/reflow and contrast across core study, quiz, notes and discovery journeys.
- Timed attempts through reload, screen lock, background throttling and expiry;
  history, exports, mistakes, notes, backup/restore and storage-error recovery.
- Offline cold/warm behavior, install/update, stale-cache recovery and real
  `/Diploma-3rd-sem/` base-path navigation.
- Record reproducible failures, fix them, rerun affected tests and retain evidence.
  Device access not available is explicitly untested, never silently passed.

## Exit gate

Publish a tested/failed/untested matrix and remaining limitations. No claim of
all-device compatibility from headless Chromium alone. Source-verification,
license and deployment gates remain separate; this phase grants no deployment
permission and never changes authoritative PYQs.

## Execution documents

- [Tasks](tasks.md) — five acceptance areas and exit requirements.
- [Device matrix](matrix.md) — unexecuted evidence template; all rows untested.
