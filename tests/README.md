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
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/attempt-store.cjs
node tests/study-store.cjs
node tests/storage.cjs
node tests/storage-recovery.cjs
```

Python discovery currently covers 12 tests: source-preserving/idempotent
pipeline transformations, mutation detection, integrity guard changes/additions/
removals, compact discovery, card-source resolution, bundle/source consistency,
runtime pools and coverage joins. Source-comparison tests require Git history
containing `646dea2aa44c3de207e8a46cfcf2c45c5d822310`; do not use a shallow clone
for these checks. CI checks out full history.

Node suites cover attempt persistence/migration/retries/mistakes, fixed Leitner
scheduling and seven-day trend boundaries, storage/reset/backup behavior, and
injected quota/interrupted-import recovery. Injection is not proof of actual
Safari eviction or private-mode behavior.

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
  storage-browser paper-offline feedback-browser cards-offline; do
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
| `discovery-study-browser.cjs` | Safe search query, exact-repeat count/source landing, card rating persistence and Today counts |
| `storage-browser.cjs` | Notes on three pages, reading preferences, previewed restore and stale-preview invalidation |
| `paper-offline.cjs` | Previously cached paper/registry/engine/review offline |
| `feedback-browser.cjs` | Keyboard buttons, field errors, copied draft/no request, once-per-tab-session local prompt |
| `cards-offline.cjs` | Twenty-card warmed-cache offline keyboard session, reload and Today counts |

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
