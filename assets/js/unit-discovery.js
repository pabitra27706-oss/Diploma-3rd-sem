/* Read-only cross-links from stored tags; no syllabus retagging. */
(() => {
  const base=new URL('../../',document.currentScript.src),match=location.pathname.match(/subjects\/(CST\d+)\/(?:units\/unit-(\d+)\.html|index\.html)/);
  if(!match)return;const subject=match[1],unit=match[2];
  const panel=document.createElement('section');panel.className='unit-discovery';panel.setAttribute('aria-label','Related study material');panel.style.cssText='padding:1rem;margin:1rem;border:1px solid currentColor;border-radius:.5rem';
  const nav=document.createElement('nav');nav.setAttribute('aria-label','Unit navigation');
  function link(text,path,parent=nav){const a=document.createElement('a');a.textContent=text;a.href=new URL(path,base);a.style.marginInlineEnd='1rem';parent.append(a);return a;}
  link('Study Hub','index.html');link(subject,'subjects/'+subject+'/index.html');
  panel.append(nav);const status=document.createElement('p');status.textContent='Loading related question counts…';panel.append(status);
  (document.querySelector('main')||document.body).append(panel);
  fetch(new URL('assets/search/manifest.json',base)).then(r=>{if(!r.ok)throw Error();return r.json();}).then(async manifest=>{
    const meta=manifest.subjects[subject];if(!meta)throw Error();
    const response=await fetch(new URL('assets/search/'+meta.file+'?v='+meta.sha256,base));if(!response.ok)throw Error();const rows=await response.json();
    const pyqs=rows.filter(r=>r.type==='pyq'&&(!unit||String(r.unit)===unit));
    status.textContent=`${pyqs.length} archived PYQs by stored ${unit?'unit '+unit:'subject'} tags. Historical tags may differ from the current syllabus.`;
    link('Browse related PYQs','search.html?'+new URLSearchParams({subject,unit:unit||''}),panel);
    const list=document.createElement('ul');panel.append(list);
    for(const row of pyqs.slice(0,3)){const li=document.createElement('li');list.append(li);link(row.title,'pyq/answers.html?'+new URLSearchParams({subject,paper:row.paper,q:row.id}),li);}
    const topics=[...new Set(pyqs.map(r=>r.topic).filter(Boolean))].slice(0,10);const p=document.createElement('p');p.textContent='Stored topics: '+(topics.join(', ')||'No specific topics available');panel.append(p);
    const units=[...new Set(rows.filter(r=>r.type==='unit').map(r=>Number(r.unit)))].sort((a,b)=>a-b);
    if(unit){const index=units.indexOf(Number(unit));if(index>0)link('Previous unit','subjects/'+subject+'/units/unit-'+units[index-1]+'.html');if(index>=0&&index<units.length-1)link('Next unit','subjects/'+subject+'/units/unit-'+units[index+1]+'.html');}
    else{const ul=document.createElement('ul');panel.append(ul);for(const u of units){const li=document.createElement('li');ul.append(li);link('Unit '+u+' · '+pyqs.filter(q=>Number(q.unit)===u).length+' PYQs','subjects/'+subject+'/units/unit-'+u+'.html',li);}}
    // Headings without IDs receive stable page-order IDs for copying section links.
    document.querySelectorAll('h2,h3').forEach((heading,i)=>{if(panel.contains(heading))return;heading.id ||= 'section-'+(i+1);const a=document.createElement('a');a.href='#'+heading.id;a.textContent=' #';a.setAttribute('aria-label','Link to '+heading.textContent.trim());heading.append(a);});
  }).catch(()=>{status.textContent='Related material unavailable offline until loaded. Open Search after reconnecting.';link('Search','search.html?subject='+subject,panel);});
})();
