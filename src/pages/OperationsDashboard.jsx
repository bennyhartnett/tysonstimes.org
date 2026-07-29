import { useEffect, useMemo, useState } from "react";
import { articles as localArticles, site } from "../data/content.js";
import { useContentStatus } from "../data/ContentProvider.jsx";
import { OperationsSettings } from "../components/OperationsSettings.jsx";

const DAY = 24 * 60 * 60 * 1000;

function articleDate(article) {
  return new Date(`${article.date}T12:00:00`);
}

function shortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function buildBuckets(articles, range) {
  const dates = articles.map(articleDate).filter((date) => !Number.isNaN(date.getTime()));
  const latest = dates.length ? new Date(Math.max(...dates)) : new Date();

  if (range === "week") {
    return Array.from({ length: 7 }, (_, index) => {
      const start = new Date(latest.getTime() - (6 - index) * DAY);
      const end = new Date(start.getTime() + DAY);
      return {
        label: start.toLocaleDateString("en-US", { weekday: "short" }),
        detail: shortDate(start),
        count: dates.filter((date) => date >= start && date < end).length,
      };
    });
  }

  if (range === "month") {
    const first = new Date(latest.getTime() - 27 * DAY);
    return Array.from({ length: 4 }, (_, index) => {
      const start = new Date(first.getTime() + index * 7 * DAY);
      const end = new Date(start.getTime() + 7 * DAY);
      return {
        label: `W${index + 1}`,
        detail: `${shortDate(start)}–${shortDate(new Date(end.getTime() - DAY))}`,
        count: dates.filter((date) => date >= start && date < end).length,
      };
    });
  }

  const lastMonth = startOfMonth(latest);
  return Array.from({ length: 12 }, (_, index) => {
    const start = new Date(lastMonth.getFullYear(), lastMonth.getMonth() - (11 - index), 1, 12);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1, 12);
    return {
      label: start.toLocaleDateString("en-US", { month: "short" }),
      detail: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      count: dates.filter((date) => date >= start && date < end).length,
    };
  });
}

function MetricCard({ label, value, note, tone }) {
  return (
    <article className={`ops-metric ops-metric--${tone}`}>
      <div className="ops-metric-heading">
        <span className="ops-metric-icon" aria-hidden="true">
          {tone === "deployed" ? "↗" : "↓"}
        </span>
        <span>{label}</span>
      </div>
      <strong>{value.toLocaleString()}</strong>
      <p>{note}</p>
    </article>
  );
}

function ActivityChart({ articles }) {
  const [range, setRange] = useState("week");
  const buckets = useMemo(() => buildBuckets(articles, range), [articles, range]);
  const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const tick = Math.ceil(max / 2);

  return (
    <section className="ops-chart-card" aria-labelledby="activity-title">
      <div className="ops-chart-header">
        <div>
          <p className="ops-eyebrow">Publishing volume</p>
          <h2 id="activity-title">Article activity</h2>
          <p className="ops-chart-summary">
            <strong>{total}</strong> articles in this view
          </p>
        </div>
        <div className="ops-range-tabs" aria-label="Chart time range">
          {["week", "month", "year"].map((option) => (
            <button
              type="button"
              className={range === option ? "is-active" : ""}
              aria-pressed={range === option}
              onClick={() => setRange(option)}
              key={option}
            >
              {option === "week" ? "Weekly" : option === "month" ? "Monthly" : "Yearly"}
            </button>
          ))}
        </div>
      </div>

      <div className="ops-chart" role="img" aria-label={`${total} article records shown in the ${range} view`}>
        <div className="ops-y-axis" aria-hidden="true">
          <span>{max}</span>
          <span>{tick}</span>
          <span>0</span>
        </div>
        <div className="ops-plot">
          <div className="ops-gridline ops-gridline--top" />
          <div className="ops-gridline ops-gridline--middle" />
          <div className="ops-gridline ops-gridline--bottom" />
          <div className={`ops-bars ops-bars--${range}`}>
            {buckets.map((bucket) => (
              <div className="ops-bar-column" key={`${bucket.detail}-${bucket.label}`}>
                <div className="ops-bar-track">
                  <div
                    className="ops-bar"
                    style={{ height: `${(bucket.count / max) * 100}%` }}
                    tabIndex="0"
                    aria-label={`${bucket.detail}: ${bucket.count} articles`}
                    data-count={bucket.count}
                  />
                </div>
                <span className="ops-bar-label">{bucket.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ops-legend">
        <span><i /> Articles processed</span>
        <span>Counts are grouped by article date</span>
      </div>
    </section>
  );
}

export function OperationsDashboard() {
  const { articles: deployedArticles, source } = useContentStatus();
  const [panel, setPanel] = useState(() => new URLSearchParams(window.location.search).get("panel") === "settings" ? "settings" : "overview");
  const newestDate = deployedArticles
    .map(articleDate)
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b - a)[0];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${site.name} Operations`;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  function showPanel(nextPanel) {
    const url = new URL(window.location.href);
    if (nextPanel === "settings") url.searchParams.set("panel", "settings");
    else url.searchParams.delete("panel");
    window.history.replaceState({}, "", url);
    setPanel(nextPanel);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="ops-shell">
      <header className="ops-topbar">
        <a className="ops-brand" href="/" aria-label={`${site.name} operations home`}>
          <span className="ops-brand-mark">T</span>
          <span>
            <strong>{site.name}</strong>
            <small>Operations</small>
          </span>
        </a>
        <nav className="ops-app-nav" aria-label="Operations navigation">
          <button type="button" className={panel === "overview" ? "is-active" : ""} aria-current={panel === "overview" ? "page" : undefined} onClick={() => showPanel("overview")}>Overview</button>
          <button type="button" className={panel === "settings" ? "is-active" : ""} aria-current={panel === "settings" ? "page" : undefined} onClick={() => showPanel("settings")}>Settings</button>
        </nav>
        <div className="ops-topbar-actions">
          <span className="ops-local-status"><i /> Local workspace</span>
          <a className="ops-site-link" href="?view=site#/">View newspaper <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      {panel === "settings" ? <OperationsSettings /> : <div className="ops-content">
        <section className="ops-intro">
          <div>
            <p className="ops-eyebrow">Content pipeline</p>
            <h1>Publishing overview</h1>
            <p>Track the stories moving from collection to the live edition.</p>
          </div>
          <div className="ops-updated">
            <span>Latest article</span>
            <strong>{newestDate ? shortDate(newestDate) : "No activity"}</strong>
          </div>
        </section>

        <section className="ops-metrics" aria-label="Article totals">
          <MetricCard
            label="Articles deployed"
            value={deployedArticles.length}
            note={source === "live" ? "Confirmed in the live content feed" : "Showing the latest available snapshot"}
            tone="deployed"
          />
          <MetricCard
            label="Articles scraped"
            value={localArticles.length}
            note="Available in the local job snapshot"
            tone="scraped"
          />
        </section>

        <ActivityChart articles={deployedArticles} />
      </div>}
    </main>
  );
}
