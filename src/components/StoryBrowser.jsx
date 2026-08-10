import { useEffect, useMemo, useState } from "react";
import { sections } from "../data/content.js";
import { useSavedArticles } from "../hooks/useSavedArticles.js";
import { ArticleCard } from "./ArticleBits.jsx";

const PAGE_SIZE = 12;
const DEFAULT_SORT = "newest";
const SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["updated", "Recently updated"],
  ["relevance", "Best match"],
  ["featured", "Editor’s picks"],
  ["longest", "Most in-depth"],
  ["shortest", "Quickest reads"],
  ["headline", "Headline A–Z"],
];
const VALID_SORTS = new Set(SORT_OPTIONS.map(([value]) => value));
const MONTHS = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" });

function monthLabel(month) {
  return MONTHS.format(new Date(Date.UTC(2026, Number(month) - 1, 1)));
}

function filtersFromQuery(queryString, includeSection) {
  const params = new URLSearchParams(queryString || "");
  const legacyMonth = params.get("month") || "";
  const exactDate = params.get("date") || "";
  const [legacyYear, legacyMonthNumber] = legacyMonth.includes("-") ? legacyMonth.split("-") : ["", legacyMonth];
  const requestedSort = params.get("sort") || DEFAULT_SORT;

  return {
    query: params.get("q") || "",
    section: includeSection ? params.get("section") || "" : "",
    month: legacyMonthNumber,
    year: params.get("year") || legacyYear,
    from: params.get("from") || exactDate,
    to: params.get("to") || exactDate,
    sort: VALID_SORTS.has(requestedSort) ? requestedSort : DEFAULT_SORT,
    savedOnly: params.get("saved") === "1",
  };
}

function updateHashQuery(filters, includeSection) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (includeSection && filters.section) params.set("section", filters.section);
  if (filters.month) params.set("month", filters.month);
  if (filters.year) params.set("year", filters.year);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  if (filters.savedOnly) params.set("saved", "1");

  const path = window.location.hash.replace(/^#/, "").split("?")[0] || "/";
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${path}${query ? `?${query}` : ""}`);
}

function storyTimestamp(article, field = "date") {
  return new Date(`${article[field] || article.date}T12:00:00`).getTime();
}

function relevanceScore(article, normalizedQuery) {
  if (!normalizedQuery) return 0;
  const title = article.title.toLowerCase();
  const tags = article.tags.join(" ").toLowerCase();
  const secondary = `${article.dek} ${article.author} ${article.location}`.toLowerCase();
  return (title === normalizedQuery ? 12 : 0)
    + (title.includes(normalizedQuery) ? 7 : 0)
    + (tags.includes(normalizedQuery) ? 4 : 0)
    + (secondary.includes(normalizedQuery) ? 1 : 0);
}

function compareArticles(a, b, sort, normalizedQuery) {
  const newestDifference = storyTimestamp(b) - storyTimestamp(a);
  let difference = 0;

  if (sort === "oldest") difference = -newestDifference;
  else if (sort === "updated") difference = storyTimestamp(b, "updated") - storyTimestamp(a, "updated");
  else if (sort === "relevance") difference = relevanceScore(b, normalizedQuery) - relevanceScore(a, normalizedQuery);
  else if (sort === "featured") difference = a.priority - b.priority;
  else if (sort === "longest") difference = (b.wordCount || 0) - (a.wordCount || 0);
  else if (sort === "shortest") difference = (a.wordCount || 0) - (b.wordCount || 0);
  else if (sort === "headline") difference = a.title.localeCompare(b.title, "en", { sensitivity: "base" });
  else difference = newestDifference;

  return difference || newestDifference || a.priority - b.priority;
}

export function StoryBrowser({ articles, route, includeSection = false, title = "Find stories" }) {
  const initialFilters = filtersFromQuery(route?.queryString, includeSection);
  const [filters, setFilters] = useState(initialFilters);
  const [dateRangeOpen, setDateRangeOpen] = useState(Boolean(initialFilters.from || initialFilters.to));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { savedArticleIds } = useSavedArticles();
  const savedArticleIdSet = useMemo(() => new Set(savedArticleIds), [savedArticleIds]);

  useEffect(() => {
    const nextFilters = filtersFromQuery(route?.queryString, includeSection);
    setFilters(nextFilters);
    setDateRangeOpen(Boolean(nextFilters.from || nextFilters.to));
  }, [route?.queryString, includeSection]);

  useEffect(() => {
    updateHashQuery(filters, includeSection);
    setVisibleCount(PAGE_SIZE);
  }, [filters, includeSection]);

  const availableMonths = useMemo(
    () => [...new Set(articles.map((article) => article.date.slice(5, 7)))].sort((a, b) => Number(a) - Number(b)),
    [articles],
  );
  const availableYears = useMemo(
    () => [...new Set(articles.map((article) => article.date.slice(0, 4)))].sort().reverse(),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return articles
      .filter((article) => {
        const haystack = `${article.title} ${article.dek} ${article.author} ${article.tags.join(" ")} ${article.location}`.toLowerCase();
        return (
          (!normalizedQuery || haystack.includes(normalizedQuery))
          && (!filters.savedOnly || savedArticleIdSet.has(article.id))
          && (!includeSection || !filters.section || article.section === filters.section)
          && (!filters.month || article.date.slice(5, 7) === filters.month)
          && (!filters.year || article.date.startsWith(`${filters.year}-`))
          && (!filters.from || article.date >= filters.from)
          && (!filters.to || article.date <= filters.to)
        );
      })
      .sort((a, b) => compareArticles(a, b, filters.sort, normalizedQuery));
  }, [articles, filters, includeSection, savedArticleIdSet]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasFilters = Boolean(
    filters.query || filters.section || filters.month || filters.year || filters.from || filters.to
      || filters.sort !== DEFAULT_SORT || filters.savedOnly,
  );

  function setFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function setCalendarFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, from: "", to: "" }));
    if (value) setDateRangeOpen(false);
  }

  function setRangeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, month: "", year: "" }));
  }

  function clearFilters() {
    setFilters({ query: "", section: "", month: "", year: "", from: "", to: "", sort: DEFAULT_SORT, savedOnly: false });
    setDateRangeOpen(false);
  }

  return (
    <>
      <div className="search-panel story-browser" role="search" aria-label={title}>
        <div className="story-browser-heading">
          <div>
            <span className="story-browser-kicker">Story finder</span>
            <h3>{title}</h3>
          </div>
          {hasFilters ? <button className="filter-clear" type="button" onClick={clearFilters}>Reset all</button> : null}
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
              <span>Section <small>Optional</small></span>
              <select className="section-select" value={filters.section} onChange={(event) => setFilter("section", event.target.value)}>
                <option value="">All sections</option>
                {sections.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
              </select>
            </label>
          ) : null}
          <label className="form-field">
            <span>Month <small>Optional</small></span>
            <select className="date-select" value={filters.month} onChange={(event) => setCalendarFilter("month", event.target.value)}>
              <option value="">Any month</option>
              {availableMonths.map((month) => <option value={month} key={month}>{monthLabel(month)}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Year <small>Optional</small></span>
            <select className="date-select" value={filters.year} onChange={(event) => setCalendarFilter("year", event.target.value)}>
              <option value="">Any year</option>
              {availableYears.map((year) => <option value={year} key={year}>{year}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Sort by</span>
            <select className="sort-select" value={filters.sort} onChange={(event) => setFilter("sort", event.target.value)}>
              {SORT_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
        </div>

        <div className="story-browser-utility">
          <button
            className="date-range-toggle"
            type="button"
            aria-expanded={dateRangeOpen}
            aria-controls="story-date-range"
            onClick={() => setDateRangeOpen((open) => !open)}
          >
            {dateRangeOpen ? "Hide date range" : "Use a custom date range"}
          </button>
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
        </div>

        {dateRangeOpen ? (
          <div className="date-range-controls" id="story-date-range">
            <label className="form-field">
              <span>From</span>
              <input className="date-input" type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => setRangeFilter("from", event.target.value)} />
            </label>
            <label className="form-field">
              <span>Through</span>
              <input className="date-input" type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => setRangeFilter("to", event.target.value)} />
            </label>
          </div>
        ) : null}

        <p className="archive-result-count" role="status" aria-live="polite">
          <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "story" : "stories"}
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
