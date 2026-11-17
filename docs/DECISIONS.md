# Decisions — Diploma 3rd Sem Study Hub

> The anti-re-ask register (`rule.md` §3). Every question is answered here
> ONCE. Later chats read this file before asking anything. Re-asking a recorded
> answer is a defect. Changing an owner answer is a GATE.

## Owner decisions

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

- None. Time budget remains four weeks from 2026-11-06.

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
  (mirroring Phase 4's `WARM_SEARCH`). The worker `VERSION` moves to
  `study-2026-11-17` so old caches drop on activation. Coverage means "cached
  after one study page load", not first-visit offline, and not survival under
  browser eviction.
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
