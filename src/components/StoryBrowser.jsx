import { useEffect, useMemo, useState } from "react";
import { sections } from "../data/content.js";
import { formatDate } from "../utils/format.js";
import { useSavedArticles } from "../hooks/useSavedArticles.js";
import { ArticleCard } from "./ArticleBits.jsx";

const PAGE_SIZE = 12;

function filtersFromQuery(queryString, includeSection) {
  const params = new URLSearchParams(queryString || "");
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const exactDate = params.get("date") || "";
  const month = params.get("month") || "";
  const year = params.get("year") || "";

  return {
    query: params.get("q") || "",
    section: includeSection ? params.get("section") || "" : "",
    dateChoice: exactDate || (month ? `month:${month}` : year ? `year:${year}` : from || to ? "custom" : ""),
    from,
    to,
    sort: params.get("sort") === "oldest" ? "oldest" : "newest",
    savedOnly: params.get("saved") === "1",
  };
}

function updateHashQuery(filters, includeSection) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (includeSection && filters.section) params.set("section", filters.section);
  if (filters.dateChoice === "custom") {
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
  } else if (filters.dateChoice.startsWith("month:")) {
    params.set("month", filters.dateChoice.slice(6));
  } else if (filters.dateChoice.startsWith("year:")) {
    params.set("year", filters.dateChoice.slice(5));
  } else if (filters.dateChoice) {
    params.set("date", filters.dateChoice);
  }
  if (filters.sort === "oldest") params.set("sort", "oldest");
  if (filters.savedOnly) params.set("saved", "1");

  const path = window.location.hash.replace(/^#/, "").split("?")[0] || "/";
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${path}${query ? `?${query}` : ""}`);
}

function storyTimestamp(article) {
  return new Date(`${article.date}T12:00:00`).getTime();
}

function formatMonth(month) {
  return new Date(`${month}-01T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function StoryBrowser({ articles, route, includeSection = false, title = "Find stories" }) {
  const [filters, setFilters] = useState(() => filtersFromQuery(route?.queryString, includeSection));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { savedArticleIds } = useSavedArticles();
  const savedArticleIdSet = useMemo(() => new Set(savedArticleIds), [savedArticleIds]);

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
  const availableMonths = useMemo(
    () => [...new Set(articles.map((article) => article.date.slice(0, 7)))].sort().reverse(),
    [articles],
  );
  const availableYears = useMemo(
    () => [...new Set(articles.map((article) => article.date.slice(0, 4)))].sort().reverse(),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();
    const exactDate = filters.dateChoice && filters.dateChoice !== "custom" && !filters.dateChoice.includes(":")
      ? filters.dateChoice
      : "";
    const selectedMonth = filters.dateChoice.startsWith("month:") ? filters.dateChoice.slice(6) : "";
    const selectedYear = filters.dateChoice.startsWith("year:") ? filters.dateChoice.slice(5) : "";

    return articles
      .filter((article) => {
        const haystack = `${article.title} ${article.dek} ${article.author} ${article.tags.join(" ")} ${article.location}`.toLowerCase();
        return (
          (!normalizedQuery || haystack.includes(normalizedQuery)) &&
          (!filters.savedOnly || savedArticleIdSet.has(article.id)) &&
          (!includeSection || !filters.section || article.section === filters.section) &&
          (!exactDate || article.date === exactDate) &&
          (!selectedMonth || article.date.startsWith(`${selectedMonth}-`)) &&
          (!selectedYear || article.date.startsWith(`${selectedYear}-`)) &&
          (filters.dateChoice !== "custom" || !filters.from || article.date >= filters.from) &&
          (filters.dateChoice !== "custom" || !filters.to || article.date <= filters.to)
        );
      })
      .sort((a, b) => {
        const dateDifference = storyTimestamp(b) - storyTimestamp(a);
        const direction = filters.sort === "oldest" ? -1 : 1;
        return dateDifference ? dateDifference * direction : a.priority - b.priority;
      });
  }, [articles, filters, includeSection, savedArticleIdSet]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasFilters = Boolean(
    filters.query || filters.section || filters.dateChoice || filters.from || filters.to || filters.sort === "oldest" || filters.savedOnly,
  );

  function setFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === "dateChoice" && value !== "custom" ? { from: "", to: "" } : {}),
    }));
  }

  function clearFilters() {
    setFilters({ query: "", section: "", dateChoice: "", from: "", to: "", sort: "newest", savedOnly: false });
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
              <optgroup label="Browse by month">
                {availableMonths.map((month) => <option value={`month:${month}`} key={month}>{formatMonth(month)}</option>)}
              </optgroup>
              <optgroup label="Browse by year">
                {availableYears.map((year) => <option value={`year:${year}`} key={year}>{year}</option>)}
              </optgroup>
              <optgroup label="Exact publication date">
                {availableDates.map((date) => <option value={date} key={date}>{formatDate(date)}</option>)}
              </optgroup>
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
        {includeSection ? (
          <label className="saved-stories-filter">
            <input
              type="checkbox"
              checked={filters.savedOnly}
              onChange={(event) => setFilter("savedOnly", event.target.checked)}
            />
            <span>Saved stories only</span>
            <small>{savedArticleIds.length}</small>
          </label>
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
          <h2>{filters.savedOnly && savedArticleIds.length === 0 ? "No saved stories yet" : "No stories found"}</h2>
          <p>
            {filters.savedOnly && savedArticleIds.length === 0
              ? "Open any article and choose Save to keep it in your on-device reading list."
              : "Try a broader date range, another section, or fewer search terms."}
          </p>
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
