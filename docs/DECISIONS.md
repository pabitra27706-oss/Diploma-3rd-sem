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
- 2026-11-06 — License? — **Open (GATE).** The README badge links `LICENSE`,
  which does not exist. Owner must choose MIT or GPL-3.0 before a launch
  phase; until then no new license text is invented.
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
- Site licence: MIT or GPL-3.0 (GATE).
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
