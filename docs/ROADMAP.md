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
| 4 | Discovery and sharing | [`04-discovery`](phases/04-discovery/README.md) | 5 | Site-wide search offline; repeated-question explorer; deep links + share; unit↔PYQ cross-links | ✅* |
| 5 | Study system | [`05-study-system`](phases/05-study-system/README.md) | 5 | Cards from verified content; deterministic scheduler; weak areas with denominators; daily goal + Today screen | ✅* |
| 6 | State, notes, portability | [`06-state-portability`](phases/06-state-portability/README.md) | 6 | One storage module; one theme key; truthful reset; notes on all unit pages; backup round-trip; IDB path | ✅* |
| 7 | Inclusion and trust | [`07-inclusion-trust`](phases/07-inclusion-trust/README.md) | 5 | WCAG 2.2 AA measured; reading controls; en/bn UI layer; privacy matches code; LICENSE + true README | ✅* |
| 8 | Content depth and syllabus coverage | [`08-content-depth`](phases/08-content-depth/README.md) | 6 | Coverage map from the syllabus; formula sheets with sources; clean print; lab/internship pages; exam pattern reconciled | 🚧 (8.1/8.3/8.4/8.5 done; 8.2 + 8.6 owner gates) |
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

Phase 5 (**`✅*` — owner-verified 2026-11-17 "device test pass", merged to `main` on owner instruction**; implemented and gate-verified `2026-11-17` on `arena/4d3997da-diploma-3rd-sem`): parts 5.1–5.5 delivered — 1,339 deterministic cards (923 PYQ model answers + 416 keyed quiz explanations) with a reason for every one of 457 skips, per subject **and per unit**, CST207 disclosed as PYQ-only, display-safe `citationLabel` on every card, minified 1.07 MB payload; documented fixed Leitner scheduler (1/3/7/16/35 days) with local-midnight rollover, per-day new-card cap, clock clamps, duplicate-rating idempotence and reload survival; review UI with answer-first → reveal → rate, Space/1–4/Esc, subject/unit filters via URL + `popstate`, an empty queue that offers mistakes/weakest unit/practice/Today and zero raw course codes or question ids; weak areas with `correct / attempted`, contributing attempts, a five-observation percentage floor, collapsed generic topics and both-window trends; and a Today screen with one primary action, goal meter, honest resettable streak, deterministic question of the day and `subjectLabel()` throughout. Offline worker `VERSION` was `study-2026-11-17` with `WARM_STUDY` card shards (Phase 6 bumps it to `study-2026-11-17b`). Answer certification, 456 keyless quiz items, the CST207 quiz-bank gap and device/screen-reader acceptance remain open and unchanged. See `phases/05-study-system/record.md`.

Phase 6 (`06-state-portability`, gate-verified `2026-11-17` on `arena/be90e07e-diploma-3rd-sem` and merged to `main` on owner instruction as **`5b7eb66`** via PR #14 — Web CI `44034450353` and Pages `44034449241` green; **`🚧` → `✅*`**): parts 6.1–6.6 delivered — `assets/js/storage.js` is still the only file that touches `localStorage` (one comment line elsewhere), legacy keys migrate on read and are deleted after a verified copy with an idempotent `d3s:schema` marker; one `d3s:prefs` record drives theme, text size, line height, contrast, motion and language, applied by the synchronously loaded module before first paint with a `prefers-color-scheme` listener and every legacy theme call site collapsed onto `StudyStorage.theme()/setTheme()`; the Settings reset choices carry live registry counts and `everything` requires `RESET` and repaints the page into a first-run look; one shared note widget now covers the 24 unit pages **and** practice/quiz review with per-question keys, debounce, flush-before-rerender, plain-text-only records that ride in the backup; the backup envelope gains `appVersion`; and IndexedDB ships as **a recovery mirror, not a primary store** (`hydrate()` rebuilds only an empty origin, `idbStatus()` reports `primary:'localStorage'` and the 1.5 MiB threshold). Acceptance 6.6-3 is recorded as partially met. Worker `VERSION` is now `study-2026-11-17b`. See `phases/06-state-portability/record.md`.

Phase 7 (`07-inclusion-trust`, implemented and gate-verified `2026-11-17` on `arena/c56bb630-diploma-3rd-sem`, **owner-accepted `2026-11-17` — `🚧` → `✅*`** on a general Android/Chrome smoke pass, **not merged**): parts 7.1–7.5 delivered — re-measurement first, because the phase's own evidence table was stale (it claimed 55 pages, 55 without skip links, 36 without `<main>`, no `LICENSE`; the tree is **68 pages**, 11 without `<main>`/skip, and `LICENSE` has existed since 2026-11-16); then one `<main>`, one `<h1>` and a skip link on all 68 pages (from 11 missing), 134 heading-order jumps across 32 pages to **0** (933 decorative `<h4>` card labels became `<p class="card-title">`, keeping every attribute and the `<h4>` typography through one class, while drawer/brand chrome deliberately stayed `<h3>` so `build_search_index.py`'s `unitDrawerChromeExcluded` contract and its test are untouched), the one unlabelled control labelled (`pyq/answers.html` search) plus an explicit `for`/`id` on the settings import checkbox, a solid focus-ring token replacing a 2.2:1 alpha halo, **27 of 47 failing contrast pairs to 0** by changing 14 tokens at source (including the `--accent-*-rgb` triplets so `rgba()` tints do not keep old hues) with 21 of 22 first-party stylesheets now declaring a reduced-motion rule (from 7) and all 68 pages loading the global override, no control box pinned below 24×24 CSS px, a 38-key English/Bengali UI catalog loaded on every page through the shared head block and precached, the truth pass that removed the "Android application"/"app requires permissions" framing and the unqualified "all subjects offline" claim, an MIT `LICENSE` referenced with a licence/content-rights section on the credits page, and two new enforceable checks (`scripts/audit_accessibility.py` with a baseline locked by 11 tests, and `scripts/check_readme_paths.py`). **No WCAG conformance claim:** rendered contrast after compositing, 200 % zoom/reflow, dialog/tab focus behaviour, screen-reader output, tap accuracy, Bengali conjunct rendering and keyboard-only core-flow completion remain unverified and move to Phase 10. The owner accepted the phase as `✅*` on 2026-11-17 after a smoke pass on one Android phone in Chrome reported no failures; that pass did not measure those items, so they remain open and unupgraded. Worker `VERSION` is `study-2026-11-17c`. See `phases/07-inclusion-trust/record.md`.

Phase 4 (updated `2026-11-17` on `arena/80b11bcf-diploma-3rd-sem`): all engineering parts 4.1–4.5 implemented and gate-verified — 2,410 search entries across 5 subject shards + `index-pages.json` (50 of 68 shipped HTML pages indexed, 18 explicitly excluded in `manifest.json`, all shards ≤ 40% of source bytes), offline SW precache + `WARM_SEARCH`, XSS-safe keyboard/URL/`popstate` search UI, repeated-question explorer showing 1 exact alias group + 15 explicitly labelled unverified normalized-text candidate clusters (32 records), canonical deep links + `navigator.share`/clipboard/input fallbacks across PYQ Answers/Practice/Quiz Review/Result, authored unit heading anchors + breadcrumbs + subject-hub counts + filtered-PYQ URL handoff, and zero raw `CST20x` codes or question IDs in visible UI. **Owner-verified 2026-11-17 ("device test pass") and merged to `main` on owner instruction — `🚧` → `✅*`** with its caveats (unverified candidate clusters, source certification, Phase 10 device matrix). See `phases/04-discovery/record.md`.

*Phase 8 status `2026-11-17` (`arena/e0da0bec-diploma-3rd-sem`): parts 8.1 (coverage map rebuilt: 23 declared units, 2 out-of-syllabus rows listed, per-unit quiz counts corrected from a page that showed 0 everywhere, Unit-1 skew 496/924 = 53.7% published with its explanation), 8.5 (the p.14 ESE table reproduced; all 28 paper maxima reconciled from each paper's own printed quotas — the earlier "totals differ" was a comparison error), 8.3 (`print.css` on 74/74 pages, answers-on-a-new-page toggle, no fake running header) and 8.4 (lab/internship pages rewritten with credits, hours, assessment fields and syllabus page anchors) are implemented and gate-verified. Parts 8.2 (44 sourced draft entries, 3 with symbol legends, every citation checked verbatim against the syllabus) and 8.6 (register + fail-closed validator + derived ledger) are **built and gated, not certified**: 0 of 44 sheet entries and 0 of 924 answers are owner-verified. A real phone print/PDF export was not observed and stays in Phase 10. Tree is now 74 pages (50 → 56 indexed), worker `study-2026-11-17d`. See `phases/08-content-depth/record.md`.*
