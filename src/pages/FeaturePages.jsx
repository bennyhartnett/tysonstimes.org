import { HeadlineList, Tags } from "../components/ArticleBits.jsx";
import { HoverButton, HoverLink } from "../components/HoverLink.jsx";
import { ImagePlate, MiniPhoto } from "../components/Media.jsx";
import { sections } from "../data/content.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { featurePages } from "../data/pages.js";
import { sectionLabel, sortArticles } from "../data/selectors.js";
import { articlePath, pagePath, sectionPath } from "../routing.js";
import { formatDate, textPreview } from "../utils/format.js";

function fixtureLinkHref(link) {
  if (link.section) return sectionPath(link.section);
  if (link.page) return pagePath(link.page);
  return link.href || pagePath("home");
}

export function BriefsPage() {
  const sortedArticles = sortArticles(useArticles());
  const briefs = sortedArticles.slice(0, 10);
  const sectionCounts = sections.map((section) => [
    section,
    sortedArticles.filter((article) => article.section === section.id).length,
  ]);

  return (
    <section className="section briefs-layout">
      <div>
        <h2 className="page-title">Briefs</h2>
        <p className="deck">Short verified items from across Tysons, built for quick reading without losing source context.</p>
        <div className="brief-list">
          {briefs.map((article, index) => (
            <article className="brief-item" key={article.id}>
              <div className="brief-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <div className="meta">
                  {sectionLabel(article.section)} / {article.location} / {formatDate(article.date)}
                </div>
                <h3>
                  <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
                </h3>
                <p>{textPreview(article.dek, 220)}</p>
                <Tags article={article} />
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Brief Categories</h3>
          <ol>
            {sectionCounts.map(([section, count]) => (
              <li key={section.id}>
                <HoverLink href={sectionPath(section.id)}>{section.label}</HoverLink> ({count})
              </li>
            ))}
          </ol>
        </div>
        <div className="ad-box">
          <h3>Submit a Tip</h3>
          <p>Send concise notes on road changes, school items, public filings, storefront updates, and weekend notices for editorial review.</p>
        </div>
      </aside>
    </section>
  );
}

export function GuidePage() {
  const sortedArticles = sortArticles(useArticles());
  return (
    <section className="section guide-layout">
      <div>
        <h2 className="page-title">Guide</h2>
        <p className="deck">Practical local explainers for residents who need dates, decisions, locations, and next steps in one place.</p>
        <div className="guide-grid">
          {featurePages.guide.items.map(({ title, text, articleId }) => {
            const article = sortedArticles.find((item) => item.id === articleId) || sortedArticles[0];
            return (
              <article className="guide-card" key={title}>
                <div className="meta">
                  {sectionLabel(article.section)} / {formatDate(article.date)}
                </div>
                <h3>
                  <HoverLink href={articlePath(article.id)}>{title}</HoverLink>
                </h3>
                <p>{text}</p>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Resident Links</h3>
          <ol>
            {featurePages.guide.residentLinks.map((link) => (
              <li key={link.label}>
                <HoverLink href={fixtureLinkHref(link)}>{link.label}</HoverLink>
              </li>
            ))}
          </ol>
        </div>
        <div className="ad-box">
          <h3>Reader Question</h3>
          <p>{featurePages.guide.readerQuestion}</p>
        </div>
      </aside>
    </section>
  );
}

export function PhotoEssayPage() {
  const sortedArticles = sortArticles(useArticles());
  const feature = sortedArticles.find((article) => article.id === featurePages.photoEssay.featureArticleId) || sortedArticles[0];
  const gallery = sortedArticles.slice(0, featurePages.photoEssay.galleryLimit);

  return (
    <section className="section photo-essay-layout">
      <h2 className="page-title">Photo Essay</h2>
      <p className="deck">A visual newspaper spread for parks, storefronts, classrooms, public meetings, seasonal scenes, and neighborhood records.</p>
      <div className="photo-essay-hero">
        <ImagePlate article={feature} caption={featurePages.photoEssay.heroCaption} size="wide" />
      </div>
      <div className="columns">
        {feature.body.map((paragraph, index) => (
          <p className={index === 0 ? "dropcap" : undefined} key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
      <div className="photo-essay-grid">
        {gallery.map((article) => (
          <article className="photo-tile" key={article.id}>
            <a href={articlePath(article.id)} aria-label={article.title}>
              <MiniPhoto article={article} />
            </a>
            <div className="meta">
              {sectionLabel(article.section)} / {article.location}
            </div>
            <h3>
              <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
            </h3>
            <p>{textPreview(article.dek, 130)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LivePage() {
  const sortedArticles = sortArticles(useArticles());
  return (
    <section className="section live-layout">
      <div>
        <h2 className="page-title">Live Updates</h2>
        <p className="deck">A running local file for developing stories, public meetings, traffic disruptions, election nights, and weather events.</p>
        <div className="live-feed">
          {featurePages.live.updates.map(({ time, label, title, text, articleId }) => {
            const article = sortedArticles.find((item) => item.id === articleId) || sortedArticles[0];
            return (
              <article className="live-update" key={`${time}-${title}`}>
                <div className="live-time">
                  {time}
                  <span>{label}</span>
                </div>
                <div>
                  <h3>
                    <HoverLink href={articlePath(article.id)}>{title}</HoverLink>
                  </h3>
                  <p>{text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Live File Uses</h3>
          <ol>
            {featurePages.live.fileUses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <HoverLink className="button" href={pagePath("archive")}>
          Search Background
        </HoverLink>
      </aside>
    </section>
  );
}

export function NewsletterPage() {
  const sortedArticles = sortArticles(useArticles());
  const lead = sortedArticles[0];
  const issueArticles = sortedArticles.slice(1, 6);

  return (
    <>
      <section className="section newsletter-layout">
        <div className="newsletter-preview">
          <div className="eyebrow">Email Edition / Tysons Morning</div>
          <h2>{lead.title}</h2>
          <p className="deck">{lead.dek}</p>
          <ol className="newsletter-list">
            {issueArticles.map((article) => (
              <li key={article.id}>
                <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
                <span>
                  {sectionLabel(article.section)} / {formatDate(article.date)}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <aside className="article-tools">
          <form className="search-panel">
            <h3>Subscribe Interest</h3>
            <div className="form-grid">
              <input className="subscribe-input" type="email" placeholder="email@example.com" />
              <select className="section-select">
                {featurePages.newsletter.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <HoverButton className="button" type="button">
                Join The List
              </HoverButton>
            </div>
          </form>
        </aside>
      </section>
      <section className="section">
        <h2 className="section-title">
          <span>Newsletter Modules</span>
        </h2>
        <div className="classifieds">
          {featurePages.newsletter.modules.map(({ title, text }) => (
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
