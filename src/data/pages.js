import publicationData from "./publication-data.json" with { type: "json" };

export const {
  pageTitles,
  pageDescriptions,
  pageSlugs,
  primaryNavLinks,
  directoryNavGroups,
  correctionsPage,
} = publicationData.pages;
