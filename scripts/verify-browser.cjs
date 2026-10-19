/* Run against npm start -- --port 3100. External integrations are intercepted. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let runningBrowser;

async function main() {
  const output = path.resolve('tmp/verification');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  runningBrowser = browser;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/tourvisor.ru/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* Provider deliberately unavailable during UI verification. */' }));
  let submissions = 0;
  await context.route('**/api/{lead,review,subscribe}', route => { submissions++; return route.fulfill({ contentType: 'application/json', body: '{"ok":true}' }); });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydrat|nest|mismatch|Minified React/i.test(message.text())) errors.push(message.text()); });
  const base = 'http://localhost:3100';
  const routes = ['', '/destinations', '/destinations/turkey', '/hot-tours', '/health-tours', '/reviews', '/contacts'];
  let checked = 0;
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const locale of ['ru', 'kk']) for (const route of routes) {
      const response = await page.goto(`${base}/${locale}${route}`);
      assert.equal(response.status(), 200, `${locale}${route}`);
      await page.locator('h1').waitFor();
      await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
      assert.equal(await page.locator('header').count(), 1);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('footer').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `overflow ${width} ${locale}${route}`);
      assert.ok(await page.locator('h1').innerText());
      if (route === '/destinations') {
        assert.equal(await page.locator(`main a[href="/${locale}/destinations/turkey"]`).count(), 1);
      }
      checked++;
    }
  }
  console.log('route/viewport checks:', checked);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/ru`);
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
  await page.waitForFunction(() => document.getAnimations().filter(a => a.effect?.target?.classList?.contains('reveal')).every(a => a.playState !== 'running'));
  await page.screenshot({ path: path.join(output, 'home-desktop-light.png') });
  const firstTransform = await page.locator('.hero-parallax').evaluate(node => getComputedStyle(node).transform);
  await page.mouse.wheel(0, 240);
  await page.waitForFunction(() => scrollY > 150);
  assert.notEqual(await page.locator('.hero-parallax').evaluate(node => getComputedStyle(node).transform), firstTransform, 'desktop parallax responds to scrolling');
  await page.goto(`${base}/ru`);
  await page.getByRole('link', { name: 'Найти тур', exact: false }).first().click();
  await page.waitForFunction(() => Math.abs(document.getElementById('search').getBoundingClientRect().top - 90) < 4);
  await page.goto(`${base}/ru/destinations`);
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
  await page.evaluate(() => scrollTo(0, 700));
  await page.waitForFunction(() => scrollY >= 690);
  await page.locator('.nav-dock a[href="/ru/contacts"]').click();
  await page.waitForURL('**/ru/contacts');
  await page.goBack();
  await page.waitForURL('**/ru/destinations');
  await page.waitForFunction(() => Math.abs(scrollY - 700) < 10);
  await page.goto(`${base}/ru/destinations/turkey`);
  assert.equal(await page.locator('main input[name="country"]').inputValue(), 'Турция');
  await page.locator('main a[href="/ru/destinations/egypt"]').click();
  await page.waitForURL('**/ru/destinations/egypt');
  await page.waitForFunction(() => document.querySelector('main input[name="country"]')?.value === 'Египет');
  await page.goto(`${base}/ru`);
  const pill = page.locator('.nav-active-pill');
  const originalPill = await pill.elementHandle();
  await page.locator('.nav-dock a[href="/ru/destinations"]').click();
  await page.waitForURL('**/ru/destinations');
  assert.equal(await pill.evaluate((node, original) => node === original, originalPill), true, 'pill persists across navigation');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.nav-active-pill')).transitionDuration.includes('0.42s'));

  await page.locator('.theme-control summary').click();
  await page.locator('input[value="dark"]').check();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(7, 13, 37)');
  await page.goto(`${base}/kk`);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.waitForFunction(() => document.getAnimations().filter(a => a.effect?.target?.classList?.contains('reveal')).every(a => a.playState !== 'running'));
  await page.screenshot({ path: path.join(output, 'home-desktop-dark-kk.png') });
  await page.locator('.theme-control summary').click();
  await page.locator('input[value="system"]').check();
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await page.emulateMedia({ colorScheme: 'light' });

  await page.goto(`${base}/ru/contacts?source=test#lead`);
  const form = page.locator('main form').first();
  await form.locator('input[name="name"]').fill('Тестовый турист');
  await form.locator('input[name="phone"]').fill('+7 777 123 45 67');
  await page.locator('.header-actions .language-switch a[lang="kk"]').click();
  await page.waitForURL('**/kk/contacts?source=test#lead');
  await page.waitForFunction(() => document.querySelector('main input[name="name"]')?.value === 'Тестовый турист');
  assert.equal(await page.locator('main input[name="phone"]').inputValue(), '+7 777 123 45 67');
  await page.locator('main form button[type="submit"]').click();
  await page.locator('main .form-success').waitFor();
  assert.equal(submissions, 1);

  // Same route switching without a fragment restores the scroll position.
  await page.goto(`${base}/ru`);
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForFunction(() => window.scrollY > 800);
  const before = await page.evaluate(() => scrollY);
  await page.locator('.header-actions .language-switch a[lang="kk"]').click();
  await page.waitForURL('**/kk');
  await page.waitForFunction(y => Math.abs(scrollY - y) < 5, before);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/kk`);
  const menu = page.locator('.menu-toggle');
  await menu.click();
  await page.waitForFunction(() => document.activeElement === document.querySelector('#mobile-navigation a'));
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await menu.evaluate(node => node === document.activeElement), true);
  await page.waitForFunction(() => document.getAnimations().filter(a => a.effect?.target?.classList?.contains('reveal')).every(a => a.playState !== 'running'));
  await page.screenshot({ path: path.join(output, 'home-mobile-kk.png') });

  // Native, touch-sized viewport and reduced motion keep the hero stationary.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}/ru`);
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
  await page.evaluate(() => window.scrollTo(0, 500));
  assert.equal(await page.locator('.hero-parallax').evaluate(node => getComputedStyle(node).transform), 'none');
  for (const opacity of await page.locator('.reveal').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity))) assert.equal(opacity, '1');

  // Exercise stalled network timing without waiting on the external provider.
  await page.clock.install();
  await page.goto(`${base}/ru/hot-tours`);
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
  await page.clock.fastForward(16000);
  await page.locator('.widget-fallback').waitFor();
  assert.equal(await page.locator('.widget-skeleton').count(), 0);
  await page.screenshot({ path: path.join(output, 'widget-mobile-fallback.png'), fullPage: true });
  assert.ok(await page.locator('.widget-fallback').boundingBox().then(box => box.height < 400));
  await page.clock.resume();

  for (const url of ['/zz', '/ru/destinations/unknown', '/kk/unknown']) {
    const response = await page.goto(base + url);
    assert.equal(response.status(), 404, url);
  }
  const redirected = await page.goto(`${base}/destinations/turkey?from=legacy`);
  assert.equal(redirected.status(), 200);
  assert.equal(new URL(page.url()).pathname, '/ru/destinations/turkey');
  assert.equal(new URL(page.url()).search, '?from=legacy');

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const staticPage = await noJS.newPage();
  await staticPage.goto(`${base}/kk`);
  for (const opacity of await staticPage.locator('.reveal').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity))) assert.equal(opacity, '1');
  assert.equal(await staticPage.locator('main .accordion-gallery a').first().getAttribute('href'), '/kk/destinations/turkey');
  const blockedStorage = await browser.newContext({ colorScheme: 'dark' });
  await blockedStorage.route('**/tourvisor.ru/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await blockedStorage.addInitScript(() => {
    for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(window, name, { get() { throw new Error('Storage blocked in verification'); } });
  });
  const blockedPage = await blockedStorage.newPage();
  blockedPage.on('pageerror', error => errors.push(error.message));
  await blockedPage.goto(`${base}/ru/contacts`);
  await blockedPage.waitForFunction(() => document.documentElement.classList.contains('lenis'));
  assert.equal(await blockedPage.locator('html').getAttribute('data-theme'), 'dark');
  await blockedPage.locator('main input[name="name"]').fill('Проверка');
  assert.equal(await blockedPage.locator('main input[name="name"]').inputValue(), 'Проверка');
  assert.deepEqual(errors, [], 'no hydration or uncaught errors');
  console.log('PASS: shell, locale, theme/OS, draft, mocked submit, menu/focus, pill, scroll/history/anchor, country defaults, parallax, reduced motion, widget timeout, 404, redirects, no-JS, blocked storage');
  await browser.close();
}
main().catch(async error => { await runningBrowser?.close(); console.error(error); process.exit(1); });
