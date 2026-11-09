# Rules

Laws 1–14 adapt AppFlow's laws to the web; 15 is web-only. A law changes only
by an owner-approved waiver recorded in the site's `docs/DECISIONS.md`.

1. Discuss → decide → code; no edit before permission.
2. Diagnose first; evidence before proposals (`file:line` or a live URL, not a
   hunch).
3. Ship small: idea → public URL ≤ 4 weeks, or kill it.
4. Kill fast: flat real use after the first weeks → next site, not endless
   polishing.
5. One repo per site; one job per site; sites must be genuinely different
   products. No doorway pages, reskins, or clones for search traffic.
6. Static-first: no backend, login, analytics, ad network, tracker, or runtime
   framework unless a recorded decision proves the need. Files are served as
   written; a build step is an exception with a reason.
7. License the repo (MIT or GPL-3.0) before the first public URL.
8. Truth in privacy and content: the privacy page describes exactly what the
   site stores (including `localStorage`), and no shipped claim outlives the
   feature it describes. "We store nothing" is false if a name or a note is
   saved on the device.
9. No money mechanics: no ads, no payments, no donations link, no affiliate
   tags, no tracking — unless the owner records a new decision (GATE).
10. Account is the crown jewel: one clean GitHub account and one domain
    registrar forever. No fake reviews, no fake users, no SEO tricks, no
    scraped content, no throwaway accounts to dodge a limit.
11. CI is the PC: nothing ships without green CI (parse + link + a11y + budget
    checks and a downloadable `site-preview` artifact). Deploying is a
    separate, explicit approval.
12. Docs ride with code: every site repo keeps a `DECISIONS` log, a roadmap,
    and a phase record per phase.
13. Offline-first and subpath-safe: the service worker, manifest, icons, data
    fetches, and every internal link must work under the deployed base path.
    No secrets in the repo, ever.
14. Accessibility and speed are laws, not polish: WCAG 2.2 AA on the shipped
    pages, and the performance budget in
    [knowledge/web-engineering.md](knowledge/web-engineering.md) §6.
15. Content accuracy is the human's job: the agent accelerates; the owner
    verifies every factual, syllabus, legal, or medical claim.

## Browser support floor (checkpoint)

As checked on 2026-11-06, the floor is the **last two stable versions of
Chrome, Safari, Firefox, and Edge, plus Android Chrome and iOS Safari** —
roughly Chrome/Edge 120+, Safari/iOS 17+, Firefox 120+. Re-check before each
launch; the floor is a decision, not a slogan:

- Modern CSS (`:has()`, `color-mix()`, container queries, `text-wrap`) needs a
  fallback, or the floor moves and the README says so. Never claim broad
  support in docs while shipping syntax old engines cannot parse.
- No feature may be the only path to core content. Content first, enhancement
  second.

## Site discovery and URL registry

- The owner does not have to arrive with an idea. For every new site, present
  3–5 differentiated options with linked, dated evidence on search demand,
  existing answers, owner advantage, four-week static scope, and privacy
  risk.
- Compare and recommend; do not decide for the owner. No repo and no code
  until the owner selects a direction.
- Maintain `SITE_LIST.md` as the portfolio register. Record the exact live URL
  only when it resolves; never invent a URL or a domain.

## Questions: ask less, gate always

Full policy: [PLAN.md](PLAN.md) §3. Three classes:

- **GATE — always ask, never act without an explicit yes:** repo creation,
  site name + repo name + base path or domain, git author identity, license if
  unfixed, PR / merge / `main` push / release / **deploy** / public
  announcement, money or accounts in any form, legal actions, waiving a law
  above, changing a recorded decision. One Summary batch per gate moment, ≤4
  questions.
- **DECIDE-ONCE — ask once in the plan chat, record in `docs/DECISIONS.md`:**
  product-shaping choices (audience, language, scope, design direction, time
  budget, hosting target). Re-asking a recorded answer is a defect.
- **DEFAULT — never ask:** researchable facts (research and cite), reversible
  choices (decide and log under Agent decisions), anything already answered.

## GitHub authority and approval gate

Adapted from AppFlow's owner-approval rules; the wording is this repo's own.

- **Branch discipline:** work only on the assigned current session branch.
  Never create or switch to another branch, push to `main`, or use
  `git push --force`. Commit and push only to the assigned branch when the
  requested work calls for it. Never `git reset --hard`; protect existing work.
- **Commit identity and attribution:** attribution comes from commit metadata,
  not push authentication. Before committing, verify `git var
  GIT_AUTHOR_IDENT` and `git var GIT_COMMITTER_IDENT`, and inspect the commit
  before pushing. Owner-approved author addresses for **this WebFlow
  repository**:
  - `chakraborttypabi2772006@gmail.com`
  - `pabitra27.7.06@gmail.com`

  Either is pre-authorized as `GIT_AUTHOR_EMAIL`; no per-commit approval is
  needed. Keep `GIT_COMMITTER_EMAIL` on the owner's approved GitHub noreply or
  bot identity. Never use an agent's personal email or account. Do not repeat
  these addresses in other tracked docs, templates, or site repositories; they
  are public in Git metadata either way. Do not rewrite pushed history to
  alter attribution without separate permission.
- **PR approval:** never open a pull request without the owner's explicit
  command in chat, and never merge without a separate explicit command. A
  request to edit, commit, push a branch, or get green CI is **not** permission
  to open or merge a PR. "Open a PR" does not mean "merge it".
- **Deploy approval:** never push to `main`, enable Pages, publish a URL,
  change a custom domain, or announce a site without explicit authorization.
  Enabling GitHub Pages for a repository is a deployment.
- **One task at a time:** no parallel tasks, no second PR while one is open.
  Check branch, working tree, PRs, and CI runs first; do not duplicate a run.
- **Expensive/destructive actions:** do not dispatch releases, mass rewrites,
  or force-pushes without explicit confirmation. Green checks are evidence,
  not authorization.
- **Stop and report:** give verified branch/commit/check status and stop at the
  approval gate whenever the next action is not explicitly authorized.
