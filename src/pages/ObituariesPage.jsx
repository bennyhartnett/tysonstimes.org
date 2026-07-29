import { HoverButton } from "../components/HoverLink.jsx";
import { obituariesPage } from "../data/pages.js";

export function ObituariesPage() {
  return (
    <section className="section obituaries-layout">
      <div>
        <h1 className="page-title">Obituaries</h1>
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
            <label className="form-field"><span>Contact name</span><input className="subscribe-input" type="text" autoComplete="name" placeholder="Contact name" /></label>
            <label className="form-field"><span>Email address</span><input className="subscribe-input" type="email" autoComplete="email" placeholder="email@example.com" /></label>
            <label className="form-field"><span>Notice details</span><textarea className="subscribe-textarea" placeholder="Service details, family contact, and preferred publication date" /></label>
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
