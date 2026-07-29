import { EmptyArticles } from "../components/ArticleBits.jsx";
import { HoverLink } from "../components/HoverLink.jsx";
import { MiniPhoto } from "../components/Media.jsx";
import { diningPage } from "../data/pages.js";
import { useArticles } from "../data/ContentProvider.jsx";
import { sortArticles } from "../data/selectors.js";
import { articlePath } from "../routing.js";

export function DiningPage() {
  const sortedArticles = sortArticles(useArticles());
  const listings = diningPage.listings.flatMap((listing) => {
    const article = sortedArticles.find((item) => item.id === listing.articleId);
    return article ? [{ ...listing, article }] : [];
  });

  return (
    <section className="section dining-layout">
      <div>
        <h1 className="page-title">Dining Guide</h1>
        <p className="deck">A local restaurant template for neighborhood picks, openings, closings, service notes, and business-desk context.</p>
        <div className="dining-list">
          {listings.map(({ title, area, category, text, article }) => (
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
          ))}
          {!listings.length ? <EmptyArticles>No dining articles have been published yet.</EmptyArticles> : null}
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Dining Notes</h3>
          <ol>
            {diningPage.serviceNotes.map(({ title, text }) => (
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
          <p>{diningPage.tipBox}</p>
        </div>
      </aside>
    </section>
  );
}
