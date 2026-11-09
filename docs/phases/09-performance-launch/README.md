# Phase 9 — Performance, measurement and launch

**Status:** 📋 planned · **Parts:** 6 · **Depends on:** 1–8 · **Owner gates:** analytics decision (9.4), deploy (9.6), domain (9.5)

## Goal

Make the whole thing fast on a cheap phone, decide honestly how anyone will know
whether it is used, be ready for a domain without buying one, and stand at the
launch gate with everything checked and nothing deployed.

## Why now — the measured evidence

| Problem | Number |
|---|---|
| Requests before practice can render (5 registries + 30 papers, largely sequential) | 35 |
| CSS files with duplicated values, no single token source | 19 |
| Third-party runtime requests | Font Awesome on 38 pages (removed in Phase 1, verified here) |
| Largest single data file | 68 KB (fine) — but the aggregate load pattern is not |
| Metadata for sharing | canonical/OG/sitemap/404 added in Phase 1; verified here |
| No way to know if anyone uses the site | no analytics by design; no alternative either |

## Scope

- **In:** data loading strategy, CSS/JS consolidation, caching/update policy,
  privacy-first measurement, base-path/domain readiness, launch checklist,
  rollback, real-phone pass.
- **Out:** new features. If a feature is missing here, it was not in Phase 1–8
  and does not belong in a launch phase.

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 9.1 | Data loading | One view needs ≤ 12 requests, mostly parallel |
| 9.2 | CSS/JS consolidation | One token file; dead code removed; budgets measured |
| 9.3 | Caching and update policy | Fresh data, stale-proof shell, no stranded clients |
| 9.4 | Measurement without surveillance | Honest answer to "is anyone using this" |
| 9.5 | Domain readiness | Switching base path is one recorded change, not a rewrite |
| 9.6 | Launch gate | Checklist green, phone pass recorded, still not deployed |

Details: [`tasks.md`](tasks.md).

## The measurement decision (recorded, not assumed)

Third-party analytics would break the recorded privacy decision and the
"no third-party runtime request" invariant. The default is therefore:

1. an in-site, local-only "Was this useful?" prompt with a count the owner can't
   see remotely — so it only helps the *user*; plus
2. a real contact route that works (`mailto:` or a form-free copy template); plus
3. honest reporting: "we do not measure usage; here is what we can and cannot
   know".

If the owner wants real numbers later, that is a recorded decision with a named
tool, a privacy-page update, and a page-weight budget — a gate, not a slip.

## Done means

- Request count per view ≤ 12 (measured from code, not guessed).
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best practices ≥ 95,
  SEO ≥ 95 on the two heaviest pages (run in CI or recorded from a real run).
- LCP ≤ 2.5 s simulated on mid-range mobile; CLS ≤ 0.1; INP ≤ 200 ms.
- One token file; no duplicated colour literals outside it (grep-checked).
- Data version and cache policy documented; a deploy can invalidate data without
  stranding clients.
- Measurement decision recorded with its privacy consequence.
- Domain checklist written: what changes, in what order, with a rollback.
- `site-checklist.md` fully ticked with dates; real-phone pass recorded; deploy
  NOT performed.

## Risks

- Performance work at the end of a project is where scope sneaks in. Nothing new
  is added here.
- Lighthouse in CI is flaky on shared runners; record the number and the machine
  it came from, and keep the budget checks (bytes, requests) as the blocking
  gate.
- A launch checklist that is ticked in one chat and deployed in the next needs
  the deploy to re-run the same checks — the deploy prompt (P6 in `PROMPTS.md`)
  does that.
