import { articles, sections } from "./content.js";

export const sectionMap = Object.fromEntries(sections.map((section) => [section.id, section]));
export function sortArticles(items = articles) {
  return [...items].sort((a, b) => a.priority - b.priority);
}

export const sortedArticles = sortArticles();

export function getSectionById(id) {
  return sectionMap[id] || sectionMap.local;
}

export function getArticleById(id, items = sortedArticles) {
  const sorted = sortArticles(items);
  return sorted.find((article) => article.id === id) || sorted[0];
}

export function articlesForSection(sectionId, items = sortedArticles) {
  return sortArticles(items).filter((article) => article.section === sectionId);
}

export function sectionLabel(id) {
  return sectionMap[id]?.label || "Local";
}

export function relatedArticlesFor(article, limit = 5, items = sortedArticles) {
  const sorted = sortArticles(items);
  const related = sorted.filter(
    (item) =>
      item.id !== article.id &&
      (item.section === article.section || item.tags.some((tag) => article.tags.includes(tag))),
  );
  return (related.length ? related : sorted.filter((item) => item.id !== article.id)).slice(0, limit);
}
