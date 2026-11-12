# Current cache policy

- Scope-relative URLs; no browser-facing localhost endpoints.
- Shell dependencies are pre-cached in the versioned service-worker cache.
- Pages: network-first, cached page or explicit offline fallback on failure.
- Other successful same-origin GET resources: cached response when present,
  refreshed in background. Uncached resources need a successful first load.
- Search shards use manifest SHA256 query versions. Generated pools/cards are
  refreshed in the background at their stable URLs; a cached response may be
  from the previous version until the next request. This limitation is visible
  here; no instantaneous data freshness guarantee is made.
- Worker activation remains user-triggered via the existing update banner;
  student storage uses a different namespace and is not cleared by cache cleanup.
- Data changes do not require clearing student storage. Shell dependency changes
  require a worker version bump. Current shared cache is not an independently
  versioned shell/data adapter; that refinement remains pending.

Real-device installation, cache-eviction and update acceptance belongs to the
owner-requested final device phase. Warmed-cache paper offline regression is a
focused engineering check, not proof of all offline journeys.
