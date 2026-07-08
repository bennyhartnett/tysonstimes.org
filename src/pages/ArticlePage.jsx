import { HeadlineList, Tags } from "../components/ArticleBits.jsx";
import { ImagePlate } from "../components/Media.jsx";
import { getArticleById, relatedArticlesFor, sectionLabel } from "../data/selectors.js";
import { pagePath } from "../routing.js";
import { formatDate } from "../utils/format.js";

export function ArticlePage({ route }) {
  const article = route.article || getArticleById(route.articleId);
  const related = relatedArticlesFor(article);

  return (
    <section className="section article-layout">
      <article>
        <div className="eyebrow">
          {sectionLabel(article.section)} / {article.location} / {formatDate(article.date)}
        </div>
        <h2 className="article-headline">{article.title}</h2>
        <p className="deck">{article.dek}</p>
        <div className="byline">By {article.author}</div>
        <div className="article-hero">
          <ImagePlate
            article={article}
            caption={`${article.title} - monochrome newspaper photo template with visible halftone grain.`}
          />
        </div>
        <div className="article-body">
          {article.body.map((paragraph, index) => (
            <p className={index === 0 ? "dropcap" : undefined} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <Tags article={article} />
      </article>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Related Coverage</h3>
          <HeadlineList articles={related} />
        </div>
        <div className="ad-box">
          <h3>Article Template</h3>
          <p>
            This layout supports long reads, brief updates, explainers, photo essays, and recurring trackers from the same
            article data model.
          </p>
        </div>
        <a className="button" href={pagePath("archive")}>
          Search Archive
        </a>
      </aside>
    </section>
  );
}
