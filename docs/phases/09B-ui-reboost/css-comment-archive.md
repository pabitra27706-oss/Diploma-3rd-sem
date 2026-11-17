# Archived CSS comments

Comments removed from shared sheets to offset uncompressed CSS growth; declarations were unchanged.

## assets/css/base.css

```css
/* ================================
   Global base sheet — Phase 9.2 consolidation
   ================================
   One request per page instead of three. These three sheets were already loaded
   on every shipped page, so merging them removes two requests from every view
   without changing a byte of their rules. Order inside this file is the order the
   browser used to apply them: safeguards, then print, then the install panel.

   Sections:
     1. Accessibility safeguards and preference overrides (Phase 7)
     2. Print sheet (Phase 8.3) — answers on a new page, no fake running header
     3. Install / update panel (Phase 1)
   ================================ */
```

```css
/* ── 1. Accessibility safeguards (assets/css/accessibility.css) ── */
```

```css
/* Shared implementation safeguards; not a claim of audited WCAG conformance.
   Colours are declared as tokens so scripts/audit_accessibility.py can measure
   them instead of hoping a literal is right. */
```

```css
/* ── 2. Print sheet (assets/css/print.css) ── */
```

```css
/* Print rules — Phase 8.3.
   Loaded by every shipped page (scripts/generate_presence.py injects the link),
   so a printed unit, paper, answer key or sheet is black on white with no
   navigation. The page's own <h1> is the printed header: a browser @page
   running header (margin box) is not available in Chrome, Safari or Firefox
   from a zero-build static sheet, so no fake header is drawn here. */
```

```css
/* A4/Letter margins; no forced page size so the printer keeps its default. */
```

```css
/* No dark background, no shadows, no themed surfaces. */
```

```css
/* Navigation, application chrome, controls and overlays never print.
     Page <header> containers are deliberately NOT hidden: on the unit pages the
     <h1> lives inside <header class="header">, so hiding it would print a page
     with no title. Their coloured backgrounds are flattened above instead. */
```

```css
/* External links stay honest on paper. */
```

```css
/* Code keeps its own line breaks but never overflows the sheet. */
```

```css
/* Break control: a question, a card, a table row or a figure stays whole. */
```

```css
/* Tables print their header row on each page where the engine supports it. */
```

```css
/* The provenance summary line stays visible when the details element is
     closed, so a printed answer still shows where it came from. */
```

```css
/* Reduced motion (Phase 7.1 item 6): the global rule lives in
   assets/css/accessibility.css; this file carries its own guard so a page
   cannot animate just because that sheet loaded later. */
```

```css
/* ── 3. Install / update panel (assets/css/pwa.css) ── */
```

```css
/* Reduced motion (Phase 7.1 item 6): the global rule lives in
   assets/css/accessibility.css; this file carries its own guard so a page
   cannot animate just because that sheet loaded later. */
```

## assets/css/variables.css

```css
/* ================================
   CSS Variables - Light & Dark Themes
   ================================ */
```

```css
/* Palette: hex colours live here; area-specific aliases stay local.
   The token checker enforces this palette and the Phase 9B alpha ledger. */
```

```css
/* Neutrals */
```

```css
/* Cool */
```

```css
/* Green */
```

```css
/* Warm */
```

```css
/* One-off legacy values kept verbatim (named by hex) */
```

```css
/* White overlay, used in the home welcome and focus surfaces. */
```

```css
/* ── Accent Colors ── */
```

```css
/* 4.5:1+ as text and behind white (was #6366f1, 4.47:1) */
```

```css
/* white on it: 5.70:1 (was #8b5cf6, 4.23:1) */
```

```css
/* white on it: 5.48:1 (was #10b981, 2.54:1) */
```

```css
/* white on it: 5.08:1 (was #f59e0b, 2.15:1) */
```

```css
/* white on it: 4.83:1 (was #ef4444, 3.76:1) */
```

```css
/* white on it: 5.17:1 (was #3b82f6, 3.68:1) */
```

```css
/* ── Accent RGB (for rgba() usage) ── */
```

```css
/* ── Light Theme Colors ── */
```

```css
/* ── Light Theme RGB (for rgba() usage) ── */
```

```css
/* 5.12:1 on white, 4.90:1 on bg-secondary (was #94a3b8, 2.56:1) */
```

```css
/* ── Dark Theme Colors ── */
```

```css
/* ── Dark Theme RGB (for rgba() usage) ── */
```

```css
/* ── Typography ── */
```

```css
/* ── Spacing ── */
```

```css
/* ── Border Radius ── */
```

```css
/* ── Transitions ── */
```

```css
/* ── Z-index Layers ── */
```

```css
/* ── Layout ── */
```

```css
/* ── Subject Colors ── */
```

```css
/* ── Subject RGB (for rgba() usage) ── */
```

```css
/* ── Toast Notification ── */
```

```css
/* ── Streak Colors ── */
```

```css
/* ── Skeleton Loading ── */
```

```css
/* ── Focus Ring (Accessibility) ── */
```

```css
/* The solid colour is what a keyboard user sees at the ring's edge; the
     translucent halo is decoration and is not relied on for 1.4.11. */
```

```css
/* 6.32:1 on white, 6.04:1 on bg-secondary */
```

```css
/* ── Today Focus Card ── */
```

```css
/* ================================
   Theme Application
   ================================ */
```

```css
/* Toast light overrides — already readable, keep as-is */
```

```css
/* Toast dark overrides */
```

```css
/* Accent text on the dark canvas; filled buttons keep --accent-primary. */
```

```css
/* 8.58:1 on #0f0f1e */
```

```css
/* 6.97:1 on #0f0f1e */
```

```css
/* The light ring is too close to the dark canvas (3.0:1); the dark ring is
     not a tint of it, it is the same role in the other palette. */
```

```css
/* 9.51:1 on #0f0f1e */
```

```css
/* Skeleton dark */
```
