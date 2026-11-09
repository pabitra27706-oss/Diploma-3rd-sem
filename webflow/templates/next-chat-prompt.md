<!-- SPDX-License-Identifier: MIT -->

# Next-chat prompt — printed IN CHAT at every phase end

> **Delivery rule (owner-facing):** when a phase completes, the agent prints the
> block below — fully filled, no placeholders left — as ONE copyable `text`
> block **in the chat**, right after the phase report. The owner copies it from
> the chat and pastes it as the first message of the next chat. The owner never
> has to open GitHub, a branch, or any file to get it.
>
> `prompt.md` in the repo is still updated in the same commit — it is the
> durable backup if a chat is lost, **not** the delivery path. If the two ever
> disagree, the repo wins and the agent says so.
>
> Fill rules: read the facts (phase, CI run, artifact, decisions) from the
> repository — never from memory. Keep it self-contained: the next chat must be
> able to start from this block plus the repo alone. No secrets, credentials, or
> private data — ever.

```text
Continue [SITE] ([repo]) — phase [N+1] of [total]: "[phase title]".

Repo: [owner/repo] · branch: [session branch] · base path: [/[repo]/]
Never create/switch branches, never push main, never force-push or reset
--hard, never enable Pages or deploy.
Provenance: WebFlow @ [sha] (reference only — this repo is self-contained;
obey THIS repo's rule.md).

Just completed (do not redo, do not re-ask):
- Phase [N] "[title]" ✅ — [one-line outcome].
- CI run [id] green · tip sha [sha] · site-preview artifact [name] shows:
  [what the screenshots show].
- Decisions already recorded in docs/DECISIONS.md — never re-ask them:
  [audience · language · base path · design direction · time budget · license ·
  git author · any waivers, each with its date].

This chat — implement phase [N+1] ONLY (all its parts, nothing outside):
- [N+1].1 [part — observable outcome]
- [N+1].2 [part — observable outcome]
- [N+1].3 [part — observable outcome, if any]
Done means: [copy the "Done means" cell from docs/ROADMAP.md verbatim].
Its no-device gate must be green (frozen
knowledge/quality-without-a-device.md §1) and the site-preview artifact must
be uploaded.

How to work (full rules: rule.md):
1. Read docs/ROADMAP.md, docs/DECISIONS.md, docs/DESIGN.md, the latest
   docs/phases/ record, and docs/RESEARCH.md's reuse map — trust the repo, not
   memory.
2. Evidence before hypothesis: file:line reads against the current tree.
3. Reuse first: run this phase's reuse scan before building any part; record
   DEPEND/ADAPT/STUDY/BUILD/REJECT per part; log shipped licences.
4. Ask less, gate always: GATE items (PR, merge, main push, deploy, Pages,
   domain, publish, announcement, money, legal, changing a recorded decision)
   only as one Summary batch; everything else researched or logged.
5. Stay zero-build and base-path safe: plain HTML/CSS/JS, no framework, no
   backend, no analytics, no ads, no third-party runtime request, no
   root-relative path.
6. End this phase with ALL of: checks green + site-preview uploaded ·
   docs/phases/[NN]-<slug>.md (incl. what the preview shows and the "Reused"
   lines) · roadmap row updated · prompt.md updated in the same commit · short
   report (run id, tip sha, artifact, what is now visible) · then print the
   NEXT phase's next-chat prompt in chat from templates/next-chat-prompt.md ·
   stop at the deploy gate. No PR, merge, deploy, or announcement without my
   explicit command in chat.

Start: phase [N+1].
```

## Last phase, deploy, and bug-fix chats

- After the **final** v1 phase, the block's "This chat" section says:
  `Launch prep only, per docs/ROADMAP.md phase [N] and
  templates/site-checklist.md — prepare and report, stop before any deploy.`
- For a **deploy** chat, use `PROMPTS.md` P6 and wait for each answer before
  acting.
- For a bug-fix chat, replace "This chat" with the bug: observed behaviour,
  where seen (URL / page / artifact), and "diagnose evidence-first; fix only
  this bug; same ending as step 6 above."
