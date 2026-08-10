import { HoverLink } from "../components/HoverLink.jsx";
import { pagePath } from "../routing.js";

export function PrivacyPage() {
  return (
    <section className="section privacy-page">
      <header className="privacy-header">
        <p className="privacy-kicker">Reader notice</p>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="deck">
          The short version: this site collects as little as it reasonably can. We do not sell your personal information
          or build advertising profiles about you.
        </p>
        <p className="privacy-updated">Last updated August 9, 2026</p>
      </header>

      <div className="privacy-layout">
        <article className="privacy-copy">
          <section>
            <h2>What the site handles</h2>
            <p>
              When you visit Tysons Times, our hosting provider may process standard technical information such as your
              IP address, browser type, device type, requested pages, and the time of the request. This information is
              used to deliver the site, keep it reliable, and protect it from abuse.
            </p>
          </section>

          <section>
            <h2>Preferences stored on your device</h2>
            <p>
              Your color-theme choice, publication display preferences, and saved-story IDs are stored in your
              browser&apos;s local storage. They stay on your device unless you clear them. Tysons Times does not receive
              those values or use them to identify you across websites.
            </p>
          </section>

          <section>
            <h2>Third-party services</h2>
            <p>
              The site is delivered by its hosting provider, requests local weather from Open-Meteo, loads article
              content and images from the Tysons Times content host. The site&apos;s typefaces are packaged with the site.
              External content services may receive ordinary request information, including your IP address, under
              their own privacy practices. Links to other websites are governed by the policies of those sites.
            </p>
          </section>

          <section>
            <h2>Forms, cookies, and advertising</h2>
            <p>
              Tysons Times does not maintain reader accounts or collect personal information through on-site submission
              forms. We do not set tracking cookies, run behavioral analytics, or operate a targeted-advertising system.
              If that changes, this policy will be updated before the new collection begins.
            </p>
          </section>

          <section>
            <h2>Sharing and retention</h2>
            <p>
              We do not sell or rent personal information. Technical records may be handled by service providers that
              help deliver and secure the site, or disclosed when required by law. Tysons Times does not maintain a
              separate database of reader profiles. Hosting providers may keep limited security and access logs under
              their own retention schedules.
            </p>
          </section>

          <section>
            <h2>Your choices</h2>
            <p>
              You can clear this site&apos;s local storage through your browser settings and use browser privacy controls
              to limit third-party requests. Because we do not maintain reader accounts or profiles, we generally have
              no personal record to retrieve, correct, or delete. Our <HoverLink href={pagePath("about")}>About page</HoverLink>
              explains the publication&apos;s coverage and editorial priorities, and the <HoverLink href={pagePath("contact")}>contact page</HoverLink>
              provides a public feedback channel.
            </p>
          </section>

          <section>
            <h2>Children and policy changes</h2>
            <p>
              This general-audience news site is not designed to collect personal information from children. Material
              changes to this policy will appear here with a new effective date.
            </p>
          </section>
        </article>

        <aside className="privacy-summary" aria-labelledby="privacy-summary-title">
          <h2 id="privacy-summary-title">No fine-print ambush</h2>
          <dl>
            <div>
              <dt>Sold</dt>
              <dd>No</dd>
            </div>
            <div>
              <dt>Ad tracking</dt>
              <dd>No</dd>
            </div>
            <div>
              <dt>Reader accounts</dt>
              <dd>None</dd>
            </div>
            <div>
              <dt>Saved locally</dt>
              <dd>Theme, display preferences, saved-story IDs</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
