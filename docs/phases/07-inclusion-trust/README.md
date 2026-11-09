# Phase 7 — Inclusion and trust

**Status:** 📋 planned · **Parts:** 5 · **Depends on:** 1 · **Owner gates:** license (7.5)

## Goal

Make the site usable by a student with a cracked screen, a screen reader, a slow
phone, or a different first language — and make every sentence on it true of the
build that ships.

## Why now — the measured evidence

| Problem | Number | Where |
|---|---|---|
| Pages with no skip link | 55 / 55 | all HTML |
| Pages with no `<main>` landmark | 36 / 55 | all HTML |
| Pages with no meta description | 36 / 55 | all HTML |
| Unit pages with heading-order jumps | 24 / 24 | `subjects/*/units/*` |
| Unlabelled controls | search + 2 feedback fields | `pyq/answers.html`, `info/send-feedback.html` |
| Measured contrast below 4.5:1 | tertiary text 2.54:1, quiz primary 4.28:1, white on success 2.54:1, white on danger 3.76:1 | token values |
| Reduced-motion coverage | 5 of 19 CSS files | `assets/css/**`, `*/css/**` |
| README/LICENSE/claims | missing `LICENSE`; README documents a file that does not exist; privacy page says no personal data is stored | `README.md`, `info/privacy-policy.html` |
| Feedback implies submission | text says recorded before `mailto:` opens | `info/send-feedback.html` |
| No language option | 0 i18n strings, 0 Bengali UI | everywhere |

WCAG 2.2 adds criteria this site has never been checked against: target size
(24 px minimum), focus not obscured, dragging alternatives, consistent help, and
redundant entry.

## Scope

- **In:** accessibility remediation, reading controls, i18n scaffolding + English
  and Bengali UI strings, truthful privacy/feedback/offline claims, credits,
  README rewrite, LICENSE.
- **Out:** translating question content (a separate, much larger project),
  visual redesign (Phase 9).

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 7.1 | WCAG 2.2 AA remediation | A keyboard-and-screen-reader pass completes the core flows |
| 7.2 | Reading controls | Text size, line height and contrast are user-controlled and persisted |
| 7.3 | Language layer | Switching language changes the UI, not the content |
| 7.4 | Truth pass | Privacy page matches the code, key by key |
| 7.5 | License, credits, docs | The repo has a licence and a README that is true |

Details: [`tasks.md`](tasks.md).

## Done means

- Automated checks clean: one `<main>`, one `<h1>`, skip link first, every input
  labelled, every image with `alt`, no duplicate ids.
- Contrast measured from tokens: body ≥ 4.5:1, large text/UI ≥ 3:1, focus ring
  ≥ 3:1 against both backgrounds; values written into `docs/DESIGN.md`.
- Target size ≥ 24×24 CSS px for every control, verified by measuring CSS.
- Keyboard-only completion of: search → question → quiz → result → export.
- Focus is never obscured by sticky UI; dialogs move and return focus; Esc
  closes; tab lists follow the APG pattern.
- Reading controls change body text without breaking layout at 200%.
- Language switch: English ↔ Bengali UI strings, `<html lang>` updated, choice
  persisted; content explicitly stays in its authored language.
- Privacy page lists every storage key and every network request; feedback says
  what actually happens; no claim survives that the build cannot support.
- `LICENSE` exists (owner decision), credits page is accurate, README paths all
  resolve.

## Risks

- A blanket CSS change can regress every page at once. Change tokens first, then
  components per area, and screenshot each area.
- Bengali typography needs a font that renders conjuncts; the system stack may
  not. Test on a real phone before claiming support.
- Rewriting README is easy; keeping it true is not. Add a check that every path
  quoted in it exists.
