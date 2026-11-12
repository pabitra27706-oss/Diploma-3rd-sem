#!/usr/bin/env python3
"""Reproducible practice schedule; defaults to the committed seed. --dry-run never writes."""
import argparse
from data_pipeline import ROOT, DEFAULT_SEED, stores, schedule, dump


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--seed', default=DEFAULT_SEED)
    parser.add_argument('--dry-run', action='store_true')
    args=parser.parse_args()
    papers,_=stores()
    mapping,summary=schedule(papers,args.seed)
    changed=0
    for path,paper in papers:
        for q in paper['questions']:
            changed += q.get('practiceDay') != mapping[q['id']]
            # Never write schedules into authoritative paper files.

    if not args.dry_run:
        (ROOT/'_data/practice-days.json').write_text(dump(summary))
    print(f"practice-days: {summary['rawCount']} preserved records, {summary['uniqueCount']} unique, {changed} assignments changed; seed={args.seed}")
    print(' / '.join(str(d['count']) for d in summary['days']))

if __name__=='__main__': main()
