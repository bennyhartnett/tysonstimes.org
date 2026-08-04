import { useEffect, useMemo, useState } from "react";
import { sections } from "../data/content.js";
import { formatDate } from "../utils/format.js";
import { ArticleCard } from "./ArticleBits.jsx";

const PAGE_SIZE = 12;

function filtersFromQuery(queryString, includeSection) {
  const params = new URLSearchParams(queryString || "");
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const exactDate = params.get("date") || "";

  return {
    query: params.get("q") || "",
    section: includeSection ? params.get("section") || "" : "",
    dateChoice: exactDate || (from || to ? "custom" : ""),
    from,
    to,
    sort: params.get("sort") === "oldest" ? "oldest" : "newest",
  };
}

function updateHashQuery(filters, includeSection) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (includeSection && filters.section) params.set("section", filters.section);
  if (filters.dateChoice === "custom") {
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
  } else if (filters.dateChoice) {
    params.set("date", filters.dateChoice);
  }
  if (filters.sort === "oldest") params.set("sort", "oldest");

  const path = window.location.hash.replace(/^#/, "").split("?")[0] || "/";
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${path}${query ? `?${query}` : ""}`);
}

function storyTimestamp(article) {
  return new Date(`${article.date}T12:00:00`).getTime();
}

export function StoryBrowser({ articles, route, includeSection = false, title = "Find stories" }) {
  const [filters, setFilters] = useState(() => filtersFromQuery(route?.queryString, includeSection));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setFilters(filtersFromQuery(route?.queryString, includeSection));
  }, [route?.queryString, includeSection]);

  useEffect(() => {
    updateHashQuery(filters, includeSection);
    setVisibleCount(PAGE_SIZE);
  }, [filters, includeSection]);

  const availableDates = useMemo(
    () => [...new Set(articles.map((article) => article.date))].sort().reverse(),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();
    const exactDate = filters.dateChoice !== "custom" ? filters.dateChoice : "";

    return articles
      .filter((article) => {
        const haystack = `${article.title} ${article.dek} ${article.author} ${article.tags.join(" ")} ${article.location}`.toLowerCase();
        return (
          (!normalizedQuery || haystack.includes(normalizedQuery)) &&
          (!includeSection || !filters.section || article.section === filters.section) &&
          (!exactDate || article.date === exactDate) &&
          (filters.dateChoice !== "custom" || !filters.from || article.date >= filters.from) &&
          (filters.dateChoice !== "custom" || !filters.to || article.date <= filters.to)
        );
      })
      .sort((a, b) => {
        const dateDifference = storyTimestamp(b) - storyTimestamp(a);
        const direction = filters.sort === "oldest" ? -1 : 1;
        return dateDifference ? dateDifference * direction : a.priority - b.priority;
      });
  }, [articles, filters, includeSection]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasFilters = Boolean(
    filters.query || filters.section || filters.dateChoice || filters.from || filters.to || filters.sort === "oldest",
  );

  function setFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === "dateChoice" && value !== "custom" ? { from: "", to: "" } : {}),
    }));
  }

  function clearFilters() {
    setFilters({ query: "", section: "", dateChoice: "", from: "", to: "", sort: "newest" });
  }

  return (
    <>
      <div className="search-panel story-browser" role="search" aria-label={title}>
        <div className="story-browser-heading">
          <h3>{title}</h3>
          {hasFilters ? <button className="filter-clear" type="button" onClick={clearFilters}>Clear all</button> : null}
        </div>
        <div className="archive-controls">
          <label className="form-field story-search-field">
            <span>{includeSection ? "Search all stories" : "Search this section"}</span>
            <input
              className="search-input"
              type="search"
              placeholder="Headline, topic, author, or place"
              value={filters.query}
              onChange={(event) => setFilter("query", event.target.value)}
            />
          </label>
          {includeSection ? (
            <label className="form-field">
              <span>Section</span>
              <select className="section-select" value={filters.section} onChange={(event) => setFilter("section", event.target.value)}>
                <option value="">All sections</option>
                {sections.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
              </select>
            </label>
          ) : null}
          <label className="form-field">
            <span>Published</span>
            <select className="date-select" value={filters.dateChoice} onChange={(event) => setFilter("dateChoice", event.target.value)}>
              <option value="">Any date</option>
              {availableDates.map((date) => <option value={date} key={date}>{formatDate(date)}</option>)}
              <option value="custom">Custom range…</option>
            </select>
          </label>
          <label className="form-field">
            <span>Order</span>
            <select className="sort-select" value={filters.sort} onChange={(event) => setFilter("sort", event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
        {filters.dateChoice === "custom" ? (
          <div className="date-range-controls">
            <label className="form-field">
              <span>From</span>
              <input className="date-input" type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => setFilter("from", event.target.value)} />
            </label>
            <label className="form-field">
              <span>Through</span>
              <input className="date-input" type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => setFilter("to", event.target.value)} />
            </label>
          </div>
        ) : null}
        <p className="archive-result-count" role="status">
          {filteredArticles.length} {filteredArticles.length === 1 ? "story" : "stories"}
          {filteredArticles.length > visibleArticles.length ? ` · showing ${visibleArticles.length}` : ""}
        </p>
      </div>

      <div className="card-grid" id="archiveGrid">
        {visibleArticles.map((article) => <ArticleCard article={article} key={article.id} />)}
      </div>
      {filteredArticles.length === 0 ? (
        <div className="archive-empty" role="status">
          <h2>No stories found</h2>
          <p>Try a broader date range, another section, or fewer search terms.</p>
          {hasFilters ? <button className="button" type="button" onClick={clearFilters}>Reset filters</button> : null}
        </div>
      ) : null}
      {visibleArticles.length < filteredArticles.length ? (
        <div className="archive-more">
          <button className="button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            Show {Math.min(PAGE_SIZE, filteredArticles.length - visibleArticles.length)} more stories
          </button>
        </div>
      ) : null}
    </>
  );
}
