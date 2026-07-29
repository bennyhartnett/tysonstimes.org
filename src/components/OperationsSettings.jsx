import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_OPERATIONS_SETTINGS,
  normalizeOperationsSettings,
} from "../config/operationsSettings.js";
import {
  PUBLICATION_PREFERENCES_KEY,
  readPublicationPreferences,
  storePublicationPreferences,
} from "../config/publicationPreferences.js";

const STORAGE_KEY = "tysons-times-operations-settings";

const promptFields = [
  {
    key: "discovery",
    eyebrow: "Step 01",
    title: "Story discovery",
    description: "Controls what the collection step looks for and how it returns source material.",
  },
  {
    key: "drafting",
    eyebrow: "Step 02",
    title: "Article drafting",
    description: "Sets the voice, structure, sourcing rules, and editorial boundaries for first drafts.",
  },
  {
    key: "review",
    eyebrow: "Step 03",
    title: "Editorial review",
    description: "Defines the checks that run before a story can move toward publication.",
  },
];

const toggles = [
  {
    key: "skipDuplicates",
    title: "Skip likely duplicates",
    description: "Do not draft a story when a substantially similar item already exists.",
  },
  {
    key: "requireTwoSources",
    title: "Require two sources",
    description: "Hold stories that cannot be supported by at least two independent sources.",
  },
  {
    key: "createDrafts",
    title: "Create article drafts",
    description: "Turn qualified story candidates into complete editorial drafts.",
  },
  {
    key: "requireEditorApproval",
    title: "Require editor approval",
    description: "Keep completed drafts in review until a person approves publication.",
    recommended: true,
  },
  {
    key: "autoPublish",
    title: "Publish automatically",
    description: "Send approved stories live without a final manual publish action.",
    warning: true,
  },
  {
    key: "generateSocialCopy",
    title: "Generate social copy",
    description: "Create a short social post alongside every completed article.",
  },
  {
    key: "notifyOnFailure",
    title: "Notify on failures",
    description: "Surface a local alert whenever a processing step cannot finish.",
  },
];

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_OPERATIONS_SETTINGS));
}

function Toggle({ checked, description, disabled, onChange, recommended, title, warning }) {
  return (
    <label className={`ops-toggle-row${disabled ? " is-disabled" : ""}`}>
      <span className="ops-toggle-copy">
        <span className="ops-toggle-title">
          {title}
          {recommended && <small>Recommended</small>}
          {warning && <small className="is-warning">Use with care</small>}
        </span>
        <span>{description}</span>
      </span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
      <span className="ops-switch" aria-hidden="true"><i /></span>
    </label>
  );
}

export function OperationsSettings() {
  const [settings, setSettings] = useState(cloneDefaults);
  const [savedSettings, setSavedSettings] = useState(cloneDefaults);
  const [status, setStatus] = useState({ type: "loading", message: "Loading saved settings…" });
  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      let loaded;
      let storage = "workspace";
      try {
        const response = await fetch("/__operations/settings", { cache: "no-store" });
        if (!response.ok) throw new Error("Local settings service is unavailable");
        loaded = normalizeOperationsSettings(await response.json());
      } catch {
        storage = "browser";
        try {
          loaded = normalizeOperationsSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
        } catch {
          loaded = cloneDefaults();
        }
      }

      if (localStorage.getItem(PUBLICATION_PREFERENCES_KEY) !== null) {
        loaded = { ...loaded, display: readPublicationPreferences() };
      }

      if (!cancelled) {
        setSettings(loaded);
        setSavedSettings(loaded);
        setStatus({
          type: "ready",
          message: storage === "workspace" ? "Saved to this workspace" : "Saved in this browser",
        });
      }
    }

    loadSettings();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const warnIfDirty = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnIfDirty);
    return () => window.removeEventListener("beforeunload", warnIfDirty);
  }, [dirty]);

  function updatePrompt(key, value) {
    setSettings((current) => ({ ...current, prompts: { ...current.prompts, [key]: value } }));
  }

  function updateWorkflow(key, value) {
    setSettings((current) => ({ ...current, workflow: { ...current.workflow, [key]: value } }));
  }

  function updateDisplay(key, value) {
    setSettings((current) => ({ ...current, display: { ...current.display, [key]: value } }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    const next = normalizeOperationsSettings(settings);
    setStatus({ type: "saving", message: "Saving changes…" });

    try {
      const response = await fetch("/__operations/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!response.ok) throw new Error("Local settings service is unavailable");
      const saved = normalizeOperationsSettings(await response.json());
      setSettings(saved);
      setSavedSettings(saved);
      try { storePublicationPreferences(saved.display); } catch {}
      setStatus({ type: "saved", message: "All changes saved to this workspace" });
    } catch {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        storePublicationPreferences(next.display);
        setSettings(next);
        setSavedSettings(next);
        setStatus({ type: "saved", message: "All changes saved in this browser" });
      } catch {
        setStatus({ type: "error", message: "Could not save changes — try again" });
      }
    }
  }

  function restoreDefaults() {
    setSettings(cloneDefaults());
    setStatus({ type: "ready", message: "Defaults restored — save to apply" });
  }

  const publishingLocked = settings.workflow.requireEditorApproval && !settings.workflow.createDrafts;
  const saveStateType = status.type === "error" ? "error" : dirty ? "dirty" : status.type;
  const saveStateMessage = status.type === "error" ? status.message : dirty ? "Unsaved changes" : status.message;

  return (
    <form className="ops-settings" onSubmit={saveSettings}>
      <section className="ops-settings-intro">
        <div>
          <p className="ops-eyebrow">Pipeline configuration</p>
          <h1>Settings</h1>
          <p>Shape how stories are found, written, reviewed, and published.</p>
        </div>
        <div className={`ops-save-state ops-save-state--${saveStateType}`} aria-live="polite">
          <i />
          <span>{saveStateMessage}</span>
        </div>
      </section>

      <div className="ops-settings-layout">
        <aside className="ops-settings-nav" aria-label="Settings sections">
          <span>Settings</span>
          <a href="#settings-prompts">Prompts</a>
          <a href="#settings-workflow">Workflow</a>
          <a href="#settings-display">Display</a>
          <a href="#settings-safety">Review & delivery</a>
        </aside>

        <div className="ops-settings-main">
          <section className="ops-settings-section" id="settings-prompts" aria-labelledby="settings-prompts-title">
            <div className="ops-section-heading">
              <div>
                <p className="ops-eyebrow">Instructions</p>
                <h2 id="settings-prompts-title">Pipeline prompts</h2>
                <p>Edit the instructions used at each major step. Changes take effect on the next run.</p>
              </div>
              <button type="button" className="ops-text-button" onClick={() => setSettings((current) => ({ ...current, prompts: cloneDefaults().prompts }))}>
                Reset prompts
              </button>
            </div>

            <div className="ops-prompt-list">
              {promptFields.map((field) => (
                <label className="ops-prompt-card" key={field.key}>
                  <span className="ops-prompt-label">
                    <span><small>{field.eyebrow}</small><strong>{field.title}</strong></span>
                    <em>{settings.prompts[field.key].length.toLocaleString()} characters</em>
                  </span>
                  <span className="ops-field-help">{field.description}</span>
                  <textarea
                    value={settings.prompts[field.key]}
                    onChange={(event) => updatePrompt(field.key, event.target.value)}
                    rows="5"
                    spellCheck="true"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="ops-settings-section" id="settings-workflow" aria-labelledby="settings-workflow-title">
            <div className="ops-section-heading">
              <div>
                <p className="ops-eyebrow">Cadence & volume</p>
                <h2 id="settings-workflow-title">Workflow</h2>
                <p>Set the operating limits for each end-to-end run.</p>
              </div>
            </div>

            <div className="ops-control-grid">
              <label className="ops-control">
                <span>Run frequency</span>
                <small>How often the pipeline starts automatically.</small>
                <select value={settings.workflow.runFrequency} onChange={(event) => updateWorkflow("runFrequency", event.target.value)}>
                  <option value="manual">Manual only</option>
                  <option value="hourly">Every hour</option>
                  <option value="6h">Every 6 hours</option>
                  <option value="daily">Once a day</option>
                </select>
              </label>
              <label className="ops-control">
                <span>Stories per run</span>
                <small>Maximum number of candidates to process.</small>
                <input type="number" min="1" max="50" value={settings.workflow.maxStories} onChange={(event) => updateWorkflow("maxStories", event.target.value)} />
              </label>
              <label className="ops-control">
                <span>Source lookback</span>
                <small>How far back discovery should search.</small>
                <div className="ops-input-suffix"><input type="number" min="1" max="336" value={settings.workflow.sourceLookbackHours} onChange={(event) => updateWorkflow("sourceLookbackHours", event.target.value)} /><span>hours</span></div>
              </label>
              <label className="ops-control">
                <span>Target article length</span>
                <small>Approximate length for a standard draft.</small>
                <select value={settings.workflow.targetWords} onChange={(event) => updateWorkflow("targetWords", Number(event.target.value))}>
                  <option value="400">Brief · 400 words</option>
                  <option value="650">Standard · 650 words</option>
                  <option value="900">Detailed · 900 words</option>
                  <option value="1200">Feature · 1,200 words</option>
                </select>
              </label>
            </div>

            <label className="ops-range-control">
              <span><strong>Minimum source confidence</strong><em>{settings.workflow.minimumConfidence}%</em></span>
              <small>Stories below this score stay out of the drafting queue.</small>
              <input type="range" min="0" max="100" step="5" value={settings.workflow.minimumConfidence} onChange={(event) => updateWorkflow("minimumConfidence", Number(event.target.value))} />
              <span className="ops-range-labels"><i>More coverage</i><i>Stricter filtering</i></span>
            </label>
          </section>

          <section className="ops-settings-section" id="settings-display" aria-labelledby="settings-display-title">
            <div className="ops-section-heading">
              <div>
                <p className="ops-eyebrow">Reader experience</p>
                <h2 id="settings-display-title">Display</h2>
                <p>Control the default presentation of the newspaper on this device.</p>
              </div>
            </div>
            <div className="ops-control-grid ops-control-grid--display">
              <label className="ops-control">
                <span>Color theme</span>
                <small>System follows the reader’s light or dark operating-system setting.</small>
                <select value={settings.display.theme} onChange={(event) => updateDisplay("theme", event.target.value)}>
                  <option value="system">Detect system</option>
                  <option value="light">Always light</option>
                  <option value="dark">Always dark</option>
                </select>
              </label>
              <Toggle
                title="Show advertisements"
                description="Display reserved ad placements on home and article pages. Hidden by default."
                checked={settings.display.showAdvertisements}
                onChange={(event) => updateDisplay("showAdvertisements", event.target.checked)}
              />
            </div>
          </section>

          <section className="ops-settings-section" id="settings-safety" aria-labelledby="settings-safety-title">
            <div className="ops-section-heading">
              <div>
                <p className="ops-eyebrow">Safeguards</p>
                <h2 id="settings-safety-title">Review & delivery</h2>
                <p>Choose which checks and handoffs are required before publication.</p>
              </div>
            </div>
            <div className="ops-toggle-list">
              {toggles.map((toggle) => (
                <Toggle
                  {...toggle}
                  checked={settings.workflow[toggle.key]}
                  disabled={toggle.key === "autoPublish" && publishingLocked}
                  onChange={(event) => updateWorkflow(toggle.key, event.target.checked)}
                  key={toggle.key}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="ops-settings-actions">
        <div>
          <strong>{status.type === "error" ? "Changes were not saved" : dirty ? "You have changes to save" : "Configuration is up to date"}</strong>
          <span>{status.type === "error" ? status.message : dirty ? "They will apply to the next pipeline run." : status.message}</span>
        </div>
        <div>
          <button type="button" className="ops-secondary-button" onClick={restoreDefaults}>Restore defaults</button>
          <button type="button" className="ops-secondary-button" onClick={() => setSettings(savedSettings)} disabled={!dirty}>Discard</button>
          <button type="submit" className="ops-primary-button" disabled={!dirty || status.type === "saving"}>{status.type === "saving" ? "Saving…" : "Save changes"}</button>
        </div>
      </footer>
    </form>
  );
}
