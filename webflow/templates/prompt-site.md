<!-- SPDX-License-Identifier: MIT -->

# [SITE] — continuation prompt

> **Self-contained handoff. Paste this file as the first message of the next
> chat, then give one command** (e.g. `start phase 2` or a bug report).
> This repo is self-contained: `rule.md` holds the full rules, `docs/` the plan
> and decisions, THIS FILE the living state. WebFlow is provenance only —
> nothing here depends on it. Update this file at the end of every phase, in the
> same commit as the phase record.

## Identity (fixed)

- Site: [name] · repo: [owner/repo] · base path: `/[repo]/` (or [domain])
- Stack: zero-build static HTML/CSS/JS · host: GitHub Pages
- Money: none — no ads, payments, donations, or analytics
- Provenance: bootstrapped from WebFlow @ [full 40-char SHA] (reference only)
- Git author: [designated address] · session branch: [arena/…] · never push
  `main`, never deploy or enable Pages without an explicit command

## Rules digest (full rules: `./rule.md` in THIS repo — self-contained)

- Work one **phase** per chat (a phase = 2–4 parts, one whole capability). No
  work outside the current phase's "Done means".
- Never create/switch branches, push `main`, force-push, or `reset --hard`.
- No PR, merge, deploy, Pages change, domain change, or announcement without my
  explicit command in chat. Green CI is not authorization.
- **Ask less, gate always** (`rule.md` §3): GATE items are asked once, in one
  Summary batch. DECIDE-ONCE answers live in `docs/DECISIONS.md` and are
  **never re-asked**. Everything else is researched or decided-and-logged.
- Evidence before hypothesis (`file:line`). Checks green, with the downloadable
  `site-preview` artifact uploaded. Docs ride with the code commit: phase
  record, roadmap status, `prompt.md`.
- **Reuse first** (frozen `knowledge/reuse-first.md`): research before building
  any part; record DEPEND/ADAPT/STUDY/BUILD/REJECT per part; log shipped
  licences in `docs/DECISIONS.md`.
- **Zero build, base-path safe, offline-first, no third-party runtime request**
  (`rule.md` §5).
- **Tokens first** (frozen `knowledge/design-system.md`, `docs/DESIGN.md`): no
  page styled before the token set is frozen; no hard-coded colour.

## State (update at every phase end)

- Phase [N] ✅ [one line] · CI run [id] · `site-preview` shows [what]
- Decisions digest: [audience · language · base path · design direction ·
  time budget · license — or "see docs/DECISIONS.md"]
- Next: **phase [N+1] — [title]** — parts: [N+1].1 … [N+1].3
- Open risks / owner items: [ ]

## How to continue

1. Read `docs/ROADMAP.md`, `docs/DECISIONS.md`, and the latest `docs/phases/`
   record — trust the repo, not memory.
2. Implement **phase [N+1]**, all its parts, evidence-first.
3. End with: checks green (frozen `knowledge/quality-without-a-device.md` §1) +
   the run's `site-preview` artifact · `docs/phases/[NN]-<slug>.md` (say what the
   preview shows) · roadmap row ✅ · this file updated · short report (run id,
   tip sha, artifact, what is now visible) · **the next-chat prompt printed in
   chat** (from `templates/next-chat-prompt.md`, fully filled) · stop at the
   deploy gate.
