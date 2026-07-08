import { HoverLink } from "../components/HoverLink.jsx";
import { electionPage } from "../data/pages.js";
import { pagePath } from "../routing.js";

export function ElectionPage() {
  return (
    <section className="section election-layout">
      <div>
        <h2 className="page-title">Election Results</h2>
        <p className="deck">A live-results template for local races, precinct returns, turnout notes, ballot questions, and context from the civic desk.</p>
        <div className="results-grid">
          {electionPage.races.map(({ title, label, value, note }) => (
            <article className="result-card" key={title}>
              <div className="event-date">{label}</div>
              <h3>{title}</h3>
              <div className="result-number">{value}%</div>
              <div className="vote-meter" aria-hidden="true">
                <span style={{ width: `${value}%` }} />
              </div>
              <p>{note}</p>
            </article>
          ))}
        </div>
        <div className="returns-table">
          <table>
            <thead>
              <tr>
                <th>Precinct</th>
                <th>Ballots</th>
                <th>Turnout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {electionPage.precincts.map(({ name, ballots, turnout, status }) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{ballots}</td>
                  <td>{turnout}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <aside className="article-tools">
        <div className="index-box">
          <h3>Election Desk</h3>
          <ol>
            {electionPage.deskItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div className="ad-box">
          <h3>Reader Note</h3>
          <p>{electionPage.readerNote}</p>
        </div>
        <HoverLink className="button" href={pagePath("live")}>
          Open Live File
        </HoverLink>
      </aside>
    </section>
  );
}
