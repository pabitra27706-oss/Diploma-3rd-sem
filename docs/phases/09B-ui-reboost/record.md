# Phase 9B record — 2026-11-17

Status: **research; illustration option 1 selected; plan approval pending; no UI batch implemented or accepted**. Branch `arena/48a2ab20-diploma-3rd-sem`, base `816ef84`. Reuse: existing `variables.css`, `base.css`, quiz/practice controls and shared JS widgets are studied for adaptation; no runtime dependency or feature added.

## Evidence received

The owner supplied ten phone screenshots: two home, two C subject, one C unit, practice hub, practice question, quiz landing, quiz subject list and PYQ list. They show the deployed site, not this branch after changes. No desktop, print preview, generated-site render or after screenshot supplied. Owner selected option 1 of two generated direction illustrations (`selected-direction.png`); option 2 was not selected, and no reason was given. This selection is not approval of the implementation plan. No browser/Chromium/Lighthouse here; no local visual pass claimed.

## Measured baseline

See [audit](audit.md) and [complete source inventory](inventory.md): 20 first-party stylesheets; 80 raw font-size values, 270 padding, 93 margin, 43 gap, 36 radius, 84 shadow, 39 z-index values. Not computed phone sizes; they require a browser. 384 parsed rgba declaration occurrences / 197 expressions by the documented new method, versus the older 373 / 188 with unrecorded method. `audit_accessibility.py --fail`: 47 pairs, 0 findings; `check_tokens.py --strict`: 0 findings, hex-only; `audit_page_weight.py --budget`: pass. No rendered contrast or full request measurement in this research checkpoint. No after numbers yet.

## Decisions / remaining gates

The owner suspended the four-question cap for Phase 9B only; see `docs/DECISIONS.md`. Alpha tokenisation is planned only after extending the checker and tests. The plan and each subsequent implementation batch need explicit owner approval; obtain before/after phone and desktop screenshots. Dark mode and print need real owner-supplied evidence. Option 2 was not selected; its rejection rationale was not supplied. No merge/deploy until explicitly ordered. Research baseline checks: strict site 0 errors/warnings; platform 0 errors; icon subset and data version current; root rewrite PASS; all 14 deterministic Node suites PASS. Python unittest: 92 tests, 1 error (`test_data_pipeline.test_no_semantic_or_answer_changes`), because this checkout lacks git object `664674b`; this is the previously recorded missing-history error, not a hidden pass. These are source checks, not visual validation.
