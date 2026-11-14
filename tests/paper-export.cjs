/* Pure checks that paper choice metadata survives all download formats. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const sandbox={document:{readyState:'loading',addEventListener(){}},window:{}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../quiz/js/common.js'),'utf8'),sandbox);
const data={
  subject:'CST205',unit:'all',mode:'all',score:null,total:2,totalMarks:10,
  questions:[
    {id:'paper-q1',type:'theory',question:'First response',marks:5,modelAnswer:'First model'},
    {id:'paper-q2',type:'theory',question:'Alternative response',marks:5,modelAnswer:'Second model'}
  ],
  answers:{'paper-q1':'Student answer'},
  paper:{fileName:'CST205-P006-2026-01.json',examSession:'January 2026',duration:'2.5 Hours',fullMarks:60,setMarks:102},
  paperSelection:['paper-q1'],
  metadata:{attemptId:'history-paper-1',date:1800000000000}
};
const markdown=sandbox.generateAllTypesMarkdown(data);
assert(markdown.includes('Paper practice record — not an official grade'));
assert(markdown.includes('Paper answer-choice selection:** Selected'));
assert(markdown.includes('Paper answer-choice selection:** Not selected'));
const text=sandbox.generateTXTExport(data);
assert(text.includes('Paper marking: no automatic overall grade'));
assert(text.includes('Paper answer-choice selection: Selected'));
assert(text.includes('Paper answer-choice selection: Not selected'));
const json=JSON.parse(sandbox.generateJSONExport(data));
assert.equal(json.quiz.paperPractice.examSession,'January 2026');
assert.deepEqual(json.quiz.paperSelectionQuestionIds,['paper-q1']);
assert.equal(json.questions[0].selectedForPaperAnswerChoice,true);
assert.equal(json.questions[1].selectedForPaperAnswerChoice,false);
assert.equal(JSON.parse(sandbox.generateJSONExport({...data,paper:null})).quiz.paperPractice,null);
console.log('PASS paper identity and selected answer-choice state appear accurately in Markdown, TXT and JSON exports');
