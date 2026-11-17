# Phase 9 — Engineering record

Status: **implementation complete for 9.2, 9.3 and 9.5 on 2026-11-17; 9.1
re-verified; 9.4 and 9.6 are owner/hardware gates.** The owner then ordered
**"merge it to main"**: **PR #17** merged on 2026-11-17 at 09:01:31Z as
`c898a95`, Pages built that commit at 09:01:32Z, and the live site serves
`sw.js` `study-2026-11-17e` + `data-6b1621c45599`. No domain, Pages setting, tag or
release was touched. Every number below was produced in
this environment (Linux, Python 3.11, Node, **no browser**) by the named script;
anything that needs a browser or a phone is marked *not run*.

Reuse: ADAPT the existing first-party service worker, deterministic source
pipeline and checked-in concatenation pattern (`build_runtime_bundles.py`); BUILD
the palette extractor, the icon-CSS subsetter, the data-version generator and the
root-rewrite proof, because no verified pattern in this tree did it.

## 9.1 — Data loading (verified, not redone)

`build_runtime_data.py` still generates the two compact pools; Practice fetches
one pool and one catalog. The 2026-11-09 cold-Chromium numbers stand for the data
fan-out (Practice 43 → 12 requests, 36 → 1 JSON; quiz setup 28 → 12, 20 → 2 JSON)
and are **not** re-measured here — there is no browser in this environment.
What changed in this phase is the *static* side of the same budget, measured from
disk by `scripts/audit_page_weight.py` (no browser needed):

| Measure (74 pages, uncompressed, from disk) | Before (HEAD `0e53a4a`) | After | Change |
|---|---:|---:|---:|
| static requests, all pages summed | 817 | 592 | −225 (−27.5 %) |
| CSS bytes, all pages summed | 8,638,771 | 6,817,906 | −1,820,865 (−21.1 %) |
| JS bytes, all pages summed | 6,143,134 | 6,187,593 | +44,459 (+0.7 %) |
| worst page CSS (`subjects/CST201/index.html`) | 221,534 | 159,936 | −27.8 % |
| worst page JS (`subjects/CST201/index.html`) | 153,970 | 154,546 | +0.4 % |
| static requests per page | 9–15 | 7–10 | — |

Per-view requests **from code** (static files + the JSON a view fetches to render):

| View | Static | Data | Total |
|---|---:|---:|---:|
| `practice/index.html` | 8 | 1 (pool) | **9** |
| `quiz/setup.html` | 8 | 2 (pool, catalog) | **10** |
| `subjects/CST201/units/unit-1.html` | 10 | 0 | **10** |
| `pyq/answers.html` | 7 | 1 (paper) | **8** |
| `index.html` | 8 | 1 (catalog) | **9** |
| `today.html` / `cards.html` | 10 | 2 (card manifest, shard) | **12** |
| `quiz/play.html` | 10 | 1 (pool) | **11** |

Acceptance "≤ 12 requests before first render on practice and quiz setup" is met
with room (9 and 10). Evidence: `page-weight-before.json`,
`page-weight-after.json`, `request-measurements.json` (the 2026-11-09 Chromium
run, unchanged and clearly labelled as browser-measured).

## 9.2 — CSS/JS consolidation (done, no browser)

**One token file.** `assets/css/variables.css` now carries a palette block — 302
entries — defining **every hex colour literal** (`#rgb`/`#rrggbb`/`#rrggbbaa`) in
the tree exactly once. 1,205
literals were replaced by `var(--c-…)` references (1,148 across 20 stylesheets and
74 pages, 57 inside `variables.css` itself). Equivalence was proven statically,
not by eye: for every rewritten declaration the palette token resolves to the
identical hex the file used before (`1,148 + 57 checked, 0 mismatches`), and all
47 measured contrast pairs resolve to exactly the same foreground/background/ratio
as before the change (`scripts/audit_accessibility.py`, before vs after, 0 diffs).

- Per-area semantic namespaces (quiz, practice, pyq, units) keep their own
  `--bg-primary`/`--accent` names because those names already mean *different*
  colours per area; merging them would change rendered output. They are aliases
  of palette entries now, so no literal survives outside the token file.
- `scripts/check_tokens.py --strict` enforces: no **hex** literal in first-party
  CSS, an inline `style` attribute or a `<style>` block; one definition per palette
  colour; no unused palette entry; no `var(--x)` without a definition unless it
  has a fallback; and every page loading the token file **first**. Allowlist, with
  reasons: the vendored Font Awesome CSS, `<meta name="theme-color">` (a meta tag
  cannot take `var()`), and the two literals `theme.js` writes into that meta tag.
- 10 Python tests (`tests/test_tokens.py`) exercise the checker on temporary
  trees, so the gate cannot pass by accident.
- **Not tokenised, and not claimed:** `rgba()`/`rgb()` values are outside the
gate's scope — 373 occurrences (188 distinct) remain in first-party CSS, mostly
alpha shadows, overlays and translucent borders. They are recorded here as an
open item, not silently counted as done; tokenising them would need an
alpha-capable token model and a fresh contrast check.

**Dead code.** 71 rules removed (8,485 B) whose class/id names appear nowhere in
shipped HTML, JS or JSON — quiz utility/card classes, unused unit figures,
unused roadmap pills (the dynamically built `pill-CST20x`/`dot-CST20x` and
`q-badge-difficulty-*` families were deliberately kept). Six inline
`--primary-color` references that resolved to nothing (CST205 unit 3/4, CST207
units 1–5) now use the defined `--primary`; those diagrams therefore paint
borders/backgrounds that were previously dropped by an invalid declaration — a
rendering change, recorded as such.

**Requests removed.** `print.css` + `accessibility.css` + `pwa.css` became one
`assets/css/base.css` (−2 requests/page), and `accessibility.js` + `i18n.js` +
`pwa.js` became one generated `assets/js/shell.bundle.js` (−2 requests/page).
The English UI catalog is no longer fetched at all — English is the authored
markup, so only Bengali costs a catalog request (−1 request for the default
user). `quiz/play.html` no longer loads the metadata loader it never used.

**Icons.** `assets/vendor/fontawesome/css/all.min.css` (102,641 B, ~1,900 rules)
is replaced at runtime by the generated `used.min.css` (25,890 B, 226 icon rules
plus every utility and both `@font-face` families) on 38 pages — −74.8 % of the
icon CSS per page. The generator keeps the license banner and the unmodified
webfonts: **the fonts are deliberately not subset** (SIL OFL reserved-name rules
would force a rename of a third-party family — a rights decision, recorded in
`docs/DECISIONS.md`, not an engineering shortcut). `tests/test_icon_subset.py`
fails if a page names an icon the subset does not carry. Seven class names used in
the markup do not exist in FA 6.5.1 Free (`fa-cpu`, `fa-flow-chart`,
`fa-formula`, `fa-function`, `fa-intersection`, `fa-split`, `fa-wifi-slash`) and
are listed in `used-icons.json` as an open finding rather than silently dropped.

**Not proven:** no screenshot, no computed-style diff and no visual regression run
is possible here — there is no browser. The equivalence claim is at the level of
"every colour resolves to the same hex", which covers colour, not layout.

## 9.3 — Caching and update policy (done, browser-free regression)

Two independent versions:

- **shell** — `const VERSION = 'study-2026-11-17e'` in `sw.js`, still the
  `app-build` source and the name of the shell cache. A new shell installs as
  *waiting*; `pwa.js` shows the banner and only reloads after the student
  confirms.
- **data** — generated `assets/data/data-version.json`
  (`data-6b1621c45599`, over 81 files across `_data/`, `_quiz-data/`,
  `assets/data/`, `assets/search/`, `assets/cards/`) written by
  `scripts/build_data_version.py`. The worker reads it once per lifetime, keys
  data entries with it and keeps data in its **own cache namespace**
  (`diploma-3rd-sem-data-<dataVersion>`).

Consequences, all asserted by the new `tests/data-version.cjs` with no browser:

1. A data-only change bumps only the data version: the returning device's next
   read misses the cache, goes to the network, and stores the corrected bytes
   under the new key — no shell update, no waiting worker, no banner, no storage
   reset. The cached shell is byte-identical afterwards.
2. A shell-only change installs a new shell cache and `activate` deletes the old
   one, but the data cache (same data version) survives, so a returning student
   does not re-download the pools.
3. Offline still works after either bump, including a data file requested without
   `?v=` while `data-version.json` is unreachable (any cached copy of the same
   pathname is served).

`tests/study-offline.cjs` and the mock Cache API in the Node suites gained
`cache.keys()`, which the real Cache API has always had.

## 9.5 — Base-path readiness (done, no domain action)

`scripts/site_config.py` is the single constant (`SITE_ORIGIN` + `BASE_PATH`);
`generate_presence.py`, `check_platform.py` and `audit_page_weight.py` import it,
and `tests/test_root_rewrite.py` fails if any other shipped source hard-codes the
published URL (generated outputs — presence block, sitemap, robots, `404.html` —
are allowlisted with reasons).

`scripts/check_root_rewrite.py` copies the tree to a temporary directory,
rewrites every absolute URL to a `/` root, and runs `check_site.py --strict`
inside the copy: **426 files copied, 81 rewritten, 0 errors, 0 warnings**. A
base-path change is therefore one edit plus a regeneration, not a rewrite.
No domain was bought, registered or configured; `docs/DOMAIN.md` holds the
ordered migration and rollback.

## 9.4 — Measurement without surveillance (owner gate)

The local-only usefulness prompt shipped in the Phase 9 first pass and is still
the only instance of the pattern: one non-modal prompt per browser-tab session on
Today and quiz results, dismissible, counts stored in
`d3s:feedback-usefulness`, a copy template carrying only origin/path and build
version. Reading the code confirms **no network call**: the prompt handler has no
`fetch`, no `sendBeacon`, no image ping; the clipboard/textarea fallback is local.
`docs/MEASUREMENT.md` lists what is knowable and what is not, including that
repository traffic is not student usage.

**Owner answered 2026-11-17 — by opening a gate, not by closing the part.** Asked
whether the local-only default stands, the owner chose to open a **first-party
aggregate counter gate** (`docs/DECISIONS.md` → "9.4 measurement — owner opened a
first-party counter gate — 2026-11-17"). Nothing was implemented in response: the
gate is not an implementation approval, and the site still sends nothing.

Still open, and required before any counter code exists: **which number** is
counted, **where** it is stored, **how long** it is kept, and the **privacy-page
disclosure text**. The inherited constraints are binding: one same-origin
non-blocking request inside the page budget, never a precache entry, no query
strings/notes/answers/no persistent identifier, no third-party script, and counts
are reported as views — never as learning, retention or "students helped". 9.4
therefore remains **open**.

## 9.6 — Launch gate (blocked on hardware and on the deploy gate)

`docs/LAUNCH-CHECKLIST.md` is the repo copy of
`webflow/templates/site-checklist.md`, ticked with dates and evidence for every
item this environment can prove: links, JSON, manifest/icons, worker precache,
offline page, skip links/landmarks/contrast/targets (static audit), privacy and
truth pages, request budget, README/repo hygiene, rollback.

**Not ticked, and not claimed:** any Lighthouse score (no browser, no Chrome, no
network run), real-phone pass, install/A2HS, airplane-mode reload, rotation, font
scale, real print/PDF export, and the deploy itself. Rollback is written and has
never been exercised because nothing was ever deployed from this branch.

## Checks actually run (2026-11-17, this environment)

| Check | Result |
|---|---|
| `python3 -m unittest discover -s tests -p 'test_*.py'` | 92 tests, **1 error** — `test_data_pipeline.test_no_semantic_or_answer_changes` needs git history for `664674b`, which this checkout does not contain; the same error occurs on unmodified `main` |
| 14 deterministic Node suites (`tests/*.cjs` minus the Chromium ones, incl. new `data-version.cjs`) | **14/14 PASS** |
| `check_site.py --strict` | 0 errors, 0 warnings |
| `check_platform.py` | 0 errors |
| `check_pyq_integrity.py` | 0 changed/added/missing originals |
| `validate_data.py --check-baseline` | baseline matches the 9 recorded findings (not a full strict pass) |
| `audit_accessibility.py --fail` | 0 findings, 47 contrast pairs above requirement, motion 19/20 sheets, 0 sub-24px targets |
| `check_tokens.py --strict` | 0 findings, 302 palette entries, 0 literals outside the token file |
| `build_icon_subset.py --check` | current, 25,890 B, 226 icons |
| `build_data_version.py --check` | current, `data-6b1621c45599` |
| `check_root_rewrite.py` | 0 errors on the `/`-rooted copy |
| `audit_page_weight.py --budget` | every page within 300 KB CSS / 350 KB JS |
| `check_readme_paths.py` | 0 missing |
| Chromium suites, Lighthouse, real phone | **not run — no browser, no device** |

## Pending / open

1. 9.4 counter gate: the owner must answer metric, storage location, retention
   and disclosure text before any counter is written (the decision *to* want
   counts is recorded and must not be re-asked).
2. Lighthouse and any Core Web Vitals number: needs a real browser run; a green
   byte/request budget is not a Lighthouse score.
3. Real-phone launch pass, install, offline reload, print export → Phase 10.
4. Font subsetting (156 KB solid + 117 KB brands per icon page) is measured but
   not attempted: it needs a rights decision on the OFL reserved font name.
5. Seven icon class names that never rendered (see 9.2) — content follow-up.
6. Publication happened only through the owner's explicit merge command (PR #17).
   No Pages *setting*, domain, `CNAME`, tag or release was touched.
