export const PUBLICATION_PREFERENCES_KEY = "tysons-times-publication-preferences";

export const DEFAULT_PUBLICATION_PREFERENCES = {
  showAdvertisements: false,
  theme: "system",
};

const allowedThemes = new Set(["system", "light", "dark"]);

export function normalizePublicationPreferences(value = {}) {
  return {
    showAdvertisements:
      typeof value.showAdvertisements === "boolean"
        ? value.showAdvertisements
        : DEFAULT_PUBLICATION_PREFERENCES.showAdvertisements,
    theme: allowedThemes.has(value.theme) ? value.theme : DEFAULT_PUBLICATION_PREFERENCES.theme,
  };
}

export function readPublicationPreferences() {
  try {
    return normalizePublicationPreferences(JSON.parse(localStorage.getItem(PUBLICATION_PREFERENCES_KEY) || "{}"));
  } catch {
    return { ...DEFAULT_PUBLICATION_PREFERENCES };
  }
}

export function storePublicationPreferences(value) {
  const preferences = normalizePublicationPreferences(value);
  localStorage.setItem(PUBLICATION_PREFERENCES_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent("publication-preferences", { detail: preferences }));
  return preferences;
}

