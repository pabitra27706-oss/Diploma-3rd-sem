# Phase 0 — Foundation

**Status:** ✅ done (2026-11-06) · **Parts:** 4 · **Owner gates:** none

## Goal

Give the repository a brain before giving it features: a web playbook that
replaces the Android one, this site's own operating rules, a truthful baseline
of what is broken, and an executable gate that a phone can run.

## Why it came first

The audit produced exact numbers — 12 broken references, 198 warnings, 992 PYQs
all on practice day 1, 456 unanswerable quiz items — but nothing in the repo
could re-check them. Without a gate, every later phase would be judged by
memory. Without rules, every later chat would re-litigate the same decisions.

## Scope

- **In:** `webflow/` playbook, `rule.md`, `prompt.md`, `docs/` (roadmap,
  decisions, research, design, audit), the stdlib checker, CI workflow,
  archiving the legacy prompt, adding the syllabus.
- **Out:** any change to a shipped page, any deploy, any licence decision, any
  content verification.

## Parts

| Part | Title | Status |
|---|---|---|
| 0.1 | Playbook (`webflow/`) adapted from AppFlow for zero-build static web | ✅ |
| 0.2 | Site adoption docs and rules | ✅ |
| 0.3 | `scripts/check_site.py` + CI workflow | ✅ |
| 0.4 | Baseline measured, syllabus transcribed, phases planned | ✅ |

Details and acceptance evidence: [`tasks.md`](tasks.md).

## What exists now that did not before

- `python3 scripts/check_site.py --strict` — links, JSON, structure, a11y
  basics, subpath safety, sprite symbols, budgets.
- `python3 scripts/validate_syllabus.py` — syllabus shape + coverage join.
- `webflow/` — a reusable playbook for the next site, not just this one.
- `docs/syllabus/` — the Council's PDF plus a machine-readable transcription.

## Done means

Baseline recorded and reproducible · CI green · rules and decisions committed ·
no site feature changed · nothing deployed.

## Risks carried forward

- CI runs in baseline mode until Phase 1 clears the 12 errors, so a red
  reference could hide behind a green check. Phase 1.6 removes that.
- The syllabus transcription is manual; Phase 2 must validate it against the
  data before anyone trusts a coverage percentage.
