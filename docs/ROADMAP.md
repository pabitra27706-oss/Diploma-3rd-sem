# Roadmap — Diploma 3rd Sem Study Hub

Bootstrapped from WebFlow @ `4bc8b0b` on 2026-11-06 · replanned 2026-11-06
(10 original phases plus owner-requested device acceptance, one folder each)

> **One phase = one folder.** The original one-phase-per-chat sequencing was
> superseded by owner delegation on 2026-11-09; implementation 1–9 comes before
> dedicated device acceptance. Each folder holds `README.md` (goal,
> evidence, scope, done-means), `tasks.md` (parts with acceptance criteria) and,
> once started, `record.md`. Status: 📋 planned · 🚧 in progress · ✅ done · ❌
> cancelled (keep the row).
>
> A phase is deliberately big: 4–6 parts covering one whole capability. If a
> phase needs a seventh part, the scope was wrong — move the part, don't split
> the phase. Order matters: 2 feeds 3, 4, 5 and 8; 6 must land before backup is
> meaningful; 9 is a gate, not a milestone.

| # | Phase | Folder | Parts | Done means (short) | Status |
|---|---|---|---|---|---|
| 0 | Foundation | [`00-foundation`](phases/00-foundation/README.md) | 4 | Rules, playbook, gate, baseline, syllabus in the repo; CI green; nothing deployed | ✅ |
| 1 | Platform and deploy integrity | [`01-platform`](phases/01-platform/README.md) | 6 | Zero root-relative paths; working install + update; real icons; zero dead links; 404/robots/sitemap/canonical; CI strict | ✅* |
| 2 | Truthful data pipeline | [`02-data-pipeline`](phases/02-data-pipeline/README.md) | 6 | `validate_data.py` in CI; 10 real practice days; computed counts; syllabus-valid units; duplicates mapped; keys or "no key" | ✅* |
| 3 | Quiz and exam engine | [`03-quiz-engine`](phases/03-quiz-engine/README.md) | 6 | Reload-proof attempts; no empty quiz options; real-paper mock mode; honest history/export; mistake queue; no "AI" fiction | ✅* |
| 4 | Discovery and sharing | [`04-discovery`](phases/04-discovery/README.md) | 5 | Site-wide search offline; repeated-question explorer; deep links + share; unit↔PYQ cross-links | 🚧 |
| 5 | Study system | [`05-study-system`](phases/05-study-system/README.md) | 5 | Cards from verified content; deterministic scheduler; weak areas with denominators; daily goal + Today screen | 🚧 |
| 6 | State, notes, portability | [`06-state-portability`](phases/06-state-portability/README.md) | 6 | One storage module; one theme key; truthful reset; notes on all unit pages; backup round-trip; IDB path | 🚧 |
| 7 | Inclusion and trust | [`07-inclusion-trust`](phases/07-inclusion-trust/README.md) | 5 | WCAG 2.2 AA measured; reading controls; en/bn UI layer; privacy matches code; LICENSE + true README | 🚧 |
| 8 | Content depth and syllabus coverage | [`08-content-depth`](phases/08-content-depth/README.md) | 6 | Coverage map from the syllabus; formula sheets with sources; clean print; lab/internship pages; exam pattern reconciled | 🚧 |
| 9 | Performance, measurement, launch | [`09-performance-launch`](phases/09-performance-launch/README.md) | 6 | ≤12 requests; one token file; cache policy; honest measurement; domain-ready; checklist green, still not deployed | 🚧 |

| 10 | Dedicated cross-device acceptance | [`10-device-acceptance`](phases/10-device-acceptance/README.md) | 5 | Observed device/browser matrix, defect retests, honest tested/untested report | 📋 |

## Owner-directed sequencing — 2026-11-09

Complete implementation phases first, then run one dedicated
[Phase 10 — cross-device acceptance](phases/10-device-acceptance/README.md).
Focused regression/integrity checks continue during development. Full hardware,
browser, responsive, accessibility, offline and update acceptance is consolidated
there rather than blocking each implementation phase. Pending evidence and
source gates remain visible; no unfinished phase is relabelled complete.

## Where the user-visible work lands

| Student-visible improvement | Phase |
|---|---|
| Site works at its real URL; install and update | 1 |
| Ten practice days that mean something; no duplicate questions | 2 |
| Resume a timed quiz; attempt a real paper; practise mistakes | 3 |
| Find anything; share one question; see repeated questions | 4 |
| Flashcards, due today, weak units | 5 |
| Notes where the content is; move data to a new phone | 6 |
| Readable, keyboard-usable, bilingual UI; true privacy page | 7 |
| Coverage map, formula sheets, printables, lab pages | 8 |
| Fast on a cheap phone; a launch that is actually ready | 9 |

For the complete current remainder list and evidence limits, see
[Current status](STATUS.md). Phase records contain historical and current
results; do not treat their earlier checkpoints as passes on later changes.

## Gates still open

- **License** — **MIT chosen 2026-11-16** (see `LICENSE`); covers project code/authored content. Third-party exam-source material rights remain a separate gate.
- **Content verification** — Phase 2.5 and Phase 8.6, owner sign-off per batch.
- **Measurement method** — Phase 9.4, local-only by default; real analytics is a
  new decision.
- **Deploy** — never authorised implicitly; Phase 9.6 stops before it.
- **Domain** — readiness only; purchasing is a separate gate.

## Held / cancelled (keep visible)

- Bookmark system and Study Tips pages — currently "Coming Soon" with empty CSS
  and JS files. Phase 1.4 removes the dead navigation entries; Phase 6 decides
  whether bookmarks return as a real feature.

*Phase 1 platform implementation complete (2026-11-09). Full syllabus-strict subtask remains blocked by seven source-verification-gated PYQs; coverage stays advisory per the recorded Phase 2 decision. See `phases/01-platform/record.md`. Phone install/unfurl are still launch checks.

*Phase 2 engineering passed owner Termux verification (`2026-11-16`, commit `021c4f2f94f387f4dd4e020d09e82a12b8720bec`, Web CI `43917224887` green). Full data/syllabus `--strict` remains gated separately on owner source verification (`9` fingerprinted data findings in `docs/data/validation-exceptions.json` + `3` grouped syllabus findings; see `phases/02-data-pipeline/record.md` and `data/source-review-batch-01.md`).

*Phase 3 owner-approved (`✅*`, merged to `main` via PR #11 `9d47c7c7`, status reconciled `2026-11-17`): all parts 3.1–3.6 verified across 28 frozen PYQ papers (`answerAny` section/choiceSet quotas, 30m `2023-03` Group A loose-script window, `1m option + 1m written explanation` split on 15 `2024–2026` papers, reload-proof timers, exact retry/mistake queue, MD/TXT/JSON/Print-PDF export). Open caveats recorded in `phases/03-quiz-engine/record.md`: no standalone CST207 quiz bank (CSO uses its 6 PYQ papers / 195 questions); 456 unkeyed quiz items and subjective/written-explanation marks remain manual self-review; 9 data + 3 syllabus findings stay under the source-verification gate; physical phone/browser acceptance is in Phase 10.

Phase 5 (implemented and gate-verified `2026-11-17` on `arena/4d3997da-diploma-3rd-sem`, still `🚧` until the owner verifies): parts 5.1–5.5 delivered — 1,339 deterministic cards (923 PYQ model answers + 416 keyed quiz explanations) with a reason for every one of 457 skips, per subject **and per unit**, CST207 disclosed as PYQ-only, display-safe `citationLabel` on every card, minified 1.07 MB payload; documented fixed Leitner scheduler (1/3/7/16/35 days) with local-midnight rollover, per-day new-card cap, clock clamps, duplicate-rating idempotence and reload survival; review UI with answer-first → reveal → rate, Space/1–4/Esc, subject/unit filters via URL + `popstate`, an empty queue that offers mistakes/weakest unit/practice/Today and zero raw course codes or question ids; weak areas with `correct / attempted`, contributing attempts, a five-observation percentage floor, collapsed generic topics and both-window trends; and a Today screen with one primary action, goal meter, honest resettable streak, deterministic question of the day and `subjectLabel()` throughout. Offline worker `VERSION` is now `study-2026-11-17` with `WARM_STUDY` card shards. Answer certification, 456 keyless quiz items, the CST207 quiz-bank gap and device/screen-reader acceptance remain open and unchanged. See `phases/05-study-system/record.md`.

Phase 4 (updated `2026-11-17` on `arena/80b11bcf-diploma-3rd-sem`): all engineering parts 4.1–4.5 implemented and gate-verified — 2,410 search entries across 5 subject shards + `index-pages.json` (50 of 68 shipped HTML pages indexed, 18 explicitly excluded in `manifest.json`, all shards ≤ 40% of source bytes), offline SW precache + `WARM_SEARCH`, XSS-safe keyboard/URL/`popstate` search UI, repeated-question explorer showing 1 exact alias group + 15 explicitly labelled unverified normalized-text candidate clusters (32 records), canonical deep links + `navigator.share`/clipboard/input fallbacks across PYQ Answers/Practice/Quiz Review/Result, authored unit heading anchors + breadcrumbs + subject-hub counts + filtered-PYQ URL handoff, and zero raw `CST20x` codes or question IDs in visible UI. Awaiting owner Termux/browser verification before closing `🚧` → `✅*`. See `phases/04-discovery/record.md`.
