# Measurement without surveillance

> **Phase 9.4 status (2026-11-17): the owner opened a first-party counter GATE.**
> That is a decision to *want* aggregate counts later, not an approval to add one
> today — nothing was built, and the site still sends no analytics, tracker or
> third-party script. The gate's four open questions (which number, where it is
> stored, retention, disclosure text) are in `docs/DECISIONS.md` under
> "9.4 measurement — owner opened a first-party counter gate — 2026-11-17", with
> the binding constraints any future counter must satisfy. What
> ships is the local-only usefulness prompt described below; reading its code
> (`assets/js/accessibility.js`, bundled into `assets/js/shell.bundle.js`) confirms
> it makes **no network call** — no `fetch`, no `sendBeacon`, no image ping — and
> that a dismissed or unavailable `sessionStorage` simply skips the prompt. A
> dated owner decision is required before Phase 9.4 closes; see
> `docs/DECISIONS.md` → "Open owner decisions from Phase 9".

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

**The owner has opened that gate (2026-11-17).** The honest option chosen for
further work is a **first-party, non-tracking aggregate counter** — not a
third-party analytics service. Before it can ship, the owner must answer what is
counted, where it is stored, how long it is kept and what the privacy page says;
and the implementation must keep these non-negotiables:

- one same-origin request, non-blocking, inside the existing page budget, and
  never a precache entry (offline must not depend on it);
- pathname plus a coarse bucket at most — **never** query strings, names, notes,
  answers, bookmarks or search text, and no persistent identifier;
- no third-party script, no cookie for tracking, no resale, no coupling to ads or
  affiliate links (the money model stays "none");
- the local usefulness prompt is not replaced by the counter;
- counts are reported as what they are (sessions/views), never as learning gains,
  retention or "students helped". Repository traffic is still not student usage.

Until those answers exist, Phase 9.4 stays **open** and this document stays the
record of what cannot be known.
