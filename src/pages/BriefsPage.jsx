import { Tags } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { sections } from "../data/content.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { sectionLabel, sortArticles } from "../data/selectors.js";
import { articlePath, sectionPath } from "../routing.js";
import { formatDate, textPreview } from "../utils/format.js";

export function BriefsPage() {
  const sortedArticles = sortArticles(useArticles());
  const briefs = sortedArticles.slice(0, 10);
  const sectionCounts = sections.map((section) => [
    section,
    sortedArticles.filter((article) => article.section === section.id).length,
  ]);

  return (
    <section className="section briefs-layout">
      <div>
        <h1 className="page-title">Latest Briefs</h1>
        <p className="deck">Recent verified reporting from across Tysons and Northern Fairfax County.</p>
        <div className="brief-list">
          {briefs.map((article, index) => (
            <article className="brief-item" data-article-id={article.id} key={article.id}>
              <div className="brief-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <div className="meta">
                  {sectionLabel(article.section)} / {article.location} / {formatDate(article.date)}
                </div>
                <h3><HoverLink href={articlePath(article.id)}>{article.title}</HoverLink></h3>
                <p>{textPreview(article.dek, 220)}</p>
                <Tags article={article} />
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Browse by Section</h3>
          <ol>
            {sectionCounts.map(([section, count]) => (
              <li key={section.id}>
                <HoverLink href={sectionPath(section.id)}>{section.label}</HoverLink> ({count})
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </section>
  );
}
