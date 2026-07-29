import { useEffect, useState } from "react";
import { directoryNavGroups, primaryNavLinks } from "../data/pages.js";
import { site } from "../data/content.js";
import { pagePath, sectionPath } from "../routing.js";
import { usePublicationPreferences } from "../hooks/usePublicationPreferences.js";
import { HoverLink } from "./HoverLink.jsx";

function navHref(item) {
  return item.section ? sectionPath(item.section) : pagePath(item.page);
}

function formatFullDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function weatherLabel(code) {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 86) return "Snow";
  if (code >= 95) return "Storms";
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

  return { dateLabel: formatFullDate(now), weather };
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

function Masthead({ preferences, route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { dateLabel, weather } = useMastheadInfo();
  const isArticle = route?.page === "article";

  function submitSearch(event) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")?.toString().trim();
    window.location.hash = query ? `/archive?q=${encodeURIComponent(query)}` : "/archive";
    setSearchOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-utility wide-shell">
        <div className="site-utility-actions">
          <button
            className="site-icon-button"
            type="button"
            aria-label={menuOpen ? "Close section menu" : "Open section menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <button
            className="site-search-button"
            type="button"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            Search
          </button>
        </div>
        {isArticle ? <HoverLink className="site-utility-brand" href={pagePath("home")}>{site.name}</HoverLink> : null}
        <div className="site-account-actions">
          <button
            className="site-preference-button"
            type="button"
            aria-label={`Color theme: ${preferences.theme}. Activate to change theme.`}
            onClick={preferences.cycleTheme}
          >
            Theme: {preferences.theme === "system" ? "System" : preferences.theme === "dark" ? "Dark" : "Light"}
          </button>
          <button
            className="site-preference-button site-ad-preference"
            type="button"
            aria-pressed={preferences.showAdvertisements}
            onClick={() => preferences.setShowAdvertisements(!preferences.showAdvertisements)}
          >
            Ads: {preferences.showAdvertisements ? "Shown" : "Hidden"}
          </button>
          <HoverLink className="site-subscribe" href={pagePath("newsletter")}>Subscribe</HoverLink>
          <HoverLink className="site-sign-in" href={pagePath("about")}>About us</HoverLink>
        </div>
      </div>

      {!isArticle ? <div className="site-masthead content-shell">
        <div className="site-masthead-meta site-masthead-meta--left">
          <span>{dateLabel}</span>
          <span>{site.location}</span>
        </div>
        <div className="site-brand">
          <h1><HoverLink href={pagePath("home")}>{site.name}</HoverLink></h1>
          <p>Whats Happening Around the Corner</p>
        </div>
        <div className="site-masthead-meta site-masthead-meta--right">
          <span>{site.volume}</span>
          {weather ? <span>{weather.temp}&deg; {weather.label}</span> : <span>Independent local news</span>}
        </div>
      </div> : null}

      {searchOpen ? (
        <form className="site-search-panel" onSubmit={submitSearch}>
          <label htmlFor="site-search">Search Tysons Times</label>
          <input id="site-search" name="query" type="search" placeholder="Search stories and topics" autoFocus />
          <button type="submit">Search</button>
        </form>
      ) : null}

      {!isArticle || menuOpen ? <nav className={menuOpen ? "site-sections is-open" : "site-sections"} aria-label="Primary sections">
        <div className="content-shell site-section-row">
          {primaryNavLinks.map((item) => (
            <NavItem item={item} key={item.label} route={route} />
          ))}
        </div>
      </nav> : null}

      {menuOpen ? (
        <nav className="site-directory content-shell" aria-label="Complete newspaper directory">
          {directoryNavGroups.map((group) => (
            <div className="site-directory-group" key={group.title}>
              <strong>{group.title}</strong>
              {group.links.map((item) => (
                <NavItem item={item} key={item.label} route={route} />
              ))}
            </div>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="content-shell site-footer-inner">
        <div>
          <HoverLink className="site-footer-mark" href={pagePath("home")}>{site.name}</HoverLink>
          <p>Northern Virginia, clearly reported.</p>
        </div>
        <nav aria-label="Footer">
          <HoverLink href={pagePath("about")}>About</HoverLink>
          <HoverLink href={pagePath("corrections")}>Corrections</HoverLink>
          <HoverLink href={pagePath("newsletter")}>Newsletter</HoverLink>
          <HoverLink href={pagePath("archive")}>Archive</HoverLink>
        </nav>
        <small>{site.footer}</small>
      </div>
    </footer>
  );
}

export function NewspaperLayout({ children, route }) {
  const preferences = usePublicationPreferences();
  const showAd = preferences.showAdvertisements && (route?.page === "home" || route?.page === "article");

  return (
    <main className={route?.page === "article" ? "page-shell page-shell--article" : "page-shell"}>
      <article className="newspaper" aria-label="Tysons Times">
        <div className="paper-content">
          <Masthead route={route} preferences={preferences} />
          {showAd ? <div className="site-top-ad" aria-label="Advertisement">Advertisement</div> : null}
          {children}
          <Footer />
        </div>
      </article>
    </main>
  );
}
