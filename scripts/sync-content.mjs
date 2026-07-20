import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceConfig = JSON.parse(await readFile(path.join(rootDir, "src", "data", "content-source.json"), "utf8"));
const contentBaseUrl = String(process.env.CONTENT_BASE_URL || sourceConfig.baseUrl).replace(/\/+$/, "");
const generatedIndexPath = path.join(rootDir, "src", "generated", "article-index.json");
const cachePath = path.join(rootDir, ".cache", "content", "articles-full.json");

async function fetchJson(relativePath) {
  const url = `${contentBaseUrl}/${relativePath.replace(/^\/+/, "")}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Content request failed with ${response.status}: ${url}`);
  return response.json();
}

async function writeJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const articles = await fetchJson("index.json");
if (!Array.isArray(articles) || !articles.length) throw new Error("The content feed did not return any articles.");

const fullArticles = await Promise.all(
  articles.map(async (article) => {
    if (!article?.id || !article?.title || !article?.hero) throw new Error("The content feed contains an invalid article summary.");
    const fullArticle = await fetchJson(`articles/${encodeURIComponent(article.id)}.json`);
    if (fullArticle.id !== article.id || !fullArticle.bodyHtml) throw new Error(`The full article '${article.id}' is invalid.`);
    return fullArticle;
  }),
);

await writeJson(generatedIndexPath, articles);
await writeJson(cachePath, fullArticles);
console.log(`Synced ${articles.length} articles from ${sourceConfig.repository}.`);
