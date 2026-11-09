# Web engineering — the best-way build reference

> Practical defaults for a zero-build static site that must load on a cheap
> Android phone over 4G, work offline, install as a PWA, and stay accessible.
> Deviations are DECIDE-ONCE, recorded in `docs/DECISIONS.md`. Every number here
> is a budget, not a wish.

## 1. The default stack (deviations are recorded)

| Layer | Default | Why |
|---|---|---|
| Markup | Hand-written HTML5, one `<main>` per page | No framework, no hydration, no client router to break a link |
| Styles | One CSS entry (`assets/css/main.css`) that `@import`s token/component files | One request, predictable cascade |
| Tokens | CSS custom properties in one file (`variables.css`) | Single source of truth; dark mode is a token swap |
| Scripts | Modular vanilla ES modules, one entry per page | No bundler; `import` works natively |
| Data | Static JSON, fetched from the deployed path, cached by the service worker | Offline-first, no server |
| Icons | One inline SVG sprite, symbols defined in the same file | No icon font, no icon CDN, no 38 separate `<link>`s |
| Fonts | System font stack, or one self-hosted family subset | No third-party font request |
| Offline | `manifest.json` + `sw.js` + `offline.html` | Installable and usable with no network |
| Host | GitHub Pages at `/<repo>/` (custom domain only if recorded) | Free, static, no secrets |
| Build | None | Files are the artifact |

Allowed only with a recorded reason: any npm package shipped to the browser,
any third-party runtime request, any build step, any server endpoint.

## 2. Architecture rules that prevent rework

- **One page = one `<main>` + one `<h1>`.** Navigation and footer are shared
  markup; do not invent a second landmark.
- **Base-path safety is structural, not a review step.** Internal links and
  asset URLs are relative (`assets/…`, `../info/privacy.html`) or route through
  one helper that prefixes the base. Root-relative `/assets/…` is only correct
  when the base path is `/` — on project Pages it is a 404 waiting to happen.
- **One storage module.** Every read/write goes through one file that owns the
  key prefix, the schema version, and the fallback. Pages never touch
  `localStorage` directly — that is how three incompatible progress schemas
  appear in one site.
- **One theme module.** One key prefix, one attribute on `<html>`, and an
  inline pre-paint snippet so the first frame is not the wrong colour.
- **One data loader.** A single JSON fetch helper with: cache-busting version,
  error path, and a typed shape check on load. Pages ask it, not `fetch`.
- **Ids are permanent.** Data ids, storage keys, and URL parameters outlive
  code. Rename behind a migration, never in place.
- **Progressive enhancement:** every route, filter, and content page works with
  JavaScript disabled or slow; JS adds speed and comfort, never the content.
- **Deep links:** every meaningful view has a URL (`page.html?tab=history`).
  A tab or filter that exists only in memory cannot be shared or refreshed.

## 3. UI the first-try-right way

- Design with tokens (§ [design-system.md](design-system.md)), then build.
- Use the platform: `<dialog>` for modals (or a fully managed pattern from the
  ARIA Authoring Practices), `<details>` for disclosure, `<table>` for tables,
  `<button>` for actions, `<a href>` for navigation. Never a clickable `<div>`.
- Every interactive control is reachable by keyboard, visibly focused, and at
  least 44×44 CSS px of touch target.
- States are designed, not discovered: default, hover, focus-visible, active,
  disabled, loading, empty, error, offline, dark, 200% text.
- Never encode meaning in colour alone; never hide focus outlines without a
  replacement; never animate more than the reduce-motion branch allows.
- Empty states say what to do next, in one line, with one action.

## 4. Data and offline

- Data files are small, one concern each, and named for their content. A page
  must never need 35 sequential fetches to render one view: batch, or ship one
  index file, or start rendering with what loaded.
- Every JSON file validates and carries the fields its consumer reads. A field
  that exists but is never read is dead weight; a field read but often absent
  is a bug.
- Service worker rules:
  - `install` must not fail wholesale because one optional asset is missing —
    precache the shell with `cache.addAll` only over files that exist, and never
    precache a path that is generated at deploy time;
  - scope and start URL are relative to the deployed base path;
  - cache names are versioned, and `activate` deletes the old ones;
  - navigation requests fall back to `offline.html`;
  - data requests use stale-while-revalidate so first load is fast and the
    second is offline-capable.
- Test the offline path by hand once per phase: load, go offline, reload,
  navigate two levels deep.
- Nothing in the site may depend on being online for core content, and nothing
  may claim offline while making a runtime request for fonts, icons, or data.

## 5. Accessibility floor (WCAG 2.2 AA, on the shipped pages)

- One `<main>` landmark, a skip link as the first focusable element, headings in
  order with exactly one `<h1>`.
- Every page: `<html lang>`, a unique `<title>`, a meta description.
- Every input has a visible or programmatic label; every icon-only button has an
  accessible name.
- Colour contrast: 4.5:1 for body text, 3:1 for large text and UI boundaries —
  measured from the token values, written into `docs/DESIGN.md`, not eyeballed.
- Focus is never lost: opening a dialog moves focus in, closing returns it;
  tab panels have roving focus and correct roles; no keyboard trap without Esc.
- `prefers-reduced-motion: reduce` respected wherever there is animation.
- External links that open a new tab announce it (`rel="noopener"` plus text or
  an accessible hint).
- Automated checks catch maybe a third of this. The rest is the checklist above.

## 6. Performance budget (per page, enforced in CI where possible)

| Metric | Budget |
|---|---|
| Requests before first meaningful render | ≤ 12 |
| Critical CSS (render-blocking) | ≤ 60 KB uncompressed |
| JS shipped per page | ≤ 120 KB uncompressed, and never on a page that does not need it |
| Fonts | 0 third-party; ≤ 2 self-hosted files, `font-display: swap` |
| Images | lazy below the fold, explicit `width`/`height`, no image larger than needed |
| Largest data file fetched for one view | ≤ 500 KB; split or index it if bigger |
| Lighthouse (mobile, throttled) | Performance ≥ 90, Accessibility ≥ 95, Best-practices ≥ 95, SEO ≥ 95 |
| LCP on a mid-range Android over 4G | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |

Practical rules that get you there: no icon fonts, no CSS frameworks with
unused layers, no synchronous third-party scripts, no `@import` chains deeper
than two, no eager fetch of every data file on every page, and no
`document.write`.

## 7. Security and privacy by construction

- No secrets, tokens, keys, or private endpoints in the repo — a static site
  ships everything it contains.
- No `innerHTML` with user or data text: build nodes, or escape once in one
  helper. Tag-like text (code samples, `<name>` placeholders) must render as
  text.
- `rel="noopener noreferrer"` on every external `target="_blank"` link.
- Data stays on the device unless a recorded decision says otherwise. The
  privacy page lists every storage key and every network request the site makes.
- Third-party embeds are a privacy and availability cost: prefer a link over an
  iframe, and never an invisible pixel.
- A `mailto:` link is not a submission. Do not tell the user their message was
  "recorded" before their mail client opens.

## 8. SEO and shareability (only what is true)

- Unique `<title>` and description per page; canonical link; `lang` set.
- `sitemap.xml` and `robots.txt` generated or maintained from the real file
  list, not hand-guessed.
- Open Graph / Twitter tags use real screenshots and real descriptions.
- Structured data only when it describes visible content.
- No doorway pages, no keyword stuffing, no duplicated page variants for
  search. One page per real thing.

## 9. Testing pyramid for a static site

| Level | What | Where |
|---|---|---|
| Parse | every JS file compiles, every JSON parses, CSS braces balance | CI (stdlib) |
| Structure | local links resolve, no root-relative path, no duplicate ids, no empty asset, required head tags | CI (stdlib) |
| Accessibility | labels, landmarks, headings, alt text, contrast tokens | CI + human review |
| Behaviour | the flows a phase claims (quiz submit, resume, export, filter, offline reload) | manual script in the phase record |
| Device | one real phone pass at the deployed base path, once before launch | owner, recorded |

Nothing is "tested" because it "looks fine" in a preview screenshot.

## 10. Release engineering

- Deployment is a gate, not a step: `RULES.md` §GitHub authority.
- Before deploy: CI green, `site-checklist.md` read, privacy page current,
  LICENSE present, `SITE_LIST.md` updated only after the URL resolves.
- After deploy: verify the base path by hand — homepage, one nested page, one
  JSON fetch, one icon, service-worker registration, offline reload — and
  report each with the URL used.
- Rollback plan written before the deploy: usually "revert the merge and
  re-deploy", and the service-worker cache name must change or old clients keep
  the broken shell.

## 11. The phase-by-phase shortcut map

| Phase | Read |
|---|---|
| 0 bootstrap | §1, §2, [design-system.md](design-system.md) §2 |
| Offline/PWA | §4, `templates/pwa-checklist.md` |
| Data/content | §2 (one loader), §4 (data files) |
| UI polish | §3, §5, [design-system.md](design-system.md) |
| Performance | §6, §9 |
| Launch | §8, §10, `templates/site-checklist.md` |
