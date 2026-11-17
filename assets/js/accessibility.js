/* Additive keyboard escape routes and a visible storage-error surface. */
(() => {
 const main=document.querySelector('main')||document.querySelector('#mainContent, .main-content, #appShell, .content');
 if(main&&!document.querySelector('.skip-study-content')){main.id ||= 'study-main-content';const skip=document.createElement('a');skip.href='#'+main.id;skip.className='skip-study-content';skip.textContent='Skip to study content';document.body.prepend(skip);if(!main.hasAttribute('tabindex'))main.tabIndex=-1;skip.onclick=()=>main.focus();}
 window.addEventListener('study-storage-error',event=>{let alert=document.getElementById('study-storage-alert');if(!alert){alert=document.createElement('p');alert.id='study-storage-alert';alert.setAttribute('role','alert');alert.className='study-storage-alert';document.body.append(alert);}alert.replaceChildren(document.createTextNode(String(event.detail)+' '));const dismiss=document.createElement('button');dismiss.type='button';dismiss.textContent='Dismiss';dismiss.onclick=()=>alert.remove();alert.append(dismiss);});
 // Non-modal, one prompt per browser-tab session; no telemetry or added fetch.
 if(main&&/(?:today|quiz\/result)\.html$/.test(location.pathname)&&StudyStorage.sessionOnce('usefulness')){
   const box=document.createElement('aside');box.setAttribute('aria-label','Optional local usefulness feedback');box.style.cssText='padding:1rem;margin:1rem;border:1px solid currentColor';
   const title=document.createElement('p');title.textContent='Was this page useful? Optional; counts stay on this device.';box.append(title);
   const status=document.createElement('p');status.setAttribute('role','status');
   for(const [choice,label]of [['yes','Yes'],['notYet','Not yet'],['dismiss','Dismiss']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>{if(choice==='dismiss'){box.remove();return;}try{const counts=StudyStorage.get('feedback-usefulness',{yes:0,notYet:0});counts[choice]=(Number(counts[choice])||0)+1;StudyStorage.set('feedback-usefulness',counts);title.textContent='Saved locally only. No feedback was transmitted.';for(const b of box.querySelectorAll('button[data-rating]'))b.disabled=true;}catch(error){status.textContent='Could not save local count: '+error.message;}};if(choice!=='dismiss')button.dataset.rating=choice;box.append(button);}
   const copy=document.createElement('button');copy.type='button';copy.textContent='Copy feedback template';copy.onclick=async()=>{const version=document.querySelector('meta[name="app-build"]')?.content||'unreported',text=`Study Hub feedback\nPage: ${location.origin+location.pathname}\nBuild: ${version}\nWhat worked or needs improvement: `;try{await navigator.clipboard.writeText(text);status.textContent='Template copied, not sent.';}catch{let field=box.querySelector('textarea');if(!field){field=document.createElement('textarea');field.setAttribute('aria-label','Feedback template — copy manually');box.append(field);}field.value=text;field.focus();field.select();status.textContent='Copy this template manually; nothing was sent.';}};box.append(copy,status);main.append(box);
 }
 document.addEventListener('keydown',event=>{
   const modal=document.activeElement.closest('[role="dialog"][aria-modal="true"]');if(!modal||event.key!=='Tab')return;
   const focusable=[...modal.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
   const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
})();
/* Print action (Phase 8.3): one labelled control on every page. Pages that
   already own a print flow (the PYQ answer overlay) are skipped, and the
   button never prints itself. Additive and keyboard-operable. */
(() => {
  const main = document.querySelector('main') || document.getElementById('study-main-content');
  if (!main || document.querySelector('.print-page-btn, #printAllBtn')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'print-page-btn';
  button.textContent = 'Print this page';
  button.style.cssText = 'margin:1rem 0;padding:.55rem .9rem;min-height:24px;min-width:24px;font:inherit';
  button.addEventListener('click', () => window.print());
  main.append(button);
})();
