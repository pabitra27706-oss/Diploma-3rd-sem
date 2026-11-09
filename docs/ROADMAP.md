# Roadmap — Diploma 3rd Sem Study Hub

Bootstrapped from WebFlow @ `4bc8b0b` on 2026-11-06

> One phase = one chat (`rule.md` §4). A phase is one whole capability with
> 2–4 parts. Status: 📋 planned · 🚧 in progress · ✅ done · ❌ cancelled (keep
> the row). "Done means" always includes green checks and the `site-preview`
> artifact. Content phases are gated on owner verification — an agent may
> restructure, deduplicate, and flag, never invent an answer.

| # | Phase (parts) | Done means | Status |
|---|---|---|---|
| 0 | Bootstrap: playbook + rules + gate | `webflow/` playbook, root `rule.md`, `prompt.md`, `docs/{ROADMAP,DECISIONS,RESEARCH,DESIGN,AUDIT}.md`, `scripts/check_site.py`, CI workflow; baseline recorded (12 errors / 198 warnings) | ✅ |
| 1 | Deploy and PWA integrity | **1.1** every root-relative URL made base-safe (62 refs; bookmarks, suggestions, practice, quiz); **1.2** manifest `start_url`/`scope`/icons and `sw.js` precache correct under `/Diploma-3rd-sem/`; real icons replace 6 empty PNGs; **1.3** `info/contact.html` fixed, 7 repo-escaping `../../index.html` links fixed, missing sprite symbols `filter`/`save`/`shuffle`/`delete` added or replaced; **1.4** CI flips to `--strict`. | `check_site.py --strict` → 0 errors; JS/JSON/PYQ checks pass; preview shows the icon fix and the offline page; install + offline verified by the owner on a phone (recorded) | 📋 |
| 2 | Practice day-map and roadmap data | **2.1** a deterministic, difficulty-aware distribution of the 992 PYQs across practice days 1–10 (today all 992 are `practiceDay: 1`); **2.2** the roadmap page and practice page read one schema; **2.3** day pages render empty-state copy when a day is genuinely empty. | Every day 1–10 has a non-trivial set; the same question never appears twice in one day; counts on screen come from the data; `validate_pyq.py` PASS | 📋 |
| 3 | Quiz engine integrity | **3.1** autosave stores remaining time and resume restores it; `saved.config.subject` used correctly; failed subjects surfaced instead of silently dropped; empty-string answers do not count as answered; **3.2** marks options 3/5/7 exposed for the 68 matching records, `EXTRA` source selectable (163 records), empty years removed, CST207 handled honestly; **3.3** history null-score handling, export uses the selected `historyId`, retry keeps settings, review edits update history, "AI Eval" renamed to what it does. | Each flow reproducible from the repo; no `null` rendered as 0/0%; export matches the row you clicked; preview shows the corrected screens | 📋 |
| 4 | One state, one theme, working reset, notes | **4.1** one storage module + key prefix; dashboard, roadmap, practice share one progress schema (`quizScores` vs `quiz-history` today); **4.2** one theme key (`diploma-3rd-sem-theme` / `theme` / `quiz-theme` today) with a pre-paint script; **4.3** "Reset all" clears everything it claims to; **4.4** `notes-tracker.js` loaded on the 24 unit pages; exam-date rollover made explicit (currently rolls to 2027-01-15 at `assets/js/app.js:12`). | Reload keeps theme; progress visible on dashboard after a quiz; reset verified by grep + manual trace; notes persist on a unit page | 📋 |
| 5 | Truth, privacy, and repo docs | **5.1** feedback page stops implying submission (`mailto:` opens a mail app) and its type cards become keyboard-operable; **5.2** privacy page lists every storage key and network request (it currently says no personal information is stored while names, answers, and notes persist); **5.3** offline/zero-dependency claims corrected, Professional Hub's hard-coded "Active" status made live or removed, Font Awesome removed or self-hosted; **5.4** README rewritten against the shipped tree (no `_data/manifest.json`, no false counts), `LICENSE` created once the gate is answered. | Every claim on every page traceable to code or data; no "Coming soon" nav entries; README paths all exist | 📋 |
| 6 | Accessibility and metadata | **6.1** skip link, one `<main>`, and a meta description on every page (55/36/36 missing today); **6.2** heading order fixed on the 24 unit pages; labels for PYQ search and feedback, dialog/tab focus management, keyboard support in PYQ; **6.3** contrast tokens corrected (measured: tertiary text 2.54:1, quiz primary 4.28:1, white on success 2.54:1, white on danger 3.76:1), reduced-motion coverage extended beyond 5 of 19 CSS files; `docs/DESIGN.md` frozen. | Automated a11y checks clean; measured contrast in `DESIGN.md` ≥ 4.5/3:1; keyboard-only pass through search → quiz → result recorded | 📋 |
| 7 | Content integrity (owner-verified) | **7.1** 11 duplicate question groups collapsed or labelled; **7.2** declared counts computed (CST201 U1 46/53, U2 31/36; CST203 U3 42/55; CST205 U1 40/56) and unit titles aligned with Notes; **7.3** the 456 non-MCQ quiz items marked "no answer key" or given owner-verified keys (only 90 match a PYQ answer by text; use source ids); **7.4** 2026 papers represented in quiz banks, CST207 bank decision, CST205 Unit-5 tags and June-2022 Unit-1 mass-tagging reviewed. | Owner signs off each mapping; every displayed count equals the data; no item is graded without a key; `validate_pyq.py` PASS | 📋 |
| 8 | Performance, design system, launch prep | **8.1** practice stops fetching 5 registries + 30 papers sequentially (35 requests) — one index or parallel batch; **8.2** one token file replaces duplicated values across 19 CSS files; sitemap/robots/canonical added; budgets measured; **8.3** `site-checklist.md` green, rollback written, real-phone pass recorded, **stop before deploy**. | Lighthouse mobile ≥ 90 perf / 95 a11y; request budget met; checklist ticked with dates; deploy still unauthorized | 📋 |

## Sequence rules

- Phase 1 first: everything else is invisible to users until the site renders
  correctly at its real URL.
- Phase 7 needs the owner and a source; it can be held without blocking 3–6.
- Phases 3–4 touch the same state keys — do 4 after 3, or one chat if the
  changed files stay under ~8.
- No new content features until 1–6 are done.

## Held / cancelled (keep visible)

- Bookmark system and Study Tips pages — currently "Coming Soon" with empty CSS
  and JS files. Decision needed in Phase 5: finish or remove from navigation.
