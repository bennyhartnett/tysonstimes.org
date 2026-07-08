import { HeadlineList } from "../components/ArticleBits.jsx";
import { sortedArticles, sectionLabel } from "../data/selectors.js";
import { articlePath, pagePath } from "../routing.js";
import { formatDate } from "../utils/format.js";

export function InvestigationsPage() {
  const lead = sortedArticles.find((article) => article.id === "public-meeting-memory") || sortedArticles[0];
  const related = sortedArticles.filter((article) => ["civic", "business"].includes(article.section)).slice(0, 4);
  const documentRows = [
    ["Request Filed", "Public-records request, agenda packet, and meeting video link collected in one working file."],
    ["What Changed", "A plain-language note explains which vote, filing, contract, or deadline moved the story forward."],
    ["Who Decides", "Named agencies, boards, departments, and elected officials are separated from outside stakeholders."],
    ["Reader Questions", "Open questions are preserved until documents, interviews, or official answers close the loop."],
  ];
  const timeline = [
    ["June 18", "Agenda item appears in public packet with staff recommendation and attached supporting documents."],
    ["June 24", "Residents raise follow-up questions about timing, public notice, cost, and neighborhood impact."],
    ["July 02", "The Times files a document request and logs every promised response in the case file."],
    ["July 07", "Reporter notes, source calls, and related coverage are grouped for a publishable explainer."],
  ];

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
            <a href={articlePath(lead.id)}>{lead.title}</a>
          </h3>
          <p>{lead.dek}</p>
          <div className="case-strip">
            <span>Documents: 14</span>
            <span>Open Questions: 6</span>
            <span>Status: Reporting</span>
          </div>
        </article>
        <div className="document-grid">
          {documentRows.map(([title, text]) => (
            <article className="document-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="timeline-list">
          {timeline.map(([date, text]) => (
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
            <li>Agenda packet</li>
            <li>Meeting minutes</li>
            <li>County staff memo</li>
            <li>Resident interview notes</li>
            <li>Records request receipt</li>
          </ol>
        </div>
        <a className="button" href={pagePath("archive")}>
          Search Archive
        </a>
      </aside>
    </section>
  );
}
