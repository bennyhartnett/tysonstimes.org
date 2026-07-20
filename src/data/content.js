import mockData from "./mock-data.json" with { type: "json" };
import articleIndex from "../generated/article-index.json" with { type: "json" };
import contentSource from "./content-source.json" with { type: "json" };

export const { site, sections, events } = mockData.content;
export const articles = articleIndex;
export const contentRepository = contentSource.repository;
export const contentBaseUrl = String(import.meta.env?.VITE_CONTENT_BASE_URL || contentSource.baseUrl).replace(/\/+$/, "");

export function contentUrl(path = "") {
  return `${contentBaseUrl}/${String(path).replace(/^\/+/, "")}`;
}
