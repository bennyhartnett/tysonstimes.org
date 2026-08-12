import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const articleIndex = JSON.parse(await readFile(new URL("../../src/generated/article-index.json", import.meta.url), "utf8"));

test.beforeEach(async ({ page }) => {
  await page.route("**/tysons-times-content/index.json", (route) => route.fulfill({ json: articleIndex }));
});

test("front page, menu, and newsroom search are usable", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/#/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Open section menu" }).click();
  await expect(page.getByRole("navigation", { name: "Complete newspaper directory" })).toBeVisible();
  await page.getByRole("button", { name: "Open search" }).click();
  await page.getByLabel("Search Tysons Times").fill("schools");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/#\/archive\?q=schools/);
  await expect(page.getByRole("heading", { name: "Archive", exact: true })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: /stor/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("front-page photos preserve their full image inside consistent frames", async ({ page }) => {
  await page.goto("/#/");

  const leadFrame = page.locator(".home-lead-visual .mini-photo");
  const leadImage = leadFrame.locator("img");
  await expect(leadImage).toHaveAttribute("src", /Rep\._Don_Beyer/);
  await expect(leadImage).toHaveCSS("object-fit", "contain");

  const box = await leadFrame.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width / box.height).toBeCloseTo(16 / 9, 1);
});

test("article tools save and copy a canonical link", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`/#/article/${articleIndex[0].id}`);
  await expect(page.getByRole("heading", { level: 1, name: articleIndex[0].title })).toBeVisible();
  const save = page.getByRole("button", { name: "Save", exact: true });
  await save.click();
  await expect(page.getByRole("button", { name: "Saved", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(page.getByText("Link copied")).toBeVisible();
});

test("unknown routes get a clear missing-page response", async ({ page }) => {
  await page.goto("/#/not-a-real-page");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});
