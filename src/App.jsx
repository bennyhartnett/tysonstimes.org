import { useEffect, useMemo } from "react";
import { NewspaperLayout } from "./components/NewspaperLayout.jsx";
import { useArticles } from "./data/ContentProvider.jsx";
import { useHashRoute } from "./routing.js";
import { applyDocumentMetadata, buildRouteMeta } from "./seo.js";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ArchivePage } from "./pages/ArchivePage.jsx";
import { ArticlePage } from "./pages/ArticlePage.jsx";
import { CorrectionsPage } from "./pages/CorrectionsPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { PrivacyPage } from "./pages/PrivacyPage.jsx";
import { SectionPage } from "./pages/SectionPage.jsx";
import { BriefsPage } from "./pages/BriefsPage.jsx";

const pages = {
  home: HomePage,
  section: SectionPage,
  article: ArticlePage,
  archive: ArchivePage,
  briefs: BriefsPage,
  corrections: CorrectionsPage,
  about: AboutPage,
  privacy: PrivacyPage,
};

function PublishedApp() {
  const articles = useArticles();
  const requestedRoute = useHashRoute(articles);
  const route = pages[requestedRoute.page]
    ? requestedRoute
    : { page: "home", key: `home:${requestedRoute.key}` };
  const Page = pages[route.page];
  const meta = useMemo(() => buildRouteMeta(route, articles), [route, articles]);

  useEffect(() => {
    applyDocumentMetadata(meta);
  }, [meta]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [route.key]);

  return (
    <NewspaperLayout route={route}>
      <Page route={route} />
    </NewspaperLayout>
  );
}

export default function App() {
  return <PublishedApp />;
}
