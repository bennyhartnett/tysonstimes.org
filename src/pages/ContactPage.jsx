import { HoverLink } from "../components/HoverLink.jsx";
import { site } from "../data/content.js";
import { pagePath } from "../routing.js";

export function ContactPage() {
  return (
    <section className="section contact-page">
      <header className="trust-header">
        <p className="privacy-kicker">Newsroom desk</p>
        <h1 className="page-title">Contact Tysons Times</h1>
        <p className="deck">Send a correction, public comment, story idea, or question about our coverage.</p>
      </header>
      <div className="trust-grid">
        <article className="classified">
          <h2>Corrections</h2>
          <p>Include the article link, the statement you believe is wrong, and the source or firsthand information supporting the correction.</p>
        </article>
        <article className="classified">
          <h2>Story ideas</h2>
          <p>Explain what changed, who is affected, why the matter is timely, and where the relevant public record or firsthand evidence can be found.</p>
        </article>
        <article className="classified">
          <h2>Public contact channel</h2>
          <p>Tysons Times currently receives public submissions through its repository issue desk. Submissions and attachments there are public.</p>
          <a className="button" href={site.publisher.publicContactUrl} rel="noopener noreferrer">Open the public contact desk</a>
        </article>
        <article className="classified">
          <h2>Sensitive information</h2>
          <p>Do not post confidential records, private contact details, medical information, or source-identifying material in the public contact desk. Ask for a private follow-up channel without including the sensitive material itself.</p>
        </article>
      </div>
      <div className="trust-actions">
        <HoverLink className="button" href={pagePath("standards")}>Read our standards</HoverLink>
        <HoverLink className="button" href={pagePath("privacy")}>Review privacy practices</HoverLink>
      </div>
    </section>
  );
}
