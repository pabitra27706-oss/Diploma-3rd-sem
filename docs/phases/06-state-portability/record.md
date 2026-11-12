# Phase 6 — Engineering record

Status: partial implementation; 2026-11-09. Reuse: ADAPT all existing storage
contracts with a string-compatible boundary; BUILD namespaced migration,
group resets, backup/restore, section-note controls. Existing note/highlight
tracker data remains readable; no destructive rewrite of its UI.

`assets/js/storage.js` owns runtime localStorage access. Legacy callers use its
adapter (including length/key/enumeration) and verified copy-on-read migration
to `d3s:*`. JSON API exposes get/set/remove/keys/clearAll/estimate/migrate.
Theme aliases converge to `d3s:prefs`; settings include system theme, size,
line spacing, contrast, motion, labelled English/Bengali UI preference. Storage
errors dispatch a visible alert and throw; callers do not silently lose writes.

Settings shows group record/byte estimates, independent progress/notes/prefs
resets and typed RESET for everything. Backup download/copy/paste/file import
has 5MiB/10,000-record cap, app/schema/key validation, preview, explicit merge or
replace, separate preference consent and rollback attempt on failure. Arrays
merge by identity, notes by updatedAt, attempts by savedAt; scheduler card state
uses latest review timestamps and event union. Unknown conflicts keep local data.
Unrelated origin keys are not removed. See UI wording for private backup data.

Plain-text section notes on unit section headings autosave with debounce,
restore/clear/save indicators; notes are searchable locally and included in backup.
Scope filtering was fixed after a browser test found notes on hidden sidebar
headings: controls now target authored `.section-title` content only.

Evidence: VM migration/theme/isolation/backup/quota/rejection tests PASS;
three unit pages' note persistence, preferences and previewed restore browser
checks PASS. Runtime localStorage calls are confined to storage.js. Deterministic
unit tests for attempt logic still isolate its adapter; integration covers actual
namespacing. No IndexedDB migration is implemented: primary API is synchronous.

Pending: typed validation of additional legacy record variants, IndexedDB
threshold/async cutover/fallback, concurrent-tab transaction isolation and state
synchronization across already open tabs. Do not claim 6.6 complete. Safari
storage eviction and actual phone download acceptance belong to Phase 10.


## Follow-up — defensive imports and interruption recovery

Added typed validation for preferences, scheduler state/events, history/attempt
snapshots, identity/order/answers, flags, question position, section notes and
mistakes. Unknown records must still be valid JSON with safe property names;
unsupported versions and unsafe/deep object fields are rejected before writes.
Import textarea/file changes invalidate the old preview. Import preview counts
attempts, notes, card schedules and raw records. Preferences in merge mode honor
the explicit opt-in instead of silently keeping the old values.

Exports no longer require a migration write: full-quota users can still obtain
a normalized copy of legacy originals. Valid imports migrate legacy names before
replacement so deleted legacy values cannot reappear. Before changing records,
a journal stages originals; staging failure changes no student records. Mid-write
failure rolls back. If quota also prevents rollback, the journal remains, ordinary
reads/writes are blocked, Settings can export the pre-import snapshot or retry
recovery, and a reopened page attempts recovery before loading normal state.
Journal staging needs extra quota and may therefore refuse an otherwise large
import safely. This is not cross-tab transactional isolation or an IDB adapter.

`tests/storage-recovery.cjs` injects one-shot and persistent quota failures,
verifies retained originals/reopen recovery/no-write export, rejects malformed
schemas/prototype fields, checks preference consent and legacy replace deletion.
Existing storage/browser tests still pass. No real-browser quota or eviction
claim is inferred from deterministic injection.
