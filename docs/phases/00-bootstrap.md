# Phase 00 — bootstrap

- Status: ✅ · Date: 2026-11-06 · Branch: `arena/6b499a13-diploma-3rd-sem`
- Provenance: WebFlow @ `4bc8b0b` (reference only; this repo is self-contained)
- **Preview:** the work is documentation + tooling, so there is no new UI. What
  became visible: a working local gate (`python3 scripts/check_site.py`) whose
  output now names every broken reference instead of hiding it, plus a CI
  workflow that uploads the whole site as `site-preview` on every push.

## Parts

- 00.1 — `webflow/` playbook (rules, plan, prompts, knowledge, templates, CI
  template) — done
- 00.2 — repo adoption: `rule.md`, `prompt.md`, `docs/{ROADMAP,DECISIONS,
  RESEARCH,DESIGN,AUDIT}.md`, legacy prompt archived — done
- 00.3 — `scripts/check_site.py` + `.github/workflows/ci-web.yml` — done
- 00.4 — baseline measured and recorded — done

## Reused

- 00.1 — **ADAPT** — AppFlow's structure (PLAN/START/RULES/PROMPTS/knowledge/
  templates), rewritten for zero-build static web; no AppFlow text or file
  copied verbatim into a shipped page (playbook prose is documentation only).
- 00.3 — **BUILD** — no dependency-free site checker was found that covers
  subpath safety + sprite symbols + duplicate ids + budgets in one stdlib
  script. Scanned: html-validate, linkinator, pa11y (all npm); they remain
  options for CI later, but a phone cannot install them.

## Evidence (before the change)

- `scripts/check_site.py` on `4bc8b0b`: **12 errors, 198 warnings**.
  Errors: `index.html` → missing `info/contact.html`; seven `info/*.html` →
  `../../index.html` (outside the repo); `practice/index.html` and
  `practice/session.html` → sprite symbols `filter`, `save`, `shuffle` that do
  not exist in `assets/icons/sprite.svg`.
- Warnings by cause: 55 pages without a skip link; 36 without `<main>`; 36
  without a meta description; 62 root-relative references; 9 empty files.
- `python3 scripts/validate_pyq.py`: PASS — 30 papers, 992 records, 0/0.
- JS: 20 files parse; JSON: 55 files parse.

## What shipped

- `webflow/README.md`, `PURPOSE.md`, `RULES.md`, `PLAN.md`, `START.md`,
  `PROMPTS.md`, `common-prompt.md`, `MAINTENANCE.md`, `SITE_LIST.md`, `LICENSE`
- `webflow/knowledge/`: `reuse-first.md`, `web-engineering.md`,
  `quality-without-a-device.md`, `design-system.md`, `web-references.md`,
  `niche-method.md`, `launch-blockers.md`
- `webflow/templates/`: `rule-site.md`, `prompt-site.md`, `readme-site.md`,
  `next-chat-prompt.md`, `ci-web.yml`, `site-checklist.md`, `privacy-page.md`,
  `pwa-checklist.md`, `docs-system/{RESEARCH,ROADMAP,DECISIONS,PHASE_RECORD,DESIGN}.md`
- Root `rule.md`, `prompt.md`; `docs/DECISIONS.md`, `docs/ROADMAP.md`,
  `docs/RESEARCH.md`, `docs/DESIGN.md`, `docs/AUDIT.md`
- `scripts/check_site.py` (stdlib only), `.github/workflows/ci-web.yml`
- `docs/archive/legacy-prompt-2026-11.md` (the old 1,813-line prompt dump)

## Checks (no-device gate)

- JS parse: **pass** (20 files) · JSON: **pass** (55 files)
- Links/assets: **12 broken**, all listed above · root-relative: **62**
- HTML/a11y: 55 missing skip links, 36 missing `<main>`, 36 missing
  descriptions, 0 duplicate ids reported, 0 unresolved static ids
- Budgets: reported; largest data files are within 1 MB
- **Not run / not verifiable here:** any browser render, service-worker
  install, install prompt, focus order, tap targets, Lighthouse, axe. No browser
  or device exists in this environment.

## Design comparison

Not applicable — no UI changed.

## Next-chat prompt

- [x] Printed in chat at phase end, fully filled for phase 1.

## Follow-ups

- Phase 1 clears all 12 errors, then CI flips to `--strict`.
- License gate still open (`docs/DECISIONS.md`).
- `webflow/` prose is documentation and ships with the site; that is acceptable
  (no runtime cost) but it is excluded from the link checker's root scan to keep
  the gate focused on served pages.
