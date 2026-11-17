# Phase 6 — Engineering record

Status: **🚧 implemented and gate-verified on
`arena/be90e07e-diploma-3rd-sem` (2026-11-17). Not merged, no owner device pass
yet.** Nothing here is a new answer certification and no claim is made about
Safari storage eviction or real-phone download behaviour.

Offline worker `VERSION` moved to `study-2026-11-17b` so a returning browser
drops the Phase 5 cache and picks up the new storage/preference code.

Most of the boundary already existed on `main` (module, journal, registry,
backup, Settings UI, notes on unit pages). This phase closed the remaining gaps:
one theme code path everywhere, notes on practice and quiz review, the
IndexedDB recovery mirror, a reset dialog that names live counts, tests for all
of it, and the documentation of what is *not* done.

## 6.1 — Storage module

`assets/js/storage.js` is the only file that touches `localStorage`:

```sh
grep -rn "localStorage" --include='*.js' --include='*.html' . | grep -v storage.js
```

No file calls the API. What the grep still prints is text, not code:

- `assets/js/study-store.js:20`, `assets/js/section-notes.js:6`,
  `assets/js/settings.js:15` — comments;
- `assets/js/settings.js:21` — a user-facing status string
  ("records rely on localStorage only");
- `info/privacy-policy.html` — the privacy prose that has to name the store to be
  accurate.

The boundary itself is unchanged in intent: the only place that reads or writes
the browser store is `assets/js/storage.js`.

- Prefix `d3s:`, schema marker `d3s:schema` (`{version:1,migratedTo:'d3s:'}`),
  restore journal `d3s:restore-journal`, one preference record `d3s:prefs`.
- `migrate()` now returns `{version, migratedTo, migratedKeys}`; the marker is
  rewritten on every run and no key is duplicated, so a second run is a no-op.
- Legacy reads (`theme`, `quiz-theme`, `diploma-3rd-sem-theme`, `quiz-history`,
  `quizScores`, `practice-*`, `bookmarks`, `disclaimerAccepted`, notes keys) move
  on read and the old key is removed only after the namespaced copy verifies.
- Quota: a `QuotaExceededError` becomes a human message on `study-storage-error`
  and the write is reported as not saved; `tests/storage.cjs` still asserts the
  previous value survives a failed write.

## 6.2 — Theme and preferences

One record owns every reading preference:
`{theme:'system'|'light'|'dark', fontScale, lineHeight, contrast, lang, reduceMotion}`.

- Pre-paint: `storage.js` is loaded synchronously in `<head>` before any
  stylesheet on all 68 shipped pages (verified), and its last statement calls
  `applyPreferences()` at script evaluation. `data-theme` (and the CSS custom
  properties for text size, line height, contrast, motion, language) therefore
  exist before first paint; a first visit writes nothing just to paint.
- `prefers-color-scheme` is followed with a `change` listener while the choice is
  `system`; an explicit choice ignores the OS.
- Every legacy theme call site now uses `StudyStorage.theme()` /
  `StudyStorage.setTheme()`: `assets/js/theme.js`, `practice/js/{index,session}.js`,
  `pyq/js/{index,viewer,answers}.js`, `pyq/select.html`, `roadmap/index.js`,
  `quiz/js/common.js`, `subjects/units-com/common.js`. `adoptLegacyTheme()`
  collapses the three old scalar keys into `d3s:prefs` and deletes them, so only
  one theme key can exist.
- Evidence: `tests/preferences.cjs` (synchronous pre-paint attribute, system
  listener, explicit choice, one key after migration, CSS properties) and
  `tests/storage.cjs`.

## 6.3 — Reset semantics

- The Settings dialog labels every choice from the module's registry with live
  counts, `"<name> — N records, ~M bytes"`, recomputed from `storage.estimate()`
  on every render; entering the dialog and clearing therefore cannot disagree.
- `clearGroup('progress'|'notes'|'preferences'|'everything')`; `everything` needs
  the word `RESET`, also clears `d3s:session:*` markers and the device mirror,
  repaints the page with the system theme and dispatches `study-storage-cleared`.
- Evidence: `tests/preferences.cjs` — group counts add up to the registry, each
  group clears only its own keys, `everything` leaves no `d3s:` record, and the
  page repaints into a first-run look without a reload.

## 6.4 — Notes that work

`assets/js/section-notes.js` is now one shared widget (`SectionNotes.mount`,
`mountAfter`, `flush`, `keyFor`) instead of a unit-page-only script:

| Surface | Key | Mount point |
|---|---|---|
| 24 unit pages | `section-note:<subject>/units/unit-N.html#section-K` | after each `.section-title` |
| practice session | `section-note:practice/<questionId>` | appended to the question card, one per question |
| quiz review | `section-note:quiz-review/<questionId>` | appended to each review card |

- Records are `{text, updatedAt, title, url}`; the textarea value is stored
  verbatim, so typed markup stays literal text. 400 ms debounce, save on blur,
  flush on `pagehide`/`visibilitychange`, and `SectionNotes.flush()` before the
  practice or review host re-renders a card.
- Keyboard/SR: `<summary>` names the note, a `<label for>` and an
  `aria-describedby` role=status line announce "Saving…"/"Saved on this device",
  Escape leaves the field, "Clear this note" is a labelled button.
- Auto-mount stays limited to unit pages (`/subjects/<x>/units/`), so the widget
  never appears twice on the practice or review page.
- Notes are ordinary `d3s:` records: they appear in `storage.backup()` and in the
  Settings import preview (`notes` count) with no extra code path.
- Evidence: `tests/section-notes.cjs` (static audit of all 24 unit pages and both
  page scripts, plus a deterministic DOM run: debounce, verbatim text, reload,
  flush-before-rerender, clear, unit key shape, no auto-mount elsewhere).

## 6.5 — Backup and restore

Envelope unchanged and extended, not replaced:
`{app:'diploma-3rd-sem', schemaVersion:1, appVersion, exportedAt, stores}`.
`appVersion` comes from `<meta name="app-build">` (now `study-2026-11-17b`), and
`validate()` accepts but does not require it, so older files still import.

- Export: download plus copy-to-clipboard/text-area fallback; still works at full
  quota because it normalizes names without writing, and returns journal
  originals while a recovery is pending.
- Import: size cap (5 MiB), depth cap (60), key whitelist, `JSON.parse` only, no
  `eval`; preview counts attempts/notes/cards; merge or replace; preferences only
  with the explicit checkbox.
- Merge: attempts union by `historyId`/record id, notes newest-wins by
  `updatedAt`, conflicting non-arrays stay local.
- Evidence: `tests/storage.cjs` (merge, idempotent re-import, rejection messages,
  quota) and `tests/storage-recovery.cjs` (rollback, retained journal, explicit
  preference consent, replace without resurrecting deleted records).

## 6.6 — IndexedDB — delivered as a recovery mirror, not a primary store

Stated plainly because the phase text asked for a swap:

- **What is implemented.** Every successful write and deletion through the module
  is mirrored into IndexedDB (`d3s-store` / `records`) through a serialized
  promise chain; `hydrate()` rebuilds an origin only when no recognised record
  survives, so a deliberate reset is never resurrected; `clearMirror()` and the
  `everything` reset delete the mirror; `idbStatus()` reports
  `{available, state, threshold, bytes, records, largeMode, primary:'localStorage',
  mode:'mirror:standard'|'mirror:large', persisted}` and never claims IndexedDB is
  the primary store. After load, `bootMirror()` seeds the mirror from existing
  records and rebuilds an empty origin, dispatching `study-storage-hydrated`.
- **Threshold.** `IDB_THRESHOLD = 1.5 MiB` of estimated records. Above it the
  module reports `mode:'mirror:large'`; behaviour is unchanged, because reads are
  synchronous and localStorage-first by design.
- **Why not a swap.** ~20 call sites read storage synchronously during render.
  Moving the primary path to IndexedDB means an async render pipeline across
  practice, quiz, cards, Today and Settings — a larger change with a real risk of
  losing student work mid-session, which is the exact risk this phase exists to
  remove. The mirror buys the recovery property (eviction, private mode, quota
  pressure) without that risk. **Acceptance item 6.6-3 is therefore partially met
  and recorded as such.**
- **Fallback.** Without `indexedDB` (private mode, old browser) everything works
  through localStorage and `idbStatus()` says `available:false`; `hydrate()`
  returns a reason string instead of throwing.
- **Persistence.** `navigator.storage.persist()` is requested only from the
  Settings button and reported as granted/not granted/not reported — no claim that
  the browser keeps data.
- **Usage measurement.** `navigator.storage.estimate()` is shown in Settings, with
  the honest note that browser usage includes caches. No on-device number is
  recorded in this document: the sandbox has no real browser profile, so the only
  measurement here is the module's own byte estimate.
- Evidence: `tests/storage-mirror.cjs` — an in-memory IndexedDB shim proves
  mirroring, deletion, eviction recovery, no resurrection after a reset, the
  threshold branch (forced to 0) end to end, the no-IndexedDB fallback and honest
  `persisted` reporting.

## Settings surface

`settings.html` / `assets/js/settings.js` now show, besides the estimates and
group counts: primary store, device-mirror state and mode, threshold, record and
byte totals, and persistence status, with "Rebuild from device mirror" and
"Forget device mirror" actions. `info/privacy-policy.html` discloses the mirror
and that clearing everything deletes it.

## Gates run (2026-11-17)

| Gate | Result |
|---|---|
| `grep -rn "localStorage" --include='*.js' --include='*.html' . \| grep -v storage.js` | no API calls; comments, one status string, one privacy-policy sentence |
| `python3 scripts/check_site.py --strict --quiet` | 0 errors, 28 warnings (baseline) |
| `python3 scripts/check_platform.py` | 0 errors |
| `python3 scripts/validate_pyq.py` | PASS, 28 papers / 924 questions |
| `python3 scripts/check_pyq_integrity.py` | 0 changed/added/missing |
| `python3 scripts/validate_data.py --check-baseline` | matches ledger (not a strict pass) |
| `python3 -m unittest discover -s tests -p 'test_*.py'` | 22 tests OK |
| Node suites | attempt-store, data-pipeline-consumers, discovery-dom, preferences, quiz-engine-dom, section-notes, storage, storage-mirror, storage-recovery, study-dom, study-offline, study-store all pass |

Not run here: `tests/paper-offline.cjs`, `tests/cards-offline.cjs`,
`tests/*-browser.cjs` (need Playwright/Chromium, absent). `validate_data.py
--strict` and `validate_syllabus.py --strict` keep their recorded source-review
findings.

## Left open

- Owner device pass: type notes on three unit pages and on practice, switch
  themes, export → clear → import on a phone; confirm the download and copy
  fallbacks there.
- No measurement of real eviction behaviour, private-mode IDB availability or
  Safari quota behaviour — the record says so instead of guessing.
- If a future phase needs IndexedDB as the primary store, it needs an async render
  contract first; the mirror adapter and `idbStatus()` are the seam for that.
