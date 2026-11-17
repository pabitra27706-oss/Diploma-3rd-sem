# Diploma 3rd Sem Study Hub — continuation handoff

Updated 2026-11-17 (Phase 3 reconciled to `✅*`; Phase 4 discovery parts 4.1–4.5 completed and verified on `arena/80b11bcf-diploma-3rd-sem`). Read `rule.md`, `docs/STATUS.md`, `docs/DECISIONS.md`,
`docs/ROADMAP.md` and the relevant phase record before continuing. Source files
and actual Git status take precedence over older narrative.

## Fixed context

- Repository: `pabitra27706-oss/Diploma-3rd-sem`.
- `main` = `9d47c7c76b2384c72944a0880df058a2518394ec` — the merge of PR #11 —
  carrying Phase 1 (`✅*`), Phase 2 (`✅*`), Phase 3 (`✅*`), and sub-phase 8A.
- Session branch: `arena/80b11bcf-diploma-3rd-sem` (active), branched from
  `main` at `9d47c7c76b2384c72944a0880df058a2518394ec`. Do not
  create/switch/rename branches or push another branch.
  Prior branches `arena/637a5a31-...` (PR #10 `8f6eb97`, PR #11 `9d47c7c7`),
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
- Discovery/study: compact search/repeat sidecars, source deep links, related
  unit material, 1,339 model/keyed-source cards, fixed Leitner scheduling,
  Today/goals/streaks, sample-qualified weak-area trends. Not newly certified facts.
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
  work remains. Current worker VERSION: `study-safety-2026-11-09`.

## Evidence and limits

Latest implementation checkpoint: 13 Python tests, six deterministic Node suites
and seven focused Chromium suites PASS; full JS/CJS + JSON parse PASS. Site strict
0 errors / 28 warnings, platform 0 errors, immutable-PYQ guard 0 changes.
Full data strict still has 9 ledger findings; syllabus strict has 3 grouped
errors. `check_site.py --strict` reports the same 17 pre-existing accessibility
labels it reports on `main`. An exact-baseline pass is not a full strict pass.

## How to continue safely

1. Inspect Git status and actual files. Preserve the accumulated changes; do not
   redo completed engineering merely because older phase tasks say planned.
2. Use `docs/STATUS.md`'s remaining order. Phases 1, 2 and 3 are `✅*`
   (owner-approved with recorded caveats); Phase 4 (`04-discovery`) parts
   4.1–4.5 are implemented and gate-verified on `arena/80b11bcf-diploma-3rd-sem`
   (`🚧` awaiting owner local verification); next sequential phase is Phase 5
   (`05-study-system` — parts 5.1–5.5: flashcards, Leitner edge cases, weak
   areas with denominators, daily goal/streaks, and Today dashboard), followed
   by Phases 6–9 and Phase 10 device acceptance.
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
git pull --ff-only origin arena/80b11bcf-diploma-3rd-sem
cd ..
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/Diploma-3rd-sem/`. Stop with Ctrl+C. For a first-time setup, clone instead from the parent
directory: `git clone --branch arena/80b11bcf-diploma-3rd-sem
https://github.com/pabitra27706-oss/Diploma-3rd-sem.git`, then run the block
above from inside the checkout. Unpushed Arena changes are not available through
a fresh clone or pull; state which commit/branch holds a change before telling
anyone to pull.
