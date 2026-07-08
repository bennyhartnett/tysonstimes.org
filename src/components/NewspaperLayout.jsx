import { useEffect, useState } from "react";
import { directoryNavGroups, primaryNavLinks } from "../data/pages.js";
import { site } from "../data/content.js";
import { pagePath, sectionPath } from "../routing.js";
import { HoverLink } from "./HoverLink.jsx";

function navHref(item) {
  return item.section ? sectionPath(item.section) : pagePath(item.page);
}

function editionForHour(hour) {
  if (hour < 12) return "Morning Edition";
  if (hour < 17) return "Afternoon Edition";
  return "Evening Edition";
}

function formatFullDate(date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const rest = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${weekday} ${rest}`;
}

// WMO weather interpretation codes -> short label
function weatherLabel(code) {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Raining";
  if (code >= 71 && code <= 77) return "Snowing";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code >= 95) return "Thunderstorm";
  return "";
}

function useMastheadInfo() {
  const [now] = useState(() => new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${site.latitude}` +
      `&longitude=${site.longitude}` +
      "&current=temperature_2m,weather_code&temperature_unit=fahrenheit";

    fetch(url, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const current = data?.current;
        if (!current) return;
        setWeather({
          temp: Math.round(current.temperature_2m),
          label: weatherLabel(current.weather_code),
        });
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return {
    edition: editionForHour(now.getHours()),
    dateLabel: formatFullDate(now),
    weather,
  };
}

function isActiveLink(item, route) {
  if (item.section) {
    return route?.sectionId === item.section || route?.article?.section === item.section;
  }

  return route?.page === item.page;
}

function NavItem({ item, route }) {
  const isActive = isActiveLink(item, route);

  return (
    <HoverLink
      className={isActive ? "is-active" : undefined}
      href={navHref(item)}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
    </HoverLink>
  );
}

function Masthead({ route }) {
  const indexHasActiveLink = directoryNavGroups.some((group) =>
    group.links.some((item) => isActiveLink(item, route)),
  );
  const { edition, dateLabel, weather } = useMastheadInfo();

  return (
    <header className="masthead">
      <div className="kicker-row">
        <span className="masthead-locale">
          {site.location}
          {weather ? (
            <span className="masthead-weather">
              {weather.temp}&deg;{weather.label ? ` ${weather.label}` : ""}
            </span>
          ) : null}
        </span>
        <span>{dateLabel}</span>
        <span>{site.domain}</span>
      </div>
      <h1>
        <HoverLink href={pagePath("home")}>{site.name}</HoverLink>
      </h1>
      <p className="subtitle">{site.tagline}</p>
      <div className="meta-row">
        <span>{site.volume}</span>
        <span>Local, Civic, Schools, Business</span>
        <span>{edition}</span>
      </div>
      <nav className="nav-strip" aria-label="Primary sections">
        {primaryNavLinks.map((item) => (
          <NavItem item={item} key={item.label} route={route} />
        ))}
      </nav>
      <details className={indexHasActiveLink ? "site-index has-active" : "site-index"}>
        <summary>Index</summary>
        <nav className="site-index-panel" aria-label="Complete newspaper index">
          {directoryNavGroups.map((group) => (
            <div className="site-index-group" key={group.title}>
              <strong>{group.title}</strong>
              {group.links.map((item) => (
                <NavItem item={item} key={item.label} route={route} />
              ))}
            </div>
          ))}
        </nav>
      </details>
      <div className="issue-line">
        <span>{site.issueLine}</span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer-note">
      <span>{site.footer}</span>
    </footer>
  );
}

export function NewspaperLayout({ children, route }) {
  return (
    <main className="page-shell">
      <article className="newspaper" aria-label="Tysons Times newspaper template">
        <div className="paper-content">
          <Masthead route={route} />
          {children}
          <Footer />
        </div>
      </article>
    </main>
  );
}
