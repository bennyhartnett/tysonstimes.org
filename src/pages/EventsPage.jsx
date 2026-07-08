import { events } from "../data/content.js";

export function EventsPage() {
  return (
    <section className="section">
      <h2 className="page-title">Events</h2>
      <p className="deck">Calendar listings, public meetings, school events, arts notices, and recurring community deadlines.</p>
      <div className="event-grid">
        {events.map((event) => (
          <article className="event-card" key={`${event.title}-${event.date}`}>
            <div className="event-date">
              {event.date} / {event.category}
            </div>
            <h3>{event.title}</h3>
            <p>
              <strong>{event.location}</strong>
            </p>
            <p>{event.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
