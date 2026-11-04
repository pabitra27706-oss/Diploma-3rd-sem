#!/usr/bin/env python3
"""Validate PYQ paper data.

Rebuilt papers use ``schemaVersion: pilot-v1``. Legacy papers are checked for
viewer/practice fallback compatibility and report warnings only.

Usage:
    python3 scripts/validate_pyq.py
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "_data"
OPTION_LETTERS = list("ABCDEF")


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.infos: list[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)
        print(f"ERROR  {msg}")

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)
        print(f"WARN   {msg}")

    def info(self, msg: str) -> None:
        self.infos.append(msg)
        print(f"INFO   {msg}")


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def option_entries(q: dict) -> list[dict] | None:
    """Mirror pyq/js/answers.js getOptions() for compatibility checks."""
    opts = q.get("options")
    if opts is None:
        return None

    if isinstance(opts, list):
        out = []
        for i, opt in enumerate(opts):
            fallback = OPTION_LETTERS[i] if i < len(OPTION_LETTERS) else chr(65 + i)
            if isinstance(opt, str):
                out.append({"key": fallback, "text": opt})
            elif isinstance(opt, dict):
                out.append({
                    "key": opt.get("key") or opt.get("label") or fallback,
                    "text": opt.get("text") or opt.get("value") or "",
                })
            else:
                out.append({"key": fallback, "text": str(opt)})
        return out

    if isinstance(opts, dict):
        return [{"key": k, "text": str(v)} for k, v in opts.items()]

    return []


def correct_index(q: dict, entries: list[dict] | None) -> int:
    """Mirror pyq/js/answers.js getCorrectIndex()."""
    if not entries:
        return -1
    correct = q.get("correct")
    if isinstance(correct, int) and not isinstance(correct, bool):
        return correct if 0 <= correct < len(entries) else -1
    if isinstance(correct, str):
        target = correct.strip().lower()
        if target.isdigit():
            n = int(target)
            return n if 0 <= n < len(entries) else -1
        for i, entry in enumerate(entries):
            if str(entry["key"]).lower() == target:
                return i
        upper = target.upper()
        for i, entry in enumerate(entries):
            letter = OPTION_LETTERS[i] if i < len(OPTION_LETTERS) else ""
            if letter.upper() == upper or str(entry["key"]).upper() == upper:
                return i
    return -1


def validate_common(paper: dict, path: Path, meta: dict | None, report: Report) -> None:
    label = str(path.relative_to(ROOT))

    for key in ("subject", "paperCode", "fileName", "questions", "totalQuestions"):
        if key not in paper:
            report.warn(f"{label}: missing root field '{key}' (legacy fallback may be incomplete)")

    questions = paper.get("questions")
    if not isinstance(questions, list):
        report.error(f"{label}: 'questions' must be an array")
        return

    declared = paper.get("totalQuestions")
    if isinstance(declared, int) and declared != len(questions):
        report.warn(f"{label}: totalQuestions={declared} but {len(questions)} question objects")

    if path.name != paper.get("fileName"):
        report.warn(f"{label}: fileName='{paper.get('fileName')}' does not match actual file")

    subject_dir = path.parent.name
    if paper.get("subject") and paper["subject"] != subject_dir:
        report.warn(f"{label}: subject='{paper.get('subject')}' does not match directory {subject_dir}")

    if meta and paper.get("paperCode") and paper["paperCode"] != meta.get("paperCode"):
        report.warn(f"{label}: paperCode='{paper.get('paperCode')}' does not match registry")

    ids = [q.get("id") for q in questions if isinstance(q, dict)]
    for qid, count in Counter(ids).items():
        if count > 1:
            report.warn(f"{label}: duplicate question id '{qid}' ({count}x)")

    for i, q in enumerate(questions):
        if not isinstance(q, dict):
            report.error(f"{label}: question #{i + 1} is not an object")
            continue
        qid = q.get("id", f"#{i + 1}")

        for key in ("question", "marks", "type"):
            if key not in q:
                report.warn(f"{label}: {qid} missing '{key}'")

        marks = q.get("marks")
        if marks is not None and not isinstance(marks, (int, float)):
            report.warn(f"{label}: {qid} marks is not numeric")

        unit = q.get("unit")
        if isinstance(unit, int) and not 1 <= unit <= 5:
            report.warn(f"{label}: {qid} has out-of-range unit={unit}")

        entries = option_entries(q)
        if q.get("options") is not None and entries == []:
            report.warn(f"{label}: {qid} has unsupported options shape")
        if "correct" in q and entries and correct_index(q, entries) < 0:
            report.warn(f"{label}: {qid} correct='{q.get('correct')}' does not resolve to an option")

        if q.get("hasImage"):
            image = q.get("image")
            if not image:
                report.warn(f"{label}: {qid} hasImage=true but no image path")
            elif not (ROOT / str(image).lstrip("/")).exists():
                report.warn(f"{label}: {qid} image path does not exist: {image}")


def validate_pilot_registry(paper: dict, path: Path, meta: dict | None, report: Report) -> None:
    label = f"{path.relative_to(ROOT)} registry"
    if not meta:
        report.error(f"{label}: registry entry missing")
        return

    for key in ("examSession", "regulation", "sourceFile", "sourceStatus", "duration",
                "fullMarks", "schemaVersion", "answerKeyStatus"):
        if meta.get(key) != paper.get(key):
            report.error(f"{label}: {key}={meta.get(key)!r}, paper has {paper.get(key)!r}")

    if meta.get("sourcePaperCode") != paper.get("sourcePaperCode"):
        report.error(f"{label}: sourcePaperCode does not match paper")
    if paper.get("scanSetNumber") and meta.get("scanSetNumber") != paper["scanSetNumber"]:
        report.error(f"{label}: scanSetNumber does not match paper")
    if meta.get("scanSetNumber") and meta.get("scanSetNumber") == meta.get("sourcePaperCode"):
        report.error(f"{label}: scan/set number must not be used as a paper code")


def validate_pilot_root(paper: dict, path: Path, report: Report) -> None:
    label = str(path.relative_to(ROOT))
    subject = paper.get("subject")
    paper_code = paper.get("paperCode")
    paper_index = paper.get("paperIndex")
    file_name = paper.get("fileName")

    is_march_2023 = (
        paper.get("examSession") == "March 2023"
        and paper.get("paperCode") == "P003"
        and paper.get("year") == 2023
    )
    expected = {
        "fileName": path.name,
        "regulation": None if is_march_2023 else "Revised 2022",
        "fullMarks": 60,
        "totalQuestions": len(paper.get("questions", [])),
        "sourceStatus": "verified-against-attached-scan",
        "answerKeyStatus": "no-official-key; model answers",
        "schemaVersion": "pilot-v1",
    }
    if subject != path.parent.name:
        expected["subject"] = path.parent.name
    if paper_code:
        expected["paperCode"] = paper_code
    if isinstance(paper_index, int):
        expected["paperIndex"] = paper_index

    for key, value in expected.items():
        if paper.get(key) != value:
            report.error(f"{label}: {key}={paper.get(key)!r}, expected {value!r}")

    for key in ("sourcePaperCode", "examSession", "year", "month", "monthNumber",
                "duration", "sourceFile", "sourceNote"):
        if key not in paper:
            report.error(f"{label}: missing required root field '{key}'")

    if paper.get("scanSetNumber") and paper.get("scanSetNumber") == paper.get("sourcePaperCode"):
        report.error(f"{label}: scan set number must not be used as the paper code")
    status = str(paper.get("answerKeyStatus", "")).lower()
    if "no-official-key" not in status or "official key" in status:
        report.error(f"{label}: answerKeyStatus must explicitly deny an official key")
    source_note = str(paper.get("sourceNote", ""))
    if "OCR" not in source_note or "normaliz" not in source_note.lower():
        report.error(f"{label}: sourceNote must describe OCR verification and normalization")

    # Scan-specific identity checks for rebuilt December 2024 papers.
    exact_by_file = {
        "CST203-P005-2024-12.json": {
            "sourcePaperCode": "307/2(N)", "scanSetNumber": "3096266",
            "sourceFile": "Python, Dec 2024.pdf",
        },
        "CST201-P005-2024-12.json": {
            "sourcePaperCode": "307/1(N)", "scanSetNumber": "3090511",
            "sourceFile": "Programming in C, Dec 2024.pdf",
        },
        "CST205-P005-2024-12.json": {
            "sourcePaperCode": "307/3(N)", "scanSetNumber": "3102091",
            "sourceFile": "Data Structure, Dec 2024.pdf",
        },
        "CST207-P005-2024-12.json": {
            "sourcePaperCode": "307/4(N)", "scanSetNumber": "3107808",
            "sourceFile": "CSO, Dec 2024.pdf",
        },
        "CST209-P005-2024-12.json": {
            "sourcePaperCode": "307/5(N)", "scanSetNumber": "3113544",
            "sourceFile": "Algorithm, Dec 2024.pdf",
        },
        "CST201-P003-2023-03.json": {
            "sourcePaperCode": "307/1(N)", "scanSetNumber": "2235",
            "sourceFile": "C Programming, March 2023.pdf",
        },
        "CST203-P003-2023-03.json": {
            "sourcePaperCode": "307/2(N)", "scanSetNumber": "3013",
            "sourceFile": "Python, March 2023.pdf",
        },
        "CST205-P003-2023-03.json": {
            "sourcePaperCode": "307/3(N)", "scanSetNumber": "2235",
            "sourceFile": "Data Structures, March 2023.pdf",
        },
        "CST207-P003-2023-03.json": {
            "sourcePaperCode": "307/4(N)", "scanSetNumber": "526",
            "sourceFile": "CSO, March 2023.pdf",
        },
    }
    exact = exact_by_file.get(path.name)
    if exact:
        if is_march_2023:
            exact.update({
                "examSession": "March 2023",
                "year": 2023,
                "month": "March",
                "monthNumber": 3,
                "duration": "2.5 Hours",
                "regulation": None,
            })
        else:
            exact.update({
                "examSession": "December 2024",
                "year": 2024,
                "month": "December",
                "monthNumber": 12,
                "duration": "3 Hours",
            })
        for key, value in exact.items():
            if paper.get(key) != value:
                report.error(f"{label}: {key}={paper.get(key)!r}, expected {value!r}")


def validate_pilot_format(paper: dict, path: Path, report: Report) -> dict:
    label = str(path.relative_to(ROOT))
    fmt = paper.get("paperFormat")
    if not isinstance(fmt, dict):
        report.error(f"{label}: missing paperFormat object")
        return {}

    if fmt.get("timeAllowed") != paper.get("duration"):
        report.error(f"{label}: paperFormat.timeAllowed must equal root duration")
    if fmt.get("totalMarks") != paper.get("fullMarks"):
        report.error(f"{label}: paperFormat.totalMarks must equal root fullMarks")
    if not isinstance(fmt.get("generalInstructions"), list) or not fmt["generalInstructions"]:
        report.error(f"{label}: paperFormat.generalInstructions must be a non-empty array")

    groups = fmt.get("groups")
    if not isinstance(groups, list) or len(groups) != 2:
        report.error(f"{label}: paperFormat.groups must contain Group A and Group B")
        return {}

    for group in groups:
        gid = group.get("id")
        if gid not in ("A", "B"):
            report.error(f"{label}: unexpected group id '{gid}'")
            continue
        qids = group.get("questionIds")
        if not isinstance(qids, list):
            report.error(f"{label}: Group {gid} questionIds must be an array")
            qids = []
        if group.get("totalSet") != len(qids):
            report.error(f"{label}: Group {gid} totalSet={group.get('totalSet')} but questionIds has {len(qids)}")
        if group.get("maxMarks") != group.get("marksEach", 0) * group.get("answerAny", 0):
            report.error(f"{label}: Group {gid} maxMarks does not equal marksEach × answerAny")
        if isinstance(group.get("marksFilter"), list) and group["marksFilter"] != [group.get("marksEach")]:
            report.error(f"{label}: Group {gid} marksFilter must match marksEach")
        if not group.get("instruction") or not group.get("groupLabel") or not group.get("markSplit"):
            report.error(f"{label}: Group {gid} missing groupLabel/instruction/markSplit")

    group_max_total = sum(g.get("maxMarks", 0) for g in groups if isinstance(g, dict))
    if group_max_total != paper.get("fullMarks"):
        report.error(f"{label}: group maxMarks total={group_max_total} but fullMarks={paper.get('fullMarks')}")
    if fmt.get("totalMarks") != group_max_total:
        report.error(f"{label}: paperFormat.totalMarks != sum of group maxMarks")

    return fmt


def validate_pilot_questions(paper: dict, path: Path, fmt: dict, report: Report) -> None:
    label = str(path.relative_to(ROOT))
    questions = paper.get("questions", [])
    by_id = {q.get("id"): q for q in questions if isinstance(q, dict)}
    assigned: list[str] = []
    group_by_id: dict[str, dict] = {}

    for group in fmt.get("groups", []):
        qids = group.get("questionIds", [])
        if not isinstance(qids, list):
            continue
        for qid in qids:
            if qid not in by_id:
                report.error(f"{label}: Group {group.get('id')} references missing question '{qid}'")
            assigned.append(qid)
            group_by_id[qid] = group

    duplicates = [qid for qid, count in Counter(assigned).items() if count > 1]
    if duplicates:
        report.error(f"{label}: question ids appear in multiple groups: {duplicates}")
    unassigned = set(by_id) - set(assigned)
    if unassigned:
        report.error(f"{label}: questions not assigned to any group: {sorted(unassigned)}")

    source_numbers = []
    id_prefix = f"{paper.get('subject')}-{paper.get('paperCode')}-Q"

    for q in questions:
        if not isinstance(q, dict):
            continue
        qid = q.get("id", "<no-id>")
        group = group_by_id.get(qid)
        if not group:
            continue
        gid = group.get("id")
        source_numbers.append((gid, str(q.get("sourceNumber", ""))))

        for key in (
            "question", "answer", "answerStatus", "marks", "markSplit", "type",
            "unit", "topic", "tags", "difficulty", "year", "month", "monthNumber",
            "paperCode", "paperIndex", "hasImage", "image", "group", "sourceNumber",
            "sourcePage", "sourceStatus", "practiceDay"
        ):
            if key not in q:
                report.error(f"{label}: {qid} missing required field '{key}'")
        if q.get("group") != gid:
            report.error(f"{label}: {qid} group='{q.get('group')}' but is listed in Group {gid}")
        if q.get("marks") != group.get("marksEach"):
            report.error(f"{label}: {qid} marks={q.get('marks')}, expected {group.get('marksEach')}")
        if not q.get("answer"):
            report.error(f"{label}: {qid} has no answer")
        if q.get("answerStatus") != "model-answer":
            report.error(f"{label}: {qid} answerStatus must be 'model-answer'")
        if q.get("sourceStatus") != "verified-against-attached-scan":
            report.error(f"{label}: {qid} sourceStatus must be 'verified-against-attached-scan'")
        if str(paper.get("sourceFile")) not in str(q.get("sourcePage", "")):
            report.error(f"{label}: {qid} sourcePage must name the attached scan")
        if q.get("hasImage") is not False or q.get("image") is not None:
            report.error(f"{label}: {qid} hasImage/image must be false/null")
        if not q.get("tags") or not q.get("topic"):
            report.error(f"{label}: {qid} missing topic or tags")
        if not isinstance(q.get("unit"), int) or not 1 <= q["unit"] <= 5:
            report.error(f"{label}: {qid} unit must be 1-5")
        if q.get("difficulty") not in ("easy", "medium", "hard"):
            report.error(f"{label}: {qid} difficulty must be easy/medium/hard")
        if q.get("practiceDay") != 1:
            report.error(f"{label}: {qid} practiceDay must be 1 for a rebuilt batch")
        if q.get("year") != paper.get("year") or q.get("month") != paper.get("month") or q.get("monthNumber") != paper.get("monthNumber"):
            report.error(f"{label}: {qid} year/month metadata does not match paper")
        if q.get("paperCode") != paper.get("paperCode") or q.get("paperIndex") != paper.get("paperIndex"):
            report.error(f"{label}: {qid} paperCode/paperIndex does not match paper")
        if not isinstance(q.get("id"), str) or not q["id"].startswith(id_prefix):
            report.error(f"{label}: {qid} id prefix is wrong")

        if gid == "A":
            opts = q.get("options")
            if not isinstance(opts, list) or len(opts) < 2:
                report.error(f"{label}: {qid} Group A MCQ needs an options array")
                continue
            keys = []
            for opt in opts:
                if not isinstance(opt, dict) or not opt.get("key") or not opt.get("text"):
                    report.error(f"{label}: {qid} option must be an object with key and text")
                else:
                    keys.append(str(opt["key"]))
            if len(set(keys)) != len(keys):
                report.error(f"{label}: {qid} has duplicate option keys")
            entries = option_entries(q)
            if correct_index(q, entries) < 0:
                report.error(f"{label}: {qid} correct='{q.get('correct')}' does not resolve")
            if q.get("type") != "mcq":
                report.error(f"{label}: {qid} type must be 'mcq'")
            if group.get("marksEach") == 2 and q.get("markSplit") != "1+1":
                report.error(f"{label}: {qid} markSplit must be '1+1' for 2-mark MCQs")
        elif gid == "B":
            subparts = q.get("subparts")
            if not isinstance(subparts, list) or not subparts:
                report.error(f"{label}: {qid} Group B theory needs subparts")
                continue
            total = 0
            for sp in subparts:
                if not isinstance(sp, dict) or not sp.get("label") or not sp.get("text") or not isinstance(sp.get("marks"), int):
                    report.error(f"{label}: {qid} subpart must have label, text, marks")
                else:
                    total += sp["marks"]
            if total != q.get("marks"):
                report.error(f"{label}: {qid} subpart marks sum={total}, expected {q.get('marks')}")
            expected_split = "+".join(str(sp.get("marks")) for sp in subparts if isinstance(sp, dict))
            if q.get("markSplit") != expected_split:
                report.error(f"{label}: {qid} markSplit='{q.get('markSplit')}', expected '{expected_split}'")
            if q.get("type") != "theory":
                report.error(f"{label}: {qid} type must be 'theory'")

    for gid in ("A", "B"):
        nums = [num for group, num in source_numbers if group == gid]
        if len(set(nums)) != len(nums):
            report.error(f"{label}: Group {gid} has duplicate sourceNumber values")


def validate_registries(report: Report) -> dict[tuple[str, str], dict]:
    metas: dict[tuple[str, str], dict] = {}
    registry_paths = sorted(DATA.glob("CST*/registry.json"))
    if not registry_paths:
        report.error("_data: no registries found")

    for reg_path in registry_paths:
        try:
            registry = load_json(reg_path)
        except Exception as exc:
            report.error(f"{reg_path.relative_to(ROOT)}: invalid JSON: {exc}")
            continue
        label = str(reg_path.relative_to(ROOT))
        papers = registry.get("papers")
        if not isinstance(papers, list):
            report.error(f"{label}: papers must be an array")
            continue
        if registry.get("totalPapers") != len(papers):
            report.warn(f"{label}: totalPapers={registry.get('totalPapers')} but {len(papers)} entries")
        subject_dir = reg_path.parent.name
        if registry.get("subject") and registry["subject"] != subject_dir:
            report.warn(f"{label}: subject='{registry.get('subject')}' does not match directory {subject_dir}")
        codes = [p.get("paperCode") for p in papers if isinstance(p, dict)]
        for code, count in Counter(codes).items():
            if count > 1:
                report.warn(f"{label}: duplicate paperCode '{code}' ({count}x)")
        for paper in papers:
            if not isinstance(paper, dict):
                report.error(f"{label}: registry entry is not an object")
                continue
            code = paper.get("paperCode")
            file_name = paper.get("fileName")
            if not code or not file_name:
                report.warn(f"{label}: registry entry missing paperCode or fileName")
                continue
            paper_path = reg_path.parent / file_name
            if not paper_path.exists():
                report.warn(f"{label}: {code} references missing file {file_name}")
            metas[(subject_dir, code)] = paper

    return metas


def main() -> int:
    report = Report()
    metas = validate_registries(report)

    paper_paths = sorted(DATA.glob("CST*/CST*-P*.json"))
    if len(paper_paths) != 25:
        report.warn(f"_data: expected 25 paper JSONs, found {len(paper_paths)}")

    pilot_count = 0
    legacy_count = 0
    question_count = 0

    for path in paper_paths:
        try:
            paper = load_json(path)
        except Exception as exc:
            report.error(f"{path.relative_to(ROOT)}: invalid JSON: {exc}")
            continue

        meta = metas.get((path.parent.name, paper.get("paperCode")))
        validate_common(paper, path, meta, report)
        questions = paper.get("questions", [])
        if isinstance(questions, list):
            question_count += len(questions)

        schema = paper.get("schemaVersion")
        if schema == "pilot-v1":
            pilot_count += 1
            validate_pilot_root(paper, path, report)
            fmt = validate_pilot_format(paper, path, report)
            if fmt:
                validate_pilot_questions(paper, path, fmt, report)
            validate_pilot_registry(paper, path, meta, report)
        else:
            legacy_count += 1
            if paper.get("paperFormat"):
                report.warn(f"{path.relative_to(ROOT)}: has paperFormat but no recognized schemaVersion; viewer fallback will use it as-is")

    report.info(f"validated {len(paper_paths)} paper files: {pilot_count} rebuilt pilot-v1, {legacy_count} legacy")
    report.info(f"validated {question_count} question objects")
    print()
    print(f"SUMMARY: {len(report.errors)} error(s), {len(report.warnings)} warning(s)")
    if report.errors:
        print("RESULT: FAIL — rebuilt-paper schema errors must be fixed")
        return 1
    print("RESULT: PASS — rebuilt papers valid; legacy warnings are non-fatal fallback-compatibility notes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
