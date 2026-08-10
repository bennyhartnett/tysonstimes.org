import { useEffect, useMemo, useState } from "react";
import { EmptyArticles, HeadlineList, Tags } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { ImagePlate } from "../components/Media.jsx";
import { contentUrl } from "../data/content.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { getArticleById, relatedArticlesFor, sectionLabel } from "../data/selectors.js";
import { pagePath, sectionPath } from "../routing.js";
import { useSavedArticles } from "../hooks/useSavedArticles.js";
import { formatDate } from "../utils/format.js";
import { sanitizeArticleHtml } from "../utils/sanitizeArticleHtml.js";

function articleDataUrl(id) {
  return contentUrl(`articles/${encodeURIComponent(id)}.json`);
}

export function ArticlePage({ route }) {
  const articles = useArticles();
  const article = route.article || getArticleById(route.articleId, articles);
  const related = article ? relatedArticlesFor(article, 5, articles) : [];
  const [fullArticle, setFullArticle] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const { isSaved, toggleSaved } = useSavedArticles();
  const safeBodyHtml = useMemo(
    () => (fullArticle?.bodyHtml ? sanitizeArticleHtml(fullArticle.bodyHtml) : ""),
    [fullArticle?.bodyHtml],
  );

  useEffect(() => {
    if (!article) return undefined;

    const controller = new AbortController();
    setFullArticle(null);
    setLoadError(false);

    fetch(articleDataUrl(article.id), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Article request failed with ${response.status}`);
        return response.json();
      })
      .then(setFullArticle)
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(true);
      });

    return () => controller.abort();
  }, [article?.id]);

  if (!article) {
    return (
      <section className="section missing-article">
        <h1 className="page-title">Article not found</h1>
        <EmptyArticles>This article is not available. It may have been removed or the link may be outdated.</EmptyArticles>
        <HoverLink className="button" href={pagePath("archive")}>Browse published articles</HoverLink>
      </section>
    );
  }

  const articleUrl = `${window.location.origin}/articles/${encodeURIComponent(article.id)}/`;
  const readingMinutes = Math.max(1, Math.ceil(article.wordCount / 220));
  const articleIsSaved = isSaved(article.id);

  function saveArticle() {
    toggleSaved(article.id);
    setShareStatus(articleIsSaved ? "Removed from saved stories" : "Saved for later");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setShareStatus("Link copied");
    } catch {
      setShareStatus("Copy the link from your address bar");
    }
  }

  async function shareArticle() {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title: article.title, text: article.dek, url: articleUrl });
      setShareStatus("Article shared");
    } catch (error) {
      if (error.name !== "AbortError") setShareStatus("Sharing was unavailable");
    }
  }

  return (
    <article className="article-page">
      <nav className="article-breadcrumbs" aria-label="Breadcrumb">
        <HoverLink href={pagePath("home")}>Front Page</HoverLink>
        <span aria-hidden="true">/</span>
        <HoverLink href={sectionPath(article.section)}>{sectionLabel(article.section)}</HoverLink>
      </nav>
      <header className="article-topper">
        <HoverLink className="article-section-link" href={sectionPath(article.section)}>{sectionLabel(article.section)}</HoverLink>
        <h1 className="article-headline">{article.title}</h1>
        <p className="deck">{article.dek}</p>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
      </header>

      <div className="article-hero">
        <ImagePlate article={article} size="wide" priority />
      </div>

      <div className="article-reading-layout">
        <div className="article-main">
          <div className="article-byline-block">
            <span>By</span>
            <HoverLink className="article-author" href={`${pagePath("archive")}?q=${encodeURIComponent(article.author)}`}>{article.author}</HoverLink>
            {article.updated !== article.date ? <small>Updated {formatDate(article.updated)}</small> : null}
          </div>
          <div className="article-actions" aria-label="Article tools">
            <button type="button" aria-pressed={articleIsSaved} onClick={saveArticle}>
              {articleIsSaved ? "Saved" : "Save"}
            </button>
            <button type="button" onClick={shareArticle}>Share</button>
            <button type="button" onClick={copyLink}>Copy link</button>
            <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${article.dek}\n\n${articleUrl}`)}`}>Email</a>
            <button type="button" onClick={() => window.print()}>Print</button>
            <span className="article-share-status" role="status">{shareStatus}</span>
          </div>
          {fullArticle ? (
            <div className="article-body article-prose" dangerouslySetInnerHTML={{ __html: safeBodyHtml }} />
          ) : loadError ? (
            <div className="article-body article-prose">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="article-load-note">The complete article could not be loaded. Please refresh the page.</p>
            </div>
          ) : (
            <p className="article-load-note" role="status">Loading complete article…</p>
          )}
          <Tags article={article} />
        </div>
        <aside className="article-related" aria-labelledby="related-coverage-title">
          <span className="article-file">{readingMinutes} min read · {article.wordCount.toLocaleString()} words · {article.type.replaceAll("-", " ")} · {article.location}</span>
          <h2 id="related-coverage-title">Related coverage</h2>
          <HeadlineList articles={related} />
          <HoverLink className="article-archive-link" href={pagePath("archive")}>Search the archive</HoverLink>
        </aside>
      </div>
    </article>
  );
}
