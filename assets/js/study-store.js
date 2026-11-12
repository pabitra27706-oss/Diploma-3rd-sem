/* Small deterministic Leitner scheduler; no claims of FSRS or recall improvement. */
(() => {
 'use strict';
 const KEY='d3s:study:v1',DAY=86400000,intervals=[1,3,7,16,35];
 function read(){const raw=StudyStorage.legacy.getItem(KEY);if(!raw)return {schemaVersion:1,cards:{},events:[],goal:20,newLimit:20};try{const value=JSON.parse(raw);if(value.schemaVersion!==1||!value.cards||!Array.isArray(value.events))throw Error();return value;}catch{throw Error('Study progress cannot be read. It has not been deleted. Export site data before resetting.');}}
 function write(value){StudyStorage.legacy.setItem(KEY,JSON.stringify(value));return value;}
 function day(now=Date.now()){const d=new Date(now);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 function next(prior,rating,now=Date.now(),eventId=''){
   if(!['again','hard','good','easy'].includes(rating))throw Error('Unknown rating');
   if(eventId&&prior?.lastEventId===eventId)return prior;
   now=Math.max(Number(prior?.lastReviewed)||0,Math.min(now,Date.now()+DAY));
   const box=rating==='again'?0:rating==='hard'?Math.max(0,(prior?.box||0)-1):Math.min(4,(prior?.box??-1)+(rating==='easy'?2:1));
   const interval=intervals[box];
   return {state:rating==='again'?'learning':'review',box,interval,due:now+interval*DAY,reps:(prior?.reps||0)+1,lapses:(prior?.lapses||0)+(rating==='again'?1:0),lastRating:rating,lastReviewed:now,lastEventId:eventId};
 }
 function rate(id,rating,eventId){const state=read();if(state.events.some(e=>e.id===eventId))return state.cards[id];const now=Date.now(),value=next(state.cards[id],rating,now,eventId);state.cards[id]=value;state.events.push({id:eventId,cardId:id,at:now,day:day(now),rating});state.events=state.events.slice(-5000);write(state);return value;}
 function queue(cards,now=Date.now(),state=read()){
   const today=day(now),studied=state.events.filter(e=>e.day===today),seen=new Set(studied.map(e=>e.cardId));
   const due=cards.filter(c=>state.cards[c.id]&&state.cards[c.id].due<=now&&!seen.has(c.id)).sort((a,b)=>state.cards[a.id].due-state.cards[b.id].due||a.id.localeCompare(b.id));
   const fresh=cards.filter(c=>!state.cards[c.id]).sort((a,b)=>a.id.localeCompare(b.id)).slice(0,Math.max(0,state.newLimit-studied.filter(e=>state.cards[e.cardId]?.reps===1).length));return [...due,...fresh];
 }
 const answered=value=>value!==null&&value!==undefined&&String(value).trim()!=='';
 const areaKey=(h,q)=>(q.subject||h.config?.subject||h.subject)+'|'+(q.unit||'?')+'|'+(q.topic||'Unspecified');
 function weak(history){const groups=new Map();for(const h of history){if(h.outcome==='abandoned')continue;for(const q of h.questions||[]){if(q.type!=='mcq'||!q.options||!Object.hasOwn(q.options,q.correct))continue;const key=areaKey(h,q),a=groups.get(key)||{subject:q.subject||h.config?.subject||h.subject,unit:q.unit,topic:q.topic||'Unspecified',attempted:0,correct:0,skipped:0,lastSeen:0};a.attempted++;if(!answered(h.answers?.[q.id]))a.skipped++;else if(h.answers[q.id]===q.correct)a.correct++;a.lastSeen=Math.max(a.lastSeen,h.completedAt||0);groups.set(key,a);}}
 return [...groups.values()].sort((a,b)=>(a.attempted<5)-(b.attempted<5)||(a.correct/a.attempted-b.correct/b.attempted)||b.attempted-a.attempted);}
 function trends(history,now=Date.now(),minimum=5){
   // Calendar-day boundaries use local time, including daylight-saving changes.
   const start=new Date(now);start.setHours(0,0,0,0);
   const boundary=offset=>{const date=new Date(start);date.setDate(date.getDate()+offset);return date.getTime();};
   const recentStart=boundary(-6),previousStart=boundary(-13),end=boundary(1),groups=new Map();
   for(const h of history){if(h.outcome==='abandoned'||!Number.isFinite(h.completedAt)||h.completedAt<previousStart||h.completedAt>=end||h.completedAt>now)continue;
     const window=h.completedAt>=recentStart?'recent':'previous';
     for(const q of h.questions||[]){if(q.type!=='mcq'||!q.options||!Object.hasOwn(q.options,q.correct))continue;
       const key=areaKey(h,q),row=groups.get(key)||{recent:{attempted:0,correct:0,skipped:0},previous:{attempted:0,correct:0,skipped:0}};
       row[window].attempted++;if(!answered(h.answers?.[q.id]))row[window].skipped++;else if(h.answers[q.id]===q.correct)row[window].correct++;groups.set(key,row);
     }
   }
   for(const row of groups.values())row.delta=row.recent.attempted>=minimum&&row.previous.attempted>=minimum?Math.round(row.recent.correct/row.recent.attempted*100)-Math.round(row.previous.correct/row.previous.attempted*100):null;
   return groups;
 }
 globalThis.StudyStore={KEY,day,next,read,write,rate,queue,weak,trends,areaKey,intervals};
})();
