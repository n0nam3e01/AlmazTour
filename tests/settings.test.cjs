const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { load } = require('./load-ts.cjs');
const read = (p) => fs.existsSync(path.join(__dirname, '..', p)) ? load(p) : {};
const i18n = read('src/lib/i18n.ts');
const theme = read('src/lib/theme.ts');

test('switching language retains a country route, query and fragment', () => {
  assert.equal(typeof i18n.switchLocale, 'function', 'language routing is not implemented');
  assert.equal(i18n.switchLocale('/ru/destinations/turkey?source=card#lead', 'kk'), '/kk/destinations/turkey?source=card#lead');
  assert.equal(i18n.switchLocale('/kk?ref=menu#search', 'ru'), '/ru?ref=menu#search');
});
test('old paths localize without double prefixes or external redirects', () => {
  assert.equal(typeof i18n.localizePath, 'function');
  assert.equal(i18n.localizePath('/contacts#lead', 'kk'), '/kk/contacts#lead');
  assert.equal(i18n.localizePath('/', 'ru'), '/ru');
  assert.equal(i18n.localizePath('/ru/reviews', 'ru'), '/ru/reviews');
  assert.equal(i18n.localizePath('https://example.com/ru', 'kk'), 'https://example.com/ru');
  assert.equal(i18n.localizePath('//example.com/ru', 'kk'), '//example.com/ru');
  assert.equal(i18n.hasLocale('en'), false);
  assert.equal(i18n.hasLocale('kk'), true);
  assert.equal(i18n.stripLocale('/kk/destinations/turkey'), '/destinations/turkey');
});
test('metadata maps the same page to both languages', () => {
  assert.equal(typeof i18n.pageAlternates, 'function');
  assert.deepEqual(i18n.pageAlternates('/contacts', 'kk'), {
    canonical:'/kk/contacts', languages:{ru:'/ru/contacts', kk:'/kk/contacts', 'x-default':'/ru/contacts'},
  });
});
test('theme follows OS only in system mode and invalid values default to system', () => {
  assert.equal(typeof theme.parseThemeMode, 'function');
  for (const value of [null, 'broken', 'DARK', '', {}]) assert.equal(theme.parseThemeMode(value), 'system');
  assert.equal(theme.resolveTheme('system', true), 'dark');
  assert.equal(theme.resolveTheme('system', false), 'light');
  assert.equal(theme.resolveTheme('light', true), 'light');
  assert.equal(theme.resolveTheme('dark', false), 'dark');
});
test('first paint boot script sets theme with blocked storage and dark OS', () => {
  assert.equal(typeof theme.themeBootScript, 'string');
  const root = {dataset:{}, style:{}, classList:{toggle(){}}};
  vm.runInNewContext(theme.themeBootScript, {
    document:{documentElement:root}, window:{matchMedia:()=>({matches:true})},
    localStorage:{getItem(){throw new Error('disabled');}},
  });
  assert.equal(root.dataset.theme, 'dark');
  assert.equal(root.style.colorScheme, 'dark');
});
