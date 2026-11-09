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
