#!/usr/bin/env python3
"""Measured, dependency-free accessibility audit for this site (Phase 7).

This script exists so Phase 7 numbers are reproducible instead of asserted. It
measures what can be measured from source without a browser:

  structure   <main> landmarks, skip links, <h1> count, heading-order jumps
  forms       controls without a label, duplicate ids
  contrast    ratios computed from the shipped CSS tokens (not screenshots)
  motion      first-party CSS files that animate, and whether reduced motion
              is handled per file and for every page
  targets     declared CSS box sizes of interactive controls

It deliberately does NOT claim anything only a browser can prove: rendered
contrast, real focus visibility, zoom/reflow, screen-reader output, tap
accuracy or Bengali font rendering. Those stay in Phase 10.

Usage:
    python3 scripts/audit_accessibility.py              # human summary
    python3 scripts/audit_accessibility.py --json       # machine numbers
    python3 scripts/audit_accessibility.py --fail       # exit 1 on a regression
    python3 scripts/audit_accessibility.py --baseline   # write the checked-in
                                                       # baseline the tests use
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASELINE = ROOT / 'docs/phases/07-inclusion-trust/audit-baseline.json'
SKIP_DIRS = {'.git', 'node_modules', 'webflow', '.github'}

# Interactive-looking selectors whose declared box must reach 24x24 CSS px
# (WCAG 2.2 SC 2.5.8). Icon *glyphs* are allowed to be small; the control that
# receives the pointer is not.
CONTROL_HINT = re.compile(
    r'(?:^|[\s,>+~])(?:button|btn|chip|tab|pill|toggle|close|icon|checkbox|radio|switch|menu-btn|remove|tool)', re.I
)


def walk(suffix: str) -> list[Path]:
    out: list[Path] = []
    for root, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in sorted(files):
            if name.endswith(suffix):
                out.append(Path(root) / name)
    return sorted(out)


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


# ── contrast ────────────────────────────────────────────────────────────────


def _srgb(channel: float) -> float:
    return channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4


def luminance(hex_colour: str) -> float:
    value = hex_colour.strip().lstrip('#')
    if len(value) == 3:
        value = ''.join(c * 2 for c in value)
    r, g, b = (int(value[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return 0.2126 * _srgb(r) + 0.7152 * _srgb(g) + 0.0722 * _srgb(b)


def contrast(foreground: str, background: str) -> float:
    a, b = luminance(foreground), luminance(background)
    high, low = max(a, b), min(a, b)
    return round((high + 0.05) / (low + 0.05), 2)


def _blocks(text: str):
    """Yield (selector, body, media) for every CSS rule, tracking @media context."""
    for match in re.finditer(r'(@media[^{]+)\{', text):
        start = match.end()
        depth, cursor = 1, start
        while cursor < len(text) and depth:
            if text[cursor] == '{':
                depth += 1
            elif text[cursor] == '}':
                depth -= 1
            cursor += 1
        media = ' '.join(match.group(1).split())
        for inner in re.finditer(r'([^{}]+)\{([^{}]*)\}', text[start:cursor]):
            yield ' '.join(inner.group(1).split()), inner.group(2), media
    stripped = re.sub(r'@media[^{]+\{(?:[^{}]|\{[^{}]*\})*\}', '', text)
    for inner in re.finditer(r'([^{}]+)\{([^{}]*)\}', stripped):
        selector = ' '.join(inner.group(1).split())
        if selector.startswith('@'):
            continue
        yield selector, inner.group(2), ''


def css_vars(path: Path) -> list[dict]:
    """Every custom property declaration with the selector and media it sits in."""
    out = []
    for selector, body, media in _blocks(path.read_text(encoding='utf-8', errors='replace')):
        for name, value in re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', body):
            raw = value.strip()
            if re.fullmatch(r'#[0-9a-fA-F]{3,8}', raw) or re.fullmatch(r'var\(\s*--[\w-]+\s*\)', raw):
                out.append({'name': name, 'value': raw, 'selector': selector, 'media': media})
    return out


def resolve(tokens: list[dict], name: str, *, dark: bool = False) -> str | None:
    """Resolve a token to the hex a painted page actually gets.

    `tokens` is a *page cascade*: the shared palette/styles from
    `assets/css/variables.css` first, then the page's own area stylesheet. The
    site always sets `data-theme` on `<html>` before first paint, so a
    declaration applies when
      light  -> its selector is not `[data-theme="dark"]`-scoped and its media
                query is not a dark-mode query;
      dark   -> its selector is not `[data-theme="light"]`-scoped (base, the
                `[data-theme="dark"]` block and `prefers-color-scheme: dark`
                all apply).
    Later declarations win, exactly as in the browser for equal specificity.
    `var(--alias)` chains are followed with a depth cap, so an area token that
    aliases a palette entry (`--bg-primary: var(--c-white)`) still resolves.
    """

    def applies(row: dict, dark_palette: bool) -> bool:
        selector, media = row['selector'], row['media']
        if dark_palette:
            return '[data-theme="light"]' not in selector
        return '[data-theme="dark"]' not in selector and 'prefers-color-scheme: dark' not in media

    def pool(token: str, dark_palette: bool) -> list[dict]:
        return [row for row in tokens if row['name'] == token and applies(row, dark_palette)]

    value = None
    for _ in range(8):
        rows = pool(name, dark)
        if not rows:
            return None
        value = rows[-1]['value'].strip()
        alias = re.fullmatch(r'var\(\s*(--[\w-]+)\s*\)', value)
        if not alias:
            break
        name = alias.group(1)
    if value is None or not re.fullmatch(r'#[0-9a-fA-F]{3,8}', value):
        return None
    return value


VARIABLES = ROOT / 'assets/css/variables.css'
QUIZ = ROOT / 'quiz/css/common.css'
PRACTICE = ROOT / 'practice/css/index.css'
PYQ_ANSWERS = ROOT / 'pyq/css/answers.css'
UNITS = ROOT / 'subjects/units-com/common.css'

# (label, source file, theme selector, foreground token, background token,
#  required ratio, why)
CONTRAST_PAIRS = [
    ('body text (light)', VARIABLES, False, '--text-primary-light', '--bg-primary-light', 4.5, '1.4.3'),
    ('secondary text (light)', VARIABLES, False, '--text-secondary-light', '--bg-primary-light', 4.5, '1.4.3'),
    ('secondary text on tint (light)', VARIABLES, False, '--text-secondary-light', '--bg-secondary-light', 4.5, '1.4.3'),
    ('tertiary text (light)', VARIABLES, False, '--text-tertiary-light', '--bg-primary-light', 4.5, '1.4.3'),
    ('tertiary text on tint (light)', VARIABLES, False, '--text-tertiary-light', '--bg-secondary-light', 4.5, '1.4.3'),
    ('accent as text (light)', VARIABLES, False, '--accent-primary', '--bg-primary-light', 4.5, '1.4.3'),
    ('white on accent (light)', VARIABLES, False, '--bg-primary-light', '--accent-primary', 4.5, '1.4.3'),
    ('white on success', VARIABLES, False, '--bg-primary-light', '--accent-success', 4.5, '1.4.3'),
    ('white on error/danger', VARIABLES, False, '--bg-primary-light', '--accent-error', 4.5, '1.4.3'),
    ('white on warning', VARIABLES, False, '--bg-primary-light', '--accent-warning', 4.5, '1.4.3'),
    ('white on info', VARIABLES, False, '--bg-primary-light', '--accent-info', 4.5, '1.4.3'),
    ('white on secondary accent', VARIABLES, False, '--bg-primary-light', '--accent-secondary', 4.5, '1.4.3'),
    ('body text (dark)', VARIABLES, True, '--text-primary-dark', '--bg-primary-dark', 4.5, '1.4.3'),
    ('secondary text (dark)', VARIABLES, True, '--text-secondary-dark', '--bg-primary-dark', 4.5, '1.4.3'),
    ('tertiary text (dark)', VARIABLES, True, '--text-tertiary-dark', '--bg-secondary-dark', 4.5, '1.4.3'),
    ('tertiary text on card (dark)', VARIABLES, True, '--text-tertiary-dark', '--bg-card-dark', 4.5, '1.4.3'),
    ('accent as text (dark)', VARIABLES, True, '--accent-primary-text-dark', '--bg-primary-dark', 4.5, '1.4.3'),
    ('quiz body text (light)', QUIZ, False, '--text-primary', '--bg-primary', 4.5, '1.4.3'),
    ('quiz secondary text (light)', QUIZ, False, '--text-secondary', '--bg-primary', 4.5, '1.4.3'),
    ('quiz tertiary text (light)', QUIZ, False, '--text-tertiary', '--bg-primary', 4.5, '1.4.3'),
    ('quiz accent as text (light)', QUIZ, False, '--accent', '--bg-primary', 4.5, '1.4.3'),
    ('white on quiz accent', QUIZ, False, '--bg-primary', '--accent', 4.5, '1.4.3'),
    ('white on quiz success', QUIZ, False, '--bg-primary', '--success', 4.5, '1.4.3'),
    ('white on quiz error', QUIZ, False, '--bg-primary', '--error', 4.5, '1.4.3'),
    ('white on quiz warning', QUIZ, False, '--bg-primary', '--warning', 4.5, '1.4.3'),
    ('quiz secondary text (dark)', QUIZ, True, '--text-secondary', '--bg-primary', 4.5, '1.4.3'),
    ('quiz tertiary text (dark)', QUIZ, True, '--text-tertiary', '--bg-primary', 4.5, '1.4.3'),
    ('quiz accent as text (dark)', QUIZ, True, '--accent', '--bg-primary', 4.5, '1.4.3'),
    ('practice muted text', PRACTICE, False, '--text-muted', '--bg-base', 4.5, '1.4.3'),
    ('practice secondary text', PRACTICE, False, '--text-secondary', '--bg-base', 4.5, '1.4.3'),
    ('practice accent as text', PRACTICE, False, '--blue', '--bg-base', 4.5, '1.4.3'),
    ('white on practice accent', PRACTICE, False, '--text-inverse', '--blue', 4.5, '1.4.3'),
    ('white on practice green', PRACTICE, False, '--text-inverse', '--green', 4.5, '1.4.3'),
    ('white on practice red', PRACTICE, False, '--text-inverse', '--red', 4.5, '1.4.3'),
    ('pyq muted text', PYQ_ANSWERS, False, '--text-muted', '--bg-primary', 4.5, '1.4.3'),
    ('pyq secondary text', PYQ_ANSWERS, False, '--text-secondary', '--bg-primary', 4.5, '1.4.3'),
    ('pyq accent as text', PYQ_ANSWERS, False, '--accent', '--bg-primary', 4.5, '1.4.3'),
    ('white on pyq accent', PYQ_ANSWERS, False, '--bg-secondary', '--accent', 4.5, '1.4.3'),
    ('white on pyq success', PYQ_ANSWERS, False, '--bg-secondary', '--success', 4.5, '1.4.3'),
    ('white on pyq danger', PYQ_ANSWERS, False, '--bg-secondary', '--danger', 4.5, '1.4.3'),
    ('unit body text', UNITS, False, '--text-primary', '--bg-primary', 4.5, '1.4.3'),
    ('unit secondary text', UNITS, False, '--text-secondary', '--bg-primary', 4.5, '1.4.3'),
    ('unit muted text', UNITS, False, '--text-muted', '--bg-primary', 4.5, '1.4.3'),
    ('unit primary on card', UNITS, False, '--primary', '--card-bg', 4.5, '1.4.3'),
    ('focus ring on light (3:1 non-text)', VARIABLES, False, '--focus-ring-solid', '--bg-primary-light', 3.0, '1.4.11'),
    ('focus ring on dark (3:1 non-text)', VARIABLES, True, '--focus-ring-solid', '--bg-primary-dark', 3.0, '1.4.11'),
    ('skip link text', ROOT / 'assets/css/base.css', False, '--skip-fg', '--skip-bg', 4.5, '1.4.3'),
    # Phase 9C navy/lavender system (docs/DESIGN.md). Measured from the tokens
    # the pages actually resolve, not from screenshots.
    ('hub accent as text (light)', VARIABLES, False, '--hub-accent-solid', '--bg-primary-light', 4.5, '1.4.3'),
    ('hub white on accent (light)', VARIABLES, False, '--bg-primary-light', '--hub-accent-solid', 4.5, '1.4.3'),
    ('hub accent on card (light)', VARIABLES, False, '--hub-accent-solid', '--bg-card-light', 4.5, '1.4.3'),
    ('hub accent as text (dark)', VARIABLES, True, '--hub-accent-text-dark', '--bg-primary-dark', 4.5, '1.4.3'),
    ('hub accent on card (dark)', VARIABLES, True, '--hub-accent-text-dark', '--bg-card-dark', 4.5, '1.4.3'),
    ('hub secondary on tint (light)', VARIABLES, False, '--text-secondary-light', '--bg-tertiary-light', 4.5, '1.4.3'),
    ('hub secondary on tint (dark)', VARIABLES, True, '--text-secondary-dark', '--bg-tertiary-dark', 4.5, '1.4.3'),
    ('hub tertiary on card (light)', VARIABLES, False, '--text-tertiary-light', '--bg-card-light', 4.5, '1.4.3'),
    ('hub focus ring (light)', VARIABLES, False, '--focus-ring-solid', '--bg-primary-light', 3.0, '1.4.11'),
    ('hub focus ring (dark)', VARIABLES, True, '--focus-ring-solid', '--bg-primary-dark', 3.0, '1.4.11'),
]


def measure_contrast() -> list[dict]:
    cache: dict[Path, list[dict]] = {}
    base_tokens = css_vars(VARIABLES)

    def tokens_for(path: Path) -> list[dict]:
        """The cascade a page sees: shared tokens first, its own sheet after."""
        if path not in cache:
            own = css_vars(path)
            cache[path] = own if path == VARIABLES else base_tokens + own
        return cache[path]

    rows = []
    for label, path, dark, fg, bg, required, why in CONTRAST_PAIRS:
        if not path.exists():
            rows.append({'label': label, 'ratio': None, 'required': required, 'pass': False,
                         'where': rel(path), 'note': 'file missing'})
            continue
        bucket = tokens_for(path)
        fg_value = resolve(bucket, fg, dark=dark)
        bg_value = resolve(bucket, bg, dark=dark)
        theme = 'dark' if dark else 'light'
        if not fg_value or not bg_value:
            rows.append({'label': label, 'ratio': None, 'required': required, 'pass': False,
                         'where': f'{rel(path)} [{theme}]',
                         'note': f'unresolved token {fg if not fg_value else bg} ({theme} palette)'})
            continue
        ratio = contrast(fg_value, bg_value)
        rows.append({
            'label': label, 'ratio': ratio, 'required': required, 'pass': ratio >= required,
            'where': f'{rel(path)} [{theme}]', 'fg': fg_value, 'bg': bg_value, 'why': why,
        })
    return rows


# ── structure ───────────────────────────────────────────────────────────────


HEADING = re.compile(r'<h([1-6])\b[^>]*>', re.I)
SKIP_LINK = re.compile(r'<a\b[^>]*class="[^"]*skip[^"]*"', re.I)
MAIN = re.compile(r'<main\b', re.I)


def page_structure() -> dict:
    pages = walk('.html')
    rows = []
    for path in pages:
        text = path.read_text(encoding='utf-8', errors='replace')
        body = re.sub(r'<script\b.*?</script>', '', text, flags=re.S | re.I)
        levels = [int(m.group(1)) for m in HEADING.finditer(body)]
        jumps = sum(1 for a, b in zip(levels, levels[1:]) if b > a + 1)
        rows.append({
            'page': rel(path),
            'main': len(MAIN.findall(body)),
            'skip': bool(SKIP_LINK.search(body)),
            'h1': levels.count(1),
            'jumps': jumps,
            'headings': levels,
        })
    return {'count': len(rows), 'pages': rows}


# ── controls ────────────────────────────────────────────────────────────────


CONTROL = re.compile(r'<(?:input|select|textarea)\b[^>]*>', re.I)
LABEL_FOR = re.compile(r'<label\b[^>]*for="([^"]+)"', re.I)


def measure_controls() -> dict:
    unlabelled = []
    duplicates = []
    for path in walk('.html'):
        text = path.read_text(encoding='utf-8', errors='replace')
        labels = set(LABEL_FOR.findall(text))
        for match in CONTROL.finditer(text):
            tag = match.group(0)
            if re.search(r'type="(?:hidden|submit|button|reset)"', tag, re.I):
                continue
            if re.search(r'aria-label(?:ledby)?=', tag, re.I):
                continue
            ident = re.search(r'id="([^"]+)"', tag)
            if ident and ident.group(1) in labels:
                continue
            wrapped = text[max(0, match.start() - 400):match.start()]
            if re.search(r'<label\b[^>]*>[^<]*$', wrapped):
                continue
            unlabelled.append({'page': rel(path), 'control': tag[:120]})
        ids = re.findall(r'\sid="([^"]+)"', text)
        dupes = sorted(k for k, n in Counter(ids).items() if n > 1)
        if dupes:
            duplicates.append({'page': rel(path), 'ids': dupes})
    return {'unlabelled': unlabelled, 'duplicate_ids': duplicates}


# ── motion and target size ─────────────────────────────────────────────────


def measure_motion() -> dict:
    css = [p for p in walk('.css') if 'vendor' not in p.parts]
    animated, handled = [], []
    for path in css:
        text = path.read_text(encoding='utf-8', errors='replace')
        if '@keyframes' in text or re.search(r'animation\s*:', text):
            animated.append(rel(path))
        if 'prefers-reduced-motion' in text or 'data-motion="reduced"' in text:
            handled.append(rel(path))
    pages = walk('.html')
    covered = 0
    global_rule = {'assets/css/base.css'}
    for path in pages:
        text = path.read_text(encoding='utf-8', errors='replace')
        if any(rel(ROOT / sheet) in text for sheet in global_rule):
            covered += 1
    return {
        'css_files': len(css),
        'animated_files': sorted(animated),
        'handled_files': sorted(handled),
        'animated_without_local_rule': sorted(set(animated) - set(handled)),
        'pages': len(pages),
        'pages_with_global_reduced_motion': covered,
    }


RULE = re.compile(r'([^{}]+)\{([^{}]*)\}')
DIMENSION = re.compile(r'(min-)?(width|height)\s*:\s*([\d.]+)px')


def measure_targets() -> dict:
    """Rules that pin a control below 24x24 CSS px (WCAG 2.2 SC 2.5.8).

    Only dimensions that make the *control* smaller are reported: a glyph,
    icon or ::before/::after decoration inside a control is not the target.
    """
    small = []
    for path in [p for p in walk('.css') if 'vendor' not in p.parts]:
        for selector, body, _media in _blocks(path.read_text(encoding='utf-8', errors='replace')):
            if not CONTROL_HINT.search(selector):
                continue
            if re.search(r'(svg|::before|::after|\.icon\b|\bi\b|img|span|dot|sep|divider|badge)', selector):
                continue
            dims = [(prefix, axis, float(value)) for prefix, axis, value
                    in DIMENSION.findall(body)]
            pinned = [(axis, value) for prefix, axis, value in dims if not prefix]
            too_small = [f'{axis} {value:g}px' for axis, value in pinned if value < 24]
            if not too_small:
                continue
            floors = [(axis, value) for prefix, axis, value in dims if prefix]
            covered = {(axis) for axis, value in floors if value >= 24}
            remaining = [item for item in too_small if item.split()[0] not in covered]
            if remaining:
                small.append({'file': rel(path), 'selector': selector, 'pinned': remaining})
    return {'below_24': small}


def collect() -> dict:
    structure = page_structure()
    pages = structure['pages']
    return {
        'pages': structure['count'],
        'no_main': sorted(p['page'] for p in pages if p['main'] == 0),
        'no_skip': sorted(p['page'] for p in pages if not p['skip']),
        'h1_not_one': sorted((p['page'], p['h1']) for p in pages if p['h1'] != 1),
        'heading_jump_pages': sorted((p['page'], p['jumps']) for p in pages if p['jumps']),
        'heading_jump_total': sum(p['jumps'] for p in pages),
        'controls': measure_controls(),
        'contrast': measure_contrast(),
        'motion': measure_motion(),
        'targets': measure_targets(),
    }


def summary(data: dict) -> int:
    failures = 0
    print(f'pages measured: {data["pages"]}')
    print(f'  no <main>:            {len(data["no_main"])} {data["no_main"][:4]}')
    print(f'  no skip link:         {len(data["no_skip"])} {data["no_skip"][:4]}')
    print(f'  <h1> count != 1:      {len(data["h1_not_one"])} {data["h1_not_one"][:4]}')
    print(f'  heading-order jumps:  {data["heading_jump_total"]} across '
          f'{len(data["heading_jump_pages"])} pages')
    controls = data['controls']
    print(f'  unlabelled controls:  {len(controls["unlabelled"])} {controls["unlabelled"][:4]}')
    print(f'  duplicate ids:        {len(controls["duplicate_ids"])} {controls["duplicate_ids"][:2]}')
    contrast_rows = data['contrast']
    failing = [row for row in contrast_rows if not row['pass']]
    print(f'contrast pairs measured from tokens: {len(contrast_rows)}; '
          f'below requirement: {len(failing)}')
    for row in failing:
        ratio = 'n/a' if row['ratio'] is None else f'{row["ratio"]}:1'
        print(f'  FAIL {row["label"]}: {ratio} (needs {row["required"]}:1) [{row["where"]}]')
    motion = data['motion']
    print(f'motion: {len(motion["animated_files"])} of {motion["css_files"]} CSS files animate; '
          f'{len(motion["handled_files"])} declare a reduced-motion rule; '
          f'{motion["pages_with_global_reduced_motion"]}/{motion["pages"]} pages load the '
          f'global override')
    if motion['animated_without_local_rule']:
        print('  animated without a local rule: '
              + ', '.join(motion['animated_without_local_rule']))
    small = data['targets']['below_24']
    print(f'target size: {len(small)} control rule(s) below 24x24 CSS px')
    for row in small[:12]:
        print(f'  {row["selector"]} {row["width"]}x{row["height"]} [{row["file"]}]')

    failures += len(data['no_main']) + len(data['no_skip']) + len(data['h1_not_one'])
    failures += data['heading_jump_total'] + len(controls['unlabelled'])
    failures += len(controls['duplicate_ids']) + len(failing) + len(small)
    return failures


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', action='store_true', help='machine-readable output')
    parser.add_argument('--fail', action='store_true', help='non-zero exit on any finding')
    parser.add_argument('--baseline', action='store_true', help='write the checked-in baseline')
    args = parser.parse_args()

    data = collect()
    if args.baseline:
        BASELINE.parent.mkdir(parents=True, exist_ok=True)
        snapshot = {
            'pages': data['pages'],
            'no_main': data['no_main'],
            'no_skip': data['no_skip'],
            'h1_not_one': data['h1_not_one'],
            'heading_jump_total': data['heading_jump_total'],
            'heading_jump_pages': data['heading_jump_pages'],
            'unlabelled_controls': len(data['controls']['unlabelled']),
            'duplicate_ids': len(data['controls']['duplicate_ids']),
            'contrast_failures': [row['label'] for row in data['contrast'] if not row['pass']],
            'contrast_measured': len(data['contrast']),
            'motion_animated_files': len(data['motion']['animated_files']),
            'motion_handled_files': len(data['motion']['handled_files']),
            'pages_with_global_reduced_motion': data['motion']['pages_with_global_reduced_motion'],
            'targets_below_24': len(data['targets']['below_24']),
        }
        BASELINE.write_text(json.dumps(snapshot, indent=2, sort_keys=True) + '\n', encoding='utf-8')
        print(f'wrote {rel(BASELINE)}')
        return 0
    if args.json:
        print(json.dumps(data, indent=2))
        return 0
    findings = summary(data)
    print(f'\ntotal findings: {findings}')
    if args.fail and findings:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
