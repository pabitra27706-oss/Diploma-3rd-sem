# Engineering checks and browser regressions

These tests distinguish implementation regressions from source certification
and real-device acceptance. A green test is not publication authorization.

## Dependency-free checks

From the repository root, with Python 3 and Node.js:

```sh
python3 scripts/check_pyq_integrity.py
python3 scripts/check_platform.py
python3 scripts/check_site.py --strict --quiet
python3 scripts/validate_pyq.py
python3 scripts/validate_data.py --check-baseline
python3 scripts/audit_accessibility.py --fail
python3 scripts/check_tokens.py --strict
python3 scripts/build_icon_subset.py --check
python3 scripts/build_data_version.py --check
python3 scripts/audit_page_weight.py --budget
python3 scripts/check_root_rewrite.py
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/attempt-store.cjs
node tests/quiz-engine-dom.cjs
node tests/study-store.cjs
node tests/study-dom.cjs
node tests/study-offline.cjs
node tests/storage.cjs
node tests/storage-recovery.cjs
node tests/storage-mirror.cjs
node tests/preferences.cjs
node tests/section-notes.cjs
node tests/theme-skew.cjs
node tests/data-pipeline-consumers.cjs
node tests/discovery-dom.cjs
node tests/data-version.cjs
```

Python currently covers **92** tests (Phase 9 added 29): the colour-token gate
(palette uniqueness, no literal outside the token file, page load order, and one
negative case per rule on temporary trees), the generated icon-CSS subset
(currentness, icon coverage, license banner, unknown-icon disclosure), the
generated data version (currentness, input coverage, independence from the shell
version), and the base-path proof (one constant, `/`-rooted copy passes the site
checker). Earlier suites cover: source-preserving/idempotent
pipeline transformations, source + syllabus-HTML + runtime-pool mutation detection,
integrity guard changes/additions/removals, compact discovery (≤ 40% shard budget,
84-page scope partition, file/anchor validation, 1 exact alias + 15
unverified candidate repeat clusters, and SW cache registration), Phase 5 card
eligibility (source-verbatim copies, citation hygiene, explicit skip accounting,
per-unit counts, byte-identical regeneration, compact payload), bundle/source
consistency, runtime pools and coverage joins, and (Phase 8) the coverage map's
declared-unit/out-of-syllabus arithmetic, the exam-pattern reconciliation of all
28 papers against their own answer-any quotas, print-sheet reach on every shipped
page, the verbatim-citation rule for revision sheets, and the fail-closed
answer-verification register (missing citation, bad/future date, unknown id,
duplicate target, >40 items — each must reject the whole register).

`tests/test_content_depth.py` also owns the **regeneration contract**: it rebuilds
`coverage.html` and the revision sheets in the documented order (builders →
`generate_presence.py` **twice**) and asserts the files end byte-identical. A
single presence pass does not settle a fresh page; that is expected, not a bug. Paper comparisons pin to the owner-approved
sourceCommit in `_data/pyq-integrity.json`; quiz-bank comparisons use the same
revision (the 2026-11-17 explanation revision, where both pins now point). Both
values must be in Git history; do not use a shallow clone
for these checks. CI checks out full history. Phase 11 also checks static
Suggestions generation, coverage of all syllabus units, exact archive routes
and session labels, paired revision-guide links, and sitemap/search presence.

Node suites cover attempt persistence/migration/retries/mistakes, Leitner
scheduling (ladder, local-midnight rollover, per-day new-card cap, clock clamps,
duplicate ratings, reload), seven-day trend boundaries, streak/goal/question-of-day
helpers, the `cards.html`/`today.html` UI contracts (keyboard, URL + `popstate`
filters, empty states, denominators, no raw identifiers), the study worker's
precache + `WARM_STUDY` shards and offline navigation, storage/reset/backup
behavior, and injected quota/interrupted-import recovery. Injection is not proof
of actual Safari eviction or private-mode behavior.

The DOM suites share `tests/lib/minidom.cjs`, a deliberately small DOM stand-in:
anything those scripts need beyond `textContent`, real buttons, focus and
`history`/`popstate` fails loudly. It is a contract test, not a rendering or
screen-reader test.

For full strict findings, run separately:

```sh
python3 scripts/validate_data.py --strict
python3 scripts/validate_syllabus.py --strict
```

These currently fail on recorded source-review blockers. `--check-baseline`
only accepts the exact fingerprinted ledger; it is **not** strict acceptance.
Do not change authoritative originals or widen the ledger to obtain a green run.

## Optional Chromium regressions

Install development-only `playwright-core` and a compatible Chromium binary in
a separate development workspace. They are not site runtime dependencies.
Serve the checkout at its nested base path. Set these variables for your local
installation (the paths below are placeholders, not repository prerequisites):

```sh
export NODE_PATH=/path/to/dev/node_modules
export CHROMIUM_EXECUTABLE=/path/to/chromium
export TEST_BASE=http://127.0.0.1:8000/Diploma-3rd-sem/

for suite in data-browser quiz-engine-browser discovery-study-browser \
  storage-browser paper-offline feedback-browser cards-offline suggestions-browser; do
  node "tests/$suite.cjs" || break
done
```

If Chromium needs extra shared libraries, configure `LD_LIBRARY_PATH` for that
installation. No phone or OS-install dialog is simulated by these commands.
Use an isolated local test profile; tests intentionally create local records.

| Suite | Focused coverage |
|---|---|
| `data-browser.cjs` | Unique Practice pool/day counts, real bank filters, no-key scoring and live counts |
| `quiz-engine-browser.cjs` | Virtual-clock resume, flags/order, exact preview/retry, selected exports/edit, fetch failure, honest paper-practice limits |
| `discovery-study-browser.cjs` | Safe search query, dijkstra/info-page search, 1 exact + 15 unverified candidate repeat clusters, canonical question deep link, unit breadcrumb/anchor + filtered-PYQ handoff, URL unit filter, honest card citation, card rating persistence and Today counts/primary action |
| `storage-browser.cjs` | Notes on three pages, reading preferences, previewed restore and stale-preview invalidation |
| `paper-offline.cjs` | Previously cached paper/registry/engine/review offline |
| `feedback-browser.cjs` | Keyboard buttons, field errors, copied draft/no request, once-per-tab-session local prompt |
| `cards-offline.cjs` | Twenty-card warmed-cache offline keyboard session, honest citation, empty-queue fallbacks, reload and Today counts |

The offline tests require an initial successful online visit. They do not
promise uncached first visits, all resource combinations or storage persistence
on every browser. Timers use a controlled browser clock, not physical screen
lock/background throttling.

### Separate worker-update regression

```sh
node tests/platform-browser.cjs
```

**Use a disposable checkout/local server only.** This suite temporarily rewrites
the service-worker version in a try/finally. Do not run it against production or
alongside other tests reading that worker. It checks scoped registration,
visited-page offline/fallback, synthetic install acceptance, waiting updates and
user-confirmed activation. Its historical Phase 1 result is not a fresh pass on
the current tree unless rerun and recorded.

## Final device acceptance

Actual Android/iOS/tablet/desktop, screen readers, zoom/reflow, touch accuracy,
background timers, install/update, real backup downloads and phone print output
are deferred to [Phase 10](../docs/phases/10-device-acceptance/README.md).
Record hardware and emulation separately. Missing access is untested, not pass.
