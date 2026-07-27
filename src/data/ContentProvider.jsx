import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { articles as initialArticles, contentUrl } from "./content.js";

const ContentContext = createContext({
  articles: initialArticles,
  source: "build",
});

function validArticleIndex(value) {
  return Array.isArray(value) && value.length > 0 && value.every((article) => article?.id && article?.title && article?.hero);
}

export function ContentProvider({ children }) {
  const [state, setState] = useState({ articles: initialArticles, source: "build" });

  useEffect(() => {
    const controller = new AbortController();

    fetch(contentUrl("index.json"), { cache: "no-cache", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Content request failed with ${response.status}`);
        return response.json();
      })
      .then((articles) => {
        if (!validArticleIndex(articles)) throw new Error("Content feed returned an invalid article index");
        setState({ articles, source: "live" });
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.warn("Using the build-time article snapshot.", error);
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(() => state, [state]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useArticles() {
  return useContext(ContentContext).articles;
}
