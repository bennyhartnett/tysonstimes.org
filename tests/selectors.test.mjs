import test from "node:test";
import assert from "node:assert/strict";
import { claimArticles, sortArticles } from "../src/data/selectors.js";

const article = (id, priority) => ({ id, priority });

test("sortArticles removes duplicate article IDs after sorting", () => {
  const sorted = sortArticles([
    article("second", 2),
    article("first", 1),
    article("first", 3),
  ]);

  assert.deepEqual(sorted.map(({ id }) => id), ["first", "second"]);
});

test("claimArticles never reuses an article across page groups", () => {
  const claimedIds = new Set();
  const articles = [article("first", 1), article("second", 2), article("third", 3)];

  assert.deepEqual(claimArticles(articles, claimedIds, 2).map(({ id }) => id), ["first", "second"]);
  assert.deepEqual(claimArticles(articles, claimedIds, 2).map(({ id }) => id), ["third"]);
});
