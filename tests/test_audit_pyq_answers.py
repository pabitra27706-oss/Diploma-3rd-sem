import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))

import audit_pyq_answers as apa  # noqa: E402


class AuditPyqAnswersTests(unittest.TestCase):
    def test_split_table_row_preserves_pipes_inside_backticks_and_escapes(self):
        row = r'| **Bitwise OR** | Uses `a | b` or `x || y` | Escaped \| pipe |'
        self.assertEqual(
            apa.split_table_row(row),
            ['**Bitwise OR**', 'Uses `a | b` or `x || y`', 'Escaped | pipe'],
        )

    def test_valid_comparison_question_passes_strictly(self):
        q = {
            'id': 'CST207-P006-Q12',
            'type': 'short',
            'marks': 3,
            'answerStatus': 'model-answer',
            'question': 'Differentiate between RISC and CISC architectures.',
            'answer': (
                'Reduced Instruction Set Computer (RISC) and Complex Instruction Set Computer (CISC) '
                'represent two contrasting processor instruction-set design philosophies.\n\n'
                '> [!COMPARE] RISC vs CISC Processor Architecture\n'
                '> | Parameter | RISC | CISC |\n'
                '> |---|---|---|\n'
                '> | **Instruction Format** | Fixed-length (typically 32-bit) single-word instructions. | Variable-length multi-byte instructions. |\n'
                '> | **Execution Cycles** | Single-cycle execution via deep pipelining (`CPI ≈ 1`). | Multi-cycle microcoded execution (`CPI > 1`). |\n'
                '> | **Memory Access** | Strict load/store (`LOAD` and `STORE` only); ALU operates register-to-register. | Arithmetic instructions can access memory operands directly. |\n'
                '> | **Control Unit** | Hardwired control unit for fast decoding. | Microprogrammed control memory (ROM) with micro-routines. |\n\n'
                '- **Representative Examples:** ARM and RISC-V follow RISC principles, whereas Intel x86-64 exemplifies CISC.'
            ),
        }
        res = apa.audit_question(q)
        self.assertEqual(res['structural'], [])
        self.assertEqual(res['depth'], [])
        self.assertTrue(res['has_compare'])

    def test_catches_star_bullets_raw_course_code_unclosed_fence_and_bad_compare(self):
        q = {
            'id': 'CST207-P006-Q99',
            'type': 'long',
            'marks': 8,
            'answerStatus': 'model-answer',
            'question': 'Compare SRAM and DRAM.',
            'subparts': [{'label': 'a', 'marks': 4, 'text': 'Compare SRAM and DRAM.'}, {'label': 'b', 'marks': 4, 'text': 'Explain cache.'}],
            'answer': (
                '* First point in CST207\n\n'
                '> [!COMPARE] Bad Table\n'
                '> | SRAM | DRAM |\n'
                '> |---|---|\n'
                '> | Fast | Slow | Extra |\n\n'
                '```ascii\nunclosed diagram'
            ),
        }
        res = apa.audit_question(q)
        joined = ' | '.join(res['structural'] + res['depth'])
        self.assertIn('unclosed code fence', joined)
        self.assertIn('raw course code', joined)
        self.assertIn('"* " bullet marker', joined)
        self.assertIn('minimum 3 required', joined)
        self.assertIn('Parameter/Basis/Feature/Aspect', joined)
        self.assertIn('lacks `[!MARKS]` callout', joined)

    def test_node_rich_content_dom_suite_passes(self):
        import subprocess
        proc = subprocess.run(['node', str(ROOT / 'tests/rich-content-dom.cjs')], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, proc.stdout + proc.stderr)

    def test_completed_phase18_subjects_pass_strict_audit(self):
        cso = apa.run_audit(subject='CST207')
        self.assertEqual(cso['questions'], 195)
        self.assertEqual(cso['structuralIssues'], 0)
        self.assertEqual(cso['depthIssues'], 0)
        algo = apa.run_audit(subject='CST209')
        self.assertEqual(algo['questions'], 167)
        self.assertEqual(algo['structuralIssues'], 0)
        self.assertEqual(algo['depthIssues'], 0)


if __name__ == '__main__':
    unittest.main()
