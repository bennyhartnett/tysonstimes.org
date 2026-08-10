import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PUBLICATION_PREFERENCES,
  PUBLICATION_PREFERENCES_KEY,
  readPublicationPreferences,
  storePublicationPreferences,
} from "../config/publicationPreferences.js";

export function usePublicationPreferences() {
  const [preferences, setPreferences] = useState(readPublicationPreferences);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = (event) => setSystemDark(event.matches);
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, []);

  useEffect(() => {
    const syncPreference = (event) => {
      if (event.type === "storage" && event.key !== PUBLICATION_PREFERENCES_KEY) return;
      setPreferences(event.detail || readPublicationPreferences());
    };
    window.addEventListener("storage", syncPreference);
    window.addEventListener("publication-preferences", syncPreference);
    return () => {
      window.removeEventListener("storage", syncPreference);
      window.removeEventListener("publication-preferences", syncPreference);
    };
  }, []);

  const resolvedTheme = preferences.theme === "system" ? (systemDark ? "dark" : "light") : preferences.theme;

  useEffect(() => {
    document.documentElement.dataset.siteTheme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    return () => {
      delete document.documentElement.dataset.siteTheme;
      document.documentElement.style.removeProperty("color-scheme");
    };
  }, [resolvedTheme]);

  return useMemo(() => ({
    ...preferences,
    resolvedTheme,
    cycleTheme() {
      const order = ["system", "dark", "light"];
      const theme = order[(order.indexOf(preferences.theme) + 1) % order.length] || DEFAULT_PUBLICATION_PREFERENCES.theme;
      setPreferences(storePublicationPreferences({ ...preferences, theme }));
    },
  }), [preferences, resolvedTheme]);
}
