# Diploma 3rd Sem Study Hub — continuation handoff

Updated 2026-11-09. Read `rule.md`, `docs/STATUS.md`, `docs/DECISIONS.md`,
`docs/ROADMAP.md` and the relevant phase record before continuing. Source files
and actual Git status take precedence over older narrative.

## Fixed context

- Repository: `pabitra27706-oss/Diploma-3rd-sem`.
- Active branch: use the branch named in the latest Arena system note. For this
  continuation it is `arena/71382686-diploma-3rd-sem`, based on
  `125eb947413eb3901f4d3e98cd63c6fc31aa7fae`. Never create/switch/rename
  branches or push another branch. Older branch names below are historical.
- PR #7 was merged into main; this continuation starts at merge commit
  `125eb947413eb3901f4d3e98cd63c6fc31aa7fae`. The pre-merge checkpoint tip
  `ac428d1` and its later history are historical; inspect actual Git state.
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
  Paper choice quotas and seven explicit 30-minute section locks are implemented
  from existing metadata; marks/explanations remain ungraded pending reconciliation.
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
  work remains. Current worker VERSION: `quiz-paper-rules-2026-11-12`.

## Evidence and limits

Broad historical implementation checkpoint (2026-11-09): 12 Python tests,
four Node suites, seven focused Chromium suites, 48 JS/CJS + JSON parse, site
strict 0/28, platform 0 errors and PYQ guard 0 changes. This is not fresh device
or browser evidence for later modifications.

Fresh Phase 3 paper-rule checkpoint (2026-11-12): 12 Python tests and six Node
suites pass; JS/CJS parse sweep passes; 30 registered-paper rules map with no
unsupported/uncovered question pools, including seven explicit 30-minute
sections; site strict is 0 errors / 28 warnings; platform check is 0 errors;
PYQ validation and integrity pass. Browser/Chromium and hosted CI were not run.
Official paper marks remain withheld. Phase 2 exact-baseline match remains only
an exception-ledger pass, not full strict data/syllabus acceptance; ten data
findings and three grouped syllabus errors stay source-gated.

## How to continue safely

1. Inspect Git status and actual files. Preserve the accumulated changes; do not
   redo completed engineering merely because older phase tasks say planned.
2. Use `docs/STATUS.md`'s remaining order. Paper choice/timed-section engineering
   is implemented; complete its focused browser acceptance. Next major engineering
   gap is the asynchronous IndexedDB storage path, then remaining discovery/study,
   accessibility/language, cited content and performance/cache work.
3. Never retag raw PYQs to make strict checks green. Keep source findings
   visible; record new evidence/dispositions in derived metadata and decisions.
4. Edit source scripts, not generated bundles. Regeneration order and check
   commands are in root README; browser commands/limits are in tests/README.md.
5. Keep records, status, roadmap and this handoff aligned. Historical evidence
   stays dated; new passes require actual execution. Device acceptance is Phase 10.
6. Stop at publication gates. No commit/push is needed to preserve Arena files;
   inspect identities/diff and existing rules before any authorized Git operation.

## Termux delivery convention

For a fresh Termux checkout, clone the pushed active branch named in the latest
Arena note, then symlink it as `$TMPDIR/study-hub-server/Diploma-3rd-sem` and
serve its parent with Python on 127.0.0.1:8000. Existing clones should fetch and
fast-forward that branch only; never switch/reset unrelated work. Exact URL:
`http://127.0.0.1:8000/Diploma-3rd-sem/`. Stop server with Ctrl+C. Always state
whether any newer Arena changes are unpushed before providing these commands.
