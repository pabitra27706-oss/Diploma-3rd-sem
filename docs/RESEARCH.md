# Research — Diploma 3rd Sem Study Hub

> This site predates the playbook, so this file records the evidence the site
> already implies plus the reuse map and kill test the playbook requires. It is
> not a retrospective market study; unmeasured numbers are labelled as such.

## Demand verdict line

`Demand: the site exists and targets a real, narrow audience (WB State Council
Diploma 3rd Semester, CST stream) with material that is hard to find offline;
exact demand unmeasured · Freshness: 2026 January papers are present in PYQ
data (120 records) but absent from quiz banks · Complaints: no user feedback
data collected (the feedback path is a mailto) · Owner advantage: first-hand
access to the syllabus, papers, and the ability to verify answer keys ·
Decision: fix the shipped product (Phases 1–6) before adding any subject or
feature.`

## Options already chosen by history (do not re-litigate)

| Choice | Status | Note |
|---|---|---|
| Static PWA, no backend | ✅ | Matches the zero-build law |
| One JSON registry per subject/paper | ✅ | Keep; validate with `scripts/validate_pyq.py` |
| Self-contained pages (HTML + CSS + JS per area) | ⚠️ | Works, but produced 19 CSS files, 3 theme keys, 2 progress schemas — consolidate in Phase 8 |
| Font Awesome via CDN | ❌ | Third-party runtime request; remove (Phase 5) |
| "Coming soon" bookmark/suggestions features in nav | ❌ | Finish or remove (Phase 5) |

## Reuse map (scan before building)

| Capability | Candidate (checked 2026-11-06) | Licence | Verdict | Why |
|---|---|---|---|---|
| Base CSS / typography | [picocss/pico](https://github.com/picocss/pico) | MIT | **STUDY** | The site already has a bespoke system; import its token *ideas*, not its CSS |
| Design tokens | [open-props](https://github.com/ArgyleInk/open-props) | MIT | **ADAPT** | Naming/scales for the Phase 6 token file |
| Icons | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | ISC | **ADAPT** | Fill the four missing sprite symbols from an existing set instead of drawing them |
| Tabs/dialog semantics | [W3C WAI APG](https://www.w3.org/WAI/ARIA/apg/patterns/) | W3C doc | **ADAPT** | Correct focus behaviour for the quiz dialog and tab lists (Phase 6) |
| Offline data strategy | [MDN service worker guide](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) | doc | **STUDY** | Stale-while-revalidate with a versioned cache under a subpath |
| Font Awesome | CDN link ×38 pages | OFL/MIT/CC-BY mix, unverified in-repo | **REJECT** | Third-party runtime request, breaks the offline claim; replace with the sprite |
| Tailwind/daisyUI | — | MIT | **REJECT** | Introduces a build step and a large generated file for a site that already has CSS |

## Rejected, and why

- **Adding a framework (React/Vue/Svelte).** The site has no build step and 55
  static pages. A framework adds a mandatory toolchain to a phone-first
  workflow and would rewrite working pages for no user benefit.
- **Adding analytics to "measure demand".** Against the recorded money/privacy
  decision. Demand is judged from real user contact, not from a tracker.
- **Rewriting all content as one giant JSON.** The 35-request practice load is a
  genuine problem (Phase 8), but the fix is an index/batching strategy, not
  collapsing every registry.

## Kill test (pre-written, before results)

After the site is verifiably working offline at its real URL (end of Phase 6):

- **Keep and grow** if, within 8 weeks, at least 10 distinct classmates use it
  twice or more (reported by them, not tracked) **and** at least 3 report a
  specific question or note they could not find anywhere else.
- **Cut scope** if usage exists but only for one subject: keep that subject,
  freeze the rest, and retire the empty features ("Coming soon", CST207 if no
  bank exists).
- **Retire** if fewer than 3 people use it twice in 8 weeks: stop adding
  features, leave the site as-is, and start the next idea.

Never rewrite this test after seeing results.

## Sources checked

- Repository metadata via `gh repo view` — public, default branch `main`,
  homepage `https://pabitra27706-oss.github.io/Diploma-3rd-sem/` — 2026-11-06.
- `scripts/validate_pyq.py` — 30 papers, 992 records, 0 errors/warnings —
  2026-11-06.
- `scripts/check_site.py` — 12 errors, 198 warnings — 2026-11-06.
