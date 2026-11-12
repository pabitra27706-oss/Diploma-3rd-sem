# Phase 9 — Engineering record

Status: partial implementation; 2026-11-09. Reuse: ADAPT first-party service
worker and deterministic source pipeline; BUILD compact derived pools and
checked-in dependency-free concatenation for request reduction. Serving remains
zero-build; contributors regenerate checked-in outputs after editing sources.

`build_runtime_data.py` generates 923-question unique Practice and 872-question
quiz pools from unchanged sources. Practice no longer serially fetches every
registry/paper; setup uses one pool plus catalog. Failures stop rendering rather
than showing a partial inventory. Tests compare full source-preserving rows.
`build_runtime_bundles.py` reduces setup and Practice support script requests;
Python tests reject stale bundle/source pairs.

Cold local Chromium, service workers blocked, measured until inventory loaded:

| Page | Before requests | After requests | Before JSON | After JSON |
|---|---:|---:|---:|---:|
| Practice | 43 | 12 | 36 | 1 |
| Quiz setup | 28 | 12 | 20 | 2 |

See `request-measurements.json`. Before is committed ac428d1 served under the
same nested prefix. These counts are not Lighthouse or physical-phone timing.
Practice pool is 858,467 bytes; quiz pool 420,756 bytes uncompressed. Requests
are reduced, not a claim that every payload shrank. Day-specific payload loading
and full CSS token consolidation remain pending.

`docs/CACHE-POLICY.md`, `docs/MEASUREMENT.md`, `docs/DOMAIN.md` record actual cache
policy, no-surveillance default and future migration/rollback sequence. Worker
version bumped for added dependencies. Warmed paper offline regression passes;
no cache-only first visit guarantee or independent data cache version is claimed.

Pending: CSS literal/token/dead-code consolidation, independent cache versioning
and update regression, root rewrite test, launch audit
and Lighthouse measurement. Full hardware acceptance belongs to Phase 10. No
PR/merge/publication/domain action is authorized by this record or performed.


## Follow-up — local usefulness feedback

Added one non-modal prompt per tab session on Today/results, local-only counts,
dismiss and a page/build feedback template with manual clipboard fallback.
No fetch is made by either rating/copy handler. Session markers are isolated
inside the storage boundary; blocked session storage skips the prompt. The
feedback browser regression verifies persisted local counts and no repeat after
reload. Updated MEASUREMENT documents what this cannot tell the site owner.
No analytics or automatic email send was added. Worker bumped to
`study-safety-2026-11-09`; metadata uses that source rather than a fictitious
version. Request budget must be remeasured after future dependency changes.
