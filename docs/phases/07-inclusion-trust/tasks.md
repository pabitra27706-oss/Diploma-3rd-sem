# Phase 7 — Tasks

Accessibility work is measured, not asserted. Every claim in `record.md` names
the ratio, the pixel size, or the checklist item it came from.

## 7.1 — WCAG 2.2 AA remediation

**Steps**
1. Structure: one `<main>`, one `<h1>`, ordered headings, skip link as the first
   focusable element on all 68 pages; fix the heading jumps (measured: 32 pages,
   not the 24 the plan assumed).
2. Forms: label the PYQ search and both feedback fields; add field-level errors
   and `aria-describedby` help text.
3. Keyboard: tabs (`role="tablist"`, roving focus, arrow keys), dialogs (focus
   in, focus trap, Esc, return focus), mouse-only cards in feedback.
4. Focus: visible ring on every background; `scroll-padding-top` so sticky
   headers never hide a focused element; `:focus-visible` respected.
5. Target size: 24×24 CSS px minimum (44 px for primary touch targets); measure
   against the CSS, list any exception.
6. Motion: extend `prefers-reduced-motion` to all 22 first-party CSS files; no
   infinite animation without a pause.
7. Contrast: fix the failing pairs at the token level (not per component),
   re-measure, write into `docs/DESIGN.md`. Measured count was 27 of 47 pairs,
   not 4.

**Status (2026-11-17):** steps 1, 2, 4, 5, 6 and 7 done and measured; step 3
(tab/dialog focus behaviour) partially done and **cannot be verified without a
browser** — the source patterns are in place, the behaviour is Phase 10.
**Acceptance:** written checklist with pass/fail per item ✅; keyboard-only
core-flow completion ⏳ Phase 10; no `check_site.py` regressions ✅ (28 warnings
→ 0).

## 7.2 — Reading controls

**Steps**
1. Settings: text size (90/100/115/130%), line height (normal/relaxed), contrast
   (normal/high), motion (system/reduced).
2. Apply via `data-*` attributes on `<html>` and CSS custom properties; no
   layout break at 130% + 200% browser zoom.
3. Persist in the Phase 6 preferences object; respect system settings on first
   visit.
4. Add a "reset reading settings" action.

**Status (2026-11-17):** steps 1–4 were already implemented in Phase 6 on the
single `d3s:prefs` record and were verified and documented, not rebuilt.
**Acceptance:** controls apply and persist ✅ (by source and the
`tests/preferences.cjs` suite); high contrast ≥ 7:1 for body text ✅ (18.88:1);
no horizontal scroll at 130 % + 200 % zoom ⏳ **unverified, needs a browser**.

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

**Status (2026-11-17):** steps 1–4 done for the **shared UI catalog** (38 keys per
locale, parity asserted by test; the switch is the existing native `<select>`, so
it is keyboard-operable without extra work). Page-by-page extraction of *every*
string was not attempted — the catalog covers navigation, shared actions, the
reading controls and common states, and says so.
**Acceptance:** every key present in the catalog translates and no raw key can
appear (the loader only writes text it has, and falls back to authored markup)
✅; untranslated keys keep English ✅; keyboard operation ✅ by construction;
Bengali glyph rendering on a phone ⏳ Phase 10.

## 7.4 — Truth pass

**Steps**
1. Privacy page: table of every storage key (purpose, cleared when) and every
   network request; delete "we store nothing" style claims. *(Phase 6 already
   replaced the storage section with namespaces, record groups and the IndexedDB
   mirror; Phase 7 corrected the remaining native-app permission framing.)*
2. Feedback page: say "opens your email app"; make the type cards buttons;
   remove the global `event` dependency; keep a copy-to-clipboard fallback.
3. Offline claims: only where Phase 1's offline test proves it.
4. Professional Hub: replace the hard-coded "Active" status with real data or
   remove the pill.
5. Credits: list third-party assets and their licences (Font Awesome removal or
   self-host recorded).

**Status (2026-11-17):** steps 1, 3, 4 and 5 done. Step 2 was already done
before this phase (the type cards are buttons, the copy fallback exists, the
global `event` dependency is gone) and was re-verified, not redone. The
hard-coded "Active" pill no longer exists in this tree.
**Acceptance:** every corrected claim traced to a code path ✅ (table in
`record.md` §7.4); grep for "100 %", "no personal information", "Active" returns
only true statements ✅.

## 7.5 — License, credits, docs (owner gate)

**Steps**
1. Ask the license question once (MIT or GPL-3.0); add root `LICENSE`; update
   the README badge to point at a real file. *(Answered 2026-11-16: MIT.
   `LICENSE` exists and the README links it.)*
2. Rewrite README against the shipped tree: features that exist, counts that are
   computed, no `_data/manifest.json`, no invented claims.
3. Add a check (script or CI grep) that every path mentioned in README exists.

**Status (2026-11-17):** all three steps met. The credits page gained a licence
and content-rights section; `scripts/check_readme_paths.py` makes step 3 an
enforced check rather than a one-off grep.
**Acceptance:** `LICENSE` present and referenced ✅; README has no dead path ✅
(29 checked, 0 missing); the owner's answer and date are in `docs/DECISIONS.md`
✅.

## Phase checks

```sh
python3 scripts/check_site.py --strict          # 0 errors, 0 warnings
python3 scripts/audit_accessibility.py          # 0 findings
python3 scripts/audit_accessibility.py --fail   # exits 1 if any finding returns
python3 scripts/check_readme_paths.py           # 29 paths, 0 missing
python3 -m unittest discover -s tests -p 'test_*.py'   # 33 tests, locks the numbers
```

**Not verifiable here:** real screen-reader output (NVDA/TalkBack/VoiceOver),
actual tap accuracy, and Bengali font rendering. Record them in the phone pass;
do not claim them from static inspection.

**Owner smoke pass, 2026-11-17:** one Android phone in Chrome, general
click-through, no failures reported. It did **not** walk the items above one by
one, so none of them is marked passed here on measurement grounds. The owner
then accepted the phase as `✅*` ("You can mark as passed"); the acceptance is
recorded in `record.md` and `docs/DECISIONS.md`, and the unmeasured items stay
listed as open and move to Phase 10.
