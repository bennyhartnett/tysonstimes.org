import publicationData from "./publication-data.json" with { type: "json" };
import initialArticleIndex from "../generated/initial-article-index.json" with { type: "json" };
import contentSource from "./content-source.json" with { type: "json" };

export const { site, sections } = publicationData.content;
export const articles = initialArticleIndex;
export const contentRepository = contentSource.repository;
export const contentBaseUrl = String(import.meta.env?.VITE_CONTENT_BASE_URL || contentSource.baseUrl).replace(/\/+$/, "");

export function contentUrl(path = "") {
  return `${contentBaseUrl}/${String(path).replace(/^\/+/, "")}`;
}
