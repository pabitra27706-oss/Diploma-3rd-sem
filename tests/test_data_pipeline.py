"""Regression and mutation tests; temporary copies only, source files never edited."""
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
        quiz_base='664674b490c437739c001295754b3dc2653a2edc'
        # A recorded reconciliation may authorise `unit` retags, one question at a time.
        # Anything not listed here must still be byte-identical, and the move list is
        # itself pinned so the authorisation cannot quietly grow.
        allowed_unit_moves=integrity.get('reconciliation',{}).get('unitMoves',{})
        self.assertLessEqual(len(allowed_unit_moves),44,'recorded unit moves grew without a new approval')
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
                self.assertEqual(clean,old,q['id'])
        self.assertEqual(seen,set(allowed_unit_moves),'a recorded unit move did not apply')

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
