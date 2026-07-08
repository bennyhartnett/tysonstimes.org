export function ClassifiedsPage() {
  const ads = [
    ["Public Notice", "County filing, hearing notice, estate notice, or legal announcement with publication dates."],
    ["Help Wanted", "Local office, restaurant, retail, tutoring, seasonal, and part-time hiring posts."],
    ["Real Estate", "Open houses, rentals, office space, short notices, and neighborhood property updates."],
    ["Services", "Tutoring, repairs, lessons, accounting, yard work, childcare, and local professional services."],
    ["Sales", "Estate sales, yard sales, equipment, furniture, instruments, and school-group fundraisers."],
    ["Lost & Found", "Small community notices with location, date, contact path, and verification notes."],
    ["Announcements", "Milestones, reunions, club notes, scout projects, and volunteer calls."],
    ["Marketplace", "Reader-to-reader listings for useful local goods and neighborhood needs."],
  ];

  return (
    <>
      <section className="section">
        <h2 className="page-title">Classifieds</h2>
        <p className="deck">A dense local marketplace template for public notices, jobs, services, real estate, sales, announcements, and community needs.</p>
        <div className="classifieds-board">
          {ads.map(([title, text], index) => (
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
          <p>Classified pages can collect submissions, route public notices for review, and publish print-style listings with a searchable category index.</p>
        </div>
        <form className="search-panel">
          <h3>Submission Shell</h3>
          <div className="form-grid">
            <select className="section-select">
              <option>Public notice</option>
              <option>Help wanted</option>
              <option>Real estate</option>
              <option>Services</option>
              <option>Sales</option>
            </select>
            <textarea className="subscribe-textarea" placeholder="Notice text" />
            <button className="button" type="button">
              Review Notice
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
