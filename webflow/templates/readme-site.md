<!-- SPDX-License-Identifier: MIT -->

# [YOUR_SITE_NAME]

Bootstrapped from WebFlow @ <sha> on <date>

[One sentence: what the site is, who it helps, and the live URL.]

## What it does

- [Verified feature 1]
- [Verified feature 2]
- [Offline behaviour: what works with no network, and what does not]

## Live URL and install

- Site: [BASE_URL] (project Pages path or custom domain)
- Install: open in a modern browser → Add to Home screen / Install app
- Requires: no account, no sign-in, no app store

## Privacy and data

- Privacy page: [relative path]
- Stored on your device: [list the `localStorage` keys and what each holds, or
  "no data is stored"]
- Network requests after first load: [list them, or "none"]
- Third parties: [fonts, icons, embeds — or "none"]
- No ads, no payments, no analytics, no tracking.

## Content and accuracy

- Sources: [what the content is based on, with dates]
- Verified by: [owner / teacher / textbook edition — be specific]
- Not verified: [say plainly what is unchecked]

## Project layout

```text
index.html            # entry page
assets/css/           # token file + one CSS entry
assets/js/            # vanilla ES modules, one entry per page
_data/ or data/       # static JSON the pages fetch
manifest.json         # PWA manifest (base-path safe)
sw.js                 # service worker
offline.html          # offline fallback
docs/                 # ROADMAP, DECISIONS, DESIGN, RESEARCH, phases/
```

## Checks

There is no build step. The files are the artifact.

```sh
python3 scripts/check_site.py     # links, JSON, HTML/a11y basics, budgets
python3 scripts/validate_data.py  # if the repo ships one
```

CI runs the same checks and uploads a `site-preview` artifact.

## License and credits

- **Site license:** [MIT or GPL-3.0; replace this placeholder].
- **Third-party code and assets:** [link to notices and attribution].

Do not leave bracketed placeholders in a public site. Never add tokens,
credentials, or private user data to this repository.
