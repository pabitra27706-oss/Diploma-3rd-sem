<!-- SPDX-License-Identifier: MIT -->

# Roadmap — [SITE]

Bootstrapped from WebFlow @ <sha> on <date>

> One phase = one chat (`rule.md` §4). A phase is a decent chunk: one whole
> capability, 2–4 parts listed in its `docs/phases/NN-<slug>.md` record. v1
> should be ~5–8 phases — past ~10 rows, phases are too small; merge them.
> Status: 📋 planned · 🚧 in progress · ✅ done · ❌ cancelled (keep the row).
> "Done means" always includes green CI whose **`site-preview` artifact** shows
> the phase's increment.

| # | Phase (2–4 parts) | Done means | Status |
|---|---|---|---|
| 0 | Bootstrap + shell | snapshot + plan docs + LICENSE + README + tokens frozen + CI green; `site-preview` shows the shell | 📋 |
| 1 | [core capability A] | [observable behavior]; preview shows [what] | 📋 |
| 2 | [core capability B] | [observable behavior]; preview shows [what] | 📋 |
| 3 | Offline + installability | manifest/icons/SW correct under the base path; offline reload works; preview shows the offline page | 📋 |
| 4 | [content/data phase] | [counts/links/mapping verified]; preview shows [what] | 📋 |
| 5 | Accessibility + metadata | skip link, one `<main>`, labels, focus, measured contrast on every page | 📋 |
| 6 | Polish + launch prep | checklist green, rollback written, stopped before deploy | 📋 |

## Held / cancelled (keep visible)

- [phase] — ❌ [why, date]
