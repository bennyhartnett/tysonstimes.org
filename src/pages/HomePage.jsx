import { ArticleCard, SectionIndex } from "../components/ArticleBits.jsx";
import { ImagePlate, MiniPhoto } from "../components/Media.jsx";
import { sections } from "../data/content.js";
import { sortedArticles, sectionLabel } from "../data/selectors.js";
import { articlePath } from "../routing.js";
import { formatDate, textPreview } from "../utils/format.js";

const notices = [
  ["Calendar", "Submit public meetings, school events, arts listings, fundraisers, and neighborhood gatherings for the weekly calendar."],
  ["Tips", "Send notes on traffic changes, new storefronts, civic filings, reader questions, and stories that deserve a closer look."],
  ["Corrections", "Corrections will run clearly, with the original context and the updated record kept visible to readers."],
  ["Subscribe", "A future email edition can carry the top headlines, weekend guide, public meetings, and school notes."],
  ["Business", "Restaurant openings, office moves, retail changes, and independent businesses belong on the local front page."],
  ["Opinion", "Letters should be brief, local, signed, and focused on issues that directly affect Tysons-area readers."],
  ["Archives", "Major stories will be organized by neighborhood, topic, and date so readers can follow long-running issues."],
  ["Sports", "Youth sports, school teams, recreation leagues, and seasonal results will have a standing place in the paper."],
];

export function HomePage() {
  const lead = sortedArticles[0];
  const side = sortedArticles.slice(1, 3);
  const civic = sortedArticles.filter((article) => ["civic", "business", "schools"].includes(article.section)).slice(0, 3);
  const longRead = sortedArticles.find((article) => article.id === "schools-fields-libraries") || sortedArticles[4];

  return (
    <>
      <section className="lead-grid">
        <div className="lead-story">
          <div className="lead-copy">
            <h2>
              <a href={articlePath(lead.id)}>{lead.homeTitle || lead.title}</a>
            </h2>
            <p className="deck">{lead.dek}</p>
            <div className="columns">
              {lead.body.slice(0, 4).map((paragraph, index) => (
                <p className={index === 0 ? "dropcap" : undefined} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <ImagePlate
            article={lead}
            caption="Front-page visual treatment for Tysons streets, reproduced with heavy halftone screens and visible ink rub."
          />
        </div>
        <aside className="side-stack" aria-label="Top briefs">
          {side.map((article) => (
            <div className="bulletin" key={article.id}>
              <strong>{sectionLabel(article.section)}</strong>
              <h3>
                <a href={articlePath(article.id)}>{article.title}</a>
              </h3>
              <p>{textPreview(article.dek, 190)}</p>
            </div>
          ))}
          <div className="stamp">
            <span>
              Local
              <br />
              First
              <br />
              Edition
            </span>
          </div>
        </aside>
      </section>

      <section className="section" aria-labelledby="civic-desk">
        <h2 id="civic-desk" className="section-title">
          <span>Civic Desk</span>
        </h2>
        <div className="story-grid">
          {civic.map((article) => (
            <article className="story" key={article.id}>
              <a href={articlePath(article.id)} aria-label={article.title}>
                <MiniPhoto article={article} />
              </a>
              <div className="meta">
                {sectionLabel(article.section)} / {formatDate(article.date)}
              </div>
              <h3>
                <a href={articlePath(article.id)}>{article.title}</a>
              </h3>
              <p>{textPreview(article.dek, 170)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="photo-record">
        <h2 id="photo-record" className="section-title">
          <span>Photographic Record</span>
        </h2>
        <div className="photo-band">
          <ImagePlate
            article={sortedArticles[7]}
            caption="A future photo essay space for Tysons streetscapes, parks, storefronts, school fields, and commuter edges."
            size="wide"
          />
          <aside className="quote-panel">
            <p>Local news should feel close enough to walk to.</p>
            <span>From the editor's desk</span>
          </aside>
        </div>
      </section>

      <section className="section long-read" aria-labelledby="long-feature">
        <div>
          <h2 id="long-feature">
            <a href={articlePath(longRead.id)}>{longRead.title}</a>
          </h2>
          <p className="deck">{longRead.dek}</p>
          <div className="columns">
            {longRead.body.map((paragraph, index) => (
              <p className={index === 0 ? "dropcap" : undefined} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <aside className="index-box">
          <h3>Core Coverage</h3>
          <SectionIndex sections={sections} />
        </aside>
      </section>

      <section className="section" aria-labelledby="community-notices">
        <h2 id="community-notices" className="section-title">
          <span>Community Notices</span>
        </h2>
        <div className="classifieds">
          {notices.map(([title, text]) => (
            <article className="classified" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
