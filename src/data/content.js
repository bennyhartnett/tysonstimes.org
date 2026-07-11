import mockData from "./mock-data.json" with { type: "json" };
import articleIndex from "../generated/article-index.json" with { type: "json" };

export const { site, sections, events } = mockData.content;
export const articles = articleIndex;
