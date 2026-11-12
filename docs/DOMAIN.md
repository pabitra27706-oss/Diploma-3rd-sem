# Custom-domain readiness — no domain action authorized

No domain was purchased, registered or configured. Current public base remains
`https://pabitra27706-oss.github.io/Diploma-3rd-sem/`.

Before a future authorized migration:

1. Export student data (storage origins differ across domains).
2. Record the current deployed commit and service-worker version for rollback.
3. Change the metadata generator's `SITE`, regenerate canonical/OG/sitemap/robots,
   and inspect `manifest.json` start URL/scope against the intended deployment.
4. Serve a rewritten copy under `/`, then validate deep navigation, worker scope,
   install, search, Practice, quiz resume, imports and offline recovery.
5. Only with explicit deployment permission, configure Pages/DNS/CNAME. Verify
   the actual HTTPS URL before updating publication records.
6. Roll back Pages/DNS/CNAME and metadata to the recorded prior deployment if
   checks fail; bump worker version for a corrected shell. Never erase student
   storage as a cache workaround.

Runtime modules derive relative bases from their script URL; publication URLs
are still partly centralized in the generator, not a fully implemented single
base-path constant. Root-path rewrite acceptance has not yet been performed.
