import { HoverLink } from "../components/HoverLink.jsx";
import { MiniPhoto } from "../components/Media.jsx";
import { sortedArticles } from "../data/selectors.js";
import { articlePath } from "../routing.js";

export function DiningPage() {
  const listings = [
    ["Tysons Lunch File", "Tysons", "Lunch / Casual", "A compact module for weekday lunch picks, quick service notes, and verified hours.", "small-business-notebook"],
    ["Beltway Dinner Watch", "Tysons", "Dinner / Openings", "Track new menus, reservation changes, patios, and restaurant projects near the Beltway.", "tysons-growth-watch"],
    ["Coffee and Bakeries", "Tysons Area", "Morning / Cafe", "A reusable card for cafes, bakeries, counters, and neighborhood meeting spots.", "small-business-notebook"],
    ["Family Tables", "Tysons Area", "Weekend / Family", "Reader-facing notes on kid-friendly seating, parking, noise, and easy group meals.", "weekend-calendar-built-for-residents"],
    ["Date-Night File", "Northern Fairfax", "Evening / Guide", "A more selective guide format for service, atmosphere, dress, and reservation context.", "parks-trails-river-edge"],
    ["Restaurant Changes", "Tysons and Nearby Corridors", "Notebook / Business", "A standing slot for closings, moves, leases, permits, and ownership changes.", "small-business-notebook"],
  ];
  const serviceNotes = [
    ["Openings", "Confirmed restaurant launches and first-week service notes."],
    ["Closings", "Last-day notices, relocation details, and follow-up reporting."],
    ["Patios", "Outdoor seating, shade, weather limits, and reservation rules."],
    ["Takeout", "Counter-service, pickup windows, family meals, and delivery notes."],
  ];

  return (
    <section className="section dining-layout">
      <div>
        <h2 className="page-title">Dining Guide</h2>
        <p className="deck">A local restaurant template for neighborhood picks, openings, closings, service notes, and business-desk context.</p>
        <div className="dining-list">
          {listings.map(([title, area, category, text, articleId]) => {
            const article = sortedArticles.find((item) => item.id === articleId) || sortedArticles[0];
            return (
              <article className="dining-card" key={title}>
                <MiniPhoto article={article} />
                <div className="dining-copy">
                  <div className="meta">
                    {area} / {category}
                  </div>
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
          <h3>Dining Notes</h3>
          <ol>
            {serviceNotes.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <br />
                {text}
              </li>
            ))}
          </ol>
        </div>
        <div className="ad-box">
          <h3>Submit a Tip</h3>
          <p>Restaurant openings, menu changes, permit activity, and closing notices belong in the small-business notebook before they become guide entries.</p>
        </div>
      </aside>
    </section>
  );
}
