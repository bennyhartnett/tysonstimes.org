import { HoverButton } from "../components/HoverLink.jsx";

import { classifiedsPage } from "../data/pages.js";

export function ClassifiedsPage() {
  return (
    <>
      <section className="section">
        <h2 className="page-title">Classifieds</h2>
        <p className="deck">A dense local marketplace template for public notices, jobs, services, real estate, sales, announcements, and community needs.</p>
        <div className="classifieds-board">
          {classifiedsPage.ads.map(({ title, text }, index) => (
            <article className="classified-ad" key={title}>
              <div className="notice-code">TT-{String(index + 1).padStart(3, "0")}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section classifieds-submit">
        <div>
          <h2 className="section-title">
            <span>Place a Notice</span>
          </h2>
          <p>{classifiedsPage.submissionCopy}</p>
        </div>
        <form className="search-panel">
          <h3>Submission Shell</h3>
          <div className="form-grid">
            <select className="section-select">
              {classifiedsPage.submissionCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <textarea className="subscribe-textarea" placeholder="Notice text" />
            <HoverButton className="button" type="button">
              Review Notice
            </HoverButton>
          </div>
        </form>
      </section>
    </>
  );
}
