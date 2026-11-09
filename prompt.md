# Diploma 3rd Sem Study Hub — continuation prompt

> **Self-contained handoff. Paste this file as the first message of the next
> chat, then give one command** (e.g. `start phase 1` or a bug report).
> This repo is self-contained: `rule.md` holds the full rules, `docs/` the plan
> and decisions, THIS FILE the living state. WebFlow (`webflow/`) is the
> provenance playbook only — nothing here depends on it.
> Update this file at the end of every phase, in the same commit as the phase
> record.

## Identity (fixed)

- Site: Diploma 3rd Semester — CST Study Hub
- Repo: `pabitra27706-oss/Diploma-3rd-sem` · branch
  `arena/be3d9178-diploma-3rd-sem`
- Live URL: `https://pabitra27706-oss.github.io/Diploma-3rd-sem/` ·
  **base path `/Diploma-3rd-sem/`**
- Stack: zero-build static HTML/CSS/JS + JSON + service worker, GitHub Pages
- Money: none — no ads, payments, donations, or analytics
- License: **unset — GATE** (README badge still links the missing `LICENSE`)
- Provenance: bootstrapped from WebFlow @ `4bc8b0b` (reference only)

## Rules digest (full rules: `./rule.md` — self-contained)

- **Owner delivery rule (2026-11-09):** after every completed phase, write a
  short report directly in chat (changes, actual checks, blockers, next step,
  publication status). At the end of **every chat**, even docs-only or incomplete
  work, give copyable Termux local-testing commands and the exact browser URL.
  State prerequisites, checkout assumptions, and whether changes are pushed;
  see `rule.md` §7.

- One **phase** per chat; a phase is one whole capability with 4–6 parts and its
  own folder under `docs/phases/`. No work outside those parts.
- Never create/switch branches, push `main`, force-push, or `reset --hard`.
- No PR, merge, deploy, Pages change, domain change, or announcement without an
  explicit command in chat. Green CI is not authorization.
- **Ask less, gate always** (`rule.md` §3). Recorded answers in
  `docs/DECISIONS.md` are never re-asked.
- Evidence before hypothesis (`file:line`, command output, or syllabus page).
- Gate: `check_site.py --strict`, `validate_data.py`, `validate_syllabus.py`,
  `validate_pyq.py`, JS parse — all in CI, with the `site-preview` artifact.
- Zero build · base-path safe · offline-first · no third-party runtime request ·
  one storage module · one token file · syllabus is the content authority.
- Reuse scan per part, recorded as a "Reused" line.

## State (update at every phase end)

- **Phase 0 ✅ Foundation (2026-11-06)** — `webflow/` playbook, `rule.md`,
  this file, `docs/` (AUDIT, ROADMAP, DECISIONS, RESEARCH, DESIGN), the stdlib
  gate, CI, and the syllabus package.
- **Plan reshaped (2026-11-06):** ten big phases, each with a folder under
  `docs/phases/` (`00-foundation` … `09-performance-launch`), covering every
  capability in the gap report. `docs/ROADMAP.md` is the status board.
- **Syllabus added:** `docs/syllabus/syllabus-3rd-sem-2022.pdf` (authority) +
  `syllabus.md` + `syllabus.json` + `scripts/validate_syllabus.py`.
- **Baseline from the gate:** 12 errors, 198 warnings — 1 missing page, 7
  repo-escaping links, 3 nonexistent sprite symbols, 55 pages without a skip
  link, 36 without `<main>`, 36 without a description, 62 root-relative
  references, 9 empty files.
- **New findings from the syllabus join:** CST205 ×4 and CST209 ×3 PYQs tagged
  Unit 5 in four-unit courses; CST207 has no quiz bank; CST211/CST213/CST215 and
  SI201 have no pages; PYQ distribution is Unit-1 heavy (CST203 140/204, CST201
  112/198); hours reconcile to 30/30/45/60/60.
- **Decisions recorded (never re-ask):** zero-build static; Pages subpath; no
  money/no analytics; every suggested capability approved; big phases with
  folders; syllabus PDF is the authority; measurement = local-only + contact
  (no third-party analytics); domain = readiness only, no purchase.
- **Open gates:** license (MIT/GPL-3.0), content verification per batch
  (Phase 2.5 / 8.6), deploy (never requested), domain purchase (not requested).
- **Phase 1 platform implementation ✅ (2026-11-09):** scope-relative manifest/SW,
  six real icons, install/update controller, link/sprite repairs, locally hosted
  Font Awesome 6.5.1, 404, generated sitemap/robots/metadata, real before/after
  screenshots, strict site/platform CI. `check_site.py --strict`: 0 errors,
  97 warnings, 0 root-relative. PYQ/JSON/JS/platform checks pass. Headless Chromium
  offline and waiting-worker update tests pass; real phone/iOS install and social
  unfurl remain unverified. No deploy/PR/merge.
- **Phase 1 CI evidence:** run `42633146154` green on `560073e`; `site-preview` artifact `13680983233` includes six before/after screenshots and the static site.
- **Explicit unresolved subtask:** full syllabus `--strict` still fails on seven
  existing Unit-5 records in four-unit courses. Coverage remains advisory per
  the recorded Phase 2 decision; no source-gated content changed. Not a full
  syllabus-strict success or an owner waiver.
- **Phase 2 🚧 (2026-11-09):** mechanical pipeline implemented, **not complete**.
  `scripts/{build_data_catalog,build_practice_days,validate_data}.py`, generated
  `_data/{catalog,practice-days}.json`, data review docs, safe no-key scoring/UI,
  runtime counts and actual bank source/year options. 992 raw IDs preserved;
  923 exact-unique Practice questions across 10 days (92–93/day), 69 safe aliases.
  321 generic topics labelled; four count mismatches fixed. 456 non-MCQ quiz keys
  missing/ungraded; 90 text-only candidate joins, 366 unmatched, **0 imported**.
  CST207 not offered for quizzes; 120 January-2026 PYQs remain in paper/Practice
  only pending review. Cache version `data-2026-11-09`.
- **Phase 2 gate:** full data strict FAILS on 10 fingerprinted source-review
  findings: seven PYQ unit tags, CST209 Unit-5 bank (35 questions), CST201 U3/U4
  reversed bank mappings. Full syllabus strict FAILS on 3 grouped errors.
  CI uses exact `--check-baseline` regression checking, **not** strict approval.
  No new unit/source/answer text invented or retagged. Review
  `docs/data/source-review-batch-01.md` (first 40 key candidates with citations)
  and `validation-exceptions.json`. Need explicit owner/source dispositions.
- Phase 2 checks: site/platform/PYQ PASS (site 0 errors / 97 warnings), 5 unit
  tests, 23 JS/CJS + 60 JSON parse PASS. Real headless Chromium data/filter/no-key
  and offline/update regression tests PASS. Screenshots under Phase 2 folder.
- Next: **continue Phase 2 at source-verification gate**, NOT Phase 3.


## How to continue

1. Read `docs/phases/02-data-pipeline/{README.md,tasks.md}`, the Phase 1 record,
   `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/DESIGN.md`, `docs/AUDIT.md`.
2. Create Phase 2 `record.md` from the phase-record template before implementation.
3. Implement 2.1 validator; 2.2 practice-day map; 2.3 computed counts/unit maps;
   2.4 duplicate provenance; 2.5 answer-key coverage (owner verification gate);
   2.6 bank currency. The mechanical work is already implemented: do not redo it.
   Resolve the source-review gate with the owner before applying any question
   remapping, reprint labels or answer imports; never infer approval from a
   generic “continue”. Keep Phase 2 in progress until full strict gates pass.
4. Keep strict site/platform checks green, run all validators and JS/JSON parse,
   capture evidence, update docs and this prompt; print next-chat prompt in chat.
   Stop at deploy gate. Read the Phase 1 record for browser limitations and the
   unresolved full-syllabus-strict acceptance subtask.
