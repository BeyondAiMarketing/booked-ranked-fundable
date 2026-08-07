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
  "/roofing-ai-growth-playbook",
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

test("roofing book route renders the book funnel instead of Not Found", async ({
  page,
}) => {
  await page.goto("/roofing-ai-growth-playbook");
  await expect(
    page.getByRole("heading", {
      name: /roofing playbook for contractors ready to win in the ai era/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/^Not Found$/)).toHaveCount(0);
});

test("live production homepage shows roofing growth package", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Free roofing growth package").first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /see the system\. then see what your own roofing website needs next/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /get my free playbook \+ audit/i }).first(),
  ).toBeVisible();
});

test("live production roofing page shows roofing growth package", async ({ page }) => {
  await page.goto("/roofing", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Free roofing growth package").first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /see the system\. then see what your own roofing website needs next/i,
    }),
  ).toBeVisible();
});

test("live production roofing book page shows the book funnel", async ({ page }) => {
  await page.goto("/roofing-ai-growth-playbook", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("heading", {
      name: /roofing playbook for contractors ready to win in the ai era/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("Roofing Contractors").first()).toBeVisible();
  await expect(page.getByText("Dave Reeves").first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: /get my free roofing book \+ audit/i }),
  ).toBeVisible();
  await expect(page.getByText(/^Not Found$/)).toHaveCount(0);
});
