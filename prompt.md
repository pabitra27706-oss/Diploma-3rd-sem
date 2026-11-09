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
  `arena/6b499a13-diploma-3rd-sem`
- Live URL: `https://pabitra27706-oss.github.io/Diploma-3rd-sem/` ·
  **base path `/Diploma-3rd-sem/`**
- Stack: zero-build static HTML/CSS/JS + JSON + service worker, GitHub Pages
- Money: none — no ads, payments, donations, or analytics
- License: **unset — GATE** (README badge still links the missing `LICENSE`)
- Provenance: bootstrapped from WebFlow @ `4bc8b0b` (reference only)

## Rules digest (full rules: `./rule.md` — self-contained)

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
- Next: **phase 1 — Platform and deploy integrity** — parts 1.1 base-path sweep;
  1.2 PWA shell; 1.3 install/update UX; 1.4 link, sprite, dead-file repair;
  1.5 web presence (404/robots/sitemap/canonical/OG); 1.6 CI strict.

## How to continue

1. Read `docs/phases/01-platform/README.md` and `tasks.md`, then
   `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/DESIGN.md`, `docs/AUDIT.md` —
   trust the repo, not memory.
2. Create `docs/phases/01-platform/record.md` from
   `webflow/templates/docs-system/PHASE_RECORD.md` at the start.
3. Implement all six parts, evidence-first, one area at a time; screenshot the
   touched areas before and after.
4. End with: `check_site.py --strict` → 0 errors and 0 root-relative paths ·
   `validate_pyq.py` PASS · `validate_syllabus.py` run · JS/JSON parse clean ·
   `site-preview` artifact · record written (including what could not be
   verified without a browser) · roadmap row ✅ · this file updated · short
   report · **the next-chat prompt printed in chat** · stop at the deploy gate.
