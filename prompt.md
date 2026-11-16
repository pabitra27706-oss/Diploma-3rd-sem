# Diploma 3rd Sem Study Hub — continuation handoff

Updated 2026-11-16 (branch/license audit). Read `rule.md`, `docs/STATUS.md`, `docs/DECISIONS.md`,
`docs/ROADMAP.md` and the relevant phase record before continuing. Source files
and actual Git status take precedence over older narrative.

## Fixed context

- Repository: `pabitra27706-oss/Diploma-3rd-sem`.
- Active branch: `arena/26856d99-diploma-3rd-sem`. Do not create/switch/rename
  branches or push another branch. The prior `arena/be3d9178-diploma-3rd-sem`
  branch was merged into main via PR #7 (commit `125eb94`) and is retired.
- Current branch tip: `125eb94` (the merge commit of PR #7, which brought the
  prior `arena/be3d9178-diploma-3rd-sem` work into main). This branch is built
  on that merge. Inspect actual Git/PR state rather than assuming an older
  checkpoint is current.
- Zero-build static HTML/CSS/JS/JSON; publication base `/Diploma-3rd-sem/`.
  Canonical configured URL: `https://pabitra27706-oss.github.io/Diploma-3rd-sem/`.
  This is not confirmation that the live site has current changes.
- No money, analytics, external runtime dependencies or implicit publication.
- Root license is unset. README no longer links a nonexistent license file.

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

## Approved source reconciliation for PR #7

Owner authorizes preserving main's newer sources and merging the code. The
fixed PYQ/registry baseline is now main commit
`cfe3a63decb270826da40ea50b9392efc58b2f1d`; all 35 originals match it exactly.
Main's icon/manifest fix is preserved. Derived artifacts have been regenerated;
the same ten source-review findings remain open. Consult PR #7 for CI/merge
result; do not treat earlier unpushed/blocked checkpoint notes as current state.

## Current implementation

Phase 1 platform implementation is complete with deferred final hardware
acceptance. Phases 2–9 remain in progress. See `docs/STATUS.md` for the complete
per-phase remainder table and the source/rights gates.

- Data: 992 raw PYQs, 923 exact-unique Practice questions, 69 aliases across
  30 papers; ten derived Practice days. 872 quiz-bank items (416 keyed MCQs,
  456 non-MCQ ungraded). CST207 has no quiz bank. Originals remain unchanged.
- Quiz: versioned attempt snapshots, deadline-based timers, autosave/resume,
  flags, score boundaries, history/export/exact retries/edits and mistake queue.
  Paper practice preserves sources and duration but does not enforce choices,
  section timing or explanation-mark rules; no official overall paper grade.
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

Latest implementation checkpoint: 12 Python tests, four Node suites and seven
focused Chromium suites PASS; full 48 JS/CJS + JSON parse PASS. Site strict
0 errors / 28 warnings, platform 0 errors, immutable-PYQ guard 0 changes.
Full data strict still has 10 ledger findings; syllabus strict has 3 grouped
errors. An exact-baseline pass is not a full strict pass. Hosted CI has not run
on the unpushed implementation. Historical Phase 2 CI is recorded in its record.

## How to continue safely

1. Inspect Git status and actual files. Preserve the accumulated changes; do not
   redo completed engineering merely because older phase tasks say planned.
2. Use `docs/STATUS.md`'s remaining order. Next major gaps are paper rules and
   the asynchronous IndexedDB storage path, then remaining discovery/study,
   accessibility/language, cited content and performance/cache work.
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
git push origin arena/26856d99-diploma-3rd-sem   # ensure branch is current (agent already pushed)
git pull --ff-only                               # get latest on the branch
cd ..
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/Diploma-3rd-sem/`. Stop with Ctrl+C. The `git push`
guarantees the branch is current before the pull; it is a no-op when the agent
has already pushed. For a first-time setup, clone instead from the parent
directory: `git clone --single-branch --branch arena/26856d99-diploma-3rd-sem
https://github.com/pabitra27706-oss/Diploma-3rd-sem.git`, then run the block
above from inside the checkout. Unpushed Arena changes are not available through
a fresh clone or pull; state which commit/branch holds a change before telling
anyone to pull.
