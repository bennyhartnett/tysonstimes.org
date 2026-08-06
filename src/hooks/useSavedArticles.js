import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tysons-times:saved-articles";
const SAVED_ARTICLES_EVENT = "tysons-times:saved-articles";

function readSavedArticles() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === "string"))] : [];
  } catch {
    return [];
  }
}

function writeSavedArticles(articleIds) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articleIds));
  } catch {
    // Saving is a convenience feature; the site should remain usable if storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent(SAVED_ARTICLES_EVENT, { detail: articleIds }));
}

export function useSavedArticles() {
  const [savedArticleIds, setSavedArticleIds] = useState(readSavedArticles);

  useEffect(() => {
    function syncSavedArticles(event) {
      setSavedArticleIds(
        event.type === SAVED_ARTICLES_EVENT && Array.isArray(event.detail)
          ? event.detail
          : readSavedArticles(),
      );
    }

    window.addEventListener("storage", syncSavedArticles);
    window.addEventListener(SAVED_ARTICLES_EVENT, syncSavedArticles);
    return () => {
      window.removeEventListener("storage", syncSavedArticles);
      window.removeEventListener(SAVED_ARTICLES_EVENT, syncSavedArticles);
    };
  }, []);

  const isSaved = useCallback(
    (articleId) => savedArticleIds.includes(articleId),
    [savedArticleIds],
  );

  const toggleSaved = useCallback((articleId) => {
    setSavedArticleIds((current) => {
      const next = current.includes(articleId)
        ? current.filter((id) => id !== articleId)
        : [...current, articleId];
      writeSavedArticles(next);
      return next;
    });
  }, []);

  return { savedArticleIds, isSaved, toggleSaved };
}
