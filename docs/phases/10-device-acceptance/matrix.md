# Device acceptance matrix — unexecuted template

Status: **not started** as a full acceptance sweep. One owner **smoke pass** on
an Android phone in Chrome is recorded below (2026-11-17) — a click-through with
nothing reported as failing, not a per-criterion pass. Every cell it did not
measure stays `Untested`.
Replace each placeholder only with an observed result. Add rows for actual
browser versions; do not collapse hardware and emulation into one result.

| Environment | Device / OS / browser version | Hardware or emulation | Core journeys | Reading / accessibility | Background timer | Backup / recovery | Offline / install / update | Print | Evidence / date |
|---|---|---|---|---|---|---|---|---|---|
| Android phone | Not recorded (owner-reported; model/OS/browser version not supplied) | Hardware | **Partial — smoke pass, no failures reported** | Untested | Untested | Untested | Untested | Untested | Owner report only, 2026-11-17; no screenshot/log |
| iPhone / iOS | Not recorded | Not recorded | Untested | Untested | Untested | Untested | Untested | Untested | None |
| Tablet | Not recorded | Not recorded | Untested | Untested | Untested | Untested | Untested | Untested | None |
| Desktop browser | Not recorded | Not recorded | Untested | Untested | Untested | Untested | Untested | Untested | None |

## Per-run evidence

### Run 1 — 2026-11-17, owner smoke pass

- Build/commit and dirty-tree status: `arena/c56bb630-diploma-3rd-sem`, tip
  `43cd4ac` at the time of the report (hosted Web CI `44038930330` green); the
  owner served a local checkout, so a dirty tree cannot be excluded.
- Test URL and base path: not recorded by the owner (Termux-served local checkout).
- Actual device, browser and version: Android phone, Chrome — model, OS version
  and Chrome version **not supplied**.
- Date, viewport, network and storage mode: 2026-11-17; viewport/network/storage
  mode not recorded.
- Journey and expected behavior: general click-through of the app (the owner's
  description: "all devices test passed", clarified as a single-device smoke pass).
- Observed result: **partial — no failures reported**; not a per-criterion pass.
- Screenshot/log/PDF reference: none.
- Defect, fix reference and retest: none reported.

### Evidence fields for the next run

- Build/commit and dirty-tree status:
- Test URL and base path:
- Actual device, browser and version:
- Date, viewport, network and storage mode:
- Journey and expected behavior:
- Observed result (pass / fail / untested):
- Screenshot/log/PDF reference:
- Defect, fix reference and retest:

Existing focused Chromium engineering regressions are documented in
[tests](../../../tests/README.md). They do not populate this final hardware matrix.
