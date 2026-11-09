/* Optional development test: NODE_PATH pointing to playwright-core, TEST_BASE to a local subpath server.
 * Temporarily bumps sw.js, always restores it. Never run against production. */
const {chromium:pw}=require('playwright-core');
const fs=require('fs');
(async()=>{
const browser=await pw.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,args:['--no-sandbox']});
const ctx=await browser.newContext();const page=await ctx.newPage();
const base=process.env.TEST_BASE || 'http://127.0.0.1:8000/after/Diploma-3rd-sem/';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw Error('Test only against a local disposable server');
await page.goto(base);await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();
await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
console.log('PASS scope',await page.evaluate(()=>navigator.serviceWorker.controller.scriptURL));
await page.goto(base+'practice/index.html');await page.waitForTimeout(1200);
await ctx.setOffline(true);await page.reload();console.log('PASS cached nested offline',await page.title());
await page.goto(base+'never-visited.html');console.log('PASS unvisited offline fallback',await page.title());
if(!/offline/i.test(await page.title()))throw Error('missing offline fallback');
await ctx.setOffline(false);await page.goto(base+'quiz/index.html');
await page.evaluate(()=>{let e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=async()=>{};e.userChoice=Promise.resolve({outcome:'accepted'});window.dispatchEvent(e)});
await page.getByRole('button',{name:'Install app',exact:true}).click();
if(await page.getByRole('button',{name:'Install app',exact:true}).isVisible())throw Error('install not hidden');
console.log('PASS install event/accepted state');
const sw=require('path').resolve(__dirname,'../sw.js');const original=fs.readFileSync(sw,'utf8');
try{
fs.writeFileSync(sw,original.replace('platform-2026-11-09','platform-2026-11-09-test'));
await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update()});
await page.getByRole('button',{name:'Reload to update',exact:true}).waitFor();
console.log('PASS waiting update, no automatic quiz reload',page.url());
page.once('dialog',d=>d.accept());
await page.getByRole('button',{name:'Reload to update',exact:true}).click();await page.waitForTimeout(1500);
console.log('PASS user-confirmed update activation');
}finally{fs.writeFileSync(sw,original)}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
