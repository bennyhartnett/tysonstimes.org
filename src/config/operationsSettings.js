import {
  DEFAULT_PUBLICATION_PREFERENCES,
  normalizePublicationPreferences,
} from "./publicationPreferences.js";

export const DEFAULT_OPERATIONS_SETTINGS = {
  prompts: {
    discovery:
      "Find timely, consequential stories affecting Tysons and nearby Fairfax County communities. Prefer primary sources and recent reporting. Return the source URL, publication time, key facts, and why the story matters locally.",
    drafting:
      "Write a clear, concise local-news article for Tysons Times. Lead with the most important verified fact, explain the local impact, attribute every claim, and never invent quotes or details. Use plain language and a neutral, civic-minded tone.",
    review:
      "Review the draft for factual support, names, dates, locations, links, duplicate claims, and unsupported conclusions. Flag anything that needs human confirmation and return a short publication-readiness summary.",
  },
  workflow: {
    runFrequency: "manual",
    maxStories: 8,
    sourceLookbackHours: 48,
    minimumConfidence: 75,
    targetWords: 650,
    skipDuplicates: true,
    requireTwoSources: true,
    createDrafts: true,
    requireEditorApproval: true,
    autoPublish: false,
    generateSocialCopy: true,
    notifyOnFailure: true,
  },
  display: { ...DEFAULT_PUBLICATION_PREFERENCES },
};

const allowedFrequencies = new Set(["manual", "hourly", "6h", "daily"]);
const allowedWordCounts = new Set([400, 650, 900, 1200]);

function boundedNumber(value, fallback, min, max) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}

export function normalizeOperationsSettings(value = {}) {
  const prompts = value.prompts || {};
  const workflow = value.workflow || {};
  const defaults = DEFAULT_OPERATIONS_SETTINGS;

  return {
    prompts: Object.fromEntries(
      Object.entries(defaults.prompts).map(([key, fallback]) => [
        key,
        typeof prompts[key] === "string" ? prompts[key].slice(0, 20000) : fallback,
      ]),
    ),
    workflow: {
      runFrequency: allowedFrequencies.has(workflow.runFrequency)
        ? workflow.runFrequency
        : defaults.workflow.runFrequency,
      maxStories: boundedNumber(workflow.maxStories, defaults.workflow.maxStories, 1, 50),
      sourceLookbackHours: boundedNumber(
        workflow.sourceLookbackHours,
        defaults.workflow.sourceLookbackHours,
        1,
        336,
      ),
      minimumConfidence: boundedNumber(
        workflow.minimumConfidence,
        defaults.workflow.minimumConfidence,
        0,
        100,
      ),
      targetWords: allowedWordCounts.has(Number(workflow.targetWords))
        ? Number(workflow.targetWords)
        : defaults.workflow.targetWords,
      ...Object.fromEntries(
        [
          "skipDuplicates",
          "requireTwoSources",
          "createDrafts",
          "requireEditorApproval",
          "autoPublish",
          "generateSocialCopy",
          "notifyOnFailure",
        ].map((key) => [key, typeof workflow[key] === "boolean" ? workflow[key] : defaults.workflow[key]]),
      ),
    },
    display: normalizePublicationPreferences(value.display),
  };
}
