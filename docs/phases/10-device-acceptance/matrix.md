# Device acceptance matrix — owner-reported evidence

Status: **partial**. The owner reported a detailed real-Android-phone run on
2026-11-18. It covers several Phase 9.6/Phase 10 journeys, but does not close
Phase 10: browser versions are missing and other acceptance areas remain
untested. The earlier 2026-11-17 smoke report is retained below.
Record only observed results; do not collapse hardware and emulation into one
result.

| Environment | Device / OS / browser version | Hardware or emulation | Core journeys | Reading / accessibility | Background timer | Backup / recovery | Offline / install / update | Print | Evidence / date |
|---|---|---|---|---|---|---|---|---|---|
| Samsung Galaxy A35 | Android 16; Brave Browser and Via Browser (versions not supplied) | Hardware | **Pass (reported):** nested pages/back navigation; Practice filters/session/answer reveal/question navigation | **Partial:** portrait/landscape layout observed; font scaling, screen reader and keyboard access untested | **Partial pass:** active session state reportedly recovered after switching away to another app and returning; timer expiry/screen-lock behavior not tested | **Partial pass:** notes persisted after reload/language toggle; backup/restore and storage-error recovery untested | **Partial pass (reported):** previously visited pages available offline; unvisited page showed offline fallback; home-screen install/shortcut reported passing; update behavior untested | **Pass (reported):** PYQ page produced readable one-page Save as PDF preview | Updated owner report, 2026-11-18 08:40–08:54 IST; Wi-Fi; deployed URL; Lighthouse not run; no screenshot/log; browser versions missing |
| iPhone / iOS | Not recorded | Not recorded | Untested | Untested | Untested | Untested | Untested | Untested | None |
| Tablet | Not recorded | Not recorded | Untested | Untested | Untested | Untested | Untested | Untested | None |
| Desktop browser | Not recorded | Not recorded | Untested | Untested | Untested | Untested | Untested | Untested | None |

## Per-run evidence

### Run 2 — updated owner report, 2026-11-18 08:40–08:54 IST

- Build/commit and dirty-tree status: tested deployed URL; exact served commit not
  independently verified. No local branch build was deployed.
- URL: `https://pabitra27706-oss.github.io/Diploma-3rd-sem/`.
- Device: Samsung Galaxy A35, Android 16. Browsers: Brave Browser and Via Browser;
  versions not supplied. Wi-Fi; portrait and landscape tested.
- **Passed as reported:** nested pages/back navigation; practice flow; theme
  persistence after reload; landscape layout; previously visited pages available
  offline; home-screen shortcut creation; readable Save as PDF preview; notes
  persisted across reload and language toggle; active session state recovered
  after switching to another app and returning.
- Offline scope: previously visited pages worked; an unvisited page displayed the
  offline fallback. This does not establish cold-cache offline use.
- **Not tested/reported:** Lighthouse/Core Web Vitals, desktop, exact browser
  versions, font scaling/200% zoom, screen reader, keyboard-only access, timer
  expiry/screen-lock behavior, backup/restore, storage-error recovery, and
  install/update behavior after an app update.
- Issues: none reported. Screenshots/log/PDF: none supplied.
- Scope: useful real-device evidence for the reported journeys; not a complete
  device-acceptance sweep or a claim of broad Android/browser compatibility.

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
  Accepted by the owner as sufficient for Phase 7 on 2026-11-17; **not**
  sufficient for this phase's exit gate, which needs the matrix filled in.
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
