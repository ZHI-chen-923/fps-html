// Browser integration checks with programmatically simulated mouse input.
// This does not measure a person's skill or verify CS2 gameplay feel.
const {chromium}=require('C:/Users/13816/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///D:/%E7%81%B5%E6%95%8F%E5%BA%A6%E8%B0%83%E8%AF%95/index.html');
 await page.clock.install();
 await page.locator('#duration').selectOption('10');
 await page.locator('#profileForm button[type=submit]').click();await page.locator('#accelOff').check();
 for(let j=0;j<2;j++){await page.locator('#calStart').click();await page.locator('#lockStart').click();await page.waitForFunction(()=>document.pointerLockElement?.id==='canvas');await page.evaluate(()=>{for(let i=0;i<100;i++)document.dispatchEvent(new MouseEvent('mousemove',{movementX:32,movementY:0}));document.exitPointerLock()});await page.waitForFunction(()=>mode==='ready');await page.locator('#closeArena').click()}
 await page.locator('.nav [data-view=tests]').click();await page.locator('#startSession').click();
 for(let round=0;round<18;round++){
  await page.locator('#lockStart').click();await page.waitForFunction(()=>document.pointerLockElement?.id==='canvas');await page.clock.runFor(3100);
  if(round===0)await page.screenshot({path:'preview-arena.png'});
  for(let j=0;j<100;j++){
   await page.evaluate(()=>{if(mode!=='running')return;let q=run.task==='track'?targetTrack(performance.now()+50):run.target;const gain=run.sens*profile.yaw*profile.dpi/(2.54*calibration.units);document.dispatchEvent(new MouseEvent('mousemove',{movementX:Math.round((q.x-run.yaw)/gain),movementY:Math.round((q.y-run.pitch)/gain)}))});
   await page.clock.runFor(100);
  }
  assert.equal(await page.evaluate(()=>session.samples.length),round+1,`round ${round+1} recorded`);
  console.log('PASS: end-to-end round',round+1,await page.evaluate(()=>session.samples.at(-1).task));
 }
 assert.equal(await page.evaluate(()=>!!report),true);await page.locator('#closeArena').click();assert.equal(await page.locator('#result').isVisible(),true);
 assert.equal(await page.locator('#comparison tr').count(),3);assert.equal(await page.evaluate(()=>new Set(session.samples.map(r=>r.sens)).size),3);assert.equal(await page.evaluate(()=>history.length),1);
 console.log('PASS: all 18 rounds generate report, progress, comparison and history');
 // Reset input metrics when moving from one task to the next.
 assert.deepEqual(errors,[]);console.log('PASS: no browser errors throughout complete assessment');
 await page.evaluate(()=>localStorage.clear());await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
