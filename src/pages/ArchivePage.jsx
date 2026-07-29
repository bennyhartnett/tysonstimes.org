import { useMemo, useState } from "react";
import { ArticleCard } from "../components/ArticleBits.jsx";
import { sections } from "../data/content.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { sortArticles } from "../data/selectors.js";

export function ArchivePage() {
  const sortedArticles = sortArticles(useArticles());
  const [query, setQuery] = useState(() => {
    const hashQuery = window.location.hash.split("?")[1] || "";
    return new URLSearchParams(hashQuery).get("q") || "";
  });
  const [section, setSection] = useState("");
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedArticles.filter((article) => {
      const haystack = `${article.title} ${article.dek} ${article.tags.join(" ")} ${article.location}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesSection = !section || article.section === section;
      return matchesQuery && matchesSection;
    });
  }, [query, section, sortedArticles]);

  return (
    <section className="section">
      <h1 className="page-title">Archive</h1>
      <div className="search-panel" role="search">
        <h3>Search Tysons Times</h3>
        <div className="archive-controls">
          <label className="form-field">
            <span>Search stories</span>
          <input
            className="search-input"
            type="search"
            placeholder="Search headlines, tags, locations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          </label>
          <label className="form-field">
            <span>Filter by section</span>
            <select className="section-select" value={section} onChange={(event) => setSection(event.target.value)}>
            <option value="">All sections</option>
            {sections.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
            </select>
          </label>
        </div>
        <p className="archive-result-count" role="status">{filteredArticles.length} {filteredArticles.length === 1 ? "story" : "stories"} found</p>
      </div>
      <div className="card-grid" id="archiveGrid">
        {filteredArticles.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
        {filteredArticles.length === 0 ? <p>No stories match those filters.</p> : null}
      </div>
    </section>
  );
}
