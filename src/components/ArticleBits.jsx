import { articlePath, sectionPath } from "../routing.js";
import { sectionLabel } from "../data/selectors.js";
import { formatDate, textPreview } from "../utils/format.js";
import { HoverLink } from "./HoverLink.jsx";
import { MiniPhoto } from "./Media.jsx";

export function Tags({ article }) {
  return (
    <div className="tag-row">
      <span className="tag">{sectionLabel(article.section)}</span>
      {article.tags.map((tag) => (
        <span className="tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export function HeadlineList({ articles }) {
  return (
    <ul className="headline-list">
      {articles.map((article) => (
        <li key={article.id}>
          <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
          <br />
          <span>
            {sectionLabel(article.section)} / {formatDate(article.date)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ArticleCard({ article, includeImage = true }) {
  const searchValue = `${article.title} ${article.dek} ${article.tags.join(" ")} ${article.location}`.toLowerCase();

  return (
    <article className="article-card" data-archive-card data-section={article.section} data-search={searchValue}>
      {includeImage ? (
        <a href={articlePath(article.id)} aria-label={article.title}>
          <MiniPhoto article={article} />
        </a>
      ) : null}
      <div className="meta">
        {sectionLabel(article.section)} / {article.location} / {formatDate(article.date)}
      </div>
      <h3>
        <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
      </h3>
      <p>{textPreview(article.dek)}</p>
      <Tags article={article} />
    </article>
  );
}

export function SectionIndex({ sections }) {
  return (
    <ol>
      {sections.map((section) => (
        <li key={section.id}>
          <HoverLink href={sectionPath(section.id)}>{section.label}</HoverLink>
        </li>
      ))}
    </ol>
  );
}
