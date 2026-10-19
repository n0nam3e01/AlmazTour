const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./load-ts.cjs');
const { navigationScroll, anchorId } = load('src/lib/scroll.ts');

test('history navigation is left to browser restoration, even with a fragment', () => {
  assert.deepEqual(navigationScroll('/ru#lead', true, null, 1000), { kind: 'native' });
});
test('a language switch restores only its exact target within a short lifetime', () => {
  const saved = JSON.stringify({ href: '/kk/destinations?x=1', y: 840, at: 1000 });
  assert.deepEqual(navigationScroll('/kk/destinations?x=1', false, saved, 1200), { kind: 'position', y: 840 });
  assert.deepEqual(navigationScroll('/kk/contacts', false, saved, 1200), { kind: 'native' });
  assert.deepEqual(navigationScroll('/kk/destinations?x=1', false, saved, 70000), { kind: 'native' });
});
test('language transfers preserve the current position even when an old hash remains in the URL', () => {
  const saved = JSON.stringify({ href: '/kk#lead', y: 840, at: 1000 });
  assert.deepEqual(navigationScroll('/kk#lead', false, saved, 1200), { kind: 'position', y: 840 });
  assert.deepEqual(navigationScroll('/kk#lead', false, null, 1200), { kind: 'anchor', id: 'lead' });
  for (const saved of ['{', 'null', '{"y":-4}', '{"y":"30"}']) {
    assert.deepEqual(navigationScroll('/ru', false, saved, 1200), { kind: 'native' });
  }
  assert.equal(anchorId('/ru#%D1%82%D1%83%D1%80'), 'тур');
  assert.equal(anchorId('/ru#%ZZ'), null);
});
