/* Pure paper-rule tests over every immutable registered paper. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const sandbox = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'quiz/js/paper-rules.js'), 'utf8'), sandbox);
const Rules = sandbox.QuizPaperRules;
let paperCount = 0;
let timedCount = 0;

for (const subject of ['CST201', 'CST203', 'CST205', 'CST207', 'CST209']) {
  const directory = path.join(root, '_data', subject);
  const registry = JSON.parse(fs.readFileSync(path.join(directory, 'registry.json'), 'utf8'));
  for (const meta of registry.papers) {
    const paper = JSON.parse(fs.readFileSync(path.join(directory, meta.fileName), 'utf8'));
    const rules = Rules.build(paper.paperFormat.groups, paper.questions, paper.paperFormat.generalInstructions);
    assert.deepEqual(JSON.parse(JSON.stringify(rules.unsupported)), [], `${meta.fileName} has unsupported answer-choice metadata`);
    assert.deepEqual(JSON.parse(JSON.stringify(rules.unsupportedTimed)), [], `${meta.fileName} has unsupported timed-section metadata`);
    assert.deepEqual(JSON.parse(JSON.stringify(rules.uncoveredQuestionIds)), [], `${meta.fileName} has questions outside structured choice pools`);
    assert.equal(new Set(rules.constraints.flatMap(rule => rule.questionIds)).size, paper.questions.length);
    assert(rules.constraints.length > 0, `${meta.fileName} should have choice rules`);

    const empty = Rules.validate(rules, []);
    assert.equal(empty.valid, true);
    for (const rule of rules.constraints) {
      const allowed = rule.questionIds.slice(0, rule.answerAny);
      assert.equal(Rules.validate(rules, allowed).valid, true, `${meta.fileName}: ${rule.id} valid quota`);
      const selected = [...allowed, rule.questionIds[rule.answerAny]];
      const invalid = Rules.validate(rules, selected);
      assert.equal(invalid.valid, false, `${meta.fileName}: ${rule.id} must reject over-selection`);
      assert.equal(Rules.constraintFor(rules, rule.questionIds[0]).id, rule.id);
    }
    paperCount++;
    timedCount += rules.timedRules.length;
  }
}
assert.equal(paperCount, 30);
assert.equal(timedCount, 7, 'only the seven source-recorded 30-minute paper sections are timed');

const alternativePaper = JSON.parse(fs.readFileSync(path.join(root, '_data/CST203/CST203-P001-2022-06.json'), 'utf8'));
const alternativeRules = Rules.build(alternativePaper.paperFormat.groups, alternativePaper.questions, alternativePaper.paperFormat.generalInstructions);
const alternatives = alternativeRules.constraints.filter(rule => rule.id.startsWith('C:Q'));
assert.deepEqual(Array.from(alternatives, rule => rule.answerAny), [1, 1, 1]);
assert(alternatives.every(rule => rule.questionIds.length === 3));
assert.equal(Rules.validate(alternativeRules, alternatives[0].questionIds.slice(0, 1).concat(alternatives[0].questionIds.slice(1, 2))).valid, false);

const malformed = Rules.build([{id: 'X', questionIds: ['not-in-paper'], answerAny: 1}], [{id: 'real'}], []);
assert.equal(malformed.unsupported.length, 1);
console.log(`PASS ${paperCount} registered papers: explicit group/section/alternative quotas, no unsupported or uncovered records; ${timedCount} printed 30-minute section timers`);
