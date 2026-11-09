# Launch blockers — the ways a static site fails in public

> The web equivalent of "why apps get rejected": a checklist of failures that
> are easy to ship and expensive to discover. Each row names how to detect it
> before a public URL, and the rule that prevents it. Checked 2026-11-06.

## 1. Path and hosting failures (the most common)

| Failure | What the user sees | Detect | Prevent |
|---|---|---|---|
| Root-relative `/assets/...` under a project Pages path | Blank styling, missing icons | grep for `="/` and `url(/`; link check | Relative paths or one base-path helper (`RULES.md` law 13) |
| Case mismatch (`Assets/` vs `assets/`) | Works on the dev machine, 404 in production | link check with exact-case comparison | lowercase names, link check in CI |
| `start_url: "/"` and `scope: "/"` in the manifest | Installed app opens the domain root, outside the app | read the manifest; install on a phone | relative or base-prefixed `start_url`/`scope` |
| Precache list with a path that does not exist | Service worker install fails silently → no offline | run `cache.addAll` mentally against the file list; CI path check | precache only real files; test install |
| Missing service-worker registration | Never installable, never offline | read the entry page for `register(` | register with a base-relative path |
| Filenames with spaces or capitals | Random 404s | link check | kebab-case, ASCII |
| `404.html`/`offline.html` not at the served root | Broken fallback | check the deployed path | keep both at the site root |

## 2. PWA and offline failures

- Six manifest icons that are **zero-byte files** pass a file check and fail an
  install. Check size and PNG signature, and that `sizes` matches the pixels.
- A cache-first service worker with a version that never changes: users keep the
  old broken shell forever. Bump the cache name on every deploy that changes
  the shell.
- Claiming offline while loading fonts, icons, or data from a third-party host.
  If the network panel shows a request you do not control, the claim is false.
- No navigation fallback: an offline reload of a nested page shows the browser's
  own error, not your page.
- Caching everything on install: slow install, storage bloat. Cache the shell,
  then cache-on-use.

## 3. Truth failures (they cost trust, not uptime)

| Claim | When it is false | Fix |
|---|---|---|
| "100% offline" / "works without internet" | any runtime third-party request, or an uncached data file | make it true or reword |
| "No personal information is stored" | a name, answer, note, or progress is in `localStorage` | list the keys and the purpose |
| "Your feedback has been recorded" | it opens `mailto:` and nothing is sent | say "opens your email app" |
| "AI-powered" / "AI evaluation" | no model runs anywhere | say what actually happens |
| "Verified"/"official" content | nothing was verified against a source | drop it or name the source and date |
| A status pill that says "Active" | hard-coded string, not a live check | make it live or remove it |
| A counter or rating | placeholder numbers shipped as real | remove until real |

## 4. Content and data failures

- **Declared vs actual counts disagree** ("46 questions" over a 53-question
  unit). Count from the data, print from the count.
- **Duplicate reprints** inflate totals and double-count practice. Normalise and
  deduplicate, or label the duplicate.
- **Unanswerable items:** an exercise with no answer key that the UI presents as
  gradable. Mark it "no key" and exclude it from scoring.
- **Wrong unit mapping:** a question tagged Unit 5 in a four-unit subject, or a
  whole paper tagged Unit 1. Validate against the subject's unit list.
- **Empty categories offered in filters** ("2019", "All Subjects" with no
  questions). Derive filter options from the data.
- **Stale caches of content:** a JSON update that clients never see because the
  service worker served the old copy. Version the data URLs.
- **Unescaped data in `innerHTML`:** a question containing `<name>` disappears or
  breaks layout. Build nodes or escape in one helper.

## 5. Accessibility failures that block real users

- No skip link: a keyboard user tabs the entire navigation on every page.
- No `<main>`: screen-reader landmarks do nothing.
- Heading jumps and repeated `<h1>`s: navigation by heading is useless.
- Inputs with placeholder-as-label: the label disappears on typing.
- Icon-only buttons with no name: announced as "button".
- `outline: none` with no replacement: keyboard position is invisible.
- Contrast under 4.5:1 on body text or 3:1 on focus rings and UI boundaries.
- Colour-only meaning (difficulty dots, correct/incorrect states).
- A dialog that does not move or return focus, or a tab list without keyboard
  support.
- Animation with no `prefers-reduced-motion` branch.

## 6. Security and privacy failures

- A token or key committed in a JS file — a static site ships it to everyone.
- `target="_blank"` without `rel="noopener"`.
- An invisible tracking pixel or a "just analytics" snippet: both are gates.
- Third-party iframes that set cookies without disclosure.
- A `mailto:` address scraped and abused: expect spam, disclose it.

## 7. Repository hygiene failures

- No `LICENSE` → default all-rights-reserved, and nobody can reuse anything.
- README documenting files, features, or counts that do not exist (check every
  path and number mentioned).
- A stale planning dump kept as `prompt.md`, so the continuation prompt is
  unreadable.
- Empty placeholder files and half-finished features shipped as "Coming soon"
  in the navigation. Remove the entry or finish it.

## 8. Pre-launch detection script (must all return zero)

1. every local `href`/`src`/`url()` resolves, case-exactly;
2. every JSON parses; every data id is unique;
3. every page has `lang`, `<title>`, a description, one `<main>`, one `<h1>`;
4. every `img` has `alt` (or `alt=""` when decorative); every input has a label;
5. every manifest icon exists, is non-empty, and matches its declared size;
6. every sprite symbol referenced in HTML/SVG exists in the sprite;
7. no root-relative path unless the base path is `/`;
8. no third-party runtime request;
9. no claim listed in §3 without its evidence;
10. `LICENSE` and the privacy page exist and match the shipped behaviour.
