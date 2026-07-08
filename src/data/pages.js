export const pageTitles = {
  home: "Front Page",
  section: "Section",
  article: "Article",
  archive: "Archive",
  events: "Events",
  briefs: "Briefs",
  guide: "Guide",
  photo: "Photo Essay",
  live: "Live Updates",
  newsletter: "Newsletter",
  investigations: "Investigations",
  election: "Election Results",
  dining: "Dining Guide",
  obituaries: "Obituaries",
  classifieds: "Classifieds",
  corrections: "Corrections",
  about: "Subscribe/About",
};

export const pageTypes = [
  ["Front Page", "A dense edition layout with lead story, briefs, photo record, long read, and community notices.", "home"],
  ["Section Page", "Reusable feed template for civic, schools, business, culture, sports, opinion, and future desks.", "section"],
  ["Article Page", "Long-form story template with byline, deck, image plate, tags, and related coverage.", "article"],
  ["Archive", "Searchable article catalog with section filtering for a growing newsroom library.", "archive"],
  ["Events", "Calendar page for meetings, school items, arts listings, deadlines, and weekend guides.", "events"],
  ["Briefs", "Compact local-news file for quick updates, notices, short items, and confirmed newsroom notes.", "briefs"],
  ["Guide", "Service-journalism page for explainers, checklists, recurring resident questions, and practical links.", "guide"],
  ["Photo Essay", "Visual feature page with a lead image plate, captioned gallery, and narrative newspaper columns.", "photo"],
  ["Live Updates", "Running-story page for meetings, storms, elections, traffic incidents, and developing civic stories.", "live"],
  ["Newsletter", "Email-edition page with issue preview, sign-up panel, and reusable module blocks.", "newsletter"],
  ["Investigations", "Accountability hub with a case file, documents, source notes, timelines, and related coverage.", "investigations"],
  ["Election Results", "Results board for local races, precinct returns, turnout notes, and election-night analysis.", "election"],
  ["Dining Guide", "Restaurant and cafe guide for openings, closings, neighborhood picks, and service notes.", "dining"],
  ["Obituaries", "Memorial notice template with submission guidance, service details, and remembrance modules.", "obituaries"],
  ["Classifieds", "Local marketplace and public-notice board for jobs, services, real estate, sales, and notices.", "classifieds"],
  ["Corrections", "Corrections log and standards page that keeps updates visible and tied to original coverage.", "corrections"],
  ["Subscribe/About", "Mission, submission notes, newsletter shell, and reader-service information.", "about"],
];

export const primaryNavLinks = [
  { label: "Front Page", page: "home" },
  { label: "Local", section: "local" },
  { label: "Civic", section: "civic" },
  { label: "Schools", section: "schools" },
  { label: "Business", section: "business" },
  { label: "Dining", page: "dining" },
  { label: "Events", page: "events" },
  { label: "Opinion", section: "opinion" },
  { label: "Archive", page: "archive" },
];

export const directoryNavGroups = [
  {
    title: "More Desks",
    links: [
      { label: "Culture", section: "culture" },
      { label: "Sports", section: "sports" },
      { label: "Investigations", page: "investigations" },
      { label: "Election", page: "election" },
    ],
  },
  {
    title: "Quick Files",
    links: [
      { label: "Briefs", page: "briefs" },
      { label: "Guides", page: "guide" },
      { label: "Photos", page: "photo" },
      { label: "Live", page: "live" },
    ],
  },
  {
    title: "Reader Services",
    links: [
      { label: "Newsletter", page: "newsletter" },
      { label: "Obits", page: "obituaries" },
      { label: "Classifieds", page: "classifieds" },
      { label: "Corrections", page: "corrections" },
      { label: "About", page: "about" },
    ],
  },
];
