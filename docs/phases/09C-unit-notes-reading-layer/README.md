<!-- SPDX-License-Identifier: MIT -->

# Sub-phase 9C — Unit-notes reading layer (phone-first)

- **Parent:** [Phase 9 — Performance and launch](../09-performance-launch/README.md). This is
  owner-requested work that belongs to Phase 9's UI budget surface; it does not
  add a numbered part to Phase 9 and does not reopen Phases 1–10.
- **Status:** ✅ shipped in `9c509f5`; awaiting owner review on a real phone.
- **Date:** 2026-11-17 · **Branch:** `arena/f4b38ee3-diploma-3rd-sem`
- **Roadmap row:** `9C` on [`docs/ROADMAP.md`](../ROADMAP.md), following the
  `9B` precedent for owner-requested UI work that sits beside Phase 9 rather
  than inside its numbered parts. It adds no part to Phase 9.

## Goal

The unit note pages are the surface a student actually reads for an hour at a
time on a phone. Before any unit **content** phase (12–16) begins, that surface
must be robust: modern, but calm enough to sustain long reading, and designed
phone-first rather than shrunk from desktop.

The owner set this as a hard gate — "before any phase of unit start i want to
robust the ui of the units notes" — and specified the direction: modern but easy
to stay focused on for a long time, phone-first, with the notes part reviewed and
a YouTube video-link section added.

## Scope in

- Four outstanding defects from the UI survey, fixed in one pass.
- A phone-first reading layer for `body[data-page="unit"]` at ≤768px.
- A "Watch & Learn" video section on every unit page.
- Subject accent identity on unit pages.

## Scope out

- Desktop layout changes (the layer is phone-scoped by design).
- Any unit **content** rewriting — that is Phases 12–16.
- Shipping unverified `watch?v=` video URLs — see the video rules below.
- Reopening the Phase 7 accessibility, Phase 9 budget or Phase 10 device
  decisions. The real-phone pass here is still the one recorded in
  [`../10-device-acceptance/matrix.md`](../10-device-acceptance/matrix.md).

## Why now (evidence before the change)

| # | Defect | Evidence read from the tree |
|---|---|---|
| 1 | Table columns clipped | every `.table-wrapper` had `overflow:auto` but the `<table>` itself carried `overflow:hidden`, so the table — not the wrapper — was the sticky scroll container and `position:sticky` pinned to nothing |
| 2 | Literal `#` in note titles | `assets/js/section-notes.js` derived the title from `heading.textContent`, which includes the runtime-injected `.section-anchor-link` glyph; the probe returned `"My note for Unit Overview\n #"` |
| 3 | FABs covering text | three fixed buttons occupied the right margin at ≤768px |
| 4 | Note summaries repeat raw heading | same root cause as (2); the summary restated the heading verbatim instead of naming the note |

The `#` is **not** in the HTML — grepping the source finds nothing. It is
injected at `assets/js/unit-discovery.js:189` as an accessible deep-link control,
so the glyph is kept and restyled rather than removed.

## Design direction

Calm editorial:

- generous whitespace, one accent, quiet surfaces, no decorative shadow stack;
- body copy at `1.0125rem / 1.78` with `text-wrap: pretty`;
- section cards with a 3px accent rule and no drop shadow;
- accent-tinted icon chips in place of saturated blue blocks;
- tap targets ≥2.75rem and a 3px focus ring;
- every rule has a dark-mode counterpart.

## Accent correction

Unit pages were the only pages in the site missing `body.subject-cstNNN`, which
every subject index page already carries. Without it, `--subject-color` fell back
to the global green `--accent`, so a CST201 page looked the same as CST205. The
class is now on all 24 unit pages and the phone layer keys off
`--subject-color` instead of `--accent`.

Dark mode is safe by specificity, not by luck:
`[data-theme="dark"] [data-page="unit"]` (0,2,0) outranks
`body.subject-cstNNN` (0,1,1), so the pale `--formula-bg` tints cannot leak into
the dark theme. Verified by computed value: `#1f2137` in dark, not `#fff3e0`.

## Video rules (inherited from Phase 12, binding)

`docs/phases/12-cst201-c-content/README.md` and `unit-1/README.md` §7 forbid
`<iframe>`, `i.ytimg.com` thumbnails and any runtime third-party request, and
explicitly reject unverified `watch?v=` URLs.

The shipped section therefore uses plain `<a>` elements pointing at
`youtube.com/results?search_query=…` with
`target="_blank" rel="noopener noreferrer"`. Nothing is fetched from YouTube
until the student taps a link. The play glyph is a CSS `mask` data-URI, so there
is no icon-font or image request either.

**Open item:** these are curated search queries, not verified individual videos.
Replacing them with concrete `watch?v=` links requires verifying each URL live;
that is Phase 12 content work, not this sub-phase.

## Gates

See [`record.md`](record.md) for the run-by-run output.

## Risks

- The CSS fence now has **3.3 KB** of headroom (316,817 B of 348,160 B). The next
  CSS addition will trip `audit_page_weight.py --budget`; the fence is a
  guardrail, not a target, and raising it again needs a recorded reason like the
  one in the script docstring.
- The video sections are ~60–70 words each, so they shift `coverage.json` note
  counts. Those numbers describe shipped notes, not syllabus coverage; the counts
  remain accurate.
- Search queries can rot. `youtube.com/results` always resolves, but a query can
  drift from the intended topic.

## Done means

- [x] All four survey defects fixed and verified by probe.
- [x] Reading layer shipped, phone-first, with dark-mode variants.
- [x] "Watch & Learn" on all 24 unit pages, no third-party request until tap.
- [x] Subject accent identity restored on unit pages.
- [x] All static gates and 123/123 unit tests pass.
- [ ] Owner review on a real phone (not a phone-scaled desktop capture).
