import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sections, site } from "../src/data/content.js";
import articleIndex from "../src/generated/article-index.json" with { type: "json" };
import { pageTitles } from "../src/data/pages.js";
import {
  absoluteUrl,
  articleCleanPath,
  buildRouteMeta,
  indexedPages,
  pageCleanPath,
  pageDescriptions,
  sectionCleanPath,
  siteOrigin,
} from "../src/seo.js";
import { relatedArticlesFor, sectionLabel, sortArticles } from "../src/data/selectors.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");
const fullArticles = JSON.parse(await readFile(path.join(rootDir, ".cache", "content", "articles-full.json"), "utf8"));
const fullArticleMap = new Map(fullArticles.map((article) => [article.id, article]));
const articles = articleIndex;
const sortedArticles = sortArticles(articles);
const feedArticles = sortedArticles.slice(0, 100);
const llmIndexArticles = sortedArticles.slice(0, 100);

const generatedFiles = ["robots.txt", "sitemap.xml", "feed.xml", "llms.txt", "llms-full.txt"];
const retiredGeneratedDirs = [
  "classifieds",
  "dining",
  "election",
  "events",
  "guide",
  "investigations",
  "live",
  "newsletter",
  "obituaries",
  "photo-essay",
];
const generatedDirs = [
  "articles",
  "sections",
  ...retiredGeneratedDirs,
  ...indexedPages.map((page) => pageCleanPath(page).replace(/^\/|\/$/g, "")),
].filter(Boolean);

function assertInsidePublic(target) {
  const relative = path.relative(publicDir, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside public/: ${target}`);
  }
}

async function removeGenerated(relativePath) {
  const target = path.resolve(publicDir, relativePath);
  assertInsidePublic(target);
  await rm(target, { recursive: true, force: true });
}

async function writePublic(relativePath, content) {
  const target = path.resolve(publicDir, relativePath);
  assertInsidePublic(target);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${content.trim().replace(/[ \t]+$/gm, "")}\n`, "utf8");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

function safeJsonLd(value) {
  return JSON.stringify(value, null, 2).replaceAll("<", "\\u003c");
}

function formatDisplayDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(`${value}T12:00:00-04:00`),
  );
}

function rssDate(value) {
  return new Date(`${value}T12:00:00-04:00`).toUTCString();
}

function latestDateForArticles(items) {
  return [...items].map((item) => item.date).sort().at(-1) || sortedArticles[0].date;
}

function staticNav() {
  const pageLinks = indexedPages.map((page) => ({
    label: pageTitles[page] || page,
    href: pageCleanPath(page),
  }));
  const sectionLinks = sections.map((section) => ({
    label: section.label,
    href: sectionCleanPath(section.id),
  }));

  return [...sectionLinks, ...pageLinks]
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");
}

function appHashForPage(page) {
  return page === "home" ? "/#/" : `/#/${page}`;
}

function appHashForArticle(article) {
  return `/#/article/${encodeURIComponent(article.id)}`;
}

function appHashForSection(section) {
  return `/#/section/${encodeURIComponent(section.id)}`;
}

function articleList(items, heading = "Related coverage") {
  if (!items.length) return "";

  return `
    <section class="content-block">
      <h2>${escapeHtml(heading)}</h2>
      <ol class="story-list">
        ${items
          .map(
            (article) => `
              <li>
                <a href="${escapeHtml(articleCleanPath(article.id))}">${escapeHtml(article.title)}</a>
                <p>${escapeHtml(article.dek)}</p>
                <span>${escapeHtml(sectionLabel(article.section))} / ${escapeHtml(article.location)} / ${escapeHtml(formatDisplayDate(article.date))}</span>
              </li>
            `,
          )
          .join("")}
      </ol>
    </section>
  `;
}

function layout(meta, body, appHref) {
  const isArticle = meta.type === "article";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta name="keywords" content="${escapeHtml(meta.keywords)}" />
    <meta name="author" content="${escapeHtml(site.name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="geo.region" content="${escapeHtml(site.region)}" />
    <meta name="geo.placename" content="${escapeHtml(site.location)}" />
    <meta name="geo.position" content="${escapeHtml(site.latitude)};${escapeHtml(site.longitude)}" />
    <meta name="ICBM" content="${escapeHtml(site.latitude)}, ${escapeHtml(site.longitude)}" />
    <meta property="og:site_name" content="${escapeHtml(site.name)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="${escapeHtml(meta.type)}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}" />
    ${isArticle ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" />` : ""}
    ${isArticle ? `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}" />` : ""}
    ${isArticle ? `<meta property="article:section" content="${escapeHtml(meta.section)}" />` : ""}
    <meta name="twitter:card" content="${meta.imageUrl ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    ${meta.imageUrl ? `<meta name="twitter:image" content="${escapeHtml(meta.imageUrl)}" />` : ""}
    ${meta.imageAlt ? `<meta name="twitter:image:alt" content="${escapeHtml(meta.imageAlt)}" />` : ""}
    ${meta.imageUrl ? `<meta property="og:image" content="${escapeHtml(meta.imageUrl)}" />` : ""}
    ${meta.imageAlt ? `<meta property="og:image:alt" content="${escapeHtml(meta.imageAlt)}" />` : ""}
    <link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />
    <link rel="preconnect" href="https://bennyhartnett.github.io" crossorigin />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Tysons Times RSS" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="Tysons Times LLM index" />
    <script id="structured-data" type="application/ld+json">${safeJsonLd(meta.structuredData)}</script>
    <style>
      :root { color-scheme: light; font-family: Georgia, "Times New Roman", serif; background: #f5f2ea; color: #151515; }
      body { margin: 0; }
      a { color: inherit; text-decoration-thickness: 0.08em; text-underline-offset: 0.18em; }
      .shell { width: min(980px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 44px; }
      .masthead { position: relative; border-bottom: 3px double #151515; padding: 18px 0; margin-bottom: 28px; background: #f5f2ea; text-align: center; }
      .masthead-compact { position: fixed; top: 0; right: 0; left: 0; z-index: 30; display: flex; height: 52px; align-items: center; justify-content: center; color: #151515; background: #f5f2ea; box-shadow: 0 1px 0 #c7c1b6, 0 10px 28px rgba(21, 21, 21, 0.1); opacity: 0; pointer-events: none; font-size: 28px; font-weight: 700; line-height: 1; text-decoration: none; transform: translate3d(0, -105%, 0) scale(0.96); visibility: hidden; transition: transform 220ms cubic-bezier(0.2, 0.75, 0.25, 1), opacity 160ms ease, visibility 0s linear 220ms; will-change: transform, opacity; }
      .masthead.is-condensed .masthead-compact { opacity: 1; pointer-events: auto; transform: translate3d(0, 0, 0) scale(1); visibility: visible; transition-delay: 0s; }
      .masthead-compact-accent { color: #0b57c7; }
      .kicker { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; font: 700 12px/1.3 Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em; }
      h1 { font-size: clamp(36px, 8vw, 76px); line-height: 0.95; margin: 12px 0 8px; letter-spacing: 0; }
      h2 { font-size: 24px; margin-top: 28px; }
      .subtitle, .deck { font-size: 18px; line-height: 1.45; }
      .static-nav { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 16px; border-top: 1px solid #151515; padding-top: 14px; margin-top: 16px; font: 700 13px/1.2 Arial, sans-serif; text-transform: uppercase; }
      .content { font-size: 18px; line-height: 1.58; }
      .eyebrow, .meta, .story-list span, footer { font: 700 12px/1.4 Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.06em; }
      .key-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; border: 1px solid #151515; padding: 16px; }
      .key-facts div { border-top: 1px solid #151515; padding-top: 8px; }
      .key-facts dt { font: 700 12px/1.2 Arial, sans-serif; text-transform: uppercase; }
      .key-facts dd { margin: 4px 0 0; }
      .story-list { padding-left: 22px; }
      .story-list li { margin: 0 0 18px; }
      .story-list p { margin: 4px 0; }
      .content-block { border-top: 2px solid #151515; margin-top: 30px; padding-top: 8px; }
      .article-photo { margin: 24px 0; border: 1px solid #151515; }
      .article-photo picture, .article-photo img { display: block; width: 100%; }
      .article-photo img { height: auto; filter: grayscale(1) contrast(1.12); }
      .article-photo figcaption { border-top: 1px solid #151515; padding: 8px 10px; font: 700 12px/1.35 Arial, sans-serif; text-transform: uppercase; }
      .article-photo figcaption span { display: block; margin-top: 4px; font-size: 11px; }
      .article-text h2, .article-text h3 { font-family: Arial, sans-serif; line-height: 1; text-transform: uppercase; }
      .article-text blockquote { margin: 24px 0; border-top: 4px solid #151515; border-bottom: 1px solid #151515; padding: 14px 0; font-size: 22px; font-weight: 700; }
      .article-inline-image { margin: 24px 0; border: 1px solid #151515; }
      .article-inline-image picture, .article-inline-image img { display: block; width: 100%; height: auto; }
      .article-inline-image figcaption { border-top: 1px solid #151515; padding: 8px 10px; font: 700 12px/1.35 Arial, sans-serif; text-transform: uppercase; }
      .article-inline-image figcaption span { display: block; margin-top: 4px; font-size: 11px; }
      .open-app { display: inline-block; margin-top: 18px; border: 1px solid #151515; padding: 9px 12px; font: 700 13px/1 Arial, sans-serif; text-transform: uppercase; text-decoration: none; }
      footer { border-top: 3px double #151515; margin-top: 36px; padding-top: 14px; display: flex; gap: 12px; flex-wrap: wrap; justify-content: space-between; }
      @keyframes static-masthead-exit { from { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } to { opacity: 0.35; transform: translate3d(0, -10px, 0) scale(0.86); } }
      @supports (animation-timeline: scroll()) { .masthead-full { animation: static-masthead-exit linear both; animation-range: 0 128px; animation-timeline: scroll(root block); transform-origin: center; } }
      @media (max-width: 600px) { .masthead-compact { font-size: 24px; } }
      @media (prefers-reduced-motion: reduce) { .masthead-full { animation: none; } .masthead-compact { transition: none; will-change: auto; } }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="masthead">
        <a class="masthead-compact" href="/" aria-label="${escapeHtml(site.name)}">
          <span>Tysons&nbsp;</span><span class="masthead-compact-accent">Times</span>
        </a>
        <div class="masthead-full">
          <div class="kicker">
            <span>${escapeHtml(site.location)}</span>
            <span>Independent Local Newspaper</span>
            <span>${escapeHtml(site.domain)}</span>
          </div>
          <h1><a href="/">${escapeHtml(site.name)}</a></h1>
          <p class="subtitle">${escapeHtml(site.tagline)}</p>
          <nav class="static-nav" aria-label="Static site index">${staticNav()}</nav>
        </div>
      </header>
      <main class="content">
        ${body}
        <a class="open-app" href="${escapeHtml(appHref)}">Open interactive edition</a>
      </main>
      <footer>
        <span>${escapeHtml(site.footer)}</span>
        <span><a href="/sitemap.xml">Sitemap</a> / <a href="/llms.txt">LLM index</a> / <a href="/feed.xml">RSS</a></span>
      </footer>
    </div>
    <script>
      (() => {
        const header = document.querySelector(".masthead");
        if (!header) return;

        const mastheadLogo = header.querySelector("h1");
        if (mastheadLogo && "IntersectionObserver" in window) {
          const observer = new IntersectionObserver(
            ([entry]) => header.classList.toggle("is-condensed", !entry.isIntersecting),
            { rootMargin: "-52px 0px 0px", threshold: 0 },
          );
          observer.observe(mastheadLogo);
        } else {
          const update = () => header.classList.toggle("is-condensed", window.scrollY > 112);
          update();
          window.addEventListener("scroll", update, { passive: true });
        }
      })();
    </script>
  </body>
</html>`;
}

function staticPicture(image, className = "article-photo") {
  if (!image) return "";
  return `<figure class="${className}">
    <picture>
      <source type="image/webp" srcset="${escapeHtml(image.srcSet)}" sizes="(max-width: 980px) 100vw, 920px" />
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" />
    </picture>
    <figcaption>${escapeHtml(image.caption)} <span>Photo: ${escapeHtml(image.credit)}</span></figcaption>
  </figure>`;
}

function renderArticlePage(article) {
  const fullArticle = fullArticleMap.get(article.id) || article;
  const metaArticle = { ...article, body: fullArticle.body };
  const meta = buildRouteMeta({ page: "article", article: metaArticle });
  const related = relatedArticlesFor(article, 5, sortedArticles);
  const body = `
    <article>
      <div class="eyebrow">${escapeHtml(sectionLabel(article.section))} / ${escapeHtml(article.location)} / ${escapeHtml(formatDisplayDate(article.date))}</div>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="deck">${escapeHtml(article.dek)}</p>
      <p class="meta">By ${escapeHtml(article.author)}</p>
      ${staticPicture(article.hero)}
      <dl class="key-facts">
        <div><dt>Coverage area</dt><dd>${escapeHtml(article.location)}</dd></div>
        <div><dt>Section</dt><dd>${escapeHtml(sectionLabel(article.section))}</dd></div>
        <div><dt>Published</dt><dd>${escapeHtml(formatDisplayDate(article.date))}</dd></div>
        <div><dt>Topics</dt><dd>${escapeHtml(article.tags.join(", "))}</dd></div>
      </dl>
      <section class="content-block article-text">
        <h2>Article Text</h2>
        ${fullArticle.bodyHtml}
      </section>
      ${articleList(related)}
    </article>
  `;

  return layout(meta, body, appHashForArticle(article));
}

function renderSectionPage(section) {
  const meta = buildRouteMeta({ page: "section", section });
  const sectionArticles = sortedArticles.filter((article) => article.section === section.id);
  const body = `
    <section>
      <h1>${escapeHtml(section.label)} News</h1>
      <p class="deck">${escapeHtml(section.description)}</p>
      <dl class="key-facts">
        <div><dt>Local focus</dt><dd>${escapeHtml(site.coverageArea.join(", "))}</dd></div>
        <div><dt>Article count</dt><dd>${sectionArticles.length}</dd></div>
        <div><dt>Latest update</dt><dd>${escapeHtml(formatDisplayDate(latestDateForArticles(sectionArticles)))}</dd></div>
      </dl>
      ${articleList(sectionArticles, `${section.label} stories`)}
    </section>
  `;

  return layout(meta, body, appHashForSection(section));
}

function articlesForStaticPage(page) {
  if (page === "archive") return sortedArticles;
  if (page === "briefs") return sortedArticles.slice(0, 10);
  if (page === "guide") return sortedArticles.filter((article) => ["civic", "business", "culture", "schools"].includes(article.section));
  if (page === "investigations") return sortedArticles.filter((article) => ["civic", "business"].includes(article.section));
  if (page === "dining") return sortedArticles.filter((article) => article.section === "business" || article.tags.includes("restaurants"));
  if (page === "election") return sortedArticles.filter((article) => article.section === "civic");
  if (page === "photo") return sortedArticles.filter((article) => ["culture", "local", "schools"].includes(article.section));
  if (page === "live") return sortedArticles.filter((article) => ["civic", "business", "schools", "culture"].includes(article.section)).slice(0, 6);
  if (page === "newsletter") return sortedArticles.slice(0, 6);
  if (page === "corrections") return sortedArticles.slice(0, 4);
  return sortedArticles.slice(0, 6);
}

function staticPolicyBody(page) {
  const publisher = escapeHtml(site.publisher.name);
  const contactUrl = escapeHtml(site.publisher.publicContactUrl);

  if (page === "about") return `
    <section class="content-block">
      <h2>Independent local publication</h2>
      <p>${publisher}, ${escapeHtml(site.publisher.role)}, independently owns and publishes Tysons Times. The publication focuses on verified civic, school, business, transportation, cultural, and neighborhood reporting across Northern Fairfax County.</p>
      <h2>Editorial independence</h2>
      <p>Tysons Times does not publish paid advertising or sponsored articles. Any material relationship that could affect coverage should be disclosed with the article.</p>
      <p><a href="${pageCleanPath("standards")}">Read the editorial standards</a> or <a href="${pageCleanPath("contact")}">contact the newsroom</a>.</p>
    </section>`;

  if (page === "standards") return `
    <section class="content-block">
      <h2>Verification and sourcing</h2><p>Names, dates, quotations, statistics, and material claims should be checked against primary documents, direct interviews, official records, or clearly identified reporting. Automated tools are never treated as sources.</p>
      <h2>Corrections and updates</h2><p>Material errors are corrected promptly in the article and recorded on the corrections page. Clarifications explain meaningful changes in context.</p>
      <h2>Automation and AI</h2><p>Automated tools may assist research organization and drafting, but a human editor is responsible for publication decisions and factual verification. AI-created images are labeled in their credits.</p>
      <h2>Bylines and accountability</h2><p>A named byline identifies the reporter when appropriate. The Tysons Times Staff byline identifies newsroom-produced briefs, collaborative work, and articles assembled from verified public information under editor responsibility.</p>
      <h2>Independence, images, and harm</h2><p>Paid placement is not presented as reporting. Material conflicts should be disclosed. Images require accurate captions and credits, and coverage should minimize unnecessary harm.</p>
    </section>`;

  if (page === "contact") return `
    <section class="content-block">
      <h2>Corrections and story ideas</h2><p>For corrections, include the article link, the statement you believe is wrong, and supporting firsthand or documentary evidence. For story ideas, explain what changed, who is affected, and where the relevant evidence can be found.</p>
      <h2>Public contact desk</h2><p><a href="${contactUrl}" rel="noopener noreferrer">Open the public contact desk</a>. Submissions and attachments there are public.</p>
      <h2>Sensitive information</h2><p>Do not post confidential records, private contact details, medical information, or source-identifying material. Ask for a private follow-up channel without including the sensitive material itself.</p>
    </section>`;

  if (page === "corrections") return `
    <section class="content-block">
      <h2>Published corrections</h2><p>There are no substantive corrections recorded as of this edition. Material errors will be listed here with the affected article, the original error, and the correction.</p>
      <p><a href="${pageCleanPath("contact")}">Request a correction</a>.</p>
    </section>`;

  if (page === "privacy") return `
    <section class="content-block">
      <h2>What the site handles</h2><p>Our hosting provider may process standard request information such as an IP address, browser type, requested page, and request time to deliver and secure the site.</p>
      <h2>Preferences stored on your device</h2><p>Your color theme and saved-story IDs are stored in your browser's local storage. Tysons Times does not receive those values or use them to identify you across websites.</p>
      <h2>Third-party services</h2><p>The site requests weather from Open-Meteo and loads articles and images from the Tysons Times content host. Those services may receive ordinary request information under their own privacy practices.</p>
      <h2>Forms, cookies, and advertising</h2><p>Tysons Times does not maintain reader accounts or collect personal information through on-site submission forms. We do not set tracking cookies, run behavioral analytics, or operate targeted advertising.</p>
      <h2>Sharing, retention, and your choices</h2><p>We do not sell or rent personal information or maintain reader profiles. Service providers may keep limited security and access logs. You can clear local preferences through your browser settings.</p>
      <p class="meta">Last updated August 9, 2026</p>
    </section>`;

  return "";
}

function renderStaticPage(page) {
  const meta = buildRouteMeta({ page });
  const title = pageTitles[page] || page;
  const related = articlesForStaticPage(page);
  const policyBody = staticPolicyBody(page);
  const body = `
    <section>
      <h1>${escapeHtml(title)}</h1>
      <p class="deck">${escapeHtml(pageDescriptions[page] || site.description)}</p>
      <dl class="key-facts">
        <div><dt>Coverage area</dt><dd>${escapeHtml(site.coverageArea.join(", "))}</dd></div>
        <div><dt>Primary topics</dt><dd>${escapeHtml(site.topics.slice(0, 5).join(", "))}</dd></div>
        <div><dt>Latest update</dt><dd>${escapeHtml(formatDisplayDate(sortedArticles[0].date))}</dd></div>
      </dl>
      ${policyBody}
      ${policyBody ? "" : articleList(related, page === "archive" ? "All articles" : "Featured local coverage")}
    </section>
  `;

  return layout(meta, body, appHashForPage(page));
}

function buildSitemap() {
  const latest = sortedArticles[0].date;
  const entries = [
    { loc: absoluteUrl("/"), lastmod: latest, changefreq: "daily", priority: "1.0" },
    ...indexedPages.map((page) => ({
      loc: absoluteUrl(pageCleanPath(page)),
      lastmod: latest,
      changefreq: page === "events" || page === "archive" ? "daily" : "weekly",
      priority: page === "archive" ? "0.8" : "0.7",
    })),
    ...sections.map((section) => {
      const sectionArticles = sortedArticles.filter((article) => article.section === section.id);
      return {
        loc: absoluteUrl(sectionCleanPath(section.id)),
        lastmod: latestDateForArticles(sectionArticles),
        changefreq: "daily",
        priority: "0.9",
      };
    }),
    ...articles.map((article) => ({
      loc: absoluteUrl(articleCleanPath(article.id)),
      lastmod: article.updated || article.date,
      changefreq: "monthly",
      priority: article.priority <= 3 ? "0.9" : "0.8",
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${siteOrigin}/sitemap.xml
# LLM-readable site index: ${siteOrigin}/llms.txt`;
}

function buildFeed() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(siteOrigin)}/</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(rssDate(sortedArticles[0].date))}</lastBuildDate>
    <atom:link href="${escapeXml(siteOrigin)}/feed.xml" rel="self" type="application/rss+xml" />
${feedArticles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(absoluteUrl(articleCleanPath(article.id)))}</link>
      <guid isPermaLink="true">${escapeXml(absoluteUrl(articleCleanPath(article.id)))}</guid>
      <description>${escapeXml(article.dek)}</description>
      <pubDate>${escapeXml(rssDate(article.date))}</pubDate>
      <author>${escapeXml(article.author)}</author>
      <category>${escapeXml(sectionLabel(article.section))}</category>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;
}

function markdownArticleLine(article) {
  return `- [${article.title}](${absoluteUrl(articleCleanPath(article.id))}): ${article.dek} Published ${article.date}; by ${article.author}; section ${sectionLabel(article.section)}; location ${article.location}; topics ${article.tags.join(", ")}.`;
}

function buildLlmsTxt() {
  return `# ${site.name}

> ${site.description}

Site: ${siteOrigin}
Coverage area: ${site.coverageArea.join(", ")}
Language: en-US
Primary topics: ${site.topics.join(", ")}

## Machine-readable resources

- Sitemap: ${siteOrigin}/sitemap.xml
- RSS feed: ${siteOrigin}/feed.xml
- Editorial standards: ${absoluteUrl(pageCleanPath("standards"))}
- Corrections: ${absoluteUrl(pageCleanPath("corrections"))}
- Contact: ${absoluteUrl(pageCleanPath("contact"))}

## Preferred citation

Use the article title, author, publication date, section, location, and canonical URL. Articles cover Tysons, Virginia and nearby Fairfax County communities.

## Sections

${sections.map((section) => `- [${section.label}](${absoluteUrl(sectionCleanPath(section.id))}): ${section.description}`).join("\n")}

## Key pages

${indexedPages.map((page) => `- [${pageTitles[page] || page}](${absoluteUrl(pageCleanPath(page))}): ${pageDescriptions[page]}`).join("\n")}

## Latest 100 articles

${llmIndexArticles.map(markdownArticleLine).join("\n")}`;
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  await Promise.all([...generatedFiles, ...generatedDirs].map(removeGenerated));

  await Promise.all([
    writePublic("robots.txt", buildRobots()),
    writePublic("sitemap.xml", buildSitemap()),
    writePublic("feed.xml", buildFeed()),
    writePublic("llms.txt", buildLlmsTxt()),
    ...articles.map((article) => writePublic(path.join("articles", article.id, "index.html"), renderArticlePage(article))),
    ...sections.map((section) => writePublic(path.join("sections", section.id, "index.html"), renderSectionPage(section))),
    ...indexedPages.map((page) => writePublic(path.join(pageCleanPath(page).replace(/^\/|\/$/g, ""), "index.html"), renderStaticPage(page))),
  ]);

  console.log(`Generated SEO assets for ${articles.length} articles, ${sections.length} sections, and ${indexedPages.length} pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
