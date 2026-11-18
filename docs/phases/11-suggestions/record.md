# Phase 11 — Subject-wise Suggestions record

- **Opened:** 2026-11-18 · **Branch:** `arena/b06d66f8-diploma-3rd-sem` ·
  **Base:** `45bc44db10024bc4df1d2112810358dd71b941f4`
- **Status:** 🚧 Approved for implementation; this entry, the tasks and the
  roadmap row were written before site code, as requested.

## Reused

- 11.1 — **STUDY**: the [2nd-semester dashboard](https://pabitra27706-oss.github.io/Diploma-2nd-sem/suggestions/index.html)
  (2026-11-18), behaviour only. **ADAPT**: native `details`/`summary` disclosure
  instead of click-only cards, and the first-party MIT shell, SVG sprite and
  theme tokens. No library or copied 2nd-semester code/assets/text.
- 11.2 — **ADAPT**: the existing syllabus, frozen PYQ registries and canonical
  question-link contract; follow the first-party static generation pattern
  from `scripts/build_revision_sheets.py`, not its unsigned revision content.
- 11.3 — **BUILD**: original study-order advice based on the same syllabus, with
  links to existing subject notes. Do not reuse the reference site's marks or
  time estimates or publish unverified formulas/answer keys as facts.
- 11.4 — **ADAPT**: the existing Home entry patterns, presence/search generators,
  service-worker cache policy and CI validators. No new runtime dependency.

## Evidence before implementation

- `suggestions/index.html` contains “Coming Soon” and `noindex` on the base
  commit; the Home Quick Access grid and menu do not link to it.
- `docs/syllabus/syllabus.json` declares five theory courses and provides the
  titles and order for the question groups. The matching `_data/*/registry.json`
  files list the actual available exam sessions for 28 archived papers.
- `assets/search/repeated.json` distinguishes a single exact-content alias from
  unverified repeat candidates. Those candidates are not a frequency or
  prediction signal. The archive's unit tags also have known open findings.
