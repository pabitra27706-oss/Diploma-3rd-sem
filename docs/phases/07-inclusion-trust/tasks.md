# Phase 7 — Tasks

Accessibility work is measured, not asserted. Every claim in `record.md` names
the ratio, the pixel size, or the checklist item it came from.

## 7.1 — WCAG 2.2 AA remediation

**Steps**
1. Structure: one `<main>`, one `<h1>`, ordered headings, skip link as the first
   focusable element on all 55 pages; fix the 24 unit pages' heading jumps.
2. Forms: label the PYQ search and both feedback fields; add field-level errors
   and `aria-describedby` help text.
3. Keyboard: tabs (`role="tablist"`, roving focus, arrow keys), dialogs (focus
   in, focus trap, Esc, return focus), mouse-only cards in feedback.
4. Focus: visible ring on every background; `scroll-padding-top` so sticky
   headers never hide a focused element; `:focus-visible` respected.
5. Target size: 24×24 CSS px minimum (44 px for primary touch targets); measure
   against the CSS, list any exception.
6. Motion: extend `prefers-reduced-motion` to all 19 CSS files; no infinite
   animation without a pause.
7. Contrast: fix the four failing pairs at the token level (not per component),
   re-measure, write into `docs/DESIGN.md`.

**Acceptance:** a written checklist covering each item with pass/fail and
evidence; keyboard-only core-flow completion; no new a11y regressions from
`check_site.py`.

## 7.2 — Reading controls

**Steps**
1. Settings: text size (90/100/115/130%), line height (normal/relaxed), contrast
   (normal/high), motion (system/reduced).
2. Apply via `data-*` attributes on `<html>` and CSS custom properties; no
   layout break at 130% + 200% browser zoom.
3. Persist in the Phase 6 preferences object; respect system settings on first
   visit.
4. Add a "reset reading settings" action.

**Acceptance:** each control changes the page immediately and survives reload;
high contrast reaches ≥ 7:1 for body text; the longest unit page is usable at the
largest setting without horizontal scroll.

## 7.3 — Language layer

**Steps**
1. Add `assets/i18n/en.json` and `assets/i18n/bn.json`; move UI strings out of
   markup into `data-i18n` keys, page by page (start: nav, buttons, states,
   quiz, practice, info pages).
2. Implement a tiny loader: fetch catalog for the active language, apply to
   `[data-i18n]`, set `document.documentElement.lang` and `dir`.
3. Language switch in the header/settings; persist; default from
   `navigator.language` with English fallback.
4. Never translate question content in this phase; add a visible note that
   content stays in English.

**Acceptance:** switching to Bengali translates all keys present in the catalog,
with no missing-key raw `data-i18n` strings visible; untranslated keys fall back
to English; the switch is keyboard-operable.

## 7.4 — Truth pass

**Steps**
1. Privacy page: table of every storage key (purpose, cleared when) and every
   network request; delete "we store nothing" style claims.
2. Feedback page: say "opens your email app"; make the type cards buttons;
   remove the global `event` dependency; keep a copy-to-clipboard fallback.
3. Offline claims: only where Phase 1's offline test proves it.
4. Professional Hub: replace the hard-coded "Active" status with real data or
   remove the pill.
5. Credits: list third-party assets and their licences (Font Awesome removal or
   self-host recorded).

**Acceptance:** every claim in the record is traced to a code path or a test;
grep for "100%", "no personal information", "recorded", "Active" returns only
true statements.

## 7.5 — License, credits, docs (owner gate)

**Steps**
1. Ask the license question once (MIT or GPL-3.0); add root `LICENSE`; update
   the README badge to point at a real file.
2. Rewrite README against the shipped tree: features that exist, counts that are
   computed, no `_data/manifest.json`, no invented claims.
3. Add a check (script or CI grep) that every path mentioned in README exists.

**Acceptance:** `LICENSE` present and referenced; README contains no dead path;
the owner's answer is recorded in `docs/DECISIONS.md` with a date.

## Phase checks

```sh
python3 scripts/check_site.py --strict
grep -rn "data-i18n" --include='*.html' | wc -l
# contrast: measured per token pair, values pasted into docs/DESIGN.md
```

**Not verifiable here:** real screen-reader output (NVDA/TalkBack/VoiceOver),
actual tap accuracy, and Bengali font rendering. Record them in the phone pass;
do not claim them from static inspection.
