import { articles, sections } from "./content.js";

export const sectionMap = Object.fromEntries(sections.map((section) => [section.id, section]));
export const sortedArticles = [...articles].sort((a, b) => a.priority - b.priority);

export function getSectionById(id) {
  return sectionMap[id] || sectionMap.local;
}

export function getArticleById(id) {
  return sortedArticles.find((article) => article.id === id) || sortedArticles[0];
}

export function articlesForSection(sectionId) {
  return sortedArticles.filter((article) => article.section === sectionId);
}

export function sectionLabel(id) {
  return sectionMap[id]?.label || "Local";
}

export function relatedArticlesFor(article, limit = 5) {
  const related = sortedArticles.filter(
    (item) =>
      item.id !== article.id &&
      (item.section === article.section || item.tags.some((tag) => article.tags.includes(tag))),
  );
  return (related.length ? related : sortedArticles.filter((item) => item.id !== article.id)).slice(0, limit);
}
