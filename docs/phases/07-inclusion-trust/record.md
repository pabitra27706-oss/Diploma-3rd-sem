# Phase 7 — Engineering record

Status: partial implementation; 2026-11-09. Reuse: ADAPT existing metadata,
landmarks/theme/labels and privacy page; BUILD additive shared safeguards and
a small UI-only translation catalog. This is not a WCAG compliance assertion.

Added static main landmarks to legacy subject/unit content containers, static
skip links where a main exists, shared focus ring/scroll offset/reduced-motion
rules, selected modal Tab containment and visible storage failure alerts.
Reading settings persist centrally; high-contrast override and relaxed line
height are shared. UI-only en/bn catalog starts with settings; educational
content remains English and untranslated elements retain English semantics.

Privacy now acknowledges chosen local names/notes/answers, namespaced record
groups, actual reset and backup behavior. No third-party runtime analytics or
new upload endpoint. Existing source answers are labelled model/unverified,
not newly certified. No license is invented for material whose rights are not
resolved by broad technical delegation.

Evidence: strict site checker 0 errors / 29 warnings (down from 97 before this
engineering batch). Warnings still include legacy structure/label issues: they
are NOT waived. Settings note/backup/preferences integration and prior core
regressions pass. This is not a measured contrast/zoom/screen-reader audit.

Pending: remaining structure/heading/form warnings, comprehensive dialog/tab
keyboard behavior, measured contrast/target tables, complete reading settings
coverage, broader Bengali UI catalog and license/credits
owner gate. Hardware/screen-reader/cross-device acceptance is Phase 10.


## Follow-up — feedback truth and keyboard controls

Replaced malformed nested feedback cards with native pressed-state buttons,
explicit message/email labels, field errors and a 2,000-character limit. Removed
the implicit global event dependency and false received/recorded/weekly-review
claims. Open email app prepares a draft; copy uses a visible manual fallback.
There is no hidden network submission or saved feedback draft. Build metadata
comes from the actual worker VERSION through the presence generator.
`tests/feedback-browser.cjs` verifies keyboard selection, field errors, draft
identity and zero requests on copy. Site check now has 28 warnings, not zero.
