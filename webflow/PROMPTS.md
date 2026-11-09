# Copy-paste prompt library

Replace bracketed fields before sending. Each prompt assumes the site repo has
already frozen `templates/` and `knowledge/` from a pinned playbook commit.
Do not paste secrets, tokens, hosting credentials, or private user data into
prompts. Every prompt assumes the question policy in [PLAN.md](PLAN.md) §3:
**ask less, gate always**.

## P0 — plan-only first chat (research + plan docs)

```text
Plan-only session (webflow PLAN.md stage 1): do NOT create any repository,
branch, commit, or site code, and do not touch Pages, domains, or DNS. Do not
paste secrets or account identifiers.
Question policy — ask less, gate always: record every answer with its date the
moment it is given (it belongs in docs/DECISIONS.md). Never re-ask a recorded
answer. Researchable facts are researched and cited, not asked. Reversible
choices are your agent-decisions, logged as reversible on objection. Two
question batches exist in this whole chat: (A) the combined direction +
DECIDE-ONCE batch, (B) the exit gate. Nothing else is asked.
1. Research 3–5 differentiated static-website opportunities for Indian users
that improve materially on what already ranks or exists. Use live web search
evidence and webflow/knowledge/niche-method.md. For every option report: the
target user and their painful job, the exact query they would type, country/
language/date of the search, linked existing pages, how crowded the answer
space is, and any verified complaints or gaps in those pages. Separate
observed facts from inference and state uncertainty. Include the owner's real
advantage, a distinct offline-first four-week v1, privacy/licensing risk, and a
measurable kill test written before results. Report honestly when demand is
unproven.
2. Present a comparison table and recommend the strongest one or two; do not
choose for me. Batch (A), one Summary, ≤4 questions: my pick of direction
(combine/refine allowed) plus the decide-once items (audience, language/locale,
scope cuts, design direction, time budget — a budget beyond four weeks is a
RULES.md law-3 waiver and is recorded as such).
3. After my pick, run the reuse scan (webflow/knowledge/reuse-first.md §2,
catalogue: webflow/knowledge/web-references.md) for the whole site and write
the plan deliverables as copyable markdown blocks:
docs/RESEARCH.md (options plus the REUSE MAP — per capability a verified
candidate with licence + activity checked today and a DEPEND/ADAPT/STUDY/
BUILD/REJECT verdict; price the roadmap on reuse),
docs/DESIGN.md from templates/docs-system/DESIGN.md (direction, every
screen+state, token placeholders with contrast ratios, component inventory,
empty approval record),
docs/ROADMAP.md (numbered phases, not slivers — one phase = one chat =
one downloadable site-preview artifact; 2–4 parts per phase; v1 ~5–8 phases),
docs/DECISIONS.md (every answer so far, dated; law waivers in their own
section), the repo's own self-contained rule.md from templates/rule-site.md
(identity, base path, time budget, waivers filled in),
templates/readme-site.md filled, and the site's own self-contained prompt.md
from templates/prompt-site.md.
The finished site repo must work with no other repo reachable. Sketch screens,
data schemas, and localStorage keys inside phase records — never as code. No
frameworks, no backend, no analytics, no ads.
4. Batch (B), the exit Summary and nothing else (PLAN.md §4): plan
approve/revise/hold · authorize repo creation (public/private, MIT/GPL-3.0) ·
git author identity · site name + repo name + base path (/<repo>/ or custom
domain). Then stop. No repo, no code, no Pages settings until I answer.
```

## P1 — research site options

```text
Change-control: use only the assigned session branch. Never create/switch to
another branch, push to `main`, force-push, or use `git reset --hard`. Before
committing, verify author/committer identities with `git var` and inspect the
resulting commit before pushing. Use only this repo owner's designated address
as author; if none is available, stop and ask. Never use WebFlow's
owner-specific addresses or an agent's personal email/account. Do not open a
PR, merge, deploy, enable Pages, or publish a URL without explicit permission
in chat; PR creation, merging, and deploying are separate approvals. Work one
task at a time and do not duplicate an existing run.
The owner does not need to arrive with a chosen idea. Research 3–5
differentiated static-website opportunities using current web evidence and
webflow/knowledge/niche-method.md. If constraints that would change the
shortlist (audience, language, time, experience) are missing, ask once, up
front, as one batch.

For every option report the target user and painful job, the exact query,
country/language/date, the existing pages that answer it, how crowded and how
good they are, and verified gaps. Deep-dive the leading one or two: their top
five results and what those pages do badly (stale data, paywalls, login walls,
heavy ads, bad mobile layout, no offline, wrong language).
Separate observed facts from inference and state uncertainty. Include the
owner's real advantage, a distinct offline-first four-week v1, privacy and
licensing risks, and a measurable kill test.

Rank the options in a comparison table and recommend the strongest one or two
with evidence. Do not choose for the owner. Do not create a repository or
write site code until the owner explicitly chooses a researched direction.
```

## P2 — repository initialization (after the plan gate)

```text
Change-control: the rules above apply unchanged (branch, identity, PR, deploy).
The plan gate is answered: [paste the four answers with dates].
Do webflow/START.md stage 2 exactly, in this order, committing after each step:
1. snapshot webflow/templates + webflow/knowledge at SHA <sha> into this repo,
   with the README provenance line;
2. create docs/ from the plan deliverables (RESEARCH, DESIGN, ROADMAP,
   DECISIONS) and root rule.md + prompt.md;
3. create the site LICENSE ([MIT/GPL-3.0]) and fill README from the template;
4. record the base path in docs/DECISIONS.md and make every internal path
   relative to it.
Stop after the plan-docs commit and report: files created, provenance sha,
base path decision, and the first roadmap phase. Do not write site pages yet,
do not enable Pages, do not open a PR.
```

## P3 — one phase

```text
Change-control: the rules above apply unchanged.
Start phase [N] from docs/ROADMAP.md. Implement ONLY its parts:
- [N].1 [part]
- [N].2 [part]
- [N].3 [part, if any]
Its "Done means" cell is the acceptance test — nothing outside it.
Work evidence-first: read the files, quote file:line for every claim, then
change. Reuse scan first per part (webflow/knowledge/reuse-first.md), with a
"Reused" line per part. Keep it zero-build: HTML/CSS/JS as served, no
framework, no backend, no analytics, no ads, no new third-party runtime
request.
End with ALL of: CI green on this branch (parse + link + HTML/a11y checks +
budgets) · the run's site-preview artifact downloadable and the changed
screenshots listed · docs/phases/[NN]-<slug>.md written (including what the
preview shows) · roadmap row updated · prompt.md updated in the same commit ·
short report (run id, tip sha, artifact, what is now visible) · then print the
NEXT phase's next-chat prompt in chat from templates/next-chat-prompt.md.
Stop at the deploy gate: no Pages, no deploy, no PR, no merge, no announcement
without my explicit command.
```

## P4 — bug-fix chat

```text
Change-control: the rules above apply unchanged.
Bug: [what I see] · where: [URL / page / screen / artifact] · when: [after
which change or on which device].
Diagnose first: reproduce from the repository, quote file:line for the cause,
state the smallest correct fix. Fix only this bug — no drive-by refactors, no
new dependencies, no style changes outside the fix.
Same ending as a phase: CI green, site-preview artifact, a short phase-style
record under docs/phases/ (name it fix-<slug>), prompt.md updated if state
changed, report, then stop at the deploy gate.
```

## P5 — audit / diagnosis chat (read-only)

```text
Read-only audit. Make NO edits, no commits, no branch changes, no PR, no
deploy. Work through the current tree and report:
1. broken or subpath-unsafe links/assets, with file:line;
2. HTML structure and accessibility failures (landmarks, headings, labels,
   focus, contrast, motion), with file:line and the measured ratio;
3. claims that are untrue of the shipped build (offline, privacy, "AI",
   "100%", counters), with the exact quoted text and its file:line;
4. offline/PWA correctness (manifest, scope, start_url, icons, precache list,
   fetch strategy), including whether install would succeed;
5. state/storage problems (duplicate keys, incompatible schemas, resets that
   reset nothing), with the key names;
6. data quality (declared vs actual counts, duplicates, unanswered items,
   orphaned ids);
7. performance risks (request count, sequential fetches, payload sizes,
   render-blocking requests), measured from the files.
Rank findings by user impact, separate verified facts from inference, and
propose a phase-sized fix order. Change nothing.
```

## P6 — deploy (only after the gate is answered)

```text
Deploy authorization checklist. Do NOT act until I answer each line:
1. Target: [main push + Pages from main / gh-pages branch / manual upload].
2. Base path: [/<repo>/ or custom domain] — confirmed in docs/DECISIONS.md.
3. Pre-deploy gate: CI green, launch checklist in
   webflow/templates/site-checklist.md reviewed, privacy page current,
   LICENSE present, no secrets in the tree.
4. After deploy: verify the URL loads, the manifest icons resolve, the service
   worker registers from the deployed path, offline reload works, and every
   nav link resolves under the base path — report each one with the URL used.
Then stop. No announcement, no SITE_LIST change, no tagging without a separate
instruction.
```
