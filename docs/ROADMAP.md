# Roadmap — Diploma 3rd Sem Study Hub

> **Closure update (2026-11-18):** by owner direction, Phases 1–10 are now
> administratively closed; any remaining test or acceptance item is **SKIPPED**,
> not passed. Use [`PROJECT-CLOSURE.md`](PROJECT-CLOSURE.md) for the controlling
> per-phase disposition. Earlier roadmap text below is historical where it
> conflicts with that closeout. Phase 11 is new work approved separately and
> does not reopen the closed phases.

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
| 8 | Content depth and syllabus coverage | [`08-content-depth`](phases/08-content-depth/README.md) | 6 | Coverage map from the syllabus; formula sheets with sources; clean print; lab/internship pages; exam pattern reconciled | Closed by owner direction; 8.2/8.6 verification SKIPPED (0/44, 0/924 certified) |
| 9 | Performance, measurement, launch | [`09-performance-launch`](phases/09-performance-launch/README.md) | 6 | ≤12 requests; one token file; cache policy; honest measurement; domain-ready; checklist green, still not deployed | Closed by owner direction; 9.4 no counter; Lighthouse/remaining checks SKIPPED |
| 9B | UI reboost | [`09B-ui-reboost`](phases/09B-ui-reboost/record.md) | reviewed batches | Owner-approved direction and plan; phone/desktop review of each batch; token, a11y and weight gates | ✅* merged 2026-11-17 (no physical-device pass) |
| 9C | Unit-notes reading layer (phone-first) | [`09C-unit-notes-reading-layer`](phases/09C-unit-notes-reading-layer/record.md) | 6 | Four note-page defects fixed; phone-first calm reading layer; Watch & Learn video links on all 24 unit pages with no third-party request until tap; per-subject accent restored | ✅ shipped 2026-11-17 · awaiting owner phone review |
| 10 | Dedicated cross-device acceptance | [`10-device-acceptance`](phases/10-device-acceptance/README.md) | 5 | Observed device/browser matrix, defect retests, honest tested/untested report | Closed by owner direction; partial Galaxy A35 report retained; remaining matrix SKIPPED |
| 11 | Subject-wise Suggestions | [`11-suggestions`](phases/11-suggestions/README.md) | 4 | Home opens a five-card hub and ten guides: rated syllabus workbooks and quick-win Easy Read plans with linked notes, drills and exact dated practice | 🚧 All five pairs updated; awaiting owner review (not accepted) |
| 12 | Computer Programming in C — weight-calibrated content, videos & PYQ sync | [`12-cst201-c-content`](phases/12-cst201-c-content/README.md) | 6 | 5 C units (2 cr, 30h, PDF p. 3) calibrated to 2023–2026 PYQs (`P003–P006`: 4 papers, 105 Qs, 395m — U4 24.6%, U2 24.1%, U1 21.8%, U3 16.7%, U5 12.9%), verified YouTube links & PYQ↔unit sync | ✅ owner-passed 2026-11-18 (Termux: "Test pass and it's pretty accurate too") · all six parts + explicit topic map (generic landings 35/105 → 3/105) |
| 13 | Scripting Languages (Python) — weight-calibrated content, videos & PYQ sync | [`13-cst203-python-content`](phases/13-cst203-python-content/README.md) | 6 | 5 Python units (2 cr, 30h, PDF pp. 5–7) calibrated to 2023–2026 PYQs (`P003–P006`: 4 papers, 104 Qs, 387m — U1 39.3%, U3 23.8%, U2 16.5%, U4 12.7%, U5 7.8%; badged `lambda`/NumPy/set/Flask notes), verified YouTube links & PYQ↔unit sync | ✅ **owner-passed 2026-11-19** — all 5 units rewritten, topic map, 157/157 tests, 13 gates green; plus the phone section-overlap fix |
| 14 | Data Structures — weight-calibrated content, videos & PYQ sync | [`14-cst205-ds-content`](phases/14-cst205-ds-content/README.md) | 5 | 4 DS units (3 cr, 45h, PDF p. 7) calibrated to 2023–2026 PYQs (`P003–P006`: 4 papers, 106 Qs, 403m — U4 36.0%, U2 35.5%, U3 18.6%, U1 9.9%) with runnable C, AVL/B-tree/traversal/queue/stack traces, verified YouTube links & PYQ↔unit sync | ✅ **owner-passed 2026-11-19** (Termux: "Test passed"); merge authorized (PR #31) — all 4 units verified, 106/106 mapped (71 unit corrections), 178 tests + 11 Node suites green |
| 15 | Computer System Organization — weight-calibrated content, videos & PYQ sync | [`15-cst207-cso-content`](phases/15-cst207-cso-content/README.md) | 6 | 5 CSO units (4 cr, 60h, PDF p. 10) calibrated to 2023–2026 PYQs (`P003–P006`: 4 papers, 103 Qs, 385m — U2 29.1%, U5 28.6%, U1 21.0%, U3 20.3%, lean U4 ALP 1.0%), verified YouTube links, U4 revision sheet & PYQ↔unit sync | ✅* Owner-passed 2026-11-19 · five theory units complete · 102/102 labelled routes · hosted browser-smoke caveat recorded |
| 16 | Algorithms — weight-calibrated content, videos & PYQ sync | [`16-cst209-algorithms-content`](phases/16-cst209-algorithms-content/README.md) | 6 | 4 Algorithms units (4 cr, 60h, PDF p. 12) + CO5 Supplementary Unit 5 calibrated to 2023–2026 PYQs (`P003–P006`: 4 papers, 105 Qs, 395m — U4 23.5%, U3 23.3%, U1 22.5%, U2 20.0%, CO5 U5 10.6%), verified YouTube links & PYQ↔unit sync | ✅* Owner-accepted 2026-11-19; merge authorized — 105/105 mapped, 8/8 CO5, 166 local tests; video-selection and hosted browser-smoke caveats |
| 17 | Topic-map cross-check | [`17-topic-map-crosscheck`](phases/17-topic-map-crosscheck/README.md) | 5 | Five `topic-map-<subject>.json` files conformant, complete and anchor-verified; anchor-rot caught by a test; every subject at or better than its 2026-11-18 routing baseline; placeholder-topic decision recorded | 📋 planned (runs after 16) |

## Owner-directed sequencing — 2026-11-09

Complete implementation phases including owner-gated Phase 9B first, then run one dedicated
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
| Pick a subject, practise selected past questions, or open a quick revision guide | 11 |
| Deep exam-complete unit notes, verified topic-wise YouTube lessons & exact PYQ↔unit synchronization for C, Python, DS, CSO & Algorithms | 12–16 |

For the complete current remainder list and evidence limits, see
[Current status](STATUS.md). Phase records contain historical and current
results; do not treat their earlier checkpoints as passes on later changes.

## Closure disposition (supersedes the historical gate list below)

The owner closed Phases 1–10 on 2026-11-18 and directed no further tests. The
Phase 2/8 content verification and Phase 9.6/10 device/browser items that were
not completed are skipped/untested, not passed. Phase 9.4 is closed without a
counter. This does not grant new deployment or domain authorization. See
[`PROJECT-CLOSURE.md`](PROJECT-CLOSURE.md) for the per-phase table; preceding
phase evidence and the historical notes below remain available without being
current action items.

## Held / cancelled (keep visible)

- The standalone Bookmarks placeholder stays out of scope. The separate Study
  Tips placeholder is now in scope for Phase 11.

*Phase 1 platform implementation complete (2026-11-09). Full syllabus-strict subtask remains blocked by seven source-verification-gated PYQs; coverage stays advisory per the recorded Phase 2 decision. See `phases/01-platform/record.md`. Phone install/unfurl are still launch checks.

*Phase 2 engineering passed owner Termux verification (`2026-11-16`, commit `021c4f2f94f387f4dd4e020d09e82a12b8720bec`, Web CI `43917224887` green). Full data/syllabus `--strict` remains gated separately on owner source verification (`9` fingerprinted data findings in `docs/data/validation-exceptions.json` + `3` grouped syllabus findings; see `phases/02-data-pipeline/record.md` and `data/source-review-batch-01.md`).

*Phase 3 owner-approved (`✅*`, merged to `main` via PR #11 `9d47c7c7`, status reconciled `2026-11-17`): all parts 3.1–3.6 verified across 28 frozen PYQ papers (`answerAny` section/choiceSet quotas, 30m `2023-03` Group A loose-script window, `1m option + 1m written explanation` split on 15 `2024–2026` papers, reload-proof timers, exact retry/mistake queue, MD/TXT/JSON/Print-PDF export). Open caveats recorded in `phases/03-quiz-engine/record.md`: no standalone CST207 quiz bank (CSO uses its 6 PYQ papers / 195 questions); 456 unkeyed quiz items and subjective/written-explanation marks remain manual self-review; 9 data + 3 syllabus findings stay under the source-verification gate; physical phone/browser acceptance is in Phase 10.

Phase 5 (**`✅*` — owner-verified 2026-11-17 "device test pass", merged to `main` on owner instruction**; implemented and gate-verified `2026-11-17` on `arena/4d3997da-diploma-3rd-sem`): parts 5.1–5.5 delivered — 1,339 deterministic cards (923 PYQ model answers + 416 keyed quiz explanations) with a reason for every one of 457 skips, per subject **and per unit**, CST207 disclosed as PYQ-only, display-safe `citationLabel` on every card, minified 1.07 MB payload; documented fixed Leitner scheduler (1/3/7/16/35 days) with local-midnight rollover, per-day new-card cap, clock clamps, duplicate-rating idempotence and reload survival; review UI with answer-first → reveal → rate, Space/1–4/Esc, subject/unit filters via URL + `popstate`, an empty queue that offers mistakes/weakest unit/practice/Today and zero raw course codes or question ids; weak areas with `correct / attempted`, contributing attempts, a five-observation percentage floor, collapsed generic topics and both-window trends; and a Today screen with one primary action, goal meter, honest resettable streak, deterministic question of the day and `subjectLabel()` throughout. Offline worker `VERSION` was `study-2026-11-17` with `WARM_STUDY` card shards (Phase 6 bumps it to `study-2026-11-17b`). Answer certification, 456 keyless quiz items, the CST207 quiz-bank gap and device/screen-reader acceptance remain open and unchanged. See `phases/05-study-system/record.md`.

Phase 6 (`06-state-portability`, gate-verified `2026-11-17` on `arena/be90e07e-diploma-3rd-sem` and merged to `main` on owner instruction as **`5b7eb66`** via PR #14 — Web CI `44034450353` and Pages `44034449241` green; **`🚧` → `✅*`**): parts 6.1–6.6 delivered — `assets/js/storage.js` is still the only file that touches `localStorage` (one comment line elsewhere), legacy keys migrate on read and are deleted after a verified copy with an idempotent `d3s:schema` marker; one `d3s:prefs` record drives theme, text size, line height, contrast, motion and language, applied by the synchronously loaded module before first paint with a `prefers-color-scheme` listener and every legacy theme call site collapsed onto `StudyStorage.theme()/setTheme()`; the Settings reset choices carry live registry counts and `everything` requires `RESET` and repaints the page into a first-run look; one shared note widget now covers the 24 unit pages **and** practice/quiz review with per-question keys, debounce, flush-before-rerender, plain-text-only records that ride in the backup; the backup envelope gains `appVersion`; and IndexedDB ships as **a recovery mirror, not a primary store** (`hydrate()` rebuilds only an empty origin, `idbStatus()` reports `primary:'localStorage'` and the 1.5 MiB threshold). Acceptance 6.6-3 is recorded as partially met. Worker `VERSION` is now `study-2026-11-17b`. See `phases/06-state-portability/record.md`.

Phase 7 (`07-inclusion-trust`, implemented and gate-verified `2026-11-17` on `arena/c56bb630-diploma-3rd-sem`, **owner-accepted `2026-11-17` — `🚧` → `✅*`** on a general Android/Chrome smoke pass, **not merged**): parts 7.1–7.5 delivered — re-measurement first, because the phase's own evidence table was stale (it claimed 55 pages, 55 without skip links, 36 without `<main>`, no `LICENSE`; the tree is **68 pages**, 11 without `<main>`/skip, and `LICENSE` has existed since 2026-11-16); then one `<main>`, one `<h1>` and a skip link on all 68 pages (from 11 missing), 134 heading-order jumps across 32 pages to **0** (933 decorative `<h4>` card labels became `<p class="card-title">`, keeping every attribute and the `<h4>` typography through one class, while drawer/brand chrome deliberately stayed `<h3>` so `build_search_index.py`'s `unitDrawerChromeExcluded` contract and its test are untouched), the one unlabelled control labelled (`pyq/answers.html` search) plus an explicit `for`/`id` on the settings import checkbox, a solid focus-ring token replacing a 2.2:1 alpha halo, **27 of 47 failing contrast pairs to 0** by changing 14 tokens at source (including the `--accent-*-rgb` triplets so `rgba()` tints do not keep old hues) with 21 of 22 first-party stylesheets now declaring a reduced-motion rule (from 7) and all 68 pages loading the global override, no control box pinned below 24×24 CSS px, a 38-key English/Bengali UI catalog loaded on every page through the shared head block and precached, the truth pass that removed the "Android application"/"app requires permissions" framing and the unqualified "all subjects offline" claim, an MIT `LICENSE` referenced with a licence/content-rights section on the credits page, and two new enforceable checks (`scripts/audit_accessibility.py` with a baseline locked by 11 tests, and `scripts/check_readme_paths.py`). **No WCAG conformance claim:** rendered contrast after compositing, 200 % zoom/reflow, dialog/tab focus behaviour, screen-reader output, tap accuracy, Bengali conjunct rendering and keyboard-only core-flow completion remain unverified and move to Phase 10. The owner accepted the phase as `✅*` on 2026-11-17 after a smoke pass on one Android phone in Chrome reported no failures; that pass did not measure those items, so they remain open and unupgraded. Worker `VERSION` is `study-2026-11-17c`. See `phases/07-inclusion-trust/record.md`.

Phase 4 (updated `2026-11-17` on `arena/80b11bcf-diploma-3rd-sem`): all engineering parts 4.1–4.5 implemented and gate-verified — 2,410 search entries across 5 subject shards + `index-pages.json` (50 of 68 shipped HTML pages indexed, 18 explicitly excluded in `manifest.json`, all shards ≤ 40% of source bytes), offline SW precache + `WARM_SEARCH`, XSS-safe keyboard/URL/`popstate` search UI, repeated-question explorer showing 1 exact alias group + 15 explicitly labelled unverified normalized-text candidate clusters (32 records), canonical deep links + `navigator.share`/clipboard/input fallbacks across PYQ Answers/Practice/Quiz Review/Result, authored unit heading anchors + breadcrumbs + subject-hub counts + filtered-PYQ URL handoff, and zero raw `CST20x` codes or question IDs in visible UI. **Owner-verified 2026-11-17 ("device test pass") and merged to `main` on owner instruction — `🚧` → `✅*`** with its caveats (unverified candidate clusters, source certification, Phase 10 device matrix). See `phases/04-discovery/record.md`.

*Phase 8 status `2026-11-17` (`arena/e0da0bec-diploma-3rd-sem`): parts 8.1 (coverage map rebuilt: 23 declared units, 2 out-of-syllabus rows listed, per-unit quiz counts corrected from a page that showed 0 everywhere, Unit-1 skew 496/924 = 53.7% published with its explanation), 8.5 (the p.14 ESE table reproduced; all 28 paper maxima reconciled from each paper's own printed quotas — the earlier "totals differ" was a comparison error), 8.3 (`print.css` on 74/74 pages, answers-on-a-new-page toggle, no fake running header) and 8.4 (lab/internship pages rewritten with credits, hours, assessment fields and syllabus page anchors) are implemented and gate-verified. Parts 8.2 (44 sourced draft entries, 3 with symbol legends, every citation checked verbatim against the syllabus) and 8.6 (register + fail-closed validator + derived ledger) are **built and gated, not certified**: 0 of 44 sheet entries and 0 of 924 answers are owner-verified. A real phone print/PDF export was not observed and stays in Phase 10. Tree is now 74 pages (50 → 56 indexed), worker `study-2026-11-17d`. See `phases/08-content-depth/record.md`.*

*Phase 8 closed `2026-11-17`: the owner reported "everything is pass on a smoke use test, nothing breaks" and authorized the merge — PR #16. `✅*` means the implementation was accepted, **not** that content was verified: 0 of 44 revision-sheet entries and 0 of 924 answers carry a source sign-off, 456 quiz items remain unkeyed, CST201's quiz bank still lists its units reversed, six PYQ records still sit outside the syllabus units, and no real phone print/PDF export has been observed (Phase 10).*

*Phase 9 (`09-performance-launch`) status `2026-11-17` (`arena/908b6b19-diploma-3rd-sem`, from `main` at `0e53a4a`): 9.1 re-verified from disk (the JSON fan-out is unchanged: Practice 36 → 1 request, quiz setup 20 → 2; the static side of the same views then shrank in 9.2), 9.2 (302-entry single palette, 0 literals outside it, 71 dead rules, icon CSS 102,641 → 25,890 B, three global sheets → `assets/css/base.css` and three global scripts → `assets/js/shell.bundle.js`), 9.3 (generated `assets/data/data-version.json` = `data-6b1621c45599` over 81 files, separate data cache namespace, browser-free update regression) and 9.5 (one `scripts/site_config.py` constant; a `/`-rooted copy passes `check_site.py --strict` with 0 errors/0 warnings) are done. Measured from disk: 817 → **592** static requests over 74 pages, CSS 8,638,771 → **6,817,906 B**, 7–10 static requests per page. 9.4 stays open because the owner opened a **first-party counter gate** on 2026-11-17 (metric, storage, retention and disclosure still unanswered; nothing implemented) and 9.6 is partial: `docs/LAUNCH-CHECKLIST.md` is dated and ticked only where this environment can prove an item — **no Lighthouse score, no real-phone pass**. The owner ordered **"merge it to main"**, so PR #17 was merged on 2026-11-17 (`c898a95`), Pages built that commit, and the live site now serves the Phase 9 shell/data versions; no domain, Pages setting, tag or release was touched. See `phases/09-performance-launch/record.md`. Next: Phase 10 device acceptance and the two owner gates.*
