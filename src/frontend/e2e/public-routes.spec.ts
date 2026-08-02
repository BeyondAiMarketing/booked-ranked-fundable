import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/pricing",
  "/why-us",
  "/free-audit",
  "/login",
  "/onboarding",
  "/demo",
  "/demo-login",
  "/roofing",
  "/plumbing",
  "/hvac",
  "/med-spa",
  "/dental",
  "/real-estate",
];

for (const route of publicRoutes) {
  test(`${route} renders without a fatal browser error`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    expect(response, `No navigation response for ${route}`).not.toBeNull();
    expect(response?.status(), `${route} returned an HTTP error`).toBeLessThan(400);
    await expect(page.locator("#root")).toBeVisible();
    await expect(page.locator("body")).not.toBeEmpty();
    expect(pageErrors, `Browser errors on ${route}`).toEqual([]);
  });
}

test("homepage carries the product title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Booked Ranked Fundable/i);
});
