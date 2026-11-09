# Phase 2 — Truthful data pipeline

- Status: 🚧 in progress · Date: 2026-11-09
- Branch: arena/be3d9178-diploma-3rd-sem · starting tip: 646dea2
- Main CI 42634392469 green; no open PR at start. Phase 1 merged via PR #4.

## Reused (before implementing each part)

- 2.1 ADAPT — repo-local stdlib validators `validate_pyq.py` (option/key compatibility) and `validate_syllabus.py` (authority join); no third-party code or dependency.
- 2.2 BUILD — deterministic SHA-256 ordering + balanced round-robin; stdlib only. Existing Practice consumes `practiceDay`; reuse that contract.
- 2.3 ADAPT — existing JSON declared counts, syllabus metadata and runtime count rendering. Preserve source text; generic topics explicitly labelled rather than guessed.
- 2.4 BUILD — generated exact-content aliases and separate normalized-text candidate report. No semantic/fuzzy auto-merge; keep paper records/old IDs.
- 2.5 ADAPT — existing MCQ keys and score function; mark non-MCQ missing and show ungraded state. Candidate source joins are a review queue, never approval.
- 2.6 ADAPT — existing quiz loaders and filter machinery; generated inventory from actual files; no new bank or answer invented.

## Evidence before changes

- 992 PYQs all `practiceDay: 1`; 872 quiz records, 456 non-MCQ with no key (baseline audit, reconfirmed during generator work).
- `practice/js/index.js:76,81` and `session.js:75,78` still fetch `/_data` at domain root: Phase 1 HTML checker missed dynamic JS data paths. Fix as part of connecting the data pipeline.
- `_quiz-data/CST201/unit-3.json:4` is functions while syllabus unit 3 is Arrays; requires actual mapping review, not relabelling the same questions.
- `quiz/js/common.js:1074` scores every supplied question against `correct`, including non-MCQs.
- `quiz/setup.html` offers CST207 with no bank, static years 2019/2020, and lacks EXTRA source.
- Existing full syllabus strict errors: CST205 four and CST209 three Unit-5 PYQs in four-unit courses.

## Gates

No question wording/answers, unit retags, inferred reprint identities or new bank keys may be approved by the agent. Source-verification batch will be generated for owner review. Phase cannot be called fully complete while strict/source gates are unresolved.

## Implemented / still blocked by part

- **2.1 implementation done, strict acceptance blocked:** stdlib unified validator checks JSON, global/store IDs, declared counts, MCQ options/keys/explanations, non-MCQ missing/model-key status/provenance, syllabus units and known reversed unit banks, day/difficulty, registry duration/marks consistency, generated catalog/schedule freshness and balance. CI regression gate accepts only the exact fingerprinted source-review ledger. Full strict is **not** green.
- **2.2 done:** seed `diploma-phase2-v1`, SHA-256 stable tie-break ordering stratified by subject/difficulty/stored unit, then round-robin across ten days. Deliberately interleaves papers for mixed revision. 992 IDs preserved; 923 exact-unique active questions; 69 aliases inherit canonical day. Active day counts 93/93/93/92/92/92/92/92/92/92. The “992 distributed” and “no duplicate contributes twice” requirements are reconciled by preserving all 992 raw assignments but practising only the 923 canonical records. Same seed/input gives identical bytes; alternate seed tested; dry-run does not write. Reading-roadmap topics are not silently rewritten to pretend they match mixed practice; shared day counts and links explicitly identify mixed revision.
- **2.3 partial:** four declared quiz-count mismatches recomputed (CST201 U1 46→53, U2 31→36; CST203 U3 42→55; CST205 U1 40→56). Home counts/subject metadata, quiz cards and availability come from the catalog. 321 generic PYQ topics flagged `topicQuality: generic`, not renamed to guessed topics. Source-gated unit/title corrections and broader subject/unit-page authority alignment remain **unfinished**.
- **2.4 partial:** generated `duplicates.md` reports 80 normalized whitespace/case text-candidate clusters and 69 safe exact-content aliases; 923 unique PYQs. Difference from old “86 clusters” audit is normalization policy: punctuation and code are not erased. Only exact question/options/key/answer/explanation/type/marks/stored-unit equality within a subject permits aliases. Canonical is earliest year/month/ID; no answer is certified by that selection. `catalog.json` has canonical ID + `alsoAppearedIn`; raw files/IDs still open in PYQ. Semantic clusters are NOT merged. Reprint source labels/status remain pending review, not guessed from equal text.
- **2.5 safe state done, verification gate open:** all 456 non-MCQ quiz items explicitly `answerStatus: missing`, `gradable: false`. Play, all-types review and result/history show “No key — not graded”; score denominator excludes non-MCQs. All-theory result/history is not shown as a failed zero-score quiz. Existing quiz keys/options/explanations unchanged. 90 non-MCQs have normalized-text candidate joins (two ambiguous), 366 unmatched; zero source-ID matches and zero newly owner-verified keys. No answer copied. Generated first answer-review batch contains **40** items with source citations. Further key work needs owner/source review.
- **2.6 safe selector changes done; imports pending:** CST207 absent from selectable quiz setup/cards/presets until a verified bank exists, but all 195 PYQs remain in Practice/PYQ. Actual quiz sources `PYQ`, `original`, `EXTRA` and years 2021–2024 derived from data; enabled source/year combinations tested nonempty. Empty combinations cannot start. 120 January-2026 PYQs remain in papers/Practice; no quiz import before unit/key verification. No new year/question/key fabricated.

## Observable fixes and version

- Practice data fetches now resolve at the app subpath; canonical aliases are omitted from both dashboard and sessions. A static JS fetch-path check prevents recurrence of the Phase 1 blind spot.
- Metadata shared by `assets/js/data-catalog.js` (scope-relative, memoized, first-party only); catalog failures show unavailable state rather than offering an empty quiz.
- Existing `validate_pyq.py` required every rebuilt question to stay on day 1. Updated this obsolete bootstrap constraint to integer days 1–10; all other paper checks retained. This is a scheduling invariant change, not question content editing.
- Syllabus validator now also catches quiz-bank units, previously only PYQ unit tags.
- Worker cache version `data-2026-11-09`; shared metadata loader precached. Waiting-worker smoke test updated to bump the current version generically. Professional Hub build label matches.

## Exact outstanding findings / owner gate

`docs/data/validation-exceptions.json` records content fingerprints and a review plan:

1. CST205-P001-Q3, Q21, Q22, Q25: stored Unit 5 in a four-unit course.
2. CST209-P001-Q56 (oscillator question), CST209-P002-Q34, CST209-P003-Q34: stored Unit 5 in a four-unit course. Q56 may be misfiled, not merely mistagged; no inference made.
3. `_quiz-data/CST209/unit-5.json`: 35 stored string-algorithm questions outside four declared units.
4. `_quiz-data/CST201/unit-3.json` and `unit-4.json`: topic ordering reversed against syllabus; simply swapping titles would mislabel content. No file move, ID change or retag applied.

Owner/source evidence needed for disposition of these records, confirmed reprint relationships and the first 40 key candidates. No waiver requested or invented. The source batch is a request for verification, not blanket approval to guess units. Phase 2 remains **in progress**, and Phase 3 must not start yet.

## Checks / preview evidence

- `check_site.py --strict`: PASS, 0 errors / 97 warnings, 0 root-relative references (including new JS-fetch check).
- `check_platform.py`: PASS; metadata generation byte-idempotent, all local assets valid.
- `validate_pyq.py`: PASS, 992 questions / 30 papers, 0 errors/warnings.
- `validate_data.py --strict`: expected FAIL, **10 source-review findings** listed above. `--check-baseline`: PASS, exact ledger matches; explicitly **not a full strict pass**.
- `validate_syllabus.py --strict`: expected FAIL, **3 grouped errors** (seven PYQs plus 35-question CST209 quiz Unit 5), 4 existing coverage warnings.
- Unit tests: **5 PASS**: schedule reproducibility/balance/alias handling; metadata idempotency and dry-run; no source-text/answer/option/unit changes from base commit; strict-vs-baseline behavior; count/key/options/explanation/difficulty/duplicate-ID/key-claim mutation rejection. Temporary mutation copies only. CI fetches history for immutable source comparisons.
- JS/CJS parse: 23 PASS; JSON: 60 PASS.
- Chromium 153 headless under `/after/Diploma-3rd-sem/`: actual Practice load 923, day-10 session 92, source/year options from banks with actual label clicks, EXTRA filter respects source, missing-key score exclusion and visible attempt badge, home count and shared roadmap counts. Theory-only current-result redirect reaches review with a no-key badge; theory-only history shows Not graded, zero incorrect rather than a failure grade. No page errors. Optional reproducible test `tests/data-browser.cjs`.
- Phase 1 regression: scoped worker, visited-page offline reload, unvisited fallback, synthetic install acceptance, waiting update without automatic quiz reload, user-confirmed activation all PASS (`tests/platform-browser.cjs`).
- Before/after 1200×850 screenshots of Practice, quiz setup, roadmap; extra after screenshots show filters and no-key attempt. Preview includes generated review/duplicate documents and all data; no generated mockups. Styling/token redesign is out of scope; existing contrast debt not claimed fixed.
- Budgets: 21 browser JS files 544,764 bytes (largest 61,002); CSS 574,291 (largest 110,612); 60 JSON files 2,133,012 bytes (largest review candidates 96,243). No runtime dependencies added. Playwright/Chromium dev tools installed outside repo only.
- Not verified: pedagogical correctness of legacy keys or topic mappings, real-device/iOS installation, screen-reader/phone test, source scans not present in checkout, unsaved-attempt persistence (Phase 3), or progress migration (Phase 6).

## CI / publication

CI run **42636841353** green on implementation commit **b473636e5aa9b913a35d4316a8c89f6f7d688957**. Artifact `site-preview` **13682738528** uploaded (4,188,302 bytes), including eight real screenshots, generated review documents and static site. `site-check` artifact **13682553738**. This green regression run is not full strict data/syllabus acceptance. Documentation-only follow-up records this evidence. No PR, merge, deploy, Pages setting, domain,
license, or source-content authorization implied. End-of-chat report and Termux
commands are required even though the phase is paused at the source gate.
