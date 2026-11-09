# Phase 9 — Tasks

No new features. Every change here either removes bytes, removes requests,
improves a measured number, or records a decision.

## 9.1 — Data loading

**Steps**
1. Measure: count `fetch()` calls per page and their order; record the baseline
   (practice ≈ 35 requests).
2. Replace fan-out with a generated index: one `papers-index.json` per subject
   listing paper metadata and question counts; practice fetches only the days it
   shows.
3. Fetch in parallel (`Promise.all`) where independent; never serialise a chain
   that could be one request.
4. Cache data in the service worker with a version query; show a skeleton while
   loading and a retry on failure.
5. Re-measure and record before/after counts and bytes.

**Acceptance:** ≤ 12 requests before first render on practice and quiz setup;
parallel, not sequential; offline still works; before/after table in the record.

## 9.2 — CSS/JS consolidation

**Steps**
1. Inventory the 19 CSS files: selectors used, literals duplicated, dead rules
   (compare against HTML).
2. Create the single token file from `docs/DESIGN.md` (frozen in Phase 7) and
   replace literals with tokens.
3. Merge or delete unused files; keep per-area files only where they are loaded
   on demand.
4. Remove dead JS, console noise, and feature-detection for features the support
   floor guarantees.
5. Measure: total CSS/JS bytes per page before and after.

**Acceptance:** zero hex literals outside the token file (grep with an allowlist
for the sprite/logo); every page's CSS payload within budget; no visual
regressions in the screenshots.

## 9.3 — Caching and update policy

**Steps**
1. Document strategy per resource class: shell (cache-first + versioned),
   data (stale-while-revalidate with version), pages (network-first with
   offline fallback), fonts/icons (cache-first, self-hosted only).
2. Add an update flow test: bump version → banner appears → reload → new shell.
3. Ensure a data-only update does not require a shell update, and vice versa.
4. Record the policy in the record and in `docs/DESIGN.md`/README where relevant.

**Acceptance:** a data change reaches a returning user without clearing storage;
a shell change prompts, never forces; no stale page serves deleted content
without a visible "updated" note.

## 9.4 — Measurement without surveillance (owner gate)

**Steps**
1. Record the default decision: no third-party analytics; local-only usefulness
   prompt; a working contact route; published "what we cannot know".
2. Implement the local prompt: one per session max, dismissible, count stored
   locally, never transmitted; and a "copy feedback" template that includes the
   page and version.
3. Write `docs/MEASUREMENT.md`: what is knowable (repo traffic, direct messages,
   manual checks) and what is not (usage, retention, devices).
4. If the owner asks for real numbers, log a new decision naming the tool, then
   update the privacy page and the budget before adding it.

**Acceptance:** no network request is added by the prompt (verified by reading
the code); the doc lists the trade-off; the owner's answer is dated.

## 9.5 — Domain readiness (no purchase)

**Steps**
1. Centralise the base path in one place (config constant used by manifest, SW,
   canonical, sitemap generator).
2. Write `docs/DOMAIN.md`: what changes for a custom domain (canonical URLs,
   sitemap, SW scope, CNAME file, Pages settings), in order, with rollback.
3. Verify the site still works if the base path changes to `/` by running the
   checker against a rewritten copy (describe the test).
4. Do **not** register, buy, or configure anything; that is a gate.

**Acceptance:** one constant controls the base path; the migration doc is
executable by someone else; no domain action taken.

## 9.6 — Launch gate

**Steps**
1. Run `webflow/templates/site-checklist.md` (or the repo's copy) end to end;
   tick with dates and evidence.
2. Real-phone pass: load, navigate two levels, theme, offline reload, install,
   rotate, font scale, one form, one print export.
3. Rollback written: revert merge, bump cache, re-deploy, verify.
4. `SITE_LIST.md` updated only after the URL actually resolves (gate).
5. Report and stop — deploy is a separate, explicitly authorised chat
   (`PROMPTS.md` P6).

**Acceptance:** checklist complete with links to evidence; phone pass recorded
with device/browser; rollback documented; **deploy not performed**; the next
action is an explicit owner command.

## Phase checks

```sh
python3 scripts/check_site.py --strict
python3 scripts/validate_data.py --strict
python3 scripts/validate_syllabus.py --strict
# budgets: recorded before/after table
# lighthouse: one recorded run with the machine named
```

**Not verifiable here:** real-device performance, install behaviour, and any
measurement of actual use. State them as unknowns, never as results.
