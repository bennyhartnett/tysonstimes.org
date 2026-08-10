import { useEffect, useRef, useState } from "react";
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
  const [headerCondensed, setHeaderCondensed] = useState(false);
  const headerRef = useRef(null);
  const compactHeaderRef = useRef(null);
  const progressRef = useRef(null);
  const menuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const { dateLabel, weather } = useMastheadInfo();
  const isArticle = route?.page === "article";

  useEffect(() => {
    let animationFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateHeader() {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0;
        const shouldCondense = isArticle || window.scrollY > (reducedMotion.matches ? 80 : 112);
        setHeaderCondensed((current) => (current === shouldCondense ? current : shouldCondense));
      });
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    reducedMotion.addEventListener?.("change", updateHeader);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
      reducedMotion.removeEventListener?.("change", updateHeader);
    };
  }, [isArticle, route?.key]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key !== "Escape") return;
      if (searchOpen) {
        setSearchOpen(false);
        searchButtonRef.current?.focus();
      } else if (menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [route?.key]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return undefined;

    function closeOnOutsidePress(event) {
      if (headerRef.current?.contains(event.target) || compactHeaderRef.current?.contains(event.target)) return;
      setMenuOpen(false);
      setSearchOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!isArticle) {
      progressRef.current?.style.setProperty("--article-progress", "0");
      return undefined;
    }

    let animationFrame = 0;
    function updateReadingProgress() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const progress = progressRef.current;
        if (!progress) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const nextProgress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        progress.style.setProperty("--article-progress", nextProgress.toFixed(4));
        progress.setAttribute("aria-valuenow", String(Math.round(nextProgress * 100)));
      });
    }

    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("resize", updateReadingProgress);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateReadingProgress);
      window.removeEventListener("resize", updateReadingProgress);
    };
  }, [isArticle, route?.key]);

  function submitSearch(event) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")?.toString().trim();
    window.location.hash = query ? `/archive?q=${encodeURIComponent(query)}` : "/archive";
    setSearchOpen(false);
  }

  function renderUtility(compact = false) {
    return (
      <div className="site-utility wide-shell">
        <div className="site-utility-actions">
          <button
            className="site-icon-button"
            type="button"
            aria-label={menuOpen ? "Close section menu" : "Open section menu"}
            aria-expanded={menuOpen}
            aria-controls={compact ? "site-compact-navigation site-directory" : "site-navigation site-directory"}
            onClick={(event) => {
              menuButtonRef.current = event.currentTarget;
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
          >
            <span />
            <span />
            <span />
          </button>
          <button
            className="site-search-button"
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="site-search-panel"
            onClick={(event) => {
              searchButtonRef.current = event.currentTarget;
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
          >
            Search
          </button>
        </div>
        {compact || isArticle ? <Wordmark compact inactive={compact && !headerCondensed} /> : null}
        <div className="site-account-actions">
          <button className="site-preference-button" type="button" aria-label={`Color theme: ${preferences.theme}. Activate to change theme.`} title="Change color theme" onClick={preferences.cycleTheme}>
            Theme: {preferences.theme === "system" ? "System" : preferences.theme === "dark" ? "Dark" : "Light"}
          </button>
          <HoverLink className="site-sign-in" href={pagePath("about")}>About us</HoverLink>
        </div>
      </div>
    );
  }

  function renderSearchPanel() {
    return (
      <form className="site-search-panel" id="site-search-panel" role="search" onSubmit={submitSearch}>
        <label htmlFor="site-search">Search Tysons Times</label>
        <input id="site-search" name="query" type="search" placeholder="Search stories and topics" autoFocus />
        <button type="submit">Search</button>
      </form>
    );
  }

  function renderSectionNavigation(id) {
    return (
      <nav id={id} className={menuOpen ? "site-sections is-open" : "site-sections"} aria-label="Primary sections">
        <div className="content-shell site-section-row">
          {primaryNavLinks.map((item) => <NavItem item={item} key={item.label} route={route} />)}
        </div>
      </nav>
    );
  }

  function renderDirectory() {
    return (
      <nav id="site-directory" className="site-directory content-shell" aria-label="Complete newspaper directory">
        {directoryNavGroups.map((group) => (
          <div className="site-directory-group" key={group.title}>
            <strong>{group.title}</strong>
            {group.links.map((item) => <NavItem item={item} key={item.label} route={route} />)}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <>
    <header className={isArticle ? "site-header site-header--article" : "site-header"} ref={headerRef}>
      {renderUtility(false)}

      {!isArticle ? <div className="site-masthead content-shell">
        <div className="site-masthead-meta site-masthead-meta--left">
          <span>{dateLabel}</span>
          <span>{site.location}</span>
        </div>
        <div className="site-brand">
          <div className="site-name"><Wordmark /></div>
          <p>Northern Virginia, <strong>clearly reported.</strong></p>
        </div>
        <div className="site-masthead-meta site-masthead-meta--right">
          <span>{site.edition}</span>
          {weather ? <span>{weather.temp}&deg; {weather.label}</span> : <span>Independent local news</span>}
        </div>
      </div> : null}

      {!headerCondensed && searchOpen ? renderSearchPanel() : null}

      {!isArticle || menuOpen ? renderSectionNavigation("site-navigation") : null}

      {!headerCondensed && menuOpen ? renderDirectory() : null}
      {isArticle ? (
        <div
          className="article-reading-progress"
          ref={progressRef}
          role="progressbar"
          aria-label="Article reading progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        >
          <span />
        </div>
      ) : null}
    </header>
    {!isArticle ? (
      <div className={headerCondensed ? "site-compact-header is-visible" : "site-compact-header"} ref={compactHeaderRef} aria-hidden={!headerCondensed} inert={!headerCondensed}>
        {renderUtility(true)}
        {headerCondensed && searchOpen ? renderSearchPanel() : null}
        {renderSectionNavigation("site-compact-navigation")}
        {headerCondensed && menuOpen ? renderDirectory() : null}
      </div>
    ) : null}
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="content-shell site-footer-inner">
        <div>
          <div className="site-footer-mark"><Wordmark /></div>
          <p>{site.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <HoverLink href={pagePath("about")}>About</HoverLink>
          <HoverLink href={pagePath("corrections")}>Corrections</HoverLink>
          <HoverLink href={pagePath("archive")}>Archive</HoverLink>
          <HoverLink href={`${pagePath("archive")}?saved=1`}>Saved stories</HoverLink>
          <a href="/feed.xml">RSS</a>
          <HoverLink href={pagePath("privacy")}>Privacy</HoverLink>
        </nav>
        <small>{site.footer}</small>
      </div>
    </footer>
  );
}

export function NewspaperLayout({ children, route }) {
  const preferences = usePublicationPreferences();
  const contentRef = useRef(null);
  const previousRouteKey = useRef(route?.key);
  const pageName = route?.page || "home";

  useEffect(() => {
    if (previousRouteKey.current === route?.key) return;
    previousRouteKey.current = route?.key;
    contentRef.current?.focus({ preventScroll: true });
  }, [route?.key]);

  return (
    <div className={`page-shell page-shell--${pageName}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="newspaper">
        <div className="paper-content">
          <Masthead route={route} preferences={preferences} />
          <main id="main-content" className={`page-main page-main--${pageName}`} ref={contentRef} tabIndex="-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function Wordmark({ compact = false, inactive = false }) {
  return (
    <HoverLink
      className={compact ? "site-utility-brand site-wordmark site-wordmark--compact" : "site-wordmark"}
      href={pagePath("home")}
      aria-label={site.name}
      aria-hidden={inactive || undefined}
      tabIndex={inactive ? -1 : undefined}
    >
      <span>Tysons</span>
      <span className="site-wordmark-accent">Times</span>
    </HoverLink>
  );
}
