# Phase 1 — Platform and deploy integrity

- Status: ✅ platform implementation verified (syllabus-strict exception below) · Date: 2026-11-09 · Branch: arena/e7d831f7-diploma-3rd-sem
- CI: run **42633146154** green on implementation commit **560073ed93899d559439ead7f00177baba4e8ae7**. `site-preview` artifact **13680983233** uploaded (3,522,982 bytes); `site-check` artifact **13680878245**. Documentation-only follow-up records this evidence.
- Starting tip: 114dd75. Prior main CI: 42631720212 success; no open PRs.
- No deploy, PR, merge, license or content changes authorized.

## Reused

- 1.1 ADAPT — existing page-relative links and repo stdlib checker; no dependency.
- 1.2 ADAPT — existing SW message protocol, manifest, icons and CSS tokens.
- 1.3 BUILD — small shared plain-JS install/update controller; no framework needed.
- 1.4 ADAPT — existing SVG stroke conventions; self-host existing Font Awesome Free 6.5.1 rather than replace hundreds of icons. Upstream licenses retained.
- 1.5 BUILD — deterministic stdlib metadata/sitemap generator; reuse site icon and existing pages.
- 1.6 ADAPT — existing Web CI and validation scripts.

## Evidence before changes

- `python3 scripts/check_site.py`: 12 errors, 198 warnings (report captured outside served tree).
- `manifest.json:5,13`: start_url/scope `/`; `sw.js:7-30`: root-relative shell and immediate skipWaiting.
- `assets/pwa/icon-*.png`: six zero-byte files; `practice/js/index.js:62,176,179`: root-relative dynamic icons.
- `index.html:458`: missing contact target; `info/professional-hub.html:117`: hard-coded Active.
- `.github/workflows/ci-web.yml`: baseline site gate; syllabus coverage explicitly advisory until Phase 2.

## Parts and what shipped

- 1.1 ✅ Page-relative HTML and dynamically rendered Practice icon references; manifest and worker use their own scope. Root-relative references now fail the strict gate rather than warn.
- 1.2 ✅ Six original geometric-book PNGs (72–512px), maskable-safe; manifest id/start/scope `./`. Cache version `platform-2026-11-09`; network-first navigation, cached visited pages, offline fallback for unvisited pages, versioned data cache keys and background refresh. Only this app's caches are removed.
- 1.3 ✅ Shared install affordance on all existing pages, synthetic Chromium event acceptance tested; iOS instructions and standalone detection. Waiting worker banner requires explicit confirmation to activate/reload. Other tabs never auto-reload. Initial installation is not advertised as an update. Professional Hub displays build, not a fictional Active status; offline claim narrowed to previously cached resources.
- 1.4 ✅ Contact target and escaping Info links repaired, four SVG symbols added, zero-byte placeholders deleted, unfinished Bookmarks/Tips removed from navigation (their direct pages remain visibly Coming Soon and noindex). Existing Font Awesome dependency self-hosted with upstream licenses; no icon redesign or third-party runtime CDN.
- 1.5 ✅ Root 404 with absolute first-party links for arbitrary missing-path depth; generated sitemap/robots, per-page canonical/OG/Twitter metadata, favicon/apple icon. Real 1200×800 home screenshot used for OG; not a generated mockup. Generator is byte-idempotent.
- 1.6 ✅ Strict site and platform checks in CI, conditional data validator (does not exist until Phase 2), asset budgets summary, downloadable `site-preview` including before/after screenshots. No advisory broken-link step, no correctness continue-on-error.

## Acceptance conflict preserved, not silently waived

`tasks.md` 1.6 requests full `validate_syllabus.py --strict`, but the existing
owner/agent decision and workflow explicitly defer known coverage errors to
Phase 2. Running full strict still fails on CST205 ×4 and CST209 ×3 Unit-5 PYQs.
No content was retagged and no existing decision was changed. CI keeps the
syllabus join visibly advisory until the content-verification gate in Phase 2.
Thus the platform/site strict acceptance is met; the literal full-syllabus-strict
subtask is **not** met and is tracked as a Phase 2 blocker, not called green.

## Checks

- `check_site.py --strict`: **0 errors, 97 warnings** (baseline 12 / 198); **0 root-relative references**, no empty files. Remaining warnings concern existing accessibility/structure debt, not Phase 1 path errors.
- `check_platform.py`: 0 errors: PNG signatures/dimensions, manifest scope/install sizes, precache existence, metadata, no external runtime CDN, sitemap targets, deterministic regeneration.
- `validate_pyq.py`: PASS, 30 papers / 992 questions, 0 errors/warnings.
- JSON parse: PASS, 56 files. JS parse: PASS, 20 JS + optional CJS test (rerun before commit).
- Negative tests: temporary broken-link page and temporary root-relative reference each make `check_site.py --strict` exit 1; both removed.
- Chromium 153 headless under `/after/Diploma-3rd-sem/`: scoped worker; visited Practice offline reload; unvisited nested-page offline fallback; synthetic install event acceptance/hide; deliberately bumped worker waits without quiz reload; user-confirmed activation. Temporary worker bump restored. Reproducible optional test: `tests/platform-browser.cjs` and `tests/README.md`.
- Dev dependencies installed outside repo: playwright-core + @sparticuz/chromium; none shipped or required at runtime.
- Budgets: JS 536,153 bytes before optional CJS test (largest 61,002); CSS 574,291 (largest 110,612); JSON 1,863,450 (largest 68,016). CI generates current `budgets.txt`.

## Preview / design comparison

`screenshots/{before,after}-{home,practice,quiz}.png` show actual baseline vs
current 1200×800 pages. Home bypasses onboarding with the existing default
“Student”, no personal data. Practice now resolves its shell and icons under a
project subpath. Existing theme, typography and content retained; no token
redesign. Known contrast/a11y debt stays in `docs/DESIGN.md` for Phase 7.

## Not verified / launch follow-ups

- Real OS install dialog, iOS Safari, standalone app on a phone, real device
  airplane-mode pass, screen reader, and actual social-network link unfurl.
- Browser test proves no *automatic* reload, not persistence of unsaved quiz
  attempts (Phase 3). Cached pages/data only; not a promise that all content
  is pre-downloaded.
- No deploy, PR, merge, Pages/domain change, or license decision performed.

## Next-chat prompt

Printed in chat at phase end; `prompt.md` updated as durable backup. Next work:
Phase 2 only, including the unchanged content-verification and syllabus gates.
