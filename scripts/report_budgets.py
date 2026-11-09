#!/usr/bin/env python3
"""Report uncompressed first-party payload totals; no generated data committed."""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
print('### Asset budgets (uncompressed)')
for ext in ('.js', '.css', '.json'):
    files = [p for p in root.rglob('*'+ext) if not set(p.relative_to(root).parts) & {'.git','webflow','node_modules'}]
    largest = max(files,key=lambda p:p.stat().st_size)
    print(f'- {ext}: {len(files)} files, {sum(p.stat().st_size for p in files):,} bytes; largest {largest.relative_to(root)} ({largest.stat().st_size:,} bytes)')
