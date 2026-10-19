const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./load-ts.cjs');
const catalog = load('src/data/destinations.ts');

const slugs = [
  'turkey', 'egypt', 'uae', 'thailand', 'vietnam', 'maldives', 'georgia',
  'greece', 'dominicana', 'spain', 'italy', 'china', 'sri-lanka', 'singapore', 'czech',
];
const textFields = ['name', 'nameTo', 'title', 'tagline', 'excerpt', 'note'];
const nonempty = (value, context) => {
  assert.equal(typeof value, 'string', context);
  assert.ok(value.trim().length > 0, context);
};

test('Russian export and default lookup remain compatible', () => {
  assert.equal(typeof catalog.getDestinations, 'function');
  assert.strictEqual(catalog.getDestinations('ru'), catalog.destinations);
  assert.equal(catalog.getDestination('turkey').name, 'Турция');
  assert.equal(catalog.getDestination('turkey', 'ru').nameTo, 'в Турцию');
  assert.equal(catalog.getDestination('turkey', 'kk').name, 'Түркия');
  for (const locale of ['ru', 'kk']) {
    assert.equal(catalog.getDestination('unknown', locale), undefined);
    assert.equal(catalog.getDestination('', locale), undefined);
  }
});

for (const locale of ['ru', 'kk']) {
  test(`${locale}: all 15 unique destinations keep working images and lookup`, () => {
    const items = catalog.getDestinations(locale);
    assert.deepEqual(items.map((item) => item.slug), slugs);
    assert.equal(new Set(items.map((item) => item.slug)).size, slugs.length);
    for (const item of items) {
      assert.equal(item.image, `/images/destinations/${item.slug}.jpg`);
      assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', item.image)));
      assert.strictEqual(catalog.getDestination(item.slug, locale), item);
    }
  });

  test(`${locale}: every visible content field is populated`, () => {
    for (const item of catalog.getDestinations(locale)) {
      for (const key of textFields) nonempty(item[key], `${locale}/${item.slug}/${key}`);
      for (const key of ['intro', 'facts', 'reasons']) {
        assert.ok(Array.isArray(item[key]) && item[key].length > 0, `${item.slug}/${key}`);
      }
      item.intro.forEach((text) => nonempty(text, `${item.slug}/intro`));
      item.facts.forEach(({ label, value }) => {
        nonempty(label, `${item.slug}/fact label`);
        nonempty(value, `${item.slug}/fact value`);
      });
      item.reasons.forEach(({ title, text }) => {
        nonempty(title, `${item.slug}/reason title`);
        nonempty(text, `${item.slug}/reason text`);
      });
    }
  });

  test(`${locale}: copy omits numeric sales claims and entry or flight promises`, () => {
    for (const item of catalog.getDestinations(locale)) {
      const { slug, ...copy } = item;
      delete copy.image;
      assert.doesNotMatch(JSON.stringify(copy), /\d|[₸$€]|виз[аыу]|виза|безвиз|перел[её]т|ұшу\s+уақыты|кепілдік/i, slug);
    }
  });
}

test('Kazakh content covers the entire Russian catalog without text fallback', () => {
  const ru = catalog.getDestinations('ru');
  const kk = catalog.getDestinations('kk');
  ru.forEach((item, index) => {
    const translated = kk[index];
    for (const key of textFields.filter(key => key !== 'name')) assert.notEqual(translated[key], item[key], `${item.slug}/${key}`);
    assert.equal(translated.intro.length, item.intro.length, `${item.slug}/intro`);
    assert.equal(translated.facts.length, item.facts.length, `${item.slug}/facts`);
    assert.equal(translated.reasons.length, item.reasons.length, `${item.slug}/reasons`);
    assert.match(JSON.stringify(translated), /[ӘәҒғҚқҢңӨөҰұҮүҺһІі]/u, item.slug);
    item.intro.forEach((text, i) => assert.notEqual(translated.intro[i], text));
    item.facts.forEach(({ label }, i) => assert.notEqual(translated.facts[i].label, label));
    item.reasons.forEach(({ title, text }, i) => {
      nonempty(translated.reasons[i].title, `${item.slug}/${title}`);
      assert.notEqual(translated.reasons[i].text, text);
    });
  });
});
