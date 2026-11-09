<!-- SPDX-License-Identifier: MIT -->

# Pre-launch checklist — [SITE]

Any unchecked item blocks a public URL. Keep it in the repo (`docs/` or root as
`CHECKLIST.md`) and tick with dates.

## 1. Plan and paper

- [ ] Plan chat exit gate answered and recorded in `docs/DECISIONS.md` with dates.
- [ ] `rule.md`, `prompt.md`, `docs/`, `README.md` committed before site code.
- [ ] `LICENSE` present at the site root (MIT or GPL-3.0).
- [ ] Base path recorded (`/[repo]/` or domain) and no file assumes another.
- [ ] Kill test written in `docs/RESEARCH.md` **before** launch numbers exist.

## 2. Correctness

- [ ] Every internal link and asset resolves under the deployed base path.
- [ ] No root-relative `/assets/...` or `/_data/...` unless base is `/`.
- [ ] Every JSON file parses; ids are unique; declared counts match actual.
- [ ] Every number on a page is computed from data, not typed.
- [ ] Empty, loading, error, and offline states exist on every data view.

## 3. Installability and offline

- [ ] `manifest.json`: `name`, `short_name`, `start_url`, `scope`, `display`,
      `theme_color`, `background_color`, and icons that exist and match sizes.
- [ ] No zero-byte icon; each PNG signature is real.
- [ ] `sw.js` registers from the deployed path and its precache list is real.
- [ ] `offline.html` exists and is served for offline navigations.
- [ ] Manual: load → airplane mode → reload → navigate two levels → works.
- [ ] Cache version bumped vs the previous deploy.

## 4. Accessibility

- [ ] Skip link first in tab order; one `<main>`; one `<h1>`; heading order sane.
- [ ] Every page has `lang`, a unique `<title>`, and a meta description.
- [ ] All inputs labelled; all images have useful `alt` or `alt=""`.
- [ ] Icon-only buttons have accessible names; every dialog moves/returns focus.
- [ ] Contrast measured: body ≥ 4.5:1, large text/UI ≥ 3:1, focus ring ≥ 3:1.
- [ ] Focus visible everywhere; no keyboard traps; Escape closes overlays.
- [ ] `prefers-reduced-motion` honoured; nothing animates indefinitely.
- [ ] Works at 200% text zoom and 320 px width without horizontal scroll.
- [ ] Tabs/search/filters operable by keyboard; tab state in the URL.

## 5. Truth and privacy

- [ ] Privacy page lists every `localStorage`/`sessionStorage` key and purpose.
- [ ] Privacy page lists every network request the site makes.
- [ ] "Offline" claim tested and true; no third-party runtime request remains.
- [ ] No "AI", "verified", "guaranteed", "official" claim without evidence.
- [ ] Contact route is honest (a `mailto:` is not a submission).
- [ ] No placeholder counters, ratings, or hard-coded status pills.

## 6. Performance

- [ ] ≤ 12 requests before first meaningful render on a data page.
- [ ] JS per page within budget; nothing loaded on pages that do not need it.
- [ ] No icon font, no font CDN, no framework layer nobody uses.
- [ ] Images have dimensions and lazy-load below the fold.
- [ ] One mobile Lighthouse pass recorded (perf ≥ 90, a11y ≥ 95).

## 7. Repo hygiene

- [ ] No secrets, tokens, or private data anywhere in history-visible files.
- [ ] No empty placeholder files or half-features linked from navigation.
- [ ] README matches the shipped site (paths, features, counts, URL).
- [ ] `SITE_LIST.md` row updated only after the URL actually resolves.
- [ ] Rollback written: revert the merge, bump the cache version, re-deploy.

## 8. Real-phone pass (once, recorded)

- [ ] Homepage → nested page → back, on the deployed URL.
- [ ] Theme toggle + reload (persisted, no flash).
- [ ] Airplane mode reload and two-level navigation.
- [ ] Add to Home screen → launch in scope, not at `/`.
- [ ] Rotate + system font scale increase + one form with a keyboard.
- [ ] Written result in `docs/phases/` with device, browser, and date.
