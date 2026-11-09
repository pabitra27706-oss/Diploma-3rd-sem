# Quality without a device — prove it in CI, not by tapping

> The phone-first rule means the agent usually cannot open a browser, run a dev
> server, or install a headless engine. That is a constraint on *how* quality is
> proven, not permission to ship unverified work. CI is the executor of record;
> the owner's phone is a final look, not the test suite.

## 1. The no-device gate (every phase, in CI)

Run all of these on the real tree, on every push. The first four need nothing
but `python3`/`node`:

| Check | Catches | Blocking? |
|---|---|---|
| `node --check` on every `.js` (or `--input-type=module` for ES modules) | syntax errors that kill a page | yes |
| JSON parse on every `.json` (and unique-id check on data) | a trailing comma that empties a registry | yes |
| Local link/asset resolution (`href`, `src`, `url()`, `fetch()` paths) | 404s, wrong case, root-relative paths under a subpath | yes |
| HTML structure: `lang`, `<title>`, description, one `<main>`, one `<h1>`, no duplicate ids, no empty file | the defects that make a page unusable or unindexable | yes once baseline is clean |
| Accessibility basics: `img` alt, input labels, button names, `target=_blank` rel, sprite symbol references resolve | the defects a keyboard/screen-reader user hits first | yes once baseline is clean |
| CSS: brace balance, undefined token usage, `url()` targets exist | silently broken styling | yes |
| Budgets: per-page JS/CSS bytes, request count, largest data file | silent bloat | reported, then blocking |
| Lighthouse (CI only, chromium available there) | real performance/a11y scores | reported from phase 2 |

Rules:

- The gate runs on the **repository as it will be served**, not a build output.
- A check that cannot run must be named as not-run in the phase record. A phase
  does not pass on "checks could not run".
- Baseline debt is allowed only as a **recorded, shrinking number** in the
  phase record ("14 root-relative paths, down from 88") — never as a permanent
  excuse to disable a check.
- The workflow uploads a `site-preview` artifact: the served files plus
  `screenshots/` of changed pages. That is what "visible progress" means here.

## 2. Fast to build — the speed rules

- No build step: what you commit is what is served. Nothing to compile, nothing
  to cache wrong.
- One CSS entry, one JS entry per page, data fetched lazily by the view that
  needs it.
- Check in small increments: run the stdlib checks locally before pushing; they
  take seconds.
- Never wait on a dev server you cannot see. Verify from the files and from CI
  output.
- Keep the workflow under ~3 minutes: no browser matrix, no per-page Lighthouse
  runs. One mobile Lighthouse pass on the homepage plus the heaviest page.

## 3. The honest remainder — one short real-phone pass, once

Automation does not prove: touch ergonomics, real keyboard behaviour on iOS,
installed-PWA launch, offline reload, scroll performance on a low-end device,
or whether the content reads clearly.

So, exactly once before a public URL (and after any change to the shell, the
service worker, or navigation):

1. Open the deployed base path on the real phone.
2. Homepage → one nested page → back.
3. Toggle theme; reload; confirm it persisted.
4. Airplane mode; reload; navigate two levels; confirm the offline page and
   the cached content.
5. Install/Add to Home screen; launch; confirm it opens in-scope, not at `/`.
6. Rotate, raise system font size, and tab through one form with a keyboard if
   available.
7. Write down what failed; file it as a fix chat.

## 4. What "good enough" means (so nobody moves it)

A phase is done when:

- every part in its roadmap row works on the shipped files;
- the no-device gate is green (or its remaining failures are named, counted,
  and scheduled);
- the phase record states what the preview shows and what was **not** verified;
- accessibility and budget numbers are reported, not asserted;
- `prompt.md`, the roadmap row, and the phase record are updated in the same
  commit.

Not required: pixel perfection, a full device matrix, or a preview the owner
has to click before the phase can close.
