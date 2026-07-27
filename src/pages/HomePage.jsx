import { ArticleCard, SectionIndex } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { ImagePlate, MiniPhoto } from "../components/Media.jsx";
import { sections } from "../data/content.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { homePage } from "../data/pages.js";
import { sectionLabel, sortArticles } from "../data/selectors.js";
import { articlePath } from "../routing.js";
import { formatDate, textPreview } from "../utils/format.js";

export function HomePage() {
  const sortedArticles = sortArticles(useArticles());
  const lead = sortedArticles[0];
  const side = sortedArticles.slice(1, 3);
  const civic = sortedArticles
    .filter((article) => homePage.civicSections.includes(article.section))
    .slice(0, homePage.civicLimit);
  const longRead = sortedArticles.find((article) => article.id === homePage.longReadArticleId) || sortedArticles[4];
  const photoRecord = sortedArticles.find((article) => article.id === homePage.photoRecord.articleId) || sortedArticles[7] || lead;

  return (
    <>
      <section className="lead-grid">
        <div className="lead-story">
          <div className="lead-copy">
            <h2>
              <HoverLink href={articlePath(lead.id)}>{lead.homeTitle || lead.title}</HoverLink>
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
            caption={homePage.leadCaption}
            priority
          />
        </div>
        <aside className="side-stack" aria-label="Top briefs">
          {side.map((article) => (
            <div className="bulletin" key={article.id}>
              <strong>{sectionLabel(article.section)}</strong>
              <h3>
                <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
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
                <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
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
            article={photoRecord}
            caption={homePage.photoRecord.caption}
            size="wide"
          />
          <aside className="quote-panel">
            <p>{homePage.quotePanel.text}</p>
            <span>{homePage.quotePanel.attribution}</span>
          </aside>
        </div>
      </section>

      <section className="section long-read" aria-labelledby="long-feature">
        <div>
          <h2 id="long-feature">
            <HoverLink href={articlePath(longRead.id)}>{longRead.title}</HoverLink>
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
          {homePage.notices.map(({ title, text }) => (
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
