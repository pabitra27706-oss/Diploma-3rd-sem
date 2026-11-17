"""Source-level contracts for the responsive home header and menu.

This cannot prove rendered layout or focus visibility; those need a real browser.
"""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parent.parent


class HeaderParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.header_links = []
        self.menu_links = []
        self.menu_buttons = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in {'meta', 'link', 'use', 'input', 'br', 'hr', 'img', 'path', 'circle', 'line'}:
            self.stack.append((tag, attrs))
        in_header = any(node == 'header' and 'app-header' in attr.get('class', '').split()
                        for node, attr in self.stack)
        in_menu = any(node == 'nav' and attr.get('aria-label') == 'Side menu navigation'
                      for node, attr in self.stack)
        if tag == 'a' and in_header:
            self.header_links.append(attrs)
        if tag == 'a' and in_menu:
            self.menu_links.append(attrs)
        if tag == 'button' and in_header:
            self.menu_buttons.append(attrs)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                return


class HomeHeaderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / 'index.html').read_text(encoding='utf-8')
        cls.css = (ROOT / 'assets/css/main.css').read_text(encoding='utf-8')
        cls.parsed = HeaderParser()
        cls.parsed.feed(cls.html)

    def test_all_existing_header_destinations_remain_in_menu_and_desktop_header(self):
        destinations = {'search.html', 'today.html', 'settings.html', 'coverage.html'}
        self.assertTrue(destinations.issubset({a.get('href') for a in self.parsed.menu_links}))
        desktop = {a.get('href') for a in self.parsed.header_links
                   if 'header-link' in a.get('class', '').split()}
        self.assertEqual(desktop, destinations)

    def test_small_header_search_has_accessible_label_and_relative_url(self):
        search = [a for a in self.parsed.header_links if 'header-search' in a.get('class', '').split()]
        self.assertEqual(len(search), 1)
        self.assertEqual(search[0].get('href'), 'search.html')
        self.assertTrue(search[0].get('aria-label'))
        self.assertIn('icon-btn', search[0].get('class', '').split())

    def test_menu_and_theme_buttons_remain_accessible(self):
        buttons = {b.get('id'): b for b in self.parsed.menu_buttons}
        self.assertTrue(buttons['themeToggle'].get('aria-label'))
        self.assertEqual(buttons['menuBtn'].get('aria-controls'), 'sideMenu')
        self.assertEqual(buttons['menuBtn'].get('aria-expanded'), 'false')

    def test_header_can_grow_and_offscreen_menu_is_not_focusable(self):
        self.assertRegex(self.css, r'(?s)\.app-header\s*\{[^}]*position:\s*sticky')
        self.assertRegex(self.css, r'(?s)\.app-header\s*\{[^}]*min-height:\s*var\(--header-height\)')
        self.assertRegex(self.css, r'(?s)\.app-header\s*\{[^}]*flex-wrap:\s*wrap')
        self.assertRegex(self.css, r'(?s)\.side-menu\s*\{[^}]*visibility:\s*hidden')
        self.assertRegex(self.css, r'(?s)\.side-menu\.active\s*\{[^}]*visibility:\s*visible')

    def test_responsive_rules_hide_text_links_not_icon_search(self):
        self.assertRegex(self.css, r'(?s)\.header-search\s*\{[^}]*display:\s*none')
        self.assertRegex(self.css, r'(?s)@media\s*\(max-width:\s*1024px\).*?\.header-link\s*\{[^}]*display:\s*none')
        self.assertRegex(self.css, r'(?s)@media\s*\(max-width:\s*1024px\).*?\.header-search\s*\{[^}]*display:\s*flex')
        self.assertRegex(self.css, r'(?s)@media\s*\(max-width:\s*320px\).*?\.header-search\s*\{[^}]*display:\s*none')


if __name__ == '__main__':
    unittest.main()
