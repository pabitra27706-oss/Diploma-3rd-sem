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

## Third-party licences (everything shipped, per reuse-first §3)

- 2026-11-06 — Font Awesome (CDN, 38 pages) — **not verified in this repo, no
  licence file or attribution page evidence recorded** — flagged in
  `docs/AUDIT.md`; removal planned in Phase 1 (a CDN is also a third-party
  runtime request and breaks the offline claim).
- 2026-11-06 — `assets/icons/*.png` and `assets/icons/sprite.svg` — repo-local
  assets, origin unrecorded. Confirm before a public launch.

## Open (gate or decide-once items not yet asked)

- Site licence: MIT or GPL-3.0 (GATE).
- Who verifies syllabus/answer-key content, and against which source edition
  (needed before Phase 7).
- Whether a custom domain is ever intended (changes the base path).
- Whether the six empty PWA icons are replaced by generated artwork or by a
  single icon at two sizes (design decision, Phase 1).
