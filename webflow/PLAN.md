# Plan first — one plan chat, then one phase per chat

> The 1st chat is **plan only**: research, the selection, and the plan docs.
> Nothing is created in it. Execution starts only after the plan gate, and it
> runs **one phase per chat** — a phase is a decent chunk of work (2–4 parts),
> not a sliver. **Every phase ends with a downloadable `site-preview` artifact
> plus the changed screens shown in chat.** Question rule everywhere: **ask
> less, gate always** (§3). WebFlow is frozen reference; each site lives by its
> own `rule.md` (§6).

## 1. The two-stage law

| Stage | Chats | Creates | Ends with |
|---|---|---|---|
| **1 · PLAN** | exactly one (P0) | research + the plan docs as chat deliverables | one exit Summary gate (§4), then stop |
| **2 · EXECUTE** | one per phase | the site repo (phase 0), then one working increment per chat | CI green + **`site-preview` artifact** + docs updated + report; deploy gate in [RULES](RULES.md) |

- No repository, no site code, and no Pages/domain action in the plan chat.
- The plan chat also runs the **reuse scan** ([knowledge/reuse-first.md](knowledge/reuse-first.md) §2)
  for the whole site — layout base, one CSS approach, icons, data shape — so
  the roadmap is priced on reuse, not on writing everything.
- **Tokens before screens** ([knowledge/design-system.md](knowledge/design-system.md)):
  the plan chat names the design direction and the screen+state inventory;
  Phase 0 freezes the token set in `docs/DESIGN.md` before any page beyond a
  skeleton is styled. No page is built against an unfrozen palette.
- Phases run in order. A new phase starts only when the previous phase is
  recorded done (or explicitly held by the owner).

## 2. The site docs system — the self-contained set

These files, drafted in the plan chat and committed to the site repo **before
any site code**, make the repo workable **without any other repo**. Skeletons
live in `templates/` (`docs-system/`, `rule-site.md`, `prompt-site.md`,
`readme-site.md`) and are frozen into the repo at bootstrap:

| File | Holds |
|---|---|
| `README.md` | what the site is (from `templates/readme-site.md`, provenance line kept) |
| `rule.md` (repo root) | **the site's own operating manual** — laws, deploy gate, question policy, work cycle, invariants, definition of done. Self-contained: authoritative even if WebFlow is unreachable (`templates/rule-site.md`) |
| `prompt.md` (repo root) | the **self-contained continuation prompt** — paste it into the next chat; updated at every phase end (§6, `templates/prompt-site.md`) |
| `docs/RESEARCH.md` | 3–5 evidence-backed options (links + check dates), the demand verdict line, **rejected options with reasons**, the pre-written kill test, and the **reuse map** |
| `docs/DESIGN.md` | the **design specification**: direction, every screen+state, frozen tokens, component inventory, owner approval record (`templates/docs-system/DESIGN.md`) |
| `docs/ROADMAP.md` | numbered **phases** in execution order; one phase = one chat; status 📋 planned · 🚧 in progress · ✅ done · ❌ cancelled (keep the row) |
| `docs/DECISIONS.md` | the dated decision log — **the anti-re-ask register**: owner decisions, law waivers, agent decisions |
| `docs/phases/NN-<slug>.md` | one record per phase: its parts, evidence (`file:line`), what shipped, checks, **what the preview shows** |

That is the whole set — nothing else is needed from anywhere.

### Phase sizing (decent chunks, not slivers)

- A phase is **one whole capability** of the site (e.g. "search + filters",
  "installable offline shell", "printable revision sheets"), split into 2–4
  parts listed in its phase record. Each part is verifiable; the phase lands
  as one increment.
- A v1 roadmap is roughly **5–8 phases** including bootstrap. Past ~10 rows,
  phases are too small — merge them.
- Anything smaller than about half a day of work joins a neighbouring phase.
- Bugs reported later are their own small fix chats — they don't need phases.

Borrowed habits, kept light:

- Evidence before hypothesis: claims carry `file:line` reads, a live URL, or a
  named source with a check date.
- Rejected options stay recorded so later chats never re-litigate them.
- Cancelled rows stay visible (❌), never deleted.
- Facts (run ids, shas, byte sizes, URLs) are read from the repository by the
  **next** change — never guessed in the change that causes them.
- Docs ride with the code commit they describe.

## 3. Question policy — ask less, gate always

Three classes. When in doubt: decide reversibly and record, don't ask.

### GATE — always ask; never act without an explicit yes

Permanent, external, published, or owner-reserved (also restates
[RULES](RULES.md) "GitHub authority and approval gate"):

- create the site repository (and its visibility + license)
- site name, repo name, **base path** (`/<repo>/` or a custom domain), and any
  domain purchase or DNS change
- git author identity designated for the new repo
- license choice (MIT or GPL-3.0) if not already fixed
- open a PR · merge · push to `main` · enable Pages · deploy · publish a URL ·
  announce the site · tag a release
- money in any form (domains, hosting, paid services, any spending)
- legal actions and anything involving other people's personal data
- waiving or rewriting a law in `RULES.md`
- changing any answer already recorded in `docs/DECISIONS.md`

**How to ask:** one Summary batch at the gate moment, ≤4 questions, each
naming its gate ("the gate START.md stage 1 puts in front of any repo"). Never
a second batch for the same gate.

### DECIDE-ONCE — ask during the plan chat only, then record

Product-shaping choices the plan cannot honestly assume: audience and
language/locale, scope cuts, hosting target, design direction, time budget.

- Ask them in **one** batch (≤4) at the point the plan needs the answer.
- Record every answer in `docs/DECISIONS.md` with its date **the moment it is
  given** (in chat, before the files exist — then paste into the file).
- Later chats read `DECISIONS.md` before asking anything. **Re-asking a
  recorded answer is a defect, not caution.** Changing one is a GATE.

### DEFAULT — never ask

- Facts you can research — research, cite source + check date; name the gap if
  evidence is thin instead of asking the owner to fill it.
- Reversible implementation choices — decide, log under "Agent decisions" in
  `DECISIONS.md`, marked reversible on objection.
- Anything already answered in this chat or these docs — record it, use it.
- Taste with an obvious default — take the default, note it.

### Hygiene (all stages)

- Before any question: read `ROADMAP.md` + `DECISIONS.md` (or the plan in
  chat). If the answer is there, use it silently.
- If an answer would not change the plan or the code, it is not a question.
- The owner may say "decide X yourself" — that becomes an agent-decision entry.
- At most one question batch per gate moment per chat.

## 4. The plan chat's exit gate (one Summary, then stop)

1. Plan: approve / revise / hold?
2. Authorize creating the site repository? (public/private · MIT/GPL-3.0)
3. Which git author identity is designated for the new repo?
4. Working name + repo name + base path — `/<repo>/` now, custom domain later?

The DECIDE-ONCE batch is asked earlier in the same chat — not at this gate.
Then stop. No repo, no code, and no Pages settings until the owner answers.

## 5. Phase chats (one phase per chat, preview every time)

First message of every phase chat is the site's own **`prompt.md`**, pasted as
it stands (§6) — it already carries the rules digest and the state — followed
by the owner's command, e.g. `start phase 3`.

Each phase chat ends with **all** of:

1. every part of the phase implemented; its "Done means" cell in `ROADMAP.md`
   is the acceptance test, and no feature outside this phase may be added;
2. CI green, and the run's **`site-preview` artifact downloadable** — a zip of
   the served site plus `screenshots/` of the screens this phase changed, so
   the increment is visible without a deploy (it is progress, not a release);
3. `docs/phases/NN-<slug>.md` written (including a line on **what the preview
   shows**), the roadmap row's status updated;
4. `prompt.md` updated in the same commit (state, CI run, preview note, next
   phase);
5. a short report (run id, tip sha, artifact name, what is now visible);
6. **the next-chat prompt printed IN CHAT** — one fully-filled copyable block
   from `templates/next-chat-prompt.md` (next phase, its parts and "Done
   means", decisions never to re-ask, CI facts). The owner copies the next
   chat's start from the chat itself; they never have to open GitHub, the
   branch, or any file to get it. `prompt.md` in the repo remains only the
   durable backup if a chat is lost;
7. and a stop at the deploy gate.

Quality is proven **without a local browser**: the phase's no-device gate
([knowledge/quality-without-a-device.md](knowledge/quality-without-a-device.md) §1 —
parse + link + HTML/a11y lint + budgets in CI) is part of "Done means". The
owner's look at the screenshots is a look, not a test the phase waits for; the
one short real-phone pass happens once, before the public URL (§3 of that
file).

## 6. Frozen playbook, self-contained site

- **The site repo depends on nothing.** Its `rule.md` holds the full laws
  (branching, deploy gate, question policy, work cycle, invariants), its
  `prompt.md` the living state and continuation instruction, its `docs/` the
  plan and decisions. A later chat works from that repo alone.
- **WebFlow changes only here, deliberately.** Site repos keep their frozen
  `templates/`/`knowledge/` snapshot and update it only through a documented
  refresh commit (checklist in [MAINTENANCE.md](MAINTENANCE.md)).
- Provenance stays in the site README (`Bootstrapped from WebFlow @ <sha> on
  <date>`) and in the `rule.md` header — for history, not for reading.
- The owner pastes `prompt.md` into the next chat and says `start phase N` —
  or reports a bug.
