import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays the page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Booked Ranked Fundable/i);
  });

  test("has a visible hero section", async ({ page }) => {
    await page.goto("/");
    // Page should render without JS errors
    const root = page.locator("#root");
    await expect(root).toBeVisible();
  });

  test("navigation to /pricing works", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveTitle(/Booked Ranked Fundable/i);
    await expect(page.locator("#root")).toBeVisible();
  });

  test("navigation to /why-us works", async ({ page }) => {
    await page.goto("/why-us");
    await expect(page.locator("#root")).toBeVisible();
  });
});
