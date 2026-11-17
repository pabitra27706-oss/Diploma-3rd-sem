# Diploma 3rd Sem Study Hub — continuation handoff

Updated 2026-11-17 (**Phases 1–8 are `✅*` and merged to `main`; Phase 8 content
depth was accepted by the owner on a smoke use pass and merged as PR #16**; the
next phase is **Phase 9 — performance and launch**, see the kickoff block at the
end of this file). Read `rule.md`,
`docs/STATUS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md` and the relevant phase
record before continuing. Source files and actual Git status take precedence over
older narrative.

## Fixed context

- Repository: `pabitra27706-oss/Diploma-3rd-sem`.
- `main` carries Phases 1–8 (`✅*`): Phase 6 (PR #14 `5b7eb66`), Phase 7
  (PR #15 `84e99aa`), Phase 8 (PR #16). Check `git log`; the PR #16 merge is the
  newest `main` merge and the base for the next phase.
- Session branch: whatever Arena names for the current session, cut from that
  merge. The Phase 8 branch `arena/e0da0bec-diploma-3rd-sem` is merged and
  retired. Do not create/switch/rename branches or push another branch.
  Prior branches `arena/c56bb630-...` (PR #15 `84e99aa`), `arena/be90e07e-...`
  (PR #14 `5b7eb66`), `arena/4d3997da-...` (PR #13 `a92a1ff`),
  `arena/637a5a31-...` (PR #10 `8f6eb97`, PR #11 `9d47c7c7`),
  `arena/858a50c7-...` (PR #9 `365b8f7`), `arena/47d8bf99-...` (PR #8
  `3e3cb2e1`), `arena/be3d9178-...` (PR #7 `125eb94`), and `arena/26856d99-...`
  (`8405b15`) were merged into `main` and are retired.
- Inspect actual Git/PR state rather than assuming an older checkpoint is current.
- Zero-build static HTML/CSS/JS/JSON; publication base `/Diploma-3rd-sem/`.
  Canonical configured URL: `https://pabitra27706-oss.github.io/Diploma-3rd-sem/`.
  This is not confirmation that the live site has current changes.
- No money, analytics, external runtime dependencies or implicit publication.
- Root license is **MIT** (chosen 2026-11-16; `LICENSE` added). Covers the project's own code/authored content; third-party exam material keeps separate rights (see `docs/DECISIONS.md`).

## Current owner instructions — do not re-ask

1. Technical implementation decisions are delegated. Work through phases 1–9
   first, then one dedicated Phase 10 cross-device acceptance phase. This
   supersedes the older one-phase-per-chat/stop-before-Phase-3 sequencing.
2. **PYQs are authoritative; do not alter them.** All original subject paper
   and registry bytes are frozen by `_data/pyq-integrity.json`. Use separate
   derived metadata; never refresh the guard to hide changed originals.
3. Unknown answers stay ungraded. Technical permission is not evidence that a
   key, mapping, formula, reprint relationship or exam-total interpretation is true.
4. No PR/merge/deploy/Pages/domain changes without the corresponding explicit
   command. Prior Phase 1 merge authorization does not authorize another merge.
5. After a completed phase, report directly in chat: changes/checks/blockers/
   next step/publication state. After **every chat**, including docs-only and
   incomplete work, supply copyable Termux commands and the exact local URL.
6. Do not claim all phases done while implementation or factual gates are open.
   Focused safety/regression tests continue before final device acceptance.
7. **All-subject MCQ explanations (2026-11-17).** The Python pilot pattern now
   applies to every bank: 2–3 sentences, ~30–40 words, sized for a 1-mark item.
   Only `explanation` / `answer` prose may change.
8. **Duplicate-paper rule (2026-11-17).** A duplicate reprint may be deleted
   **only** where that subject has no 2021 paper; never delete a paper whose
   session/year is otherwise missing. CST203 and CST209 qualified; CST201,
   CST205 and CST207 keep every paper.
9. **Subject names in the UI only (2026-11-17).** Subjects read C · Python · DS ·
   CSO · Algorithms; raw paper/question IDs are not printed. No path, file,
   question ID, URL parameter, `data-*` value, storage key or JSON payload may
   change to achieve that.

## Approved source reconciliation for PR #7

Owner authorizes preserving main's newer sources and merging the code. The
fixed PYQ/registry baseline is now main commit
`cfe3a63decb270826da40ea50b9392efc58b2f1d`; all 35 originals match it exactly.
Main's icon/manifest fix is preserved. Derived artifacts have been regenerated;
the same nine source-review findings remain open. Consult PR #7 for CI/merge
result; do not treat earlier unpushed/blocked checkpoint notes as current state.

## Current implementation

Phase 1 platform implementation is complete with deferred final hardware
acceptance. Phases 2–9 remain in progress. See `docs/STATUS.md` for the complete
per-phase remainder table and the source/rights gates.

- Phase 8 — content depth and syllabus coverage (`✅*`, 2026-11-17, merged as
  PR #16 after the owner's smoke use pass "nothing breaks"): measured first, and three of the phase
  README's own claims were already false for this tree (the lab/internship pages
  existed; CST201's *pages* were in syllabus order while its *quiz bank* is
  reversed; the CST203 Unit-1 skew is 117/170, not 140/204). The old coverage
  page printed `quizCount: 0` for all 23 units and a raw `{None: 211}` dict.
  Delivered: a rebuilt coverage map (23 declared units, both out-of-syllabus rows
  listed, note depth per unit, Unit-1 skew 496/924 = 53.7% with its explanation);
  an exam-pattern page whose **28/28** paper maxima reconcile with each paper's
  own printed answer-any quotas (the previous comparison could never match) plus
  the still-unverified session-pattern question; `print.css` on **74/74** pages
  with answers-on-a-new-page and a labelled include-answers toggle (no fake
  running header — unsupported in browsers); lab/internship pages with credits,
  hours, assessment fields and syllabus page anchors; **44 cited draft revision
  entries** (41 definitions, 3 formulas with symbol legends, every citation
  validated verbatim against the syllabus) and a **fail-closed answer-verification
  register** — both waiting on owner sign-off, with **0 of 44** entries and
  **0 of 924** answers certified. Tree is 74 pages; worker `study-2026-11-17d`.
  No real print/PDF export was observed (Phase 10).
- Sub-phase 8A — answer prose and subject labels — shipped 2026-11-17
  ([record](docs/phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/record.md)):
  337 quiz-bank explanations and 226 PYQ answers rewritten in prose only, two
  duplicate reprints removed, subject names replacing course codes in the UI.
- Data: 924 raw PYQs, 923 exact-unique Practice questions, 1 exact alias across
  28 papers; ten derived Practice days; enriched `_data/catalog.json` and
  `assets/data/practice-pool.json` (`aliases`, `alsoAppearedIn`, `topicQuality`);
  all 5 subject hubs and 24 unit HTML pages aligned to `docs/syllabus/syllabus.json`
  and enforced by `validate_data.py`; alias `?q=` deep-link resolution in Practice
  and duplicate cross-reference links in PYQ Answers; generic placeholder topics
  excluded from Practice topic dropdown, unit topic summaries and named weak-topic
  analytics. 872 quiz-bank items (416 keyed MCQs, 456 non-MCQ ungraded). CST207
  has no quiz bank. Originals remain unchanged; **9** source-review data findings
  remain open (the CST209-P002-Q34 finding closed when its duplicate paper was
  deleted).
- Quiz: versioned attempt snapshots, deadline-based timers, autosave/resume,
  flags, score boundaries, history/export/exact retries/edits, mistake queue,
  one-sentence MD/TXT/JSON/Print-PDF export guidance, and full mock paper
  practice enforcing explicit `paperFormat` `answerAny` section/choiceSet quotas
  across all 28 frozen PYQ papers, compulsory 30-minute Group A loose-script
  windows on the five timed `2023-03` papers, and `1m option + 1m written explanation`
  splits on the fifteen `2024–2026` papers without fabricating an overall grade.
- Discovery: compact search/repeat sidecars, source deep links, related unit
  material, 2,410 search entries, 1 exact alias + 15 unverified candidate repeat
  clusters (Phase 4, merged in PR #12).
- Study (Phase 5, `arena/4d3997da-diploma-3rd-sem`): 1,339 deterministic cards
  (923 PYQ model answers + 416 keyed quiz explanations) with a reason for every
  one of 457 skips, per subject **and** per unit, CST207 disclosed as PYQ-only and
  a display-safe `citationLabel` on every card; documented fixed Leitner
  scheduling (1/3/7/16/35 days) with local-midnight rollover, per-day new-card cap,
  clock clamps, duplicate-rating idempotence and reload survival; review UI with
  answer-first → reveal → rate, Space/1–4/Esc, subject/unit filters via URL +
  `popstate` and empty-queue fallbacks; weak areas with `correct / attempted`,
  contributing attempts and a five-observation percentage floor; Today with one
  primary action, goal meter, honest resettable streak and a deterministic
  question of the day. Not newly certified facts.
- Storage: all runtime localStorage access is inside `assets/js/storage.js`;
  legacy callers use its adapter. Namespaced migration, notes, preferences,
  typed import validation, group resets, journaled recovery and no-write export.
  IndexedDB and concurrent-tab transaction isolation are NOT implemented.
- Inclusion/content: shared safeguards, settings-only initial en/bn catalog,
  truthful email feedback, coverage/provenance, practical-task/internship pages,
  exam-pattern caveats and print rules. Full accessibility/translation/reference
  sheet work remains. License remains a gate.
- Performance: compact derived pools and checked-in script bundles; measured
  Practice/setup cold loads are 12 requests each. CSS/cache/root-path/launch
  work remains. Current worker VERSION: `study-2026-11-17d` (Phase 8 added the print sheet and its precache entry; Phase 5 added the study shell and
  `WARM_STUDY` card shards).

## Evidence and limits

Latest implementation checkpoint (`2026-11-17`, Phase 8): **63 Python tests** and
sixteen deterministic Node suites PASS; hosted **Web CI green** on the phase tip
(runs `44046215114`, `44046331697`); 55 JS/CJS files and 79 JSON files parse;
site strict **0 errors / 0 warnings**, platform 0 errors, immutable-PYQ guard
0 changes; accessibility audit 74 pages with 0 findings (47 contrast pairs);
`check_readme_paths` 0 missing. Chromium suites were **not run** (no browser). The seven focused Chromium
suites were updated for the Phase 5 markup but not re-run in the 2026-11-17
environment (no Chromium there).
Full data strict still has 9 ledger findings; syllabus strict has 3 grouped
errors. An exact-baseline pass is not a full strict pass, and Phase 8 certified
no content: 0 revision entries and 0 answers are owner-verified.

## How to continue safely

1. Inspect Git status and actual files. Preserve the accumulated changes; do not
   redo completed engineering merely because older phase tasks say planned.
2. Use `docs/STATUS.md`'s remaining order. Phases 1–8 are `✅*` with recorded
   caveats and are merged. **Phase 9 (performance and launch) is next and is the
   last engineering phase**; Phase 10 is one device-acceptance phase. Phase 8's
   two content gates (8.2 revision sheets, 8.6 answer certification) stay open
   in parallel and are **owner** work — acceptance never certified content.
3. Never retag raw PYQs to make strict checks green. Keep source findings
   visible; record new evidence/dispositions in derived metadata and decisions.
4. Edit source scripts, not generated bundles. Regeneration order and check
   commands are in root README; browser commands/limits are in tests/README.md.
5. Keep records, status, roadmap and this handoff aligned. Historical evidence
   stays dated; new passes require actual execution. Device acceptance is Phase 10.
6. Stop at publication gates. No commit/push is needed to preserve Arena files;
   inspect identities/diff and existing rules before any authorized Git operation.

## Termux delivery convention (post-phase test flow)

After a phase is complete and pushed, run this on your device to pull the
current session branch and serve it at the real subpath. It follows **push →
pull → run** on the branch named in `rule.md` §1:

```sh
cd ~/Diploma-3rd-sem
git fetch origin arena/e0da0bec-diploma-3rd-sem
git checkout arena/e0da0bec-diploma-3rd-sem
git pull --ff-only origin arena/e0da0bec-diploma-3rd-sem
cd ..
python3 -m http.server 8010 --bind 127.0.0.1
```

Open `http://127.0.0.1:8010/Diploma-3rd-sem/`. Stop with Ctrl+C. For a first-time setup, clone instead from the parent
directory: `git clone --branch arena/e0da0bec-diploma-3rd-sem
https://github.com/pabitra27706-oss/Diploma-3rd-sem.git`, then run the block
above from inside the checkout. Unpushed Arena changes are not available through
a fresh clone or pull; state which commit/branch holds a change before telling
anyone to pull.

## Next session kickoff — Phase 9, performance and launch

Paste this as the opening instruction of the next session. It is self-contained;
the session should still read `rule.md` → this file → `docs/STATUS.md` first.

> **Task: finish Phase 9 (`docs/phases/09-performance-launch/`).** No new
> features — every change either removes bytes, removes requests, improves a
> measured number, or records a decision. Phase 9 is the last engineering phase;
> Phase 10 is device acceptance.
>
> **Start from the measured tree, not from the 2026-11-09 record.** Phases 6–8
> changed the inputs: **74 pages** (not 68), worker **`study-2026-11-17d`**,
> **63 Python tests** + 16 deterministic Node suites, `assets/css/` holding
> **six** first-party sheets with `accessibility.css` and `print.css` on all 74
> pages (`pwa.css` 55, `variables.css` 22, `discovery.css` 18, `main.css` 4),
> and **22 first-party CSS files / ~490 KB total**, of which **768 hex literals**
> remain (`variables.css` holds 67 of them and 156 custom properties; the other
> 701 sit outside it). Re-measure anything you intend to quote; do not carry the
> old numbers forward.
>
> **Already done (verify, do not redo):** 9.1 data loading — Practice 43 → 12
> requests and 36 → 1 JSON, quiz setup 28 → 12 requests and 20 → 2 JSON, pools
> 858,467 B / 420,756 B, measured in cold local Chromium with service workers
> blocked (`request-measurements.json`). `docs/MEASUREMENT.md`,
> `docs/CACHE-POLICY.md` and `docs/DOMAIN.md` exist.
>
> **Remaining, in this order:**
> 1. **9.2 CSS/JS consolidation** — one token file as the single source; replace
>    literals outside it (allowlist the sprite/logo); delete dead rules and dead
>    JS after grepping real HTML usage; measure per-page CSS/JS bytes before and
>    after. Accept: zero hex literals outside the token file, every page within
>    budget, no visual regression. There is **no browser here** — say so instead
>    of claiming screenshots.
> 2. **9.3 caching and update policy** — give data its own version, independent
>    of the shell; add the update-flow regression (bump → banner → reload → new
>    shell) to the deterministic Node suite so it runs without Chromium; prove a
>    data-only update reaches a returning user without clearing storage.
> 3. **9.4 measurement gate (owner)** — implement/verify the local-only
>    "was this useful" prompt (no network call, one per session, dismissible) and
>    the copy template; `docs/MEASUREMENT.md` must list what is unknowable. Ask
>    the owner for the dated decision; do not add analytics.
> 4. **9.5 base-path readiness** — centralise the base path in one constant used
>    by manifest, worker, canonical and sitemap; prove a `/`-rooted copy passes
>    `check_site.py` (rewrite a temp copy and run the checker). No domain is
>    bought, registered or configured.
> 5. **9.6 launch gate** — `site-checklist.md` fully ticked with dates, a
>    real-phone pass recorded, Lighthouse numbers attributed to the machine they
>    came from (or recorded as **not run** — a green budget check is not a
>    Lighthouse score), rollback documented. **Deploy does not happen.**
>
> **Constraints that still bind:** PYQs stay byte-frozen (`_data/pyq-integrity.json`);
> never retag a raw PYQ or a syllabus unit to make a strict check green — CST205
> U5 ×4, CST209 U5 ×2, CST207's missing quiz bank, the reversed CST201 quiz-bank
> units and the nine strict-data findings are **open findings, not noise**; no
> PR, merge, deploy, Pages, domain, tag or release without an explicit command
> from the owner; report measured numbers or say they were not measured.
>
> **Done means:** ≤ 12 requests per view (from code), one token file, a data
> cache version independent of the shell, an update regression that runs without
> a browser, the 9.4 decision dated, the `/`-root rewrite proven, the launch
> checklist ticked with dates — and **still nothing deployed**.
