import hashlib
import json
from pathlib import Path
import subprocess
import unittest
ROOT=Path(__file__).resolve().parents[1]
class DiscoveryTests(unittest.TestCase):
    def test_builders_idempotent_and_compact(self):
        files=list((ROOT/'assets/search').glob('*.json'))+list((ROOT/'assets/cards').glob('*.json'))
        before={p:hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
        for script in ('build_search_index.py','build_cards.py'):
            subprocess.run(['python3',str(ROOT/'scripts'/script)],check=True,capture_output=True)
        self.assertEqual(before,{p:hashlib.sha256(p.read_bytes()).hexdigest() for p in files})
        manifest=json.loads((ROOT/'assets/search/manifest.json').read_text())
        for subject,meta in manifest['subjects'].items():self.assertLessEqual(meta['bytes'],meta['sourceBytes']*.4,subject)
    def test_repeats_and_cards_resolve(self):
        from sys import path
        path.insert(0,str(ROOT/'scripts'))
        from data_pipeline import stores,duplicates
        papers,banks=stores();aliases,_,_=duplicates(papers)
        data=json.loads((ROOT/'assets/search/repeated.json').read_text())
        self.assertEqual(data['aliasCount'],len(aliases));self.assertEqual(sum(len(g['appearances'])-1 for g in data['groups']),len(aliases))
        lookup={q['id']:q for _,paper in papers for q in paper['questions']};lookup.update({q['id']:q for _,bank in banks for q in bank['questions']})
        for file in (ROOT/'assets/cards').glob('CST*.json'):
            for card in json.loads(file.read_text()):
                q=lookup[card['sourceId']];self.assertEqual(card['back'],q['answer'] if card['sourceType']=='pyq' else q['explanation'])
if __name__=='__main__':unittest.main()
