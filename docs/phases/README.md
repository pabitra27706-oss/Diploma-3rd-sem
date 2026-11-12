# Phases

Every phase has its own folder. The folder is the task record: what the phase
is for, what its parts are, how each part is accepted, and what "done" means.
`docs/ROADMAP.md` is the status board; this folder is the detail.
[Current handoff and remaining work](../STATUS.md) is the up-to-date summary.

```text
docs/phases/
  00-foundation/          rules, playbook, gate, baseline             ✅
  01-platform/            deploy paths, PWA, install/update, presence
  02-data-pipeline/       one source of truth for content and counts
  03-quiz-engine/         attempts, mock papers, history, mistakes
  04-discovery/           search, repeated questions, deep links
  05-study-system/        flashcards, scheduling, weak topics, daily goal
  06-state-portability/   one storage layer, notes, backup/restore
  07-inclusion-trust/     accessibility, reading controls, i18n, truth
  08-content-depth/       syllabus coverage, sheets, labs, print
  09-performance-launch/  budgets, measurement, domain readiness, launch
  10-device-acceptance/   final cross-device matrix after implementation 1–9
```

## Folder convention

Each phase folder holds at least:

| File | Purpose |
|---|---|
| `README.md` | Goal, why it matters now (with evidence), scope in/out, dependencies, gates, risks, "Done means" |
| `tasks.md` | The parts (`N.1`, `N.2`, …) with steps, acceptance criteria, and the evidence to quote |
| `record.md` | Written **during** the phase: what shipped, what was checked, what could not be verified |

`record.md` is created when the phase starts, from
`webflow/templates/docs-system/PHASE_RECORD.md`. A phase without a record is
not done, even if the code works.

## Rules that apply to every phase

1. **Owner-updated sequencing (2026-11-09).** Implement phases 1–9 first,
   followed by dedicated Phase 10 cross-device acceptance. Cross-phase
   engineering batches are permitted; keep a separate record for each phase.
2. **Big by design.** A phase is one whole capability with 4–6 parts. If a
   folder grows a seventh part, the scope was wrong — move a part, do not split
   the phase.
3. **Evidence first.** Every claim in a part's steps quotes `file:line`, a
   command output, or a syllabus page. `docs/AUDIT.md` is the 2026-11-06
   baseline, not a substitute for reading the file.
4. **Order matters.** Phase 2 feeds 3, 4, 5 and 8. Phase 6 must land before
   backup/restore is meaningful. Phase 7 can run in parallel with 8 only if the
   files touched do not overlap.
5. **Owner gates.** Content verification (2.5, 8.6), license (7.5), and any
   deploy (9.6) stop for an explicit answer. Nothing here authorises a deploy.
6. **Definition of done** (from `rule.md` §6): checks green, `site-preview`
   artifact, record written, roadmap row updated, `prompt.md` updated,
   next-chat prompt printed in chat.

## Cross-phase dependencies at a glance

| Needs | Before | Why |
|---|---|---|
| Flashcards (5) | Answer keys (2.5) | A card whose back is blank teaches nothing |
| Weak topics (5.3) | Real topic labels (2.3) | 321 records currently say "Short answer" |
| Mock paper (3.3) | Marks reconciliation (8.5) | Data says ~70 marks/paper, syllabus ESE says 60 |
| Search (4) | Stable ids (2.4) | Duplicate clusters must be resolved before indexing |
| Backup (6.5) | One storage layer (6.1) | Backing up three schemas backs up nothing |
| Coverage map (8.1) | Syllabus join (2.3) | The map is the join, rendered |
| Launch (9.6) | Everything above | It is the last gate, not a milestone |
