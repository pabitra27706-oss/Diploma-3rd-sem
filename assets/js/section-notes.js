/* Plain-text private notes, mounted on unit pages, practice sessions and quiz
 * review (Phase 6.4). One shared widget so every surface saves the same way:
 * `section-note:<scope>` records `{text, updatedAt, title, url}`, debounced 400 ms,
 * flushed on blur, page hide and before the host re-renders.
 * No HTML is stored: the textarea value is written verbatim and any markup a
 * student types stays literal text. Nothing here touches localStorage directly.
 */
(() => {
 'use strict';
 if (globalThis.SectionNotes) return;

 const mounted=[];
 let sequence=0;

 function keyFor(scope){return 'section-note:'+String(scope).replace(/^\/+/,'');}

 function flush(){
  // Saves only drafts that differ from what is already stored, so a stale
  // second widget on the same key can never overwrite a newer edit.
  for(const record of mounted)record.save();
 }

 /** Builds the note widget and returns its <details> element (not yet inserted). */
 function mount(options={}){
  const {anchor,key,title='Note',label='Private plain-text note',placeholder='Type your note — saved on this device',open=false,compact=false}=options;
  const id='section-note-'+sequence++;
  const details=document.createElement('details');
  details.className='section-note'+(compact?' section-note--compact':'');
  details.open=Boolean(open);
  const summary=document.createElement('summary');
  summary.textContent=title;
  details.append(summary);

  const fieldLabel=document.createElement('label');
  fieldLabel.htmlFor=id;
  fieldLabel.textContent=label;
  const input=document.createElement('textarea');
  input.id=id;
  input.rows=4;
  input.placeholder=placeholder;
  input.style.cssText='display:block;width:100%;box-sizing:border-box';
  details.append(fieldLabel,input);

  const status=document.createElement('span');
  status.id=id+'-status';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  input.setAttribute('aria-describedby',status.id);
  details.append(status);

  const clear=document.createElement('button');
  clear.type='button';
  clear.textContent='Clear this note';
  clear.setAttribute('aria-label',title+': clear this note');
  details.append(clear);

  let timer=null,saved=input.value;
  try{input.value=StudyStorage.get(key,{text:''}).text||'';saved=input.value;}catch(e){status.textContent=e.message;}

  function save(force=false){
   if(!force&&input.value===saved)return;
   clearTimeout(timer);timer=null;
   try{
    if(input.value.trim())StudyStorage.set(key,{text:input.value,updatedAt:Date.now(),title,url:location.pathname+(anchor?.id?'#'+anchor.id:'')});
    else StudyStorage.remove(key);
    saved=input.value;
    status.textContent='Saved on this device';
   }catch(e){status.textContent='Not saved: '+e.message;}
  }

  input.addEventListener('input',()=>{status.textContent='Saving…';clearTimeout(timer);timer=setTimeout(save,400);});
  input.addEventListener('blur',()=>save());
  clear.addEventListener('click',()=>{
   if(!globalThis.confirm||globalThis.confirm('Clear this note?')){input.value='';save(true);status.textContent='Note cleared';}
  });
  input.addEventListener('keydown',event=>{if(event.key==='Escape')input.blur();});

  mounted.push({save,input,details});
  return details;
 }

 function mountAfter(anchor,options){
  const details=mount({...options,anchor});
  const parent=anchor.parentNode;
  if(typeof anchor.insertAdjacentElement==='function'){anchor.insertAdjacentElement('afterend',details);return details;}
  if(!parent){return details;}
  if(typeof parent.insertBefore==='function'){parent.insertBefore(details,anchor.nextSibling);return details;}
  if(Array.isArray(parent.children))parent.children.splice(parent.children.indexOf(anchor)+1,0,details);
  else parent.appendChild(details);
  details.parentNode=parent;
  return details;
 }

 globalThis.SectionNotes={mount,mountAfter,flush,keyFor};
 globalThis.addEventListener?.('pagehide',flush);
 document.addEventListener?.('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();});

 // Unit pages keep their existing behaviour: one note per .section-title.
 if(/\/subjects\/[^/]+\/units\//.test(location.pathname)){
  const headings=[...document.querySelectorAll('.section-title')].filter(heading=>!heading.closest('.unit-discovery'));
  // The heading also contains icon <i> elements (including the "#" anchor
  // icon), so textContent yields "Unit Overview #". Read only the text nodes
  // and drop any anchor marker, so the note label is the heading's own words.
  const labelFor=heading=>{
   const text=[...heading.childNodes]
    .filter(node=>node.nodeType===3||(node.nodeType===1&&!node.classList.contains('collapse-icon')&&!node.classList.contains('section-anchor-link')))
    .map(node=>node.textContent||'')
    .join(' ')
    .replace(/\s*#\s*$/,'')
    .replace(/\s+/g,' ')
    .trim();
   return text||'this section';
  };
  headings.forEach((heading,index)=>{
   heading.id||='section-'+(index+1);
   const scope=location.pathname.split('/subjects/')[1]+'#'+heading.id;
   mountAfter(heading,{key:keyFor(scope),title:'Note on '+labelFor(heading),open:false,compact:true});
  });
 }
})();
