"""Regression and mutation tests; temporary copies only, source files never edited."""
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
from data_pipeline import ROOT, stores, schedule, duplicates, dump, fingerprint
from validate_data import validate


# `_data/pyq-integrity.json` records the short form `664674b`; `git fetch` only
# accepts a full object name, so the abbreviation is resolved from the remote
# once and then fetched by its full id.
FULL_SOURCE_COMMIT = '664674b490c437739c001295754b3dc2653a2edc'


def _ensure_commit(sha):
    """Return True when `sha` is readable, fetching it shallowly if needed.

    The recorded source commit is an ancestor that a shallow clone never has, so
    this guard used to raise CalledProcessError in any fresh checkout (including
    the owner's Termux clone) instead of testing anything. Try the recorded
    name, then the known full id, then the remote index; only give up when the
    commit truly cannot be reached.
    """
    def readable(name):
        return subprocess.run(['git', 'cat-file', '-e', name + '^{commit}'],
                              cwd=ROOT, capture_output=True).returncode == 0

    if readable(sha):
        return True
    for candidate in (FULL_SOURCE_COMMIT, sha):
        try:
            subprocess.run(['git', 'fetch', '--depth=1', 'origin', candidate],
                           cwd=ROOT, capture_output=True, timeout=120)
        except (subprocess.SubprocessError, OSError):
            break
        if readable(candidate):
            return True
    return False


class PipelineTests(unittest.TestCase):
    def test_schedule_is_balanced_and_deterministic(self):
        papers,_=stores()
        first,meta=schedule(papers)
        second,again=schedule(list(reversed(papers)))
        self.assertEqual((first,meta),(second,again))
        self.assertEqual(len(first),924)
        self.assertEqual(meta['uniqueCount'],923)
        sizes=[d['count'] for d in meta['days']]
        self.assertLessEqual(max(sizes)-min(sizes),1)
        ids=[qid for d in meta['days'] for qid in d['ids']]
        self.assertEqual(len(ids),len(set(ids)))
        aliases,_,_=duplicates(papers)
        for alias,target in aliases.items():self.assertEqual(first[alias],first[target])
        different,_=schedule(papers,'different-seed')
        self.assertNotEqual(first,different)

    def test_no_semantic_or_answer_changes(self):
        # Papers use the explicitly approved, pinned main snapshot; quiz sources
        # retain the original phase base. Neither follows a moving branch.
        integrity=json.loads((ROOT/'_data/pyq-integrity.json').read_text())
        paper_base=integrity['sourceCommit']
        if not _ensure_commit(paper_base):
            self.skipTest(f'source commit {paper_base} is unreachable from this clone')
        # A recorded reconciliation may authorise `unit` retags, one question at a time.
        # Anything not listed here must still be byte-identical, and the move list is
        # itself pinned so the authorisation cannot quietly grow.
        allowed_unit_moves=integrity.get('reconciliation',{}).get('unitMoves',{})
        self.assertLessEqual(len(allowed_unit_moves),44,'recorded unit moves grew without a new approval')
        # A recorded reconciliation may also authorise appending a closing ``` fence
        # to an answer whose last code block was never terminated. The allowance is
        # an exact match-and-append: listed ids only, and the stored answer must equal
        # the frozen answer plus that suffix. Anything else stays byte-identical.
        allowed_fence_repairs=integrity.get('reconciliation',{}).get('answerSuffixRepairs',{})
        self.assertLessEqual(len(allowed_fence_repairs),18,'recorded fence repairs grew without a new approval')
        for qid,suffix in allowed_fence_repairs.items():
            self.assertEqual(suffix,{'appended':'```'},qid)
        allowed_fence_ids=set(allowed_fence_repairs)
        # A recorded reconciliation may also authorise replacing an answer outright when
        # the stored prose did not fit the marks it carried. The allowance is an exact
        # hash pair per question: the frozen answer must hash to `oldSha256` and the
        # stored answer to `newSha256`. Any other answer text fails.
        allowed_answer_rewrites=integrity.get('reconciliation',{}).get('answerRewrites',{})
        self.assertLessEqual(len(allowed_answer_rewrites),130,'recorded answer rewrites grew without a new approval')
        allowed_rewrite_ids=set(allowed_answer_rewrites)
        seen_rewrites=set()
        seen_fences=set()
        seen=set()
        for path,store in sum((list(s) for s in stores()),[]):
            if path.is_relative_to(ROOT/'_quiz-data'): continue  # origins still byte-identical
            base=paper_base
            original=json.loads(subprocess.check_output(['git','show',base+':'+path.relative_to(ROOT).as_posix()]))
            before={q['id']:q for q in original['questions']}
            self.assertEqual(set(before),{q['id'] for q in store['questions']})
            for q in store['questions']:
                clean={k:v for k,v in q.items() if k not in {'practiceDay','topicQuality','gradable','answerStatus'}}
                old={k:v for k,v in before[q['id']].items() if k not in {'practiceDay','topicQuality','gradable','answerStatus'}}
                move=allowed_unit_moves.get(q['id'])
                if move:
                    seen.add(q['id'])
                    self.assertEqual(old['unit'],move['from'],q['id'])
                    self.assertEqual(clean['unit'],move['to'],q['id'])
                    clean={'k':v for k,v in clean.items() if k!='unit'}
                    old={'k':v for k,v in old.items() if k!='unit'}
                if q['id'] in allowed_fence_ids:
                    seen_fences.add(q['id'])
                    self.assertEqual(allowed_fence_repairs[q['id']]['appended'],'```',q['id'])
                    # the stored answer must be the frozen answer plus one closing fence
                    repaired=clean['answer'].rstrip('\n')
                    frozen=old['answer'].rstrip('\n')
                    self.assertTrue(repaired.endswith('\n```'),q['id'])
                    self.assertEqual(repaired[:-len('\n```')],frozen,q['id'])
                    clean={'k':v for k,v in clean.items() if k!='answer'}
                    old={'k':v for k,v in old.items() if k!='answer'}
                if q['id'] in allowed_rewrite_ids:
                    seen_rewrites.add(q['id'])
                    allowed=allowed_answer_rewrites[q['id']]
                    self.assertEqual(hashlib.sha256(old['answer'].encode()).hexdigest(),
                                     allowed['oldSha256'],q['id'])
                    self.assertEqual(hashlib.sha256(clean['answer'].encode()).hexdigest(),
                                     allowed['newSha256'],q['id'])
                    self.assertNotEqual(clean['answer'],old['answer'],q['id'])
                    clean={'k':v for k,v in clean.items() if k!='answer'}
                    old={'k':v for k,v in old.items() if k!='answer'}
                self.assertEqual(clean,old,q['id'])
        self.assertEqual(seen,set(allowed_unit_moves),'a recorded unit move did not apply')
        self.assertEqual(seen_fences,allowed_fence_ids,'a recorded fence repair did not apply')
        self.assertEqual(seen_rewrites,allowed_rewrite_ids,'a recorded answer rewrite did not apply')

    def test_generator_is_idempotent_and_dry_run_does_not_write(self):
        paths=list((ROOT/'_data').rglob('*.json'))+list((ROOT/'_quiz-data').rglob('*.json'))+list((ROOT/'docs/data').glob('*'))
        before={p:p.read_bytes() for p in paths}
        for script,args in [('build_data_catalog.py',[]),('build_practice_days.py',[]),('build_practice_days.py',['--seed','different','--dry-run'])]:
            subprocess.run([sys.executable,str(ROOT/'scripts'/script),*args],check=True,capture_output=True)
        self.assertEqual(before,{p:p.read_bytes() for p in paths})

    def test_strict_fails_and_explicit_baseline_is_exact(self):
        strict=subprocess.run([sys.executable,str(ROOT/'scripts/validate_data.py'),'--strict'],capture_output=True)
        self.assertEqual(strict.returncode,1)
        baseline=subprocess.run([sys.executable,str(ROOT/'scripts/validate_data.py'),'--check-baseline'],capture_output=True)
        self.assertEqual(baseline.returncode,0,baseline.stdout.decode())

    def test_mutations_are_detected(self):
        cases=[('count',lambda b:b.update(totalQuestions=999)),
               ('correct',lambda b:b['questions'][0].update(correct='Z')),
               ('options',lambda b:b['questions'][0].update(options={})),
               ('explanation',lambda b:b['questions'][0].update(explanation='')),
               ('difficulty',lambda b:b['questions'][0].update(difficulty='impossible')),
               ('duplicate-id',lambda b:b['questions'][1].update(id=b['questions'][0]['id'])),
               ('answer-key',lambda b:next(q for q in b['questions'] if q['type']!='mcq').update(answerStatus='model-answer'))]
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            for folder in ['_data','_quiz-data','docs/syllabus']:shutil.copytree(ROOT/folder,root/folder)
            target=root/'_quiz-data/CST201/unit-1.json';original=target.read_bytes()
            for code,mutate in cases:
                b=json.loads(original);mutate(b);target.write_text(dump(b))
                errors,_=validate(root)
                self.assertIn(code,{e['code'] for e in errors},code)
                target.write_bytes(original)

    def test_syllabus_html_and_runtime_pool_mutations_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            for folder in ['_data','_quiz-data','docs/syllabus','assets/data','subjects']:
                shutil.copytree(ROOT/folder,root/folder)
            cst209=root/'subjects/CST209/index.html'
            orig_html=cst209.read_text()
            cst209.write_text(orig_html.replace('<span class="count-value">4</span> Units','<span class="count-value">5</span> Units',1))
            errors,_=validate(root)
            self.assertIn('syllabus-html',{e['code'] for e in errors})
            cst209.write_text(orig_html)
            pool_path=root/'assets/data/practice-pool.json'
            pool=json.loads(pool_path.read_text())
            pool['aliases']={}
            pool_path.write_text(dump(pool))
            errors,_=validate(root)
            self.assertIn('runtime-pool',{e['code'] for e in errors})

if __name__=='__main__':unittest.main()
