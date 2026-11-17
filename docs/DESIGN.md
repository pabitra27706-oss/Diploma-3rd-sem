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

## Current token inventory (22 first-party CSS files)

Re-measured 2026-11-17. The numbers this section used to carry were written
before Phases 4–6 shipped and were wrong; these are counted from the tree by
`python3 scripts/audit_accessibility.py`.

- **22 first-party stylesheets** (`assets/css/*` 8, `quiz/css/*` 6,
  `practice/css/*` 3, `pyq/css/*` 3, `subjects/units-com/common.css`,
  `roadmap/index.css`, `info/styles/professional.css`). Third-party Font Awesome
  CSS is vendored and excluded from every count here.
- `assets/css/variables.css` is the token file; several component files still
  repeat literal colours instead of consuming tokens (Phase 8 consolidates).
  Where a literal had to change for contrast, the change was made in that file's
  own custom properties rather than inline in components.
- **Themes are one record.** Since Phase 6 the theme lives in the single
  `d3s:prefs` record applied by `assets/js/storage.js` before first paint; the
  old `diploma-3rd-sem-theme` / `theme` / `quiz-theme` keys are legacy read-only
  migration inputs, not live stores.
- **Icons: Font Awesome is self-hosted** at `assets/vendor/fontawesome/`
  (`css/all.min.css`) and referenced by 38 pages. There is no CDN link and no
  third-party network request on any shipped page. A single outbound `https`
  href remains — an optional Telegram contact link on
  `info/contact-support.html`, which is a link, not a request.
- `assets/icons/sprite.svg` defines **34 symbols**; no shipped page currently
  references one via `<use href="#…">`, so the old "4 symbols referenced but
  missing" note no longer describes this tree.
- **Motion: 21 of 22 stylesheets declare a `prefers-reduced-motion: reduce`
  rule** (the 22nd, `print.css`, animates nothing); 14 actually animate. All 68
  pages also load the global `@media (prefers-reduced-motion: reduce)` block and
  honour the stored `data-motion="reduced"` preference in
  `assets/css/accessibility.css`.

## Measured contrast (static computation, not rendered)

Re-measured **2026-11-17** by `python3 scripts/audit_accessibility.py`, which
resolves each token through the cascade the browser actually applies
(`--alias` chains followed, `[data-theme="dark"]` layered over `:root`). **47
token pairs** are measured; all meet their requirement. Ratios below are the
ones the script prints, so they can be re-derived instead of trusted.

| Pair (token) | Light | Dark | Requirement |
|---|---|---|---|
| body text on background | 17.85:1 | 18.12:1 | 4.5:1 |
| secondary text | 7.58:1 | 12.77:1 | 4.5:1 |
| tertiary text | 5.12:1 | 6.65:1 | 4.5:1 |
| accent as text | 5.18:1 | 8.58:1 | 4.5:1 |
| white on accent | 5.18:1 | — (solid accent stays dark) | 4.5:1 |
| white on success | 5.48:1 | — | 4.5:1 |
| white on danger | 4.83:1 | — | 4.5:1 |
| white on warning | 5.08:1 | — | 4.5:1 |
| white on info | 5.17:1 | — | 4.5:1 |
| focus ring on background | 6.32:1 (`#4a4fd0`) | 8.58:1 (`#a5a6ff`) | 3:1 (1.4.11) |
| skip-link text | 18.88:1 | — | 4.5:1 |

### What changed to get there (token level, not per component)

| Token | Was | Now | Why |
|---|---|---|---|
| `--text-tertiary-light` | `#94a3b8` 2.56:1 | `#5f6f85` 5.12:1 | tertiary labels are real body text |
| `--accent-primary` | `#6366f1` 4.47:1 | `#5b5ce0` 5.18:1 | also used behind white |
| `--accent-success` | `#10b981` 2.54:1 | `#047857` 5.48:1 | white button text |
| `--accent-error` | `#ef4444` 3.76:1 | `#dc2626` 4.83:1 | white button text |
| `--accent-warning` | `#f59e0b` 2.15:1 | `#a05f08` 5.08:1 | white button text |
| `--accent-info` | `#3b82f6` 3.68:1 | `#2563eb` 5.17:1 | white button text |
| `--accent-secondary` | `#8b5cf6` 4.23:1 | `#7c3aed` 5.70:1 | white button text |
| `--focus-ring` | 40 % alpha halo, 2.2:1 | solid `--focus-ring-solid` `#4a4fd0`, 6.32:1 | 1.4.11 needs a solid edge |
| `quiz --text-tertiary` | `#9ca3af` 2.54:1 | `#6b7280` 4.83:1 | quiz meta text |
| `quiz --accent` | `#4f6ef7` 4.28:1 | `#3f56e0` 5.80:1 | quiz links and buttons |
| `practice --text-muted` | `#94a3b8` 2.32:1 | `#5f6f85` 4.64:1 | practice meta text |
| `practice --blue` | `#3b82f6` 3.33:1 | `#2563eb` 4.77:1 | practice links |
| `practice --green` | `#22c55e` 2.28:1 | `#0f7a37` 5.44:1 | white on it |
| `pyq --text-muted` | `#8a8a8a` 3.19:1 | `#63696f` 4.79:1 | PYQ meta text |

RGB triplets (`--accent-*-rgb`) were updated with their hex, because every
`rgba(var(--accent-*), .12)` tint would otherwise keep the old hue.

The dark palette gained `--accent-primary-text-dark` (`#a5a6ff`, 8.58:1) for
accent *text* on the dark canvas while filled buttons keep the darker solid,
which is what makes white-on-accent pass in both themes.

**Not measured here:** rendered contrast after compositing (gradients, glass
blur, overlays), which needs a browser. See
[`phases/07-inclusion-trust/record.md`](phases/07-inclusion-trust/record.md).

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
