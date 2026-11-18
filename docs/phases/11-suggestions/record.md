# Phase 11 — Subject-wise Suggestions record

- **Opened:** 2026-11-18 · **Branch:** `arena/b06d66f8-diploma-3rd-sem` ·
  **Base:** `45bc44db10024bc4df1d2112810358dd71b941f4`
- **Status:** 🚧 Revision ready for owner review; not accepted. The phase entry,
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

## First draft (`03666e0`)

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

## First-draft checks and evidence

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
- [Branch Web CI 44235635283](https://github.com/pabitra27706-oss/Diploma-3rd-sem/actions/runs/44235635283)
  ran the nested-path Suggestions smoke and uploaded `site-preview` for the first draft. The Arena live
  preview opens the dashboard at `/Diploma-3rd-sem/suggestions/index.html`.
- **Not claimed:** physical-phone or assistive-technology acceptance, audited
  paper wording beyond the existing archive, certified answers, installation,
  or production deployment. No earlier phase or certification gate reopened.

## Owner review — 2026-11-18

The owner explicitly said not to pass Phase 11. The look can stay consistent
with the Study Hub, but the first draft did not match how the two second-semester
guides work. Important Questions needs more examples, dated repeats and
star-rated priorities. Easy Read needs the easier, more productive units first
rather than syllabus order. This is work within Phase 11, not a new phase or
permission to publish.

Revision method (recorded before editing the site): group related question forms
by reading actual archive stems, not by trusting raw unit tags or unverified
repeat clusters. Count one cited occurrence per exact exam session per pattern;
January and December 2024 are different sessions. Label what is being counted,
and keep single-session topics visible rather than inventing more repeats. Use
separate guide layouts. Use editorial preparation effort plus linked exam
examples to explain the Easy Read ranking; do not estimate future or guaranteed
marks. Keep all archive files frozen.

### Guide references for the revision

- **STUDY** the actual second-semester [Important Questions page](https://pabitra27706-oss.github.io/Diploma-2nd-sem/suggestions/it/IT-1st.html): distinct syllabus sections, question text beside dates and stars, and a reference column for each unit. Use checked prompts, exact archive links and short recall cues instead of copying formulas or ratings.
- **STUDY** the actual second-semester [Easy Read page](https://pabitra27706-oss.github.io/Diploma-2nd-sem/suggestions/it/Read.html): start with an explicit priority order, then focus topics and activities. Use short, manageable drills and dated paper examples to show useful scoring practice. Do not carry over “cover these only,” guaranteed totals, or time-to-score estimates.
- **ADAPT** the Study Hub's own type scale, palette, theme and print styles for both. Keep the five-card dashboard and both Home entry points.

## Revised build — 2026-11-18

| Subject | Syllabus units | Question patterns | Dated citations | Easy Read unit order |
|---|---:|---:|---:|---|
| C | 5 | 21 | 91 | 2 → 3 → 1 → 4 → 5 |
| Python | 5 | 22 | 75 | 2 → 1 → 3 → 5 → 4 |
| Data Structures | 4 | 19 | 74 | 2 → 3 → 1 → 4 |
| Computer System Organization | 5 | 22 | 78 | 3 → 1 → 5 → 4 → 2 |
| Algorithms | 4 | 20 | 75 | 3 → 2 → 1 → 4 |
| **Total** | **23** | **104** | **393** | |

- **Important Questions** is a syllabus-ordered question bank. Each unit has
  4–6 patterns, short recall cues and a link to its notes. Related question
  forms were grouped by reading their stems or relevant subparts, not by PYQ
  tags. Each dated link points to the exact archived question record. The 393
  citations refer to 309 distinct records: a multipart record can supply more
  than one pattern, but never more than one appearance within a pattern.
- **Ratings:** one star per distinct cited month/year, capped at five, with the
  full count shown. The 99 patterns with two or more cited sessions are grouped
  practice opportunities, not all identical reprints or exhaustive frequencies.
  Five patterns have one cited session and say **no repeat cited**. For example,
  C's running-total series cites March 2021, June 2022 and January 2026 (three
  stars); CSO's assembly practice includes single-session material where the
  archive has fewer directly comparable examples.
- **Easy Read** starts with a ranked route rather than syllabus order. Each
  step explains its rank, specifies what to read first, gives a drill and shows
  two past-paper tasks from different sessions (46 examples). The marks label
  is the archive's total for the linked question, not marks for the featured
  subpart or a score forecast. The final checklist covers the subject beyond
  the first pass. All syllabus units still have notes and practice links.
- **Maintenance:** edit `docs/suggestions/guides.json`. Keep at least four
  meaningful `patterns` per unit, one `refs` ID per directly related session,
  and two `examples` chosen from that unit's patterns in distinct sessions.
  Maintain the subject's explicit `studyOrder` and each unit's effort, reason
  and drill separately from the stars. Regenerate via the root README. The
  generator checks IDs, dates, unit coverage and membership; editorial review
  must still check that the stems match the prompt.
- **Discovery and cache:** all eleven URLs remain in the sitemap and search
  (2,523 items including 188 page/section rows; 67 of 84 HTML pages indexed).
  Shell `study-2026-11-18b` precaches the hub; revisited guides use the existing
  worker policy. Nothing bundles their original papers or notes. Data version
  `data-15377289b5c8` covers 81 files.

### Revised checks

- 121 Python tests, 63 JS parse checks and the ten Node regression suites
  passed locally. The Suggestions tests verify rating arithmetic, per-unit
  minimums, date collisions, exact question routes and marks totals, ranked
  layouts, output reproducibility and discovery. Strict site (0 errors and 0
  warnings), platform/presence, root rewrite, byte budgets, documentation paths,
  icon subset, token inventory and data-version checks passed.
- Headless Chromium checked both Home entry points, Enter/Space/Tab, without-JS
  disclosure and guide switching, all ten guides and the hub at 320 and 1280
  CSS px, 130% text with high contrast at 320 px, and theme persistence. Seven
  browser-navigated archive links resolved to their active question. Static
  tests checked all 439 dated link instances. A fresh worker cache served the
  hub and visited guides offline without fetching unvisited guides or linked
  source files. Reviewed rendered phone and desktop samples in light and dark.
- Accessibility source audit: 84 pages, 74 token contrast pairs, zero findings.
  This is not assistive-technology or real-device acceptance. PYQ integrity
  found no changes; 28 papers and 924 archived question objects remain
  schema-valid. `validate_data.py --check-baseline` matched the existing nine
  errors and one warning, not a strict data pass. No answer or scan
  recertification is implied.

### What to test on the website

1. In the branch preview, open `/Diploma-3rd-sem/` and use **Suggestions** from
   Quick Access or the menu. Expand two subject cards; check that each shows
   both guides and can be opened by keyboard.
2. Open `/Diploma-3rd-sem/suggestions/c/important-questions.html`. Jump to
   Unit 2, find the running-total series, and open its January 2026 citation.
   Verify the linked paper opens the series question and the three-star rating
   comes from the three shown sessions.
3. Open `/Diploma-3rd-sem/suggestions/algorithms/easy-read.html`. It starts
   with Unit 3 (binary search and hashing), then Unit 2 (sorting). Try one drill
   and follow a **Practice questions** link to the corresponding unit in the
   question bank. Check the two layouts on a phone and switch the theme.

Phase 11 stays open for the owner. No PR, merge or deployment is authorized.

## Algorithms-only layout pilot — owner approved to build

The owner asked to see a GitHub review and image references **before** another
code change, then directed: **“Build the Algorithms pair first.”** That
approves implementation of these two pages, not acceptance of the pilot,
rollout to the other four subjects, or a release.

- **STUDY:** the full [second-semester Suggestions tree at `6b2798d`](https://github.com/pabitra27706-oss/Diploma-2nd-sem/tree/6b2798d2b76217d5a2b1ab0504829c07356e58a3/suggestions),
  including the [Physics workbook](https://github.com/pabitra27706-oss/Diploma-2nd-sem/blob/6b2798d2b76217d5a2b1ab0504829c07356e58a3/suggestions/physics/Phy-1st.html)
  with paired question/formula columns and the [Physics Easy Read](https://github.com/pabitra27706-oss/Diploma-2nd-sem/blob/6b2798d2b76217d5a2b1ab0504829c07356e58a3/suggestions/physics/Read.html)
  opening with a priority table and non-syllabus order. The owner selected
  one Algorithms mockup for each layout in Arena before authorizing code.
  These are references, not copied HTML, assets, claims about marks, or time
  estimates. The PNG review artifacts are not part of the shipped site.
- **ADAPT:** keep the shared Study Hub shell, theme, generation, syllabus and
  exact citation contract. Important Questions is an open workbook in syllabus
  order: named unit jump links, numbered compact prompts with dates and stars,
  and concrete reference examples alongside each unit (below on phones).
  Easy Read opens with the named priority table, keeping rank and syllabus unit
  distinct. Order: **3 → 2 → 1 → 4**. The first drill and dated evidence follow
  immediately, with practice links for every unit and a final checklist.
- **Review gate:** show both real pages at phone and desktop widths, check
  keyboard jumps, themes, citation destinations and warm offline behaviour.
  Keep the dashboard, other guide layouts, bottom navigation and archived data
  unchanged. Ask for review of this pair before any wider rollout.

### Pilot delivered for review (not accepted)

- **Important Questions:** the `[1, 2, 3, 4]` syllabus jumps name each unit.
  The workbook keeps all **20 patterns and 75 date links** for CST209. Each
  numbered row puts its citations and computed rating together; shortened date
  labels still carry the paper's question number in the accessible link name.
  The **13 quick-reference examples** show procedures or worked values, not
  answers attributed to a paper. At 1280 CSS px the examples sit beside the
  prompts; at phone widths they sit below them.
- **Easy Read:** a real table separates rank, syllabus unit, effort and the
  first practice task. On narrow screens the same rows reflow with visible
  labels. Immediately below, the Searching drill asks for the midpoints for
  `7` in `[1, 3, 5, 7, 9]`, then for missing key `6`. January 2024 recursive
  binary search (`CST209-P004-Q20`) and March 2023 collision resolution
  (`CST209-P003-Q32`) link to the selected questions. All four steps retain
  unit notes, their workbook jump, two examples and the closing checklist.
- **Scope proof:** Home, the hub and the eight other guides matched their
  `bdee358` bytes apart from the generated shell marker. No `_data`,
  `_quiz-data` or `docs/syllabus` changes against `45bc44d`. No new runtime
  dependency, requests to external services, or copied reference-site code.
  Shell `study-2026-11-18c` refreshes the shared CSS; discovery still has 2,523
  entries / 188 page rows, with `data-8d1e3541d614` tracking the changed search
  output. The cache policy is unchanged: visited guides work offline; papers
  and notes are not downloaded just by opening the guides.

### Pilot verification and previews

- Local: 122 Python tests (7 Suggestions), 63 JS/CJS parse checks, ten Node
  regression suites, deterministic generation/platform, strict tokens and site
  checks (0 errors / 0 warnings), README paths, root-path copy and 300 KB CSS /
  350 KB JS budgets passed. Measured accessibility audit: 84 pages, 74 token
  pairs, zero findings. The two pilot pages each load about 200 KB CSS and
  44 KB JS uncompressed, using the same shell requests as the other guides.
- Archive check: unchanged, 28 schema-valid papers / 924 records. The data
  baseline gate still matches nine errors and one warning on the source-review
  ledger; this is not strict data or answer certification.
- Chromium at the real `/Diploma-3rd-sem/` subpath: 320/390/1280 CSS px
  pilot widths, light and dark, 130% text with high contrast at 320, selected
  rendered text/background pairs, no horizontal overflow, focused jumps below
  the sticky header, both Home entries, all ten guides, ten working archive
  deep links, script-free guide navigation, and warm offline revisits without
  paper/notes prefetch. These are automated browser checks, not physical-device,
  screen-reader, print, or source-review sign-off.
- Arena review files under `review/phase-11-algorithms/` (not shipped):
  `workbook-desktop.png`, `workbook-phone.png`, the complete Searching unit
  crops `workbook-searching-{desktop,phone}.png`, and
  `easy-read-{desktop,phone}.png` show the actual pages, not mockups.

### What to test on the website — pilot

1. Use the branch preview or the Termux checkout in `rule.md` §7. Open
   `/Diploma-3rd-sem/suggestions/algorithms/important-questions.html`. Select
   **Searching**. Compare the workbook on a phone and desktop, then select
   **Jan 2026** on the first prompt: the archived binary-search question
   should be selected. The five stars represent the five shown sessions.
2. Open `/Diploma-3rd-sem/suggestions/algorithms/easy-read.html`. Check that
   the ranks read **Searching → Sorting → Fundamentals → Graphs** while the
   syllabus labels stay **3 → 2 → 1 → 4**. Try the first drill, open both
   dated sources, then use **Practice questions** to return to Searching.
3. Switch theme and try the pilot on a phone. After loading both guides
   online, revisit them offline. This does not promise an unvisited paper
   or notes page is available offline.

Wait for owner review of this pair. Other subjects, Phase 11 acceptance, PR,
merge and deployment are not authorized by the pilot decision.

## Owner-authorized rollout and Easy Read expansion

The owner reviewed the Algorithms pilot and said: **“Thats good apply to all
subjects and try to easy read bit extra like what's important what to read
etc”**. Extend the approved layout to all five theory subjects and enrich Easy
Read now. This is not the Phase 11 acceptance phrase or permission to release.
The Algorithms pilot `e8450bf` passed [Web CI 44241832604](https://github.com/pabitra27706-oss/Diploma-3rd-sem/actions/runs/44241832604)
with `site-preview` and `site-check` artifacts; that evidence is for the pilot.

- **ADAPT** the reviewed workbook and semantic priority table in
  `scripts/build_suggestions.py` and `assets/css/hub.css` as the single pair of
  layouts. Keep syllabus order, distinct-session ratings, real paper links,
  responsive stacking and the first-study-unit order for each subject. Add
  original practice examples to the workbook reference boxes for the remaining
  units, without editing the source papers.
- **ADAPT** the existing unit-note anchors and site link parser for short **What's
  important** and **What to read first** lists in every Easy Read step. Provide
  specific cues for selected sections, not generic “read Unit N”; retain the
  immediate drill, two dated paper examples, unit notes, workbook jump and
  checklist. Treat priorities as a first pass, not exam predictions or a reason
  to skip syllabus topics. No added library or runtime requests.
- **Keep scope:** C, Python, Data Structures, CSO and Algorithms, their existing
  guide routes, and generated discovery/cache metadata. Dashboard/Home
  behaviour, syllabus, unit-note prose, paper archive and quizzes are frozen.
  Verify the five pairs on phone and desktop, check exact note-section and
  paper links, and keep keyboard, both themes, scaled high contrast, no-JS and
  warm offline evidence at the nested project URL before offering review.

### Rollout delivered for review — 2026-11-18

- All five workbooks use the same syllabus-order layout: named jumps, numbered
  prompts, dated question links and beside/below quick references. Across 23
  units there are **104 patterns, 393 cited appearances and 70 worked reference
  boxes**. The prompts, cited questions, session counts and stars did not change
  from the pilot. The boxes are original study examples, not answer keys.
- Easy Read retains the orders (C **2→3→1→4→5**, Python **2→1→3→5→4**,
  Data Structures **2→3→1→4**, CSO **3→1→5→4→2**, Algorithms **3→2→1→4**).
  Every step explains the rank, names what to focus on, and links two specific
  sections of the current unit notes with a reading cue (46 links). The prior
  drills, checklists and 46 dated practice examples are unchanged. Keep the
  warm-up option where fundamentals are needed.
- Rebuilt Suggestions, presence, search and data version. Shell
  `study-2026-11-18d`; data `data-1cadf3283272` over 81 files. Discovery has
  2,523 entries (188 page rows); all eleven Suggestions routes remain in
  search and sitemap. Only the ten guide bodies changed; 74 other HTML pages
  match the pilot except for the shell marker. The hub remains precached and
  visited guides are cached without prefetching notes or papers.
- Local gates: **123 Python tests**, **63 JS/CJS syntax checks**, **10 Node
  suites**, deterministic output, strict site and platform checks, tokens,
  README paths, root-path copy, icon subset and page-weight budgets passed.
  Accessibility audit measured 84 pages and 74 token pairs with zero findings.
  Freeze diff against `45bc44d` clean for the archive, quizzes and syllabus;
  28 papers/924 questions schema-valid. Data baseline matched the existing
  nine errors/one warning, not strict certification.
- Chromium at `/Diploma-3rd-sem/`: both Home entries, all ten guides at
  320/390/1280 CSS px, both themes and 130% high-contrast text at 320, no
  horizontal overflow, selected rendered contrast pairs, focused jumps,
  five note-section and eleven archive destinations, no-JS navigation and
  warm offline revisits for all pairs. PYQ viewer smoke also passed at 390.
  No physical-device, assistive-technology, print or source-accuracy sign-off.
- Actual renders in Arena (not shipped): `review/phase-11-all-subjects/` has
  workbook and Easy Read captures for each subject at 390 and 1280, plus
  C's workbook overview, dark CSO and scaled high-contrast Python samples.
  Open `c-easy-read-desktop.png` to see the table and first full study step.
  The CI preview artifact contains the static site, not these review images.

### What to test on the website — all subjects

1. Open `/Diploma-3rd-sem/suggestions/index.html` in the branch preview or the
   Termux server from `rule.md` §7. Expand each of the five subject cards; each
   should offer just **Important Questions** and **Easy Read**.
2. On `/Diploma-3rd-sem/suggestions/c/easy-read.html`, choose **Rank 1, Unit 2**.
   Read the priority topics, open **Looping statements**, return for the drill,
   then follow **Practice questions** to `c/important-questions.html#unit-2`.
3. On `/Diploma-3rd-sem/suggestions/c/important-questions.html#unit-2`, select
   **Jan 2026** under the running-total prompt. The viewer should select the
   archived question containing the series. Quick references sit alongside on
   desktop and below the prompts on phone. Try a second subject and dark mode.
4. Load a pair online, then revisit offline. Visited guides should load; an
   unvisited note or paper is not promised offline.

Awaiting the owner's Phase 11 verification. No PR, merge or deployment.
