# Phase 8 — Engineering record

Status: partial implementation; 2026-11-09. Reuse: ADAPT existing syllabus
transcription, original papers and generated cards; BUILD deterministic coverage
sidecar/pages. No new factual answers or owner verification is inferred.

`build_coverage.py` joins raw archived counts, quiz banks, notes and cards across
23 declared theory units. Coverage page includes zero-content rows, flags,
known mapping caveats, raw-appearance counting method, unknown update dates and
explicit certification counts. Stored out-of-syllabus tags remain visible.
No hash-frozen original is retagged to make the report green.

Exam pattern page reproduces the transcribed 2022 ESE table with PDF page link,
internal/end-semester totals, and all historical printed/set-question totals
marked unresolved. It does not invent causes for differences or marking schemes.
Practical-course pages CST211/CST213/CST215 cite syllabus pages 14/16/19 and
list tasks only; SI201 cites page 22 and separates suggested personal record
keeping from official requirements. Coverage/navigation links all four courses.

Shared print rules apply to units/papers/derived content, hiding navigation and
controls, white backgrounds, avoid-break question containers and answer breaks.
Source status/citation/answer status is shown on PYQ questions using source
values, without implying scan verification certifies an answer.

Evidence: deterministic coverage counts equal source inventory in Python tests;
PYQ integrity 0 changed/added/missing. Site links pass. No real PDF/phone print
result is asserted. `lastUpdated` is null where unknown, not the generator date.

Pending: cited formula/definition sheets and owner review before navigation,
physical/phone print acceptance (Phase 10), answer sign-off batches, source
mapping and exam-total reconciliation. Data verification gates remain open.
