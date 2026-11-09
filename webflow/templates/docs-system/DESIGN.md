<!-- SPDX-License-Identifier: MIT -->

# Design — [SITE]

> The design specification for this site: direction, screens+states, frozen
> tokens, component inventory, owner approval. Built to
> `knowledge/design-system.md`. A token that changes without a line here is
> drift.

## Direction

- One line: [e.g. "quiet study tool: dense text, one accent, no decoration"]
- Chosen: YYYY-MM-DD — owner approved [all screens / with listed changes]
- Source of truth for values: `[path/to/variables.css]`

## Screens and states (one row per screen AND state)

| Screen / state | File | Status | Notes |
|---|---|---|---|
| [Home — content] | `index.html` | 📋 | |
| [Home — empty / loading / error / offline / dark / 200% text] | | 📋 | |

## Frozen tokens

| Token | Light | Dark | Contrast (pair) |
|---|---|---|---|
| `--bg` | # | # | — |
| `--surface` | # | # | — |
| `--text` on `--bg` | # | # | 4.5:1 minimum, measured: [ ] |
| `--text-muted` on `--bg` | # | # | measured: [ ] |
| `--primary` / `--primary-contrast` | # | # | measured: [ ] |
| `--border` | # | # | ≥ 3:1 vs adjacent |
| `--focus-ring` | # | # | ≥ 3:1 vs both backgrounds |

- Type scale: [sizes + line heights]; body ≥ 14px, no text below 12px.
- Spacing: 4px grid, tokens `--space-1…8`.
- Radii/shadows: [values].
- Motion: [durations ≤ 200ms], all behind `prefers-reduced-motion`.
- Icons: [set] · Font: [system stack or one self-hosted family].

## Component inventory

- [ ] shell/header/nav/footer/skip link · [ ] buttons (5 variants)
- [ ] cards · [ ] lists/rows · [ ] forms + errors · [ ] badges/chips
- [ ] tabs · [ ] dialog · [ ] inline alert · [ ] progress
- [ ] table · [ ] empty/loading/error/offline · [ ] print styles

## Deliberate exceptions (recorded, not drift)

- YYYY-MM-DD — [exception] — [why] — [approved by]

## Screenshot comparison (per UI phase)

- Phase [N] — [screen]: screenshots in `site-preview` reviewed against this
  spec · differences fixed: [ ] · exceptions above: [ ]
