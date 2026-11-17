/* Pure deterministic storage/state tests, no browser packages required. */
const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
let now=1800000000000, id=0, quota=false;
const map=new Map();
const localStorage=new Proxy({getItem:key=>map.has(key)?map.get(key):null,setItem:(key,value)=>{if(quota)throw new Error('quota exceeded');map.set(key,value);},removeItem:key=>map.delete(key)}, {ownKeys:()=>[...map.keys()],getOwnPropertyDescriptor:()=>({enumerable:true,configurable:true})});
class FakeDate extends Date {static now(){return now;}}
const sandbox={localStorage,StudyStorage:{legacy:localStorage},Date:FakeDate,crypto:{randomUUID:()=>`test-${++id}`},console};
vm.runInNewContext(fs.readFileSync(require('node:path').resolve(__dirname,'../quiz/js/attempt-store.js'),'utf8'),sandbox);
const A=sandbox.QuizAttempts;
const questions=[{id:'CST201-U1-1',type:'mcq',question:'fixture one',options:{A:'yes',B:'no'},correct:'A',marks:2}, {id:'CST201-U1-2',type:'mcq',question:'fixture two',options:{A:'yes',B:'no'},correct:'B',marks:3}, {id:'CST201-U1-3',type:'theory',question:'fixture theory',marks:5,answerStatus:'missing'}];
const config={subject:'CST201',unit:'all',mode:'mcq',timer:true,timerMins:10};
let a=A.save({config,questions,answers:{[questions[0].id]:'A',[questions[1].id]:' '},flags:{[questions[1].id]:true},currentIndex:1});
assert.equal(a.questionIds.length,3);assert.equal(Object.keys(a.answers).length,1);
now+=30000;let resumed=A.get(a.autosaveKey);assert.equal(resumed.remainingMs,570000);assert.equal(resumed.currentIndex,1);assert(resumed.flags[questions[1].id]);
now+=270000;resumed=A.get(a.autosaveKey);assert.equal(resumed.remainingMs,300000);
now+=305000;assert.equal(A.get(a.autosaveKey).remainingMs,0);
console.log('PASS 30s/5min/expired wall-clock resume, order/index/flags, empty answers');
const legacyKey='quiz-autosave-123';localStorage.setItem(legacyKey,JSON.stringify({config,questions,answers:{},startTime:now-30000,autosaveKey:legacyKey}));
let migrated=A.get(legacyKey);assert.equal(migrated.remainingMs,570000);assert(map.has(legacyKey));assert(map.has(migrated.autosaveKey));assert.equal(A.get(migrated.autosaveKey).id,migrated.id);
console.log('PASS legacy migration retains source and does not reset duration');
a=A.save({config,questions,answers:{[questions[0].id]:'B'},flags:{[questions[1].id]:true}});
const result=A.finish(a);assert.equal(result.incorrect,1);assert.equal(result.unanswered,1);assert.equal(result.assessment.ungraded,1);assert.equal(result.score,0);
assert.equal(Object.keys(A.mistakes().items).length,3);
const retry=A.retry(result);assert.equal(JSON.stringify(retry.questionIds),JSON.stringify(result.questionIds));assert(retry.flags[questions[1].id]);assert.equal(Object.keys(retry.answers).length,0);assert.notEqual(retry.id,result.id);
retry.answers={[questions[0].id]:'A',[questions[1].id]:'B',[questions[2].id]:'written answer'};A.finish(retry);assert.equal(A.mistakes().resolvedCount,2);assert.equal(Object.keys(A.mistakes().items).length,1);
console.log('PASS wrong vs unanswered, exact retry/flags, durable mistake resolution');
const theory=A.finish(A.save({config:{...config,mode:'all'},questions:[questions[2]],answers:{}}));assert.equal(theory.score,null);assert.equal(theory.outcome,'not scored');
A.edit(theory.historyId,{[questions[2].id]:'edited'});assert.equal(A.historyEntry(theory.historyId).answers[questions[2].id],'edited');
A.clearMistakes();assert.equal(Object.keys(A.mistakes().items).length,0);
console.log('PASS unscored state, linked review edits, queue clear');
const frozen=JSON.stringify(A.history());
quota=true;
assert.throws(()=>A.save({config,questions,answers:{}}),/quota/);
quota=false;
assert.equal(JSON.stringify(A.history()),frozen);
assert.equal(A.score([{...questions[0],autoMarking:false}],{[questions[0].id]:'A'}).marksObtained,0);
console.log('PASS storage failure does not discard history; paper marking split is not guessed');

// ── Phase 3.3 Mock paper rule derivation, quota enforcement, timed loose-script section, and 1+1 explanation split ──
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const { URL: NodeURL, fileURLToPath } = require('node:url');
const paperSandbox = {
  URL: NodeURL,
  document: { currentScript: { src: 'file://' + path.join(repoRoot, 'quiz/js/paper-attempt.js') } },
  fetch: async (urlObj) => {
    const filePath = fileURLToPath(urlObj instanceof NodeURL ? urlObj : new NodeURL(String(urlObj)));
    if (!fs.existsSync(filePath)) return { ok: false, status: 404, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync(filePath, 'utf8')) };
  },
  console
};
vm.runInNewContext(fs.readFileSync(path.join(repoRoot, 'quiz/js/paper-attempt.js'), 'utf8'), paperSandbox);
const QP = paperSandbox.QuizPaper;

(async () => {
  const subjects = ['CST201', 'CST203', 'CST205', 'CST207', 'CST209'];
  let paperCount = 0, timedPaperCount = 0, splitPaperCount = 0, seventyMarkCount = 0;

  for (const subj of subjects) {
    const reg = await QP.registry(subj);
    for (const meta of reg.papers) {
      paperCount++;
      const loaded = await QP.load(subj, meta.fileName);
      const p = loaded.config.paper;
      assert.equal(loaded.config.timerMins, meta.duration === '3 Hours' ? 180 : 150);
      assert(p.rules.length >= 2, `${meta.fileName} must derive section/group rules`);
      const covered = new Set();
      let maxSum = 0;
      for (const r of p.rules) {
        maxSum += r.maxMarks;
        assert(r.answerAny >= 1 && r.answerAny <= r.totalSet, `${meta.fileName} rule ${r.id} bounds`);
        for (const qid of r.questionIds) {
          assert(!covered.has(qid), `${meta.fileName} duplicate rule assignment for ${qid}`);
          covered.add(qid);
        }
      }
      assert.equal(covered.size, loaded.questions.length, `${meta.fileName} rules must cover all questions`);
      assert.equal(maxSum, p.fullMarks, `${meta.fileName} rule maxMarks must equal printed fullMarks`);
      if (p.fullMarks === 70) {
        seventyMarkCount++;
        assert.equal(p.hasPatternMismatch, true);
      }
      if (p.timedSection) {
        timedPaperCount++;
        assert.equal(p.timedSection.groupId, 'A');
        assert.equal(p.timedSection.minutes, 30);
        assert.equal(p.timedSection.compulsoryFirst, true);
      }
      if (loaded.questions.some(q => q.explanationMarks === 1)) {
        splitPaperCount++;
        for (const q of loaded.questions.filter(x => x.type === 'mcq')) {
          assert.equal(q.optionMarks, 1);
          assert.equal(q.explanationMarks, 1);
          assert.equal(q.autoMarking, false);
        }
      }
    }
  }
  assert.equal(paperCount, 30);
  assert.equal(seventyMarkCount, 3);
  assert.equal(timedPaperCount, 7);
  assert.equal(splitPaperCount, 15);
  console.log('PASS all 30 frozen PYQ papers derive exact section/choice rules, durations, 7 timed 30m windows, and 15 1+1 explanation splits');

  // Test 7: CST205-P006-2026-01 (10/15 x 2m Answer+Explanation MCQs + 5/9 x 8m Group B) + CST201-P002 choiceSets
  const p205 = await QP.load('CST205', 'CST205-P006-2026-01.json');
  const groupAMcqs = p205.questions.filter(q => q.type === 'mcq');
  const groupBSubj = p205.questions.filter(q => q.type !== 'mcq');
  assert.equal(groupAMcqs.length, 15);
  assert.equal(groupBSubj.length, 9);

  const ans205 = {}, expl205 = {};
  groupAMcqs.slice(0, 10).forEach((q, idx) => {
    const keys = Object.keys(q.options);
    ans205[q.id] = idx < 8 ? q.correct : keys.find(k => k !== q.correct);
    if (idx < 6) expl205[q.id] = `Explanation for ${q.id}`;
  });
  groupBSubj.slice(0, 5).forEach(q => { ans205[q.id] = `Subjective solution for ${q.id}`; });

  let pAttempt = A.save({ ...p205, answers: ans205, explanations: expl205, flags: {} });
  // 11th MCQ is locked by answerAny: 10 quota, while 1st answered MCQ remains unlocked so student can clear/change it
  assert.equal(A.questionAccess(pAttempt, groupAMcqs[10].id, now).locked, true);
  assert.equal(A.questionAccess(pAttempt, groupAMcqs[10].id, now).code, 'quota-reached');
  assert.equal(A.questionAccess(pAttempt, groupAMcqs[0].id, now).locked, false);
  // 6th Group B question is locked by answerAny: 5 quota
  assert.equal(A.questionAccess(pAttempt, groupBSubj[5].id, now).locked, true);
  assert.equal(A.questionAccess(pAttempt, groupBSubj[5].id, now).code, 'quota-reached');

  // Clearing one answered Group A MCQ (both option & explanation) unlocks the 11th MCQ
  const cleared = { ...pAttempt.answers };
  const clearedExpl = { ...pAttempt.explanations };
  delete cleared[groupAMcqs[9].id];
  delete clearedExpl[groupAMcqs[9].id];
  const unlockedAttempt = A.save({ ...pAttempt, answers: cleared, explanations: clearedExpl });
  assert.equal(A.questionAccess(unlockedAttempt, groupAMcqs[10].id, now).locked, false);

  // Finish original 10-MCQ + 5-subjective attempt and verify paperSummary
  const finished205 = A.finish(pAttempt);
  assert.equal(finished205.outcome, 'not scored');
  assert.equal(finished205.score, null);
  assert.equal(finished205.paperSummary.optionMarksEarned, 8);
  assert.equal(finished205.paperSummary.optionMarksMax, 10);
  assert.equal(finished205.paperSummary.explanationMarksPending, 10);
  assert.equal(finished205.paperSummary.explanationWrittenCount, 6);
  assert.equal(finished205.paperSummary.manualMarksMax, 50);

  // Linked review edit updates written explanation count in paperSummary
  const updated205 = A.edit(finished205.historyId, finished205.answers, {
    ...finished205.explanations,
    [groupAMcqs[6].id]: 'Added explanation in review'
  });
  assert.equal(updated205.paperSummary.explanationWrittenCount, 7);

  // Verify Group C choiceSets on CST201-P002-2022-06.json (Q5, Q6, Q7 each answer 1 of 3 alternatives)
  const p201_22 = await QP.load('CST201', 'CST201-P002-2022-06.json');
  const q5Set = p201_22.config.paper.rules.find(r => r.id === 'C:Q5');
  const q6Set = p201_22.config.paper.rules.find(r => r.id === 'C:Q6');
  assert.equal(q5Set.answerAny, 1);
  assert.equal(q5Set.questionIds.length, 3);
  const csAttempt = A.save({ ...p201_22, answers: { [q5Set.questionIds[0]]: 'My Q5a answer' }, flags: {} });
  assert.equal(A.questionAccess(csAttempt, q5Set.questionIds[1], now).locked, true);
  assert.equal(A.questionAccess(csAttempt, q5Set.questionIds[1], now).code, 'quota-reached');
  assert.equal(A.questionAccess(csAttempt, q6Set.questionIds[0], now).locked, false);
  console.log('PASS answerAny section & choiceSet quotas, clear-and-switch, and 1+1 explanation mark split verified');

  // Test 8: Timed 30-minute Group A loose-script window on CST201-P003-2023-03.json across reloads
  const p201_23 = await QP.load('CST201', 'CST201-P003-2023-03.json');
  const gA23 = p201_23.questions.filter(q => q.type === 'mcq');
  const gB23 = p201_23.questions.filter(q => q.type !== 'mcq');
  const timedAttempt = A.save({ ...p201_23, answers: { [gA23[0].id]: gA23[0].correct }, flags: {} });
  assert.equal(timedAttempt.sectionEndsAt, timedAttempt.startedAt + 30 * 60000);

  // At +5 minutes: Group A open, Group B gated behind compulsory first section
  now += 5 * 60000;
  let rel23 = A.get(timedAttempt.autosaveKey);
  assert.equal(A.questionAccess(rel23, gA23[1].id, now).locked, false);
  assert.equal(A.questionAccess(rel23, gB23[0].id, now).locked, true);
  assert.equal(A.questionAccess(rel23, gB23[0].id, now).code, 'awaiting-first-section');

  // Early hand-in of Group A locks Group A and unlocks Group B across reload
  const earlyLocked = A.save({ ...rel23, lockedGroups: ['A'] });
  const reloadedEarly = A.get(earlyLocked.autosaveKey);
  assert.equal(A.questionAccess(reloadedEarly, gA23[1].id, now).locked, true);
  assert.equal(A.questionAccess(reloadedEarly, gA23[1].id, now).code, 'section-time-closed');
  assert.equal(A.questionAccess(reloadedEarly, gB23[0].id, now).locked, false);

  // Natural 30-minute expiry (without manual lock) also locks Group A and unlocks Group B on reload
  const naturalAttempt = A.save({ ...p201_23, answers: { [gA23[0].id]: gA23[0].correct }, flags: {} });
  now += 31 * 60000;
  const reloadedExpired = A.get(naturalAttempt.autosaveKey);
  assert.equal(A.questionAccess(reloadedExpired, gA23[1].id, now).locked, true);
  assert.equal(A.questionAccess(reloadedExpired, gA23[1].id, now).code, 'section-time-closed');
  assert.equal(A.questionAccess(reloadedExpired, gB23[0].id, now).locked, false);
  console.log('PASS 30-minute Group A loose-script window & early lock persist across reloads');
})().catch(err => {
  console.error(err);
  process.exit(1);
});

