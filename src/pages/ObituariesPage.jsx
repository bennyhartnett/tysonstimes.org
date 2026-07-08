export function ObituariesPage() {
  const notices = [
    ["Memorial Notice Template", "Tysons", "A respectful short-form notice with family-approved biographical details, service location, and charitable-giving note."],
    ["Community Remembrance", "Tysons Area", "A longer remembrance format for civic volunteers, teachers, coaches, faith leaders, and neighborhood figures."],
    ["Service Announcement", "Northern Fairfax", "A compact service notice for date, time, location, visitation details, and publication contact information."],
    ["Anniversary Memorial", "Tysons", "A standing module for anniversary notices, family messages, and archival photo placement."],
  ];

  return (
    <section className="section obituaries-layout">
      <div>
        <h2 className="page-title">Obituaries</h2>
        <p className="deck">A memorial-notice template with careful typography, service details, submission guidance, and room for community remembrance.</p>
        <div className="notice-list">
          {notices.map(([title, location, text]) => (
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
            <button className="button" type="button">
              Prepare Notice
            </button>
          </div>
        </form>
        <div className="ad-box">
          <h3>Editorial Care</h3>
          <p>Obituary pages should keep family-provided details clear, avoid crowding service information, and preserve the notice after publication.</p>
        </div>
      </aside>
    </section>
  );
}
