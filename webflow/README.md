# WebFlow — phone-first indie web playbook

One source of truth for a phone-first Indian indie developer shipping
**static, offline-first websites** — plain HTML/CSS/JS, GitHub Pages, no
backend, no build step, no ads, no trackers.

Adapted from [AppFlow](https://github.com/pabi277/AppFlow) (Android/Play
playbook) with every store, SDK, Gradle, APK and AdMob rule replaced by its web
equivalent. Nothing Android-specific survives here: no `targetSdk`, no Play
Console, no signing keys, no rewarded ads, no ad-free IAP.

Build on a phone with CodeC and an AI agent; use GitHub Actions as the
checking machine. Keep sites small, offline-first, distinct, respectful, and
time-boxed to four weeks.

Every new site starts from a pinned WebFlow commit — not from site code.
Bootstrap: start each new site with [common-prompt.md](common-prompt.md) (once
per site), then use [START.md](START.md); log official live URLs in
[SITE_LIST.md](SITE_LIST.md).

Read [PURPOSE](PURPOSE.md), [RULES](RULES.md) (15 laws, approval/identity),
[PLAN](PLAN.md) (plan-only first chat; ask less, gate always), and
[PROMPTS](PROMPTS.md).

Build reuse-first: [knowledge/reuse-first.md](knowledge/reuse-first.md)
(research open source before building anything), the verified catalogue in
[knowledge/web-references.md](knowledge/web-references.md), and the best-way
build reference
[knowledge/web-engineering.md](knowledge/web-engineering.md), plus
[knowledge/quality-without-a-device.md](knowledge/quality-without-a-device.md)
(quality proven in CI without a browser on your phone, and the next-chat
prompt printed in chat at every phase end).

Design tokens before screens:
[knowledge/design-system.md](knowledge/design-system.md). Validate a niche
with [knowledge/niche-method.md](knowledge/niche-method.md). Read
[knowledge/launch-blockers.md](knowledge/launch-blockers.md) before a public
URL goes out.

Review quarterly; see [MAINTENANCE.md](MAINTENANCE.md) for upkeep.

Prose outside `templates/`: CC BY 4.0; `templates/`: MIT (see [LICENSE](LICENSE)).

## The one-screen summary

| Question | Answer |
|---|---|
| What ships? | A static site/PWA on a public URL (GitHub Pages) |
| What builds it? | Nothing — files are served as written |
| What proves it? | CI: parse checks, link check, HTML/a11y lint, budgets, artifact |
| What is the visible increment? | The `site-preview` artifact **and** the live URL you approve in chat |
| What is forbidden by default? | Backend, login, analytics, ads, trackers, runtime framework |
| What is the approval gate? | Every deploy, publish, PR, merge, and recorded-decision change |
| When is it done? | Green CI + phase record + roadmap row + `prompt.md` + next-chat prompt in chat |

## What is in here

```text
README.md PURPOSE.md RULES.md PLAN.md START.md PROMPTS.md
common-prompt.md MAINTENANCE.md SITE_LIST.md LICENSE
knowledge/   reuse-first · web-engineering · quality-without-a-device
             design-system · web-references · niche-method · launch-blockers
templates/   rule-site · prompt-site · readme-site · next-chat-prompt
             ci-web.yml · site-checklist · privacy-page · pwa-checklist
             scripts/check_site.py        (the stdlib gate)
             docs-system/ RESEARCH · ROADMAP · DECISIONS · PHASE_RECORD · DESIGN
```

The gate is executable, not aspirational: `python3
templates/scripts/check_site.py --strict` is the same check CI runs, and it
needs nothing but the Python standard library — so it runs on a phone.

## What changed from AppFlow

| AppFlow (Android) | WebFlow (web) |
|---|---|
| Google Play listing, package ID | Live URL + repo; no store |
| `targetSdk` / API level policy | Browser support floor + feature fallbacks |
| Gradle, AGP, JDK, signed AAB | No build step; static files, optional CI linting |
| `app-progress-apk` artifact | `site-preview` artifact + live preview URL |
| AdMob, billing, ad-free IAP | Removed entirely — no ads, payments, or trackers |
| Robolectric / Paparazzi / lint | html/a11y lint, link check, JSON parse, Lighthouse budgets |
| Data Safety form | Truthful in-site privacy page + storage disclosure |
| Play rejection risks | [Launch blockers](knowledge/launch-blockers.md) (subpath 404s, empty PWA icons, false claims) |
| Device pass before release | Real-device phone pass once, before the public URL |
