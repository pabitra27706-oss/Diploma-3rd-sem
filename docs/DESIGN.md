# Design — Diploma 3rd Sem Study Hub

> Status: **not frozen.** Values below are measured from the current tokens in
> `assets/css/variables.css` (2026-11-06); they are evidence, not a spec. The
> token set gets consolidated and frozen in Phase 6, and no new page may
> hard-code a colour before then.
>
> Method: `webflow/knowledge/design-system.md`. Playbook: `webflow/`.

## Direction (proposed, needs owner approval)

One line: *"A quiet revision desk: dense readable text, one accent colour, no
decoration, everything reachable with one thumb and a keyboard."*

- Chosen: **not yet** — recorded here only as a proposal.

## Current token inventory (19 CSS files, no single source)

- `assets/css/variables.css` is the intended token file; component files repeat
  literal colours instead of consuming tokens (Phase 8 consolidates).
- Themes are applied via three keys: `diploma-3rd-sem-theme`, `theme`,
  `quiz-theme` (Phase 4 unifies).
- Icons: one inline sprite, `assets/icons/sprite.svg` (4 symbols referenced but
  missing — Phase 1).
- Fonts: system stack plus a Font Awesome CDN link on 38 pages (Phase 5
  removes or self-hosts).
- Motion: transitions in 5 of 19 CSS files respect `prefers-reduced-motion`.

## Measured contrast (static computation, not rendered)

| Pair | Ratio | Requirement | Verdict |
|---|---|---|---|
| tertiary text on background | ≈ 2.54–2.56:1 | 4.5:1 (body) | ❌ fails |
| quiz primary text | ≈ 4.28:1 | 4.5:1 | ❌ marginal fail |
| white on success button | ≈ 2.54:1 | 4.5:1 (text) | ❌ fails |
| white on danger button | ≈ 3.76:1 | 4.5:1 | ❌ fails |

Re-measure after any token change and write the number here.

## Screens and states to specify (Phase 6)

| Screen | States still undesigned |
|---|---|
| Home dashboard | loading, empty (new user), error, dark, 200 % text |
| Subject / unit | long-text overflow, print |
| Practice day | empty day, all-done, mixed difficulty |
| Quiz setup / play / result | no-questions, fetch failure, timeout, resume |
| Quiz history | empty, single record, mixed score types (null) |
| PYQ browser / answers | no results, long code answer, theory vs MCQ |
| Roadmap | day complete, day locked, behind/ahead |
| Notes | empty, saved, cleared |
| Info pages | long legal text, print |

## Frozen tokens (to fill in Phase 6)

| Token | Light | Dark | Contrast |
|---|---|---|---|
| `--bg` | | | — |
| `--surface` | | | — |
| `--text` | | | ≥ 4.5:1 on `--bg` |
| `--text-muted` | | | ≥ 4.5:1 |
| `--primary` / text on it | | | ≥ 4.5:1 |
| `--border` | | | ≥ 3:1 |
| `--focus-ring` | | | ≥ 3:1 vs both backgrounds |

Type scale, spacing scale, radii, elevation, motion limits: to be defined with
the tokens, then used everywhere.
