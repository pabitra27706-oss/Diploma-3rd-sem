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
