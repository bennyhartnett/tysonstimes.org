import test from "node:test";
import assert from "node:assert/strict";
import { isSafeArticleUrl, validateArticleHtml } from "../scripts/content-safety.mjs";

test("accepts the limited article markup and ordinary links", () => {
  assert.equal(validateArticleHtml('<h2>Update</h2><p><strong>Verified.</strong> <a href="https://example.com/source">Source</a></p>'), true);
  assert.equal(validateArticleHtml('<table><thead><tr><th>School</th><th style="text-align:right">Score</th></tr></thead><tbody><tr><td>Fairfax</td><td style="text-align:right">1189</td></tr></tbody></table>'), true);
  assert.equal(isSafeArticleUrl("/records/agenda.pdf"), true);
  assert.equal(isSafeArticleUrl("mailto:newsroom@example.com"), true);
});

test("rejects executable tags, attributes, and URLs", () => {
  assert.throws(() => validateArticleHtml("<script>alert(1)</script>", "bad-script"), /unsupported HTML tags/);
  assert.throws(() => validateArticleHtml('<p onclick="alert(1)">Text</p>', "bad-attribute"), /unsafe HTML attributes/);
  assert.throws(() => validateArticleHtml('<td style="background-image:url(javascript:alert(1))">Text</td>', "bad-style"), /unsafe HTML attributes/);
  assert.throws(() => validateArticleHtml('<a href="javascript:alert(1)">Text</a>', "bad-url"), /unsafe link URL/);
});
