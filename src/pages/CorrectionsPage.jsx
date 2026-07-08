import { HoverLink } from "../components/HoverLink.jsx";
import { sortedArticles } from "../data/selectors.js";
import { articlePath } from "../routing.js";
import { formatDate } from "../utils/format.js";

export function CorrectionsPage() {
  const corrections = [
    ["2026-07-07", "tysons-next-chapter", "Template entry showing where a corrected location, date, quote attribution, or context note would appear.", "Updated"],
    ["2026-07-06", "route-7-main-thread", "Clarification module for distinguishing agency plans from final approved work.", "Clarified"],
    ["2026-07-05", "tysons-growth-watch", "Follow-up note space for revised figures, changed project timing, or additional document links.", "Appended"],
    ["2026-07-04", "public-meeting-memory", "Correction log item tied to a civic story so the archive keeps the change visible.", "Logged"],
  ];
  const standards = [
    ["Corrections", "Material errors are corrected in the story and listed on this page with date and context."],
    ["Clarifications", "Ambiguous language can be clarified without hiding the original reporting path."],
    ["Updates", "Developing stories keep major updates timestamped so readers can follow what changed."],
    ["Reader Contact", "Correction requests should include the article, claim, source, and preferred contact path."],
  ];

  return (
    <section className="section corrections-layout">
      <div>
        <h2 className="page-title">Corrections</h2>
        <p className="deck">A standards-and-corrections template that keeps the public record visible and connects updates to original coverage.</p>
        <div className="correction-log">
          {corrections.map(([date, articleId, text, status]) => {
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
            {standards.map(([title, text]) => (
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
            <button className="button" type="button">
              Send Request
            </button>
          </div>
        </form>
      </aside>
    </section>
  );
}
