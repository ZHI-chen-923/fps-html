const {chromium}=require('C:/Users/13816/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///D:/%E7%81%B5%E6%95%8F%E5%BA%A6%E8%B0%83%E8%AF%95/index.html');
 await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.screenshot({path:'preview-desktop.png',fullPage:true});
 assert.equal(await page.locator('#previewCm').innerText(),'41.56');
 await page.locator('#profileForm button[type=submit]').click();
 await page.locator('#accelOff').check();
 async function calibrate(){await page.locator('#calStart').click();await page.locator('#lockStart').click();await page.waitForFunction(()=>document.pointerLockElement?.id==='canvas');await page.evaluate(()=>{for(let i=0;i<100;i++)document.dispatchEvent(new MouseEvent('mousemove',{movementX:31.5,movementY:0}));document.exitPointerLock()});await page.waitForFunction(()=>mode==='ready');await page.locator('#closeArena').click()}
 await calibrate();await calibrate();assert.match(await page.locator('#calState').innerText(),/已校准/);
 console.log('PASS: real browser pointer-lock acquisition; two distance calibration runs');
 await page.clock.install();
 await page.locator('.nav [data-view=tests]').click();await page.locator('#startSession').click();await page.locator('#lockStart').click();await page.waitForFunction(()=>document.pointerLockElement?.id==='canvas');
 await page.clock.runFor(4000);let t1=Number(await page.locator('#timer').innerText());await page.clock.runFor(1000);let t2=Number(await page.locator('#timer').innerText());assert(t2<t1);console.log('PASS: countdown advances',t1,'→',t2);
 await page.evaluate(()=>document.exitPointerLock());await page.waitForFunction(()=>mode==='ready');assert.equal(await page.evaluate(()=>session.samples.length),0);assert.match(await page.locator('#overlayTitle').innerText(),/中断/);
 console.log('PASS: unlocking aborts round without recording a result');
 await page.locator('#lockStart').click();await page.waitForFunction(()=>document.pointerLockElement?.id==='canvas');await page.clock.runFor(3100);
 await page.evaluate(()=>{const r=run;const gain=r.sens*profile.yaw*profile.dpi/(2.54*calibration.units);for(let i=0;i<5;i++){const q=r.target;document.dispatchEvent(new MouseEvent('mousemove',{movementX:(q.x-r.yaw)/gain,movementY:(q.y-r.pitch)/gain}))}});
 assert((await page.evaluate(()=>run.hits))>=4);console.log('PASS: touching targets without clicking records hits');
 await page.clock.runFor(15000);await page.waitForFunction(()=>mode==='ready');assert.equal(await page.evaluate(()=>session.samples.length),1);
 console.log('PASS: deadline completes round and advances session');
 await page.locator('#closeArena').click();await page.locator('[data-practice=track]').click();await page.locator('#lockStart').click();await page.waitForFunction(()=>document.pointerLockElement?.id==='canvas');await page.clock.runFor(3100);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await page.evaluate(()=>mode),'ready');assert.equal(await page.evaluate(()=>session.samples.length),1);console.log('PASS: focus loss invalidates practice / test run');await page.locator('#closeArena').click();
 // Deterministic synthetic scores only validate analysis math, not human performance.
 await page.evaluate(()=>{session.samples=makePlan(session.candidates).map(x=>({...x,score:x.candidate===1?2:1,hits:10,coverage:.5,error:2,completion:.8,events:50,duration:15}));buildReport()});
 assert.equal(await page.evaluate(()=>report.sens),await page.evaluate(()=>session.candidates[1]));await page.locator('.nav [data-view=result]').click();assert.match(await page.locator('#resultCommand').innerText(),/^sensitivity \d+\.\d{4}$/);assert.equal(await page.locator('#comparison tr').count(),3);
 await page.screenshot({path:'preview-report.png',fullPage:true});
 const dlPromise=page.waitForEvent('download');await page.locator('#downloadCfg').click();const dl=await dlPromise;assert.equal(dl.suggestedFilename(),'aim-dna-cs2.cfg');console.log('PASS: analysis ranks measured best candidate and exports CS2 cfg');
 await page.reload();assert.equal(await page.evaluate(()=>session.samples.length),18);assert(await page.evaluate(()=>!!report));console.log('PASS: local state survives reload');
 await page.locator('.nav [data-view=profile]').click();await page.locator('#dpi').fill('1600');await page.locator('#dpi').dispatchEvent('change');assert.equal(await page.evaluate(()=>calibration),null);assert.equal(await page.evaluate(()=>report),null);console.log('PASS: changing DPI invalidates calibration and stale recommendations');
 // Formula, input bounds and same-distance conversion.
 assert(Math.abs(await page.evaluate(()=>cm360(1,800,.022))-51.95454545)<1e-6);
 await page.evaluate(()=>{for(const sens of [.0001,.0002,1,7.9,8]){profile.sens=sens;const c=candidates();if(c.some(x=>x<.0001||x>8)||new Set(c).size!==3)throw new Error('candidate bounds')}});
 await page.locator('#gameSelect').selectOption('convert');await page.locator('#targetYaw').fill('0.022');assert.match(await page.locator('#convertResult').innerText(),/目标灵敏度/);console.log('PASS: cm/360 formula, candidate bounds, other-game converter');
 await page.setViewportSize({width:390,height:844});await page.locator('.nav [data-view=profile]').click();await page.screenshot({path:'preview-mobile.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('PASS: mobile layout fits viewport');
 assert.deepEqual(errors,[]);console.log('PASS: no uncaught browser errors');
 await page.evaluate(()=>localStorage.clear());await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
