import { HoverLink } from "../components/HoverLink.jsx";
import { MiniPhoto } from "../components/Media.jsx";
import { useArticles } from "../data/ContentProvider.jsx";
import { articlePath, pagePath, sectionPath } from "../routing.js";
import { sectionLabel, sortArticles } from "../data/selectors.js";
import { formatDate, textPreview } from "../utils/format.js";

function StoryLink({ article, children }) {
  return <HoverLink href={articlePath(article.id)}>{children || article.title}</HoverLink>;
}

function Byline({ article, showDate = false }) {
  return (
    <small className="home-byline">
      By {article.author || "Tysons Times Staff"}{showDate ? ` · ${formatDate(article.date)}` : ""}
    </small>
  );
}

function ImageStory({ article, className = "" }) {
  return (
    <article className={className}>
      <a className="home-image-link" href={articlePath(article.id)} aria-label={article.title}>
        <MiniPhoto article={article} />
      </a>
      <span className="home-eyebrow">{sectionLabel(article.section)}</span>
      <h3><StoryLink article={article} /></h3>
      <p>{textPreview(article.dek, 170)}</p>
    </article>
  );
}

function SectionHeading({ title, href, linkLabel }) {
  return (
    <div className="home-section-heading">
      <h2>{title}</h2>
      {href ? <HoverLink href={href}>{linkLabel || "More stories"} <span aria-hidden="true">›</span></HoverLink> : null}
    </div>
  );
}

export function HomePage() {
  const articles = sortArticles(useArticles());
  const lead = articles[0];
  const secondary = articles.slice(1, 3);
  const center = articles[3];
  const opinion = articles.filter((article) => article.section === "opinion");
  const opinionRail = [...opinion, ...articles.filter((article) => article.section === "civic")].slice(0, 4);
  const mostRead = articles.slice(4, 9);
  const regional = articles.filter((article) => ["local", "civic"].includes(article.section)).slice(2, 7);
  const moreStories = articles.slice(9, 13);
  const latest = articles.slice(0, 6);
  const schools = articles.filter((article) => article.section === "schools").slice(0, 5);
  const business = articles.filter((article) => article.section === "business").slice(0, 4);
  const culture = articles.filter((article) => article.section === "culture").slice(0, 3);

  if (!lead) return null;

  return (
    <>
      <section className="home-top-package">
        <article className="home-lead-copy">
          <span className="home-eyebrow">{sectionLabel(lead.section)}</span>
          <h1><StoryLink article={lead}>{lead.homeTitle || lead.title}</StoryLink></h1>
          <p>{lead.dek}</p>
          <Byline article={lead} showDate />
        </article>

        <figure className="home-lead-visual">
          <a href={articlePath(lead.id)} aria-label={lead.title}>
            <MiniPhoto
              article={lead}
              priority
              sizes="(max-width: 600px) calc(100vw - 24px), (max-width: 850px) 58vw, 540px"
            />
          </a>
          <figcaption>{lead.hero?.caption || `${lead.location} · Tysons Times`}</figcaption>
        </figure>

        <aside className="home-opinions" aria-label="Opinion and analysis">
          <h2 className="home-rail-title">Opinions <span aria-hidden="true">›</span></h2>
          {opinionRail.map((article) => (
            <article className="home-opinion-item" key={article.id}>
              <span>{article.author || "Tysons Times Staff"}</span>
              <h3><StoryLink article={article} /></h3>
            </article>
          ))}
        </aside>
      </section>

      <section className="home-secondary-package">
        <div className="home-story-stack">
          {secondary.map((article) => (
            <article key={article.id}>
              <span className="home-eyebrow">{sectionLabel(article.section)}</span>
              <h2><StoryLink article={article} /></h2>
              <p>{textPreview(article.dek, 165)}</p>
              <Byline article={article} />
            </article>
          ))}
        </div>

        <div className="home-center-stories">
          <ImageStory article={center} className="home-center-feature" />
          <div className="home-two-up">
            {articles.slice(13, 15).map((article) => (
              <article key={article.id}>
                <h3><StoryLink article={article} /></h3>
                <small>{formatDate(article.date)}</small>
              </article>
            ))}
          </div>
        </div>

        <aside className="home-most-read">
          <h2>More to Read</h2>
          {mostRead.map((article, index) => (
            <a href={articlePath(article.id)} key={article.id}>
              <b>{index + 1}</b>
              <span>{article.title}</span>
            </a>
          ))}
        </aside>
      </section>

      <section className="home-category">
        <SectionHeading title="D.C., Md. & Va." href={sectionPath("local")} linkLabel="More local news" />
        <div className="home-category-grid">
          <ImageStory article={regional[0]} className="home-category-lead" />
          <div className="home-headline-list">
            {regional.slice(1).map((article) => (
              <article key={article.id}>
                <span>{article.location}</span>
                <h3><StoryLink article={article} /></h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-more-stories">
        <SectionHeading title="More Top Stories" />
        <div className="home-four-grid">
          {moreStories.map((article) => <ImageStory article={article} key={article.id} />)}
        </div>
      </section>

      <section className="home-briefing-band">
        <div>
          <span>THE TYSONS BRIEFING</span>
          <h2>See what’s coming around the corner.</h2>
          <p>What changed, who decided, and what it means for Northern Virginia next.</p>
        </div>
        <HoverLink href={pagePath("briefs")}>Read the briefing</HoverLink>
      </section>

      <section className="home-latest-stream">
        <SectionHeading title="Latest from Tysons Times" href={pagePath("archive")} linkLabel="View all" />
        {latest.map((article) => (
          <a href={articlePath(article.id)} key={article.id}>
            <time>{formatDate(article.date)}</time>
            <h3>{article.title}</h3>
            <span aria-hidden="true">›</span>
          </a>
        ))}
      </section>

      {schools.length ? (
        <section className="home-category home-compact-section">
          <SectionHeading title="Schools & Education" href={sectionPath("schools")} linkLabel="More schools" />
          <div className="home-compact-grid">
            <ImageStory article={schools[0]} className="home-compact-lead" />
            <div className="home-compact-list">
              {schools.slice(1).map((article) => (
                <a href={articlePath(article.id)} key={article.id}>{article.title}</a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {business.length ? (
        <section className="home-four-column">
          <SectionHeading title="Business & Development" href={sectionPath("business")} linkLabel="More business" />
          <div className="home-four-grid home-four-grid--text">
            {business.map((article) => (
              <article key={article.id}>
                <span>{article.location}</span>
                <h3><StoryLink article={article} /></h3>
                <p>{textPreview(article.dek, 135)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {culture.length ? (
        <section className="home-visual-section">
          <SectionHeading title="Culture & Things to Do" href={sectionPath("culture")} linkLabel="More culture" />
          <div className="home-visual-grid">
            {culture.map((article) => <ImageStory article={article} key={article.id} />)}
          </div>
        </section>
      ) : null}

      <section className="home-newsletter">
        <div>
          <b>Independent by design</b>
          <h2>Every corner has a story.</h2>
          <p>Your corner of Northern Virginia, covered—from Tysons to the Silver Line.</p>
        </div>
        <HoverLink href={pagePath("about")}>Our mission</HoverLink>
      </section>
    </>
  );
}
