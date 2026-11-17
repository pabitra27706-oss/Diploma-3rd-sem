# Phase 7 — Inclusion and trust

**Status:** 🚧 parts 7.1–7.5 implemented and gate-verified on
`arena/c56bb630-diploma-3rd-sem` (2026-11-17), **not merged**; open caveats in
[`record.md`](record.md) · **Parts:** 5 · **Depends on:** 1 (and 6 for the
preference record) · **Owner gates:** none left for 7.5 (MIT chosen 2026-11-16);
device/screen-reader acceptance moves to Phase 10

## Goal

Make the site usable by a student with a cracked screen, a screen reader, a slow
phone, or a different first language — and make every sentence on it true of the
build that ships.

## Why now — the measured evidence

Measured **2026-11-17** on the merged Phase 6 tree, before any Phase 7 edit, by
`python3 scripts/audit_accessibility.py`. The numbers this table used to carry
(55 pages, 55/55 without a skip link, 36/55 without `<main>`, 36/55 without a
meta description, missing `LICENSE`) were written before Phases 4–6 shipped and
were wrong: the real tree is **68 shipped pages**, 11 without `<main>`/skip
(not 36), 0 without a meta description, and `LICENSE` exists. The full
before/after table, including the counts the old table never had, is in
[`record.md`](record.md#re-measurement-first-the-phase-readmes-evidence-table-was-stale).

| Problem | Measured before | Where |
|---|---|---|
| Pages with no `<main>` landmark | 11 / 68 | 9 `info/*` pages, `offline.html`, `pyq/viewer.html` |
| Pages with no skip link | 11 / 68 | same 11 |
| Pages with `<h1>` count ≠ 1 | 3 | `index.html` (2, dialog title), `practice/session.html` (0), `pyq/viewer.html` (0) |
| Heading-order jumps | 134 across 32 pages | 24 unit pages (~780 `<h4>` card labels with no `<h3>` above them), 5 subject hubs, 3 info pages |
| Unlabelled controls | 1 | `pyq/answers.html` search (placeholder only) |
| Duplicate ids / missing `alt` | 0 / 0 | already clean |
| Contrast pairs below requirement | 27 of 47 measured | tertiary text 2.56:1, white on success 2.54:1, white on danger 3.76:1, focus halo 2.2:1, plus quiz/practice/PYQ token sets |
| Reduced-motion coverage | 7 of 22 first-party CSS files | `assets/css/**`, `*/css/**` |
| `data-i18n` keys | 5, settings page only | `assets/i18n/` |
| Feedback/offline/privacy claims | 6 statements the code does not support | `info/privacy-policy.html`, `info/usage-guide.html`, `info/about.html`, `README.md` |

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
| 7.1 | WCAG 2.2 AA remediation | Every source-level structure, label, contrast, motion and target-size criterion is measured clean, and the numbers are locked by a test |
| 7.2 | Reading controls | Text size, line height and contrast are user-controlled and persisted |
| 7.3 | Language layer | Switching language changes the UI, not the content |
| 7.4 | Truth pass | Privacy page matches the code, key by key |
| 7.5 | License, credits, docs | The repo has a licence and a README that is true |

Details: [`tasks.md`](tasks.md).

## Done means

- Automated checks clean: one `<main>`, one `<h1>`, skip link first, every input
  labelled, every image with `alt`, no duplicate ids. — **met** (`check_site.py
  --strict` is 0 errors / 0 warnings; `scripts/audit_accessibility.py` is 0
  findings).
- Contrast measured from tokens: body ≥ 4.5:1, large text/UI ≥ 3:1, focus ring
  ≥ 3:1 against both backgrounds; values written into `docs/DESIGN.md`. — **met
  from source tokens** (47 pairs, 0 failing). Rendered contrast over gradients is
  not measured.
- Target size ≥ 24×24 CSS px for every control, verified by measuring CSS. —
  **met for declared control boxes** (`scripts/audit_accessibility.py` reports
  control rules pinned below 24 px; glyph sizes are exempt by design).
- Keyboard-only completion of: search → question → quiz → result → export. —
  **not verified here** (needs a browser); Phase 10.
- Focus is never obscured by sticky UI; dialogs move and return focus; Esc
  closes; tab lists follow the APG pattern. — `scroll-padding-top` is in place
  on all pages; the rest is **not verified here**.
- Reading controls change body text without breaking layout at 200%. — **not
  verified here** (needs a browser).
- Language switch: English ↔ Bengali UI strings, `<html lang>` updated, choice
  persisted; content explicitly stays in its authored language. — **met** for
  the 38-key shared catalog; Bengali glyph rendering on a phone is **not
  verified**.
- Privacy page lists every storage key and every network request; feedback says
  what actually happens; no claim survives that the build cannot support. —
  **met** for the statements corrected in `record.md` §7.4.
- `LICENSE` exists (owner decision), credits page is accurate, README paths all
  resolve. — **met** (`LICENSE` is MIT; `scripts/check_readme_paths.py` checks 29
  paths, 0 missing).

## Risks

- A blanket CSS change can regress every page at once. Change tokens first, then
  components per area, and screenshot each area.
- Bengali typography needs a font that renders conjuncts; the system stack may
  not. Test on a real phone before claiming support.
- Rewriting README is easy; keeping it true is not. Add a check that every path
  quoted in it exists.
