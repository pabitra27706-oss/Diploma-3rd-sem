# Phase 9B record — 2026-11-17

Status: **home-header batch approved; Search, Today, Coverage and Settings redesign implemented, awaiting owner review**. Branch `arena/48a2ab20-diploma-3rd-sem`, base `816ef84`. Reuse: existing `variables.css`, `base.css`, quiz/practice controls and shared JS widgets are studied for adaptation; no runtime dependency or feature added.

## Evidence received

The owner supplied ten phone screenshots: two home, two C subject, one C unit, practice hub, practice question, quiz landing, quiz subject list and PYQ list. They show the deployed site, not this branch after changes. No desktop, print preview, generated-site render or after screenshot supplied. Owner selected option 1 of two generated direction illustrations (`selected-direction.jpg`); option 2 was not selected, and no reason was given. Subsequently, the owner approved the plan and batch sequence conditional on the required before screenshots being available. They chose the illustration’s dark navy/lavender palette, balanced density, and a serif-style title without the leaf. No browser/Chromium/Lighthouse here; no local visual pass claimed.

## Measured baseline

See [audit](audit.md) and [complete source inventory](inventory.md): 20 first-party stylesheets; 80 raw font-size values, 270 padding, 93 margin, 43 gap, 36 radius, 84 shadow, 39 z-index values. Not computed phone sizes; they require a browser. 384 parsed rgba declaration occurrences / 197 expressions by the documented new method, versus the older 373 / 188 with unrecorded method. `audit_accessibility.py --fail`: 47 pairs, 0 findings; `check_tokens.py --strict`: 0 findings, hex-only; `audit_page_weight.py --budget`: pass. No rendered contrast or full request measurement in this research checkpoint. No after numbers yet.

## Decisions / remaining gates

The owner suspended the four-question cap for Phase 9B only; see `docs/DECISIONS.md`. Alpha tokenisation is planned only after extending the checker and tests. The plan is approved conditionally; each subsequent implementation batch needs explicit owner approval; obtain before/after phone and desktop screenshots. Dark mode and print need real owner-supplied evidence. Option 2 was not selected; its rejection rationale was not supplied. No merge/deploy until explicitly ordered. Research baseline checks: strict site 0 errors/warnings; platform 0 errors; icon subset and data version current; root rewrite PASS; all 14 deterministic Node suites PASS. Python unittest: 92 tests, 1 error (`test_data_pipeline.test_no_semantic_or_answer_changes`), because this checkout lacks git object `664674b`; this is the previously recorded missing-history error, not a hidden pass. These are source checks, not visual validation.

## Owner requested broader redesign — 2026-11-17

Owner said the initial work felt cheap and specifically requested a full visual rework of PYQ, quiz, practice and other pages. Added a source-backed [page audit](page-audit.md) and prioritized [screenshot checklist](screenshot-checklist.md); expanded the plan to cover entire journeys and states without altering content/features. Owner subsequently clarified that they want additional page-specific references for practice, quiz and PYQ. Ten original phone screenshots remain the only site images received; desktop before screenshots are still outstanding. No implementation, CSS change, or visual pass claimed.

## Owner screenshots, specific priorities and page references — 2026-11-17

Owner supplied four additional **phone light-mode** screenshots: full home, practice hub, quiz landing, and expanded PYQ list (14 phone screenshots total). No desktop, print-preview, PYQ question/answer screenshot or after screenshot supplied. The owner requested additional distinct visual references for practice, quiz and PYQ, identified print button, broken phone home header, unstyled practice notices, full quiz flow and PYQ copy/share/source placement as priorities. Details and source references: [page audit](page-audit.md). Owner selected option 2 of 2 for each page-specific illustration: `practice-reference.jpg`, `quiz-reference.jpg` and `pyq-reference.jpg`. These are design references only, not screenshots. The practice illustration invents nursing subjects, statistics and controls; they must not be implemented. Owner subsequently chose serif headings with sans-serif body and controls, revising the earlier brand-only preference. No CSS implementation or batch approval is implied. Owner clarified that both paper source notes and provenance should move above the question, and chose an existing actions menu for print where available, with clear access elsewhere. The desktop before condition and per-batch owner confirmation remain in force.

## Clarifications received — 2026-11-17

Owner selected both PYQ source-note types for placement above questions, print in an existing actions menu where available with clear access elsewhere, and serif headings / sans-serif body and controls. Missing before screenshots still block implementation. No batch or deployment has been approved by these clarifications.

## Additional owner before evidence — 2026-11-17

Thirteen more Via browser screenshots supplied: home (`153653`), C subject (`153704`, `153718`), practice hub (`153754`) and session (`153818`), PYQ practice/review including source notes (`153838`, `153843`), quiz landing/setup/play (`153855`, `153905`, `153916`, `153930`, `153937`, `153945`); full filenames are `Screenshot_20261117_<time>_Via.jpg`. That brings the total to 27 owner-supplied site screenshots. Several show a wide-layout view scaled into a phone; CSS viewport width and true physical-desktop behavior were not reported. They are useful baseline evidence, not a desktop device pass. No after, actual print, or rendered local screenshots. Screenshot `153905` appears to show empty warning/error boxes and a custom count box with 10 selected; source has `hidden` attributes (`quiz/setup.html:349,852–875`) while `.alert` declares `display:flex` (`quiz/css/common.css:1024–1034`). This is a plausible cause, not a confirmed diagnosis across browsers; include it in the quiz batch and test actual hidden/visible states.

## Batch 1A — alpha checker only, awaiting owner review

Added `tests/test_rgba_tokens.py` before `scripts/check_tokens.py` implementation: the initial run failed as expected before the checker existed. The checker scans first-party CSS, HTML and JS text, including inline styles and generated JS; allows rgba in custom-property definitions in `variables.css`; and compares all other balanced `rgba()` expressions against exact per-file counts in `rgba-baseline.json`. Legacy counts: **397** (369 CSS, 25 HTML, 3 JS) over 32 files. This is a conservative text scanner: CSS/HTML comments are ignored, JS comments/strings are included, dynamic construction/escaping and modern `rgb()` syntax are not comprehensively parsed. The ledger is a ratchet, **not alpha-tokenisation**; removal requires the reviewed ledger to shrink in the same change. The earlier 384 figure counted parsed CSS declarations, including token definitions, so it is a different scope and cannot be compared arithmetically. No CSS, HTML or runtime JS changed; generated outputs were regenerated in the requested order and remained byte-identical. No owner after-screenshot is needed for this non-visual checker-only batch; screenshots of actual UI batches remain mandatory.

Checks: `check_site --strict` 0 errors/warnings; platform 0 errors; strict tokens 0 findings **with 397 known legacy exceptions**; icon subset/data version current; weight budget pass; root rewrite pass; accessibility 47 token pairs and 0 findings; 14 deterministic Node suites pass. Python suite: 102 tests, 1 pre-existing error in `test_data_pipeline.test_no_semantic_or_answer_changes` because git object `664674b` is absent (do not count as a pass). No visual pass, runtime request count or desktop hardware test was performed. Wait for owner confirmation before alpha migration or any visual batch.


## Owner confirmation and batch 1B — 2026-11-17

The owner replied “Yes continue” after the checker-only batch was explained and confirmation requested; batch 1A is confirmed. Batch 1B migrates five identical `rgba(255, 255, 255, 0.15)` expressions in `assets/css/main.css` to the single `--alpha-white-15` custom property in `assets/css/variables.css`, in the welcome badge/input/stats/focus shadow and home focus-subject chips. Static equality proof: replacing all five new references with the token's literal reconstructs the previous `main.css` byte-for-byte; a regression test verifies the token's exact value. This proves the text equivalence, not rendered screenshots or composited contrast. No design or layout has been intentionally changed. The RGBA ledger shrank **397 → 392**; it still records 392 legacy exceptions and migration remains open.

A CSS shell change requires a cache version update: branch `sw.js` moves `study-2026-11-17e` → `study-2026-11-17f`, while the live site remains `e` until explicitly deployed. Generated presence metadata was regenerated twice and changes only that version on 74 HTML pages; data version remains `data-6b1621c45599`. The previous discovery test hard-coded shell `e`; it was updated to verify the worker version and matching page metadata instead, retaining precache assertions. Runtime bundles, icon subset, presence twice, search index and data version last were regenerated. No new runtime requests. Static weight: 592 → 592 total CSS/JS requests across 74 pages; no per-page CSS/JS request count increased; total CSS 6,817,906 → 6,789,336 bytes; home CSS 56,182 → 55,777 bytes; zero pages increased in CSS or JS bytes. These are file-based measurements, not browser network captures.

Gates: strict site 0 errors/warnings, platform 0 errors, token checker 0 findings (with the 392-entry legacy ledger), icon subset and data version current, weight budget pass, root rewrite pass, accessibility 47 token pairs and 0 findings, 14 deterministic Node suites pass. Python suite: 103 tests, 1 pre-existing error because checkout lacks git object `664674b`; the former hard-coded discovery version failure was corrected and its suite passes. Preview server serves the nested base path, but the agent has not rendered it. Owner screenshots of home and first-visit welcome on phone and wide layout, before/after and light/dark where applicable, are requested; no after screenshots or owner confirmation have yet been received. Do not advance to home-header work until the owner confirms this batch.


## Batch 1B — owner after screenshots received (2026-11-17)

Owner supplied `Screenshot_20261117_155932_Samsung Browser.jpg` (local Termux welcome), `Screenshot_20261117_155941_Samsung Browser.jpg` (local phone-width dark home), and `Screenshot_20261117_155948_Samsung Browser.jpg` (local home shown in a wide/scaled layout on the phone). The screenshots show the branch on `127.0.0.1`; exact CSS viewport width and physical desktop behavior are unknown. Earlier phone and wide-layout home screenshots were supplied from the live site, but no matching before screenshot of the welcome screen or actual desktop-device screenshot has been supplied. The phone home still shows the pre-existing crowded header, which has not yet been redesigned. No owner verdict on whether the colour-preparation batch passes was provided; ask for written confirmation and do not start the header batch until confirmed. No local browser rendering or visual comparison is claimed.


## Batch 1B approval and home-header batch — 2026-11-17

After the three Termux screenshots, the owner selected “Yes, continue” when asked whether the welcome/home colours looked normal and header work could start. This confirms proceeding from batch 1B; the matching welcome-before, light-mode after, physical desktop and print evidence remain outstanding for full phase acceptance.

The home header retains all four desktop links; at up to 1024 CSS px the links move into the existing side menu and a labelled search icon appears. At up to 320 CSS px search remains available in that menu instead. Theme and menu controls remain; the title uses the owner-selected local serif heading stack, with sans-serif controls and body. The header is sticky in normal flow with a minimum rather than fixed height and allows wrapping for zoom or larger text; safe-area top padding is retained. The closed side menu now has `visibility: hidden`, and the existing focus trap/return logic is unchanged; this hides it immediately on close, rather than animating its exit. The relative destinations and sprite references were checked in source. These are source-level changes, not a rendered or device-tested approval. No content/data or new runtime request was added.

Five source-level header contracts pass (first four were written before implementation and initially failed); they do not prove visual layout, keyboard use, safe-area behavior or focus under real scaling. Shell `study-2026-11-17f` → `g`; presence was regenerated twice, with the other 73 HTML changes limited to build metadata. Runtime bundles, icon subset, presence twice, search index and data version last were regenerated; data version remains `data-6b1621c45599`. Static CSS bytes 6,789,336 → 6,771,422 overall, home 55,777 → 55,061; requests remain 592 across 74 pages, and no page increased in CSS, JS or request counts. Numbers are file-based, not network measurements.

Gates: strict site 0 errors/warnings; platform 0 errors; strict tokens 0 findings with 392 legacy RGBA occurrences still ledgered; icon subset/data version current; weight budget and root rewrite pass; static accessibility 47 pairs and 0 findings; all 14 deterministic Node suites pass. Python: **108 tests, one error**, the known missing Git object `664674b` in `test_data_pipeline.test_no_semantic_or_answer_changes`; not a full pass. No browser or Lighthouse available to the agent. No rendered contrast, keyboard/focus, zoom, safe-area, print, dark or desktop-device pass is claimed.

Owner review required before the next batch: compare phone and desktop-width before/after screenshots of home in light and dark modes, including the open menu and a narrow/large-text view if possible; confirm links, theme toggle, menu close and scrolling work. A wide view on a phone is useful but not a physical-desktop pass. Do not merge/deploy without explicit authorization.


## Owner header approval and utility-page feedback — 2026-11-17

After pulling the branch into Termux, the owner wrote “the hader is good”, approving the home-header batch. No header after screenshots or separate confirmation of the menu links, scrolling, zoom, light/dark or desktop were supplied; these remain evidence/verification gaps, not a visual pass claimed by the agent. The owner says Search, Today, Coverage and Settings look like plain pages with only some options, and asks that they match the real app's theme and colours; whether any specific controls fail or whether “no real work” describes appearance remains to be clarified. Do not invent features or silently change the existing functions.

Source inspection: Search has its search/filter form and dynamic results; Today has local study summary, goal, streak and question controls; Settings has reading preferences and backup/restore/reset controls; Coverage is a generated, disclosure-heavy inventory/table page (`scripts/build_coverage.py`). All four load `discovery.css`, also loaded by 14 other pages, so broad shared CSS changes need impact review and screenshots. Settings and Coverage use `storage.js`, whose `applyPreferences` sets `data-theme`; Search and Today also load `theme.js`. This is source evidence only, not proof of live behavior or a diagnosis of the reported appearance. Ask which page to address first, which actions actually fail if any, and phone/wide before screenshots (including relevant states; no private backup contents). Plan small reviewable batches with preserved functionality and full per-batch checks/approval. Do not start a utility-page CSS batch before the needed baseline screenshots and agreement on scope.


## Utility pages — owner evidence and redesign, 2026-11-17

Owner provided seven Chrome localhost before images: `Screenshot_20261117_162755_Chrome.jpg` (phone Search), `162808` and `162827` (Today, phone and scaled-wide), `162840` and `162848` (Settings, scaled-wide and phone), `162855` and `162904` (Coverage, phone and scaled-wide). These are dark-mode phone-browser images, not confirmed physical desktop. Search results, search wide, light, print, zoom, interactive and error states were not supplied. Screenshots show very dark blue links, dense text and utilitarian forms; screenshot inspection is not a measured contrast assessment. The owner requested full-app visual improvements with CSS, phone-friendly layouts and SVGs, and explicitly said screenshots are not needed for every work item. This revises the prior per-work screenshot requirement for Phase 9B, not the requirement for owner review and explicit deployment authorization. The owner did not identify any specific failing control.

Implemented a scoped utility-page design for Search, Today, Settings and generated Coverage: local serif headings, theme-aware surfaces and links, decorative accessible-hidden SVGs, clearer nav and forms, responsive Search filters, information cards and scrollable coverage tables. Search coverage remains intact inside a labelled disclosure; existing search DOM IDs, settings/backup controls, Today logic, Coverage data and caveats are preserved. The hidden-state override prevents the filter bar from being displayed when `hidden`; a scoped install/update bar style reduces its visually intrusive appearance without removing the action. Changes to the shared discovery sheet are scoped to the four page classes; its other 14 users do not opt in. Coverage markup is emitted by its generator. No runtime JS behavior was deliberately changed. Real rendering, click targets, scrolling, focus, high contrast, reduced motion, light/dark and print are not verified locally.

To meet the no-CSS-weight-regression constraint, comments were archived in [css-comment-archive.md](css-comment-archive.md), and whitespace compacted in the two already-shared base and token sheets; non-comment lines are textually equivalent after stripping line-edge whitespace. No declarations in those sheets changed. File-based CSS totals 6,771,422 → 6,433,684 bytes; Search/Today/Settings/Coverage 28,675 → 28,370 each; 592 → 592 CSS/JS requests across 74 pages, with zero per-page increases in CSS bytes, JS bytes or request counts. This is not a browser network measurement. No additional runtime requests. CSS shell `study-2026-11-17g` → `h`. Search manifest's source byte count and generated version changed because indexed HTML changed; all remaining manifest fields and search shard content are unchanged. Consequently the generated data version changed `data-6b1621c45599` → `data-01e7be2065a4`, without changing study data. Coverage, runtime bundle, icon subset, presence twice, search index and data version last were regenerated.

Checks: five new source contracts passed (initially red); seven token-resolved opaque colour pairs meet 4.5:1 in addition to the existing 47-pair audit, not a rendered contrast test. Strict site 0 errors/warnings, platform 0 errors, token checker 0 findings with 392 legacy RGBA occurrences ledgered, icon subset and data version current, weight budget and root rewrite pass, static accessibility 0 findings and 14 deterministic Node suites pass. Python suite: 113 tests, one known missing Git object `664674b` error in `test_data_pipeline.test_no_semantic_or_answer_changes`; not a full pass. No local browser/Lighthouse; no visual or device pass claimed. Owner review remains required; screenshots need not be supplied after every work item. No merge/deployment without explicit owner command.


## Single design layer, retheme, PYQ phone fixes, and merge — 2026-11-17

Owner command: complete the docs and merge to `main`. Branch
`arena/7e77489f-diploma-3rd-sem` (base `816ef84`) merged by fast-forward; two
commits of substance, `5b0f571` (design layer and retheme) and `9445158`
(PYQ phone fixes), plus `07736cc` (Termux check recipe).

### What was built

- `assets/css/hub.css` (~118 KB, untracked until this work) is injected before
  `</head>` on all 74 pages by `scripts/generate_presence.py`, after
  `base.css`. One sheet for the whole site.
- `mark_body()` stamps `data-page` / `data-page-family` on `<body>` from
  `page_family(relative_path)`; 21 families.
- Retheme in `assets/css/variables.css`: light bg `#f7f7fd`, accent `#5a4bc4`;
  dark bg `#101120`, accent text `#a99bf7`. 57 measured pairs, all passing.
- Duplicate token `--c-b9adf6` (identical to `--c-lav-300`) removed.

### Rejections, with the evidence that drove them

Recorded because both were attempted twice and look plausible:

1. **Splitting `hub.css` into `assets/css/families/*.css`** — per-family
   duplication produced 92 fingerprint differences; per-family emission
   produced 146. Abandoned; the directory stays deleted.
2. **Migrating unit/subject rules into `subjects/units-com/common.css`** —
   that sheet loads *before* `hub.css`, so the `[data-page]` qualifier drops a
   specificity level. 85/63 fingerprint regressions and 1,496 anchors reverting
   to legacy colour. Reverted; `common.css` back to 108,291 B.

### Root cause worth remembering

`mark_body` existed but was **never called**. Seven pages therefore never
received `data-page`, every `[data-page]` rule silently skipped them, and their
navigation kept the legacy blue at 2.51:1 (40 rendered failures). A function
present and correct is not a function in use; the call site is the thing to
verify. The helper is now idempotent across repeat generator runs — the first
repair duplicated the attribute on `index.html` on the second pass.

A second trap: `accessibility.js` appends a print button to `<main>`. On
`pyq/viewer.html` `<main>` is `.paper-wrapper`, a `display:flex` row, so the
button became a flex sibling and squeezed the paper to 275 px at a 412 px
viewport. The injector now skips pages that already own a print control and
refuses flex/grid containers. Paper 275 → 380 px. Editing
`assets/js/accessibility.js` alone changes nothing at runtime — it is inlined
into `shell.bundle.js` by `scripts/build_runtime_bundles.py`, which must be
re-run.

### Budget

Per-page CSS fence raised 250 KB → 300 KB by owner decision (Option A).
Heaviest page 171.5 KB. Rationale in the `scripts/audit_page_weight.py`
docstring; the same 300 KB ceiling already existed as `CSS_BUDGET_SINGLE` in
`scripts/check_site.py`.

### Verification obtained

- 6/6 static gates pass.
- 113/113 unit tests pass on a full clone. The single error reported inside the
  Arena sandbox is environmental: `tests/test_data_pipeline.py` shells out to
  `git show 664674b:...` and that object is absent from a shallow clone.
- Headless Chromium, 148 page · theme combinations at 412 px: 0 contrast
  failures, 0 unnamed controls, 0 sub-24 px targets, 0 JS errors — measured
  *before* the PYQ fixes. After those fixes a simpler harness was rebuilt and
  reported false positives because it did not composite translucent
  backgrounds; the specific findings were hand-verified instead (white on
  `#8ba4ff` 2.37:1 and on `#3b82f6` 3.68:1, both corrected to 6.48:1). **No
  clean full-sweep number exists for the post-fix tree.**

### Verification NOT obtained — do not imply otherwise

No physical-device screenshot, no TalkBack or VoiceOver observation, no 200 %
zoom or reflow check, no real print-to-PDF page counts, no warmed-cache offline
launch, no Lighthouse run. Phase 10 owns all of it, and its own tasks file says
no pre-filled row is a pass.

### Note on the diverging branch

`arena/48a2ab20-diploma-3rd-sem` (draft PR #20, 14 commits) shares base
`816ef84` and overlaps 104 files with the work above. It is **superseded by
this merge**. Merging both is not a clean operation; close it rather than
resolve 104 files by hand.
