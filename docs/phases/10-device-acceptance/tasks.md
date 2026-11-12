# Phase 10 — Dedicated device acceptance tasks

Status: planned, **not started**. Run after implementation phases 1–9.
Use `matrix.md`; no pre-filled row is a pass.

## 10.1 — Inventory and core journeys

Record actual device/OS/browser/version, viewport, hardware vs emulation,
checkout/build, date, network and storage mode. Cover Android, iOS, tablet and
desktop where available. Test navigation, search/deep links, Practice, quiz,
cards/Today and settings. Unavailable hardware remains explicitly untested.

## 10.2 — Reading, input and accessibility

Exercise touch targets, rotation, 130% reading size + 200% browser zoom,
reflow, keyboard-only flows, dialogs/focus return, reduced motion, theme/system
changes, high contrast and Bengali labels. Record actual TalkBack/VoiceOver/
NVDA observations where access exists; emulation is not screen-reader evidence.

## 10.3 — Attempts, storage and portability

Test reload, long backgrounding, screen lock, expiry, flags and exact retries.
Verify notes, quota/failure messages, concurrent tabs, import recovery, actual
backup download/copy/restore and reset isolation. Include IndexedDB/fallback
journeys only after their implementation; do not infer them from current tests.

## 10.4 — Offline, install, updates and print

Separate online first load, warmed offline load and uncached offline fallback.
Test browser install, standalone launch, waiting update/user confirmation and
cache recovery without lost student records. Print one unit, one paper and any
approved reference sheet to PDF; record page counts/legibility/answer breaks.

## 10.5 — Defect closure and report

Every failure gets reproduction steps, impact, issue/reference, fix and a
specific retest result. Publish tested/failed/untested coverage and remaining
limits. Run implementation regression checks after fixes. Do not claim all-device
compatibility, pedagogical verification or deployment authorization from this
phase. Stop at the separate release gate.
