/* Crash/quota injection through the real storage boundary. No browser dependency. */
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('assets/js/storage.js','utf8'),map=new Map();let writes=0,failAt=Infinity,persistent=false;
const raw=new Proxy({getItem:k=>map.get(k)??null,setItem:(k,v)=>{writes++;if(writes===failAt||(persistent&&writes>=failAt))throw Error('injected quota');map.set(k,v);},removeItem:k=>map.delete(k)},{ownKeys:()=>[...map.keys()],getOwnPropertyDescriptor:()=>({enumerable:true,configurable:true})});
function open(){const c={localStorage:raw,console,Date};vm.runInNewContext(source,c);return c.StudyStorage;}
let S=open();S.set('section-note:one',{text:'original',updatedAt:1});S.set('quiz-history',[{historyId:'legacy-fixture'}]);S.migrate();const original=S.backup();const incoming=JSON.parse(JSON.stringify(original));incoming.stores['d3s:section-note:one']=JSON.stringify({text:'replacement',updatedAt:2});incoming.stores['d3s:section-note:two']=JSON.stringify({text:'new',updatedAt:2});
// Verified legacy migration metadata, journal stage, then writes; one-shot failure rolls back.
writes=0;failAt=4;
assert.throws(()=>S.restore(incoming,'replace'),/original records were restored/);
failAt=Infinity;assert.equal(JSON.stringify(S.backup().stores),JSON.stringify(original.stores));assert(!map.has('d3s:restore-journal'));
// Persistent failure also interrupts rollback; the journal remains, reads stop,
// and exporting still returns the original snapshot rather than partial data.
writes=0;failAt=4;persistent=true;
assert.throws(()=>S.restore(incoming,'replace'),/recovery journal/);
assert(map.has('d3s:restore-journal'));assert.throws(()=>S.get('section-note:one'),/needs recovery/);
assert.equal(JSON.stringify(S.backup().stores),JSON.stringify(original.stores));
failAt=Infinity;persistent=false;S=open(); // new page auto-recovers first
assert(!map.has('d3s:restore-journal'));assert.equal(S.get('section-note:one').text,'original');assert.equal(S.get('section-note:two'),null);
// Validation must finish before the staging write.
const bads=[
 {'d3s:prefs':JSON.stringify({theme:'dark'})},
 {'d3s:quiz-history':'{}'},
 {'d3s:quiz-result':JSON.stringify({questions:[{id:'q',question:'q'}],answers:{alien:'answer'}})},
 {'d3s:section-note:x':JSON.stringify({text:5,updatedAt:2})},
 {'d3s:test':'not-json'},
 {'d3s:test':'{"__proto__":{"polluted":true}}'},
 {'d3s:restore-journal':'{}'},
 {'d3s:study:v1':JSON.stringify({schemaVersion:2,cards:{},events:[],goal:20,newLimit:20})}
];
for(const stores of bads){const before=JSON.stringify([...map]);assert.throws(()=>S.restore({app:'diploma-3rd-sem',schemaVersion:1,stores}));assert.equal(JSON.stringify([...map]),before);}
console.log('PASS pre-write validation, interrupted import rollback, retained recovery journal, safe export, page-reopen recovery');
// Full-quota export still reads legacy originals without a migration write.
map.set('practice-presets','[]');writes=0;failAt=1;persistent=true;
const atQuota=S.backup();assert.equal(atQuota.stores['d3s:practice-presets'],'[]');assert(map.has('practice-presets'));assert.equal(writes,0);
failAt=Infinity;persistent=false;
// Preference import is an explicit opt-in, including merge mode.
S.setPrefs({theme:'light'});const withPrefs=S.backup();withPrefs.stores['d3s:prefs']=JSON.stringify({...S.prefs(),theme:'dark'});
S.restore(withPrefs,'merge',false);assert.equal(S.prefs().theme,'light');S.restore(withPrefs,'merge',true);assert.equal(S.prefs().theme,'dark');
console.log('PASS no-write full-quota export and explicit preference import consent');
map.set('practice-to-remove','{"old":true}');S.restore({app:'diploma-3rd-sem',schemaVersion:1,stores:{}},'replace',false);assert.equal(S.get('practice-to-remove'),null);assert(!map.has('practice-to-remove'));
console.log('PASS replace removes legacy records without resurrecting deleted data');
