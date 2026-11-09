# Maintenance

Keep this playbook useful on a phone: short markdown, plain links, no build
step, and no copied credentials or unnecessary personal data. The two
owner-approved author emails in `RULES.md` are the sole intentional
personal-email exception; never repeat them in portable site materials. The
owner-approval and commit-identity gates in `RULES.md` apply to maintenance
too: a review, branch push, or green CI does not authorize a PR, merge,
deploy, or publication. Never reuse WebFlow's addresses in site templates or a
new site repository.

## Quarterly playbook review

- Re-check every link in `knowledge/web-references.md`,
  `knowledge/reuse-first.md`, and this file; record archived, silent,
  licence-changed, or superseded entries with the check date and replace them —
  never judge by stars/forks alone.
- Confirm the frozen-reference model: site repos never edit their
  `templates/`/`knowledge/` snapshot; each site is self-contained with its own
  `rule.md` + `prompt.md` + `docs/`; this playbook changes only here,
  deliberately.
- Re-verify the browser support floor in `RULES.md` against current support
  data, and any claim in the docs about what those browsers can parse.
- Re-check GitHub Pages behaviour (limits, subpath, custom domains, HTTPS) and
  the WCAG version referenced, and update dated claims with their sources.
- Verify every internal link and confirm the required files still exist.
- Read `RULES.md` for contradictions and keep each law unchanged unless the
  owner deliberately decides otherwise.
- Re-read `PLAN.md` §3: GATE items must still be asked; nothing recorded in a
  `DECISIONS.md` may be re-asked.
- Record a new full commit SHA for future site bootstraps. Existing site repos
  stay pinned to their frozen snapshot until explicitly refreshed.

## Annual full audit

- Re-run the bootstrap dry run in `START.md` in a throwaway directory.
- Review license boundaries: prose outside `templates/` is CC BY 4.0; template
  files carry the MIT header.
- Inspect the CI workflow template for permission scope, action versions,
  and safe behaviour on pull requests from forks.
- Re-read the privacy, storage-disclosure, and accessibility guidance against
  current official documentation. Remove stale examples rather than guessing.
- Check that the repository contains no real tokens, account identifiers,
  private user data, or unnecessary personal information. The only intentional
  personal-email exception is the pair listed in `RULES.md`.

## Each site, every year (and before a launch)

- Re-check the site in a real phone browser at the deployed base path: every
  nav link, every asset, the manifest icons, the service worker scope, and an
  offline reload.
- Re-run the link + HTML + a11y checks and look at what CI reported last; fix
  what drifted into the tree.
- Review the privacy page against what the site actually writes to device
  storage, and the offline claim against what the network panel shows.
- Verify third-party requests: fonts and icon sets must be self-hosted or
  removed; a CDN dependency is a failure mode and a privacy claim.
- Check the domain/repo ownership and renewal dates without putting
  credentials or account identifiers in Git or chat.
- Keep the `DECISIONS` log current: what changed, why, evidence, owner, date.
- Reply to real user feedback honestly; never solicit positive ratings, never
  invent testimonials.

The target is an audit, not permission to wait a year when a browser change or
a broken deploy needs faster action.

## Refresh a site's frozen snapshot (documented, deliberate)

1. Read the new playbook section diff and note what actually changed.
2. Update the site's `templates/`/`knowledge/` copies in one commit named
   `Refresh playbook snapshot <sha>` and update the README provenance line.
3. Do not "improve" the snapshot while refreshing it; do not mix a refresh with
   a feature change.
