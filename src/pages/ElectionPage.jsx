import { HoverLink } from "../components/HoverLink.jsx";
import { pagePath } from "../routing.js";

export function ElectionPage() {
  const races = [
    ["County Board", "Precincts Reporting", 72, "Awaiting late precincts"],
    ["School Board", "Votes Counted", 64, "Early and Election Day returns"],
    ["Bond Question", "Yes Share", 58, "Unofficial returns"],
    ["Turnout", "Registered Voters", 47, "Estimated participation"],
  ];
  const precincts = [
    ["Tysons", "1,842", "71%", "Reported"],
    ["Pimmit Hills", "1,416", "64%", "Reported"],
    ["Dunn Loring", "1,105", "52%", "Partial"],
    ["McLean Edge", "908", "49%", "Partial"],
    ["Vienna North", "836", "44%", "Pending"],
  ];

  return (
    <section className="section election-layout">
      <div>
        <h2 className="page-title">Election Results</h2>
        <p className="deck">A live-results template for local races, precinct returns, turnout notes, ballot questions, and context from the civic desk.</p>
        <div className="results-grid">
          {races.map(([title, label, value, note]) => (
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
              {precincts.map(([name, ballots, turnout, status]) => (
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
            <li>Unofficial results</li>
            <li>Precinct returns</li>
            <li>Turnout notes</li>
            <li>Ballot explainers</li>
            <li>Certification timeline</li>
          </ol>
        </div>
        <div className="ad-box">
          <h3>Reader Note</h3>
          <p>Election pages can switch from live updates to certified results while preserving the original timestamped race notes.</p>
        </div>
        <HoverLink className="button" href={pagePath("live")}>
          Open Live File
        </HoverLink>
      </aside>
    </section>
  );
}
