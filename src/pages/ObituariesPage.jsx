import { HoverButton } from "../components/HoverLink.jsx";
import { obituariesPage } from "../data/pages.js";

export function ObituariesPage() {
  return (
    <section className="section obituaries-layout">
      <div>
        <h2 className="page-title">Obituaries</h2>
        <p className="deck">A memorial-notice template with careful typography, service details, submission guidance, and room for community remembrance.</p>
        <div className="notice-list">
          {obituariesPage.notices.map(({ title, location, text }) => (
            <article className="obit-card" key={title}>
              <div className="obit-mark" aria-hidden="true" />
              <div>
                <div className="meta">{location} / Memorial Desk</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className="article-tools">
        <form className="search-panel">
          <h3>Notice Submission</h3>
          <div className="form-grid">
            <input className="subscribe-input" type="text" placeholder="Contact name" />
            <input className="subscribe-input" type="email" placeholder="email@example.com" />
            <textarea className="subscribe-textarea" placeholder="Service details, family contact, and preferred publication date" />
            <HoverButton className="button" type="button">
              Prepare Notice
            </HoverButton>
          </div>
        </form>
        <div className="ad-box">
          <h3>Editorial Care</h3>
          <p>{obituariesPage.editorialCare}</p>
        </div>
      </aside>
    </section>
  );
}
