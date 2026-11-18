<!-- SPDX-License-Identifier: MIT -->

# Sub-phase 9C — Unit-notes reading layer (phone-first) — record

- **Status:** ✅ shipped · **Date:** 2026-11-17 ·
  **Branch:** `arena/f4b38ee3-diploma-3rd-sem`
- **Commit:** `9c509f5` (46 files, +1446 / −76)
- **Base:** `f0ce76d2a6d3cf2b1c6d98b3a0dcfd544bffcce3`
- **CI:** not run. `gh` calls are blocked on this branch; every gate below was
  run locally against the committed tree.
- **Preview:** none published. This session did **not** deploy, by standing
  owner rule. Screenshots were captured from a local static server.

## Parts

- 9C.1 — notes label defect (literal `#`, repeated heading) — ✅
- 9C.2 — table clipping and sticky first column — ✅
- 9C.3 — FAB occlusion — ✅
- 9C.4 — phone-first calm-editorial reading layer — ✅
- 9C.5 — "Watch & Learn" video section — ✅
- 9C.6 — subject accent on unit pages — ✅
- 9C.7 — budget fence raise, documented — ✅
- 9C.8 — owner review on a physical phone — ⛔ not done

## Reused (reuse scan for this sub-phase)

- 9C.4 — **ADAPT** — existing first-party token system (`assets/css/variables.css`,
  `subjects/units-com/common.css`). No new dependency, no external font, no
  design library. The layer is hand-written CSS keyed to tokens the site already
  ships.
- 9C.5 — **BUILD** — plain anchors and a CSS `mask` glyph. Deliberately *not* an
  embed: Phase 12 forbids `iframe`, `i.ytimg.com` and runtime third-party
  requests, and rejects unverified `watch?v=` URLs.
- 9C.1 — **BUILD** — a small `labelFor()` helper in the existing
  `assets/js/section-notes.js`. It is loaded directly by unit pages, so **no
  `build_runtime_bundles.py` run is needed** (verified: the grep for the new
  class in `shell.bundle.js` returns 0, and the page loads the file directly).

## Evidence (before the change)

- **`#` in cards** — probe of `.topic-card h3` `innerHTML` showed
  `<a class="section-anchor-link" …>#</a>` at runtime while `grep` of the HTML
  source found nothing; the emitter is `assets/js/unit-discovery.js:189`.
- **Note title** — probe returned `"My note for Unit Overview\n #"`.
- **Sticky table** — first probe: `cellLeft:-69` vs `wrapLeft:50`, `stuck:false`.
  An isolated repro (`/tmp/sticky.html`) proved `position:sticky` worked alone,
  so a real ancestor was clipping. Setting `overflow:visible` on `.section`,
  `.section-content` and the callout boxes was **not enough**. The overflow-chain
  walk found the actual culprit: `TABLE.data-table { overflow: hidden }` made the
  table itself the scroll container.
- **Accent** — computed `--accent` on a unit page was `#00c853` (global green) on
  every subject, because `body` carried no `subject-cstNNN` class. All five
  subject index pages do carry it; unit pages were the only ones missing it.

## What shipped

### 9C.1 / 9C.4 — `assets/js/section-notes.js`

`labelFor(heading)` reads only non-icon, non-anchor child nodes and strips a
trailing `#`. The title is now `'Note on ' + label`. A `compact` option adds
`.section-note--compact`. Verified: `["Note on Unit Overview", "Note on
Introduction to C & File Types", …]`.

### 9C.2 — tables

`body[data-page="unit"] .table-wrapper > table { overflow: visible }` is the
decisive rule; the `:has(.table-wrapper)` ancestors stay `overflow:visible` too.
Verified **16/16** tables report `stuck:true` for their first column.

### 9C.4 — `subjects/units-com/common.css`

108,851 B → **125,655 B**. Scoped to `body[data-page="unit"]` inside
`@media (max-width: 768px)`, plus a dark-mode block:

| Surface | Spec |
|---|---|
| container padding | .9rem |
| section card | 1.15rem radius, no shadow |
| section title | 1.16rem / 700, 3px accent bar |
| body copy | **1.0125rem / 1.78**, `text-wrap: pretty` |
| `h3` | 1.06rem |
| list markers | accentised |
| compact note | dashed 0.7rem card, pen mask icon, ≥2.75rem tap targets |
| callouts | flattened to `--bg-secondary` |
| FAB column | 2.5rem wide, `.fab-print` hidden ≤768px, lifted above the safe area |

The anchor glyph is kept as an operable deep-link control (`aria-label`
preserved) but styled to `opacity:.28` with a 1.75rem tap target, restored on
hover/focus.

### 9C.5 — "Watch & Learn"

`<section class="section" id="videos">` on **all 24 unit pages**, **72 links**
(3 per page), built as:

```html
<section class="section" id="videos">
  <h2 class="section-title">… Watch &amp; Learn …</h2>
  <div class="section-content">
    <p class="video-note">Hand-picked external videos… Not official course material.</p>
    <ul class="video-list">
      <li><a class="video-link" href="https://www.youtube.com/results?search_query=…"
             target="_blank" rel="noopener noreferrer">
        <span class="video-link-text">
          <span class="video-link-title">…</span>
          <span class="video-link-meta">… &middot; search on YouTube</span>
        </span>
      </a></li>
      …
    </ul>
  </div>
</section>
```

Topics are per-unit and per-subject (e.g. CST207 unit 2 → hardwired vs
microprogrammed control, microinstruction sequencing, Booth multiplication).

### 9C.6 — subject accent

`body.subject-cstNNN` added to all 24 unit pages. Computed `--subject-color` is
now per subject: CST201 `#ff6d00`, CST203 `#f9a825`, CST205 `#00c853`, CST207
`#6200ea`, CST209 `#2962ff`. Ten `var(--accent)` references in the new layer
were switched to `var(--subject-color)`.

### 9C.7 — budget fence

`scripts/audit_page_weight.py` `CSS_BUDGET` and `scripts/check_site.py`
`CSS_BUDGET_SINGLE` raised 300 KB → **340 KB**, with the rationale in the script
docstring. Heaviest page is now **316,817 B**, so headroom is **3.3 KB**.

Why raise rather than trim: the old ceiling left **13 bytes**; a re-measured
audit found only **~2 KB** of genuinely dead rules in the whole sheet, while
comments account for **12.2 KB** and indentation **7.3 KB**. Minifying or
stripping those is a maintainability cost, not a real weight saving, and the
earlier per-family split was already rejected (92/146 fingerprint diffs; 1,496
anchors reverted). The owner approved the raise directly: *"Not a problem if
need exceed 340kb"*.

## Checks (no-device gate)

Run on the committed tree:

| Gate | Result |
|---|---|
| `check_site.py` | pass |
| `check_tokens.py --strict` | pass — **0 findings**, 391 ratcheted `rgba()` literals |
| `audit_accessibility.py` | pass |
| `validate_pyq.py` | pass |
| `check_root_rewrite.py` | pass |
| `audit_page_weight.py --budget` | pass — heaviest 316,817 B of 348,160 B |
| `unittest discover -s tests` | **123/123 OK** |
| node suites (12 files) | pass |
| `validate_data.py --check-baseline` | pass |

Other checks:

- JS parse: pass · JSON: pass (search index + `coverage.json` regenerated).
- Links/assets: 72 new external links, **0** third-party requests until tap
  (`#videos iframe` count = 0 on every sampled page).
- Tap targets: video links **96–118 px** tall, note summary 44 px, focus ring
  **3px solid**.
- Horizontal overflow: none at 412 px, 360 px or **320 px**
  (`scrollWidth === clientWidth`).
- Search index: +5 entries per subject, 0 changed, 0 removed.
- `coverage.json`: **+1 note section and ~60–70 note words per unit** — exactly
  the video section, nothing else moved.

### Visual pass (local static server, Chromium 131)

- Phone 412×915, light and dark: `#videos` renders at 328×118 (3-line) and
  328×96 (2-line) per link.
- Phone **320×800**: two-line titles wrap without clipping; no overflow.
- Desktop 1440×900: **unchanged** — body 16 px, `.topic-grid` still 3 columns
  (`303.328px ×3`), original card shadows, `.container` 1024 px. Only the accent
  colour changed, matching the subject index pages.

**Not run / not verifiable here:**

- No physical phone. The owner's earlier Android pass
  ([`../10-device-acceptance/matrix.md`](../10-device-acceptance/matrix.md))
  predates this layer, and a phone-scaled wide screenshot is not a desktop pass
  either — this sub-phase only had Chromium at emulated widths.
- No Safari/iOS pass. `text-wrap: pretty`, `color-mix()` and `:has()` are used
  and are unsupported or partial on older iOS. How each degrades was audited
  by hand rather than assumed:
  - `:has(.table-wrapper)` — progressive enhancement only. Without it the
    ancestor stays `overflow:hidden`, and `.table-wrapper > table
    { overflow:visible }` still gives a working scroll container and sticky
    column. Nothing breaks.
  - `color-mix()` — four uses, now each carrying a real fallback on the line
    above it (the `--subject-color-light` token, `--bg-secondary`, `--card-bg`);
    only the note-summary pen icon was left without one, because a missing mask
    degrades to the text label alone.
  - `text-wrap: pretty` — ignored by unsupported engines; only line-break
    quality is lost.
  - `mask` — `-webkit-mask` is kept alongside it. In Blink the two alias each
    other, so a redundant `background-color` that the following declaration
    overrode was removed rather than left as dead code.
- No Lighthouse run.
- CI is not green-by-run; nothing was pushed to a PR-gated pipeline in this
  session.

## Design comparison (UI phase)

Compared against `docs/DESIGN.md`: one accent per page, no decorative shadow on
reading surfaces, no new font, no new colour outside the token set
(`check_tokens.py --strict` = 0 findings is the machine proof). Deliberate
exception: the anchor glyph keeps `opacity:.28`, below the usual AA text
threshold, because it is a control with an accessible name, not body text; it
returns to full opacity on hover and focus.

## Real-phone pass

Not done. This is the one open acceptance item for the sub-phase.

## Open items

- [ ] Owner review on a physical phone (primary target for this layer).
- [ ] Replace `results?search_query=` with verified `watch?v=` links when Phase
      12 content work starts — each URL must be checked live first.
- [ ] CSS headroom is 3.3 KB; the next addition needs either trimming or a
      recorded fence decision.
- [ ] Consider whether the layer should extend above 768px (tablets) once a
      device pass exists. Not done now to keep the change phone-scoped and
      reversible.

## Follow-ups

The Phase 12–16 blueprint gate ("do not start unit content until the notes UI is
robust") is **satisfied in code and gates**, but the honest status is
*satisfied pending a real-phone confirmation*. Recommend the owner open one
unit page on their phone before Phase 12 begins.

No new roadmap phase and no new decision record: the fence raise is already
documented in `scripts/audit_page_weight.py` and
`docs/LAUNCH-CHECKLIST.md`, and the video rules are unchanged from Phase 12.
