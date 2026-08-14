import { EmptyArticles, SectionIndex } from "../components/ArticleBits.jsx";
import { StoryBrowser } from "../components/StoryBrowser.jsx";
import { sections } from "../data/content.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { articlesForSection, getSectionById } from "../data/selectors.js";

export function SectionPage({ route }) {
  const contentArticles = useArticles();
  const section = route.section || getSectionById(route.sectionId);
  const articles = articlesForSection(section.id, contentArticles);
  const otherSections = sections.filter((item) => item.id !== section.id);

  return (
    <section className="section section-page">
      <div className="section-layout">
        <div>
          <h1 className="page-title">{section.label}</h1>
          <p className="deck">{section.description}</p>
          {articles.length ? (
            <StoryBrowser articles={articles} route={route} title={`Browse ${section.label}`} compact key={section.id} />
          ) : <EmptyArticles />}
        </div>
        <aside className="article-tools">
          <div className="ad-box">
            <h3>More Desks</h3>
            <SectionIndex sections={otherSections} />
          </div>
        </aside>
      </div>
    </section>
  );
}
