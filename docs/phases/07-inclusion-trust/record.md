# Phase 7 — Engineering record

- Status: **🚧 parts 7.1, 7.2, 7.3, 7.4 and 7.5 implemented and gate-verified**
  on `arena/c56bb630-diploma-3rd-sem` (2026-11-17). **Not merged.** An owner
  smoke pass on one Android phone in Chrome reported no failures on 2026-11-17;
  that pass was explicitly **not** a per-criterion audit, so it does not close
  the items below and does not upgrade this phase to `✅*`. ·
  Updated: 2026-11-17
- Branch base: `main` @ `5b7eb663799614a826231f668920f8d597793943` (PR #14, Phase 6)
- Reuse: ADAPT `assets/js/storage.js` (the single preference record),
  `assets/js/accessibility.js`, `assets/css/accessibility.css`,
  `assets/js/i18n.js` and the `data-i18n` catalog; BUILD
  `scripts/audit_accessibility.py`, `tests/test_accessibility_audit.py`,
  `scripts/check_readme_paths.py`, the widened en/bn catalog and the token-level
  contrast fixes. Zero npm runtime dependencies, zero network calls, zero edits
  to `_data/<subject>/*.json`, `_quiz-data/*` or `pyq-integrity.json`.

**This is not a WCAG conformance assertion.** It records what was measured from
source and what only a browser or a device can prove. Rendered contrast after
compositing, zoom/reflow, real screen-reader output, tap accuracy and Bengali
glyph rendering stay unverified here and are Phase 10 work.

## Re-measurement first — the phase README's evidence table was stale

The table in [`README.md`](README.md) was written before Phases 4–6 shipped. It
claimed 55 pages, 55 without a skip link, 36 without a `<main>`, 36 without a
meta description and a missing `LICENSE`. Measured on this tree **before** any
Phase 7 edit (`python3 scripts/audit_accessibility.py`):

| Claim in the old table | Old number | Measured 2026-11-17 (before) |
|---|---|---|
| Shipped HTML pages | 55 | **68** |
| Pages with no skip link | 55 / 55 | **11** |
| Pages with no `<main>` landmark | 36 / 55 | **11** |
| Pages with no meta description | 36 / 55 | **0** (all 68; `generate_presence.py` adds them) |
| `LICENSE` | missing | **exists** (MIT, chosen 2026-11-16) |
| Unit pages with heading-order jumps | 24 / 24 | **32 pages / 134 jumps** (24 unit + 5 subject hubs + 3 info) |
| Unlabelled controls | search + 2 feedback fields | **1** (`pyq/answers.html` search only) |
| Contrast below requirement | 4 pairs | **27 of 47 measured token pairs** |
| Reduced-motion coverage | 7 of 22 first-party CSS files | **21 of 22** (the 22nd animates nothing) |
| `data-i18n` strings / Bengali UI | 0 | **5 keys, settings page only** |
| Duplicate ids / images without alt | — | **0 / 0** (already clean) |

Two findings that were not in the old table at all, and that the numbers above
forced into view:

- **Heading order was worse than "24 unit pages".** The 24 unit pages carried
  ~780 `<h4>` card labels (`<h4>Q 1</h4>` and similar) with **no `<h3>`
  between them and their `<h2>`**, so screen-reader heading navigation walked
  hundreds of decorative labels.
- **Some "structure" debt was invisible to `check_site.py`.** `check_site.py`
  only counts `<main>`/skip/`<h1>`, so the 134 jumps and the second `<h1>` on
  `index.html` (inside the welcome dialog) had never been counted.

## Measured after — the numbers this phase is accountable for

Produced by `python3 scripts/audit_accessibility.py` and locked in
[`audit-baseline.json`](audit-baseline.json) plus `tests/test_accessibility_audit.py`:

| Measure | Before | After |
|---|---|---|
| Shipped pages measured | 68 | 68 |
| Pages without `<main>` | 11 | **0** |
| Pages without a skip link | 11 | **0** |
| Pages with `<h1>` count ≠ 1 | 3 (`index.html` 2, `practice/session.html` 0, `pyq/viewer.html` 0) | **0** |
| Heading-order jumps | 134 across 32 pages | **0** |
| Controls without a label | 1 | **0** |
| Duplicate ids | 0 | **0** |
| Contrast pairs below requirement | 27 of 47 | **0 of 47** |
| First-party CSS files with a reduced-motion rule | 7 of 22 | **21 of 22** (the 22nd, `print.css`, has no animation) |
| Pages loading the global `data-motion` override | 68 | 68 |
| Control rules pinned below 24×24 CSS px | not measured before (the old check only matched icon glyphs) | **0** |
| `check_site.py --strict` | 0 errors / 28 warnings | **0 errors / 0 warnings** |
| `audit_accessibility.py` total findings | 187 | **0** |

## 7.1 — WCAG 2.2 AA remediation

### Structure

- **`<main>` and skip link on every page.** The nine `info/*` pages and
  `offline.html` had a `div.professional-container` / `div.offline-container`
  wrapper; each became `<main id="study-main-content">` with a skip link as the
  first focusable element. `pyq/viewer.html` wrapped its paper in `<main>`.
  All 11 keep their existing class, so layout is unchanged.
- **One `<h1>` per page.** `index.html` had a second `<h1 class="welcome-title">`
  inside the full-screen welcome **dialog**; it is a dialog title, not the page
  title, and is now `<p class="welcome-title">` with the same class and styling.
  `practice/session.html` gained a visually hidden `<h1 class="sr-only">`, and
  `pyq/viewer.html`'s `div.paper-subject` (the only real title on that page)
  became the `<h1>` that `viewer.js` already fills.
- **Heading order.** 933 decorative `<h4>` card/sub-item labels across the 33
  subject pages and 36 across the info pages became
  `<p class="card-title">`, keeping every original attribute (`style`, `id`,
  `class`) byte-for-byte and picking up the `<h4>` typography through one new
  class rule. The `info/terms-conditions.html` numbered clauses are genuine
  page sections and became `<h2>` instead. The subject-hub "Quick Question"
  widget header, the professional-hub "Developer Information" card title,
  `info/about.html`'s four feature titles and `terms`' "Quick Summary" / "Questions?"
  labels were the same problem and are handled the same way.
- **Navigation chrome was left alone deliberately.** The mobile drawer's
  `<h3>` and the nav brand stay headings: `scripts/build_search_index.py`
  already excludes drawer chrome and `tests/test_discovery.py` asserts that
  count (`unitDrawerChromeExcluded == 24`). Removing them would have required
  loosening an existing assertion, which this phase does not do.

### Forms

- `pyq/answers.html` search input: added a visually hidden `<label for>` plus an
  `aria-describedby` help line (`.sr-only` utility added to `pyq/css/answers.css`,
  which had none). The old design relied on a placeholder, which is not a label.
- `settings.html`: the "Also import preferences" checkbox was inside a wrapping
  `<label>`; it now has an explicit `for`/`id` pair, which is unambiguous for AT.
- `info/contact-support.html`: the Telegram link opened a new tab without
  `rel="noopener"`; it now carries `rel="noopener noreferrer"`.
- Both feedback fields already had `<label for>` and `aria-describedby` plus
  field-level errors from an earlier pass; re-verified, no change needed.

### Focus, target size, motion

- **Focus ring** is now a solid token (`--focus-ring-solid`) instead of a 40 %
  alpha halo that measured 2.2:1 on white — below the 3:1 that SC 1.4.11 needs
  for a focus indicator. Light `#4a4fd0` (6.32:1), dark `#a5a6ff` (8.58:1).
  `:focus-visible` in `assets/css/accessibility.css` uses it.
- **`scroll-padding-top: 6rem`** was already present in
  `assets/css/accessibility.css`; audit confirms every page loads that sheet, so
  a focused element is not hidden behind the sticky header.
- **Target size (SC 2.5.8).** The audit measures declared control boxes, not
  glyphs: icon *glyphs* may be 14–20 px, the buttons that receive the pointer may
  not be under 24×24. No control rule pins a dimension below 24 px. The
  previously smallest real controls (`sel-pill-remove`, `chip-remove`,
  `bookmark-remove-btn`, `drawer-close`, `mobile-menu-btn`, `print-close-btn`)
  are 28–40 px.
- **Motion.** Seven of twenty-two first-party stylesheets had a reduced-motion
  rule. The seven animating sheets that lacked one (`main.css`,
  `practice/index.css`, `practice/session.css`, `pyq/answers.css`,
  `quiz/index.css`, `quiz/review.css`, `quiz/setup.css`) now carry a per-file
  guard, and the non-animating sheets carry the same guard for future edits. The
  user-preference override (`html[data-motion="reduced"]`) and the global
  `@media (prefers-reduced-motion: reduce)` rule in `accessibility.css` were
  already on all 68 pages and remain the primary mechanism.

### Contrast — fixed at the token level

Authoritative table with the before/after ratios and the reason for each value:
[`docs/DESIGN.md`](../DESIGN.md#measured-contrast-static-computation-not-rendered).
Summary: 27 failing pairs → 0, by changing 14 tokens in
`assets/css/variables.css`, `quiz/css/common.css`, `practice/css/index.css`,
`practice/css/session.css` and `pyq/css/answers.css`, including the matching
`--accent-*-rgb` triplets so `rgba()` tints did not keep the old hue. No
component-level colour was overridden; no palette identity was changed beyond
the lightness needed to pass.

**How the measurement works** (`scripts/audit_accessibility.py`): it parses the
real stylesheets, tracks `@media` blocks, resolves `var(--alias)` chains, and
applies the cascade the browser applies — `[data-theme="light"]` when a file has
one, otherwise the unconditional `:root`, and for dark the `:root` declarations
with `[data-theme="dark"]` layered on top. It then computes WCAG relative
luminance per pair. It refuses to silently skip a pair: an unresolved token is
reported as a failure, not a pass.

## 7.2 — Reading controls

Already implemented in Phase 6 on the single `d3s:prefs` record; this phase
verified and documented rather than rebuilt:

| Control | Values | Applied how | Persisted where |
|---|---|---|---|
| Text size | 90 / 100 / 115 / 130 % | `document.documentElement.style.fontSize` | `d3s:prefs.fontScale` |
| Line height | normal / relaxed | `--reading-line-height` custom property | `d3s:prefs.lineHeight` |
| Contrast | normal / high | `html[data-contrast="high"]` | `d3s:prefs.contrast` |
| Motion | system / reduced | `html[data-motion="reduced"]` | `d3s:prefs.reduceMotion` |
| Language | en / bn | `html[lang]`, `[data-i18n]` text | `d3s:prefs.lang` |
| Theme | system / light / dark | `html[data-theme]` before first paint | `d3s:prefs.theme` |

- One pre-paint snippet only: `assets/js/storage.js` is loaded synchronously in
  `<head>` before any stylesheet and calls `applyPreferences()` at evaluation.
  No second theme key, no second inline script.
- "Reset reading settings" restores `fontScale:100, lineHeight:'normal',
  contrast:'normal', reduceMotion:'system'` and leaves the theme alone.
- High contrast reaches a 18.88:1 body ratio (`#111` on `#fff`, forced in
  `accessibility.css`), which exceeds the 7:1 target for normal text.
- **Not verified here:** that the longest unit page is usable at 130 % text plus
  200 % browser zoom without horizontal scrolling. That needs a browser; it is
  Phase 10.

## 7.3 — Language layer

- `assets/i18n/en.json` and `assets/i18n/bn.json` now hold **38 keys each with
  identical key sets** (was 5 keys, settings labels only): navigation, shared
  actions, every reading control and its option labels, and common states.
  `tests/test_accessibility_audit.py` asserts key parity and that every
  `data-i18n` key used in any shipped page exists in the catalog.
- `assets/js/i18n.js` is a small loader, not an i18n framework: it fetches the
  catalog for the active language, writes `textContent` for `[data-i18n]`
  elements, sets `<html lang>`, and marks translated elements with their own
  `lang`. Untranslated elements fall back to their authored English markup, so a
  missing key can never surface a raw key. It exposes `StudyI18n.setLanguage()`,
  which persists through `StudyStorage.setPrefs({lang})` — no second storage key.
- It now loads on all 68 pages through the shared head block in
  `scripts/generate_presence.py`, and is precached by the worker
  (`assets/js/i18n.js`, `assets/i18n/en.json`, `assets/i18n/bn.json`).
- The switch is the existing native `<select id="pref-lang">` in Settings,
  keyboard-operable by default.
- **Content is never translated.** Question text, options, model answers and unit
  prose stay in their authored English, and the page says so in both languages.
  **Not verified here:** Bengali conjunct rendering on a real phone — the system
  font stack may substitute glyphs. Phase 10.

## 7.4 — Truth pass

Claims corrected because the code does not support them:

| Where | Claim before | Now |
|---|---|---|
| `info/privacy-policy.html` | "The app requires minimal permissions" + install-style permission cards | States it is a **web app with no install-time permissions**; the browser prompts only for the optional features described |
| `info/privacy-policy.html` | internet "required only to download materials initially; all data stays on your device" | says a first visit needs a connection, that the worker serves previously loaded pages offline, and that the browser may evict the cache |
| `info/privacy-policy.html` | storage access "required to save study materials; no personal files accessed" | says records and cached pages live in this site's own browser storage and clearing site data removes them |
| `info/usage-guide.html` | "**All subjects are available offline** once loaded for the first time" | says only visited/opened material is cached, that a study page warms search and card data, that eviction is possible, and that a first visit needs a connection |
| `info/about.html` | "an educational **Android application**" | an installable **web app (a PWA served from GitHub Pages)** |
| `README.md` | "**IndexedDB migration is not implemented**" (true before Phase 6) | IndexedDB is a **recovery mirror**, not the primary store, with the synchronous-API reason stated |

The privacy page already carried the honest storage-boundary section written in
Phase 6 (key namespaces, record groups, the IndexedDB mirror, the restore journal,
"estimates include caches"); it was re-read against `assets/js/storage.js` and
found accurate, so it was not rewritten.

The professional hub's hard-coded "Active" pill the task list mentions no longer
exists in this tree (it was removed before Phase 7); `data-build-version` now
prints the real generated `app-build` value. The feedback page already states
that it opens an email app, keeps a copy fallback and promises no review time;
re-verified.

## 7.5 — Licence, credits, docs

- **`LICENSE` exists** (MIT, owner decision 2026-11-16). The credits page now has
  a **Licence and content rights** section: what MIT covers (project code and
  authored notes), that third-party exam-source material is **not** relicensed
  and its rights are unresolved, that model answers are not certified, and how to
  request removal.
- Font Awesome is credited accurately (self-hosted from `assets/vendor/`, icons
  CC BY 4.0 / fonts SIL OFL 1.1 / code MIT) instead of "for beautiful icons".
  The Sketchware Pro credit now says the project ships as a web app and does not
  depend on it.
- `scripts/check_readme_paths.py` enforces that every link target and inline path
  the README names resolves; it currently checks 29 paths with 0 missing. This
  is the "add a check that every path quoted in it exists" item.
- README updated for the licence, the accessibility measurement and honest
  IndexedDB wording. It still documents only what the tree contains.

## Gates run (2026-11-17)

| Gate | Result |
|---|---|
| `grep -rn "localStorage" --include='*.js' --include='*.html' . \| grep -v storage.js` | no API calls; comments, one status string, one privacy-policy sentence |
| `python3 scripts/audit_accessibility.py` | **0 findings** (see the after-table) |
| `python3 scripts/check_site.py --strict --quiet` | **0 errors, 0 warnings** (was 0 / 28) |
| `python3 scripts/check_platform.py` | 0 errors |
| `python3 scripts/check_readme_paths.py` | 29 paths, 0 missing |
| `python3 scripts/validate_pyq.py` | PASS, 28 papers / 924 questions |
| `python3 scripts/check_pyq_integrity.py` | 0 changed/added/missing |
| `python3 scripts/validate_data.py --check-baseline` | matches the ledger (not a strict pass) |
| `python3 -m unittest discover -s tests -p 'test_*.py'` | **33 tests OK** (22 before; 11 new accessibility locks) |
| Node suites | attempt-store, data-pipeline-consumers, discovery-dom, preferences, quiz-engine-dom, section-notes, storage, storage-mirror, storage-recovery, study-dom, study-offline, study-store, theme-skew — **PASS** |
| Hosted Web CI on the branch | **run `44038834236` — success** on `1e878fb` (all 13 steps, including the new *Measured accessibility gate* and *Documentation paths resolve* steps); the earlier `44038689193` on `ac45a76` also passed |

Not run here: `tests/paper-offline.cjs`, `tests/cards-offline.cjs` and the
`tests/*-browser.cjs` suites, which need Playwright/Chromium that this
environment does not have. `validate_data.py --strict` and
`validate_syllabus.py --strict` keep their recorded source-review findings
(9 data + 3 grouped syllabus).

Derived outputs were regenerated in README order
(`build_runtime_bundles` → `generate_presence` ×2 → `build_search_index` →
`check_pyq_integrity`). Search now reports **2,424 entries / 89 page rows**
(was 2,410 / 86) because the credits, privacy and usage-guide pages gained
sections; all shards stay inside their byte budget (largest 37.0% of source
bytes). Worker `VERSION` moved to `study-2026-11-17c`
because runtime files and the shared head block changed.

## Owner smoke pass — 2026-11-17

Owner report: **"All devices test passed"**, clarified as a **smoke pass on one
Android phone in Chrome**: clicking through the app end to end, with nothing
reported as failing or visually wrong.

What that does and does not mean here:

- **Does**: the shipped branch loads and runs on real Android hardware in Chrome
  without a functional break or an obvious visual regression. That is the first
  hardware evidence for this branch and it is recorded in
  [`phases/10-device-acceptance/matrix.md`](../10-device-acceptance/matrix.md)
  as one partial row, not as a cleared matrix.
- **Does not**: it was not a criterion-by-criterion pass, so it does not verify
  the specific Phase 7 claims that need measurement — rendered contrast in both
  themes, 200 % zoom / 320 CSS px reflow, the Bengali catalog and conjunct
  rendering, keyboard and skip-link traversal, focus after dialogs, tap accuracy
  against the 24 px floor, or screen-reader output. Those stay open below and in
  Phase 10.
- **Not inferred**: no merge was authorized in that message, so the branch stays
  unmerged and no PR was opened. No Pages, tag or release action was taken.

## Left open (not closed by this phase)

- **No WCAG conformance claim.** Measured source-level criteria are listed above;
  every criterion that needs rendering, assistive technology or a device is
  untouched. The 2026-11-17 Android/Chrome smoke pass showed the branch runs on
  hardware but did not measure any of them.
- **Rendered contrast** after compositing (gradients, glass blur, hero overlays)
  is not measured. The token pairs pass; a component sitting on a gradient was
  not sampled.
- **Zoom/reflow at 200 %**, focus-obscured behaviour with the sticky header at
  small viewport heights, dialog focus trap in a real browser, and the tab-list
  APG pattern need Chromium/Playwright.
- **Screen-reader output** (NVDA, TalkBack, VoiceOver), real tap accuracy,
  Bengali conjunct rendering and keyboard-only completion of
  search → question → quiz → result → export are all Phase 10.
- **Translating content** remains out of scope by design.
- The 9 data + 3 syllabus source findings and answer certification are
  untouched; nothing here certifies an answer.
