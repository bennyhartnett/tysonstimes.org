import { useEffect, useState } from "react";
import { HeadlineList, Tags } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { ImagePlate } from "../components/Media.jsx";
import { getArticleById, relatedArticlesFor, sectionLabel } from "../data/selectors.js";
import { pagePath } from "../routing.js";
import { formatDate } from "../utils/format.js";

function articleDataUrl(id) {
  return `${import.meta.env.BASE_URL}content/articles/${encodeURIComponent(id)}.json`;
}

export function ArticlePage({ route }) {
  const article = route.article || getArticleById(route.articleId);
  const related = relatedArticlesFor(article);
  const [fullArticle, setFullArticle] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
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
  }, [article.id]);

  return (
    <section className="section article-layout">
      <article>
        <div className="eyebrow">
          {sectionLabel(article.section)} / {article.type.replaceAll("-", " ")} / {article.location} / {formatDate(article.date)}
        </div>
        <h2 className="article-headline">{article.title}</h2>
        <p className="deck">{article.dek}</p>
        <div className="byline">
          By {article.author}
          {article.updated !== article.date ? ` / Updated ${formatDate(article.updated)}` : ""}
        </div>
        <div className="article-hero">
          <ImagePlate article={article} priority />
        </div>
        {fullArticle ? (
          <div className="article-body article-prose" dangerouslySetInnerHTML={{ __html: fullArticle.bodyHtml }} />
        ) : loadError ? (
          <div className="article-body article-prose">
            {article.body.map((paragraph, index) => (
              <p className={index === 0 ? "dropcap" : undefined} key={paragraph}>
                {paragraph}
              </p>
            ))}
            <p className="article-load-note">The complete article could not be loaded. Please refresh the page.</p>
          </div>
        ) : (
          <p className="article-load-note" role="status">Loading complete article…</p>
        )}
        <Tags article={article} />
      </article>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Article File</h3>
          <p>{article.wordCount.toLocaleString()} words / {article.type.replaceAll("-", " ")}</p>
        </div>
        <div className="index-box">
          <h3>Related Coverage</h3>
          <HeadlineList articles={related} />
        </div>
        <HoverLink className="button" href={pagePath("archive")}>Search Archive</HoverLink>
      </aside>
    </section>
  );
}
