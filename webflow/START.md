# Start a new site

**Law:** stage 1 is a plan-only chat ([PLAN.md](PLAN.md)); nothing is created
in it. Stage 2 creates the repository, and a new site repository takes data
from the public playbook BEFORE any site code. Pin a full commit SHA. The
copied files are a frozen snapshot, not a submodule.

## Stage 1 — the plan chat (no repo, no code)

One chat per site — paste [common-prompt.md](common-prompt.md) (the
once-per-site launcher; `PROMPTS.md` P0 is its inline equivalent). It does all
research, presents 3–5 evidence-backed options, asks the DECIDE-ONCE batch
([PLAN.md](PLAN.md) §3), drafts the complete self-contained file set
(`rule.md`, `prompt.md`, `docs/`, README — `templates/` skeletons), and ends at
the plan chat's exit gate ([PLAN.md](PLAN.md) §4): plan approval · repo
authorization · git author identity · site name + base path. The owner
chooses, combines, or refines an option — stage 2 does not start until that
gate is answered.

After the live URL is confirmed, update the central `SITE_LIST.md`; do not copy
that portfolio list or WebFlow-specific identity details into the new site
repository.

## GitHub authority rule

- Use only the assigned working branch. Never create/switch branches, push to
  `main`, force-push, or discard work with `git reset --hard`.
- Before committing, verify author/committer identities with `git var` and
  inspect the resulting commit before pushing. For WebFlow, an author address
  listed in `RULES.md` is pre-authorized; no per-commit ask. Keep committer
  identity owner-approved. Never use an agent's personal email/account or copy
  WebFlow's addresses into a new site repo. For other repos, use only that
  repository owner's designated address; if none is available, stop and ask.
  Do not rewrite pushed history without separate permission.
- Do not create/open a PR without the owner's explicit command in chat. Do not
  merge without separate explicit authorization. A request to code, a branch
  push, or green CI does not authorize a PR, a merge, **or a deploy**.
- Enabling GitHub Pages, changing a custom domain, or publishing a URL is a
  deployment: explicit permission only.
- Work one task at a time; do not parallelize tasks or open a second PR while
  any PR is open. Check the branch, working tree, PRs, and CI before actions;
  do not duplicate an existing PR or run.
- Stop at the approval gate.

## Stage 2 — bootstrap: first message in the new session

Paste this exact template as the first message, replacing only `<SHA>` with
the full commit SHA you selected:

```text
Before any code: read the public playbook repo https://github.com/pabi27706-oss/Diploma-3rd-sem (webflow/) at commit <SHA> and follow webflow/START.md.
```

## 2. Snapshot and commit before site code

From the root of a new, otherwise-empty site repository, replace only the
placeholder with a full 40-character WebFlow commit SHA. These commands copy
only `templates/` and `knowledge/`, verify the checked-out commit, write
provenance, and commit the snapshot; they do not create a submodule.

```sh
set -eu
PLAYBOOK_URL='https://github.com/pabi27706-oss/Diploma-3rd-sem.git'
PLAYBOOK_SHA='<SHA>'
PLAYBOOK_SUBDIR='webflow'
TMP_DIR="$(mktemp -d)"

git clone --quiet --filter=blob:none --sparse "$PLAYBOOK_URL" "$TMP_DIR/playbook"
git -C "$TMP_DIR/playbook" sparse-checkout set "$PLAYBOOK_SUBDIR"
git -C "$TMP_DIR/playbook" checkout --quiet --detach "$PLAYBOOK_SHA"
test "$(git -C "$TMP_DIR/playbook" rev-parse HEAD)" = "$PLAYBOOK_SHA"

if [ -e templates ] || [ -e knowledge ]; then
  echo 'Refusing to overwrite an existing snapshot.' >&2
  exit 1
fi
cp -R "$TMP_DIR/playbook/$PLAYBOOK_SUBDIR/templates" ./templates
cp -R "$TMP_DIR/playbook/$PLAYBOOK_SUBDIR/knowledge" ./knowledge

if [ ! -f README.md ]; then
  printf '# YOUR_SITE_NAME\n\n' > README.md
fi
if grep -Fq 'Bootstrapped from WebFlow @' README.md; then
  echo 'README already has provenance; do not append it twice.' >&2
  exit 1
fi
printf '\nBootstrapped from WebFlow @ %s on %s\n' \
  "$PLAYBOOK_SHA" "$(date -u +%F)" >> README.md

git add templates knowledge README.md
git commit -m "Bootstrap playbook snapshot $PLAYBOOK_SHA"
rm -rf "$TMP_DIR"
```

The README provenance line must read:

```text
Bootstrapped from WebFlow @ <sha> on <date>
```

Keep it when you later fill the site README. Keep the copied snapshot
unchanged; update it only through a deliberate, documented refresh commit.

## 2.5 Commit the plan docs + rule.md + prompt.md before any site code

Create `docs/` from `templates/docs-system/` skeletons and fill it with the
plan chat's deliverables: `RESEARCH.md`, `DESIGN.md` (tokens may be drafted but
freeze in phase 0), `ROADMAP.md` (**phases** — 2–4 parts each, v1 ~5–8 phases,
phase 0 = bootstrap), `DECISIONS.md` (every gate and decide-once answer already
given, with dates). Create the repo root `rule.md` from
`templates/rule-site.md`, and `prompt.md` from `templates/prompt-site.md`.
Commit as `Plan docs` — before any site code, on the same session branch. From
here the repo stands alone: `rule.md` governs questions, and WebFlow is
provenance only.

## 3. Only after the snapshot + plan-docs commits

1. Fill `templates/readme-site.md` and use it as the site's `README.md`,
   keeping the provenance line.
2. Create the site's own root `LICENSE` (MIT or GPL-3.0) before site code; do
   not mistake the playbook's mixed license notice for the site's license.
3. Decide the base path **first** (`/<repo>/` on project Pages, or a recorded
   custom domain) and write it into `docs/DECISIONS.md`. Every internal link
   and asset URL is relative to it from the first commit; a root-relative
   `/assets/...` is a defect unless the base path is `/`.
4. Freeze tokens in `docs/DESIGN.md` from `templates/docs-system/DESIGN.md`
   (colours with contrast ratios, type scale, spacing, radii, focus ring,
   motion) and build the smallest shell — `index.html`, one CSS entry, one JS
   entry, `manifest.json`, `sw.js`, `offline.html` — using only those tokens.
5. Copy `templates/scripts/check_site.py` to `scripts/check_site.py` and
   `templates/ci-web.yml` to `.github/workflows/ci-web.yml`. The checker runs
   stdlib checks on the real files (JSON parse, local link resolution, HTML
   structure, a11y basics, subpath safety, sprite symbols, budgets) and the
   workflow uploads `site-preview`. No secrets are required; if a future step
   needs one, wire it by name. Adapt the budgets in the checker to the site,
   and start it in baseline mode until the inherited debt is zero.
6. Get CI green. That is the only "build" this stack has.
7. From here, run **one phase per chat** ([PLAN.md](PLAN.md) §5). The first
   chat starts from the repo's `prompt.md`; every later chat starts from the
   **next-chat prompt the previous chat printed in the chat itself**. Each chat
   ends with the phase's `site-preview` artifact, its
   `docs/phases/NN-<slug>.md` record, `prompt.md` updated, the next-chat
   prompt printed in chat, and a stop at the deploy gate. The repo's own
   `rule.md` is the manual — no other repo is needed.

## 4. Pre-code checklist

Any **NO** or unchecked item blocks coding.

- [ ] Plan chat done? Exit gate answered (plan approved, repo authorized,
      git author identity designated, site name + base path chosen) before this
      repository was created.
- [ ] Plan docs committed before site code? `docs/RESEARCH.md`,
      `docs/DESIGN.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md` present.
- [ ] `rule.md` at the repo root (from `templates/rule-site.md`),
      self-contained, identity filled, no bracket placeholders left?
- [ ] `prompt.md` at the repo root (from `templates/prompt-site.md`),
      self-contained, and updated at every phase end?
- [ ] Demand checked? The owner explicitly selected a researched direction,
      and the kill test is written down.
- [ ] Reuse map done? `docs/RESEARCH.md` names, per capability (layout base,
      ONE CSS approach, icons, data/offline), the verified candidate, its
      licence and activity check date, and a DEPEND / ADAPT / STUDY / BUILD /
      REJECT verdict.
- [ ] Base path recorded? `docs/DECISIONS.md` states `/<repo>/` or the custom
      domain, and no file depends on a different one.
- [ ] Tokens frozen? Colours + contrast ratios, type scale, spacing, radii,
      focus ring, motion limits in `docs/DESIGN.md`.
- [ ] License chosen? MIT or GPL-3.0, `LICENSE` at the site root.
- [ ] Privacy page planned? It lists every key the site writes to
      `localStorage`/`sessionStorage` and every network request it makes.
- [ ] No money mechanics planned? No ad slots, no payment links, no analytics
      snippets. (Adding one later is a GATE.)
