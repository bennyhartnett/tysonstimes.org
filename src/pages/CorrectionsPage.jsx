import { HoverButton, HoverLink } from "../components/HoverLink.jsx";
import { correctionsPage } from "../data/pages.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { sortArticles } from "../data/selectors.js";
import { articlePath } from "../routing.js";
import { formatDate } from "../utils/format.js";

export function CorrectionsPage() {
  const sortedArticles = sortArticles(useArticles());
  return (
    <section className="section corrections-layout">
      <div>
        <h2 className="page-title">Corrections</h2>
        <p className="deck">A standards-and-corrections template that keeps the public record visible and connects updates to original coverage.</p>
        <div className="correction-log">
          {correctionsPage.items.map(({ date, articleId, text, status }) => {
            const article = sortedArticles.find((item) => item.id === articleId) || sortedArticles[0];
            return (
              <article className="correction-item" key={`${date}-${articleId}`}>
                <div className="correction-date">
                  {formatDate(date)}
                  <span>{status}</span>
                </div>
                <div>
                  <h3>
                    <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
                  </h3>
                  <p>{text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Standards</h3>
          <ol>
            {correctionsPage.standards.map(({ title, text }) => (
              <li key={title}>
                <strong>{title}</strong>
                <br />
                {text}
              </li>
            ))}
          </ol>
        </div>
        <form className="search-panel">
          <h3>Request Review</h3>
          <div className="form-grid">
            <input className="subscribe-input" type="text" placeholder="Article headline or URL" />
            <textarea className="subscribe-textarea" placeholder="What should be reviewed? Include source material when possible." />
            <HoverButton className="button" type="button">
              Send Request
            </HoverButton>
          </div>
        </form>
      </aside>
    </section>
  );
}
