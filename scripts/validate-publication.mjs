import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readText = (relative) => readFile(path.join(root, relative), "utf8");
const readJson = async (relative) => JSON.parse(await readText(relative));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const [publication, fullIndex, initialIndex, feed, sitemap, llms] = await Promise.all([
  readJson("src/data/publication-data.json"),
  readJson("src/generated/article-index.json"),
  readJson("src/generated/initial-article-index.json"),
  readText("public/feed.xml"),
  readText("public/sitemap.xml"),
  readText("public/llms.txt"),
]);

const { site, sections } = publication.content;
assert(site.publisher?.name && site.publisher?.publicContactUrl, "Publisher identity and public contact are required.");
assert(new Set(fullIndex.map(({ id }) => id)).size === fullIndex.length, "Article IDs must be unique.");
assert(fullIndex.every((article) => article.id && article.title && article.dek && article.date && article.author && article.hero), "Every article needs complete index metadata.");
assert(fullIndex.every((article) => sections.some((section) => section.id === article.section)), "Every article must use a known section.");
assert(initialIndex.length <= 80, `Initial article snapshot is too large (${initialIndex.length}).`);
assert(sections.every((section) => initialIndex.some((article) => article.section === section.id)), "Initial snapshot must represent every section.");

const feedItems = (feed.match(/<item>/g) || []).length;
assert(feedItems > 0 && feedItems <= 100, `RSS should contain 1–100 items; found ${feedItems}.`);
assert((sitemap.match(/<url>/g) || []).length >= fullIndex.length, "Sitemap must include the complete article archive.");
assert(Buffer.byteLength(llms) < 150_000, "llms.txt must stay compact.");

for (const page of ["about", "contact", "corrections", "privacy", "standards"]) {
  await access(path.join(root, "public", page, "index.html"));
}

try {
  await access(path.join(root, "public", "llms-full.txt"));
  throw new Error("Retired llms-full.txt must not be generated.");
} catch (error) {
  if (error.message === "Retired llms-full.txt must not be generated.") throw error;
}

const ogImage = await readFile(path.join(root, "public", "og-corner.png"));
assert(ogImage.subarray(1, 4).toString() === "PNG", "Social card must be a PNG.");
const width = ogImage.readUInt32BE(16);
const height = ogImage.readUInt32BE(20);
assert(width === 1200 && height === 630, `Social card must be 1200×630; found ${width}×${height}.`);

console.log(`Validated ${fullIndex.length} articles, ${feedItems} RSS items, and ${width}×${height} social artwork.`);
