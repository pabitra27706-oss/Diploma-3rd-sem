# Phase 9B — proposed design system and review plan

**Owner approved this plan and selected illustration option 1, conditional on the required before screenshots being available.** No implementation until that condition is met. Owner may request changes. No generated illustration is a screenshot or proof of the real site. Phone screenshots already supplied are the baseline for the shown states only; desktop and additional states still needed.

## Proposed scales (subject to owner approval)

- Local system font stack for general UI, no remote font: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; retain monospace for code. Body 1rem/1.5; supporting 0.875rem/1.45; label 0.875rem/1.3; body emphasis 1rem/1.5; h3 1.125rem/1.3; h2 1.375rem/1.25; h1 1.75rem/1.15 on phone, up to 2rem/1.15 on desktop. Weight 400/600/700; tracking normal except short uppercase labels (0.04em). Owner revised the typography preference to serif headings with sans-serif body and controls, without the illustration’s leaf; use local fallback fonts and verify legibility. Do not shrink essential text to force fit; verify 200% text.
- Spacing tokens: 0, 4, 8, 12, 16, 24, 32, 40, 48, 64 CSS px expressed as rem; normal card padding 16 phone / 24 desktop, content gaps 8/16/24. Hairline 1px and icon geometry are explicit exceptions.
- Radii: 4px small, 8px controls, 12px cards, 16px large surfaces, full for pills; no decorative one-off radii in adopted components. Elevation: none, one low shadow for floating panels, one stronger shadow for modal; no shadows required for normal cards. Borders establish separation in both themes.
- Containers: 48rem reading/session, 64rem general dashboard/discovery, 72rem wide subject pages where content needs it; 16px minimum phone gutter, 24px desktop. Tables/code scroll within their own regions, not page-wide.
- Colour: one quiet primary accent for navigation/actions; semantic success/warning/error remain distinct. Do not reduce contrast to achieve calm; retain dark and light themes. Owner selected the illustration’s dark navy/lavender as reference, subject to contrast checks; exact tokens and composited contrast are checked before adoption.

## Component contracts

- **Button:** primary, secondary/outline, quiet, destructive, icon; small/default sizes, visible text or accessible icon label; consistent hover, pressed, keyboard focus, disabled and loading treatment. Maintain at least 24×24 target, aim 44×44 when practical.
- **Card/panel:** standard surface, interactive surface, informational notice, status/error/empty; one spacing/radius/border vocabulary. Preserve actual semantics (links/buttons vs containers) and information; no forced nested interactive elements.
- **Pill/badge:** neutral metadata, selected filter, semantic status; keep text meaning and selection states, reduce competing saturated fills. Do not convey meaning by colour alone.
- **Form:** labels, inputs, selects, textarea, helper/error text; native controls stay keyboard usable. Notes and mistake queue receive coherent styling but keep their behavior, privacy and copy.
- **Table/code:** legible row rhythm, header differentiation, horizontally scrollable overflow; never hide data. Shared print output remains black-on-white, readable, navigation-free.
- **Chrome (proposed):** same brand/type/action hierarchy across families, contextual back/breadcrumb where useful, theme/search consistently placed. Home keeps bottom nav; study/session retain task-specific controls. At narrow widths prioritize page title and essential actions, with existing menu holding secondary links; every existing destination remains reachable. Avoid adding requests or replacing working navigation logic. Footer treatment becomes consistent where present, not a mandate to add new content.
- **States/motion:** focus ring visibly distinct at ≥3:1, body text ≥4.5:1; hover and pressed where applicable; disabled, empty, loading and error have unambiguous text. Honour system and stored reduced-motion, remove nonessential motion rather than animate important content.

## Reviewable batches (one representative screen/state at a time)

0. Owner selected mockup option 1 and approved this plan, conditional on required before screenshots. Obtain missing desktop and other relevant baseline screenshots before implementation.
1. **Alpha gate only:** extend checker and negative tests first, baseline exact alpha migration strategy; then tokenize without changing rendered colours. Verify scripts and owner compares one representative before/after view. If a purely checker-only change is split out, no visual claim is made.
2. **Home header/chrome**: one phone home screenshot and matching desktop, including menu and update panel where possible. Keep warning and bottom navigation.
3. **Common utility controls**: notes, print and mistake queue on one practice question or unit screenshot; subsequent screenshots for other affected contexts, including empty and disabled.
4. **Home cards/hierarchy**: one home screenshot with greeting and primary cards; desktop counterpart.
5. **Subject/unit**: one unit screen, then subject hero if it cannot fit the same review; preserve metadata, controls and contents.
6. **Practice**: one question screen and one hub/empty state; if two cannot be reviewed together, split and wait between them.
7. **Quiz**: landing/subject card, then quiz question if different; dark and light, split if needed.
8. **PYQ/discovery**: one paper list, then one discovery/table screen, separately if needed.
9. **Print/dark/final integration**: owner supplies phone and desktop, dark/light and real print preview/PDF screenshots for affected representative pages. `docs/DESIGN.md` is updated to describe only adopted components; record unseen states, before/after metrics and decisions. Phase 10 still owns real-device acceptance.

Each numbered screen is a separate gate if needed: change only its agreed surface, run all requested gates, report exact change and screenshot checklist, and wait for written owner confirmation before the next. Shared styles may affect multiple screens: obtain before/after evidence for all impacted contexts and split further when necessary. Every batch maintains URLs/base-path safety, no new runtime requests or build steps; compare per-view requests against ≤12 and first-party CSS/JS budget against baseline. Keep one token file, regenerate generated outputs in the specified order with data version last, and run strict site/platform/token/icon/data/weight/root-rewrite/accessibility, 14 deterministic Node suites and Python suite. Report the known absent-history Python error honestly, and any new failures separately. Do not conflate static contrast checks with rendered contrast or owner device verification.

## Decisions still needed

Required desktop and other before screenshots; whether the existing home bottom nav should remain visually prominent; which screenshot viewport(s) are the owner's priority. Selected: navy/lavender, balanced density, serif headings with sans-serif body/controls, no leaf. No merge/deploy without an explicit command. Local review cannot substitute for the owner's rendered screenshots.

## Owner scope clarification — 2026-11-17

The owner requested a fuller redesign, especially across practice, quiz and PYQ rather than a home-focused polish. See [page-by-page audit](page-audit.md) and [screenshot checklist](screenshot-checklist.md). Expand implementation coverage to quiz setup/play/result/review/export, PYQ selection/paper/answers and practice filters/session as well as landing screens, preserving all features and content. Review each screen/state in its own small batch as necessary, with phone and desktop before/after screenshots and written approval; shared changes require evidence from every affected context. Light/dark, empty/loading/error, dialogs, print and desktop remain part of review. This scope clarification does not authorize skipping the before-screenshot gate. Owner requested additional page-specific references and selected option 2 for each: [Practice](practice-reference.png), [Quiz](quiz-reference.png), [PYQ](pyq-reference.png). These are illustrations only; the practice image incorrectly invents nursing content and metrics, which must never be implemented. Owner subsequently chose serif headings and sans-serif body/controls, explicitly revising the earlier brand-only preference.


## Owner's specific priorities

Place the existing site-wide print action in an existing actions menu where available and keep clear access on pages without one, fix crowded home phone header without losing destinations, give practice's initial source-review notice and final mistake queue coherent hierarchy, and redesign quiz across its complete existing flow. For PYQ, the owner requests copy/share/source controls next to the bookmark above each question, with accessible SVG icons. Maintain both question-specific source notes and the truthful provenance/certification disclosure, sharing fallbacks and keyboard behavior; obtain the exact before screenshot; the owner chose to move both the paper source note and provenance disclosure above the question. Repositioning dynamically generated controls can require source JS and regenerated bundles, not just CSS; treat this as a narrowly scoped UI change, with existing behaviors and URLs preserved, test it and get owner review. The page references are selected; no UI batch until the required before screenshots are received.
