import { ArticleCard, HeadlineList, SectionIndex } from "../components/ArticleBits.jsx";
import { sections } from "../data/content.js";
import { articlesForSection, getSectionById } from "../data/selectors.js";

export function SectionPage({ route }) {
  const section = route.section || getSectionById(route.sectionId);
  const articles = articlesForSection(section.id);
  const otherSections = sections.filter((item) => item.id !== section.id);

  return (
    <section className="section">
      <div className="section-layout">
        <div>
          <h2 className="page-title">{section.label}</h2>
          <p className="deck">{section.description}</p>
          <div className="card-grid">
            {articles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
        </div>
        <aside className="article-tools">
          <div className="index-box">
            <h3>Section Index</h3>
            <HeadlineList articles={articles} />
          </div>
          <div className="ad-box">
            <h3>More Desks</h3>
            <SectionIndex sections={otherSections} />
          </div>
        </aside>
      </div>
    </section>
  );
}
