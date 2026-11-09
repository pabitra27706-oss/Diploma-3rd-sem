<!-- SPDX-License-Identifier: MIT -->

# PWA checklist — [SITE]

A project Pages site lives at `https://<user>.github.io/<repo>/`, so every PWA
path must be relative to `/<repo>/`. This is the single most common reason a
"working" PWA is broken in production.

## Manifest

- [ ] `name` and `short_name` are the real product name.
- [ ] `start_url` is `"./"` or `"/<repo>/"` — never `"/"` on project Pages.
- [ ] `scope` is `"/<repo>/"` (or omitted, so it defaults to the manifest's
      directory).
- [ ] `display: "standalone"`, `background_color`, `theme_color` match the
      frozen tokens.
- [ ] `icons` include 192 and 512 PNGs, each non-empty, with correct `sizes`
      and `type`, `purpose` stated.
- [ ] `id` (optional) is stable.
- [ ] No shortcut points outside the scope.
- [ ] Manifest is linked from every page (`<link rel="manifest">`).

## Service worker

- [ ] Registered with a relative URL (`./sw.js`) so the scope is the site root.
- [ ] `install` precaches only files that exist; a missing file must not abort
      install (verify each path with the link checker).
- [ ] Cache name carries a version and is bumped on shell changes.
- [ ] `activate` deletes old caches and calls `clients.claim()`.
- [ ] Navigation requests fall back to `offline.html`.
- [ ] Data requests use stale-while-revalidate; content updates are reachable.
- [ ] No `console.log` noise left in production paths.

## Offline behaviour

- [ ] First load with network, then airplane mode: reload works.
- [ ] Nested page works offline (or shows `offline.html`, not the browser error).
- [ ] Core content is offline-capable; anything not cached says so.
- [ ] The site never claims "offline" while requesting a third-party asset.

## Install and launch

- [ ] Install prompt or Add-to-Home-screen works on Android Chrome.
- [ ] Launch opens the app root, in scope, with the right title and theme.
- [ ] iOS: `apple-touch-icon` present; standalone launch looks correct.
- [ ] Updated deploy is picked up (new cache name) without a manual cache clear.

## Verification to record

Write the result in the phase record: device, browser version, URL used, what
was offline, and what failed.
