#!/usr/bin/env python3
"""Phase 1 stdlib integrity checks; no network and no content edits."""
from pathlib import Path
import json, re, struct, hashlib, subprocess, sys
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://pabitra27706-oss.github.io/Diploma-3rd-sem/'
errors = []
def require(ok, message):
    if not ok: errors.append(message)
m = json.loads((ROOT/'manifest.json').read_text())
for key in ('id','start_url','scope'):
    require(m.get(key) == './', f'manifest {key} must be ./')
for icon in m['icons']:
    p = ROOT/icon['src']
    data = p.read_bytes()
    require(data[:8] == b'\x89PNG\r\n\x1a\n', f'{p}: invalid PNG')
    size = 'x'.join(map(str,struct.unpack('>II',data[16:24])))
    require(size == icon['sizes'], f'{p}: icon dimensions mismatch')
require({'192x192','512x512'} <= {i['sizes'] for i in m['icons']}, 'required install sizes absent')
sw = (ROOT/'sw.js').read_text()
precache = sw.split('const PRECACHE_ASSETS = [',1)[1].split(']',1)[0]
for path in re.findall(r"'([^']+)'",precache):
    require((ROOT/path).exists(), f'precache missing {path}')
for p in ROOT.rglob('*'):
    if set(p.relative_to(ROOT).parts) & {'.git','webflow','node_modules','__pycache__'}: continue
    if p.is_file(): require(p.stat().st_size>0, f'empty file {p.relative_to(ROOT)}')
    if p.suffix == '.html':
        s=p.read_text()
        require(not re.search(r'<(?:script|link|img)[^>]+(?:src|href)=["\']https?://(?!pabitra27706-oss.github.io/)',s),f'third-party runtime reference: {p}')
        require('rel="canonical"' in s and 'property="og:image"' in s,f'metadata missing: {p}')
for loc in ET.parse(ROOT/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
    require(loc.text.startswith(SITE) and (ROOT/loc.text.removeprefix(SITE)).is_file(),f'sitemap missing: {loc.text}')
paths=[p for p in ROOT.rglob('*.html') if not set(p.relative_to(ROOT).parts)&{'webflow','.git','node_modules'}]+[ROOT/'sitemap.xml',ROOT/'robots.txt']
before={p:hashlib.sha256(p.read_bytes()).digest() for p in paths}
subprocess.run([sys.executable,str(ROOT/'scripts/generate_presence.py')],check=True)
require(all(hashlib.sha256(p.read_bytes()).digest()==h for p,h in before.items()),'presence generator is not idempotent')
print(f'platform-check: {len(errors)} error(s)')
for error in errors: print(error)
sys.exit(bool(errors))
