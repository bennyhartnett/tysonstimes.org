import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceConfig = JSON.parse(await readFile(path.join(rootDir, "src", "data", "content-source.json"), "utf8"));
const contentBaseUrl = String(process.env.CONTENT_BASE_URL || sourceConfig.baseUrl).replace(/\/+$/, "");
const generatedIndexPath = path.join(rootDir, "src", "generated", "article-index.json");
const initialIndexPath = path.join(rootDir, "src", "generated", "initial-article-index.json");
const cachePath = path.join(rootDir, ".cache", "content", "articles-full.json");
const fetchConcurrency = Math.max(1, Number.parseInt(process.env.CONTENT_FETCH_CONCURRENCY || "8", 10));

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchJson(relativePath, attempt = 1) {
  const url = `${contentBaseUrl}/${relativePath.replace(/^\/+/, "")}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    const retryable = response.status === 429 || response.status >= 500;
    await response.body?.cancel();
    if (retryable && attempt < 5) {
      const retryAfter = Number.parseInt(response.headers.get("retry-after") || "", 10);
      const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : 500 * (2 ** (attempt - 1));
      await wait(delay);
      return fetchJson(relativePath, attempt + 1);
    }
    throw new Error(`Content request failed with ${response.status}: ${url}`);
  }
  return response.json();
}

async function mapWithConcurrency(items, concurrency, callback) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function writeJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function initialArticleIndex(articles) {
  const selectedIds = new Set(articles.slice(0, 24).map((article) => article.id));
  const sections = [...new Set(articles.map((article) => article.section).filter(Boolean))];

  for (const section of sections) {
    articles
      .filter((article) => article.section === section)
      .slice(0, 8)
      .forEach((article) => selectedIds.add(article.id));
  }

  return articles.filter((article) => selectedIds.has(article.id));
}

const articles = await fetchJson("index.json");
if (!Array.isArray(articles) || !articles.length) throw new Error("The content feed did not return any articles.");

const fullArticles = await mapWithConcurrency(
  articles,
  fetchConcurrency,
  async (article) => {
    if (!article?.id || !article?.title || !article?.hero) throw new Error("The content feed contains an invalid article summary.");
    const fullArticle = await fetchJson(`articles/${encodeURIComponent(article.id)}.json`);
    if (fullArticle.id !== article.id || !fullArticle.bodyHtml) throw new Error(`The full article '${article.id}' is invalid.`);
    return fullArticle;
  },
);

await writeJson(generatedIndexPath, articles);
await writeJson(initialIndexPath, initialArticleIndex(articles));
await writeJson(cachePath, fullArticles);
console.log(`Synced ${articles.length} articles from ${sourceConfig.repository}.`);
