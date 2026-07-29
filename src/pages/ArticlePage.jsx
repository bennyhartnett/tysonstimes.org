import { useEffect, useState } from "react";
import { EmptyArticles, HeadlineList, Tags } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { ImagePlate } from "../components/Media.jsx";
import { contentUrl } from "../data/content.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { getArticleById, relatedArticlesFor, sectionLabel } from "../data/selectors.js";
import { pagePath, sectionPath } from "../routing.js";
import { formatDate } from "../utils/format.js";

function articleDataUrl(id) {
  return contentUrl(`articles/${encodeURIComponent(id)}.json`);
}

export function ArticlePage({ route }) {
  const articles = useArticles();
  const article = route.article || getArticleById(route.articleId, articles);
  const related = article ? relatedArticlesFor(article, 5, articles) : [];
  const [fullArticle, setFullArticle] = useState(null);
  const [loadError, setLoadError] = useState(false);

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

  return (
    <article className="article-page">
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
            <strong>{article.author}</strong>
            {article.updated !== article.date ? <small>Updated {formatDate(article.updated)}</small> : null}
          </div>
          {fullArticle ? (
            <div className="article-body article-prose" dangerouslySetInnerHTML={{ __html: fullArticle.bodyHtml }} />
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
          <span className="article-file">{article.wordCount.toLocaleString()} words · {article.type.replaceAll("-", " ")} · {article.location}</span>
          <h2 id="related-coverage-title">Related coverage</h2>
          <HeadlineList articles={related} />
          <HoverLink className="article-archive-link" href={pagePath("archive")}>Search the archive</HoverLink>
        </aside>
      </div>
    </article>
  );
}
