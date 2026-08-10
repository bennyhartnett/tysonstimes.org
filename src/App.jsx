import { lazy, Suspense, useEffect, useMemo } from "react";
import { NewspaperLayout } from "./components/NewspaperLayout.jsx";
import { useContentStatus } from "./data/ContentProvider.jsx";
import { useHashRoute } from "./routing.js";
import { applyDocumentMetadata, buildRouteMeta } from "./seo.js";
import { HomePage } from "./pages/HomePage.jsx";

const lazyPage = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));
const AboutPage = lazyPage(() => import("./pages/AboutPage.jsx"), "AboutPage");
const ArchivePage = lazyPage(() => import("./pages/ArchivePage.jsx"), "ArchivePage");
const ArticlePage = lazyPage(() => import("./pages/ArticlePage.jsx"), "ArticlePage");
const BriefsPage = lazyPage(() => import("./pages/BriefsPage.jsx"), "BriefsPage");
const ContactPage = lazyPage(() => import("./pages/ContactPage.jsx"), "ContactPage");
const CorrectionsPage = lazyPage(() => import("./pages/CorrectionsPage.jsx"), "CorrectionsPage");
const EditorialStandardsPage = lazyPage(() => import("./pages/EditorialStandardsPage.jsx"), "EditorialStandardsPage");
const PrivacyPage = lazyPage(() => import("./pages/PrivacyPage.jsx"), "PrivacyPage");
const SectionPage = lazyPage(() => import("./pages/SectionPage.jsx"), "SectionPage");

const pages = {
  home: HomePage,
  section: SectionPage,
  article: ArticlePage,
  archive: ArchivePage,
  briefs: BriefsPage,
  corrections: CorrectionsPage,
  about: AboutPage,
  standards: EditorialStandardsPage,
  contact: ContactPage,
  privacy: PrivacyPage,
};

function LoadingPage() {
  return (
    <section className="section route-loading" role="status" aria-live="polite">
      <h1 className="page-title">Loading coverage…</h1>
      <p className="deck">Retrieving the complete Tysons Times index.</p>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="section missing-article">
      <h1 className="page-title">Page not found</h1>
      <p className="deck">The requested page is not part of this edition.</p>
    </section>
  );
}

function PublishedApp() {
  const { articles, complete, loading } = useContentStatus();
  const requestedRoute = useHashRoute(articles);
  const route = requestedRoute;
  const needsCompleteIndex = ["archive", "briefs", "corrections", "section"].includes(route.page)
    || (route.page === "article" && !route.article);
  const Page = needsCompleteIndex && loading && !complete
    ? LoadingPage
    : pages[route.page] || NotFoundPage;
  const meta = useMemo(() => buildRouteMeta(route, articles), [route, articles]);

  useEffect(() => {
    applyDocumentMetadata(meta);
  }, [meta]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [route.key]);

  return (
    <NewspaperLayout route={route}>
      <Suspense fallback={<LoadingPage />}>
        <Page route={route} />
      </Suspense>
    </NewspaperLayout>
  );
}

export default function App() {
  return <PublishedApp />;
}
