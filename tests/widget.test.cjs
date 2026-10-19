const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./load-ts.cjs');
const { watchWidget } = load('src/lib/widget.ts');

test('a hung widget leaves loading after 15 seconds and can recover when content arrives', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let mutation;
  const original = global.MutationObserver;
  global.MutationObserver = class { constructor(callback) { mutation = callback; } observe() {} disconnect() {} };
  t.after(() => { global.MutationObserver = original; });
  const host = { childElementCount: 0 };
  const states = [];
  const cleanup = watchWidget(host, state => states.push(state));
  t.mock.timers.tick(14999);
  assert.deepEqual(states, []);
  t.mock.timers.tick(1);
  assert.deepEqual(states, ['failed']);
  host.childElementCount = 1;
  mutation();
  assert.deepEqual(states, ['failed', 'ready']);
  cleanup();
});

test('unmounted widgets cannot update state; ready widgets never regress on timeout', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const original = global.MutationObserver;
  let mutation;
  global.MutationObserver = class { constructor(callback) { mutation = callback; } observe() {} disconnect() {} };
  t.after(() => { global.MutationObserver = original; });
  const states = [];
  const cleanup = watchWidget({ childElementCount: 0 }, state => states.push(state));
  cleanup();
  mutation();
  t.mock.timers.tick(16000);
  assert.deepEqual(states, []);
  watchWidget({ childElementCount: 1 }, state => states.push(state));
  t.mock.timers.tick(16000);
  assert.deepEqual(states, ['ready']);
});
