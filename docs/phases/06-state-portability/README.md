# Phase 6 — One state, notes and portability

**Status:** 🚧 implementation in progress · **Parts:** 6 · **Depends on:** 1, 3 · **Owner gates:** none

## Goal

Stop the site from keeping five private versions of the truth. One storage
module, one theme key, one reset that resets everything it lists, notes that
work where the content is, and a backup file a student can move to a new phone.

## Why now — the measured evidence

| Symptom | Evidence |
|---|---|
| Incompatible progress schemas across surfaces | dashboard reads namespaced `quizScores`; quiz writes `quiz-history` |
| Three theme keys | `diploma-3rd-sem-theme`, `theme`, `quiz-theme` |
| "Reset all" clears only part of the data | homepage reset handler touches its own namespace only |
| Notes never initialise on unit pages | `notes-tracker.js` is not loaded by any of the 24 unit pages |
| Local storage is the only store | `localStorage` used directly in 20 files; no `indexedDB` anywhere |
| No way to move data | no export/import of progress; only quiz export exists |

Storage cap context: `localStorage` is ~5 MiB per origin and synchronous; notes
and attempt history are the things most likely to hit it, and IndexedDB has a
disk-share quota. The migration in 6.6 is driven by measurement, not paranoia.

## Scope

- **In:** storage module + migration, theme/preferences, reset semantics, notes
  on unit pages, backup/restore, IndexedDB migration path.
- **Out:** backup of question content (it is already in the repo), cloud sync,
  accounts.

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 6.1 | Storage module | One API, one prefix, one schema version, migrate-on-read |
| 6.2 | Theme and preferences | No flash, no split keys, system preference honoured |
| 6.3 | Reset semantics | What the dialog lists is exactly what disappears |
| 6.4 | Notes that work | Notes save on all 24 unit pages, per section |
| 6.5 | Backup and restore | Round-trip: export → wipe → import → identical state |
| 6.6 | IndexedDB migration | Large stores survive the 5 MiB wall |

Details: [`tasks.md`](tasks.md).

## Done means

- Every `localStorage`/`sessionStorage` call in the repo goes through the module
  (grep-checked).
- One theme key, one pre-paint snippet, one persisted preference object.
- Reset: dialog enumerates stores with counts; after reset, every count is zero
  and the UI returns to a first-run state.
- Notes: type, reload, still there — on a unit page, on the practice page, and
  after a theme change.
- Backup: file contains schema version, timestamp, app version and all stores;
  import validates, shows a preview of what will change, and merges or replaces
  on an explicit choice.
- The storage estimate is shown in Settings/About, with the current usage.

## Risks

- A migration that runs twice can double history. Make it idempotent and guarded
  by a `migratedTo` marker.
- Importing an untrusted file is code execution risk if it is ever `eval`'d —
  parse with `JSON.parse`, validate shape, and never evaluate.
- Resetting everything is irreversible on a phone with no backup; require the
  confirm word or a second confirmation and point at 6.5.
