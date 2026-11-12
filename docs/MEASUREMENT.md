# Measurement without surveillance

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
