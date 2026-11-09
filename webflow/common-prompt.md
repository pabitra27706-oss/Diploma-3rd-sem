# common-prompt.md — start a new site (used ONCE per site)

Paste the block below as the **first message of a brand-new chat** — one fresh
chat per site, once. It launches the plan-only first chat ([PLAN.md](PLAN.md)
stage 1): all research, the selection, and the complete self-contained plan
file set — then it stops at the exit gate. No repository and no code exist at
this point.

Before pasting:

1. Replace `<SHA>` with this playbook's pinned full commit SHA (40 chars).
2. Fill `[MY CONTEXT]` with your interests, experience, target users,
   languages, time, and anything already decided. Better context = better
   research = fewer questions.
3. Replace `[AREA, IF ANY]` with a domain (e.g. "polytechnic study notes,
   local exam papers, hostel life") — or delete that sentence to let research
   roam free.

After the exit gate is answered, the site gets its own repo with `rule.md`,
`prompt.md`, and `docs/` — and **never needs this file again**. Every later
chat starts from that repo's own `prompt.md`.

```text
Plan-only session — creates NO repository, branch, commit, or site code, and
touches no Pages settings, domain, or DNS. Everything happens in chat and as
plan files in this workspace. Never paste secrets, credentials, or other
people's personal data.

Before anything else, read the public playbook
https://github.com/pabi27706-oss/Diploma-3rd-sem (the webflow/ directory) at
commit <SHA> — webflow/PLAN.md, START.md, RULES.md, PROMPTS.md (P0),
templates/rule-site.md, templates/prompt-site.md,
knowledge/niche-method.md, knowledge/reuse-first.md,
knowledge/web-references.md, knowledge/web-engineering.md,
knowledge/design-system.md, knowledge/quality-without-a-device.md, and
knowledge/launch-blockers.md — and follow webflow/PLAN.md stage 1 exactly.
That commit is the pinned playbook for this site.

Goal of this ONE chat: all research and a complete, self-contained plan for a
new static website — then stop at the exit gate.

MY CONTEXT (already filled above): [MY CONTEXT]. Preferred area, if any:
[AREA, IF ANY].

1. Research 3–5 differentiated static-website opportunities for Indian users
using current web evidence and knowledge/niche-method.md. For every option
report: the target user and their painful job, the exact query, country/
language/date, linked pages that already answer it, how crowded it is, and any
verified gaps or complaints on those pages. Deep-dive the leading one or two:
their top five results, and what each does badly for a phone user. Separate
observed facts from inference and state uncertainty. Include my real
advantage, a distinct offline-first v1 that fits four weeks, privacy/licensing
risk, and a measurable kill test written before results. Do not invent demand:
"unproven" is a valid verdict.

2. Question policy — ask less, gate always (PLAN.md §3): record every answer
with its date the moment it is given (it belongs in docs/DECISIONS.md) and
NEVER re-ask a recorded answer — that is a defect, not caution. Researchable
facts are researched and cited, not asked. Reversible choices are your
agent-decisions, logged as reversible on objection. Exactly TWO question
batches exist in this whole chat:
   (A) with the comparison table: my direction pick (combine/refine allowed)
       plus at most 4 DECIDE-ONCE items (audience, language/locale, scope cuts,
       design direction, time budget — a budget beyond four weeks is a
       RULES.md law-3 waiver and is recorded as such);
   (B) the exit gate in step 5.
If an answer would not change the plan or the code, it is not a question.

3. Present the comparison table and recommend the strongest one or two — do
not choose for me.

4. After my pick, write the COMPLETE self-contained file set as copyable
markdown (PLAN.md §2) — the future site repo must work with no other repo
reachable:
   - docs/RESEARCH.md — options + evidence with check dates, rejected options
     with reasons, the demand verdict line, the pre-written kill test, and the
     REUSE MAP (knowledge/reuse-first.md §2 scan, whole site: layout base, ONE
     CSS approach, icons, data/offline — per capability a verified candidate
     with licence + activity checked today, and a DEPEND / ADAPT / STUDY /
     BUILD / REJECT verdict; rejected candidates stay listed with reasons).
     Price the roadmap on reuse, not on writing everything from scratch;
   - docs/DESIGN.md — from templates/docs-system/DESIGN.md: design direction,
     every screen + state listed, token placeholders (colours with contrast
     ratios, type scale, spacing, radii, focus ring, motion limits), component
     inventory, empty approval record;
   - docs/ROADMAP.md — numbered PHASES (2–4 parts each; v1 ≈ 5–8 phases;
     phase 0 = bootstrap incl. tokens freeze), every "Done means" cell
     including the downloadable site-preview artifact; merge anything smaller
     than half a day of work into a neighbour;
   - docs/DECISIONS.md — every answer so far, dated; law waivers in their own
     section;
   - rule.md — from templates/rule-site.md, filled with identity, base path,
     time budget, and any waivers;
   - prompt.md — from templates/prompt-site.md, filled with identity and the
     next phase;
   - README.md — from templates/readme-site.md, filled.
Sketch screens, localStorage keys, and data schemas inside phase records —
never as code. Zero-build only: plain HTML/CSS/JS, no framework, no backend,
no analytics, no ads, no third-party runtime request unless I approve it.

5. Exit gate — ONE Summary batch and nothing else, then STOP (no repo, no
code until I answer): plan approve / revise / hold? · authorize creating the
site repository (public or private · MIT or GPL-3.0)? · which git author
identity is designated for the new repo? · site name + repo name + base path
(/<repo>/ on project Pages, or a custom domain)?
```
