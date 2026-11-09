#!/usr/bin/env python3
"""Validate the syllabus transcription and join it to the content data.

Checks (stdlib only):
  * syllabus.json shape: unique course codes, contiguous unit numbers,
    hours summing to the declared contact hours, modules in A/B/C,
    ESE marks summing to 60;
  * coverage: per subject and unit, how many PYQ and quiz records exist, and
    any record tagged with a unit the syllabus does not declare;
  * presence: courses with data but no syllabus entry, and vice versa.

Usage:
    python3 scripts/validate_syllabus.py            # report, exit 0
    python3 scripts/validate_syllabus.py --strict   # exit 1 on errors
    python3 scripts/validate_syllabus.py --json     # machine-readable summary
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SYLLABUS = ROOT / "docs" / "syllabus" / "syllabus.json"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def check_shape(data: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warns: list[str] = []

    for key in ("schemaVersion", "source", "assessment", "subjects"):
        if key not in data:
            errors.append(f"syllabus.json: missing top-level `{key}`")

    codes = [s.get("code") for s in data.get("subjects", [])]
    dupes = [c for c, n in Counter(codes).items() if n > 1]
    if dupes:
        errors.append(f"syllabus.json: duplicate course codes {dupes}")

    for subject in data.get("subjects", []):
        code = subject.get("code", "?")
        units = subject.get("units", [])
        if not units:
            errors.append(f"{code}: no units")
            continue
        numbers = [u.get("unit") for u in units]
        if numbers != list(range(1, len(units) + 1)):
            errors.append(f"{code}: unit numbers are {numbers}, expected 1..{len(units)}")
        declared = subject.get("unitCount")
        if declared is not None and declared != len(units):
            errors.append(f"{code}: unitCount {declared} but {len(units)} units listed")
        hours = sum(u.get("hours", 0) for u in units)
        contact = subject.get("contactHours")
        if contact is not None and hours != contact:
            errors.append(f"{code}: unit hours sum to {hours}, contactHours is {contact}")
        for unit in units:
            if unit.get("module") not in {"A", "B", "C"}:
                errors.append(f"{code} U{unit.get('unit')}: module {unit.get('module')!r} not A/B/C")
            if not unit.get("topics"):
                warns.append(f"{code} U{unit.get('unit')}: no topics transcribed")

    ese = data.get("assessment", {}).get("esePattern", [])
    if ese:
        total = sum(item.get("marks", 0) for item in ese)
        declared = data["assessment"].get("endSemester")
        if declared and total != declared:
            errors.append(f"ESE pattern marks sum to {total}, endSemester is {declared}")

    for lab in data.get("labs", []):
        if not lab.get("code") or not lab.get("title"):
            errors.append(f"lab entry incomplete: {lab}")
    return errors, warns


def check_coverage(data: dict) -> tuple[list[str], list[str], dict]:
    warns: list[str] = []
    errors: list[str] = []
    declared = {s["code"]: s for s in data.get("subjects", [])}

    pyq_by_subject: dict[str, Counter] = defaultdict(Counter)
    pyq_questions: dict[str, int] = Counter()
    for path in sorted(glob.glob(str(ROOT / "_data" / "*" / "*.json"))):
        if path.endswith("registry.json"):
            continue
        paper = load(Path(path))
        code = paper.get("subject")
        for question in paper.get("questions", []):
            unit = str(question.get("unit", "")).strip()
            pyq_by_subject[code][unit] += 1
            pyq_questions[code] += 1

    quiz_by_subject: dict[str, Counter] = defaultdict(Counter)
    quiz_questions: dict[str, int] = Counter()
    for path in sorted(glob.glob(str(ROOT / "_quiz-data" / "*" / "*.json"))):
        bank = load(Path(path))
        code = bank.get("subject")
        unit = str(bank.get("unit", "")).strip()
        count = len(bank.get("questions", []))
        quiz_by_subject[code][unit] += count
        quiz_questions[code] += count

    rows = []
    for code, subject in sorted(declared.items()):
        units = len(subject["units"])
        pyq = pyq_by_subject.get(code, Counter())
        quiz = quiz_by_subject.get(code, Counter())
        out_of_syllabus = {u: n for u, n in pyq.items() if u.isdigit() and int(u) > units}
        empty_units = [u for u in range(1, units + 1) if pyq.get(str(u), 0) == 0]
        rows.append(
            {
                "code": code,
                "title": subject["title"],
                "units": units,
                "pyq": pyq_questions.get(code, 0),
                "quiz": quiz_questions.get(code, 0),
                "pyqPerUnit": {str(u): pyq.get(str(u), 0) for u in range(1, units + 1)},
                "quizUnits": sorted(k for k in quiz if k),
                "outOfSyllabus": out_of_syllabus,
                "unitsWithoutPyq": empty_units,
            }
        )
        if out_of_syllabus:
            errors.append(
                f"{code}: {sum(out_of_syllabus.values())} PYQ record(s) tagged outside the "
                f"syllabus units 1..{units}: {out_of_syllabus}"
            )
        if empty_units:
            warns.append(f"{code}: no PYQ for unit(s) {empty_units}")
        if quiz_questions.get(code, 0) == 0:
            warns.append(f"{code}: no quiz bank")

    unknown_pyq = sorted(set(pyq_by_subject) - set(declared))
    unknown_quiz = sorted(set(quiz_by_subject) - set(declared))
    if unknown_pyq:
        errors.append(f"PYQ data for undeclared subject(s): {unknown_pyq}")
    if unknown_quiz:
        errors.append(f"Quiz data for undeclared subject(s): {unknown_quiz}")

    for lab in data.get("labs", []):
        code = lab["code"]
        if not (ROOT / "subjects" / code).exists() and not any(
            ROOT.glob(f"subjects/*/{code.lower()}*")
        ):
            warns.append(f"lab {code} ({lab['title']}) has no pages in this site")

    summary = {
        "courses": len(declared),
        "labs": len(data.get("labs", [])),
        "pyqTotal": sum(pyq_questions.values()),
        "quizTotal": sum(quiz_questions.values()),
        "rows": rows,
    }
    return errors, warns, summary


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--strict", action="store_true")
    parser.add_argument("--json", action="store_true", help="print the summary as JSON")
    args = parser.parse_args()

    if not SYLLABUS.exists():
        print(f"missing {SYLLABUS.relative_to(ROOT)}")
        return 1

    data = load(SYLLABUS)
    shape_errors, shape_warns = check_shape(data)
    cov_errors, cov_warns, summary = check_coverage(data)
    errors = shape_errors + cov_errors
    warns = shape_warns + cov_warns

    if args.json:
        print(json.dumps({**summary, "errors": errors, "warnings": warns}, indent=2))
        return 1 if (args.strict and errors) else 0

    print(f"syllabus: {summary['courses']} courses, {summary['labs']} labs")
    print(f"content: {summary['pyqTotal']} PYQ, {summary['quizTotal']} quiz records")
    print()
    print(f"{'course':8} {'units':>5} {'PYQ':>5} {'quiz':>5}  per-unit PYQ")
    for row in summary["rows"]:
        per_unit = " ".join(f"U{u}:{n}" for u, n in row["pyqPerUnit"].items())
        print(f"{row['code']:8} {row['units']:5d} {row['pyq']:5d} {row['quiz']:5d}  {per_unit}")

    print()
    print(f"errors: {len(errors)}")
    for error in errors:
        print(f"  ERROR {error}")
    print(f"warnings: {len(warns)}")
    for warn in warns:
        print(f"  WARN  {warn}")

    return 1 if (args.strict and errors) else 0


if __name__ == "__main__":
    sys.exit(main())
