# Decisions — Diploma 3rd Sem Study Hub

> The anti-re-ask register (`rule.md` §3). Every question is answered here
> ONCE. Later chats read this file before asking anything. Re-asking a recorded
> answer is a defect. Changing an owner answer is a GATE.

## Owner decisions

- 2026-11-18 — Roll the approved Algorithms layout out? — **Yes, all five
  theory subjects.** Keep the workbook and priority table, and add more Easy
  Read guidance on what matters and what to read. This supersedes the
  Algorithms-only implementation limit, not the owner acceptance or release
  gates.
- 2026-11-18 — Which layout to build next within Phase 11? — **Algorithms pair
  first.** Review the 2nd-semester repository and show both mockups before site
  changes (done); use the chosen workbook and named-priority directions for
  CST209 only. Show real phone and desktop renders for review. This is not
  approval to adapt the other four subjects, pass the phase, or publish.
- 2026-11-18 — 3rd-semester Suggestions? — **Approved as Phase 11.** Create the
  phase entry before implementing. Use the 2nd-semester dashboard interaction
  (expandable subjects, **Important Questions**, **Easy Read**) with 3rd-semester
  styling and original, source-linked guidance. The approval does not amend
  the Phases 1–10 closure or grant PR, merge or deployment permission.
- 2026-11-06 — Playbook scope? — Build the reusable web playbook in
  `webflow/` **and** adopt it for this site (`rule.md`, `prompt.md`, `docs/`).
- 2026-11-06 — Default web stack? — **Zero-build static + GitHub Pages.**
  Plain HTML/CSS/JS, no bundler, no npm at runtime, offline-first PWA.
- 2026-11-06 — Money model? — **None.** No ads, payments, donations, affiliate
  links, or analytics. Free and privacy-first only. Adding any of these later is
  a GATE.
- 2026-11-06 — Deployment? — **Not authorized.** No deploy, no Pages setting
  change, no announcement in this phase. The site is already live from earlier
  work; any change to that deployment needs an explicit command.
- 2026-11-06 — License? — **Open (GATE).** Owner must choose MIT or GPL-3.0.
  **Resolved 2026-11-16: MIT chosen** (see `LICENSE`); covers the project's own
  code/authored content. Third-party exam-source material keeps unresolved
  rights and is a separate gate — this license does not relicense it.
- 2026-11-06 — Build the full suggested capability set? — **Yes, all of it**
  (the 18 gaps in the 2026-11-06 gap report: install/update, search, repeated
  questions, mock papers, backup/restore, 404/SEO, reading controls, print,
  weak topics, flashcards, notes, formula sheets, syllabus coverage, sharing,
  WCAG 2.2, daily goal, offline-data policy, Bengali UI). Each is mapped to a
  phase part in `docs/ROADMAP.md`; nothing is deferred silently.
- 2026-11-06 — Phase shape? — **Big phases.** Ten phases (0–9), each with its
  own folder under `docs/phases/`, holding a `README.md` and `tasks.md`. A phase
  is one whole capability with 4–6 parts, not a task list.
- 2026-11-06 — Syllabus? — **Committed to the repo.** The Council's Revised-2022
  PDF is stored unmodified at `docs/syllabus/syllabus-3rd-sem-2022.pdf`, with a
  transcription (`syllabus.md`, `syllabus.json`) and a validator. The PDF is the
  authority for units, hours and modules; content that disagrees is the bug.

## Law waivers (owner-approved exceptions to `rule.md`)

- 2026-11-17 — **Phase 9B only:** owner suspends the four-question cap in `rule.md` §3; ask as many design clarification questions as needed, in batches. This exception expires with Phase 9B and does not waive any other gate.
- Time budget remains four weeks from 2026-11-06.

## Agent decisions (reversible — object if wrong)

- 2026-11-06 — Base path treated as `/Diploma-3rd-sem/`, derived from the repo
  name and the published Pages URL. — It is what the live site already uses;
  a custom domain would change it and is a GATE. — reversible on objection.
- 2026-11-06 — Legacy `prompt.md` (1,813-line chat/plan dump) moved to
  `docs/archive/legacy-prompt-2026-11.md`; the root `prompt.md` is now the
  continuation prompt the playbook specifies. — The old file was unreadable as
  a handoff and contained no state the docs do not hold; git history keeps it.
  — reversible on objection.
- 2026-11-06 — CI runs `scripts/check_site.py` in **baseline mode** (reports,
  does not fail on errors) until Phase 1 clears the 12 existing errors, then
  flips to `--strict`. — A red default branch on day one teaches people to
  ignore CI; the errors are already listed in `docs/AUDIT.md`. — reversible.
- 2026-11-06 — No `LICENSE` created by the agent, no README rewrite in Phase 0.
  — Both are content/permission decisions, not engineering ones; queued as
  Phase 5 work behind the license gate.
- 2026-11-06 — `scripts/check_site.py` uses only the Python standard library so
  the same command runs on a phone and in CI with no install step.

- 2026-11-06 — **Usage measurement implemented as local-only + direct
  contact**: an in-site "was this useful?" prompt that stores a count locally and
  never transmits, plus a working feedback route and `docs/MEASUREMENT.md`
  stating what cannot be known. No third-party analytics is added. — It is the
  only option that satisfies the recorded no-analytics/no-third-party decision;
  real analytics would be a new GATE. — reversible on objection.
- 2026-11-06 — **Custom domain: readiness only.** The base path is centralised
  in one constant and `docs/DOMAIN.md` documents a migration, but nothing is
  purchased, registered, or configured. — Buying a domain is a money action and
  therefore a GATE; readiness costs nothing and removes a future rewrite.
- 2026-11-06 — **Old phase record moved** from `docs/phases/00-bootstrap.md`
  into `docs/phases/00-foundation/` (README + tasks), deleting the flat file.
  — The folder-per-phase convention the owner asked for; git history keeps the
  old file.

- 2026-11-09 — Phase 2 reversible implementation: seeded mixed-revision schedule (`diploma-phase2-v1`), exact-content aliases only (no punctuation-stripping semantic merges), raw IDs retained; counts and actual bank filters generated with stdlib. All 456 keyless quiz non-MCQs are missing/ungraded; no answer imported on text similarity. CST207 quiz selection withheld until a verified bank exists. January 2026 stays available in PYQ/Practice, not imported into quiz banks before source/key review. Phase remains in progress; exact fingerprinted regression ledger is not an owner waiver or strict data pass.

## Third-party licences (everything shipped, per reuse-first §3)

- 2026-11-06 — Font Awesome (CDN, 38 pages) — **not verified in this repo, no
  licence file or attribution page evidence recorded** — flagged in
  `docs/AUDIT.md`; removal planned in Phase 1 (a CDN is also a third-party
  runtime request and breaks the offline claim).
- 2026-11-06 — `assets/icons/*.png` and `assets/icons/sprite.svg` — repo-local
  assets, origin unrecorded. Confirm before a public launch.

## Open (gate or decide-once items not yet asked)

- Which FLASHCARD scheduler: FSRS-style (more accurate, more code) or fixed
  Leitner intervals (simpler, explainable)? Default recorded in Phase 5.2.
- Font Awesome: remove entirely or self-host a subset (Phase 1.3 decision).
- Site licence: **MIT (chosen 2026-11-16)** — see `LICENSE`. Content-rights
  for third-party exam material remain a separate, unresolved gate.
- Who verifies syllabus/answer-key content, and against which source edition
  (needed before Phase 7).
- Whether a custom domain is ever intended (changes the base path).
- Whether the six empty PWA icons are replaced by generated artwork or by a
  single icon at two sizes (design decision, Phase 1).

- 2026-11-09 — Phase 1 implementation: reuse Font Awesome Free 6.5.1 locally (upstream licenses retained); deterministic stdlib metadata generator and custom geometric PWA icons. No runtime dependencies added. Strict site/platform gates replace baseline CI. Full syllabus coverage remains advisory per the existing Phase 2 decision, despite the contradictory Phase 1 task; seven source-gated tags were not edited.

## Owner delivery requirements

- 2026-11-09 — After every completed phase, provide a little report directly in
  chat. After every chat, provide copyable Termux commands for local testing and
  the browser URL, including prerequisites/check-out assumptions as needed.
  Applies to documentation-only and incomplete-phase chats too. Persisted in
  `rule.md` §7; does not authorize PRs, merges, deployment, or content edits.

## Owner delegation and immutable PYQs — 2026-11-09

- Owner delegates reversible technical choices and requests progress through the
  remaining phases without repeated technical questions. This permits independent
  Phase 3 engine work while Phase 2 source-review findings remain recorded; it
  does not certify answers or resolve those findings.
- Owner explicitly confirms: **“PYQs are authoritative—do not alter them.”**
  All existing `_data/<subject>/*.json` paper and registry bytes are frozen at
  this checkpoint. `pyq-integrity.json` records their hashes; maintenance scripts
  must not rewrite them. Schedules, aliases, coverage and annotations are derived
  sidecars. The current syllabus remains authority for current-course coverage,
  not permission to rewrite historical papers. Unverified keys remain ungraded.
- A broad permission statement is not a pedagogical verification or proof of
  source accuracy. License, release/publication and deployment are not changed
  during this engineering work. Phase 2 is not relabelled complete.

## Implementation first, dedicated device acceptance — 2026-11-09

- Owner requests completing the implementation phases first, followed by one
  dedicated phase for cross-device testing. Do not repeatedly pause feature
  engineering for real-device acceptance.
- Keep per-change syntax, deterministic, integrity and focused browser checks
  during implementation to prevent accumulating regressions. Consolidate full
  device/browser/responsive/accessibility/offline/update acceptance in Phase 10.
- Deferred device evidence is not a pass. Record unresolved implementation and
  factual/source gates honestly; this sequencing does not waive them, authorize
  publication, or permit edits to immutable PYQs.

## Implementation batch across phases 4–9 — 2026-11-09

- Reconfirmed owner request: implement phases 1–9 before dedicated Phase 10
  cross-device acceptance. Added source-preserving discovery/cards/coverage,
  centralized local storage + backup/notes/preferences, shared accessibility
  safeguards and request-reduced runtime pools. Per-phase records distinguish
  present implementation from pending acceptance/source/feature gates.
- Serving remains zero-build. Checked-in script concatenations use a small
  first-party deterministic generator; no package manager/runtime dependency.
- Fixed Leitner scheduling is deliberately not branded FSRS. Existing model
  answers and keyed explanations are labelled with their verification limits.
- No new license, factual certification, domain configuration or deployment is
  inferred. No original PYQ/registry byte edits. No PR/merge/push this batch.

## Documentation handoff completed — 2026-11-09

Owner asks to finish the documentation and explain what remains. Updated the
root README against current code, removed the nonexistent-license badge and
unqualified complete/offline claims, replaced the stale continuation prompt,
aligned roadmap/phase sequencing, expanded test instructions, and added
`docs/STATUS.md` plus the unexecuted Phase 10 task/matrix templates.
Documentation is current; unfinished implementation and verification are not
relabelled complete. No license is selected and no PR, merge, push or deployment
is performed by this documentation pass.


## Explicit main-merge authorization — 2026-11-09

Owner says “Ok merge to main” after the documented handoff. This authorizes
committing/pushing the accumulated current-branch changes and opening/merging
the corresponding PR to main after safety/CI checks. It does not certify phases
2–9 complete, resolve source/license gates, or authorize deployment, Pages or
domain configuration changes. Operation result is recorded in Git/PR history.


## Preserve main and reconcile PR #7 — 2026-11-09

Owner explicitly approves preserving newer main and merging the code. Adopt
main commit `cfe3a63decb270826da40ea50b9392efc58b2f1d` as the fixed authoritative
PYQ/registry snapshot. All 35 files match that commit byte-for-byte, including
removal of this branch's earlier embedded schedule/topic metadata; scheduling
remains in derived sidecars. Preserve main's manifest/icon fixes as well.

The integrity manifest records this source commit. Paper semantic tests pin to
it, while quiz-bank semantic tests retain their original base. The same ten
source-review finding codes, targets and messages remain; only CST209-P001-Q56's
content fingerprint changes to match the explicitly adopted upstream answer.
This is preservation, not pedagogical certification or a waiver. Rebuilt cards,
search metadata, coverage and Practice runtime pool from the adopted sources.
Twelve Python tests, four Node suites, seven focused Chromium suites, site
(0 errors/28 warnings), platform and integrity checks pass locally. Hosted CI
and merge result are recorded on PR #7. No deployment/domain settings changed.


## Longer Python MCQ explanations and duplicate-paper removal — 2026-11-17

Owner instruction (chat): make the MCQ explanations "a little detailed but it's
1 mark", start with Python (PYQ papers and the quiz bank), and remove the
duplicated 2023 paper so Python shows five papers.

Authorized scope, executed on `arena/858a50c7-diploma-3rd-sem`:

- `_quiz-data/CST203/unit-1..5.json`: all **79 keyed Python MCQs** got a fuller
  two-sentence explanation (why the key holds, why the distractors do not).
  Only the `explanation` prose changed; `correct`, `options`, `question`,
  `marks`, `topic` and `unit` are untouched.
- `_data/CST203/CST203-P001-2022-06.json` and `CST203-P003-2023-03.json`: the
  **40 one-line MCQ model answers** now carry a short reason (and why the other
  options fail). Only the `answer` prose changed; no key, option, stem or mark
  was edited. P004–P006 already had multi-sentence answers and were left alone.
- `_data/CST203/CST203-P002-2023-03.json` (the March-2023 text reprint that
  duplicated `P003`) was **deleted** and `_data/CST203/registry.json` now
  declares five papers (P001, P003, P004, P005, P006). The surviving P003 is
  the scan-verified copy carrying printed set number `3013`, so no source
  evidence was discarded. CST203 now has 5 of the repository's 29 papers; raw
  PYQ records fall 992 → 958 while unique practice questions stay 923 because
  the deleted file was the canonical member of an exact-alias pair.
- Derived data was regenerated (catalog, practice days, search, repeat index,
  cards, runtime pools/bundles, coverage, exam-pattern, presence), and the
  tests that hard-coded 992 records / 30 papers / 69 aliases were updated to
  958 / 29 / 35. Recorded as sub-phase 8A:
  `docs/phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/`.

`_data/pyq-integrity.json` is re-anchored to this content revision because the
owner explicitly authorized the prose edits and the deletion. This is recorded
so the change is visible, not a silent baseline refresh: keys and question
accounts are unchanged, no answer certification is claimed, and the ten
source-review findings stay open.

**Still open (keys NOT changed, flagged only in the new explanation text):**
`CST203-U1-Q014`, `CST203-U1-Q024`, `CST203-U1-Q035`, `CST203-U3-Q002`,
`CST203-U3-Q005` and `CST203-U4-Q030` have option lists or stored keys that
disagree with real Python behaviour (corrupted reprints). Fixing a key is a
separate source-verification gate and needs the owner's explicit approval.

## All-subject MCQ explanations and CST209 dedupe — 2026-11-17

- **Owner instructions (same day, after the Python pass merged as PR #9):**
  "update all the mcqs of all subjects" with the same detailed-but-short
  explanations, and remove a duplicate paper **only** when that subject has no
  2021 paper; no other paper may be deleted.
- Quiz banks **CST201** (127), **CST205** (102) and **CST209** (108) were
  rewritten to the same shape used for Python: one-sentence key statement plus
  2–3 sentences of why the key holds and why the distractors fail (~30–40
  words, sized for a 1-mark item). Only the `explanation` prose changed;
  `correct`, `options`, `question`, `marks`, `topic` and `unit` are untouched.
  Items with corrupted printed options (`CST205-U3-Q010`, `CST205-U3-Q012`,
  `CST205-U4-Q002`, `CST209-U4-Q013`) are explained around the stored key
  rather than retyped.
- PYQ `answer` prose was brought up to the same standard in every subject:
  CST201 P001–P003, CST205 P001–P003, CST207 P001–P003, CST209 P001/P003 got
  full rewrites, and the ~36 shortest answers in the 2024/2026 papers were
  expanded. No stored key, option, stem or mark changed.
- `_data/CST209/CST209-P002-2023-03.json` was a reprint of `P003` (March 2023,
  25 MCQs plus short-answer duplicates). CST209 has no 2021 paper, so it met
  the owner's deletion rule; the file was deleted, its identity block removed
  from `scripts/validate_pyq.py`, and `_data/CST209/registry.json` now declares
  P001, P003, P004, P005, P006. CST203 was **not** touched again: its duplicate
  reprint was already removed and P001 (2022) is its earliest sitting.
- Deleted alongside it: the open `unit` finding for `CST209-P002-Q34`, so the
  source-review ledger now carries **nine** findings instead of ten. The
  fingerprint for `CST205-P001-Q3` was re-anchored because its prose changed;
  every other finding code, target and message stays open.
- Derived data regenerated (catalog, practice days, search/repeat index, cards,
  coverage, runtime pools, presence, duplicates report). Raw PYQ records
  958 → 924 and exact aliases 35 → 1, because the removed file had been the
  canonical member of the alias set; unique practice questions stay 923.
  `tests/test_data_pipeline.py` was updated from 958 to 924 records.
- `_data/pyq-integrity.json` is re-anchored to this content revision for the
  same reason as above: the owner authorized the prose pass and the deletion.
  This is recorded so the change is visible, not a silent baseline refresh; no
  answer certification is claimed.

## Subject names instead of course codes in the UI — 2026-11-17

- **Owner instruction:** "everywhere the subjects are in their code like cst20x it's hard
  to find the real subjects, replace it with subject names … only in the UI", with no
  change to inner paths or code. Follow-up answers chose **short names**
  (C · Python · DS · CSO · Algorithms) and **hide raw IDs** from what a learner reads.
- Scope kept strictly to presentation. Unchanged: directory layout
  (`subjects/CST209/…`), every `_data`/`_quiz-data` file and question/paper ID,
  `registry.json`, `data-subject`/`data-value` attributes, `?subject=` URL parameters,
  localStorage keys (`unit_progress_CST201`, `pyq_<code>_<paper>_…`), DOM ids and the
  `CST20x` keys inside `catalog.json`, `assets/search/*`, `assets/cards/*`.
- Labels: compact chrome (nav brand, filter buttons, badges, chips, card corner) uses the
  short name; places that already had room for a title (page titles, drawer headers,
  subject-hub subtitle, quiz subject `<option>`, coverage headings) keep the full
  syllabus name. The redundant "Code:" meta row was removed from the five subject hubs.
- Raw identifiers are no longer printed: PYQ archive cards show `month year` with the
  paper's `P00n` and printed set number, the viewer/answers toolbars show
  `subject name · session · paper`, and duplicate-appearance notes list session + paper
  only. Deep links still carry the real IDs.
- New `assets/js/subject-labels.js` exposes `subjectLabel(code)` for the search, repeated,
  cards, today and practice-session pages; quiz/home/PYQ pages use the name maps they
  already had (`shortName` added to `quiz/js/common.js`).
- `scripts/build_coverage.py` now writes display labels for the pages it authors
  (coverage, exam-pattern, courses, lab pages). That is a label change only: it emits no
  new IDs and writes the same JSON payload as before.
- Derived output regenerated (coverage, courses, lab pages, search index, cards, bundles,
  presence). Gates after the change: `validate_pyq` PASS, `check_pyq_integrity` clean,
  `validate_data --check-baseline` matches the ledger, `check_platform` 0 errors,
  Python `unittest` 13 PASS, Node `attempt-store`, `storage`, `storage-recovery`,
  `study-store`, `data-pipeline-consumers`, `quiz-engine-dom` PASS.
  `check_site.py --strict` reports exactly the findings it already reported on `main`.
- Recorded as sub-phase 8A:
  `docs/phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/`, with
  `README.md`, `tasks.md` and `record.md`.

## Phase 3 sign-off and Phase 4 discovery scope / candidate-repeat disclosure — 2026-11-17

- **Phase 3 (`03-quiz-engine`) reconciled to `✅*`:** Owner approved closing
  Phase 3 after PR #11 merged to `main` as `9d47c7c7`, recording explicit
  caveats in `docs/phases/03-quiz-engine/record.md` (no standalone CST207 quiz
  bank; 456 unkeyed items and subjective / 1-mark written MCQ explanations stay
  manual self-review; 9 data + 3 syllabus source findings remain separate;
  hardware/browser matrix in Phase 10).
- **Phase 4 (`04-discovery`) implemented on `arena/80b11bcf-diploma-3rd-sem`:**
  - **Explicit HTML index scope:** `assets/search/manifest.json` `scope` records
    the exact partition of all 68 shipped HTML pages into 50 indexed pages
    (24 unit note pages + 26 informational, subject-hub, practical-lab,
    internship, coverage, exam-pattern, study and policy pages in
    `index-pages.json`) and 18 deliberately excluded shells (14 dynamic app
    shells, 2 unshipped placeholders, 2 fallback pages), plus client-side-only
    `section-note:*` notes. All six shards stay ≤ 40% of source bytes (10.5%–37.0%).
  - **Honest repeated-question explorer:** With the two duplicate 2023 reprints
    deleted in PR #9 and PR #10, `assets/search/repeated.json` and
    `repeated.html` present both the **1 exact-content alias group**
    (`CST203-P001-Q43` / `CST203-P001-Q44`) and the **15 normalized-text
    candidate clusters (32 records)** across all five theory subjects, each
    badged *"Unverified candidate, not a confirmed duplicate"* with `differsIn`
    metadata and sample-size disclaimers. Candidates are never merged or claimed
    as verified repeats.
  - **Authored-only heading anchors:** Added 168 authored `<h3>` IDs across the
    24 unit pages and 7 `<h2>` IDs on `coverage.html`/`exam-pattern.html`, while
    indexing unit `<h2>` headings via their authored enclosing `<section id>` so
    `section-notes.js` runtime `section-1..N` IDs and `section-note:*` storage
    keys stay untouched; unanchored page-top headings are explicitly recorded as
    `noAnchor: true`.
  - **Deep-link sharing and UI label discipline:** `window.StudyShare` provides
    `navigator.share` → `navigator.clipboard.writeText` → selectable readonly
    `<input>` fallback across PYQ Answers, Practice, Quiz Review and Quiz Result,
    retaining real course/paper/question IDs in URLs while showing only
    `subjectLabel()` display names on screen and explicitly labelling quiz
    review links as local to this device.

## Phase 5 study-system: scheduler, card citations and study cache — 2026-11-17

- **Scheduler choice (agent decision, reversible):** fixed **Leitner** ladder
  1/3/7/16/35 days instead of FSRS. Reason: it fits in one documented function,
  is deterministic under fixed inputs, needs no dependency or parameter model,
  and can be unit-tested exactly. The formula, the day-boundary rule and both
  clock clamps are written in the `assets/js/study-store.js` header. Switching to
  FSRS later is a recorded engineering decision, not a data change.
- **Daily new-card cap counts today's introductions:** card state carries
  `firstDay`, so the cap (`newLimit`, default 20) limits cards *introduced today*;
  due reviews are never capped. The earlier lifetime-`reps` estimate could let
  yesterday's introductions consume today's allowance.
- **Card provenance is two-field:** `citation` keeps the raw archive provenance
  for audit; `citationLabel` is the display-safe line (short subject name +
  session/panel + printed question number). `verification` is a short code whose
  sentence lives once in `assets/cards/manifest.json` → `verificationNotes`. This
  keeps the payload compact without weakening the visible source rule and without
  printing raw `CST20x` codes or internal question ids (owner decision
  2026-11-17). No answer text, key or unit is written, shortened or certified.
- **Skip accounting is explicit, not merged:** every excluded item carries a
  reason (`alias`, `pyq-missing-answer`, `quiz-not-mcq`, `quiz-no-explanation`,
  `quiz-no-key`) and the generated report shows totals per subject, per reason and
  per unit. On the frozen archive that is 1,339 cards and 457 skips (1 alias + 456
  keyless quiz items); CST207 is disclosed as PYQ-only. **Card backs remain under
  the owner content-verification GATE** — generating a card is not certification.
- **Study offline coverage:** `cards.html`, `today.html`, the study scripts, the
  attempt store and `assets/cards/manifest.json` join the worker precache, and a
  `WARM_STUDY` message caches all five subject shards under the versioned key
  (mirroring Phase 4's `WARM_SEARCH`). The worker `VERSION` moved to
  `study-2026-11-17` so old caches drop on activation (Phase 6 later bumps it to
  `study-2026-11-17b` for the storage-boundary changes). Coverage means "cached
  after one study page load", not first-visit offline, and not survival under
  browser eviction.
- **Phase 6 — storage boundary:** `assets/js/storage.js` stays the only file that
  touches `localStorage`; `d3s:` prefix, one `d3s:prefs` record, one schema marker,
  journal-guarded restore, registry-driven reset groups. Legacy theme scalars are
  adopted once and deleted, so one theme key exists. The pre-paint hook is the
  module itself (synchronous `<head>` load before any stylesheet on all 68 pages),
  not a second inline snippet.
- **Phase 6 — notes:** one shared `assets/js/section-notes.js` widget on the 24
  unit pages, the practice session and quiz review; keys stay
  `section-note:<subject>/units/unit-N.html#section-K` on unit pages and
  `section-note:practice|quiz-review/<questionId>` elsewhere. Text is plain and
  verbatim; markup typed by a student is never rendered.
- **Phase 6 — IndexedDB is a mirror, not a primary store:** writes and deletions
  are copied to `d3s-store`, `hydrate()` rebuilds only an origin with no records
  (so a reset cannot be resurrected), and `idbStatus()` reports
  `primary:'localStorage'` plus the 1.5 MiB threshold mode. The synchronous render
  contract is the reason the primary path was not swapped; acceptance item 6.6-3
  is recorded as partially met in `phases/06-state-portability/record.md`.
- **Honest framing kept in the UI:** percentages require ≥ 5 observations in that
  area, weak rows always print `correct / attempted` and the number of
  contributing attempts, the streak counts only recorded local days and names its
  reset start, and no screen claims that cards improve recall.
## Phase 4 and Phase 5 sign-off, and merge-to-main authorization — 2026-11-17

- **Owner verification:** the owner ran the local/Termux (device) pass over the
  Phase 4 discovery surfaces and the Phase 5 study surfaces and reported
  **"Device test pass"**. Both phases therefore move `🚧` → `✅*`:
  `docs/ROADMAP.md`, `docs/STATUS.md`, `docs/phases/04-discovery/record.md` and
  `docs/phases/05-study-system/record.md` record the acceptance and repeat their
  caveats (unverified candidate-repeat clusters, no answer certification, 456
  keyless quiz items, no CST207 quiz bank, Phase 10 device matrix).
- **Merge authorization:** the same message said **"Merge to main"**. That is an
  explicit command to merge the active session branch
  (`arena/4d3997da-diploma-3rd-sem`) into `main` through a pull request. It is
  **not** authorization to deploy, enable Pages, change the domain, tag a release
  or announce anything; no such action was taken. Merging updates `main` only —
  whatever the already-configured Pages pipeline does with `main` afterwards is
  not a setting this chat changed.
- The merge does not close any content or source-verification gate: the 9 data
  findings, 3 grouped syllabus errors, 456 keyless quiz items, missing CST207 quiz
  bank and answer certification all remain open.
## Phase 7 accessibility, language and truth-pass scope — 2026-11-17

- **Measured, not asserted.** Phase 7 opens with a re-measurement because the
  phase's own evidence table was stale: it claimed 55 pages, 55 without skip
  links, 36 without `<main>`, 36 without a meta description and a missing
  `LICENSE`. The shipped tree is **68 pages**, 11 without `<main>`/skip, 0
  without a description, and `LICENSE` has existed since 2026-11-16. Every number
  in `phases/07-inclusion-trust/README.md` and `record.md` now comes from
  `python3 scripts/audit_accessibility.py` on this tree.
- **Decorative card labels are not headings.** 933 `<h4>` card/sub-item labels on
  the subject pages (plus 36 on info pages) became `<p class="card-title">`,
  keeping every `style`/`id`/`class` attribute and the `<h4>` typography through
  one class rule. This removed 134 heading-order jumps across 32 pages.
- **Navigation chrome keeps its headings.** The mobile drawer's `<h3>` and the nav
  brand were *not* demoted: `scripts/build_search_index.py` excludes drawer
  chrome and `tests/test_discovery.py` asserts that exclusion count. The
  accessibility gain came from content labels; loosening an existing assertion to
  chase the remaining chrome was rejected.
- **Contrast is fixed at the token level.** 14 tokens changed across
  `assets/css/variables.css`, `quiz/css/common.css`, `practice/css/index.css`,
  `practice/css/session.css` and `pyq/css/answers.css`, including matching
  `--accent-*-rgb` triplets so `rgba()` tints do not keep old hues. No
  component-level colour override was added and no palette identity was
  redesigned beyond the lightness/vibrancy needed to pass.
- **The focus indicator is solid, not a halo.** A 40 % alpha ring measured 2.2:1
  on white, below the 3:1 SC 1.4.11 needs; it was replaced by
  `--focus-ring-solid` (`#4a4fd0` light, `#a5a6ff` dark).
- **Target size is judged on control boxes, not glyphs.** An icon may be 14–20 px
  inside a 28–40 px button. The audit therefore reports only control rules that
  *pin* a dimension below 24×24 CSS px (currently none), and does not fail
  decorative glyph sizes.
- **The language layer is a shared UI catalog, not a translation of content.**
  38 keys per locale (navigation, shared actions, reading controls, common
  states), applied by `assets/js/i18n.js` through the single `d3s:prefs.lang`
  record. Question text, options, model answers and unit prose are never
  translated; the page says so in both languages. Bengali glyph rendering on a
  real phone is unverified.
- **The truth pass deletes claims the build cannot support.** The privacy page no
  longer claims the "app requires permissions" (it is a web app with no
  install-time permissions); the offline claim is now "material you opened once
  can be read offline, and the browser may evict that cache"; `about.html` says
  installable web app rather than "Android application"; and the README's
  "IndexedDB migration is not implemented" became the accurate Phase 6 statement
  that IndexedDB is a recovery mirror, not the primary store.
- **No WCAG conformance claim is made.** Measured source-level criteria are
  recorded with their numbers. Rendered contrast after compositing (gradients,
  glass blur, overlays), 200 % zoom/reflow, dialog and tab focus behaviour,
  screen-reader output (NVDA/TalkBack/VoiceOver), real tap accuracy, Bengali
  conjunct rendering and keyboard-only core-flow completion all move to the
  Phase 10 device matrix.
- **Two checks were added rather than a promise.** `scripts/audit_accessibility.py`
  (with `--fail` and a baseline locked by `tests/test_accessibility_audit.py`) and
  `scripts/check_readme_paths.py` make these numbers and the README's paths fail
  the build when they drift.
- **Nothing here authorizes a merge, deploy, Pages change or release.** The
  branch stops at the owner review gate.

## Owner device report and Phase 7 acceptance — 2026-11-17

- **Owner message:** "All devices test passed", clarified on ask as a **smoke
  pass on one Android phone in Chrome**: a general click-through with nothing
  reported as failing or visually wrong.
- **Initially treated as:** partial hardware evidence — one partial row in
  `docs/phases/10-device-acceptance/matrix.md`, Phase 7 left at `🚧`.
- **Then decided by the owner:** told plainly that a click-through is not a
  per-criterion audit, the owner directed **"You can mark as passed"**. Phase 7
  moves `🚧` → **`✅*`** on 2026-11-17. The owner is the acceptance authority, so
  the status follows their decision; the record keeps the evidence description
  ("general click-through, one Android phone, Chrome, no failures reported") next
  to the status so the asterisk is not read as a measurement.
- **What the acceptance does not do:** it does not turn any unmeasured item into a
  passed item. Rendered contrast after compositing, 200 % zoom / 320 CSS px
  reflow, Bengali rendering, keyboard/skip-link traversal, focus after dialogs,
  tap accuracy against the 24 px floor and screen-reader output are still open
  Phase 10 items, listed in the Phase 7 record's *Left open* section.
- **Why the evidence is described this way:** Phases 4 and 5 were accepted as
  `✅*` on focused passes over named surfaces. This report named none, gave no
  device model, OS or browser version, and reported no measurement. Describing it as an
  acceptance sweep would have been a claim the evidence does not support, so the
  record says "smoke pass" even though the owner has accepted the phase.
- **Still open for the device sweep:** rendered contrast in both themes, 200 %
  zoom / 320 CSS px reflow, Bengali catalog and conjunct rendering, keyboard and
  skip-link traversal, focus after dialogs, tap accuracy against the 24 px floor,
  screen-reader output, offline cold/warm and update, backup/restore and timed
  attempts under background throttling.
- **No merge authorization** was given in that message, so nothing was merged, no
  PR was opened, and no Pages, tag or release action was taken.

## Phase 8 content-depth decisions — 2026-11-17

Agent decisions (reversible — object if wrong). None of them certifies content.

- **Paper totals: the data is right, the old comparison was wrong.** For all 28
  frozen papers the marks obtainable under the paper's own printed quotas
  (answer-any per group or per choice set) equal the printed `fullMarks`
  exactly; the marks summed over *all set* questions are necessarily larger
  because only a subset is answered. Consequence: the "unverified overall total"
  wording on paper practice now *explains* that arithmetic instead of claiming
  the total is unknown. What remains undecided — and stays recorded as
  unverified on `exam-pattern.html` — is **which pattern applies to a given
  session**: the syllabus ESE table (1/2/6 mix, 30+12+18) matches the June-2022
  papers only; the 2024–2026 papers print 20+40, and March 2021 printed 70
  marks. The site shows all three and tells the student to ask their
  institution. It does not pick one, and this is not a waiver of the
  marks-reconciliation gate.
- **Coverage is published as counts and flags, never a percentage.** A unit with
  one thin note must not read as "covered". `coverage.html` states the method on
  the page.
- **Stored out-of-syllabus tags and the reversed CST201 bank units stay as they
  are.** Frozen bytes are not re-tagged; the coverage map shows both the stored
  unit count and the syllabus-implied count side by side and flags the row. The
  ledger finding remains open.
- **Print sheet: one stylesheet, injected by the presence generator, on every
  page.** Page `<header>` elements are deliberately not hidden because the unit
  `<h1>` lives inside one. No fake running header is drawn: browser `@page`
  margin boxes are unsupported in Chrome/Safari/Firefox, so the page's own
  `<h1>` plus printed link URLs carry the identity. Consequence: "a header/footer
  with subject/unit" in `tasks.md` 8.3 step 1 is met only in that weaker form,
  and the record says so.
- **Revision sheets are authored as sourced drafts, generated, and gated.**
  `docs/revision-sheets/<course>.json` is the authored source; the builder
  refuses any entry whose `citationQuote` is not a verbatim syllabus topic for
  the stated unit, and refuses a formula without a symbol legend. Sheets are
  **not** linked from navigation until the owner signs them off. Only 3 formulas
  ship because the syllabus prints almost no arithmetic, and **no textbook page
  numbers are cited** — no edition is verified in this repository, so inventing
  a chapter reference was rejected in favour of the visible gap.
- **The answer-verification register fails closed.** One batch without a
  citation, without an ISO date, with a future date, with an unknown question
  id, with a duplicate target, or with more than 40 items rejects the entire
  register and certifies nothing. A scan check of question wording never counts
  as answer certification.
- **Six new pages (68 → 74) and their ripples are accepted deliberately:** the
  Phase 7 audit baseline (page counts only), the search-scope literal
  (50/68 → 56/74), the worker-version literal, and a corrected quiz recount in
  `tests/test_runtime_derived.py` that previously compared against zero and
  therefore agreed with a broken generator. No assertion was loosened.
- **Regeneration order is load-bearing and now tested.** A freshly generated
  page needs the documented **second** `generate_presence.py` pass before its
  bytes settle (the first pass re-inserts the head block with a different
  newline layout). `tests/test_content_depth.py` therefore runs builders →
  presence ×2 and asserts the tree ends byte-identical; a new test also asserts
  that running the whole suite leaves no file changed.

## Phase 8 accepted by the owner — 2026-11-17

- **Owner message:** "Everything is pass on a smoke use test nothing breaks" plus
  "You can merge and write the next prompt".
- **Treated as:** an owner acceptance of the phase (`🚧` → **`✅*`**) and an
  explicit merge authorization for this branch only. Not as a per-criterion
  verification pass, and not as content certification.
- **The asterisk means:** 8.1, 8.3, 8.4 and 8.5 are implemented and
  gate-verified; 8.2 and 8.6 are **built and still uncertified** — 0 of 44
  revision-sheet entries and 0 of 924 archived answers have a source sign-off.
  The owner's smoke pass says nothing does not break under use; it does not say
  a single syllabus citation or answer is correct, because a smoke pass cannot.
- **What the acceptance does not change:** the nine strict-data findings, the
  three grouped strict-syllabus errors (CST205 U5 ×4, CST209 U5 ×2, CST207 with
  no quiz bank), 456 unkeyed quiz items, the reversed CST201 quiz-bank units and
  the six out-of-syllabus unit tags. None of these were waived; all stay visible
  and keep failing their validators.
- **Unmeasured and moved to Phase 10, not to "passed":** any real phone
  print/PDF export, rendered contrast in both themes, 200 % zoom / 320 CSS px
  reflow, Bengali conjunct rendering, keyboard/skip-link traversal, focus after
  dialogs, tap accuracy against the 24 px floor, screen-reader output.
- **Merge:** authorized for `arena/e0da0bec-diploma-3rd-sem` → `main` only. No
  deploy, no Pages change, no domain, no tag, no release.

## Phase 8 verification scope — owner direction — 2026-11-18

The owner directed that no further Phase 8 answer or revision-sheet verification
be undertaken. This closes the verification work as **not pursued**, not as a
pass: the 44 revision entries remain drafts, and all 924 archived PYQ answers
remain uncertified. No data status or verified date is changed. The public
`info/disclaimer-notice.html` now states that content is provided as-is, is not
guaranteed 100% accurate, and must be cross-checked with official sources. This
disclaimer is not a substitute for certification and does not change any
individual answer's provenance.

## Phase 9 performance and launch — engineering decisions — 2026-11-17

These are delegated implementation decisions (owner delegation of 2026-11-09),
recorded because they change how the tree is built. None of them is a rights,
content, publication or domain decision.

1. **One palette file, per-area aliases kept.** Every **hex** colour literal now
   lives in `assets/css/variables.css` (302 entries). `rgba()`/`rgb()` values are
   explicitly out of scope for this pass — 373 occurrences (188 distinct), mostly
   alpha shadows, overlays and translucent borders — because an alpha-capable token
   model plus a fresh contrast run is its own piece of work; they are recorded as
   an open item in `docs/STATUS.md` and the phase record rather than counted as
   done. The per-area semantic namespaces
   (`--bg-primary` in quiz vs pyq vs units) stay in their own stylesheets as
   aliases, because those names already mean *different* colours per area and
   merging them would change rendered output. `scripts/check_tokens.py` enforces
   "no literal outside the token file" and "every page loads the token file first".
   Colour equivalence is proven statically (1,205 literals re-pointed, 0 value
   differences; 47 contrast pairs unchanged). No browser exists here, so layout
   was not re-screenshotted.
2. **Global sheets merged for requests, not for bytes.** `accessibility.css`,
   `print.css` and `pwa.css` became `assets/css/base.css`; `accessibility.js`,
   `i18n.js` and `pwa.js` became the generated `assets/js/shell.bundle.js`
   (sources stay in place, as with the existing JS bundles). Two fewer CSS and two
   fewer script requests on every page.
3. **The English UI catalog is never fetched.** English is the authored markup and
   already the fallback, so only Bengali costs a request. `assets/i18n/en.json`
   stays as the reference catalog for the key-parity test.
4. **Icon CSS is subset; icon fonts are NOT.** `scripts/build_icon_subset.py`
   emits `used.min.css` (25,890 B from 102,641 B) for the 226 icons the tree names,
   keeping the MIT/CC-BY/OFL banner and the unmodified webfonts. Font subsetting is
   deliberately not done: SIL OFL reserved-font-name rules mean a modified font
   would have to be renamed, which is a **rights** decision, not an engineering
   one. The 156 KB solid and 117 KB brands webfonts therefore remain the largest
   single payloads on icon pages and are recorded as such.
5. **Data has its own cache version.** `assets/data/data-version.json`
   (`data-6b1621c45599` over 81 files) is generated from the data bytes and names a
   separate cache namespace, so a corrected answer reaches a returning device
   without a shell update, a banner or a storage reset — and a shell update no
   longer throws the pools away. Proved by `tests/data-version.cjs` with no browser.
6. **The published URL is one constant.** `scripts/site_config.py`; everything
   absolute is generated from it and `scripts/check_root_rewrite.py` proves a `/`
   root works by running the site checker on a rewritten copy. No domain action.
7. **Dead CSS/JS removal is name-based and conservative.** A rule is removed only
   when none of its class/id names appear as a full token anywhere in shipped
   HTML, JS or JSON; dynamically composed families (`pill-CST20x`, `dot-CST20x`,
   `q-badge-difficulty-*`) are explicitly excluded. 71 rules (8,485 B) removed.
   Six inline `var(--primary-color)` references that resolved to nothing now use
   the defined `--primary`, which changes rendering on those diagrams (the borders
   and fills were previously dropped) — recorded here because it is a visible fix.
8. **Shell version bumped** to `study-2026-11-17e` because the shell bytes changed;
   the data version is independent of it.

## 9.4 measurement — owner opened a first-party counter gate — 2026-11-17

Asked: "what should the dated measurement decision say?" Answered by the owner on
2026-11-17: **open a first-party counter gate** rather than confirm the
local-only default outright.

What this decides, and what it does not:

- **Decided:** the owner does want aggregate usage counts later, so the question
  is no longer "analytics or nothing". Phase 9.4 therefore stays **open** — this is
  a gate, not an implementation approval, and nothing was built in response.
- **Not decided yet (owner answers required before implementation):**
  1. **Metric** — choose what aggregate is counted. No per-student, per-question,
     or per-answer metric is in scope under the existing constraints.
  2. **Storage** — choose/authorize a first-party endpoint or other owner-approved
     storage. No third-party analytics service, pixel, tag manager, or tracking
     cookie; GitHub Pages itself is static and offers no counter endpoint.
  3. **Retention/access** — specify how long aggregates are kept and who may read
     them; include the chosen host's request-log behavior.
  4. **Disclosure** — approve the privacy-page text describing the counter, fields
     sent, purpose, and retention **before** any request ships.
- **Non-negotiable constraints inherited from Phases 1–9** (these are binding on
  any future implementation, whoever writes it):
  - one request, same origin, **never blocking render**; it must fit the page
    budget (`scripts/audit_page_weight.py --budget`) and must not break offline
    (`sw.js` must treat it as network-optional, never as a precache entry);
  - no query string, note, name, answer, bookmark or search text may be sent —
    pathname + a coarse bucket at most, and no persistent identifier;
  - no third-party script, no resale of data, no ad/affiliate coupling (money
    model stays "none");
  - the local-only usefulness prompt stays as it is and is **not** replaced by a
    counter;
  - a counter is never presented as proof of learning, retention or "students
    helped" — `docs/MEASUREMENT.md`'s unknowables stay unknowable.
- **Owner follow-up — 2026-11-18:** the owner selected **no counter / no
  measurement**; storage is deferred, and no counts are to be persisted. The
  owner also approved the standard disclosure scope if measurement is ever
  reconsidered, but this does not authorize a counter or require a new disclosure
  for a feature that will not ship. Phase 9.4 is closed as **not implemented by
  choice**, not as a shipped measurement feature. No counter code, request, or
  hosting change is authorized.
- The 2026-11-17 gate record above is retained as historical context; this
  follow-up supersedes its open status.

## Open owner decisions from Phase 9

- **Deploy (9.6).** Not authorized and not performed. `docs/LAUNCH-CHECKLIST.md`
  is ticked only where this environment can prove an item; Lighthouse and the
  real-phone pass are recorded as **not run**.
- **9.4 counter.** Closed unimplemented by the owner's 2026-11-18 choice of no
  counter. No measurement request or storage is authorized; any later reopening
  requires a new explicit decision.

## Explicit main-merge authorization — Phase 9 — 2026-11-17

Owner instruction: **"Merge it to main"** (2026-11-17), given after the Phase 9
report stated that nothing was deployed and no PR existed.

- Authorized: open a PR from `arena/908b6b19-diploma-3rd-sem`, merge it to `main`.
- Executed: **PR #17**, merged **2026-11-17T09:01:31Z** as
  `c898a953bd2e78308a2a9575ded5241ae6ca5b16` (merge commit, matching PR #16).
  CI on the PR tip was green (run `44050968304`).
- Consequence, stated plainly: GitHub Pages publishes from `main` (`/`), so this
  merge **is** the publication step. Pages built `c898a95` at 09:01:32Z and the
  live site now serves the Phase 9 shell (`sw.js` `study-2026-11-17e`) and data
  version (`data-6b1621c45599`).
- Still **not** authorized, and not done: any Domain/`CNAME`/DNS change, any Pages
  setting change, any tag or release, and any analytics counter (9.4's gate stays
  open — this approval covers merging the phase code, nothing else).
- Visitor effect: the shell version changed, so a returning visitor's installed
  worker fetches the new shell as *waiting* and `pwa.js` asks before reloading;
  the data cache is kept (its version namespace is separate).

## Phase 9B — alpha-colour policy (2026-11-17)

- Tokenise `rgba()` in this phase using the existing `assets/css/variables.css` token file. Extend the strict checker and tests before migration; preserve colour equivalence and rerun contrast checks. The current checker enforces hex only; the alpha gate is not yet implemented or green. Owner direction and plan approval remain pending.

## Phase 9B — preferred illustration (2026-11-17)

- Owner selected **option 1 of 2** generated illustrations: `docs/phases/09B-ui-reboost/selected-direction.jpg`. Its dark, restrained surfaces and lavender accent are a design reference, not a screenshot or permission to add its invented illustration/copy/features. The owner did not give a reason for not selecting option 2. Exact details and the proposed plan remain subject to owner confirmation; no CSS work is authorized until the plan is explicitly approved.

## Phase 9B — plan and visual preferences (2026-11-17)

- Owner approved the proposed plan and batch sequence **conditional on required before screenshots being available**. Continue to wait for matching desktop and other applicable baseline screenshots before the first batch; after each batch obtain after screenshots and written confirmation before proceeding.
- Follow selected illustration's dark navy/lavender palette closely, subject to contrast checks. Aim for balanced density. Use a serif-style title as a reference but no botanical decoration. Use locally available fonts; no CDN or new runtime font request. These preferences do not authorize the illustration's invented wording, new content, or features.

## Phase 9B — page-specific references and priorities (2026-11-17)

- Owner clarified that separate design references are wanted for practice, quiz and PYQ before implementation. They specifically asked for a better site-wide print action, a usable phone home header, improved practice top/bottom copy, a full quiz-flow redesign and PYQ copy/share/source controls near the bookmark above questions with SVGs. Retain current functionality, source/certification meaning and URLs. Exact source-note treatment needs clarification because the PYQ code distinguishes paper source notes from provenance.

- Later on 2026-11-17, owner selected **option 2 of 2** for each generated page reference: [Practice](phases/09B-ui-reboost/practice-reference.jpg), [Quiz](phases/09B-ui-reboost/quiz-reference.jpg), [PYQ](phases/09B-ui-reboost/pyq-reference.jpg). These are compositional references, not screenshots or approval to add their invented words, subjects, numbers, controls or content. In particular the practice illustration mistakenly depicts nursing subjects and invented metrics: none belong to this site and none may be implemented. The chosen quiz illustration uses serif type more broadly than the previous brand-only preference; resolve that discrepancy with the owner. No real-page redesign or batch acceptance is implied.

## Phase 9B — specific visual choices (2026-11-17)

- PYQ: move **both** the paper's source note (when present) and the verification/provenance disclosure above the question near the bookmark and copy/share controls. Keep both truthful, accessible and intact in practice and review; never imply an unverified answer is certified.
- Print: place the existing action in an existing actions menu where available; retain clear access on pages without one. Preserve real print output and current capabilities; do not make a new functionality change or hide the action entirely.
- Typography: owner explicitly revised the earlier brand-title-only serif preference: use **serif headings**, with **sans-serif body text and controls**, keeping a locally available stack and checking legibility/contrast.

## Phase 9B — checker-only alpha ratchet (2026-11-17)

- Added a strict, exact per-file legacy `rgba()` ledger and regression tests before alpha migration. Baseline 397 occurrences (369 CSS, 25 HTML, 3 JS); zero findings means the ledger matches, not that the site is alpha-tokenised. Only `variables.css` custom-property definitions are exempt from the legacy ledger. Conservative text scan limitations are documented in the phase record. UI and alpha migration await the owner’s batch confirmation and before/after visual evidence.

## Phase 9B — owner confirmed checker and first alpha migration (2026-11-17)

- Owner said “Yes continue” after the checker-only batch explanation; this confirms that batch, not future batches or deployment. Five identical white-overlay occurrences were moved to `--alpha-white-15` without changing their value. Await before/after owner screenshots and confirmation for this migration before moving on. Remaining alpha ledger: 392 occurrences. Branch shell `study-2026-11-17f` is not live; the live site remains `study-2026-11-17e` until an explicit merge/deploy command.


## Phase 9B — screenshot cadence revised (2026-11-17)

The owner asked for broader app-styled, phone-friendly CSS improvements and said screenshots are not required for every work item. Earlier per-batch screenshot instructions are therefore revised for Phase 9B: use supplied screenshots as evidence, do not block every iteration on new screenshots, and report which views remain unverified. This does not constitute visual approval of the completed site or permission to merge/deploy; final owner review, dark/print verification, safety gates and explicit publication authorization remain required.


## Phase 9B — merged, and the diverging branch retired (2026-11-17)

Owner command: complete the docs and merge. `arena/7e77489f-diploma-3rd-sem`
merged to `main` by fast-forward.

Two decisions are recorded because they were expensive and both remain tempting:

1. **`hub.css` stays a single sheet.** Splitting into `assets/css/families/*`
   was tried twice: per-family duplication gave 92 fingerprint differences,
   per-family emission 146. Rejected. Do not recreate that directory.
2. **Unit/subject rules stay in `hub.css`, not `subjects/units-com/common.css`.**
   `common.css` loads before `hub.css`, so a rule moved there loses the
   `[data-page]` specificity level: 1,496 anchors reverted to legacy colour.
   Rejected.

The per-page CSS fence moved 250 KB → 300 KB in the same pass (owner, Option A),
matching the `CSS_BUDGET_SINGLE` ceiling that `scripts/check_site.py` already
enforced. Heaviest page 171.5 KB.

**`arena/48a2ab20-diploma-3rd-sem` (draft PR #20) is superseded and must be
closed, not merged.** It shares base `816ef84` and overlaps 104 files with the
merged work; a second merge would be a 104-file conflict resolution rather than
an integration.

Merging is not a claim of device verification. Phase 10 owns physical-device,
screen-reader, zoom, print and offline evidence, and none of it exists yet.

## PYQ answer-depth review, step 1 — closing-fence repair (2026-11-26)

**Owner command:** "See pyqs answers are way too short accordingly to the given
number only python is correct can you analysis that?" — then, after the
analysis: "Ok start step 1", where step 1 was the formatting-only repair
proposed in that report.

**What the analysis measured** (no files changed in that pass): across the 302
Group B/C answers, the median is **7.1 words per mark in C, 7.6 in DS, 7.0 in
CSO and 7.5 in Algorithms**, against **16.6 in Python**. Median words for an
8-mark answer: 67 / 69 / 56 / 63 versus **145** in Python. Pearson r between
marks and answer length is 0.91 in Python and 0.44–0.63 everywhere else, i.e.
answer length barely tracks the marks outside Python. Twelve questions that
print "draw a diagram / flowchart" have no diagram in the model answer, and
sixteen that ask for a program or pseudocode have no code block. Bringing the
other four subjects to Python's standard needs roughly **10,200 more words
across 302 answers**. Python's own 2022 paper (`CST203-P001`) is the exception
inside Python: its 6-mark answers average 71 words against 163–259 elsewhere.

**Step 1, executed here:** 18 CST203 answers (P003 6, P004 3, P005 3, P006 6)
ended **inside an opened ``` code block with no closing fence**. One closing
fence was appended to each; nothing else changed. This is a formatting repair,
not a content edit: `question`, `options`, `correct`, `marks`, `markSplit`,
`subparts`, `topic`, `tags`, `unit` and the other 906 answers are byte-identical,
proved field by field against the previous commit. No answer certification is
inferred, and the ten open source-review findings are untouched.

- Recorded in `_data/pyq-integrity.json` as
  `reconciliation.answerSuffixRepairs` (exact-id allow-list, capped at 18) so
  the frozen-tree guard can tell this repair apart from drift. The Phase-12
  `unitMoves` record (44 retags) is preserved unchanged — an earlier draft of
  this repair overwrote it and the pipeline guard caught it, which is why that
  guard now also pins the fence list.
- `tests/test_data_pipeline.py` and `tests/test_algorithms_content.py` each
  gained a narrow allowance: listed ids only, stored answer must equal the
  frozen answer plus exactly one closing fence, and anything else still fails.
  Both were ablated (fence removed → fail; prose reworded → fail) before being
  claimed as protection.
- Derived data regenerated: `practice-pool.json` (18 `answer` scalars),
  `assets/cards/CST203.json` (18 `back` fields), search index, data version.
  No card was added, removed or re-keyed.
- Gates: **202/202 unittest**, 14/14 node suites, and all 13 dependency-free
  checks green.

**Deliberately not done in step 1** (each is a content GATE under `rule.md` §3
and needs its own owner yes): expanding the four short subjects' Group B
answers, fixing Python's thin 2022 paper, and adding the missing diagrams and
code blocks. The 12 inline-fence answers (`**b)** ```c` on one line) were also
left alone: they render correctly today.

## PYQ answer-depth review, step 2 — Algorithms (CST209) — 2026-11-26

**Owner command:** "Start with algorithm" — i.e. apply the step-1 analysis to
CST209, the subject the owner named, and bring its Group B answers up to the
length the marks actually justify.

**Reference used.** Python (CST203) was the owner's stated standard, so the
target is *its* measured shape, not an abstract target: CST203's 8-mark answers
have a median of **146 words** (18.2 words/mark) and its 2-mark answers **12
words**. The first draft of this pass overshot badly — medians of 414 words for
8-markers and 110 for 2-markers, i.e. 3× the reference — and was discarded
before it was committed. The committed answers match the reference: **8-mark
median 165 words (20.6/mark, CST203 146/18.2)** and **2-mark median 29 words
(CST203 12)**.

**What changed:** the `answer` prose of **47 CST209 Group B questions** — 12 in
P001 (2-mark), 9 in P003, 8 in P004, 9 in P005, 9 in P006 (all 8-mark). Total
length **2,936 → 6,362 words**; answers under 8 words/mark **28 → 0**. Medians
by subject now read Python 16.6, Algorithms 19.9, DS 7.1, CSO 7.6, C 7.0
words/mark. Question stems, options, keys, marks, `markSplit`, `subparts`,
`topic`, `tags` and `unit` are byte-identical, verified field by field against
the previous commit, and `check_pyq_integrity.py` reports 0 changed files.

**Every worked trace was computed, not written from memory.** Bubble-sort passes
and 13 swaps on `25, 57, 48, 37, 12, 92, 86, 33`; LSD radix rounds; KMP on
`ababcabcabababd`/`ababd` (`lps = [0,0,1,2,0]`, match ending at index 14);
naive search for `101110` in `1110101011101100` (**match at shift 6, 11
alignments, 30 comparisons** — my first draft said 7 alignments and the trace
was recomputed); Dijkstra, Bellman–Ford, Prim, Kruskal and Floyd–Warshall on
generated graphs; merge-sort and selection-sort splits; binary-search probes;
and the eight-word trie. Two questions print their graph only in the paper, so
the **frozen edge lists were recovered from the previous answers** rather than
invented: P003-Q30 and P005-Q21 both keep the stored `A–B=1 … A–D=10` edges and
the recorded **MST weight 10**, and P004-Q22 keeps `A→B(6) … E→F(3)` with
`B=1, C=3, D=5, E=0, F=3`. My draft had invented different weights and a wrong
39 total for P005-Q21; both were corrected before committing.

**Guard changes, both ablated before being claimed:**
`_data/pyq-integrity.json` gains `reconciliation.answerRewrites`, an exact
old-SHA-256 → new-SHA-256 pair per question (47 entries, no wildcard).
`tests/test_data_pipeline.py` accepts an answer only if the frozen text hashes
to `oldSha256` and the stored text to `newSha256`; every other field must still
be byte-identical. `tests/test_algorithms_content.py::test_both_frozen_trees_byte_identical`
extends its allowance to the five CST209 paper files, still pinned to CST209 and
capped at 47. Ablation: rewording one approved answer fails the hash assert, and
`validate_data --check-baseline` fails with it. The Phase-12 `unitMoves` (44)
and step-1 `answerSuffixRepairs` (18) records are preserved unchanged.

`docs/data/validation-exceptions.json` re-anchors exactly one `contentHash`,
`CST209-P003-Q34`, because its answer text changed; that question's open unit-5
finding is **not** waived. Derived data regenerated (`practice-pool.json`,
`assets/cards/CST209.json`, coverage, search manifest, data version
`data-ea84c159c175`). Gates: **202/202 unittest**, 14/14 node suites, all 13
checks green; all 47 answers render with balanced markup and no stray fences.

**Deliberately not done:** CSO (CST205), DS (CST201) and C (CST207) Group B
depth passes, the Python 2022 paper's thin 6-markers, and the missing
diagrams/code blocks for "draw a diagram" questions — each is a separate content
GATE and needs its own owner yes.

## Phase 13 accepted, and the decisions Phases 14–17 must inherit — 2026-11-19

**Owner command:** "All good. Ok then this phase is completed." Phase 13
(`CST203`, Python) is therefore **owner-passed** and merged to `main`. This
section is the register later phases read *first*; it exists so the same
questions are not asked, and the same defects are not rediscovered at the same
cost. Anything here is decided — re-asking is a defect, and changing one is a
GATE.

### Inherited law (applies to Phases 14, 15, 16, 17 without asking again)

1. **Word budgets are advisory; the ceiling is waived.** 2026-11-19, verbatim:
   *"No problem over budget."* Do not trim prose to hit a number, and do not ask
   before exceeding one. Weight-proportional sizing is the guide, not a cap.
   Phase 13 shipped 36,982w against a 23,018w baseline (+61%) and was passed as
   is. State sizes as facts in the record; never present a budget overrun as a
   defect to be fixed.
2. **Calibrate to the 2023–2026 PYQ window only.** `P003`–`P006` per subject;
   the `2021`–`2022` `P001`/`P002` papers stay archived and out of every weight
   calculation. Rank every topic into **Tier A / B / C / S / E** before writing
   a word; the tier ledger is the contract the record is judged against.
3. **Every anchor plan is a planning number, not a target.** Write what the
   material needs. If a topic has no heading to land on, **author the heading
   around prose that already exists** — never write new prose just to justify a
   heading, and never claim a heading count as coverage.
4. **The topic map is authored data with a written reason per judgement call.**
   `assets/data/topic-map-<subject>.json` under `assets/data/`, **never**
   `_data/<subject>/` (that directory is scanned as PYQ papers and the data
   pipeline breaks). Every multi-part topic whose subparts carry **unequal
   marks** needs an entry in `decisions` stating what decided it.
5. **`_data/` and `_quiz-data/` are byte-frozen in Mode A.** Any edit that
   rewrites a stored PYQ unit tag needs explicit owner approval (Mode B).
   Phase 13 shipped Mode A: the map overrides routing at read time, the paper
   data was never touched.
6. **Videos are inserted only after verification, and are plain `<a>` links.**
   Zero `<iframe>`, zero `youtube-nocookie` embeds, zero `ytimg` thumbnails, no
   runtime third-party request. Do not pre-fill a URL you have not opened.
7. **No browser exists in this environment.** Every claim about rendering is a
   source-level argument plus an estimate, and must say so. Owner screenshots
   are the only rendered evidence. Phase 13's single most expensive mistake was
   asserting layout correctness that no test could see (see §4.8 of the Phase 13
   record and item 4 below).

### Defects that repeat across subjects unless actively prevented

These each cost real time in Phase 13. Phases 14–17 will meet them again.

1. **Prose hygiene has no gate.** Raw question IDs (`P004-Q13`), subject codes
   (`CST213`) and literal markdown backticks shipped into learner-facing HTML in
   Phases 13.1–13.5 and were invisible to all 13 gates and 151 tests. Grep for
   `P00[0-9]-Q`, the subject code, and a stray backtick **before** declaring any
   content part done. Ten occurrences were found and fixed in 13.6.
2. **Generic-landing regressions hide behind a green routing triple.** The
   `same / redirect / unmatched` triple stayed `95 / 9 / 0` while **18** questions
   were landing on coarse chapter cards instead of concept headings. Always
   measure *specificity of landing*, not just same-unit correctness.
3. **A "reduce generic landings" criterion can be met vacuously.** On `CST203`
   it went 0 → 0 because earlier parts had already removed the generic cards. A
   vacuous pass is not evidence: say so, and substitute a measured row that
   actually moves. Phases 14–16 may still have real generic landings to reduce;
   measure first, then claim.
4. **A layout bug can pass every test.** `.section-content` carried
   `max-height: 6000px; overflow: hidden` as the *resting* open state. Long
   sections on a 360px phone exceeded it, and `.section:has(.table-wrapper)
   { overflow: visible }` let the overflow paint over the next section's text —
   body text visibly interleaved with another section. `CST201` unit-2 `#loops`
   was the worst case (~9,332px) and had been wrong for months. **The repo had
   no layout assertion at all.** There is now one:
   `tests/test_section_clipping.py`. Before shipping long content, run it and
   re-read it, and if new layout invariants appear, add a test rather than
   trusting the gate chain. Never reintroduce a fixed pixel `max-height` on
   `.section-content`; `.collapsed` owns clipping.
5. **Test-writing is part of the work, and a failing test may be your own
   reasoning.** Three of Phase 13.6's tests were wrong before they were right,
   and the corrected version then exposed five genuine gaps in the agent's own
   analysis. When a new guard fails, first ask whether the code is wrong or the
   guard is; then fix whichever it is, and never loosen an assertion to make it
   green. Ablate every new guard (break the code, watch it fail) before
   claiming it protects anything.
6. **Full-suite ordering artefacts.** `build_coverage` /
   `build_data_version` / `build_icon_subset` tests mutate shared generated
   files. Run the rebuild chain
   (`build_search_index → build_coverage → build_icon_subset →
   generate_presence ×2 → build_data_version`) **after** the suite, then
   re-verify — never loosen the tests. `test_coverage_file_is_reproducible`
   needs `generate_presence.py` twice to reach stable bytes.
7. **Removing a `<pre>` or box that used a Font Awesome icon changes the
   generated icon subset** and trips `test_unknown_icon_names_stay_visible`.
   Restore the icon on equivalent content.

### Engineering choices Phases 14–17 should copy

- **Content parts order:** rewrite a unit end-to-end (heading anchors → prose →
  executed-and-verified code → videos → practice bank), then measure. Do not
  interleave units; the record's before/after only means something per unit.
- **Every Python block must `ast.parse`,** or be explicitly labelled
  non-Python / not-executed. Django is not installed here, so Unit 5's blocks
  are labelled rather than faked. Apply the same honesty per subject.
- **Locked anchors are law:** the `guides.json` anchors and every existing
  `<section id>` are preserved; `unitAnchored` in `tests/test_discovery.py` and
  `ORDER_DEPENDENT` in `tests/test_routing_order.py` are updated as counts, not
  relaxed. Phase 13 ended at `unitAnchored` 634 / `ORDER_DEPENDENT['CST203']` 30.
- **Regenerate deterministically.** Keep the generator script that produced any
  authored data file so the file can be rebuilt and audited; Phase 13's map came
  from a single script and was verified by re-running it.
- **Doubt is recorded, not resolved silently.** Phase 13 flagged eight arguable
  map entries in the data file's own `decisions` block and in the phase record.
  Mark a judgement call "Flagged" where a reader will meet it; do not bury it.

### Environment facts (do not re-derive)

- No browser: `playwright-core` absent, no Chromium, no `weasyprint`. Both
  `tests/*-browser.cjs` suites cannot run here and 11 node suites are
  env-blocked; that is pre-existing, not a regression. Do not `curl` YouTube
  (TLS exit 35) — use page fetch. Django, NumPy, SciPy, matplotlib and pandas
  are **not installed**.
- Gates that must be green before any part is called done: `check_site --strict`,
  `audit_accessibility --fail`, `check_tokens --strict`, `check_pyq_integrity`,
  `build_suggestions --check`, `validate_data`, `validate_syllabus`,
  `check_readme_paths`, `check_root_rewrite`, `check_platform`,
  `audit_page_weight --budget`, `build_icon_subset --check`,
  `build_data_version --check` — plus the full `unittest` suite. Phase 13 closed
  at **157/157 unittest** and 13/13 gates.
- Phase 17 exists to catch anchor rot in the maps Phases 13–16 author. Its
  scope is unchanged and it still runs last; do not move it earlier to "save a
  pass".

### Next phase — nothing pre-authorized

Phase 13's pass accepts Phase 13 only. **No Phase 14–17 work, PR, deploy or
publication is authorized by it.** When the owner starts the next phase, cut a
fresh Arena branch from the merge commit and read the branch name from Git —
`rule.md` and `prompt.md` are only as current as the last commit that touched
them, and Git wins when they disagree.

The recommended execution order remains **15 (CSO) → 16 (Algorithms) → 14 (Data
Structures)**, by 2023–2026 weight-to-page gap, with Phase 17 last. That order is
a recommendation recorded in the blueprints, not an owner decision — if the owner
names a different subject, take the owner's.
