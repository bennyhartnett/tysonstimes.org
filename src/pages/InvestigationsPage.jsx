import { HeadlineList } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { investigationsPage } from "../data/pages.js";
import { sortedArticles, sectionLabel } from "../data/selectors.js";
import { articlePath, pagePath } from "../routing.js";
import { formatDate } from "../utils/format.js";

export function InvestigationsPage() {
  const lead = sortedArticles.find((article) => article.id === investigationsPage.leadArticleId) || sortedArticles[0];
  const related = sortedArticles
    .filter((article) => investigationsPage.relatedSections.includes(article.section))
    .slice(0, investigationsPage.relatedLimit);

  return (
    <section className="section investigations-layout">
      <div>
        <h2 className="page-title">Investigations</h2>
        <p className="deck">A case-file template for accountability reporting, public records, timelines, source notes, and unanswered reader questions.</p>
        <article className="case-board">
          <div className="eyebrow">
            {sectionLabel(lead.section)} / Case File / {formatDate(lead.date)}
          </div>
          <h3>
            <HoverLink href={articlePath(lead.id)}>{lead.title}</HoverLink>
          </h3>
          <p>{lead.dek}</p>
          <div className="case-strip">
            {investigationsPage.caseStats.map((stat) => (
              <span key={stat.label}>
                {stat.label}: {stat.value}
              </span>
            ))}
          </div>
        </article>
        <div className="document-grid">
          {investigationsPage.documentRows.map(({ title, text }) => (
            <article className="document-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="timeline-list">
          {investigationsPage.timeline.map(({ date, text }) => (
            <article className="timeline-item" key={`${date}-${text}`}>
              <strong>{date}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Related Files</h3>
          <HeadlineList articles={related} />
        </div>
        <div className="ad-box source-list">
          <h3>Source Log</h3>
          <ol>
            {investigationsPage.sourceLog.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ol>
        </div>
        <HoverLink className="button" href={pagePath("archive")}>
          Search Archive
        </HoverLink>
      </aside>
    </section>
  );
}
