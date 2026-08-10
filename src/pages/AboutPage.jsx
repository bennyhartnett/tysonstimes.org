import { HoverLink } from "../components/HoverLink.jsx";
import { sections, site } from "../data/content.js";
import { pagePath, sectionPath } from "../routing.js";

export function AboutPage() {
  return (
    <>
      <section className="section long-read">
        <div>
          <h1 className="page-title">About Tysons Times</h1>
          <p className="deck">Your corner of Northern Virginia, covered.</p>
          <div className="columns">
            <p className="dropcap">Every corner has a story. Tysons Times covers the people, institutions, businesses, schools, and public decisions shaping the Tysons area.</p>
            <p>Our coverage follows Tysons, Vienna, McLean, Dunn Loring, Falls Church, Fairfax County, and the communities connected by the Silver Line.</p>
            <p>We focus on useful, clearly written local journalism: what changed, why it matters, who is responsible, and what readers should watch next.</p>
            <p>Tysons Times is independently owned and published by {site.publisher.name}, who serves as {site.publisher.role.toLowerCase()} and is responsible for publication decisions.</p>
            <p>The site does not currently run paid advertising or sponsored articles. Material relationships that could affect coverage are disclosed with the relevant story.</p>
          </div>
        </div>
        <aside className="article-tools">
          <div className="index-box">
            <h3>Coverage Area</h3>
            <ol>{site.coverageArea.map((place) => <li key={place}>{place}</li>)}</ol>
          </div>
          <HoverLink className="button" href={pagePath("archive")}>Browse the Archive</HoverLink>
          <HoverLink className="button" href={pagePath("standards")}>Read Our Standards</HoverLink>
          <HoverLink className="button" href={pagePath("contact")}>Contact the Newsroom</HoverLink>
        </aside>
      </section>
      <section className="section">
        <h2 className="section-title"><span>Our News Desks</span></h2>
        <div className="template-list">
          {sections.map((section) => (
            <article className="classified" key={section.id}>
              <h3><HoverLink href={sectionPath(section.id)}>{section.label}</HoverLink></h3>
              <p>{section.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
