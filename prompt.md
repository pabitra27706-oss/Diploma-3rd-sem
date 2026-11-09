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
- License: **unset — GATE** (README badge links a missing `LICENSE`)
- Provenance: bootstrapped from WebFlow @ `4bc8b0b` (reference only)

## Rules digest (full rules: `./rule.md` — self-contained)

- One **phase** per chat (2–4 parts, one whole capability). No work outside the
  current phase's "Done means".
- Never create/switch branches, push `main`, force-push, or `reset --hard`.
- No PR, merge, deploy, Pages change, domain change, or announcement without an
  explicit command in chat. Green CI is not authorization.
- **Ask less, gate always** (`rule.md` §3). Recorded answers in
  `docs/DECISIONS.md` are never re-asked.
- Evidence before hypothesis (`file:line`); `docs/AUDIT.md` is the 2026-11-06
  baseline, not a substitute for reading the file.
- Quality gate: `python3 scripts/check_site.py` (errors = 0),
  `python3 scripts/validate_pyq.py`, JS parse — all in CI, with the
  `site-preview` artifact uploaded. No local browser exists here.
- Zero build · base-path safe · offline-first · no third-party runtime request ·
  one storage module · one token file.
- Reuse scan per part, recorded as a "Reused" line.

## State (update at every phase end)

- **Phase 0 ✅ Bootstrap (2026-11-06)** — `webflow/` playbook created, this
  repo adopted: `rule.md`, `prompt.md`, `docs/` (AUDIT, ROADMAP, DECISIONS,
  DESIGN), `scripts/check_site.py`, `.github/workflows/ci-web.yml`. Legacy chat
  dump archived to `docs/archive/legacy-prompt-2026-11.md`.
- Baseline from the gate: **12 errors, 198 warnings** (all recorded in
  `docs/AUDIT.md`): 1 missing page, 7 repo-escaping links, 3 nonexistent sprite
  symbols (4 pages), 55 pages without a skip link, 36 without `<main>`, 36
  without a meta description, 62 root-relative references, 9 empty files.
- Decisions recorded (never re-ask): zero-build static, GitHub Pages subpath,
  no money model, no analytics, playbook lives in `webflow/`.
- Open gate items: **license** (unset), **deploy permission** (none requested
  yet), **content verification owner** for Phase 7.
- Next: **phase 1 — Deploy and PWA integrity** — parts: 1.1 path sweep to
  relative URLs; 1.2 manifest + service worker + real icons under the subpath;
  1.3 missing sprite symbols + broken/escaping links; 1.4 flip the gate to
  `--strict`.

## How to continue

1. Read `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/DESIGN.md`, `docs/AUDIT.md`
   and the latest `docs/phases/` record — trust the repo, not memory.
2. Implement **phase 1**, all four parts, evidence-first.
3. End with: `check_site.py --strict` clean (errors = 0) · `validate_pyq.py`
   PASS · JS parse clean · `site-preview` artifact · `docs/phases/01-deploy-pwa.md`
   (say what the preview shows and what could not be verified without a browser)
   · roadmap row ✅ · this file updated · short report · **the next-chat prompt
   printed in chat** · stop at the deploy gate.
