import { useEffect, useMemo, useState } from "react";
import { getArticleById, getSectionById } from "./data/selectors.js";

const aliases = {
  "": "home",
  "/": "home",
  home: "home",
  index: "home",
  "index.html": "home",
  "photo-essay": "photo",
  "photo-essay.html": "photo",
  "live.html": "live",
  "archive.html": "archive",
  "events.html": "events",
  "briefs.html": "briefs",
  "guide.html": "guide",
  "newsletter.html": "newsletter",
  "investigations.html": "investigations",
  "election.html": "election",
  "dining.html": "dining",
  "obituaries.html": "obituaries",
  "classifieds.html": "classifieds",
  "corrections.html": "corrections",
  "about.html": "about",
};

export function pagePath(page = "home") {
  return page === "home" ? "#/" : `#/${page}`;
}

export function articlePath(id) {
  return `#/article/${encodeURIComponent(id)}`;
}

export function sectionPath(id) {
  return `#/section/${encodeURIComponent(id)}`;
}

function parseHash(hash, articles) {
  const raw = (hash || "#/").replace(/^#\/?/, "");
  const [pathPart] = raw.split("?");
  const segments = pathPart.split("/").filter(Boolean).map(decodeURIComponent);
  const first = segments[0] || "home";

  if (first === "article") {
    const article = getArticleById(segments[1], articles);
    return {
      page: "article",
      article,
      articleId: segments[1],
      key: `article:${article?.id || segments[1] || "missing"}`,
    };
  }

  if (first === "section") {
    const section = getSectionById(segments[1]);
    return {
      page: "section",
      section,
      sectionId: segments[1],
      key: `section:${section?.id || segments[1] || "local"}`,
    };
  }

  const page = aliases[first] || first;
  return {
    page,
    key: page,
  };
}

export function useHashRoute(articles) {
  const [hash, setHash] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return useMemo(() => parseHash(hash, articles), [hash, articles]);
}
