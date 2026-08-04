import { StoryBrowser } from "../components/StoryBrowser.jsx";
import { useArticles } from "../data/ContentProvider.jsx";
import { sortArticles } from "../data/selectors.js";

export function ArchivePage({ route }) {
  const sortedArticles = sortArticles(useArticles());

  return (
    <section className="section">
      <h1 className="page-title">Archive</h1>
      <p className="deck">Search every published Tysons Times story by topic, section, or publication date.</p>
      <StoryBrowser articles={sortedArticles} route={route} includeSection title="Search the archive" />
    </section>
  );
}
