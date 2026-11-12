# Diploma 3rd Sem Study Hub — rules

> The operating manual for THIS repository — **self-contained**: follow it even
> if no other repo is reachable. Derived from WebFlow (`webflow/` at commit
> `4bc8b0b`) — provenance only; the text below is authoritative for this site.
> Owner answers and waivers live in `docs/DECISIONS.md`; the living state lives
> in `prompt.md`; the evidence base is `docs/AUDIT.md`.

## 1. Identity

- Site: Diploma 3rd Semester — CST Study Hub
- Repo: `pabitra27706-oss/Diploma-3rd-sem` · branch: `arena/be3d9178-diploma-3rd-sem`
- Host: GitHub Pages · live URL: `https://pabitra27706-oss.github.io/Diploma-3rd-sem/`
- **Base path: `/Diploma-3rd-sem/`** — everything must work under it
- Stack: zero-build static HTML/CSS/JS, JSON data, service worker, no bundler
- License: **unset — GATE** (`docs/DECISIONS.md` lists it as open; the README
  badge currently links a `LICENSE` file that does not exist)
- Money: none — no ads, payments, donations, affiliates, or analytics
- Scanned: 177 tracked files, 55 HTML pages, 20 standalone JS files, 55 JSON
  files, 992 PYQ records, 872 quiz records (as of 2026-11-06)
- Time budget: 4 weeks from 2026-11-06, unless a waiver is recorded

## 2. Branching and the deploy gate (law)

- Work only on the session branch named above. Never create/switch branches,
  push `main`, force-push, or `git reset --hard`.
- Commit and push the session branch freely. Before committing, verify
  author/committer identity with `git var` and inspect the commit before
  pushing. Never use an agent's personal email/account.
- The agent never opens a PR, merges, pushes `main`, enables Pages, deploys,
  changes a domain, tags a release, or announces the site without explicit
  command in chat. Green CI is evidence, not authorization. "Open a PR" does
  not mean "merge", and neither means "deploy".
- One phase at a time; never a second PR while one is open.

## 3. Questions — ask less, gate always

**GATE — always ask; never act without an explicit yes:**
repo settings · site name, base path, or domain · git author identity ·
license (currently unfixed) · PR · merge · `main` push · enabling Pages ·
deploy · publishing a URL · announcement · money in any form · legal actions ·
another person's personal data · waiving a law here · changing an answer
recorded in `docs/DECISIONS.md` · **changing syllabus/question content that
requires source verification**.
→ One Summary batch per gate moment, ≤4 questions, each naming its gate.

**DECIDE-ONCE — ask once, record in `docs/DECISIONS.md` with date:**
audience, language, base path, design direction, time budget, hosting.
→ Never re-ask a recorded answer. Changing one is a GATE.

**DEFAULT — never ask:** researchable facts (research, cite source + date) ·
reversible implementation choices (log under Agent decisions) · anything
already answered in chat or docs · taste with an obvious default.

## 4. Work cycle — original per-phase process

**Owner-approved sequencing exception (2026-11-09):** the owner delegated
implementation decisions across phases 1–9 and requested one dedicated final
cross-device phase. Cross-phase engineering batches may proceed without
repeated sequencing questions; maintain separate phase records. This supersedes
only the older one-phase-per-chat restriction below, not source-integrity,
verification, identity, release or publication gates. Focused regression checks
continue during implementation. See `docs/DECISIONS.md` and `docs/STATUS.md`.


1. Verify state first: `git status`, `git log`, PRs, CI runs. Trust the
   repository, not memory.
2. Evidence before hypothesis: `file:line` reads against the current tree.
   `docs/AUDIT.md` holds the 2026-11-06 baseline; re-read the file, do not
   trust the summary, before changing it.
3. Reuse scan first, then implement the current phase only (2–4 parts; one
   whole capability). Before building any part, check whether a verified
   pattern already does it (`webflow/knowledge/reuse-first.md`;
   DEPEND/ADAPT/STUDY/BUILD/REJECT) and open the phase record with its
   "Reused" line. Its "Done means" cell in `docs/ROADMAP.md` is the acceptance
   test. Nothing outside it.
4. Quality gate green, **without a local browser**:
   `python3 scripts/check_site.py` + `python3 scripts/validate_pyq.py` + JS
   parse, all in CI (`webflow/knowledge/quality-without-a-device.md` §1). CI
   must upload the `site-preview` artifact — every phase must be visible as
   screenshots/files I can look at.
5. Docs ride with the code commit: `docs/phases/NN-<slug>.md` (including what
   the preview shows), roadmap status, `docs/DECISIONS.md` if anything new,
   and `prompt.md` updated.
6. Report (run id, tip sha, artifact, what is now visible), then **print the
   next-chat prompt IN CHAT** — one fully-filled copyable block from
   `webflow/templates/next-chat-prompt.md`. Then **stop at the deploy gate**.

## 5. Invariants — do not break

- **Zero build:** the committed files are what Pages serves. No bundler, no
  preprocessor, no `node_modules` in the served path.
- **Base-path safety:** every internal URL works under `/Diploma-3rd-sem/`. A
  root-relative `/assets/...`, `/manifest.json`, or `/index.html` is a defect
  unless the base path decision changes (that is a GATE).
- **No backend, login, analytics, ads, trackers, or third-party runtime
  request.** Font Awesome is currently loaded from a CDN on 38 pages; removing
  it is Phase 1 work, adding another is a GATE.
- **Offline-first and truthful:** the service worker and manifest are correct
  for the deployed subpath before any page claims offline.
- **One source of truth per concern:** one storage module and key prefix, one
  theme key, one data loader, one token file. Pages never write raw
  `localStorage` with their own key scheme, and never hard-code a colour that
  duplicates a token.
- **Accessibility floor:** WCAG 2.2 AA on shipped pages — skip link, one
  `<main>`, one `<h1>`, labels, visible focus, measured contrast, reduced
  motion. Measured contrast lives in `docs/DESIGN.md`.
- **Every displayed number is computed from data**, never typed by hand
  (declared quiz counts already disagree with actual: CST201 U1 46/53,
  U2 31/36; CST203 U3 42/55; CST205 U1 40/56).
- **Every claim is true of this build:** "offline", "no personal information",
  "feedback recorded", "AI evaluation", a hard-coded "Active" status. The
  privacy page lists every storage key and network request.
- **Content accuracy is the owner's:** syllabus mapping, answer keys, question
  wording, and year/month labels are verified by a human against a source
  before they ship. The agent may restructure, deduplicate, and flag; it may
  not invent an answer.
- **The syllabus is the content authority:** `docs/syllabus/syllabus-3rd-sem-2022.pdf`
  defines units, hours and modules. Content that disagrees is the bug; never
  re-tag a record to a unit the syllabus does not declare without an owner
  decision. `scripts/validate_syllabus.py` is the join.
- **Generated data is reproducible:** practice days, search indexes, coverage
  data, cards and the sitemap come from a committed script, are committed as
  data, and are never hand-edited. Re-running a generator must produce
  identical bytes.
- **A phase is a folder:** `docs/phases/NN-slug/{README.md,tasks.md,record.md}`.
  A phase without a record is not done.
- **No secrets or personal data** in git or chat; no other student's data.
- **Reuse stays lawful:** MIT/Apache/BSD code may be depended on or adapted with
  attribution; studied sources are re-implemented clean-room. One library per
  job, no dependency without a recorded verdict.
- **Kill fast:** the pre-written kill test in `docs/RESEARCH.md` decides
  ship-next vs iterate; never rewrite it after seeing results.

## 6. Definition of done (any change)

Checks green (`scripts/check_site.py` errors = 0; see the WARN trend) ·
`site-preview` artifact uploaded · docs updated · `prompt.md` current ·
next-chat prompt printed in chat · short report — then stop at the deploy gate.
A **public launch** additionally needs every item in
`webflow/templates/site-checklist.md` green and an explicit deploy command.

## 7. Chat delivery — owner-required reports and Termux testing

- **After every completed phase**, write a short report **directly in chat**,
  not only in a file or artifact. Include what changed, checks actually run and
  their results, remaining blockers/unverified behaviour, and the next step.
  State clearly whether anything was pushed, opened as a PR, merged or deployed;
  do not imply that a phase is fully green when an acceptance item is blocked.
- **At the end of every chat**, including rules-only, documentation, bug-fix and
  incomplete-phase chats, include a copyable **Termux local-testing command
  block** and the exact browser URL. Do not wait for phase completion.
- Commands must match the current static stack and session branch. State the
  checkout-directory assumption and any one-time prerequisites (`pkg install
  python git` when needed). Do not assume the user's checkout is current: say
  which branch/revision contains the changes and whether it has been pushed.
  Never suggest a destructive reset, overwrite local changes, or present an
  unpushed change as available through `git pull`.
- The basic zero-build preview, assuming the checkout is `~/Diploma-3rd-sem`:

  ```sh
  cd ~/Diploma-3rd-sem
  python -m http.server 8000 --bind 127.0.0.1
  ```

  Open `http://127.0.0.1:8000/`; stop with Ctrl+C. This basic command serves
  the checkout at `/`, not a simulated `/Diploma-3rd-sem/` deployment. For path
  or PWA changes, additionally provide relevant checks or a project-subpath
  preview method. Never claim a local preview proves real-device installation,
  deployed behaviour, or browser checks that were not run.
