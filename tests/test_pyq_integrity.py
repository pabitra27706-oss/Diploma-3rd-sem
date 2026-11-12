"""The owner froze originals; neither metadata maintenance nor changed bytes may bypass it."""
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from check_pyq_integrity import check,ROOT

class IntegrityTests(unittest.TestCase):
    def test_originals_match_baseline(self):
        self.assertEqual(check(),[])
    def test_changed_missing_and_added_files_are_detected(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);shutil.copytree(ROOT/'_data',root/'_data')
            changed=root/'_data/CST201/registry.json';changed.write_bytes(changed.read_bytes()+b'\n')
            self.assertIn('_data/CST201/registry.json',check(root))
            changed.unlink();self.assertIn('_data/CST201/registry.json',check(root))
            added=root/'_data/CST201/unapproved.json';added.write_text('{}')
            self.assertIn('_data/CST201/unapproved.json',check(root))
if __name__=='__main__':unittest.main()
