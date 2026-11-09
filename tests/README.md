# Optional browser smoke test

`platform-browser.cjs` requires development-only `playwright-core` and a Chromium
binary. These are NOT runtime dependencies and are not shipped in the site.
Serve the checkout at a local subpath, then run:

```sh
NODE_PATH=/path/to/dev/node_modules CHROMIUM_EXECUTABLE=/path/to/chromium \
TEST_BASE=http://127.0.0.1:8000/after/Diploma-3rd-sem/ node tests/platform-browser.cjs
```

The test checks scoped registration, visited-page offline reload, unvisited-page
fallback, synthetic install acceptance, a bumped worker waiting without quiz
reload, and user-confirmed activation. It temporarily rewrites the local SW
version in a try/finally; use only a disposable local server. This is not a real
Chromium OS install dialog, iOS/device test, or proof that unsaved attempts persist.

## Phase 2 data pipeline

Run `python3 -m unittest discover -s tests -p 'test_*.py' -v` for schedule,
generator idempotency, source-content preservation, strict/baseline and mutation
tests. The content-preservation test uses immutable Phase 2 base commit
`646dea2aa44c3de207e8a46cfcf2c45c5d822310`; CI fetches history so it can read it.

`data-browser.cjs` optionally uses the same development-only Playwright setup
as above. It tests actual subpath data requests, ten day counts, a day-10
session, data-derived source/year choices (including EXTRA), no empty CST207
quiz offering, no-key scoring/UI, and home/roadmap counts. No production edits.

Full `validate_data.py --strict` and `validate_syllabus.py --strict` currently
**fail on documented source-review blockers**. `--check-baseline` is only a
regression gate against the exact fingerprinted ledger, not a strict pass.
