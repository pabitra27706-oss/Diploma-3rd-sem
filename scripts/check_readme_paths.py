#!/usr/bin/env python3
"""Every path the README quotes must exist (Phase 7.5, item 3).

Rewriting the README is easy; keeping it true is not. This check fails the
build when a link target or an inline `path/like/this` reference no longer
resolves, so a moved file cannot leave a confident-looking lie behind.

Usage:
    python3 scripts/check_readme_paths.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / 'README.md'

# Inline code spans that are commands, globs, identifiers, script basenames or
# historical names, not paths in this tree.
SKIP_SPAN = re.compile(
    r'(^python3\b|^node\b|^git\b|^gh\b|^cd\b|^grep\b|^curl\b|[*<>{}$|]|^--|^[A-Z_]+$'
    r'|^d3s:|^study-2026|^CST20|^SI20|\.json$|^navigator\.|^StudyStorage\.'
    r'|^[a-z-]+$|_data/\*|\.bundle\.js$|^[\w-]+\.(?:py|cjs|js|md|json)$'
    r'|^/[\w./-]*$|^127\.0\.0\.1)'
)


def link_targets(text: str) -> list[str]:
    out = []
    for match in re.finditer(r'\[[^\]]+\]\(([^)\s]+)\)', text):
        target = match.group(1)
        if target.startswith(('http://', 'https://', 'mailto:', '#')):
            continue
        out.append(target.split('#')[0])
    return sorted(set(filter(None, out)))


def inline_paths(text: str) -> list[str]:
    out = []
    for span in re.findall(r'`([^`\n]+)`', text):
        span = span.strip()
        if not span or SKIP_SPAN.search(span):
            continue
        if not re.fullmatch(r'[\w./-]+', span):
            continue
        if '/' not in span and '.' not in span:
            continue
        out.append(span)
    return sorted(set(out))


def main() -> int:
    text = README.read_text(encoding='utf-8')
    missing = []
    checked = 0
    for target in link_targets(text) + inline_paths(text):
        candidate = (ROOT / target).resolve()
        try:
            candidate.relative_to(ROOT)
        except ValueError:
            missing.append(f'{target} (escapes the repository)')
            continue
        checked += 1
        if not candidate.exists():
            missing.append(target)
    print(f'README paths checked: {checked}; missing: {len(missing)}')
    for item in missing:
        print(f'  MISSING {item}')
    return 1 if missing else 0


if __name__ == '__main__':
    sys.exit(main())
