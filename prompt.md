# Diploma 3rd Sem Study Hub — continuation handoff

> **Maintenance handoff — 2026-11-18:** On `arena/eec36cd0-diploma-3rd-sem`
> (base `a2bb413`), Home now follows the manual theory checklist, uses the
> same activity streak as Today, and refreshes greetings on local time. The
> welcome screen, Home and install icons use one Study Hub mark. See
> `tests/home-roadmap-browser.cjs` for the focused regression. This bug fix
> does not change any phase acceptance or deployment status.

> **Phase 13 handoff — 2026-11-19:** in progress on
> `arena/c323dee5-diploma-3rd-sem`, cut from `main` at `9b13f13`. Part 13.1
> (Unit 1) shipped; 13.2–13.6 outstanding. The Python routing baseline is
> **not** `42 / 7 / 55` — it is `78 / 11 / 15`, and 61 of 104 questions can
> only reach a coarse chapter title. Read
> `docs/phases/13-cst203-python-content/record.md` §3.1 and §4.1 before
> touching Unit 2. Nothing is PR'd, merged or deployed.

> **Phase 11 handoff — 2026-11-18:** The owner closed Phases 1–10 with the
> recorded skips in `docs/PROJECT-CLOSURE.md`, then approved **Phase 11 —
> Subject-wise Suggestions** on `arena/b06d66f8-diploma-3rd-sem` (base
> `45bc44d`). The phase was recorded before site work; see
> `docs/phases/11-suggestions/{README,tasks,record}.md`. The owner rejected
> the first draft and requested a review of the 2nd-semester repository and
> mockups before another change. After seeing the Algorithms pilot, the owner
> approved the layout for **all five theory subjects** and asked for more
> Easy Read guidance. Workbooks now present worked examples per unit; Easy
> Read adds priority topics and two linked note sections per unit. The exact
> paper citations, dashboard, Home and unit-note prose are preserved. Test
> under `/Diploma-3rd-sem/` using `rule.md` §7. **Phase 11 is not passed.** Wait
> for owner verification; do not reopen Phases 1–10 or infer permission to
> PR, merge, deploy or publish.
> Older notes below are historical where superseded by this checkpoint.

> **Current handoff — 2026-11-17, Phase 9B merged:** `main` carries Phases 1–9B. Phase 9B was implemented on `arena/7e77489f-diploma-3rd-sem` (base `816ef84`) and merged by explicit owner command on 2026-11-17 (fast-forward). Read `docs/phases/09B-ui-reboost/record.md` for what shipped and, more importantly, for what was verified versus not: the CSS layer, tokens, 6/6 static gates and 113/113 unit tests are real, but **no physical-device, screen-reader, zoom, print or offline-cache evidence exists** — Phase 10 owns it and its tasks file says no pre-filled row is a pass. One `hub.css` sheet is injected site-wide by `scripts/generate_presence.py`; do not split it into `assets/css/families/*` (92 and then 146 fingerprint regressions) or migrate rules into `subjects/units-com/common.css` (load order costs a specificity level; 1,496 anchors reverted). Per-page CSS fence is 300 KB by owner decision; heaviest page uses 171.5 KB. `assets/js/accessibility.js` is inlined into `shell.bundle.js` — regenerate with `scripts/build_runtime_bundles.py` after editing it. The diverging branch `arena/48a2ab20-diploma-3rd-sem` and its draft PR #20 are superseded: close, do not merge. Open debt: 392 ledgered legacy `rgba()` occurrences, 10 white-on-`var(--accent)` pairs still in `quiz/css/{common,play,index,result,review}.css` and `pyq/css/index.css`, Phase 9.4 counter gate. Phase 10 follows. Older instructions below are historical when they conflict with this checkpoint.

Updated 2026-11-17 (**Phases 1–9 are merged to `main`.** Phase 9 — performance
and launch — was implemented on `arena/908b6b19-diploma-3rd-sem` and merged by
explicit owner command as **PR #17** (`c898a95`), which Pages published: the live
site serves `study-2026-11-17e` / `data-6b1621c45599`. Within Phase 9: 9.1 re-verified, 9.2 token/CSS/JS
consolidation done, 9.3 shell-vs-data caching done, 9.5 base-path proof done;
9.4 stays open by the owner's deliberate choice — on 2026-11-17 the owner **opened
a first-party aggregate-counter gate** instead of confirming the no-measurement
default, so no counter exists yet and four answers (metric, storage, retention,
disclosure) are still required — and 9.6 is evidenced only where this
environment can prove an item: no Lighthouse score and no real-phone pass exist.**)
Read `rule.md`, `docs/STATUS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md` and
[`docs/phases/09-performance-launch/record.md`](docs/phases/09-performance-launch/record.md)
before continuing. Source files and actual Git status take precedence over older
narrative.

## Fixed context

- Repository: `pabitra27706-oss/Diploma-3rd-sem`.
- `main` carries Phases 1–9: Phase 6 (PR #14 `5b7eb66`), Phase 7 (PR #15
  `84e99aa`), Phase 8 (PR #16 `0e53a4a`), Phase 9 (**PR #17 `c898a95`**, merged
  2026-11-17 and published by Pages). Check `git log`; the PR #17 merge is the
  newest `main` merge and the base for the next phase.
- Session branch: whatever Arena names for the current session, cut from `main`.
  The Phase 9 branch `arena/908b6b19-diploma-3rd-sem` (cut from `0e53a4a`) is
  **merged as PR #17 (`c898a95`)** and retired; `main` now carries Phase 9. The
  Phase 8 branch `arena/e0da0bec-diploma-3rd-sem` is merged and retired. Do not create/switch/rename branches or push another branch.
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

**Phase 13 — Scripting Languages (Python) is in progress on
`arena/c323dee5-diploma-3rd-sem`, cut from `main` at `9b13f13`.** Part
**13.1 (Unit 1)** shipped 2026-11-19; parts 13.2–13.6 are outstanding.

- **Baseline correction, phase 13.** The blueprint's Python routing baseline
  `42 / 7 / 55` is **stale** — it describes the matcher before Phase 12's
  `_rank()` tie-break. Re-measured on `main`: **`78` same-unit / `11` redirect
  / `15` unmatched**. The triple still hides the defect: **61 of 104** questions
  could only land on a coarse `<section id>` chapter title (`#collections` alone
  absorbed 15 questions / 56 marks) because all five Python unit pages shipped
  **zero** `<h3 id>` anchors. See `docs/phases/13-cst203-python-content/record.md`
  §3.1. `13/README.md` and the `docs/phases/README.md` matrix row were corrected
  in place; the old figure survives only as dated history.
- **13.1 delivered:** `subjects/CST203/units/unit-1.html` (152m / 39.3%, the
  largest unit in the repository) went from 5,438w and 0 anchors to **10,837w
  and 12 anchors**. Concept prose `#intro…#operators` is 6,056w, ordered by
  marks (collections 1,625w / operators 1,393w / intro 1,164w / strings
  1,052w / variables 854w). 2 inline SVGs, 5 comparison tables, practice bank
  14 MCQ / 6 short / 6 worked 8m / 6 programs, and **5 verified YouTube links**
  replacing 3 `search_query` placeholders. Routing: unmatched **15 → 5**, U1
  named-heading landings **12 → 36**.
- **Ablation proof (do this every part):** deleting the 12 anchors leaves the
  routing triple **byte-identical** (89/10/5) while U1 named landings collapse
  **36 → 0**. Counts alone would have reported success either way.
- **Open gap, stated not hidden:** the page is **10,837w against a 7,200–8,000w
  target**. The blueprint gives Unit 1 27.5% of the word budget for 39.3% of the
  marks, so a weight-proportional U1 at the same total is 10,300–11,475w. The
  overrun is the practice bank (3,721w; worked 8-mark answers average 263w).
  The owner can demand the strict ceiling — the cut is 4 long answers and 2
  MCQs, a 20-minute edit. Recorded in `record.md` §4.1.6 before it was asked for.
- **New matcher defect found by reading landings, not counts:** `Built-ins / all`
  lands on the collections section because `score_against()` uses a bare
  substring test, so the topic word `all` is found inside `shallow`. A global
  word-boundary fix moves **19** questions across all five subjects and
  **regresses two** 8-mark Python questions, so it is not being shipped blind —
  the scoped fix is the 13.6 map, the global fix needs Phase 17. Recorded in
  `record.md` §4.1.3a with evidence.
- **Two owner decisions are open:** the Unit 1 word-budget overrun (§4.1.6) and
  the matcher fix above (§4.1.3a). Both are written up with options; neither has
  been actioned unilaterally.
- **Not done, not faked:** the 11 `tests/*-browser.cjs` suites need
  `playwright-core` + Chromium and were not run (pre-existing sandbox limit).
  `unitAnchored` moved `580 → 592`; 136/136 unit tests and 14/14 node suites pass.
  No PR, no merge, no deploy.

Phase 1 platform implementation is complete with deferred final hardware
acceptance. Phases 2–9 remain in progress. See `docs/STATUS.md` for the complete
per-phase remainder table and the source/rights gates.

- **Phase 12 — Computer Programming in C (weight-calibrated content, videos and
  PYQ sync), branch `arena/08838a66-diploma-3rd-sem`.** All six parts are
  shipped as of 2026-11-18; part 12.6 is the phase gate and is **awaiting the
  owner verdict**. All five `subjects/CST201/units/unit-*.html` pages were
  rewritten against the 2023–2026 PYQ weights (U4 24.6%, U2 24.1%, U1 21.8%,
  U3 16.7%, U5 12.9%); the 10 `guides.json` anchors and 78 section ids survive
  and every embedded program's output is its real `gcc -std=c99 -Wall -Wextra`
  stdout. **Mode B was used with owner authorisation** ("Don't break anything"),
  overriding the brief's Mode A wording, because the routing misses were wrong
  *data*: `unit` was re-tagged on **44** questions (`unit` field only — ids,
  stems, options, answers and marks byte-identical, proven field-by-field
  against `sourceCommit` and now pinned by a test), and the recorded
  **CST201 U3↔U4 quiz-bank inversion was resolved at source** rather than
  disclosed again. Both `unit-order` findings were removed from
  `docs/data/validation-exceptions.json` as RESOLVED, so
  `validate_data.py --check-baseline` now says *"Baseline matches
  source-review ledger"*. Routing went `46/29/30` (same-unit/redirect/unmatched
  at baseline) → **`103/2/0`**, and the five reported wrong-unit questions
  (`P003-Q8`, `P005-Q11`, `P005-Q15`, `P006-Q6`, `P006-Q21`) each land on a
  specific authored heading. The deferred decision is **C2**
  (`subparts[].unit`): the blueprint's mark split is per subpart while `_data`
  stores one `unit` per question, so no whole-question re-tag can reproduce it.
  **Topic map (added after the routing audit):** a scorer was the wrong tool —
  **35% of the 924 questions have no topic at all** (`"Short answer"` ×207) and the
  remaining 484 distinct topic strings average 1.06 uses each. `assets/data/topic-map-CST201.json`
  now maps all **82** distinct topics in the window and is consulted **before** the
  matcher (which stays as fallback). Generic `overview-*` landings fell
  **35/105 → 3/105**. Runtime rules, each pinned in `tests/discovery-dom.cjs`: verify
  the anchor before trusting it, allow cross-unit corrections, fall through on a
  stale anchor, tolerate a missing map file. Phases 13–16 each author their own map
  per [`docs/phases/topic-map-standard.md`](docs/phases/topic-map-standard.md);
  **Phase 17** re-audits all five and fixes rot in place.
  Gates: **136/136** Python, **8/8** discovery-dom, `check_site`/`check_tokens`/
  `check_pyq_integrity`/`validate_syllabus`/`validate_pyq`/`check_platform`
  all `0`, canonical rebuild run in the documented order. Details and every
  caveat: `docs/phases/12-cst201-c-content/record.md` §4–§6.

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
- Performance (Phase 9, 2026-11-17): one 302-entry colour palette in
  `assets/css/variables.css` with **0 hex colour literals elsewhere**
  (`rgba()` values — 373 occurrences — are outside that gate and listed as open)
  (`scripts/check_tokens.py --strict`); `accessibility.css` + `print.css` +
  `pwa.css` merged into `assets/css/base.css` and the accessibility/i18n/install
  scripts into a generated `assets/js/shell.bundle.js`; pages load a 25,890 B
  Font Awesome CSS subset instead of 102,641 B; data has its own generated cache
  version (`assets/data/data-version.json` = `data-6b1621c45599` over 81 files).
  Measured from disk over 74 pages: **592** static requests (was 817) and
  **6,817,906** CSS bytes (was 8,638,771), 7–10 static requests per page. Per view
  including its data fetch: Practice **9**, quiz setup **10**, unit page **10**,
  PYQ answers **8**, home **9**, study pages **12**, quiz play **11**. Shell
  worker VERSION: `study-2026-11-17e` (bumped for the 9.2 shell change); the data
  version is independent of it. No Lighthouse score exists — there is no browser
  in this environment.

## Evidence and limits

Latest implementation checkpoint (`2026-11-18`, Phase 12.6): **130 Python
tests, all pass**, and **14/14 deterministic Node suites PASS**. The two
long-standing failures carried since Phase 12.4 are **fixed, not waived**:
`test_data_pipeline.test_no_semantic_or_answer_changes` now passes because the
missing `664674b` commit was fetched into the shallow clone *and* the test was
taught to honour the recorded `unitMoves` list (an unlisted edit, a non-`unit`
edit, or a grown move list still fails, and quiz origins stay byte-identical);
`node tests/section-notes.cjs` was a real shim gap — `assets/js/section-notes.js`
iterates `heading.childNodes`, which `tests/lib/minidom.cjs` never exposed.
Earlier (`2026-11-17`, Phase 9): 92 Python tests (91 pass) and 14 Node suites. Phase 9 also added `check_tokens --strict`,
`build_icon_subset --check`, `build_data_version --check`, `audit_page_weight
--budget` and `check_root_rewrite` to the CI workflow. Hosted CI has **not run on
this branch** (nothing was pushed). Earlier: **63 Python tests** and sixteen
deterministic Node suites PASS; hosted **Web CI green** on the phase tip
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
   caveats and are merged. **Phase 9 is implemented on the session branch**, with
   three things left: the four answers behind the owner's 9.4 counter gate, a
   real-browser launch pass (Lighthouse + phone, 9.6) and the deploy decision — none of which
   this environment can do. Phase 10 is one device-acceptance phase. Phase 8's
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
git fetch origin main
git checkout main
git pull --ff-only origin main
cd ..
python3 -m http.server 8010 --bind 127.0.0.1
```

Open `http://127.0.0.1:8010/Diploma-3rd-sem/`. Stop with Ctrl+C. For a first-time setup, clone instead from the parent
directory: `git clone --branch main
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

---

## Phase 9 kickoff — executed and merged 2026-11-17 (result block)

The instructions above were carried out on `arena/908b6b19-diploma-3rd-sem`. Do
not re-run them; read
[`docs/phases/09-performance-launch/record.md`](docs/phases/09-performance-launch/record.md)
for evidence and
[`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) for what is proved and
what is not.

- 9.1 ✅ re-verified (data side unchanged; static side measured for the first time).
- 9.2 ✅ done — 302-entry palette, 0 literals outside it, 71 dead rules,
  icon CSS 102,641 → 25,890 B, `base.css` and `shell.bundle.js` merges,
  English catalog no longer fetched.
- 9.3 ✅ done — `data-6b1621c45599` over 81 files, separate data cache namespace,
  `tests/data-version.cjs` proves both update directions offline-safe.
- 9.4 ⛔ **gate opened 2026-11-17** — the owner wants a first-party aggregate
  counter later; nothing was built. Blocked on: which number, where it is stored,
  retention, and the privacy-page text (`docs/DECISIONS.md`, `docs/MEASUREMENT.md`).
- 9.5 ✅ done — one `scripts/site_config.py` constant; `/`-rooted copy passes
  `check_site.py --strict`.
- 9.6 🚧 — checklist dated and ticked only where provable; **Lighthouse and the
  phone pass are not run**. The owner then ordered the merge: **PR #17 →
  `c898a95`**, Pages built it, live site serves the Phase 9 versions. No domain,
  no Pages setting, no tag.

Static budget, 74 pages, from disk: 817 → **592** requests; CSS 8,638,771 →
**6,817,906 B**; 7–10 static requests per page. Per view incl. data: Practice 9,
quiz setup 10, unit 10, answers 8, home 9, study 12, play 11.
