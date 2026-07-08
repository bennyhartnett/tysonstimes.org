import { featureNavLinks } from "../data/pages.js";
import { sections, site } from "../data/content.js";
import { pagePath, sectionPath } from "../routing.js";

function Masthead() {
  return (
    <header className="masthead">
      <div className="kicker-row">
        <span>{site.location}</span>
        <span>Independent Local Newspaper</span>
        <span>{site.domain}</span>
      </div>
      <h1>
        <a href={pagePath("home")}>{site.name}</a>
      </h1>
      <p className="subtitle">{site.tagline}</p>
      <div className="meta-row">
        <span>{site.volume}</span>
        <span>News, Schools, Business, Culture</span>
        <span>{site.edition}</span>
      </div>
      <nav className="nav-strip" aria-label="Primary sections">
        <a href={pagePath("home")}>Front Page</a>
        {sections.map((section) => (
          <a href={sectionPath(section.id)} key={section.id}>
            {section.label}
          </a>
        ))}
        <a href={pagePath("archive")}>Archive</a>
        <a href={pagePath("events")}>Events</a>
        {featureNavLinks.map(([label, page]) => (
          <a href={pagePath(page)} key={page}>
            {label}
          </a>
        ))}
        <a href={pagePath("about")}>About</a>
      </nav>
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

export function NewspaperLayout({ children }) {
  return (
    <main className="page-shell">
      <article className="newspaper" aria-label="Tysons Times newspaper template">
        <div className="paper-content">
          <Masthead />
          {children}
          <Footer />
        </div>
      </article>
    </main>
  );
}
