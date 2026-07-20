import { articles, sections, site } from "./data/content.js";
import { pageDescriptions, pageSlugs, pageTitles } from "./data/pages.js";
import { getArticleById, getSectionById, relatedArticlesFor, sectionLabel, sortArticles } from "./data/selectors.js";

export const siteOrigin = site.url || `https://${site.domain}`;
export { pageDescriptions, pageSlugs };

export const indexedPages = Object.keys(pageSlugs).filter((page) => page !== "home");

function cleanSegment(value) {
  return encodeURIComponent(value).replace(/%2F/gi, "-");
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin}${normalized}`;
}

export function pageCleanPath(page = "home") {
  const slug = pageSlugs[page] ?? page;
  return slug ? `/${slug}/` : "/";
}

export function articleCleanPath(id) {
  return `/articles/${cleanSegment(id)}/`;
}

export function sectionCleanPath(id) {
  return `/sections/${cleanSegment(id)}/`;
}

export function routeCleanPath(route, availableArticles = articles) {
  if (route?.page === "article") {
    const article = route.article || getArticleById(route.articleId, availableArticles);
    return articleCleanPath(article.id);
  }

  if (route?.page === "section") {
    const section = route.section || getSectionById(route.sectionId);
    return sectionCleanPath(section.id);
  }

  return pageCleanPath(route?.page || "home");
}

function compactList(values) {
  return values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean);
}

function keywordString(values) {
  return [...new Set(compactList(values))].join(", ");
}

function placeSchema(name) {
  return {
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: name.split(",")[0],
      addressRegion: "VA",
      addressCountry: "US",
    },
  };
}

function localPlaceSchema() {
  return {
    "@type": "Place",
    name: site.location,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tysons",
      addressRegion: "VA",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.latitude,
      longitude: site.longitude,
    },
  };
}

function publisherSchema() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": `${siteOrigin}/#organization`,
    name: site.name,
    url: siteOrigin,
    description: site.description,
    foundingLocation: localPlaceSchema(),
    areaServed: site.coverageArea.map(placeSchema),
    publishingPrinciples: absoluteUrl(pageCleanPath("corrections")),
    knowsAbout: site.topics,
  };
}

function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteOrigin}/#website`,
    name: site.name,
    url: siteOrigin,
    description: site.description,
    inLanguage: "en-US",
    publisher: {
      "@id": `${siteOrigin}/#organization`,
    },
  };
}

function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function itemListSchema(items) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

function pageSchema(meta, itemList) {
  return {
    "@type": "CollectionPage",
    "@id": `${meta.canonicalUrl}#webpage`,
    url: meta.canonicalUrl,
    name: meta.title,
    description: meta.description,
    isPartOf: {
      "@id": `${siteOrigin}/#website`,
    },
    about: site.topics.map((name) => ({ "@type": "Thing", name })),
    spatialCoverage: localPlaceSchema(),
    publisher: {
      "@id": `${siteOrigin}/#organization`,
    },
    ...(itemList ? { mainEntity: itemList } : {}),
  };
}

function articleSchema(article, meta) {
  return {
    "@type": "NewsArticle",
    "@id": `${meta.canonicalUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": meta.canonicalUrl,
    },
    headline: article.title,
    description: article.dek,
    articleBody: article.body.join("\n\n"),
    datePublished: article.date,
    dateModified: article.updated || article.date,
    image: article.hero ? [absoluteUrl(article.hero.src)] : undefined,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@id": `${siteOrigin}/#organization`,
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    articleSection: sectionLabel(article.section),
    keywords: article.tags.join(", "),
    about: article.tags.map((name) => ({ "@type": "Thing", name })),
    spatialCoverage: {
      "@type": "Place",
      name: article.location,
    },
  };
}

function buildStructuredData(route, meta, availableArticles = articles) {
  const graph = [publisherSchema(), websiteSchema()];
  const currentArticles = sortArticles(availableArticles);

  if (route?.page === "article") {
    const article = route.article || getArticleById(route.articleId, currentArticles);
    const section = getSectionById(article.section);
    graph.push(
      articleSchema(article, meta),
      breadcrumbSchema([
        { name: site.name, url: absoluteUrl("/") },
        { name: section.label, url: absoluteUrl(sectionCleanPath(section.id)) },
        { name: article.title, url: meta.canonicalUrl },
      ]),
    );
  } else if (route?.page === "section") {
    const section = route.section || getSectionById(route.sectionId);
    const sectionArticles = currentArticles.filter((article) => article.section === section.id);
    graph.push(
      pageSchema(
        meta,
        itemListSchema(sectionArticles.map((article) => ({ name: article.title, url: absoluteUrl(articleCleanPath(article.id)) }))),
      ),
      breadcrumbSchema([
        { name: site.name, url: absoluteUrl("/") },
        { name: section.label, url: meta.canonicalUrl },
      ]),
    );
  } else {
    graph.push(
      pageSchema(
        meta,
        route?.page === "home"
          ? itemListSchema(currentArticles.slice(0, 10).map((article) => ({ name: article.title, url: absoluteUrl(articleCleanPath(article.id)) })))
          : undefined,
      ),
      breadcrumbSchema([
        { name: site.name, url: absoluteUrl("/") },
        ...(route?.page && route.page !== "home" ? [{ name: pageTitles[route.page] || "Page", url: meta.canonicalUrl }] : []),
      ]),
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildRouteMeta(route = { page: "home" }, availableArticles = articles) {
  const currentArticles = sortArticles(availableArticles);

  if (route.page === "article") {
    const article = route.article || getArticleById(route.articleId, currentArticles);
    const related = relatedArticlesFor(article, 3, currentArticles);
    const canonicalUrl = absoluteUrl(articleCleanPath(article.id));

    return {
      title: `${article.title} | ${site.name}`,
      description: article.dek,
      canonicalUrl,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updated || article.date,
      section: sectionLabel(article.section),
      keywords: keywordString([article.title, article.dek, article.location, sectionLabel(article.section), ...article.tags, ...site.coverageArea]),
      relatedUrls: related.map((item) => absoluteUrl(articleCleanPath(item.id))),
      imageUrl: article.hero ? absoluteUrl(article.hero.src) : undefined,
      imageAlt: article.hero?.alt,
      structuredData: buildStructuredData({ ...route, article }, { canonicalUrl }, currentArticles),
    };
  }

  if (route.page === "section") {
    const section = route.section || getSectionById(route.sectionId);
    const canonicalUrl = absoluteUrl(sectionCleanPath(section.id));
    const title = `${section.label} News | ${site.name}`;

    return {
      title,
      description: section.description,
      canonicalUrl,
      type: "website",
      keywords: keywordString([section.label, section.description, ...site.coverageArea, ...site.topics]),
      structuredData: buildStructuredData({ ...route, section }, { title, description: section.description, canonicalUrl }, currentArticles),
    };
  }

  const page = route.page || "home";
  const isHome = page === "home";
  const canonicalUrl = absoluteUrl(pageCleanPath(page));
  const title = isHome ? `${site.name} | Local News for Tysons, Virginia` : `${pageTitles[page] || "Page"} | ${site.name}`;
  const description = pageDescriptions[page] || site.description;

  return {
    title,
    description,
    canonicalUrl,
    type: "website",
    keywords: keywordString([pageTitles[page], description, ...site.coverageArea, ...site.topics]),
    structuredData: buildStructuredData({ page }, { title, description, canonicalUrl }, currentArticles),
  };
}

function setMetaAttribute(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setLink(rel, href, attributes = {}) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

export function applyDocumentMetadata(meta) {
  document.title = meta.title;

  setMetaAttribute("name", "description", meta.description);
  setMetaAttribute("name", "keywords", meta.keywords);
  setMetaAttribute("name", "robots", "index, follow, max-image-preview:large");
  setMetaAttribute("name", "geo.region", site.region);
  setMetaAttribute("name", "geo.placename", site.location);
  setMetaAttribute("name", "geo.position", `${site.latitude};${site.longitude}`);
  setMetaAttribute("name", "ICBM", `${site.latitude}, ${site.longitude}`);
  setMetaAttribute("name", "twitter:card", meta.imageUrl ? "summary_large_image" : "summary");
  setMetaAttribute("name", "twitter:title", meta.title);
  setMetaAttribute("name", "twitter:description", meta.description);
  setMetaAttribute("name", "twitter:image", meta.imageUrl);
  setMetaAttribute("name", "twitter:image:alt", meta.imageAlt);

  setMetaAttribute("property", "og:site_name", site.name);
  setMetaAttribute("property", "og:locale", "en_US");
  setMetaAttribute("property", "og:type", meta.type);
  setMetaAttribute("property", "og:title", meta.title);
  setMetaAttribute("property", "og:description", meta.description);
  setMetaAttribute("property", "og:url", meta.canonicalUrl);
  setMetaAttribute("property", "og:image", meta.imageUrl);
  setMetaAttribute("property", "og:image:alt", meta.imageAlt);
  setMetaAttribute("property", "article:published_time", meta.publishedTime);
  setMetaAttribute("property", "article:modified_time", meta.modifiedTime);
  setMetaAttribute("property", "article:section", meta.section);

  setLink("canonical", meta.canonicalUrl);

  let structuredData = document.getElementById("structured-data");
  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.id = "structured-data";
    structuredData.type = "application/ld+json";
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify(meta.structuredData);
}
