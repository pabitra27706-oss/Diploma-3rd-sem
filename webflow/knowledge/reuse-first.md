# Reuse first — research before building anything

> The agent's first job is **not** to write code. It is to find out whether a
> good pattern, a small library, or a solved answer already exists — verify it —
> and only then build what is genuinely missing. For a zero-build static site
> this saves the most time exactly where hand-rolling hurts: layout systems,
> accessible components, icons, date/data handling, and offline plumbing.
>
> Checked 2026-11-06. Catalogue entries and versions go stale — re-check live
> before every site (see [MAINTENANCE.md](../MAINTENANCE.md)).

## The law in one line

**No new component, screen pattern, library, or subsystem is hand-built until
the reuse scan (§2) for it is recorded.** "I can write this myself" is not a
reason to skip the scan.

## 1. The five reuse verdicts

Every candidate gets exactly one verdict, recorded in `docs/RESEARCH.md` (plan
chat) or the phase record (later phases):

| Verdict | Meaning | When |
|---|---|---|
| **DEPEND** | Add the library to the site, pinned, with its licence recorded | Licence compatible, maintained, does one job, and the shipped size is acceptable |
| **ADAPT** | Copy a pattern or small snippet into the site, rewritten in its style, attributed | The idea is proven but a dependency is too much |
| **STUDY** | Read it, learn the behaviour, re-implement in original code | GPL/AGPL/no-licence sources, or anything whose code may not be copied (§4) |
| **BUILD** | Write it here — the scan found nothing fit, or everything fit is worse | Record *why* the found options lost; "nothing found" must name what was searched |
| **REJECT** | Looked, and no — one-line reason stays recorded | Stale, unlicensed, licence-incompatible, bloated, privacy-hostile, tracker-carrying |

Rejected candidates stay recorded so no later chat re-researches them.

## 2. The reuse scan — 7 steps, time-boxed

Run once in the plan chat for the whole site (layout base, CSS approach, icons,
data/offline), then once per phase for that phase's capability only. Time-box
~30 minutes of searching per capability. If the scan is not done, the phase is
not ready to code.

1. **Name the capability in one sentence.** "Offline search over 900 JSON
   records on a phone", not "the site".
2. **Search in this order:** ① the curated catalogue
   ([web-references.md](web-references.md)) → ② official sources (MDN, web.dev,
   the W3C/WAI-ARIA Authoring Practices examples) → ③ GitHub search by
   capability, then by recently updated → ④ npm for the library form of the
   same idea, if a build step is already allowed.
3. **Shortlist 2–4 candidates max.** More is not research, it is hoarding.
4. **Verify each candidate** against the scorecard (§3). A candidate that fails
   licence or activity is REJECT on the spot — do not read its code "just to
   see".
5. **Distrust popularity theatre.** Stars can be inflated, forks and issues can
   be farmed. Weight in this order: licence → recent commits/releases → real
   tests/CI in the repo → who maintains it → issue quality → stars, last and
   least.
6. **Decide and write the one-line reason.** Pin exact versions for every
   DEPEND.
7. **Record it** in `docs/RESEARCH.md` § "Reuse map" or the phase record's
   "Reused" line, and log every shipped licence in `docs/DECISIONS.md`.

## 3. Verification scorecard

| Check | Pass looks like | Fail looks like |
|---|---|---|
| **Licence** | MIT / Apache-2.0 / BSD / ISC, licence file present in the repo | No licence file (= all rights reserved, unusable), or GPL/AGPL headed for an MIT site |
| **Activity** | Commit or release in the last ~6 months, not archived | Archived, "maintenance mode", or silent for a year+ |
| **Provenance** | Official org, a maintainer with a track record, releases on npm | Random template, renamed repo, downloads from a third-party ZIP site |
| **Health** | Tests + CI in-repo, changelog, issues answered | No tests, issues ignored, one giant initial commit |
| **Fit** | Does one job, small surface, works offline, no trackers | Needs a server or account, bundles analytics, doubles payload for one feature |
| **Cost** | Shipped size known and inside the budget ([web-engineering.md](web-engineering.md) §6) | Unmeasured — measure before DEPEND |

**Licence traffic light:**

- 🟢 **MIT / Apache-2.0 / BSD / ISC** — DEPEND or ADAPT freely; keep notices.
- 🟡 **GPL-3.0** — STUDY freely. Copy code **only** if the site is GPL-3.0.
  Never paste GPL code into an MIT site "just for one function".
- 🔴 **AGPL / no licence / proprietary / "source available"** — STUDY the
  *behaviour* only where lawful (§4), never copy code, text, or assets. No
  licence file means no permission, however open the repo looks.

## 4. Studying other sites — smooth, lawful, useful

1. What user job does this screen actually do? (one sentence)
2. Screen map: entry → states (loading/empty/error/success) → exit.
3. Data shape it keeps (fields, storage, offline behaviour).
4. What it asks for — permissions, accounts, cookies, network calls — and the
   user-visible reason for each.
5. **Stop looking at their implementation.** Write the spec from steps 1–4,
   then implement from the spec in this site's own style.
6. Log what was studied (URL/repo + date), what was taken (behaviour/pattern
   only), and the licence posture.

Never copy code, text, illustrations, question banks, or data from a STUDY
target. Never scrape a site to republish its content, never strip attribution,
never clone a lookalike to harvest its traffic. If a task needs one of those,
it is not a WebFlow task; stop.

## 5. Anti-patterns (each one costs a phase if it slips in)

- **Not-invented-here:** hand-rolling focus management, modals, tabs, dates,
  or a design system before the scan. These are solved.
- **CDN convenience:** "just one script tag" adds a third party that can go
  down, change, or track users — and breaks the offline claim. Self-host or
  skip.
- **Sample-shopping mid-phase:** mixing three kits' patterns because each
  looked nice. Pick ONE base.
- **Star-shopping:** choosing by stars without the §3 scorecard.
- **Dependency pile-up:** every DEPEND must remove more work than its size,
  update, and privacy cost adds. One library per job.
- **Vendoring without a record:** pasted code with no source/licence line in
  `DECISIONS.md` is a defect.
- **Silent upgrades:** bumping a reused asset "while I'm here" outside its own
  tested change.

## 6. What this changes day to day

- Plan chat: the reuse map is drafted *with* the options table, so the roadmap
  is priced on reuse.
- Phase chats: the phase record opens with its "Reused" line (verdict + source
  per part). A part with no line has not been scanned.
- Reviews: "show me the reuse scan" is a valid review comment; "we'll just
  build it" without one is not an answer.
