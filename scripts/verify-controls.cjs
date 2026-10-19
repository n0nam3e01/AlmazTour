// Same Playwright/Chrome setup as verify-browser.cjs; npm start -- --port 3100.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
 const page=await browser.newPage({viewport:{width:935,height:720}});page.setDefaultTimeout(8000);
 await page.route('**/tourvisor.ru/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await page.goto('http://localhost:3100/ru');
 await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
 assert.equal(await page.locator('.nav-dock').isVisible(),true,'desktop tab bar visible at 935px');
 assert.equal(await page.locator('.menu-toggle').isVisible(),false);
 const pill=await page.locator('.nav-active-pill').elementHandle();
 await page.locator('.nav-dock a[href="/ru/reviews"]').click();
 await page.waitForURL('**/ru/reviews');
 assert.equal(await page.locator('.nav-active-pill').evaluate((n,p)=>n===p,pill),true);
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.nav-active-pill')).transitionDuration.includes('0.42s'));
 for(const width of [375,768,900,935,1024,1280,1440]){
  await page.setViewportSize({width,height:800});
  for(const lang of ['ru','kk']){
   await page.goto(`http://localhost:3100/${lang}`);
   assert.equal(await page.locator('.nav-dock').isVisible(),width>=900);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width} ${lang}`);
  }
 }
 for(const selector of ['.button-primary','.button-secondary','.theme-control summary','.language-switch a','.whatsapp-float']){
  const button=page.locator(selector).filter({visible:true}).first();
  await button.hover();
  await page.waitForFunction(s=>{const el=[...document.querySelectorAll(s)].find(n=>n.getBoundingClientRect().width&&n.matches(':hover'));return el&&new DOMMatrix(getComputedStyle(el).transform).a>1.02},selector);
  await page.mouse.down();
  await page.waitForFunction(s=>{const el=[...document.querySelectorAll(s)].find(n=>n.getBoundingClientRect().width&&n.matches(':active'));return el&&new DOMMatrix(getComputedStyle(el).transform).a<1},selector);
  await page.mouse.move(0,0);await page.mouse.up();
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 const cta=page.locator('.header-cta');await cta.hover();
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.header-cta')).transform==='none');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:935,height:720});
 await page.evaluate(()=>window.getSelection()?.removeAllRanges());
 await page.screenshot({path:'tmp/verification/desktop-tabbar-935.png'});
 console.log('PASS: desktop dock/persistent pill, 14 viewport/language layouts, hover/press controls, reduced motion');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
