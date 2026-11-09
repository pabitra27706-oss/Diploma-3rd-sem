# Audit — 2026-11-06 baseline

> Read-only diagnosis of the repository at `4bc8b0b` (177 tracked files, 55 HTML
> pages, 20 standalone JS files, 55 JSON files). Every claim below was read from
> the tree or produced by a script; nothing was rendered in a browser. Use this
> as a **map**, not as truth: re-read the file before changing it (`rule.md` §4).
>
> Reproduce the measureable parts with:
> `python3 scripts/check_site.py` · `python3 scripts/validate_pyq.py` ·
> `node --check` per JS file · `json.loads` per JSON file.

## Limitations (state these in any phase record)

No Chromium/Chrome, no Playwright/Puppeteer/jsdom, no axe-core, no HTML
validator, and no device. Therefore **nothing here is a real-browser,
responsive-device, or screen-reader result.** Contrast figures are computed from
token values, not from rendered pixels. Runtime behaviour (service-worker
install, install prompt, focus order, tap targets) is inferred from code and
must be verified once on a real phone before launch.

## Severity 1 — the site is broken at its real URL

| Finding | Evidence |
|---|---|
| 62 root-relative references in four subsystems (`/assets/…`, `/manifest.json`, `/index.html`, `/quiz/index.html`) — they resolve to the domain root, not `/Diploma-3rd-sem/` | `check_site.py` warns; `bookmarks/index.html`, `suggestions/index.html`, `practice/*.html`, `quiz/*` |
| Manifest uses `start_url: "/"` and `scope: "/"` with root-relative icon `src`s | `manifest.json:5-90` |
| Service-worker precache and fallback are root-relative (`cache.addAll` over `/…` paths), so install can reject and offline never works under the subpath | `sw.js:7-30` (registration itself exists at `index.html:507-512`) |
| Six PWA icon files are 0 bytes | `assets/pwa/icon-*.png`; `check_site.py` empty-file list |
| `index.html:458` links `info/contact.html`, which does not exist | `check_site.py` error |
| Seven Info pages link `../../index.html`, escaping the repository root | `info/about.html`, `credits`, `professional-hub`, `send-feedback`, `terms-conditions`, `usage-guide` (+ one more) |
| Four icon references point at symbols that do not exist in the sprite: `filter`, `save`, `shuffle`, `delete` | `practice/index.html`, `practice/session.html`; `assets/icons/sprite.svg` symbol list |
| Font Awesome loaded from a CDN on 38 pages — a third-party runtime request that contradicts the offline claim | grep across HTML |

## Severity 2 — the product does not do what it says

**Practice / roadmap.** All **992** PYQs carry `practiceDay: 1`; days 2–10 hold
zero questions. Difficulty split is 711 easy / 228 medium / 53 hard. Practice
fetches five registries plus thirty paper files — **35 requests, largely
sequential** — before it can render.

**Quiz engine.** Autosave omits remaining time and resume restores the full
duration. Resume describes a single-subject quiz as "All Subjects" (reads
`saved.subject`, not `saved.config.subject`). A failed subject fetch silently
becomes an empty bank. CST207 is selectable with no question bank. Marks options
omit 3/5/7 although 68 records match those marks. The source filter hides the
163 `EXTRA` records; 2019/2020 are offered with no questions. Clearing a typed
answer leaves an empty-string key that still counts as answered.

**Quiz history and export.** All-types history maps `null` score to 0 and paints
it as poor, and treats unanswered as wrong (`quiz/js/result.js:107-167`); an MCQ
"incorrect" count adds wrong + blank. Export always loads the current
`quiz-result` rather than the selected `historyId` (`quiz/js/export.js:94`), so
exporting from history exports the wrong quiz. Retry regenerates from
configuration instead of the stored ids, and "reshuffled" and "fresh" are
effectively the same. Review edits never update history. "AI Eval" exposes only
external export prompts — no evaluation happens.

**State.** Dashboard, roadmap, and practice use incompatible progress keys and
schemas. The homepage reads namespaced `quizScores` while the quiz writes
`quiz-history`. Themes are split across `diploma-3rd-sem-theme`, `theme`, and
`quiz-theme`. "Reset all" clears only the homepage's namespaced keys. All 24
unit pages omit `notes-tracker.js`, so Notes never initialises there. The exam
date rolls to 2027-01-15 at `assets/js/app.js:12`, with mixed UTC/local
handling.

**Content.** Declared quiz counts disagree with actual: CST201 U1 46/53, U2
31/36; CST203 U3 42/55; CST205 U1 40/56. All **456** non-MCQ quiz items have no
answer, model answer, or explanation; only 90 match a PYQ answer by normalised
subject + question text, so mapping must use source ids. Eleven exact semantic
duplicate groups (22 records) exist. CST201's quiz maps U3=Functions/U4=Arrays
while Notes map U3=Arrays/U4=Functions. No quiz bank contains a 2026 question
although 120 January-2026 PYQs exist. CST205 carries four Unit-5 questions
despite four declared units; the June-2022 papers tag 320/321 questions as
Unit 1. CST203 P002/P003 and CST209 P002/P003 are duplicate reprints (68 excess
records). PYQ search inserts unescaped question text into `innerHTML`
(`pyq/js/answers.js:1256-1264`), so tag-like code breaks and markup can truncate.
Viewing a theory answer counts it as answered, inflating topic percentages.

## Severity 3 — trust and hygiene

- Feedback says the message was "recorded" before opening `mailto:`; its type
  cards are mouse-only with a global `event` dependency.
- The privacy page says no personal information or names are stored while name,
  answers, and notes persist locally.
- Offline/zero-dependency claims conflict with runtime caching and the Font
  Awesome CDN. Professional Hub hard-codes an "Active" status.
- README: 23 code fences (unbalanced), documents `_data/manifest.json` which
  does not exist, and shows a `LICENSE` badge for a missing file.
- Nine empty files: six PWA icons, `bookmarks` CSS + JS, and `nothing`.
- Bookmarks and Study Tips are "Coming soon" placeholders still in navigation.

## Severity 4 — accessibility and design

- **55/55** pages have no skip link; **36/55** have no `<main>`; **36/55** have
  no meta description. All 24 unit pages have heading-order jumps.
- PYQ search and feedback fields lack labels; PYQ keyboard semantics and the quiz
  dialog/tab focus behaviour are incomplete.
- Reduced-motion support exists in 5 of 19 CSS files.
- Measured contrast from tokens: tertiary text ≈ 2.54–2.56:1, quiz primary
  ≈ 4.28:1, white on success ≈ 2.54:1, white on danger ≈ 3.76:1.
- `color-mix()` and `:has()` are used without fallbacks while the docs claim
  older-browser support; there is no single token file, and design/navigation/
  theme systems are disconnected.

## What is actually healthy

JSON parses everywhere; all 30 PYQ papers pass `scripts/validate_pyq.py` (992
records, unique ids); all 416 quiz MCQs have four options, a `correct` index,
and a non-empty explanation; all 992 PYQs have answers; the five
`assets/icons/*.png` files are valid; CSS braces balance and `url()` targets
resolve; service-worker registration exists; the homepage escapes names with
`_escapeHtml`, practice presets with `esc`, and notes use `textContent`.
