<!-- SPDX-License-Identifier: MIT -->

# Phase <NN> — <slug>

- Status: ✅ / 🚧 / ❌ · Date: YYYY-MM-DD · Branch: <session-branch>
- CI: run <id> green (or: blocked at <step>) · Provenance: WebFlow @ <sha>
- **Preview:** artifact `site-preview` from run <id> — *shows: [what the owner
  can see in the screenshots]*

## Parts

- <NN>.1 — [part] — [status]
- <NN>.2 — [part] — [status]
- <NN>.3 — [part] — [status]

## Reused (reuse scan for this phase)

- [part] — [DEPEND/ADAPT/STUDY/BUILD/REJECT] — [source + licence + version, or
  why building it won]. A part with no line has not been scanned.

## Evidence (before the change)

[Exact `file:line` reads, URLs, or check output that justified the work. No fix
on a guess.]

## What shipped

[Files and observable behaviour. Counts, byte sizes, and shas are read from the
tree, not remembered.]

## Checks (no-device gate — knowledge/quality-without-a-device.md §1)

- JS parse: [pass/fail, n files] · JSON: [pass/fail, n files]
- Links/assets: [n checked, n broken, list] · root-relative paths: [n, down from
  n]
- HTML/a11y: [main/title/description/labels/heading order results]
- Budgets: [JS KB, CSS KB, requests, largest data file]
- **Not run / not verifiable here:** [name them honestly]

## Design comparison (UI phases only)

- [screen vs `docs/DESIGN.md`: differences fixed, or recorded exceptions]

## Real-phone pass (launch phases only)

- [device, browser, URL, what worked, what failed]

## Next-chat prompt

- [ ] Printed IN CHAT at phase end (from `templates/next-chat-prompt.md`, fully
      filled for phase <NN+1>); `prompt.md` updated in this commit as backup.

## Follow-ups

- [New roadmap phases? New decision to log? Nothing?]
