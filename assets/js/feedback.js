/* Email preparation only. No fetch, upload, hidden form submit, or saved draft. */
(() => {
 'use strict';let selected='other';const $=s=>document.querySelector(s),message=$('#feedbackMessage'),email=$('#userEmail'),status=$('#feedback-status'),error=$('#feedback-error');
 document.querySelectorAll('[data-feedback-type]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.feedbackType;document.querySelectorAll('[data-feedback-type]').forEach(item=>{item.classList.toggle('selected',item===button);item.setAttribute('aria-pressed',String(item===button));});}));
 message.addEventListener('input',()=>{$('#charCount').textContent=message.value.length;message.removeAttribute('aria-invalid');error.textContent='';});
 email.addEventListener('input',()=>{email.removeAttribute('aria-invalid');error.textContent='';});
 function prepare(){
   error.textContent='';
   if(message.value.trim().length<10||message.value.length>2000){error.textContent='Enter 10–2000 characters of feedback.';message.setAttribute('aria-invalid','true');message.focus();return null;}
   if(!email.validity.valid){error.textContent='Enter a valid contact email, or leave it empty.';email.setAttribute('aria-invalid','true');email.focus();return null;}
   const version=document.querySelector('meta[name="app-build"]')?.content||'unreported',subject='Study Hub Feedback: '+selected;
   const body=`Feedback type: ${selected}\n\n${message.value.trim()}\n\nReply email: ${email.value.trim()||'not provided'}\nPage: ${location.origin+location.pathname}\nBuild: ${version}\nPrepared locally: ${new Date().toISOString()}\n\nThis draft has not been submitted by the site.`;
   $('#feedback-preview').value=subject+'\n\n'+body;return {subject,body};
 }
 $('#feedback-form').addEventListener('submit',event=>{event.preventDefault();const draft=prepare();if(!draft)return;status.textContent='Opening your email app. Nothing is confirmed sent; review and send the draft there, or copy it below.';location.href='mailto:chakraborttypabi2772006@gmail.com?'+new URLSearchParams({subject:draft.subject,body:draft.body});});
 $('#copy-feedback').addEventListener('click',async()=>{if(!prepare())return;try{await navigator.clipboard.writeText($('#feedback-preview').value);status.textContent='Feedback copied, not submitted. Paste it into an email when ready.';}catch{$('#feedback-preview').focus();$('#feedback-preview').select();status.textContent='Clipboard unavailable. Select and copy the prepared message manually; nothing was submitted.';}});
})();
