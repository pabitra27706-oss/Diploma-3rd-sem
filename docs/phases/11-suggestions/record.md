# Phase 11 — Subject-wise Suggestions record

- **Opened:** 2026-11-18 · **Branch:** `arena/b06d66f8-diploma-3rd-sem` ·
  **Base:** `45bc44db10024bc4df1d2112810358dd71b941f4`
- **Status:** 🚧 Implemented; owner acceptance pending. The phase entry,
  tasks and roadmap were committed as `48347a6` before site code, as requested.

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

## What shipped

- **11.1:** `suggestions/index.html` keeps the existing URL and replaces the
  placeholder with five native disclosures. Modern browsers allow one open
  card at a time; the two guide links remain usable without JavaScript.
- **11.2:** Five **Important Questions** guides present 51 selected archive
  entries across all 23 declared syllabus units. Links and exam sessions come
  from the original records. The guide descriptions are editorial paraphrases,
  not replacements for the papers or a result of frequency/rank analysis.
- **11.3:** Five **Easy Read** guides provide an order, small practice tasks,
  unit-note and question links, and a final checklist. The guidance does not
  certify answers. Edit [`docs/suggestions/guides.json`](../../suggestions/guides.json)
  and follow the root README's regeneration order; don't edit the output HTML.
- **11.4:** Suggestions is reachable from Home Quick Access and the side menu.
  All eleven pages are included in the sitemap and search; search now indexes
  67 of 84 site pages. The worker `study-2026-11-18a` precaches the hub. Detail
  pages follow the visited-page cache policy; linked papers are not bundled.

## Checks and evidence

- 121 Python unit tests passed; 63 JS files parsed. Strict site and platform
  checks passed with no errors; the site checker also reported no warnings.
- The new six static tests check generation, full unit coverage, exact question
  URLs and posted archive-session labels, the guide cross-links, search/sitemap
  and fail-closed edits. No archived PYQ files changed; 28 papers and 924
  archived question objects remain schema-valid. The known source findings are
  unchanged, not passed by the baseline check.
- Accessibility source audit: 84 pages, 66 token contrast pairs, zero findings.
  Byte budgets, root-rewrite, icon-subset, data-version and token-inventory
  checks passed. One legacy inline `rgba()` allowance was removed with the
  old placeholder.
- Headless Chromium locally: both Home entry points; keyboard Enter, Space and
  Tab; native disclosure with JavaScript disabled; all ten guide routes at
  320 and 1280 CSS px; light/dark theme toggle and persistence; an exact PYQ
  jump; and the hub plus a previously visited guide while offline. Captured
  and reviewed the desktop hub and phone-width hub/guide renders.
- GitHub Web CI includes the nested-path Suggestions smoke and produces the
  downloadable `site-preview` when the branch run succeeds. The Arena live
  preview opens the dashboard at `/Diploma-3rd-sem/suggestions/index.html`.
- **Not claimed:** physical-phone or assistive-technology acceptance, audited
  paper wording beyond the existing archive, certified answers, installation,
  or production deployment. No earlier phase or certification gate reopened.

## Owner review

In the branch preview, open `/Diploma-3rd-sem/`, select **Suggestions** under
Quick Access or the menu, and expand two subject cards. In
`/Diploma-3rd-sem/suggestions/python/important-questions.html`, try an archive
link from Unit 4 and verify the expected session and question open. In
`/Diploma-3rd-sem/suggestions/python/easy-read.html`, follow a **Practice
questions** link and try the theme toggle. Record any phone-specific issue.
Wait for **mark as pass** or **add for later** before closing the phase.
Neither is permission to open a PR, merge or deploy.
