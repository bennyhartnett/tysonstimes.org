import { HoverButton } from "../components/HoverLink.jsx";

import { classifiedsPage } from "../data/pages.js";

export function ClassifiedsPage() {
  return (
    <>
      <section className="section">
        <h1 className="page-title">Classifieds</h1>
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
            <label className="form-field"><span>Notice category</span><select className="section-select">
              {classifiedsPage.submissionCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select></label>
            <label className="form-field"><span>Notice text</span><textarea className="subscribe-textarea" placeholder="Enter the notice text" /></label>
            <HoverButton className="button" type="button">
              Review Notice
            </HoverButton>
          </div>
        </form>
      </section>
    </>
  );
}
