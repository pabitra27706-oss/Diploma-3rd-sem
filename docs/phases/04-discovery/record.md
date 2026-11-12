# Phase 4 — Engineering record

Status: in progress (implementation largely present); 2026-11-09.
Reuse: ADAPT Phase 2 duplicate grouping/source IDs and existing PYQ renderer;
BUILD compact deterministic sidecars and a dependency-free UI. No package or
remote service. Raw originals were inspected/read only.

Implemented: search manifest and five subject shards; question stems/topics and
unit headings, plus device-local section notes. Subject is implicit in each
shard and question URLs are reconstructed from source identity, reducing each
shard to 26.2–36.3% of its subject's source JSON. Builder validates target pages.
Search supports URL query/subject/unit state, popstate, 120ms debounce, keyboard
focus/arrows/Enter/Esc, safe textContent rendering, capped displayed results,
counts, empty/error/retry states. Search entry is on home.

Repeat explorer: 69 exact groups / 69 extra appearances from 992 raw questions,
matching the Phase 2 duplicate method. Canonical and every appearance link to
source paper/question; stored-unit totals include sample/method disclaimers.
PYQ deep links accept subject/P001 and full paper ID forms, select the question,
focus it and update title; copy/share controls include clipboard fallback.
Quiz review links explicitly say this device: history is not uploaded or portable
by URL. Unit and subject pages have stored-tag counts, related links, topic
summaries, unit jump lists and previous/next unit links. No retagging implied.

Evidence: `tests/test_discovery.py` builder idempotence, ≤40% shard budget,
repeat counts, card source resolution; `tests/discovery-study-browser.cjs`
search, `<script>` input, 69 groups and source-question landing PASS. Filtering
reports local timing in UI; this is not a measured real-phone latency guarantee.

Pending: full share/back-button/keyboard acceptance, focused search offline test,
indexing remaining non-unit informational pages, and explicit links for headings
without authored IDs. Broad device tests belong to Phase 10. Not marked complete.
