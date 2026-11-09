# Purpose

## Mission

Give one producer profile a calm, repeatable path from idea to published
**website**: an Indian indie developer with no PC, working on a phone in CodeC
with an AI agent, using GitHub Actions to check work and GitHub Pages to serve
it.

This repository is the playbook, not a site. Every future site starts by
reading a pinned WebFlow commit and importing frozen copies of `templates/`
and `knowledge/` before any site code exists.

## Constraints

- Phone-first: do not assume a desktop IDE, a local dev server, or a browser
  you can inspect. Every check must be runnable by CI or by `python3` on a
  phone.
- Zero build step by default: plain HTML, CSS, and JS served as written.
  A bundler is a recorded exception, never the default.
- GitHub Actions is the checking machine; CI must test and produce a
  downloadable `site-preview` artifact.
- Keep the first version small enough to publish or kill within four weeks.
- Static and offline-first: bundled JSON data, a service worker, no backend.
  Add a server only when observed user need proves it — and that is a gate.
- No ads, no payments, no analytics, no third-party runtime requests. This is
  a standing owner decision, not a temporary budget choice.
- Serve from a **subpath** unless a custom domain is recorded: project Pages
  live at `https://<user>.github.io/<repo>/`. Every absolute path is a bug
  until proven otherwise.
- Keep credentials, tokens, hosting account identifiers, and private user data
  out of this playbook and out of site repos.
- GitHub control is owner-gated: no PR, merge, `main` push, release,
  deployment, or public announcement without explicit permission in chat.
  For this WebFlow repository, only author addresses listed in `RULES.md` are
  pre-authorized. Never use an agent's personal email/account or copy these
  addresses into site templates or new site repositories.
- For each site, the agent researches 3–5 evidence-backed options; the owner
  selects or refines one before any site repo or code is created.
- Reuse first: the agent researches open source before building anything
  (knowledge/reuse-first.md) — verified libraries, official samples, and
  studied patterns before hand-written code; every reuse verdict and shipped
  licence is recorded in the site's docs.
- Keep `SITE_LIST.md` as the portfolio register and record only confirmed,
  exact live URLs.
- The owner verifies facts, legal choices, site content, and final releases.

## What "success" means here

Not traffic, not revenue. Three things:

1. A URL that loads fast on a cheap phone over 4G, works offline after first
   load, and installs.
2. Content a real user can trust because every claim on it is true of the
   shipped build.
3. A repo the next chat can continue from without reading this playbook.

## Anti-goals

- No site factory, doorway pages, keyword-stuffed clones, or scraped content.
- No backend, login, analytics, tracking pixels, cookie banners, or permission
  prompts without a proven user need (a gate).
- No deceptive claims: no "guaranteed result", no fake counters, no invented
  statistics, no "100% offline" while calling the network.
- No paid traffic, review swaps, engagement pods, or account tricks.
- No agent-authored facts shipped without human source-checking.
- No accessibility theatre: a skip link that does not skip, `aria-*` that
  contradicts the DOM, or contrast measured by eye.

## Standing decisions (this profile)

- Stack: zero-build static, GitHub Pages, subpath-safe.
- Money: none. No ads, no billing, no donations plumbing.
- Privacy: local storage only, disclosed truthfully on a visible page.
- Support: an honest contact route that works without JavaScript.

Changing any of the four above is a GATE (`RULES.md` §Questions).

## Policy sources to re-check before a public launch

- [GitHub Pages limits and usage](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [GitHub Pages custom domains and HTTPS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [web.dev performance budgets](https://web.dev/articles/performance-budgets-101)
