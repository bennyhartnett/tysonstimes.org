import { articles, sections } from "./content.js";

export const sectionMap = Object.fromEntries(sections.map((section) => [section.id, section]));

export function uniqueArticles(items = articles) {
  const seenIds = new Set();

  return items.filter((article) => {
    if (seenIds.has(article.id)) return false;
    seenIds.add(article.id);
    return true;
  });
}

export function sortArticles(items = articles) {
  return uniqueArticles([...items].sort((a, b) => a.priority - b.priority));
}

export function claimArticles(items, claimedIds, limit) {
  const selected = [];

  for (const article of uniqueArticles(items)) {
    if (selected.length >= limit) break;
    if (claimedIds.has(article.id)) continue;
    claimedIds.add(article.id);
    selected.push(article);
  }

  return selected;
}

export const sortedArticles = sortArticles();

export function getSectionById(id) {
  return sectionMap[id] || sectionMap.local;
}

export function getArticleById(id, items = sortedArticles) {
  const sorted = sortArticles(items);
  return sorted.find((article) => article.id === id) || null;
}

export function articlesForSection(sectionId, items = sortedArticles) {
  return sortArticles(items).filter((article) => article.section === sectionId);
}

export function sectionLabel(id) {
  return sectionMap[id]?.label || "Local";
}

export function relatedArticlesFor(article, limit = 5, items = sortedArticles) {
  if (!article) return [];

  const sorted = sortArticles(items);
  const related = sorted.filter(
    (item) =>
      item.id !== article.id &&
      (item.section === article.section || item.tags.some((tag) => article.tags.includes(tag))),
  );
  return (related.length ? related : sorted.filter((item) => item.id !== article.id)).slice(0, limit);
}
