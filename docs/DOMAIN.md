# Custom-domain readiness — no domain action authorized

No domain was purchased, registered or configured. The current public base remains
`https://pabitra27706-oss.github.io/Diploma-3rd-sem/`, and nothing in this branch
was deployed.

## One constant

`scripts/site_config.py` holds `SITE_ORIGIN`, `BASE_PATH` and their concatenation
`SITE`. `scripts/generate_presence.py` (canonical, Open Graph, icons, manifest
link), `scripts/check_platform.py` (sitemap links, third-party check) and
`scripts/audit_page_weight.py` import it. Pages, `manifest.json` (`./`) and
`sw.js` (`new URL('./', self.location.href)`) carry no absolute base at all, so
only generated metadata changes when the base changes.

## Proof that `/` works (run 2026-11-17)

```sh
python3 scripts/check_root_rewrite.py
```

Copies the shipped tree to a temporary directory, rewrites every absolute site URL
to a `/` root and runs `check_site.py --strict` **inside the copy**: 426 files
copied, 81 rewritten, 0 errors, 0 warnings. `tests/test_root_rewrite.py` runs this
and also fails if any other shipped source hard-codes the published URL (the
presence block, `sitemap.xml`, `robots.txt` and `404.html` are allowlisted: they
are generated, and a 404 page must use absolute asset URLs because it can be
served at any depth).

## Migration sequence (a future, explicitly authorized chat)

1. Export student data first: `localStorage`/IndexedDB are per-origin, so a new
   domain starts empty. Record the current commit and both cache versions.
2. Set `SITE_ORIGIN` (and `BASE_PATH = "/"` for a custom domain at the root) in
   `scripts/site_config.py`.
3. Regenerate: `generate_presence.py` twice, then `build_search_index.py`, then
   `build_data_version.py`.
4. Run `python3 scripts/check_root_rewrite.py`, `check_site.py --strict`,
   `check_platform.py`, `check_tokens.py --strict`, `audit_accessibility.py --fail`
   and the deterministic Node suites against the new values.
5. Serve the copy locally at the real subpath and walk: home → nested page → back,
   search offline, Practice, quiz resume, import/export, install, update banner.
6. **Only with explicit deployment permission**: configure Pages/DNS/`CNAME` for
   the new host, then verify the HTTPS URL actually resolves before updating any
   publication record (`SITE_LIST.md`). A configured domain is not a live one.
7. Rollback: revert the merge, restore `site_config.py`, regenerate the metadata,
   bump the shell version, redeploy the previous build, and re-verify the old URL.
   Never ask a student to clear storage as a cache workaround.

## Not done here

No purchase, no DNS record, no `CNAME` file, no Pages setting, no certificate, no
announcement of a new URL. Those are owner gates (`rule.md` §3).
