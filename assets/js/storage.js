/* Sole browser storage boundary. String-compatible adapter preserves old callers.
 * Sync local storage remains primary; IndexedDB cutover is NOT claimed here.
 */
(() => {
 'use strict';const PREFIX='d3s:',PREFS='d3s:prefs',SCHEMA='d3s:schema',JOURNAL='d3s:restore-journal';
 const themes=new Set(['theme','quiz-theme','diploma-3rd-sem-theme']);
 const known=k=>k.startsWith(PREFIX)||/^(?:quiz|practice|pyq_|diploma-3rd-sem-|study-|bookmarks$|disclaimerAccepted$|theme$|user|unit_progress_|progress|settings|notes)/.test(k);
 const physical=k=>k.startsWith(PREFIX)?k:PREFIX+k;
 function error(e){const message=e?.name==='QuotaExceededError'?'Device storage is full. Export a backup and free space; this change was not saved.':'Local storage failed: '+e.message;globalThis.dispatchEvent?.(new CustomEvent('study-storage-error',{detail:message}));return Error(message);}
 function rawSet(k,value){try{localStorage.setItem(k,String(value));if(localStorage.getItem(k)!==String(value))throw Error('Write verification failed');}catch(e){throw error(e);}}
 function prefs(){const raw=localStorage.getItem(PREFS);return raw?JSON.parse(raw):{theme:'system',fontScale:100,lineHeight:'normal',contrast:'normal',lang:'en',reduceMotion:'system'};}
 function assertReady(){if(localStorage.getItem(JOURNAL)!==null)throw Error('An interrupted import needs recovery. Open Settings and choose Retry recovery or export the pre-import backup.');}
 function getRaw(key){
   assertReady();
   if(themes.has(key)){let p=prefs();if(localStorage.getItem(key)!==null){let old=localStorage.getItem(key);if(key==='quiz-theme'){try{old=JSON.parse(old);}catch{}}if(!localStorage.getItem(PREFS)&&['dark','light','system'].includes(old)){p.theme=old;rawSet(PREFS,JSON.stringify(p));}if(localStorage.getItem(PREFS))localStorage.removeItem(key);}const resolved=p.theme==='system'?(globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light'):p.theme;return key==='quiz-theme'?JSON.stringify(resolved):resolved;}
   const target=physical(key),raw=localStorage.getItem(target);if(raw!==null)return raw;
   if(target!==key&&localStorage.getItem(key)!==null){const old=localStorage.getItem(key);rawSet(target,old);if(localStorage.getItem(target)===old)localStorage.removeItem(key);return old;}
   return null;
 }
 function setRaw(key,value){assertReady();if(themes.has(key)){const p=prefs();if(key==='quiz-theme'){try{value=JSON.parse(value);}catch{}}if(!['dark','light','system'].includes(value))throw Error('Invalid theme');p.theme=value;rawSet(PREFS,JSON.stringify(p));return;}rawSet(physical(key),value);}
 function removeRaw(key){assertReady();localStorage.removeItem(physical(key));if(!key.startsWith(PREFIX))localStorage.removeItem(key);}
 function keys(prefix=''){return [...new Set(Object.keys(localStorage).filter(k=>known(k)&&k!==JOURNAL).map(k=>k.startsWith(PREFIX)?k.slice(PREFIX.length):k))].filter(k=>k.startsWith(prefix)).sort();}
 function group(key){return /(?:note|highlight)/i.test(key)?'notes':/prefs|theme|settings|disclaimer|schema|migratedTo|feedback-usefulness/i.test(key)?'preferences':'progress';}
 function estimate(){const groups={notes:{records:0,bytes:0},progress:{records:0,bytes:0},preferences:{records:0,bytes:0}};for(const key of keys()){const raw=getRaw(key);if(raw===null)continue;const g=groups[group(key)];g.records++;g.bytes+=(physical(key).length+raw.length)*2;}return groups;}
 function clearGroup(which){assertReady();if(!['everything','notes','progress','preferences'].includes(which))throw Error('Unknown reset group');for(const key of keys())if(which==='everything'||group(key)===which)removeRaw(key);if(which==='everything'){try{for(const key of Object.keys(sessionStorage))if(key.startsWith(PREFIX+'session:'))sessionStorage.removeItem(key);}catch{}}}
 function sessionOnce(name){try{const key=PREFIX+'session:'+name;if(sessionStorage.getItem(key)!==null)return false;sessionStorage.setItem(key,'1');return true;}catch{return false;}}
 function migrate(){assertReady();for(const key of Object.keys(localStorage).filter(known))if(!key.startsWith(PREFIX))getRaw(key);rawSet(SCHEMA,JSON.stringify({version:1,migratedTo:PREFIX}));return true;}
 function get(key,fallback=null){const raw=getRaw(key);if(raw===null)return fallback;try{return JSON.parse(raw);}catch{throw Error(`Saved ${key} is unreadable; retained unchanged.`);}}
 function set(key,value){setRaw(key,JSON.stringify(value));return value;}
 function backup(){
   const journal=readJournal();if(journal)return {app:'diploma-3rd-sem',schemaVersion:1,exportedAt:new Date().toISOString(),stores:journal.previous};
   // Export must still work at full quota: normalize names without writing.
   const stores={};for(const key of Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)&&k!==JOURNAL).sort())stores[key]=localStorage.getItem(key);
   for(const key of Object.keys(localStorage).filter(k=>known(k)&&!k.startsWith(PREFIX)).sort()){
     const raw=localStorage.getItem(key);
     if(themes.has(key)){if(!Object.hasOwn(stores,PREFS)){let theme=raw;try{if(key==='quiz-theme')theme=JSON.parse(raw);}catch{}if(['dark','light','system'].includes(theme))stores[PREFS]=JSON.stringify({...prefs(),theme});}}
     else if(!Object.hasOwn(stores,physical(key)))stores[physical(key)]=raw;
   }
   return {app:'diploma-3rd-sem',schemaVersion:1,exportedAt:new Date().toISOString(),stores};
 }
 function plain(value){return value!==null&&typeof value==='object'&&!Array.isArray(value);}
 function requireValue(ok,message){if(!ok)throw Error('Invalid backup: '+message);}
 function validateTree(value,depth=0){
   requireValue(depth<=60,'record nesting exceeds 60 levels');
   if(value===null||typeof value!=='object')return;
   for(const [key,child]of Object.entries(value)){
     requireValue(!['__proto__','constructor','prototype'].includes(key),'unsafe object field '+key);
     validateTree(child,depth+1);
   }
 }
 function validateQuestions(value){
   requireValue(Array.isArray(value)&&value.length<=5000,'questions must be a bounded array');
   const ids=new Set();for(const q of value){requireValue(plain(q)&&typeof q.id==='string'&&q.id.length>0&&!ids.has(q.id),'question IDs must be unique strings');ids.add(q.id);requireValue(typeof q.question==='string','question text must be a string');}
   return ids;
 }
 function validateAttempt(value,history=false){
   requireValue(plain(value),'attempt must be an object');
   if(history)requireValue(typeof value.historyId==='string'&&value.historyId.length>0,'history entry needs a historyId');
   if(value.questions!==undefined){const ids=validateQuestions(value.questions);requireValue(plain(value.answers||{}),'answers must be an object');for(const [id,answer]of Object.entries(value.answers||{})){requireValue(ids.has(id),'answer does not belong to its snapshot');requireValue(answer===null||['string','number','boolean'].includes(typeof answer),'answer must be a scalar');}
     if(value.questionIds!==undefined)requireValue(Array.isArray(value.questionIds)&&JSON.stringify(value.questionIds)===JSON.stringify(value.questions.map(q=>q.id)),'stored question order disagrees with snapshot');
   }
   for(const key of ['startedAt','endsAt','remainingMs','currentIndex','completedAt','savedAt'])if(value[key]!==undefined&&value[key]!==null)requireValue(typeof value[key]==='number'&&Number.isFinite(value[key])&&value[key]>=0,key+' must be a non-negative number');
   if(value.schemaVersion!==undefined)requireValue(value.schemaVersion===1,'unsupported attempt schema');
   if(value.currentIndex!==undefined&&value.questions?.length)requireValue(Number.isInteger(value.currentIndex)&&value.currentIndex<value.questions.length,'invalid question position');
   if(value.status!==undefined)requireValue(['active','submitted','abandoned'].includes(value.status),'invalid attempt status');
   if(value.config!==undefined)requireValue(plain(value.config),'attempt configuration must be an object');
   if(value.flags!==undefined)requireValue(plain(value.flags)&&Object.values(value.flags).every(v=>typeof v==='boolean'),'marked flags must be booleans');
 }
 function validateRecord(key,value){
   validateTree(value);const name=key.slice(PREFIX.length);
   if(name==='schema'){requireValue(plain(value)&&value.version===1&&value.migratedTo===PREFIX,'unsupported storage schema');}
   else if(name==='prefs'){
     requireValue(plain(value),'preferences must be an object');
     const choices={theme:['system','light','dark'],fontScale:[90,100,115,130],lineHeight:['normal','relaxed'],contrast:['normal','high'],lang:['en','bn'],reduceMotion:['system','reduced']};
     for(const [field,allowed]of Object.entries(choices))requireValue(allowed.includes(value[field]),'unknown preference '+field);
   }else if(name==='quiz-history'){
     requireValue(Array.isArray(value)&&value.length<=10000,'history must be an array');const ids=new Set();for(const entry of value){validateAttempt(entry,true);requireValue(!ids.has(entry.historyId),'duplicate history ID');ids.add(entry.historyId);}
   }else if(name==='quiz-result'||name.startsWith('diploma-3rd-sem-attempt-')||name.startsWith('quiz-autosave-')){
     validateAttempt(value);requireValue(Array.isArray(value.questions),'attempt is missing its question snapshot');
   }else if(name.startsWith('section-note:')){
     requireValue(plain(value)&&typeof value.text==='string'&&typeof value.updatedAt==='number'&&Number.isFinite(value.updatedAt)&&value.updatedAt>=0,'section note needs text and updatedAt');
     if(value.url!==undefined)requireValue(typeof value.url==='string','note URL must be text');
   }else if(name==='study:v1'){
     requireValue(plain(value)&&value.schemaVersion===1&&plain(value.cards)&&Array.isArray(value.events),'unsupported study scheduler record');
     requireValue(Number.isInteger(value.goal)&&value.goal>=1&&value.goal<=500&&Number.isInteger(value.newLimit)&&value.newLimit>=0&&value.newLimit<=100,'invalid study limits');
     for(const card of Object.values(value.cards))requireValue(plain(card)&&['new','learning','review'].includes(card.state)&&Number.isFinite(card.due)&&Number.isInteger(card.reps)&&card.reps>=0,'invalid card schedule');
     const eventIds=new Set();for(const event of value.events){requireValue(plain(event)&&typeof event.id==='string'&&!eventIds.has(event.id)&&typeof event.cardId==='string'&&Number.isFinite(event.at)&&/^\d{4}-\d{2}-\d{2}$/.test(event.day)&&['again','hard','good','easy'].includes(event.rating),'invalid or duplicate review event');eventIds.add(event.id);}
   }else if(name==='diploma-3rd-sem-quiz-mistakes'){
     requireValue(plain(value)&&value.schemaVersion===1&&plain(value.items)&&Number.isInteger(value.resolvedCount)&&value.resolvedCount>=0,'invalid mistake queue');
     for(const [id,item]of Object.entries(value.items))requireValue(plain(item)&&item.questionId===id&&plain(item.question)&&item.question.id===id&&typeof item.question.question==='string','mistake identity does not match snapshot');
   }
 }
 function validate(value){
   requireValue(plain(value)&&value.app==='diploma-3rd-sem'&&value.schemaVersion===1&&plain(value.stores),'not a supported Study Hub version-1 backup');
   const rows=Object.entries(value.stores);requireValue(rows.length<=10000&&JSON.stringify(value).length<=5*1024*1024,'backup exceeds 5 MiB / 10,000 record limit');
   for(const [key,raw]of rows){
     requireValue(key.startsWith(PREFIX)&&key!==JOURNAL&&!['__proto__','constructor','prototype'].some(x=>key===PREFIX+x)&&typeof raw==='string','invalid key or value');
     let parsed;try{parsed=JSON.parse(raw);}catch{throw Error('Invalid backup: '+key+' is not valid JSON');}validateRecord(key,parsed);
   }
   return value;
 }
 function mergeRaw(oldRaw,newRaw,key){
   if(oldRaw===null)return newRaw;if(oldRaw===newRaw)return oldRaw;
   let oldValue,newValue;try{oldValue=JSON.parse(oldRaw);newValue=JSON.parse(newRaw);}catch{return oldRaw;}
   if(Array.isArray(oldValue)&&Array.isArray(newValue)){
     const identity=item=>item?.historyId||item?.id||JSON.stringify(item),map=new Map(oldValue.map(item=>[identity(item),item]));
     for(const item of newValue){const id=identity(item),prior=map.get(id);if(!prior||Number(item.updatedAt||item.editedAt||item.savedAt||0)>Number(prior.updatedAt||prior.editedAt||prior.savedAt||0))map.set(id,item);}
     return JSON.stringify([...map.values()]);
   }
   if(oldValue&&newValue&&typeof oldValue==='object'&&typeof newValue==='object'&&('updatedAt' in oldValue||'updatedAt' in newValue))return Number(newValue.updatedAt||0)>Number(oldValue.updatedAt||0)?newRaw:oldRaw;
   if(key.includes('study:v1')&&oldValue.cards&&newValue.cards){
     const cards={...oldValue.cards};for(const [id,value]of Object.entries(newValue.cards)){if(!cards[id]||Number(value.lastReviewed||0)>Number(cards[id].lastReviewed||0))cards[id]=value;}
     const events=new Map((oldValue.events||[]).map(e=>[e.id,e]));for(const e of newValue.events||[])if(!events.has(e.id))events.set(e.id,e);
     return JSON.stringify({...oldValue,cards,events:[...events.values()].sort((a,b)=>a.at-b.at).slice(-5000)});
   }
   if(key.includes('attempt-'))return Number(newValue.savedAt||0)>Number(oldValue.savedAt||0)?newRaw:oldRaw;
   // Non-array conflicts stay local; no silent overwrite of notes or progress.
   return oldRaw;
 }
 function readJournal(){
   const raw=localStorage.getItem(JOURNAL);if(raw===null)return null;
   let journal;try{journal=JSON.parse(raw);}catch{throw Error('Import recovery journal is unreadable; it was retained.');}
   requireValue(plain(journal)&&journal.version===1&&plain(journal.previous)&&Array.isArray(journal.touched),'invalid recovery journal');
   for(const key of journal.touched)requireValue(typeof key==='string'&&key.startsWith(PREFIX)&&key!==JOURNAL,'invalid recovery key');
   for(const [key,value]of Object.entries(journal.previous))requireValue(key.startsWith(PREFIX)&&key!==JOURNAL&&typeof value==='string','invalid original recovery record');
   return journal;
 }
 function recover(){
   const journal=readJournal();if(!journal)return false;
   // Delete newly introduced keys before restoring originals to free their space.
   for(const key of journal.touched)if(!Object.hasOwn(journal.previous,key))localStorage.removeItem(key);
   for(const key of journal.touched)if(Object.hasOwn(journal.previous,key))rawSet(key,journal.previous[key]);
   localStorage.removeItem(JOURNAL);return true;
 }
 function restore(value,mode='merge',importPrefs=false){
   validate(value);assertReady();if(!['merge','replace'].includes(mode))throw Error('Choose merge or replace');migrate();
   const previous=backup().stores,changes={},deletions=[];
   for(const [key,raw]of Object.entries(value.stores)){if(group(key.slice(PREFIX.length))==='preferences'&&!importPrefs)continue;changes[key]=mode==='merge'&&group(key.slice(PREFIX.length))!=='preferences'?mergeRaw(localStorage.getItem(key),raw,key):raw;}
   if(mode==='replace')for(const key of Object.keys(previous))if(!(key in changes)&&(importPrefs||group(key.slice(PREFIX.length))!=='preferences'))deletions.push(key);
   const touched=[...new Set([...Object.keys(changes),...deletions])];
   // If staging exceeds quota, no student records have been changed.
   rawSet(JOURNAL,JSON.stringify({version:1,previous,touched}));
   try{
     for(const [key,raw]of Object.entries(changes))rawSet(key,raw);
     for(const key of deletions)localStorage.removeItem(key);
     localStorage.removeItem(JOURNAL);
   }catch(e){
     try{recover();}catch{throw Error('Import failed and automatic rollback could not finish. Original records remain in the recovery journal. Export the pre-import backup in Settings, free device space, then retry recovery.');}
     throw Error('Import failed; original records were restored. '+e.message);
   }
 }
 const legacy=new Proxy({getItem:getRaw,setItem:setRaw,removeItem:removeRaw,clear:()=>clearGroup('everything'),key:i=>keys()[i]??null}, {get:(target,key)=>key==='length'?keys().length:target[key],ownKeys:()=>keys(),getOwnPropertyDescriptor:()=>({enumerable:true,configurable:true})});
 globalThis.StudyStorage={get,set,remove:removeRaw,keys,clearAll:()=>clearGroup('everything'),clearGroup,estimate,migrate,prefs,setPrefs:value=>{assertReady();const next={...prefs(),...value};validateRecord(PREFS,next);rawSet(PREFS,JSON.stringify(next));applyPreferences();globalThis.dispatchEvent?.(new CustomEvent('study-preferences-change'));},backup,validate,restore,recover,sessionOnce,legacy};
 function applyPreferences(){const p=prefs(),root=globalThis.document?.documentElement;if(root){root.style.fontSize=p.fontScale+'%';root.style.setProperty('--reading-line-height',p.lineHeight==='relaxed'?'1.9':'1.6');root.dataset.contrast=p.contrast;root.dataset.motion=p.reduceMotion;root.dataset.language=p.lang;}const theme=p.theme==='system'?(globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light'):p.theme;globalThis.document?.documentElement.setAttribute('data-theme',theme);}
 try{recover();applyPreferences();globalThis.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(prefs().theme==='system')applyPreferences();});}catch{ /* preference read failure must not blank the page */ }
})();
