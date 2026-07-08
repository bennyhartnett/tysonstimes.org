import { useEffect, useMemo } from "react";
import { NewspaperLayout } from "./components/NewspaperLayout.jsx";
import { site } from "./data/content.js";
import { pageTitles } from "./data/pages.js";
import { useHashRoute } from "./routing.js";
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
  const route = useHashRoute();
  const Page = pages[route.page] || HomePage;
  const title = useMemo(() => {
    if (route.page === "article" && route.article) {
      return `${route.article.title} | ${site.name}`;
    }
    if (route.page === "section" && route.section) {
      return `${route.section.label} | ${site.name}`;
    }
    return route.page === "home" ? site.name : `${pageTitles[route.page] || "Page"} | ${site.name}`;
  }, [route]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [route.key]);

  return (
    <NewspaperLayout>
      <Page route={route} />
    </NewspaperLayout>
  );
}
