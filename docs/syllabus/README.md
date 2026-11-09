# Syllabus folder

Where the course authority lives, so content can be checked instead of guessed.

| File | What it is |
|---|---|
| `syllabus-3rd-sem-2022.pdf` | The source document, unmodified (22 pages, WB State Council, Revised 2022) |
| `syllabus.md` | Readable transcription with page references |
| `syllabus.json` | Machine-readable: courses, units, hours, modules, topics, labs, ESE pattern |

## Rules

1. **The PDF is the authority.** `syllabus.md` and `syllabus.json` are
   transcriptions; when they disagree with the PDF, the PDF wins and the
   transcription is fixed in the same commit.
2. **Never edit the PDF.** If a newer Council revision appears, add it as a new
   file (`syllabus-3rd-sem-<year>.pdf`) and record the change in
   `docs/DECISIONS.md`. Do not overwrite the old one silently.
3. **Unit numbers, titles, hours and modules come from here.** Content files do
   not get to redefine them. A mismatch is a content bug with a `file:line`.
4. **Transcription changes are evidence changes.** Any edit to `syllabus.json`
   must quote the page it came from in the commit message or the phase record.
5. **Copyright.** The PDF is Council-published material, included unmodified for
   study reference. It is not covered by this repository's licence; the
   transcription is a working aid, not an official text.

## How it is used

| Consumer | Uses |
|---|---|
| `scripts/validate_syllabus.py` | Shape checks + coverage join against `_data/` and `_quiz-data/` |
| Phase 02 (data pipeline) | Unit-count and unit-order validation; out-of-syllabus tag detection |
| Phase 08 (content depth) | Coverage map, formula sheets, printable revision sheets, lab pages |
| Phase 03 (quiz engine) | ESE pattern for mock-paper mode (after the marks reconciliation) |
| Any phase | Evidence for "is this in the syllabus?" — quote the unit, not an opinion |

## Current known mismatches (recorded, not fixed)

- CST201 quiz bank maps Unit 3 = Functions, Unit 4 = Arrays; syllabus says
  Unit 3 = Arrays, Unit 4 = Functions.
- CST205 has records tagged Unit 5; the syllabus declares four units.
- CST209 has four units; check for Unit 5 tags during Phase 02.
- Repository paper data records full marks per paper that differ from the
  ESE pattern's 60; reconcile before showing "marks" in a mock paper.
- Three labs (CST211/CST213/CST215) and SI201 exist in the syllabus but have no
  pages in this site yet.
