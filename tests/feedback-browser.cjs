/* Implementation-only regression. No email is sent by this test. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox']});try{
 const c=await b.newContext({serviceWorkers:'block'}),p=await c.newPage(),errors=[];p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));const base=process.env.TEST_BASE||'http://127.0.0.1:8001/after/Diploma-3rd-sem/';
 await p.goto(base+'info/send-feedback.html');assert.equal(await p.locator('button[data-feedback-type]').count(),4);
 await p.locator('[data-feedback-type=bug]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-feedback-type=bug]').getAttribute('aria-pressed'),'true');
 await p.locator('#copy-feedback').click();assert((await p.locator('#feedback-error').innerText()).includes('10–2000'));
 await p.locator('#feedbackMessage').fill('The saved attempt should retain my answers.');await p.locator('#userEmail').fill('invalid');await p.locator('#copy-feedback').click();assert((await p.locator('#feedback-error').innerText()).includes('valid contact email'));
 await p.locator('#userEmail').fill('');let requests=0;p.on('request',()=>requests++);await p.locator('#copy-feedback').click();const draft=await p.locator('#feedback-preview').inputValue();assert(draft.includes('Feedback type: bug'));assert(draft.includes('Build: quiz-paper-rules-2026-11-12'));assert(draft.includes('has not been submitted'));assert.equal(requests,0);
 console.log('PASS keyboard feedback types, field errors, private copy fallback and no feedback request');
 await p.goto(base+'today.html');await p.waitForFunction(()=>document.querySelector('#study-status').textContent.startsWith('Local-only'));
 const prompt=p.getByRole('complementary',{name:'Optional local usefulness feedback'});await prompt.getByRole('button',{name:'Yes',exact:true}).click();assert.equal(await p.evaluate(()=>StudyStorage.get('feedback-usefulness').yes),1);
 await p.reload();assert.equal(await p.getByRole('complementary',{name:'Optional local usefulness feedback'}).count(),0);
 assert.deepEqual(errors,[]);console.log('PASS once-per-tab-session usefulness prompt, local-only count, no repeated prompt');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
