const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
let raw=null;const context={localStorage:{getItem:()=>raw,setItem:(_k,v)=>{raw=v;}},console,Date};context.StudyStorage={legacy:context.localStorage};vm.createContext(context);vm.runInContext(fs.readFileSync('assets/js/study-store.js','utf8'),context);const S=context.StudyStore,now=Date.now();
for(const [rating,days]of [['again',1],['hard',1],['good',1],['easy',3]]){const value=S.next(null,rating,now,'event');assert.equal(value.interval,days);assert.equal(value.due,now+days*86400000);assert.equal(S.next(value,rating,now,'event'),value);}
const first=S.rate('card','good','one');assert.equal(S.rate('card','good','one').reps,1);const later=S.next(first,'good',first.lastReviewed-900000,'two');assert(later.lastReviewed>=first.lastReviewed);assert.equal(later.interval,3);
const state=S.read();state.newLimit=2;S.write(state);assert.equal(S.queue([{id:'a'},{id:'b'},{id:'c'}]).length,1);
assert.equal(S.weak([{outcome:'abandoned',questions:[{type:'mcq'}]}]).length,0);
const weak=S.weak([{config:{subject:'CST201'},questions:[{id:'q',unit:1,type:'mcq',correct:'A',options:{A:'yes'}}],answers:{}}])[0];assert.equal(weak.attempted,1);assert.equal(weak.skipped,1);
console.log('PASS Leitner rating intervals, due dates, idempotence, backward clock clamp, cap, weak denominators');
const clock=new Date(2026,10,9,12,0,0).getTime(),question={id:'q',subject:'CST201',unit:1,topic:'Arrays',type:'mcq',correct:'A',options:{A:'yes',B:'no'}};
function entry(offset,answer){const date=new Date(clock);date.setDate(date.getDate()+offset);return {completedAt:date.getTime(),questions:[question],answers:{q:answer}};}
const history=[...Array.from({length:5},()=>entry(0,'A')),...Array.from({length:5},()=>entry(-7,'B')),entry(-14,'A'),entry(1,'A'),{...entry(0,'A'),outcome:'abandoned'}];
let trend=S.trends(history,clock).get('CST201|1|Arrays');assert.equal(trend.recent.attempted,5);assert.equal(trend.previous.attempted,5);assert.equal(trend.delta,100);
assert.equal(S.trends(history.slice(0,4),clock).get('CST201|1|Arrays').delta,null);
assert.equal(S.weak([entry(0,'   ')])[0].skipped,1);
const midnight=new Date(2026,10,9,0,0,0).getTime();assert.equal(S.trends([entry(-6,'A')],midnight).get('CST201|1|Arrays').recent.attempted,1);
console.log('PASS local 7-day windows, minimum samples, skipped whitespace, future/abandoned exclusion');
