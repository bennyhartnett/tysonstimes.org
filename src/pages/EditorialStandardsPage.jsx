import { HoverLink } from "../components/HoverLink.jsx";
import { pagePath } from "../routing.js";

const standards = [
  {
    title: "Verification and sourcing",
    text: "Names, dates, quotations, statistics, and material claims should be checked against primary documents, direct interviews, official records, or clearly identified reporting. Automated tools are never treated as sources.",
  },
  {
    title: "Corrections and updates",
    text: "Material errors are corrected promptly in the article and recorded on the corrections page. Clarifications explain meaningful changes in context; routine spelling and style edits are not logged as corrections.",
  },
  {
    title: "Automation and AI",
    text: "Tysons Times may use automated tools to organize public information, identify reporting leads, create internal summaries, and assist with drafts. A human editor is responsible for publication decisions and factual verification. AI-created images are labeled in their credits.",
  },
  {
    title: "Bylines and accountability",
    text: "A named byline identifies the reporter when appropriate. The Tysons Times Staff byline is used for newsroom-produced briefs, collaborative work, and articles assembled from verified public information under editor responsibility.",
  },
  {
    title: "Independence and conflicts",
    text: "Editorial decisions are made independently. Paid placement is not presented as reporting. A material personal, financial, or organizational relationship affecting coverage should be disclosed with the article.",
  },
  {
    title: "Images, privacy, and harm",
    text: "Photographs and illustrations require accurate captions and credits. Coverage should minimize unnecessary harm, particularly when it involves minors, victims, medical information, or private individuals who are not central to a public matter.",
  },
];

export function EditorialStandardsPage() {
  return (
    <section className="section standards-page">
      <header className="trust-header">
        <p className="privacy-kicker">How we work</p>
        <h1 className="page-title">Editorial Standards</h1>
        <p className="deck">The rules Tysons Times uses to separate verified local reporting from rumor, promotion, and unsupported automation.</p>
      </header>
      <div className="trust-grid">
        {standards.map((standard) => (
          <article className="classified" key={standard.title}>
            <h2>{standard.title}</h2>
            <p>{standard.text}</p>
          </article>
        ))}
      </div>
      <div className="trust-actions">
        <HoverLink className="button" href={pagePath("corrections")}>View corrections</HoverLink>
        <HoverLink className="button" href={pagePath("contact")}>Contact the newsroom</HoverLink>
      </div>
    </section>
  );
}
