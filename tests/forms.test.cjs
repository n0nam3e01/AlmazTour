const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./load-ts.cjs');

const routes = Object.fromEntries(['lead', 'review', 'subscribe'].map(kind => [kind, load(`src/app/api/${kind}/route.ts`).POST]));
const valid = {
  lead: { name: 'Synthetic Guest', phone: '+7 777 123 45 67' },
  review: { name: 'Synthetic Guest', text: 'A synthetic review for isolated tests.' },
  subscribe: { email: 'synthetic@example.test' },
};
let deliveries;
let logs;
let savedEnv;
let savedFetch;
let savedConsole;
beforeEach(() => {
  savedEnv = Object.fromEntries(['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'TELEGRAM_CHAT_IDS'].map(key => [key, process.env[key]]));
  process.env.TELEGRAM_BOT_TOKEN = 'synthetic-token';
  process.env.TELEGRAM_CHAT_ID = 'synthetic-chat';
  delete process.env.TELEGRAM_CHAT_IDS;
  deliveries = [];
  logs = [];
  savedFetch = global.fetch;
  savedConsole = { log: console.log, error: console.error };
  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => logs.push(args.join(' '));
  global.fetch = async (url, init) => {
    assert.match(String(url), /^https:\/\/api\.telegram\.org\/botsynthetic-token\/sendMessage$/);
    deliveries.push(JSON.parse(init.body));
    return Response.json({ ok: true, result: { message_id: 1 } });
  };
});
afterEach(() => {
  global.fetch = savedFetch;
  Object.assign(console, savedConsole);
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
const request = (body) => new Request('http://localhost/api/test', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });

test('quick contact-only lead reaches the real delivery helper', async () => {
  const res = await routes.lead(request({ ...valid.lead, mode: 'quick', locale: 'kk' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(deliveries.length, 1);
  assert.match(deliveries[0].text, /Synthetic Guest/);
  assert.match(deliveries[0].text, /kk/);
});

test('expanded and legacy leads deliver all selected fields with escaped HTML', async () => {
  const expanded = { ...valid.lead, name: 'Guest <b>&', mode: 'detailed', locale: 'kk', context: 'turkey', departureCity: 'Астана', country: 'Түркия', dates: '10–20 августа', budget: '800000 KZT', adults: '2', children: ['0', 17], stars: ['4★', '5★'], email: 'synthetic@example.test', comment: '<script>hello</script>' };
  assert.equal((await routes.lead(request(expanded))).status, 200);
  const message = deliveries[0].text;
  for (const value of ['detailed', 'kk', 'turkey', 'Астана', 'Түркия', '10–20 августа', '800000 KZT', '4★', '5★', '17', 'synthetic@example.test', '&lt;script&gt;hello&lt;/script&gt;', 'Guest &lt;b&gt;&amp;']) assert.ok(message.includes(value), value);
  assert.equal((await routes.lead(request({ ...valid.lead, country: 'Турция', dates: 'летом', adults: '2', children: ['7'], stars: ['3★'], email: '', comment: '' }))).status, 200);
});

for (const kind of ['lead', 'review', 'subscribe']) {
  test(`${kind}: missing configuration returns 503, never false success`, async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    const res = await routes[kind](request(valid[kind]));
    assert.equal(res.status, 503);
    assert.notEqual((await res.json()).ok, true);
    assert.equal(deliveries.length, 0);
  });
  test(`${kind}: malformed JSON and non-object bodies return 400`, async () => {
    for (const body of ['{', 'null', '[]', '42', '"input"']) {
      const res = await routes[kind](new Request('http://localhost', { method: 'POST', body }));
      assert.equal(res.status, 400, body);
    }
    assert.equal(deliveries.length, 0);
  });
  test(`${kind}: total delivery failure returns 502; partial delivery returns 200`, async () => {
    global.fetch = async () => Response.json({ ok: false, error_code: 403 }, { status: 403 });
    assert.equal((await routes[kind](request(valid[kind]))).status, 502);
    global.fetch = async () => { throw new Error('network unavailable'); };
    assert.equal((await routes[kind](request(valid[kind]))).status, 502);
    process.env.TELEGRAM_CHAT_IDS = 'second-chat,synthetic-chat';
    global.fetch = async (_url, init) => Response.json({ ok: JSON.parse(init.body).chat_id === 'second-chat' });
    assert.equal((await routes[kind](request(valid[kind]))).status, 200);
  });
  test(`${kind}: delivered content is absent from diagnostics`, async () => {
    assert.equal((await routes[kind](request({ ...valid[kind], country: 'Турция' }))).status, 200);
    assert.equal(logs.join(' '), '');
  });
}

test('lead rejects malformed fields and bounds before delivery', async () => {
  const bad = [{ name: {} }, { name: null }, { phone: ['7771234567'] }, { phone: 'abcdefghijk' }, { phone: '12345' }, { phone: '+1234567890123456' }, { email: 'bad' }, { country: {} }, { dates: [] }, { budget: null }, { departureCity: 7 }, { adults: 0 }, { adults: 21 }, { adults: 1.5 }, { adults: '2e0' }, { children: [18] }, { children: [-1] }, { children: [1.2] }, { children: [''] }, { children: [null] }, { children: '7' }, { children: Array(11).fill(2) }, { stars: ['6★'] }, { stars: '4★' }, { stars: [4] }, { mode: 'other' }, { locale: 'en' }, { context: {} }, { comment: 'x'.repeat(1501) }, { name: 'x'.repeat(101) }];
  for (const fields of bad) assert.equal((await routes.lead(request({ ...valid.lead, ...fields }))).status, 422, JSON.stringify(fields));
  assert.equal(deliveries.length, 0);
});

test('optional trip details may remain empty and numeric boundaries are accepted', async () => {
  for (const adults of ['', 1, '20']) {
    assert.equal((await routes.lead(request({ ...valid.lead, country: '', dates: '', email: '', adults, children: [0, '17'], stars: [] }))).status, 200);
  }
});

test('review and subscribe reject wrong types and provide Kazakh validation errors', async () => {
  for (const [kind, fields] of [['review', { name: {} }], ['review', { text: [] }], ['review', { text: 'x'.repeat(2501) }], ['subscribe', { email: {} }], ['subscribe', { email: 'bad' }]]) {
    const res = await routes[kind](request({ ...valid[kind], ...fields, locale: 'kk' }));
    assert.equal(res.status, 422);
    const body = await res.json();
    assert.match(body.error, /[әғқңөұүһі]/i);
  }
});

test('form drafts survive locale changes, expire at 30 minutes, and tolerate blocked storage', () => {
  const { readDraft, writeDraft, clearDraft } = load('src/lib/form-draft.ts');
  const memory = new Map();
  const storage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) };
  writeDraft('lead:turkey', { name: 'Synthetic', children: ['7'] }, storage, 1000);
  assert.deepEqual(readDraft('lead:turkey', storage, 1001), { name: 'Synthetic', children: ['7'] });
  assert.equal(readDraft('lead:turkey', storage, 1801000), null);
  writeDraft('lead:turkey', { name: 'Synthetic' }, storage, 2000);
  clearDraft('lead:turkey', storage);
  assert.equal(readDraft('lead:turkey', storage, 2001), null);
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  assert.doesNotThrow(() => writeDraft('x', {}, blocked));
  assert.equal(readDraft('x', blocked), null);
  assert.doesNotThrow(() => clearDraft('x', blocked));
});

test('client accepts only a confirmed successful response and keeps server field errors', async () => {
  const { submitForm } = load('src/components/forms/form-request.ts');
  global.fetch = async () => Response.json({ ok: false });
  assert.equal((await submitForm('lead', valid.lead)).ok, false);
  global.fetch = async () => Response.json({ ok: true }, { status: 502 });
  assert.equal((await submitForm('lead', valid.lead)).ok, false);
  global.fetch = async () => Response.json({ error: 'invalid', errors: { phone: 'translated server error' } }, { status: 422 });
  assert.deepEqual(await submitForm('lead', valid.lead), { ok: false, status: 422, errors: { phone: 'phone' } });
  global.fetch = async () => Response.json({ ok: true });
  assert.equal((await submitForm('lead', valid.lead)).ok, true);
});

test('quick forms expose only contacts and comment; detailed fields are optional and IDs unique', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { LocaleProvider } = load('src/components/LocaleProvider.tsx');
  const { LeadForm } = load('src/components/forms/LeadForm.tsx');
  const quick = renderToStaticMarkup(React.createElement(LocaleProvider, { locale: 'kk' }, React.createElement(LeadForm, { mode: 'quick' })));
  assert.match(quick, /Телефон нөмірі/);
  assert.doesNotMatch(quick, /name="(?:country|adults|dates|budget)"/);
  const detailed = renderToStaticMarkup(React.createElement(LocaleProvider, { locale: 'ru' }, React.createElement(React.Fragment, null, React.createElement(LeadForm), React.createElement(LeadForm))));
  for (const name of ['departureCity', 'country', 'dates', 'budget', 'adults', 'email']) {
    const input = detailed.match(new RegExp(`<input[^>]*name="${name}"[^>]*>`));
    assert.ok(input, name);
    assert.doesNotMatch(input[0], /\brequired(?:=|\s|>)/);
  }
  const ids = [...detailed.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
});
