#!/usr/bin/env python3
"""Check byte-frozen authoritative PYQ paper and registry files; never updates baseline."""
import hashlib
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def check(root=ROOT):
    baseline=json.loads((root/'_data/pyq-integrity.json').read_text())['files']
    actual={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((root/'_data').glob('*/*.json'))}
    return sorted(name for name in set(baseline)|set(actual) if baseline.get(name)!=actual.get(name))

if __name__=='__main__':
    bad=check()
    print(f'PYQ integrity: {len(bad)} changed/added/missing files')
    for name in bad: print(name)
    raise SystemExit(bool(bad))
