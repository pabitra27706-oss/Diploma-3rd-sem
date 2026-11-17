# Phase 6 — Tasks

Storage is the most dangerous surface in this repo: it holds a student's work
and it is invisible. Every part here is measured before and after.

## 6.1 — Storage module

**Steps**
1. Create `assets/js/storage.js` with one API:
   `get(key, fallback)`, `set(key, value)`, `remove(key)`, `keys(prefix)`,
   `clearAll()`, `estimate()`, `migrate()`.
2. Namespace and version everything: prefix `d3s:`, a `schema` record, and a
   `migratedTo` marker.
3. Migrate legacy keys on first read: `theme`, `quiz-theme`,
   `diploma-3rd-sem-theme`, `quizScores`, `quiz-history`, `practice-bookmarks`,
   `practice-presets`, `practice-day-*`, `bookmarks`, `disclaimerAccepted`,
   notes keys.
4. Handle quota: catch `QuotaExceededError`, surface a human message, never lose
   the write silently.
5. Delete every direct `localStorage` call outside the module.

**Acceptance:** `grep -rn "localStorage" --include='*.js' --include='*.html'`
returns only `storage.js` (plus comments); a fixture with old keys migrates and
the old keys are removed after a successful read; double-migration is a no-op.

## 6.2 — Theme and preferences

**Steps**
1. One key `d3s:prefs` = `{theme: 'light'|'dark'|'system', fontScale, lineHeight,
   contrast, lang, reduceMotion}`.
2. Inline pre-paint script sets `data-theme` before first paint; no flash.
3. Follow `prefers-color-scheme` when theme is `system`, with a listener.
4. Read preferences in one place and expose them as CSS custom properties.

**Acceptance:** switching to system and changing OS appearance flips the site;
reload shows no flash in either theme; only one theme key exists in storage.

## 6.3 — Reset semantics

**Steps**
1. Build the reset dialog from the module's key registry: name, record count,
   size estimate per group.
2. Offer "reset progress", "reset notes", "reset preferences", "everything".
3. Require typing `RESET` (or a hold-to-confirm) for "everything".
4. After reset, re-render the current page into its first-run state without a
   reload if possible.

**Acceptance:** each option clears exactly its group (verified key-by-key);
"everything" clears all `d3s:*`; the dialog's counts match `storage.estimate()`
before reset.

## 6.4 — Notes on unit pages

**Steps**
1. Load `notes-tracker.js` on all 24 unit pages (and subject pages if the
   pattern is shared).
2. Notes are per section, keyed by `subject + unit + sectionId`; plain text with
   line breaks (no HTML), autosaved with a debounce and a "saved" indicator.
3. Show existing notes on load; add "clear this note"; include notes in search
   (Phase 4 index may need a rebuild step) and in backup.
4. Make the notes area reachable by keyboard and labelled for screen readers.

**Acceptance:** type → reload → text persists on three different unit pages;
clearing works; notes appear in the backup file; no note is lost when switching
theme or resizing.

## 6.5 — Backup and restore

**Steps**
1. Export: `{app, schemaVersion, exportedAt, stores: {...}}` as a downloaded
   `.json` (and a copy-to-clipboard fallback for phones that block downloads).
2. Import: file input or pasted text → parse → validate shape and version →
   preview ("Progress: 42 attempts · Notes: 17 · Cards: 120 due") → choose
   merge or replace.
3. Merge rules documented: attempts union by id, notes newest-wins by
   `updatedAt`, preferences explicit choice.
4. Never trust the file: no `eval`, size cap, and a rejection message that says
   why.

**Acceptance:** round trip on a clean profile produces identical visible state;
a malformed file is rejected with a clear message; importing the same file twice
changes nothing (idempotent merge).

## 6.6 — IndexedDB migration

**Steps**
1. Measure current usage (`navigator.storage.estimate()`), record it.
2. Define the threshold (e.g. notes + attempts > 1.5 MiB) at which notes and
   attempts move to IndexedDB behind the same module API.
3. Implement the adapter: same `get/set` contract, async path, one-time
   migration, fallback to localStorage if IDB is unavailable (private mode).
4. Request `navigator.storage.persist()` and report whether it was granted.

**Acceptance:** with the threshold forced to 0, the app still works end-to-end
on IndexedDB; the fallback path is exercised in a private window; no data loss
across the migration.

## Phase checks

```sh
grep -rn "localStorage" --include='*.js' --include='*.html' . | grep -v storage.js
python3 scripts/check_site.py --strict
# manual: export → clear → import → compare screens; type notes on 3 units
```

**Not verifiable here:** Safari storage eviction behaviour and real-device
download of the backup file. Record what was observed on the phone pass.

## Implementation status — merged 2026-11-17

Gate-verified on `arena/be90e07e-diploma-3rd-sem` and **merged to `main` as
`5b7eb66` (PR #14, Web CI `44034450353` green, Pages `44034449241` green)**;
full evidence and caveats in [`record.md`](record.md).

| Part | Acceptance | State |
|---|---|---|
| 6.1 | grep returns only `storage.js` (legacy fixture migrates, old keys removed, double migration no-op) | met — no `localStorage` calls outside the module (only comments, one status string, one privacy-policy sentence); `tests/storage.cjs` |
| 6.2 | system flips on OS change, no flash, one theme key | met — `tests/preferences.cjs` (pre-paint attribute set at script evaluation, listener, single `d3s:prefs`) |
| 6.3 | each option clears its group, counts match `estimate()` | met — dialog labels carry live counts; `tests/preferences.cjs` |
| 6.4 | notes persist on three unit pages, clearing works, in backup, survive theme change | met on 24 unit pages **plus** practice and quiz review; `tests/section-notes.cjs`. Real reload checked in a DOM harness, not on a phone |
| 6.5 | round trip identical, malformed rejected, re-import idempotent | met — `tests/storage.cjs`, `tests/storage-recovery.cjs` |
| 6.6 | threshold 0 works on IndexedDB, fallback in private window, no data loss | **partially met** — IndexedDB is a recovery mirror behind the same API, `hydrate()` restores an evicted origin, threshold branch tested at 0, no-IndexedDB fallback tested. A primary-store swap was not done: the synchronous render contract is the blocker, recorded in `record.md` |

Still open (carried past the merge, not waived by it): owner device pass (notes
on three units + practice, theme switch, export → clear → import), real
private-window and eviction observation, and real-phone backup download. These
are Phase 10 device-acceptance items now; `6.6-3` remains a **partial meet**
because IndexedDB is a recovery mirror, not a primary store.
