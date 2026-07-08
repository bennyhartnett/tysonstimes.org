import { directoryNavGroups, primaryNavLinks } from "../data/pages.js";
import { site } from "../data/content.js";
import { pagePath, sectionPath } from "../routing.js";
import { HoverLink } from "./HoverLink.jsx";

function navHref(item) {
  return item.section ? sectionPath(item.section) : pagePath(item.page);
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

  return (
    <header className="masthead">
      <div className="kicker-row">
        <span>{site.location}</span>
        <span>Independent Local Newspaper</span>
        <span>{site.domain}</span>
      </div>
      <h1>
        <HoverLink href={pagePath("home")}>{site.name}</HoverLink>
      </h1>
      <p className="subtitle">{site.tagline}</p>
      <div className="meta-row">
        <span>{site.volume}</span>
        <span>Local, Civic, Schools, Business</span>
        <span>{site.edition}</span>
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
