import { useMemo, useState } from "react";
import { ArticleCard } from "../components/ArticleBits.jsx";
import { sections } from "../data/content.js";
import { sortedArticles } from "../data/selectors.js";

export function ArchivePage() {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("");
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedArticles.filter((article) => {
      const haystack = `${article.title} ${article.dek} ${article.tags.join(" ")} ${article.location}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesSection = !section || article.section === section;
      return matchesQuery && matchesSection;
    });
  }, [query, section]);

  return (
    <section className="section">
      <h2 className="page-title">Archive</h2>
      <div className="search-panel">
        <h3>Search Tysons Times</h3>
        <div className="archive-controls">
          <input
            className="search-input"
            type="search"
            placeholder="Search headlines, tags, locations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select className="section-select" value={section} onChange={(event) => setSection(event.target.value)}>
            <option value="">All sections</option>
            {sections.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="card-grid" id="archiveGrid">
        {filteredArticles.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </div>
    </section>
  );
}
