/* Additive plain-text section notes; no source HTML or PYQ modification. */
(() => {
 const headings=[...document.querySelectorAll('.section-title')].filter(h=>!h.closest('.unit-discovery'));
 headings.forEach((heading,index)=>{
  heading.id ||= 'section-'+(index+1);const key='section-note:'+location.pathname.split('/subjects/')[1]+'#'+heading.id;
  const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='My note for '+heading.textContent.trim();details.append(summary);const label=document.createElement('label'),input=document.createElement('textarea');input.id='section-note-'+index;input.rows=4;input.style.cssText='display:block;width:100%;box-sizing:border-box';label.htmlFor=input.id;label.textContent='Private plain-text note';details.append(label,input);const status=document.createElement('span');status.setAttribute('role','status');details.append(status);const clear=document.createElement('button');clear.type='button';clear.textContent='Clear this note';details.append(clear);heading.insertAdjacentElement('afterend',details);
  try{input.value=StudyStorage.get(key,{text:''}).text||'';}catch(e){status.textContent=e.message;}
  let timer;function save(){clearTimeout(timer);try{if(input.value.trim())StudyStorage.set(key,{text:input.value,updatedAt:Date.now(),title:heading.textContent.trim(),url:location.pathname+'#'+heading.id});else StudyStorage.remove(key);status.textContent='Saved locally';}catch(e){status.textContent='Not saved: '+e.message;}}
  input.oninput=()=>{status.textContent='Saving…';clearTimeout(timer);timer=setTimeout(save,400);};input.onblur=save;clear.onclick=()=>{if(confirm('Clear this section note?')){input.value='';save();}};window.addEventListener('pagehide',()=>{if(timer)save();});
 });
})();
