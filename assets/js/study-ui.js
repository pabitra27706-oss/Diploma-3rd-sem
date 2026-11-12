(() => {
 'use strict';const base=new URL('../../',document.currentScript.src),$=s=>document.querySelector(s),status=$('#study-status');
 const node=(tag,text,parent)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;parent?.append(el);return el;};
 const source=c=>new URL(c.sourceType==='pyq'?'pyq/answers.html?'+new URLSearchParams({subject:c.subject,paper:c.paper,q:c.sourceId}):'quiz/setup.html?'+new URLSearchParams({subject:c.subject,unit:c.unit}),base).href;
 async function json(path){const r=await fetch(new URL(path,base));if(!r.ok)throw Error('Study material unavailable. Reconnect and reload; existing progress was retained.');return r.json();}
 async function load(){const manifest=await json('assets/cards/manifest.json');const cards=(await Promise.all(Object.values(manifest.subjects).map(s=>json('assets/cards/'+s.file)))).flat();return {manifest,cards};}
 async function init(){try{
 const {manifest,cards}=await load();const state=StudyStore.read();
 if($('#card-subject')){
   const select=$('#card-subject');Object.keys(manifest.subjects).forEach(s=>select.add(new Option(s,s)));select.value=new URLSearchParams(location.search).get('subject')||'';
   let queue=[],index=0,revealed=false,session=globalThis.crypto?.randomUUID?.()||String(Date.now());
   function start(){const params=new URLSearchParams(location.search);queue=StudyStore.queue(cards.filter(c=>(!select.value||c.subject===select.value)&&(!params.get('unit')||String(c.unit)===params.get('unit'))));index=0;render();}
   function render(){revealed=false;$('#card-answer').hidden=true;$('#reveal-card').hidden=false;const card=queue[index];$('#card-session').hidden=!card;status.textContent=card?'Space reveals; keys 1–4 rate; Esc exits. Ratings save immediately.':'No more due or new cards in this session. Progress is saved locally.';if(!card)return;$('#card-progress').textContent=`${index+1} / ${queue.length}`;$('#card-front').textContent=card.front;$('#card-back').textContent=card.back;$('#card-citation').textContent=card.verification+' · '+card.citation;$('#card-source').href=source(card);$('#reveal-card').focus();}
   function reveal(){if(!queue[index])return;revealed=true;$('#card-answer').hidden=false;$('#reveal-card').hidden=true;const box=$('#card-ratings');box.replaceChildren();['again','hard','good','easy'].forEach((rating,i)=>{const days=StudyStore.next(StudyStore.read().cards[queue[index].id],rating).interval,button=node('button',`${i+1}. ${rating} · ${days} day${days===1?'':'s'}`,box);button.onclick=()=>rate(rating);});box.querySelector('button').focus();status.textContent='Answer revealed. Choose a recall rating and its next interval.';}
   function rate(rating){if(!revealed||!queue[index])return;try{StudyStore.rate(queue[index].id,rating,session+'-'+index);index++;render();}catch(e){status.textContent='Could not save rating: '+e.message;}}
   $('#reveal-card').onclick=reveal;$('#start-cards').onclick=start;
   document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;if(e.code==='Space'&&!revealed){e.preventDefault();reveal();}if(['1','2','3','4'].includes(e.key)){e.preventDefault();rate(['again','hard','good','easy'][Number(e.key)-1]);}if(e.key==='Escape')location.href=new URL('today.html',base);});start();
 }else{
   const history=QuizAttempts.history(),today=StudyStore.day(),events=state.events.filter(e=>e.day===today);let answered=0;const activeDays=new Set(state.events.map(e=>e.day));
   for(const h of history){if(h.outcome==='abandoned')continue;activeDays.add(StudyStore.day(h.completedAt));if(StudyStore.day(h.completedAt)===today)answered+=Object.values(h.answers||{}).filter(QuizAttempts.hasAnswer).length;}
   $('#goal').value=state.goal;$('#new-limit').value=state.newLimit;$('#goal-progress').textContent=`${events.length+answered} / ${state.goal} activities today (${events.length} card reviews + ${answered} answered questions).`;
   function save(field,input,min,max){const value=Number(input.value);if(!Number.isInteger(value)||value<min||value>max){status.textContent=`Choose a whole number from ${min} to ${max}.`;return;}const current=StudyStore.read();current[field]=value;StudyStore.write(current);location.reload();}
   $('#save-goal').onclick=()=>save('goal',$('#goal'),1,500);$('#save-limit').onclick=()=>save('newLimit',$('#new-limit'),0,100);
   const now=new Date();let streak=0;for(let i=0;i<3660;i++){const d=new Date(now);d.setDate(d.getDate()-i);const key=StudyStore.day(d);if(state.streakStart&&key<state.streakStart)break;if(!activeDays.has(key)){if(i===0)continue;break;}streak++;}$('#streak').textContent=`${streak} consecutive local activity days. Any pace is welcome.`;
   $('#reset-streak').onclick=()=>{if(confirm('Start counting activity days from today? Saved reviews remain intact.')){const s=StudyStore.read();s.streakStart=today;StudyStore.write(s);location.reload();}};
   $('#due-count').textContent=`${StudyStore.queue(cards).length} due/new cards available (new-card cap ${state.newLimit}).`;
   $('#mistake-count').textContent=`${Object.keys(QuizAttempts.mistakes().items).length} unresolved local mistakes.`;
   const raw=cards.filter(c=>c.sourceType==='pyq');let offset=0;function daily(){let hash=0;for(const c of today+'d3s-question')hash=(hash*31+c.charCodeAt(0))>>>0;const card=raw[(hash+offset)%raw.length];$('#daily-question').textContent=card?.front||'No sourced question available.';if(card)$('#daily-link').href=source(card);}$('#another-question').onclick=()=>{offset++;daily();};daily();
   const weak=StudyStore.weak(history);const out=$('#weak-areas');if(!weak.length)node('p','No keyed MCQ history yet. Try a quiz first.',out);
   const trends=StudyStore.trends(history);
   for(const row of weak.slice(0,10)){
     const article=node('article',`${row.subject} · unit ${row.unit||'?'} · ${row.topic}: ${row.correct}/${row.attempted} correct, ${row.skipped} skipped. ${row.attempted>=5?Math.round(100*row.correct/row.attempted)+'%':'Not enough data for a percentage.'}`,out);
     const trend=trends.get(row.subject+'|'+(row.unit||'?')+'|'+row.topic);
     if(trend){const samples=`Last 7 local days: ${trend.recent.correct}/${trend.recent.attempted}; previous 7: ${trend.previous.correct}/${trend.previous.attempted}. `;node('p',samples+(trend.delta===null?'Not enough data in both windows for a trend (minimum 5 each).':`Change: ${trend.delta>0?'+':''}${trend.delta} percentage points; descriptive, not a learning-gain claim.`),article);}
     else node('p','No observations in the last two 7-day windows.',article);
     if(row.unit){
       const available=cards.filter(c=>c.subject===row.subject&&Number(c.unit)===Number(row.unit));
       const quizAvailable=available.some(c=>c.sourceType==='quiz');
       if(quizAvailable){const a=node('a','Practise this unit',article);a.href=new URL('quiz/setup.html?'+new URLSearchParams({subject:row.subject,unit:row.unit}),base);}
       else{const a=node('a','Find archived questions for this unit',article);a.href=new URL('search.html?'+new URLSearchParams({subject:row.subject,unit:row.unit}),base);}
       if(available.length){const b=node('a',' · Review related cards',article);b.href=new URL('cards.html?'+new URLSearchParams({subject:row.subject,unit:row.unit}),base);}
       else node('p','No source-eligible cards are available for this stored unit.',article);
     }
   }
   status.textContent='Local-only summary; question counts cover the retained history (up to 50 attempts). No long-term usage tracking.';
 }
 }catch(e){status.textContent=e.message;}}
 init();
})();
