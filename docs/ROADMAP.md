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
| 2 | Truthful data pipeline | [`02-data-pipeline`](phases/02-data-pipeline/README.md) | 6 | `validate_data.py` in CI; 10 real practice days; computed counts; syllabus-valid units; duplicates mapped; keys or "no key" | 🚧 |
| 3 | Quiz and exam engine | [`03-quiz-engine`](phases/03-quiz-engine/README.md) | 6 | Reload-proof attempts; no empty quiz options; real-paper mock mode; honest history/export; mistake queue; no "AI" fiction | 🚧 |
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

- **License** (MIT or GPL-3.0) — Phase 7.5, needed before any public launch.
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

Phase 2 (2026-11-09): mechanical pipeline and safe UI implemented; full data/syllabus strict gates remain blocked by source verification. See `phases/02-data-pipeline/record.md` and `data/source-review-batch-01.md`. Owner delegation now permits implementation of later phases while these source gates remain open; do not mark Phase 2 complete without evidence.

### Phase 3 engineering update — 2026-11-09

Owner-delegated engine work is implemented and locally tested; see [record](phases/03-quiz-engine/record.md). Real-paper practice is **partial**, not an official scored mock: answer-any constraints and explanation-mark splits are not enforced. Phase 2 source gates remain open. Original PYQ and registry bytes are frozen by an integrity manifest/CI guard. No new deployment or merge.
