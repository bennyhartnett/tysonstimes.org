import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { articles as initialArticles, contentUrl } from "./content.js";

const ContentContext = createContext({
  articles: initialArticles,
  source: "build",
  complete: false,
  loading: false,
});

function validArticleIndex(value) {
  return Array.isArray(value) && value.length > 0 && value.every((article) => article?.id && article?.title && article?.hero);
}

export function ContentProvider({ children }) {
  const [state, setState] = useState({ articles: initialArticles, source: "build", complete: false, loading: false });

  useEffect(() => {
    let controller;
    let started = false;

    function refreshContent() {
      if (started) return;
      started = true;
      controller = new AbortController();
      setState((current) => ({ ...current, loading: true }));

      fetch(contentUrl("index.json"), { cache: "default", signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`Content request failed with ${response.status}`);
          return response.json();
        })
        .then((articles) => {
          if (!validArticleIndex(articles)) throw new Error("Content feed returned an invalid article index");
          setState({ articles, source: "live", complete: true, loading: false });
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.warn("Using the build-time article snapshot.", error);
            setState((current) => ({ ...current, loading: false }));
          }
        });
    }

    function needsCompleteIndex() {
      return /^#\/(?:archive|briefs|corrections|section|article)(?:\/|\?|$)/.test(window.location.hash);
    }

    function handleHashChange() {
      if (needsCompleteIndex()) refreshContent();
    }

    window.addEventListener("hashchange", handleHashChange);
    if (needsCompleteIndex()) {
      refreshContent();
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      controller?.abort();
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useArticles() {
  return useContext(ContentContext).articles;
}

export function useContentStatus() {
  return useContext(ContentContext);
}
