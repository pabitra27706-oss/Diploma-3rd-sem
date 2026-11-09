# Phase 0 — Tasks

All four parts are complete. This file stays as the record of what was accepted
and how, so a later phase does not repeat the work.

## 0.1 — Playbook (`webflow/`)

**Goal:** a reusable, Android-free playbook for static web projects.

**Delivered:** `README`, `PURPOSE`, `RULES` (15 laws), `PLAN`, `START`,
`PROMPTS`, `common-prompt`, `MAINTENANCE`, `SITE_LIST`, `LICENSE`;
`knowledge/` (reuse-first, web-engineering, quality-without-a-device,
design-system, web-references, niche-method, launch-blockers); `templates/`
(rule-site, prompt-site, readme-site, next-chat-prompt, ci-web, site-checklist,
privacy-page, pwa-checklist, docs-system/*, scripts/check_site.py).

**Acceptance (met):**
- No Android/Play/AdMob/Gradle/APK instruction remains.
- Money model is explicitly removed, not deferred.
- Every internal markdown link resolves (39 files checked, 0 broken).
- A new site can bootstrap from `START.md` with no other repo reachable.

## 0.2 — Site adoption

**Goal:** this repo obeys its own manual.

**Delivered:** root `rule.md` (identity, base path, gates, invariants, done),
`prompt.md` (continuation prompt), `docs/ROADMAP.md`, `docs/DECISIONS.md`,
`docs/RESEARCH.md`, `docs/DESIGN.md`, `docs/AUDIT.md`, README pointer block,
legacy dump archived to `docs/archive/legacy-prompt-2026-11.md`.

**Acceptance (met):** every recorded decision is dated; the four decision
classes are separable; the archiving is a git rename, so history is intact.

## 0.3 — Gate and CI

**Goal:** make quality checkable from a phone.

**Delivered:** `scripts/check_site.py` (stdlib; links, JSON, ids, structure,
a11y basics, sprite symbols, budgets; `--strict`), `.github/workflows/ci-web.yml`
(JS parse, PYQ validation, site checks, `site-preview` and `site-check`
artifacts, no deploy step).

**Acceptance (met):**
- First independent run reproduced the audit: 12 errors, 198 warnings.
- CI run `42628206792` green on `ebc83c5`.
- No secrets, no npm runtime dependency, no deploy.

## 0.4 — Baseline and syllabus

**Goal:** a truthful starting point and the course authority in the repo.

**Delivered:** `docs/AUDIT.md`; `docs/syllabus/` (`syllabus-3rd-sem-2022.pdf`,
`syllabus.md`, `syllabus.json`, `README.md`);
`scripts/validate_syllabus.py`; this phase folder set.

**Acceptance (met):**
- `validate_syllabus.py` reports 5 courses, 3 labs, 992 PYQ, 872 quiz records,
  and finds 7 out-of-syllabus unit-5 tags (CST205 ×4, CST209 ×3) plus a missing
  CST207 quiz bank — none of which was in the original audit.
- Syllabus hours sum to the declared contact hours for all five courses
  (30/30/45/60/60).
- ESE pattern rows sum to 60 marks.

## Checks used in this phase

```sh
python3 scripts/check_site.py --report /tmp/sc.txt   # 12 errors / 198 warnings
python3 scripts/validate_pyq.py                      # PASS, 30 papers, 992 records
python3 scripts/validate_syllabus.py                 # shape + coverage join
node --check <every .js>                             # 20 files parse
```

**Not verifiable here:** browser rendering, service-worker install, focus order,
contrast as rendered, Lighthouse. No browser or device exists in this
environment; those land in Phase 1 and Phase 7 records.
