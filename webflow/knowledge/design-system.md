# Design system — tokens before screens

> On the web the reference and the product are the same material, so there is no
> "design it on the web, rebuild it in Compose" step to absorb drift. Drift
> happens anyway — nineteen stylesheets, three theme keys, five button shapes —
> unless one token file is frozen before pages are styled and every page is
> checked against it.

## 1. When it happens

- **Plan chat:** name the direction in one line and list every screen + state
  in `docs/DESIGN.md`. Choose no colours yet.
- **Phase 0:** write the token file, the component inventory, and the shell
  page. **Freeze** the values in `docs/DESIGN.md` with measured contrast.
- **Every later phase:** uses frozen tokens. A new value is a design change:
  propose it, add it to the token file, record it in `DESIGN.md`, then use it.

## 2. The token set (minimum, per theme)

| Group | Tokens | Notes |
|---|---|---|
| Colour | `--bg`, `--surface`, `--surface-alt`, `--border`, `--text`, `--text-muted`, `--primary`, `--primary-contrast`, `--success`, `--warning`, `--danger`, `--focus-ring` | Each text/background pair gets a measured ratio |
| Type | `--font-body`, `--font-heading`, `--font-mono`, `--text-xs…--text-3xl`, `--leading-*` | Fluid sizes with a floor; no font below 14px for body |
| Space | `--space-1…--space-8` on a 4px grid | Components use tokens, never raw px |
| Shape | `--radius-sm/md/lg/full`, `--shadow-1/2`, `--border-width` | One elevation language |
| Motion | `--ease`, `--duration-fast/base` (≤ 200 ms) | All motion behind `prefers-reduced-motion` |
| Layout | `--container`, `--gutter`, `--header-h` | One container width per breakpoint set |

Both themes are generated from the same token names: `[data-theme="dark"]`
redeclares values, nothing else. No page may hard-code a hex value.

## 3. Contrast, measured

Write the ratio next to the token pair. Minimums: **4.5:1** body text, **3:1**
large text (≥ 24px or ≥ 19px bold) and UI boundaries/icons, **3:1** for the
focus indicator against its surroundings.

Measure from the actual hex values (a 20-line script or a contrast tool), and
record the number — "looks fine" is not a measurement. Known trap: a muted grey
that reads comfortably on a bright monitor at 2.5:1 fails everyone else.

## 4. Component inventory (the build checklist)

For each: variants, states, token roles, keyboard behaviour, and an accessible
name rule.

- [ ] Page shell: header, nav, breadcrumb, `<main>`, footer, skip link
- [ ] Buttons: primary, secondary, ghost, destructive, icon-only
- [ ] Links and inline link-in-text
- [ ] Cards: content, metric, action
- [ ] Lists and list rows with secondary text
- [ ] Forms: input, select, textarea, checkbox, radio, field error, help text
- [ ] Badges/chips (counts, difficulty, status)
- [ ] Tabs (roving focus, `role="tablist"`, `aria-selected`)
- [ ] Dialog (focus in/out, Esc, scroll lock, `aria-modal`)
- [ ] Toast/inline alert (with a live-region policy)
- [ ] Progress bar / ring (with a text equivalent)
- [ ] Table (dense, sortable, sticky header)
- [ ] Empty, loading, error, offline states
- [ ] Print stylesheet for anything a student might print

## 5. Rules that keep it coherent

- One icon set, one stroke style, one size scale. Icons are decorative
  (`aria-hidden`) unless they are the only content of a control.
- One focus style, globally: a 2–3px ring with a 2px offset, visible on every
  background.
- One spacing rhythm; if a section needs an exception, the exception is a token.
- One motion vocabulary: fade/slide under 200 ms, no layout-shifting animation,
  no parallax on a phone.
- One button hierarchy per screen: many primaries = no primary.
- Theme switching must not flash the wrong colour: an inline pre-paint script
  sets the attribute from the stored preference before first paint.
- Print: hide navigation, show URLs for external links, avoid dark backgrounds.

## 6. Approval and freeze record

In `docs/DESIGN.md`:

- direction (one line) + date chosen;
- screen/state table with status (📋 planned · 🚧 built · ✅ approved);
- the frozen token table with contrast ratios;
- deliberate adaptations and their dates;
- screenshot comparison per UI phase: reference intent vs shipped page, and
  every difference either fixed or recorded.

A frozen token changed without a `DESIGN.md` line is drift, and drift is a bug.

## 7. Definition of done (design step)

Tokens written and frozen in one file · contrast measured and recorded ·
component inventory complete for the pages in this phase · states listed ·
owner approval of the direction recorded with date · **then** pages are
styled.
