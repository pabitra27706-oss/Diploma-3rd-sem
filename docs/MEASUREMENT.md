# Measurement without surveillance

> **Phase 9.4 status (2026-11-18): closed without a counter by owner choice.**
> The owner selected no measurement; no counter, network request, or storage is
> authorized. The disclosure scope was approved only in case measurement is
> reconsidered later; that does not authorize implementation. Existing runtime
> remains first-party and local-only. `assets/js/accessibility.js` (bundled into
> `shell.bundle.js`) makes no analytics `fetch`, `sendBeacon`, or image ping.

Runtime remains first-party and local-only: no third-party analytics, tracking
pixels or usage upload. Local goal/card counts and quiz histories describe only
this browser profile and retained history. They cannot establish learning gains,
unique users, retention or device distribution. Do not publish invented usage.

Knowable: reproducible local performance measurements, automated checks,
repository activity available to its owner, voluntarily supplied feedback and
observed device tests. Repository traffic is not equivalent to student usage.
No runtime analytics decision is inferred from broad coding permission.

The optional, non-modal usefulness prompt is shown on Today or quiz results
at most once per browser-tab session. A sessionStorage marker stays in the
storage boundary; if session storage is unavailable the prompt is skipped.
Yes / Not yet counts are local `d3s:feedback-usefulness` preferences; Dismiss
stores no rating. No counts are transmitted. Reset preferences clears counts;
reset everything also clears session markers.

Copy feedback templates include only the current origin/path and build version,
not local names, answers, notes or query strings. Clipboard denial leaves manual
copy text. Feedback prepares a mailto draft or copied text; the site cannot
confirm an email was sent, received, or reviewed. The user must send it using
an external email app. No server endpoint or automatic transmission was added.

## What this repository can and cannot tell the owner (2026-11-17)

**Can be measured, and is:** request counts and bytes per page from disk
(`scripts/audit_page_weight.py`), colour-token coverage (`check_tokens.py`),
contrast from the shipped tokens, linked-path validity, worker precache and update
behaviour (deterministic Node stubs), and the data version a browser would fetch.

**Cannot be measured here, and is not claimed:** Lighthouse/Core Web Vitals
scores, real-device timings, install rates, retention, number of students, which
questions are actually difficult, whether anyone found the site useful. There is
no browser in the build environment and no analytics by design.

The owner closed Phase 9.4 without a counter on 2026-11-18. If measurement is
reconsidered, obtain new explicit authorization and re-evaluate endpoint,
retention, request-log, and privacy requirements first. These constraints remain
binding for any future implementation:

- one same-origin request, non-blocking, inside the existing page budget, and
  never a precache entry (offline must not depend on it);
- pathname plus a coarse bucket at most — **never** query strings, names, notes,
  answers, bookmarks or search text, and no persistent identifier;
- no third-party script, no cookie for tracking, no resale, no coupling to ads or
  affiliate links (the money model stays "none");
- the local usefulness prompt is not replaced by the counter;
- counts are reported as what they are (sessions/views), never as learning gains,
  retention or "students helped". Repository traffic is still not student usage.

Phase 9.4 is **closed without implementation**. A later change requires a new
owner decision; a working build is not authorization to deploy or change hosting.
