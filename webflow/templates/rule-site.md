<!-- SPDX-License-Identifier: MIT -->

# [SITE] — rules

> The operating manual for THIS repository — **self-contained**: follow it even
> if no other repo is reachable. Derived from WebFlow @ `<sha>` (provenance
> only; the text below is authoritative for this site). Owner answers and
> waivers live in `docs/DECISIONS.md`; the living state lives in `prompt.md`.

## 1. Identity

- Site: [name] · repo: [owner/repo] · base path: `/[repo]/` (or [domain])
- Stack: zero-build static HTML/CSS/JS · host: GitHub Pages (or [host])
- License: MIT/GPL-3.0 · privacy page: [path]
- Git author: [designated address for THIS repo] · session branch only
- Time budget: [4 weeks — or the owner-approved waiver recorded in
  `docs/DECISIONS.md`, with date]
- Money: none — no ads, payments, donations, affiliates, or analytics

## 2. Branching and the deploy gate (law)

- Work only on the assigned session branch. Never create/switch branches,
  push `main`, force-push, or `git reset --hard`.
- Commit and push the session branch freely. Before committing, verify
  author/committer identity with `git var` and inspect the commit before
  pushing. Never use an agent's personal email/account.
- The agent never opens a PR, merges, pushes `main`, enables Pages, deploys,
  changes a domain, tags a release, or announces the site without my explicit
  command in chat. Green CI is evidence, not authorization. "Open a PR" does
  not mean "merge", and neither means "deploy".
- One phase at a time; never a second PR while one is open.

## 3. Questions — ask less, gate always

**GATE — always ask; never act without an explicit yes:**
repo creation · site name, repo name, base path or domain · git author
identity · license if unfixed · PR · merge · `main` push · enabling Pages ·
deploy · publishing a URL · announcement · money in any form · legal actions ·
other people's personal data · waiving a law of this file · changing an answer
recorded in `docs/DECISIONS.md`.
→ One Summary batch per gate moment, ≤4 questions, each naming its gate.

**DECIDE-ONCE — ask once (normally the plan chat), record in
`docs/DECISIONS.md` with date:** audience · language/locale · scope cuts ·
design direction · time budget · hosting target.
→ Never re-ask a recorded answer — that is a defect, not caution. Changing one
is a GATE.

**DEFAULT — never ask:** researchable facts (research, cite source + date) ·
reversible implementation choices (log under Agent decisions) · anything
already answered in chat or docs · taste with an obvious default.

## 4. Work cycle — one phase per chat

1. Verify state first: `git status`, `git log`, PRs, CI runs. Trust the
   repository, not memory.
2. Evidence before hypothesis: `file:line` reads against the current tree. No
   fix on a guess.
3. Reuse scan first, then implement the current phase only (2–4 parts; one
   whole capability). Before building any part, check whether a verified
   pattern or library already does it (frozen
   `knowledge/reuse-first.md`; DEPEND/ADAPT/STUDY/BUILD/REJECT) and open the
   phase record with its "Reused" line. Its "Done means" cell in
   `docs/ROADMAP.md` is the acceptance test. Nothing outside it.
4. Quality gate green, **without a local browser**: the no-device checks
   (frozen `knowledge/quality-without-a-device.md` §1 — parse + link + HTML/a11y
   + budgets in CI) are part of "Done means". CI is the executor of record and
   must upload the downloadable **`site-preview`** artifact — every phase must
   be visible to me as screenshots in that artifact.
5. Docs ride with the code commit: `docs/phases/NN-<slug>.md` record
   (including what the preview shows), roadmap status, `docs/DECISIONS.md` if
   anything new, and `prompt.md` updated.
6. Report (run id, tip sha, artifact name, what is now visible), then **print
   the next-chat prompt IN CHAT** — one fully-filled copyable block from
   `templates/next-chat-prompt.md` for the next phase (parts, "Done means",
   decisions never to re-ask, CI facts). I start the next chat by copying it
   from chat; I never have to open GitHub, the branch, or any file. `prompt.md`
   in the commit is backup only. Then **stop at the deploy gate** (§2).

## 5. Invariants — do not break (append site-specific ones as phases decide)

- Zero build: the committed files are what the host serves. No bundler, no
  preprocessor, no `node_modules` in the shipped path.
- No backend, login, analytics, ads, trackers, or third-party runtime request.
- Base-path safety: every internal URL works under `[base path]`; no
  root-relative path unless the base is `/`.
- Offline-first: the shell and core data load with no network after first use;
  the offline claim on the site is true of the shipped build.
- One token file, one theme key, one storage module, one data loader. Pages do
  not write raw `localStorage` or hard-code colours.
- Accessibility floor: WCAG 2.2 AA on shipped pages — skip link, one `<main>`,
  one `<h1>`, labels, visible focus, measured contrast, reduced motion.
- Every number the site shows is computed from its data, never typed by hand.
- Every claim on the site (offline, privacy, "verified", "AI") is true of this
  build; the privacy page lists every storage key and network request.
- No secrets, credentials, or other people's personal data in git or chat.
- Agent-invented facts are never shipped; content claims are the owner's to
  verify.
- Reuse stays lawful: MIT/Apache/BSD code may be depended on or adapted with
  attribution; GPL only into a GPL site; studied sources are re-implemented
  clean-room, never copied. One library per job, no dependency without a
  recorded verdict.
- Kill fast: the pre-written kill test in `docs/RESEARCH.md` decides
  ship-next vs iterate — never rewrite the test after seeing results.
- [site-specific invariants appended here as decided]

## 6. Definition of done (any change)

Checks green (incl. the no-device gate) · `site-preview` artifact uploaded ·
docs updated · `prompt.md` current · next-chat prompt printed in chat · short
report — then stop. A **public launch** additionally needs every item in
`templates/site-checklist.md` (or the site's `docs/` copy) green and my
explicit deploy command.
