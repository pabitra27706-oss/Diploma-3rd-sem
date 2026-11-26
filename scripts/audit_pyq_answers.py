#!/usr/bin/env python3
"""Read-only structural & depth validator for PYQ model answers (Phase 18).

Never modifies any file. Audits `_data/CST*/CST*-P*.json` against the binding
Phase 18 Authoring Standard (`docs/phases/18-pyq-answer-expansion/authoring-standard.md`):
  - Zero raw course codes (`CST20x` / `SI201`) or internal question IDs inside `answer`
  - Zero raw LaTeX `$...$` math delimiters or legacy `**Model answer:**` prefixes
  - Zero unclosed fenced code blocks (odd ``` count)
  - Zero `* ` unordered bullet markers outside code fences (`- ` required)
  - Pipe-safe GFM table validation (consistent column count across header/separator/rows)
  - `[!COMPARE]` box validation (must hold a >=3-column table led by Parameter/Basis/Feature/Aspect/Criterion)
  - Comparison-stem detection (`differentiate`/`distinguish`/`compare`/`difference between`/`vs` at >=2 marks)
  - Multi-part (`subparts` length >= 2, marks >= 6) `[!MARKS]` callout check
  - Mark-proportional word-count floor check (`--strict` fails on structural defects or below-floor answers)

Usage:
    python3 scripts/audit_pyq_answers.py                      # summary report across all 28 papers
    python3 scripts/audit_pyq_answers.py --subject CST207     # audit one subject
    python3 scripts/audit_pyq_answers.py --subject CST207 --strict
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / '_data'

RAW_CODE_RE = re.compile(r'\b(?:CST\d{3}|SI201)\b')
RAW_QID_RE = re.compile(r'\bCST\d{3}-(?:P\d{3}-|U\d+-)?Q\d+\b')
LEGACY_PREFIX_RE = re.compile(r'^\s*\*\*Model answer:\*\*', re.I)
RAW_LATEX_RE = re.compile(r'(?<!\\)\$[^$\n]{1,40}(?<!\\)\$')
COMPARE_STEM_RE = re.compile(
    r'\b(?:differentiate|distinguish|difference(?:s)?\s+between|compare\s+and\s+contrast|'
    r'compare\s+between|contrast\s+between|comparison\s+between|\bvs\.?\b|\bversus\b)\b',
    re.I,
)
PARAM_HEADERS = {'parameter', 'basis', 'feature', 'aspect', 'criterion', 'property', 'attribute', 'characteristic'}


def split_table_row(line: str) -> list[str]:
    s = line.strip()
    if not s or '|' not in s:
        return []
    cells: list[str] = []
    cur: list[str] = []
    in_tick = False
    i = 0
    while i < len(s):
        ch = s[i]
        if ch == '\\' and i + 1 < len(s) and s[i + 1] in {'|', '`', '\\'}:
            cur.append(s[i + 1])
            i += 2
            continue
        if ch == '`':
            in_tick = not in_tick
            cur.append(ch)
            i += 1
            continue
        if ch == '|' and not in_tick:
            cells.append(''.join(cur).strip())
            cur = []
            i += 1
            continue
        cur.append(ch)
        i += 1
    cells.append(''.join(cur).strip())
    if s.startswith('|') and cells and cells[0] == '':
        cells.pop(0)
    if s.endswith('|') and not s.endswith(r'\|') and cells and cells[-1] == '':
        cells.pop()
    return cells


def is_separator_row(cells: list[str]) -> bool:
    return len(cells) >= 2 and all(bool(re.match(r'^:?-{2,}:?$', c.strip())) for c in cells)


def strip_code_fences(text: str) -> tuple[str, int]:
    lines = text.splitlines()
    outside: list[str] = []
    fence_count = 0
    in_fence = False
    for line in lines:
        if line.strip().startswith('```'):
            fence_count += 1
            in_fence = not in_fence
            continue
        if not in_fence:
            outside.append(line)
    return '\n'.join(outside), fence_count


def word_count(text: str) -> int:
    cleaned = re.sub(r'[|`>#*_~—–-]+', ' ', text)
    return len([w for w in cleaned.split() if any(ch.isalnum() for ch in w)])


def min_word_floor(q: dict) -> int:
    marks = int(q.get('marks') or 1)
    is_mcq = bool(q.get('options')) or q.get('type') == 'mcq'
    if is_mcq:
        return 50 if marks >= 2 else 35
    if marks <= 1:
        return 28
    if marks == 2:
        return 55
    if marks == 3:
        return 85
    if marks == 4:
        return 110
    if marks == 5:
        return 145
    if marks == 6:
        return 190
    if marks in (7, 8):
        return 235
    return 280


def validate_tables_in_lines(lines: list[str], require_compare_param: bool = False) -> list[str]:
    issues: list[str] = []
    i = 0
    found_table = False
    while i < len(lines):
        line = lines[i].strip()
        if '|' in line and len(split_table_row(line)) >= 2:
            if i + 1 < len(lines) and '|' in lines[i + 1]:
                t_lines: list[str] = []
                while i < len(lines) and '|' in lines[i].strip() and len(split_table_row(lines[i])) >= 2:
                    t_lines.append(lines[i].strip())
                    i += 1
                if len(t_lines) >= 2:
                    found_table = True
                    header = split_table_row(t_lines[0])
                    if require_compare_param:
                        if len(header) < 3:
                            issues.append(f'[!COMPARE] table has {len(header)} columns (minimum 3 required)')
                        first_col = re.sub(r'[*_`]+', '', header[0]).strip().lower()
                        if not any(tok in first_col for tok in PARAM_HEADERS):
                            issues.append(f'[!COMPARE] first column "{header[0]}" must be Parameter/Basis/Feature/Aspect')
                    for r_idx, raw_row in enumerate(t_lines[1:], start=2):
                        cells = split_table_row(raw_row)
                        if len(cells) != len(header):
                            issues.append(f'table row {r_idx} has {len(cells)} cells vs {len(header)} header cells')
                    continue
        i += 1
    if require_compare_param and not found_table:
        issues.append('[!COMPARE] block contains no Markdown comparison table')
    return issues


def audit_question(q: dict) -> dict:
    qid = q.get('id', '<unknown>')
    ans = str(q.get('answer') or '')
    structural: list[str] = []
    depth: list[str] = []

    if not ans.strip():
        structural.append('empty answer')
        return {'id': qid, 'words': 0, 'floor': min_word_floor(q), 'structural': structural, 'depth': ['empty answer']}

    if q.get('answerStatus', 'model-answer') != 'model-answer':
        structural.append(f"unexpected answerStatus={q.get('answerStatus')!r}")

    outside, fence_count = strip_code_fences(ans)
    if fence_count % 2 != 0:
        structural.append('unclosed code fence (odd ``` count)')

    if RAW_QID_RE.search(ans):
        structural.append('contains raw internal question ID')
    if RAW_CODE_RE.search(outside):
        structural.append('contains raw course code (use display name C/Python/DS/CSO/Algorithms)')
    if LEGACY_PREFIX_RE.search(ans):
        depth.append('retains legacy "**Model answer:**" boilerplate prefix')
    if RAW_LATEX_RE.search(outside):
        structural.append('contains raw $...$ LaTeX math (use Unicode symbols instead)')

    outside_lines = outside.splitlines()
    for ln in outside_lines:
        stripped = ln.lstrip()
        if stripped.startswith('* ') and not stripped.startswith('**'):
            structural.append('uses "* " bullet marker outside code fence (use "- ")')
            break

    # Validate top-level and blockquote tables + [!COMPARE] blocks
    idx = 0
    has_compare_box = False
    has_marks_callout = False
    non_quote_lines: list[str] = []
    while idx < len(outside_lines):
        ln = outside_lines[idx]
        if ln.strip().startswith('>'):
            q_block: list[str] = []
            while idx < len(outside_lines) and outside_lines[idx].strip().startswith('>'):
                q_block.append(re.sub(r'^\s*>\s?', '', outside_lines[idx]))
                idx += 1
            head = q_block[0].strip() if q_block else ''
            m = re.match(r'^\[!(COMPARE|MARKS|FORMULA|KEY|TRAP)\]', head, re.I)
            if m:
                kind = m.group(1).upper()
                if kind == 'COMPARE':
                    has_compare_box = True
                    structural.extend(validate_tables_in_lines(q_block[1:], require_compare_param=True))
                elif kind == 'MARKS':
                    has_marks_callout = True
                    structural.extend(validate_tables_in_lines(q_block[1:], require_compare_param=False))
                else:
                    structural.extend(validate_tables_in_lines(q_block[1:], require_compare_param=False))
            else:
                structural.extend(validate_tables_in_lines(q_block, require_compare_param=False))
            continue
        non_quote_lines.append(ln)
        idx += 1

    structural.extend(validate_tables_in_lines(non_quote_lines, require_compare_param=False))

    marks = int(q.get('marks') or 1)
    is_mcq = bool(q.get('options')) or q.get('type') == 'mcq'
    stem = str(q.get('question') or '')
    subparts = q.get('subparts') or []
    full_stem = stem + ' ' + ' '.join(str(sp.get('text') or '') for sp in subparts if isinstance(sp, dict))

    if not is_mcq and marks >= 2 and COMPARE_STEM_RE.search(full_stem) and not has_compare_box:
        depth.append('comparison prompt lacks `[!COMPARE]` box')

    if not is_mcq and marks >= 6 and len(subparts) >= 2 and not has_marks_callout:
        depth.append('multi-part >=6m question lacks `[!MARKS]` callout')

    has_bullets_or_steps = any(
        re.match(r'^(?:-\s+|\d+[\.\)]\s+)', ln.strip()) for ln in outside_lines
    )
    if not has_bullets_or_steps and not has_compare_box:
        depth.append('lacks `- ` bullets or numbered steps')

    wc = word_count(ans)
    floor = min_word_floor(q)
    if wc < floor:
        depth.append(f'word count {wc} below {marks}m floor ({floor}w)')

    return {
        'id': qid,
        'marks': marks,
        'is_mcq': is_mcq,
        'words': wc,
        'floor': floor,
        'has_compare': has_compare_box,
        'has_marks': has_marks_callout,
        'structural': structural,
        'depth': depth,
    }


def iter_papers(subject: str | None = None, paper: str | None = None) -> list[Path]:
    papers: list[Path] = []
    for subj_dir in sorted(DATA_DIR.glob('CST*')):
        if not subj_dir.is_dir():
            continue
        if subject and subj_dir.name != subject:
            continue
        for p in sorted(subj_dir.glob('CST*-P*.json')):
            if paper and paper not in p.name:
                continue
            papers.append(p)
    return papers


def run_audit(subject: str | None = None, paper: str | None = None) -> dict:
    files = iter_papers(subject=subject, paper=paper)
    paper_reports = []
    total_q = 0
    structural_q = 0
    depth_q = 0
    compare_boxes = 0
    marks_callouts = 0

    for path in files:
        data = json.loads(path.read_text(encoding='utf-8'))
        q_reports = [audit_question(q) for q in data.get('questions', [])]
        s_bad = [r for r in q_reports if r['structural']]
        d_bad = [r for r in q_reports if r['depth']]
        total_q += len(q_reports)
        structural_q += len(s_bad)
        depth_q += len(d_bad)
        compare_boxes += sum(1 for r in q_reports if r['has_compare'])
        marks_callouts += sum(1 for r in q_reports if r['has_marks'])
        paper_reports.append({
            'file': path.relative_to(ROOT).as_posix(),
            'questions': len(q_reports),
            'structuralIssues': len(s_bad),
            'depthIssues': len(d_bad),
            'compareBoxes': sum(1 for r in q_reports if r['has_compare']),
            'marksCallouts': sum(1 for r in q_reports if r['has_marks']),
            'details': [r for r in q_reports if r['structural'] or r['depth']],
        })

    return {
        'papers': len(files),
        'questions': total_q,
        'structuralIssues': structural_q,
        'depthIssues': depth_q,
        'compareBoxes': compare_boxes,
        'marksCallouts': marks_callouts,
        'paperReports': paper_reports,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--subject', help='Filter by subject code, e.g. CST207')
    parser.add_argument('--paper', help='Substring filter on paper filename')
    parser.add_argument('--strict', action='store_true', help='Exit 1 if any structural or depth issue exists')
    parser.add_argument('--structural-only', action='store_true', help='Exit 1 only on structural syntax errors')
    parser.add_argument('--verbose', action='store_true', help='List individual question findings')
    args = parser.parse_args(argv)

    summary = run_audit(subject=args.subject, paper=args.paper)
    scope = args.subject or args.paper or 'all subjects'
    print(
        f"PYQ answer audit ({scope}): {summary['papers']} papers, {summary['questions']} questions · "
        f"structural={summary['structuralIssues']} · depth/format={summary['depthIssues']} · "
        f"[!COMPARE]={summary['compareBoxes']} · [!MARKS]={summary['marksCallouts']}"
    )
    for pr in summary['paperReports']:
        print(
            f"  {pr['file']}: {pr['questions']} Q | structural={pr['structuralIssues']} "
            f"| depth={pr['depthIssues']} | compare={pr['compareBoxes']} | marks={pr['marksCallouts']}"
        )
        if args.verbose:
            for item in pr['details']:
                reasons = item['structural'] + item['depth']
                print(f"    - {item['id']} ({item['marks']}m, {item['words']}w): {'; '.join(reasons)}")

    if args.strict and (summary['structuralIssues'] > 0 or summary['depthIssues'] > 0):
        return 1
    if args.structural_only and summary['structuralIssues'] > 0:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
