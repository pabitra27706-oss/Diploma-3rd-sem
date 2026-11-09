# Phase 1 — Platform and deploy integrity

**Status:** ✅ platform implementation complete (full syllabus-strict subtask deferred per recorded Phase 2 decision; see record.md) · **Parts:** 6 · **Depends on:** 0 · **Owner gates:** none (no deploy)

## Goal

Make the site correct at the only URL it has. Everything else in the roadmap is
invisible until a student on `https://pabitra27706-oss.github.io/Diploma-3rd-sem/`
gets styling, icons, a working install, an update path, and no dead links.

## Why now — the measured evidence

| Problem | Count | Where |
|---|---|---|
| Root-relative references that resolve to the domain root, not the app | 62 | `bookmarks/`, `suggestions/`, `practice/*.html`, `quiz/*` |
| Manifest `start_url`/`scope`/icons at `/` | 1 file, several fields | `manifest.json:5-90` |
| Service-worker precache/fallback at `/` | 1 file | `sw.js:7-30` |
| PWA icons that are 0 bytes | 6 | `assets/pwa/icon-*.png` |
| Missing sprite symbols referenced by Practice | 4 (`filter`, `save`, `shuffle`, `delete`) | `practice/index.html`, `practice/session.html` |
| Links to files that do not exist | 8 (1 missing page + 7 repo-escaping) | `index.html:458`, `info/*.html` |
| Pages with no install affordance at all | 55 | `beforeinstallprompt`: 0 hits |
| No update path after a deploy | — | `updatefound`/`controllerchange`: 0 hits |
| No 404, `robots.txt`, `sitemap.xml`, canonical, OG tags | all absent | repo root, all pages |
| Third-party runtime request (Font Awesome CDN) on | 38 pages | all HTML |

## Scope

- **In:** every path, manifest, service worker, icon, sprite symbol, broken
  link, empty file, install/update UI, 404/robots/sitemap/metadata, and the CI
  flip to strict.
- **Out:** content changes, quiz behaviour, accessibility remediation beyond
  what these edits touch, performance refactors (Phase 9).

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 1.1 | Base-path sweep | Zero root-relative references; every asset resolves under `/Diploma-3rd-sem/` |
| 1.2 | PWA shell | Install succeeds; offline reload works from the deployed path |
| 1.3 | Install and update UX | A real install button, iOS steps, and "new version, reload" |
| 1.4 | Link, sprite and dead-file repair | Zero unresolved references; no empty file in the tree |
| 1.5 | Web presence | 404, robots, sitemap, canonical, OG, favicon all resolve |
| 1.6 | Gate becomes strict | `check_site.py --strict` exits 0 in CI |

Details: [`tasks.md`](tasks.md).

## Decisions needed

- Icon artwork source: generate from one SVG seed, or use a single existing
  icon at two sizes? (Design decision; default: generate both sizes from one
  seed SVG, keep the original PNG out of the manifest if unreadable.)
- Font Awesome: remove entirely (default, matches "no third-party runtime
  request") or self-host the subset actually used? Removing may change 38
  pages' visuals; self-hosting adds ~100 KB. Default: replace used glyphs with
  the existing sprite; delete the CDN link.

## Done means

- `python3 scripts/check_site.py --strict` → 0 errors, 0 root-relative paths.
- Manifest passes a manual field-by-field read; all icons are real PNGs whose
  pixel size matches `sizes`.
- Offline reload of a nested page shows the app, not the browser error.
- Every `href`/`src`/`url()` resolves case-exactly.
- Install and update paths exist in code and are described in the record.
- CI is strict and green; the baseline-mode note is deleted from the workflow.

## Risks

- Touching 62 references across four subsystems can silently break a page;
  the gate catches paths, not layout — screenshot the four areas before and
  after.
- Changing `sw.js` rewrites every returning user's cache; a wrong cache name
  strands them on the old shell. Version deliberately and record it.
