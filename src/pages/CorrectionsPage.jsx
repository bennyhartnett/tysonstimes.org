import { EmptyArticles } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { correctionsPage } from "../data/pages.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { sortArticles } from "../data/selectors.js";
import { articlePath, pagePath } from "../routing.js";
import { formatDate } from "../utils/format.js";

export function CorrectionsPage() {
  const sortedArticles = sortArticles(useArticles());
  const corrections = correctionsPage.items.flatMap((correction) => {
    const article = sortedArticles.find((item) => item.id === correction.articleId);
    return article ? [{ ...correction, article }] : [];
  });

  return (
    <section className="section corrections-layout">
      <div>
        <h1 className="page-title">Corrections</h1>
        <p className="deck">Substantive corrections and clarifications are recorded here and linked to the original coverage.</p>
        <div className="correction-log">
          {corrections.map(({ date, articleId, text, status, article }) => (
            <article className="correction-item" key={`${date}-${articleId}`}>
              <div className="correction-date">{formatDate(date)}<span>{status}</span></div>
              <div>
                <h3><HoverLink href={articlePath(article.id)}>{article.title}</HoverLink></h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
          {!corrections.length ? <EmptyArticles>No substantive corrections have been published as of this edition.</EmptyArticles> : null}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Editorial Standards</h3>
          <ol>
            {correctionsPage.standards.map(({ title, text }) => (
              <li key={title}><strong>{title}</strong><br />{text}</li>
            ))}
          </ol>
        </div>
        <HoverLink className="button" href={pagePath("archive")}>Search Published Coverage</HoverLink>
        <HoverLink className="button" href={pagePath("contact")}>Request a Correction</HoverLink>
      </aside>
    </section>
  );
}
