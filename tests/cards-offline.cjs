/* Focused warmed-cache/keyboard regression, not physical-device acceptance. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox']});try{
 const c=await b.newContext(),p=await c.newPage(),base=process.env.TEST_BASE||'http://127.0.0.1:8001/after/Diploma-3rd-sem/';p.setDefaultTimeout(10000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'index.html');await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();await p.waitForFunction(()=>navigator.serviceWorker.controller);
 await p.goto(base+'today.html');await p.waitForFunction(()=>document.querySelector('#study-status').textContent.startsWith('Local-only'));
 await p.goto(base+'cards.html?subject=CST201');await p.waitForFunction(()=>!document.querySelector('#card-session').hidden);
 await c.setOffline(true);await p.reload();await p.waitForFunction(()=>!document.querySelector('#card-session').hidden);
 for(let i=0;i<20;i++){await p.keyboard.press('Space');await p.locator('#card-answer').waitFor({state:'visible'});await p.keyboard.press('3');}
 assert.equal(await p.evaluate(()=>StudyStore.read().events.length),20);assert((await p.locator('#study-status').textContent()).includes('No more due or new cards'));
 await p.reload();await p.waitForFunction(()=>document.querySelector('#study-status').textContent.includes('No more due or new cards'));assert.equal(await p.evaluate(()=>StudyStore.read().events.length),20);
 await p.goto(base+'today.html');await p.waitForFunction(()=>document.querySelector('#study-status').textContent.startsWith('Local-only'));assert((await p.locator('#goal-progress').innerText()).includes('20 card reviews'));
 assert.deepEqual(errors,[]);console.log('PASS 20-card warmed-cache offline keyboard session, reload and Today progress');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
