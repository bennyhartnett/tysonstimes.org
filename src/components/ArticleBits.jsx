import { useEffect, useId, useState } from "react";
import { articlePath, pagePath, sectionPath } from "../routing.js";
import { sectionLabel } from "../data/selectors.js";
import { formatDate, textPreview } from "../utils/format.js";
import { HoverLink } from "./HoverLink.jsx";
import { MiniPhoto } from "./Media.jsx";

export function Tags({ article }) {
  return (
    <div className="tag-row">
      <HoverLink className="tag" href={sectionPath(article.section)}>{sectionLabel(article.section)}</HoverLink>
      {article.tags.map((tag) => (
        <HoverLink className="tag" href={`${pagePath("archive")}?q=${encodeURIComponent(tag)}`} key={tag}>
          {tag}
        </HoverLink>
      ))}
    </div>
  );
}

export function HeadlineList({ articles, pageSize }) {
  const [page, setPage] = useState(1);
  const listId = useId();
  const paginationEnabled = Number.isInteger(pageSize) && pageSize > 0;
  const effectivePageSize = paginationEnabled ? pageSize : Math.max(articles.length, 1);
  const totalPages = Math.max(1, Math.ceil(articles.length / effectivePageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * effectivePageSize;
  const visibleArticles = articles.slice(startIndex, startIndex + effectivePageSize);

  useEffect(() => {
    setPage(1);
  }, [articles]);

  if (!articles.length) return <EmptyArticles />;

  return (
    <>
      <ul className="headline-list" id={listId}>
        {visibleArticles.map((article) => (
          <li key={article.id}>
            <HoverLink href={articlePath(article.id)}>{article.title}</HoverLink>
            <br />
            <span>
              {sectionLabel(article.section)} / {formatDate(article.date)}
            </span>
          </li>
        ))}
      </ul>
      {paginationEnabled && totalPages > 1 ? (
        <nav className="index-pagination" aria-label="Section index pages">
          <p className="index-pagination-status" aria-live="polite">
            {startIndex + 1}–{Math.min(startIndex + effectivePageSize, articles.length)} of {articles.length}
          </p>
          <div className="index-pagination-actions">
            <button
              type="button"
              aria-controls={listId}
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </button>
            <span aria-hidden="true">{currentPage} / {totalPages}</span>
            <button
              type="button"
              aria-controls={listId}
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Next
            </button>
          </div>
        </nav>
      ) : null}
    </>
  );
}

export function EmptyArticles({ children = "No articles have been published in this category yet." }) {
  return <p className="empty-articles" role="status">{children}</p>;
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
