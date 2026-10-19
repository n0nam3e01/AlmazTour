const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./load-ts.cjs');
const { reviews, homeReviewStories } = load('src/data/reviews.ts');

test('homepage excerpts belong to the original review and retain its author and full text', () => {
  assert.ok(Array.isArray(homeReviewStories) && homeReviewStories.length > 0);
  for (const story of homeReviewStories) {
    const original = reviews.find(review => review.name === story.review.name);
    assert.ok(original, `Unknown author: ${story.review.name}`);
    assert.strictEqual(story.review, original);
    assert.ok(original.text.includes(story.excerpt), `Quote does not belong to ${original.name}`);
    assert.ok(story.excerpt.length < original.text.length, 'The preview should leave full text to read');
  }
});
