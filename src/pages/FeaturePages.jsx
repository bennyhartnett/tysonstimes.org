import { HeadlineList, Tags } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { ImagePlate, MiniPhoto } from "../components/Media.jsx";
import { sections } from "../data/content.js";
import { sortedArticles, sectionLabel } from "../data/selectors.js";
import { articlePath, pagePath, sectionPath } from "../routing.js";
import { formatDate, textPreview } from "../utils/format.js";

export function BriefsPage() {
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
  const guideItems = [
    ["Public Meetings", "What is being decided, where the agenda lives, when public comment closes, and which follow-up documents matter.", "public-meeting-memory"],
    ["Getting Around", "Lane shifts, crossings, bus links, trail access, and construction timing translated into plain local language.", "commute-notes"],
    ["Weekend Planning", "A concise path through library events, school stages, volunteer drives, concerts, markets, and civic deadlines.", "weekend-calendar-built-for-residents"],
    ["Business Changes", "Openings, closings, permits, leases, menus, and storefront moves tracked with address-level context.", "small-business-notebook"],
  ];

  return (
    <section className="section guide-layout">
      <div>
        <h2 className="page-title">Guide</h2>
        <p className="deck">Practical local explainers for residents who need dates, decisions, locations, and next steps in one place.</p>
        <div className="guide-grid">
          {guideItems.map(([title, text, articleId]) => {
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
            <li>
              <HoverLink href={pagePath("events")}>Calendar and deadlines</HoverLink>
            </li>
            <li>
              <HoverLink href={sectionPath("civic")}>Civic Desk</HoverLink>
            </li>
            <li>
              <HoverLink href={sectionPath("schools")}>Schools</HoverLink>
            </li>
            <li>
              <HoverLink href={pagePath("archive")}>Search archive</HoverLink>
            </li>
          </ol>
        </div>
        <div className="ad-box">
          <h3>Reader Question</h3>
          <p>Guide pages can begin with a reader question and grow into a standing reference as reporting accumulates.</p>
        </div>
      </aside>
    </section>
  );
}

export function PhotoEssayPage() {
  const feature = sortedArticles.find((article) => article.id === "parks-trails-river-edge") || sortedArticles[0];
  const gallery = sortedArticles.slice(0, 6);

  return (
    <section className="section photo-essay-layout">
      <h2 className="page-title">Photo Essay</h2>
      <p className="deck">A visual newspaper spread for parks, storefronts, classrooms, public meetings, seasonal scenes, and neighborhood records.</p>
      <div className="photo-essay-hero">
        <ImagePlate article={feature} caption="Lead image plate for a Tysons photo essay with caption space and monochrome press texture." size="wide" />
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
  const updates = [
    ["8:15 a.m.", "Civic", "Agenda watch opens", "County and school-board agenda items are grouped for review before evening meetings.", "public-meeting-memory"],
    ["9:40 a.m.", "Roads", "Commute note added", "Transportation notices are checked for block-by-block impact, timing, and responsible agency.", "commute-notes"],
    ["11:05 a.m.", "Business", "Storefront file updated", "The business desk adds confirmed openings, closings, menu changes, and lease moves to the notebook.", "small-business-notebook"],
    ["1:30 p.m.", "Schools", "Calendar items queued", "Student events, performances, athletics, and family deadlines are sorted for the weekly school file.", "schools-fields-libraries"],
    ["3:10 p.m.", "Culture", "Weekend guide refresh", "Library talks, arts listings, local history items, and volunteer events are checked for the weekend calendar.", "weekend-calendar-built-for-residents"],
  ];

  return (
    <section className="section live-layout">
      <div>
        <h2 className="page-title">Live Updates</h2>
        <p className="deck">A running local file for developing stories, public meetings, traffic disruptions, election nights, and weather events.</p>
        <div className="live-feed">
          {updates.map(([time, label, title, text, articleId]) => {
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
            <li>Public meeting nights</li>
            <li>Election results</li>
            <li>Weather closures</li>
            <li>Traffic incidents</li>
            <li>Major civic filings</li>
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
  const lead = sortedArticles[0];
  const issueArticles = sortedArticles.slice(1, 6);
  const modules = [
    ["Morning Brief", "Top local story, traffic note, school deadline, and meeting watch in a compact daily format."],
    ["Weekend Edition", "Events, restaurants, performances, outdoor notes, and family-facing calendar items."],
    ["Civic Watch", "Agendas, votes, filings, public comment deadlines, and follow-up questions from residents."],
    ["Schools and Sports", "Student achievements, team results, stage listings, and family calendar reminders."],
  ];

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
                <option>Morning edition</option>
                <option>Weekend guide</option>
                <option>Civic alerts</option>
                <option>Schools and sports</option>
              </select>
              <button className="button" type="button">
                Join The List
              </button>
            </div>
          </form>
        </aside>
      </section>
      <section className="section">
        <h2 className="section-title">
          <span>Newsletter Modules</span>
        </h2>
        <div className="classifieds">
          {modules.map(([title, text]) => (
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
