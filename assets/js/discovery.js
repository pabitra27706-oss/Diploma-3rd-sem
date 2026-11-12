/* Search only derived shards. User/query/source text is never inserted as HTML. */
(() => {
  'use strict';
  const base=new URL('../../',document.currentScript.src);
  const fold=value=>String(value).normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase().replace(/[^\p{L}\p{N}_\s]/gu,' ').replace(/\s+/g,' ').trim();
  function link(row) {
    if(row.url){const url=new URL(row.url,base);if(url.origin===base.origin&&url.pathname.startsWith(base.pathname))return url.href;return new URL('settings.html',base).href;}
    if(row.type==='pyq')return new URL('pyq/answers.html?'+new URLSearchParams({subject:row.subject,paper:row.paper,q:row.id}),base).href;
    return new URL('quiz/setup.html?'+new URLSearchParams({subject:row.subject,unit:row.unit}),base).href;
  }
  const node=(tag,text,parent)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;parent?.append(el);return el;};
  async function json(path){const r=await fetch(new URL(path,base));if(!r.ok)throw Error(`Cannot load ${path}. Reconnect and retry.`);return r.json();}
  const cache=new Map();
  async function shard(subject,meta){const key=subject+meta.sha256;if(!cache.has(key))cache.set(key,json('assets/search/'+meta.file+'?v='+meta.sha256).then(rows=>rows.map(row=>({...row,subject})) ).catch(e=>{cache.delete(key);throw e;}));return cache.get(key);}
  async function search(){
    const input=document.querySelector('#query'),subject=document.querySelector('#subject'),unit=document.querySelector('#unit'),results=document.querySelector('#search-results'),status=document.querySelector('#search-status');
    let manifest=null,run=0,timer;
    async function render(push=false){
      const ticket=++run,q=input.value,sub=subject.value,u=unit.value;
      if(push){const url=new URL(location.href);for(const [key,value]of Object.entries({q,subject:sub,unit:u}))value?url.searchParams.set(key,value):url.searchParams.delete(key);if(url.href!==location.href)history.pushState(null,'',url);}
      status.textContent='Loading search index…';
      try{
        manifest ||= await json('assets/search/manifest.json');
        if(subject.options.length===1)Object.keys(manifest.subjects).forEach(code=>subject.add(new Option(code,code)));
        subject.value=sub;
        const codes=sub?[sub]:Object.keys(manifest.subjects);
        if(codes.some(code=>!manifest.subjects[code]))throw Error('Unknown subject. Choose a listed subject.');
        const rows=(await Promise.all(codes.map(code=>shard(code,manifest.subjects[code])))).flat();
        for(const key of StudyStorage.keys('section-note:')){const note=StudyStorage.get(key);const match=key.match(/section-note:(CST\d+)\/units\/unit-(\d+)/);if(note?.text&&match&&(!sub||match[1]===sub))rows.push({id:key,type:'note',subject:match[1],unit:Number(match[2]),title:'Private note: '+(note.title||'Untitled'),text:fold(note.text+' '+(note.title||'')),url:note.url});}

        if(ticket!==run)return;
        const start=performance.now(),terms=fold(q).split(' ').filter(Boolean);
        const hits=rows.filter(row=>(!u || String(row.unit)===u)&&terms.every(term=>row.text.includes(term)));
        results.replaceChildren();
        if(!terms.length&&!u){status.textContent='Search question stems, topics or unit headings. Select a unit to browse its stored tags.';return;}
        const shown=hits.slice(0,100);
        for(const type of ['pyq','quiz','unit','note']){
          const group=shown.filter(row=>row.type===type);if(!group.length)continue;
          const section=node('section',undefined,results);node('h2',`${type.toUpperCase()} (${hits.filter(row=>row.type===type).length})`,section);
          for(const row of group){const article=node('article',undefined,section),a=node('a',row.title,article);a.href=link(row);node('small',`${row.subject} · stored unit ${row.unit??'unknown'} · ${row.year||'notes'} · ${row.marks??'—'} marks`,article);}
        }
        if(!hits.length){const topics=[...new Set(rows.filter(r=>r.topic).map(r=>r.topic))].slice(0,8);node('p','Try a shorter term or remove the unit/subject filter. Example topics: '+topics.join(', '),results);}
        status.textContent=`${hits.length} matches; showing ${shown.length}. Local filtering and rendering: ${Math.round(performance.now()-start)} ms.`;
      }catch(error){if(ticket===run){results.replaceChildren();status.textContent=error.message;const retry=node('button','Retry',results);retry.onclick=()=>render();}}
    }
    function restore(){const p=new URLSearchParams(location.search);input.value=p.get('q')||'';const s=p.get('subject')||'';if(s&&![...subject.options].some(o=>o.value===s))subject.add(new Option(s,s));subject.value=s;unit.value=p.get('unit')||'';render();}
    document.querySelector('#search-form').onsubmit=e=>{e.preventDefault();render(true);};
    input.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>render(true),120);};subject.onchange=unit.onchange=()=>render(true);
    window.addEventListener('popstate',restore);
    document.addEventListener('keydown',e=>{
      if((e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();input.focus();}
      if(e.key==='Escape'&&document.activeElement===input){input.value='';render(true);}
      const links=[...results.querySelectorAll('a')];let i=links.indexOf(document.activeElement);
      if(e.key==='ArrowDown'&&(document.activeElement===input||i>=0)){e.preventDefault();links[Math.min(i+1,links.length-1)]?.focus();}
      if(e.key==='ArrowUp'&&i>=0){e.preventDefault();(links[i-1]||input).focus();}
    });restore();
  }
  async function repeated(){const status=document.querySelector('#repeat-status'),out=document.querySelector('#repeat-results');try{
    const data=await json('assets/search/repeated.json');status.textContent=`${data.method} ${data.groups.length} groups, ${data.aliasCount} extra appearances across ${data.rawCount} archived questions.`;
    const summary=new Map();for(const group of data.groups){const q=group.canonical,k=q.subject+' · stored unit '+q.unit;summary.set(k,(summary.get(k)||0)+group.appearances.length);}
    node('h2','Repeated appearances by stored unit (archive sample, not prediction)',out);const list=node('ul',undefined,out);for(const [key,count]of [...summary].sort((a,b)=>b[1]-a[1]))node('li',`${key}: ${count} appearances`,list);
    for(const group of data.groups){const q=group.canonical,article=node('article',undefined,out),a=node('a',q.title,article);a.href=link(q);node('small',`${q.subject} · stored unit ${q.unit} · ${group.appearances.length} appearances`,article);const links=node('ul',undefined,article);for(const row of group.appearances){const li=node('li',undefined,links),chip=node('a',`${row.month} ${row.year} · ${row.paper} · ${row.id}`,li);chip.href=link(row);}}
  }catch(error){status.textContent=error.message;}}
  if(document.querySelector('#search-form'))search();if(document.querySelector('#repeat-results'))repeated();
})();
