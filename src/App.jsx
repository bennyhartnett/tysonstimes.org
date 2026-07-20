import { useEffect, useMemo } from "react";
import { NewspaperLayout } from "./components/NewspaperLayout.jsx";
import { useArticles } from "./data/ContentProvider.jsx";
import { useHashRoute } from "./routing.js";
import { applyDocumentMetadata, buildRouteMeta } from "./seo.js";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ArchivePage } from "./pages/ArchivePage.jsx";
import { ArticlePage } from "./pages/ArticlePage.jsx";
import { ClassifiedsPage } from "./pages/ClassifiedsPage.jsx";
import { CorrectionsPage } from "./pages/CorrectionsPage.jsx";
import { DiningPage } from "./pages/DiningPage.jsx";
import { ElectionPage } from "./pages/ElectionPage.jsx";
import { EventsPage } from "./pages/EventsPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { InvestigationsPage } from "./pages/InvestigationsPage.jsx";
import { ObituariesPage } from "./pages/ObituariesPage.jsx";
import { SectionPage } from "./pages/SectionPage.jsx";
import {
  BriefsPage,
  GuidePage,
  LivePage,
  NewsletterPage,
  PhotoEssayPage,
} from "./pages/FeaturePages.jsx";

const pages = {
  home: HomePage,
  section: SectionPage,
  article: ArticlePage,
  archive: ArchivePage,
  events: EventsPage,
  briefs: BriefsPage,
  guide: GuidePage,
  photo: PhotoEssayPage,
  live: LivePage,
  newsletter: NewsletterPage,
  investigations: InvestigationsPage,
  election: ElectionPage,
  dining: DiningPage,
  obituaries: ObituariesPage,
  classifieds: ClassifiedsPage,
  corrections: CorrectionsPage,
  about: AboutPage,
};

export default function App() {
  const articles = useArticles();
  const route = useHashRoute(articles);
  const Page = pages[route.page] || HomePage;
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
