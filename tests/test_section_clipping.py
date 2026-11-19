"""Guardrail: an OPEN unit section must never be height-clipped.

The owner's phone screenshots showed unit-section body text painted on top of
neighbouring sections — the words of two sections interleaved on one screen.
The cause was a `max-height: 6000px` cap on the resting `.section-content`.
A long section renders well past 6000px on a phone (CST203 Unit 1
`#collections` ~8,200px, `#long-questions` ~8,300px), so the tail of the
section was cut off, and because `body[data-page="unit"] .section:has(
.table-wrapper) { overflow: visible }` exists to un-clip the sticky table
column, the overflowing text painted over the next section instead of being
clipped.

151 tests passed while this was live, so this file exists to make the failure
mode testable without a browser: it asserts the CSS invariants the collapse
mechanism depends on, and it estimates which sections would have been clipped.

Why an estimate is acceptable here: the point is not pixel truth, it is that a
section obviously taller than the cap cannot silently ship again. The estimate
is deliberately generous (assumes a narrow phone, no wrapping advantage), so it
under-reports rather than over-reports risk. A section flagged here should be
looked at on a device; a section not flagged is not a claim of correctness.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS = (ROOT / 'subjects/units-com/common.css').read_text(encoding='utf-8')
JS = (ROOT / 'subjects/units-com/common.js').read_text(encoding='utf-8')

# Phone-ish rendering constants. 360px viewport, 16px root, unit body copy at
# 1.0125rem / 1.78 line-height, ~31 characters per line inside the content
# padding, ~5.6 characters per word; monospace <pre> never wraps at ~22px a line.
PHONE_VIEWPORT = 360
BODY_LINE_PX = 16 * 1.0125 * 1.78
CHARS_PER_LINE = 31
CHARS_PER_WORD = 5.6
PRE_LINE_PX = 22


def rule_body(selector):
    """Return the declaration block for an exact selector, or None."""
    match = re.search(
        r'(?m)^' + re.escape(selector) + r'\s*\{([^}]*)\}',
        CSS,
    )
    return match.group(1) if match else None


def estimated_height(body_html):
    """Rough rendered height in px of a section's inner HTML on a phone."""
    pres = re.findall(r'<pre[^>]*>(.*?)</pre>', body_html, re.S)
    pre_px = 0
    for block in pres:
        lines = re.sub(r'<[^>]+>', '', block)
        pre_px += (lines.count('\n') + 1) * PRE_LINE_PX
    prose = re.sub(r'<[^>]+>', ' ', re.sub(r'<pre[^>]*>.*?</pre>', '', body_html, flags=re.S))
    words = len(prose.split())
    words_per_line = CHARS_PER_LINE / CHARS_PER_WORD
    prose_px = (words / words_per_line) * BODY_LINE_PX
    return pre_px + prose_px


def sections():
    """(subject, unit, section-id, inner-html) for every shipped unit file."""
    for path in sorted((ROOT / 'subjects').glob('*/units/unit-*.html')):
        subject = path.parent.parent.name
        unit = re.search(r'unit-(\d+)\.html$', path.name).group(1)
        raw = path.read_text(encoding='utf-8')
        for sid, inner in re.findall(
            r'<section class="section" id="([^"]+)">(.*?)</section>', raw, re.S
        ):
            yield subject, unit, sid, inner


class SectionClippingTests(unittest.TestCase):
    def test_open_section_content_has_no_fixed_height_cap(self):
        block = rule_body('.section-content')
        self.assertIsNotNone(block, '.section-content rule is missing')
        self.assertNotRegex(
            block, r'max-height:\s*\d+px',
            'an open .section-content must not be capped at a fixed pixel height; '
            'a cap shorter than a real section clips it and paints the overflow '
            'over the next section',
        )
        self.assertRegex(block, r'max-height:\s*none')

    def test_open_section_content_does_not_clip(self):
        block = rule_body('.section-content')
        self.assertIsNotNone(block)
        self.assertNotRegex(
            block, r'overflow:\s*hidden',
            'the resting .section-content must not clip; only .collapsed may',
        )

    def test_collapsed_section_still_clips_and_hides(self):
        block = re.search(r'\.section-content\.collapsed\s*\{([^}]*)\}', CSS).group(1)
        self.assertRegex(block, r'max-height:\s*0')
        self.assertRegex(block, r'overflow:\s*hidden',
                         'a collapsed section must clip, or its text shows through')
        self.assertRegex(block, r'opacity:\s*0')

    def test_expand_measures_height_before_pinning(self):
        # Pinning max-height to a scrollHeight measured while the element is
        # still clipped is what would re-introduce the bug after the CSS fix.
        fn = re.search(r'function expandSection\([^)]*\)\s*\{(.*?)\n  \}', JS, re.S)
        self.assertIsNotNone(fn, 'expandSection not found in common.js')
        body = fn.group(1)
        self.assertIn('remove("collapsed")', body)
        # Anchor on the ASSIGNMENT, not the first mention: the comment above the
        # code mentions scrollHeight too, and a bare .index() found the comment.
        measure = body.index('var fullHeight = contentEl.scrollHeight')
        unbind = body.index('contentEl.style.maxHeight = "none"')
        self.assertLess(
            unbind, measure,
            'expandSection must clear the inline cap before measuring scrollHeight',
        )
        self.assertIn('contentEl.style.maxHeight = fullHeight + "px"', body)

    def test_no_unit_section_is_far_taller_than_the_old_cap(self):
        # Regression tripwire, not a pass mark: reports sections that the old
        # 6000px cap clipped. With the cap gone these render fully, so this test
        # documents the blast radius and fails if the number of very long
        # sections explodes (which would signal a content/pagination problem).
        longest = []
        for subject, unit, sid, inner in sections():
            height = estimated_height(inner)
            if height > 6000:
                longest.append((subject, unit, sid, int(height)))
        self.assertLess(
            len(longest), 30,
            f'{len(longest)} unit sections now exceed the old 6000px cap: {longest[:10]}',
        )

    def test_every_shipped_unit_file_has_more_than_one_section(self):
        # Cheap sanity check that the parser above is really looking at units;
        # if the markup changed shape the tests above would pass vacuously.
        counted = {}
        for subject, unit, sid, _inner in sections():
            counted[(subject, unit)] = counted.get((subject, unit), 0) + 1
        self.assertGreater(len(counted), 20, f'only parsed {len(counted)} unit pages')
        for key, count in counted.items():
            self.assertGreater(count, 5, f'{key} parsed only {count} sections')


if __name__ == '__main__':
    unittest.main()
