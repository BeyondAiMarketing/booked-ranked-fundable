import { expect, test } from "@playwright/test";

test.describe("Free Audit flow", () => {
  test("loads the free-audit page", async ({ page }) => {
    await page.goto("/free-audit");
    await expect(page.locator("#root")).toBeVisible();
  });
});

test.describe("Login page", () => {
  test("loads the login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("#root")).toBeVisible();
  });
});

test.describe("Onboarding page", () => {
  test("loads the onboarding page", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.locator("#root")).toBeVisible();
  });
});

test.describe("Demo pages", () => {
  test("loads the demo page", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.locator("#root")).toBeVisible();
  });

  test("loads the demo-login page", async ({ page }) => {
    await page.goto("/demo-login");
    await expect(page.locator("#root")).toBeVisible();
  });
});

test.describe("Niche landing pages", () => {
  const niches = [
    "/roofing",
    "/plumbing",
    "/hvac",
    "/med-spa",
    "/dental",
    "/real-estate",
  ];

  for (const path of niches) {
    test(`loads ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("#root")).toBeVisible();
    });
  }
});
