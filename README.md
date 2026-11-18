# Diploma 3rd Semester — CST Study Hub

A first-party, zero-build static study site for West Bengal diploma CST students.
HTML, CSS, JavaScript and checked-in JSON can be served directly; no package
installation or build is required to run the site.

Phases 1–10 were administratively closed on 2026-11-18; any recorded skips
remain unverified. **Phase 11 — Subject-wise Suggestions** has been revised on
the working branch and remains open for owner review. See the [current status](docs/STATUS.md),
[roadmap](docs/ROADMAP.md) and [closure record](docs/PROJECT-CLOSURE.md). This
checkout does not confirm what is deployed.

## What exists in the working tree

- Five theory subjects, unit notes and source-linked previous-year papers.
- [Study Suggestions](suggestions/index.html): five expandable subject cards,
  each with **Important Questions** (a syllabus workbook with 104 patterns,
  linked paper dates, computed stars and worked examples) and **Easy Read**
  (a priority table, what matters, two linked reading sections per unit,
  drills and dated practice). See the [C workbook](suggestions/c/important-questions.html#unit-2)
  and [C Easy Read](suggestions/c/easy-read.html) for examples. Stars count
  distinct cited sessions, not predictions; the guides are not official keys.
- **28 papers / 924 archived questions**; exact-content aliases retain their
  source IDs. Practice uses **923 unique questions** across ten derived days.
  (A duplicated Python March-2023 reprint was removed on 2026-11-17, and the
  duplicated CST209 March-2023 reprint was removed the same day because CST209
  has no 2021 paper.)
- **872 quiz-bank questions**: 416 keyed MCQs and 456 non-MCQ items without
  automatic grading. CST207 currently has no quiz bank. Every keyed MCQ and
  every archived PYQ answer carries a 2–3 sentence explanation sized for a
  1-mark item (2026-11-17 pass).
- **Subject names in the UI**: pages read C · Python · DS · CSO · Algorithms
  instead of course codes; the codes stay in file paths, IDs, URL parameters
  and storage keys, so saved progress and deep links are unaffected.
- Timed quiz snapshots, autosave/resume, marked flags, history, exact retry,
  selected-attempt export, answer edits and a local mistake queue.
- Paper practice with original instructions, registry durations, `answerAny`
  section/choiceSet quotas across all 28 papers, compulsory 30-minute Group A
  loose-script window on the five `2023-03` papers, and `1m option + 1m written
  explanation` handling on the fifteen `2024–2026` papers. Subjective and
  written-explanation marks require manual self-review, so there is no
  automatic overall paper grade.
- Offline-capable [search](search.html), [repeated-question explorer](repeated.html)
  (1 exact-content alias group plus 15 explicitly labelled unverified
  normalized-text candidate clusters / 32 records), canonical question deep
  links with Web Share / clipboard / input fallbacks across PYQ Answers,
  Practice, and Quiz Review, authored unit `#section` anchors, breadcrumbs, and
  filtered-PYQ URL handoffs. Search indexes 2,523 items across 67 of 84 shipped
  HTML pages (question stems/topics, unit headings, subject/lab/internship hubs,
  coverage, exam-pattern, revision sheets, Suggestions, study, and info pages,
  plus this device's local section notes); the 17 excluded app/placeholder/fallback shells are listed in
  [`assets/search/manifest.json`](assets/search/manifest.json).
- **1,339 revision cards** generated from existing model answers (923) and keyed
  MCQ explanations (416), a documented fixed Leitner scheduler, and a
  [Today screen](today.html) with one primary next action, local goals, an honest
  resettable streak and sample-qualified weak-area trends. Every card shows which
  kind of source it came from and cites its paper/session or quiz-bank unit; the
  generated [card report](docs/data/cards.md) lists every skip with a reason, per
  subject and per unit (on the frozen archive: 1 exact alias and 456 quiz items
  with no stored key, and CST207 is previous-year questions only). Cards are not
  newly certified answers, and no recall-improvement claim is made.
- Plain-text section notes and [settings/backup](settings.html), with namespaced
  storage, import preview, group resets and interrupted-import recovery.
  **IndexedDB is a recovery mirror, not the primary store**: it rebuilds an
  evicted origin behind the same synchronous API. No async render pipeline means
  the primary path is still local storage.
- [Syllabus coverage](coverage.html) — every declared unit with its note depth,
  PYQ/quiz/card counts, both out-of-syllabus stored-unit rows listed rather than
  hidden, and the Unit-1 skew (496 of 924 records) with its June-2022 tagging
  explanation. [Exam pattern](exam-pattern.html) reproduces the p.14 ESE table
  (summing to 60) and reconciles **all 28** printed paper maxima against each
  paper's own answer-any quotas; which pattern applies to a given session stays
  unverified and the page says so. [Practical courses](courses.html) and their
  task pages carry credits, hours, assessment fields and syllabus page anchors —
  no completed lab solution is claimed.
- **Performance (Phase 9, 2026-11-17):** one 302-entry colour palette in
  `assets/css/variables.css` and no hex colour literal anywhere else
  (`scripts/check_tokens.py`); the three global sheets (accessibility, print and
  the install panel) are merged into one `assets/css/base.css`, and the
  accessibility/i18n/install scripts into one `assets/js/shell.bundle.js`; the Font Awesome CSS shipped to
  pages is a 25,890 B subset of the 102,641 B vendored file; data has its own
  cache version (`assets/data/data-version.json`) so a corrected answer reaches a
  returning device without a shell update. Measured from disk: **592 static
  requests for 74 pages** (was 817) and **6,817,906 CSS bytes** (was 8,638,771);
  Practice needs **9** requests to render, quiz setup **10**, a unit page **10**.
  No browser exists in the build environment, so no Lighthouse number and no
  screenshot claim is made.
- **Printable** unit pages, papers, answer keys and revision sheets: one
  stylesheet on all shipped pages, answers on their own page, and a labelled
  "Include answers" toggle on a paper. No running header is drawn — browsers do
  not support `@page` margin boxes here.
- **Revision sheets are drafts, not facts.** 44 entries exist across the five
  subjects (41 definitions, 3 formulas with symbol legends); each cites a
  verbatim syllabus topic, but **0 are owner-verified**, so they are not linked
  from navigation. No textbook page numbers are cited because no edition is
  verified in this repository.
- **Answer verification is a workflow, not a claim**: a sign-off register
  (`docs/data/answer-verification.json`) that fails closed on a missing citation,
  a bad date, an unknown question or a batch over 40 items, and a derived ledger.
  **0 of 924 archived answers are certified**; each answer shows an expandable
  "Source … not certified" line.
- Shared reading/focus/reduced-motion safeguards, per-page landmarks and skip
  links, and a small English/Bengali **interface** catalog (settings, navigation
  and shared actions; question content is never translated). Accessibility is
  measured, not assumed: `python3 scripts/audit_accessibility.py` checks
  structure, labels, contrast computed from the shipped tokens, motion and
  target size, and its numbers are locked by
  `tests/test_accessibility_audit.py`. **No WCAG conformance claim is made** —
  rendered contrast, zoom/reflow, screen-reader output and tap accuracy are
  Phase 10 device work.
- Scope-relative PWA support. Previously loaded resources can work offline;
  uncached first visits still need a connection. Full device/install/update
  acceptance is deferred to a dedicated final phase.

Content counts describe generated data, not a guarantee of verified answers
or complete syllabus coverage. The standalone Bookmarks placeholder remains
unadvertised.

## Authoritative content and verification

Original paper and registry files under `_data/<subject>/` are **byte-frozen**
by [_data/pyq-integrity.json](_data/pyq-integrity.json). Do not edit them or
refresh the baseline to hide a change. New schedules, indexes, cards and coverage
are derived sidecars. Unknown answers remain ungraded.

The [2022 syllabus package](docs/syllabus/README.md) supplies current-course
coverage references; it does not authorize rewriting historical papers.
Nine data findings and three grouped syllabus errors remain under source review.
An exact-baseline regression pass is **not** a full strict-data pass.

## Run locally

For a fresh clone with the repository's default directory name:

```sh
git clone --single-branch --branch main \
  https://github.com/pabitra27706-oss/Diploma-3rd-sem.git
python3 -m http.server 8010 --bind 127.0.0.1
```

Run the server from the directory **containing** `Diploma-3rd-sem`, then open:

**http://127.0.0.1:8010/Diploma-3rd-sem/**

Stop with Ctrl+C. If already cloned, update that checkout using `git pull
--ff-only` rather than cloning again. Unpushed Arena changes are not available
through a fresh clone or pull. The canonical publication base is
`/Diploma-3rd-sem/`; this documentation does not confirm the live site has the
current working-tree changes.

## Checks

From the repository root, with Python 3 and Node.js available:

```sh
python3 scripts/check_pyq_integrity.py
python3 scripts/check_platform.py
python3 scripts/build_suggestions.py --check
python3 scripts/check_site.py --strict --quiet
python3 scripts/validate_pyq.py
python3 scripts/validate_data.py --check-baseline
python3 scripts/audit_accessibility.py --fail
python3 scripts/check_tokens.py --strict
python3 scripts/build_icon_subset.py --check
python3 scripts/build_data_version.py --check
python3 scripts/audit_page_weight.py --budget
python3 scripts/check_root_rewrite.py
python3 scripts/check_readme_paths.py
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/attempt-store.cjs
node tests/quiz-engine-dom.cjs
node tests/study-store.cjs
node tests/study-dom.cjs
node tests/study-offline.cjs
node tests/storage.cjs
node tests/storage-recovery.cjs
node tests/storage-mirror.cjs
node tests/preferences.cjs
node tests/section-notes.cjs
node tests/theme-skew.cjs
node tests/data-pipeline-consumers.cjs
node tests/discovery-dom.cjs
node tests/data-version.cjs
```

`validate_data.py --strict` and `validate_syllabus.py --strict` still report
recorded source-review failures. See [test instructions](tests/README.md) for
optional development-only Chromium regressions and their limits.

## Regenerating checked-in outputs

Only contributors editing sources need to regenerate. Serving the site remains
zero-build. Review the resulting diff and run the integrity guard afterwards.

```sh
python3 scripts/build_data_catalog.py
python3 scripts/build_practice_days.py
python3 scripts/build_cards.py
python3 scripts/build_runtime_data.py
python3 scripts/build_coverage.py
python3 scripts/build_revision_sheets.py
python3 scripts/build_verification.py
python3 scripts/build_runtime_bundles.py   # includes assets/js/shell.bundle.js
python3 scripts/build_icon_subset.py       # assets/vendor/fontawesome/css/used.min.css
python3 scripts/build_suggestions.py       # edit docs/suggestions/guides.json, not the generated HTML
python3 scripts/generate_presence.py
python3 scripts/generate_presence.py
python3 scripts/build_search_index.py
python3 scripts/build_data_version.py      # must be last: it hashes the data
python3 scripts/check_pyq_integrity.py
```

Run `generate_presence.py` **twice**: the first pass re-inserts the shared head
block with a different newline layout, the second settles it. Regenerating in
this order ends byte-identical to the committed tree, and
`tests/test_content_depth.py` asserts that. A checked-in page is therefore
generator output *plus* that head block — never hand-edit a generated page.

Do not edit generated bundles directly. Source scripts remain under `quiz/js/`;
concatenation has no runtime dependency. `build_cards.py` rewrites
[`assets/cards/`](assets/cards) and the generated
[card report](docs/data/cards.md). Read the
[cache policy](docs/CACHE-POLICY.md) before changing worker dependencies.

## Privacy, rights and release status

Student data is local to the browser; no third-party runtime analytics or quiz
upload endpoint is added. Backups contain private notes/answers and should be
kept private. Feedback prepares an email draft or copied text; the site cannot
confirm receipt. See [Privacy](info/privacy-policy.html) and
[Measurement](docs/MEASUREMENT.md).

**Repository license: MIT** (added 2026-11-16) — see [LICENSE](LICENSE). It
covers the project's own code, documentation and authored content. Third-party
examination-source material (previous-year question papers, syllabi, registries)
is included for study use only and keeps its own, unresolved rights — see
[docs/DECISIONS.md](docs/DECISIONS.md). Existing asset notices (e.g. Font Awesome)
remain in place; see [Credits](info/credits.html).

The owner authorized merging the working branch on 2026-11-09. Consult Git and
the pull request for the actual merge result; a merge does not certify unfinished
phases. Device acceptance, deployment and domain configuration remain separate
gates. See [domain readiness](docs/DOMAIN.md).

## Contributor handoff

Read [rule.md](rule.md), [prompt.md](prompt.md),
[docs/STATUS.md](docs/STATUS.md), and the relevant
[phase record](docs/phases/README.md) before editing. Owner-approved sequencing
is implementation phases 1–9 first, then
[Phase 10 cross-device acceptance](docs/phases/10-device-acceptance/README.md).
Focused safety/regression checks continue during implementation.
