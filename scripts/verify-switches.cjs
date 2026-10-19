const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.setDefaultTimeout(8000);
 await page.route('**/tourvisor.ru/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await page.goto('http://localhost:3100/ru/destinations?ref=check');
 await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
 assert.equal(await page.locator('.header-actions .language-active-pill').count(),1,'language uses a sliding plate');
 for(const width of [1440,935,375]){
  await page.setViewportSize({width,height:900});
  await page.goto('http://localhost:3100/ru/destinations?ref=check');
  await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
  await page.evaluate(()=>scrollTo(0,850));
  await page.waitForFunction(()=>scrollY>840);
  for(const locale of ['kk','ru']){
  const before=await page.locator('.header-actions .language-switch').boundingBox();
  // Track every painted frame, not merely the eventual restored position.
  await page.evaluate(()=>{
   window.__switchFrames=[];window.__switchStop=false;
   const record=()=>{window.__switchFrames.push(scrollY);if(!window.__switchStop)requestAnimationFrame(record)};record();
  });
  await page.locator(`.header-actions .language-switch a[lang="${locale}"]`).click();
  await page.waitForURL(`**/${locale}/destinations?ref=check`);
  await page.waitForFunction(locale=>document.documentElement.lang===locale,locale);
  await page.waitForFunction(()=>document.getAnimations().filter(a=>a.effect?.target?.classList?.contains('language-active-pill')).every(a=>a.playState!=='running'));
  const after=await page.locator('.header-actions .language-switch').boundingBox();
  assert.ok(Math.abs(before.x-after.x)<1,`header shift ${width}: ${before.x}->${after.x}`);
  const frames=await page.evaluate(()=>{window.__switchStop=true;return window.__switchFrames});
  assert.ok(frames.every(y=>Math.abs(y-850)<4),`scroll jump ${width}: ${frames.join(',')}`);
  }
 }
 await page.goto('http://localhost:3100/ru#search');
 await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
 await page.evaluate(()=>scrollTo(0,1400));
 await page.waitForFunction(()=>scrollY>1390);
 await page.locator('.header-actions .language-switch a[lang="kk"]').click();
 await page.waitForURL('**/kk#search');
 await page.waitForFunction(()=>Math.abs(scrollY-1400)<4);
 await page.goto('http://localhost:3100/kk/destinations');
 await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
 await page.locator('.theme-control summary').click();
 const first=await page.locator('.theme-active-pill').boundingBox();
 const scroll=await page.evaluate(()=>scrollY);
 await page.locator('input[value="dark"]').check();
 assert.equal(await page.locator('.theme-control').getAttribute('open'),'');
 await page.waitForFunction(()=>Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.theme-active-pill')).transform).m42-92)<0.5);
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 const last=await page.locator('.theme-active-pill').boundingBox();assert.ok(last.y>first.y+80);
 assert.ok(Math.abs(await page.evaluate(()=>scrollY)-scroll)<2);
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('.theme-control summary').evaluate(n=>n===document.activeElement),true);
 await page.setViewportSize({width:1440,height:900});
 await page.locator('.theme-control summary').click();
 await page.screenshot({path:'tmp/verification/animated-switches-dark.png'});
 const blocked=await browser.newContext({viewport:{width:935,height:900}});
 await blocked.addInitScript(()=>{
  for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{get(){throw new Error('blocked')}});
 });
 const blockedPage=await blocked.newPage();blockedPage.setDefaultTimeout(8000);
 await blockedPage.goto('http://localhost:3100/ru/destinations');
 await blockedPage.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
 await blockedPage.evaluate(()=>scrollTo(0,850));
 await blockedPage.locator('.header-actions .language-switch a[lang="kk"]').click();
 await blockedPage.waitForURL('**/kk/destinations');
 await blockedPage.waitForFunction(()=>Math.abs(scrollY-850)<4);
 console.log('PASS: animated language/theme plates; no frame-level scroll jump or header shift at 1440/935/375; keyboard');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
