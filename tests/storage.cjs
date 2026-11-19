const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const map=new Map([['quiz-history','[{"historyId":"a"}]'],['theme','dark'],['unrelated-other-app','keep']]);let fail=false;
const localStorage=new Proxy({getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(fail)throw Error('quota');map.set(k,v);},removeItem:k=>map.delete(k)},{ownKeys:()=>[...map.keys()],getOwnPropertyDescriptor:()=>({enumerable:true,configurable:true})});
const context={localStorage,Date,console};vm.runInNewContext(fs.readFileSync('assets/js/storage.js','utf8'),context);const S=context.StudyStorage;
assert.equal(S.legacy.getItem('quiz-history'),'[{"historyId":"a"}]');assert(!map.has('quiz-history'));assert(map.has('d3s:quiz-history'));assert.equal(S.legacy.getItem('theme'),'dark');assert.equal(S.prefs().theme,'dark');
S.set('section-note:test',{text:'private',updatedAt:5});const backup=JSON.parse(JSON.stringify(S.backup()));S.set('section-note:test',{text:'newer',updatedAt:10});S.restore(backup,'merge');assert.equal(S.get('section-note:test').text,'newer');
S.clearGroup('notes');assert.equal(S.get('section-note:test'),null);assert(S.get('quiz-history').length);S.restore(backup,'merge');assert.equal(S.get('section-note:test').text,'private');const once=JSON.stringify(S.backup().stores);S.restore(backup,'merge');assert.equal(JSON.stringify(S.backup().stores),once);
assert.throws(()=>S.validate({app:'wrong',schemaVersion:1,stores:{}}),/supported/);assert.throws(()=>S.validate({app:'diploma-3rd-sem',schemaVersion:1,stores:{'outside':'{}'}}),/invalid/);
assert.equal(S.legacy.length,S.keys().length);assert.equal(JSON.stringify(Object.keys(S.legacy)),JSON.stringify(S.keys()));
fail=true;assert.throws(()=>S.set('test',{value:1}),/quota/);fail=false;assert.equal(S.get('section-note:test').text,'private');
// Legacy preferences without an exam date still work; new dates survive a backup.
assert.equal(S.prefs().examDate,undefined);
S.setPrefs({examDate:'2028-02-29'});
assert.throws(()=>S.setPrefs({examDate:'2027-02-29'}),/valid exam date/);
const examBackup=S.backup();
S.setPrefs({examDate:''});
assert.equal(S.prefs().examDate,'');
S.restore(examBackup,'replace',true);
assert.equal(S.prefs().examDate,'2028-02-29');

// Exercise the homepage renderer with local dates across a DST boundary.
process.env.TZ='America/New_York';
const app=fs.readFileSync('assets/js/app.js','utf8');
const countdown={parentElement:{style:{}}};

vm.runInNewContext(app.slice(app.indexOf('function calculateExamCountdown('),app.indexOf('// Stats Bar',app.indexOf('function calculateExamCountdown('))),context);
S.setPrefs({examDate:'2027-11-08'});
context.document={getElementById:()=>countdown};
context.calculateExamCountdown(new Date(2027,10,7,23));
assert.match(countdown.innerHTML,/1d left/);
context.calculateExamCountdown(new Date(2027,10,8,12));
assert.match(countdown.innerHTML,/Exam today/);
context.calculateExamCountdown(new Date(2027,10,9,12));
assert.match(countdown.innerHTML,/Exams done/);
delete context.document;
S.setPrefs({examDate:''});
context.document={getElementById:()=>countdown};
context.calculateExamCountdown(new Date());
assert.equal(countdown.textContent,'Set exam date');
assert.equal(countdown.parentElement.style.background,'');
delete context.document;
S.clearAll();assert.equal(S.keys().length,0);assert.equal(map.get('unrelated-other-app'),'keep');console.log('PASS legacy migration, one theme, namespacing, reset isolation, backup merge/idempotence/rejection/quota');
