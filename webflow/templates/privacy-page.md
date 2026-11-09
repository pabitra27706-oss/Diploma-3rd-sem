<!-- SPDX-License-Identifier: MIT -->

# Privacy page — [SITE]

> Copy into the site as `info/privacy.html` (or the site's own path) and keep it
> **true of the shipped build**. Every key listed here must exist in the code,
> and every key in the code must be listed here. If a claim cannot be verified
> from the repository, delete the claim.

## Shape of the page (use these headings)

1. **The short version** — 3 bullets, plain language.
2. **What is stored on your device** — a table: key, what it holds, why, when it
   is cleared.
3. **What is sent over the network** — a list: request, when it happens, to
   whom, what it contains.
4. **What is never collected** — only list things you can prove.
5. **Children and students** — say plainly if the site is aimed at students and
   what that means for data.
6. **Your controls** — how to clear the stored data (the in-site reset, plus
   browser instructions).
7. **Contact** — a real, working route, and what happens to a message.
8. **Changes** — date of last change and what changed.

## Required content for a localStorage-only static site

```text
This site stores information in your browser on your device (localStorage).
It is not sent to a server. There is no account and no analytics.

Stored keys:
- <key-prefix>:theme — your light/dark choice.
- <key-prefix>:progress — which questions you have answered, per subject.
- <key-prefix>:notes — any notes you type. They stay on this device.
- ... (one row per key, no exceptions)

Network requests:
- The site's own HTML, CSS, JS, JSON, icons, and manifest, served from
  <host>/<repo>/.
- Nothing else. No fonts, icons, images, ads, or scripts from another domain.

Cleared when: you use "Reset all data" on this site, or clear site data in your
browser. Uninstalling the app or clearing storage removes everything.
```

## Claims that need evidence (do not ship without it)

| Phrase | Needs |
|---|---|
| "no personal information" | a verified list of stored keys and no network submission |
| "works offline" | an offline test result in `docs/phases/` |
| "no tracking" | no third-party request and no analytics snippet in the tree |
| "your data never leaves your device" | no form POST, no `fetch` with a body, no `mailto:` prefill that includes it |
| "we do not share data" | nothing to share — true only if the two above are true |

## Tone rules

- Say what happens, not what is "respected" or "committed to".
- No legal boilerplate you did not read.
- A `mailto:` link is described as "opens your email app" — never "submitted".
- If a feature was removed, remove its claims the same day.
