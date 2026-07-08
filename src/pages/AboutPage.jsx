import { HoverButton, HoverLink } from "../components/HoverLink.jsx";
import { pageTypes } from "../data/pages.js";
import { articlePath, pagePath, sectionPath } from "../routing.js";
import { sortedArticles } from "../data/selectors.js";

function pathForTemplate(page) {
  if (page === "article") return articlePath(sortedArticles[0].id);
  if (page === "section") return sectionPath("local");
  return pagePath(page);
}

export function AboutPage() {
  return (
    <>
      <section className="section long-read">
        <div>
          <h2 className="page-title">About Tysons Times</h2>
          <p className="deck">An independent local newspaper template system for Tysons, Virginia.</p>
          <div className="columns">
            <p className="dropcap">Tysons Times is designed to feel like a serious black-and-white newspaper while still working as a modern article system.</p>
            <p>The structure separates presentation from content: pages share the same masthead, texture, article cards, photo treatments, search controls, and sidebars.</p>
            <p>That means the site can grow from a prototype into hundreds of articles without losing the newspaper identity that makes the front page distinctive.</p>
            <p>Future development can connect the same templates to a CMS, static-site generator, newsletter pipeline, or searchable article database.</p>
          </div>
        </div>
        <aside className="article-tools">
          <form className="search-panel">
            <h3>Subscribe Interest</h3>
            <div className="form-grid">
              <input className="subscribe-input" type="email" placeholder="email@example.com" />
              <textarea className="subscribe-textarea" placeholder="Neighborhood, coverage tip, or section interest" />
              <HoverButton className="button" type="button">
                Join The List
              </HoverButton>
            </div>
          </form>
        </aside>
      </section>
      <section className="section">
        <h2 className="section-title">
          <span>Template Library</span>
        </h2>
        <div className="template-list">
          {pageTypes.map(({ title, text, page }) => (
            <article className="classified" key={title}>
              <h3>
                <HoverLink href={pathForTemplate(page)}>{title}</HoverLink>
              </h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
