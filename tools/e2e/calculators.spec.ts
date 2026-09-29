import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widths = [390, 768, 1440] as const;

for (const width of widths) {
  test(`calculator library fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "The Numbers Behind Profitable Growth." }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Search all 27 tools")).toBeVisible();

    const pageWidth = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth);
  });
}

test("search finds a calculator and live result updates", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search all 27 tools").fill("break even roas");
  await page.getByRole("button", { name: /Break-Even ROAS Calculator/ }).click();

  await expect(page.getByText("1.76", { exact: true })).toBeVisible();
  await page.getByLabel("Average order value").fill("100");
  await expect(page.getByText("1.54", { exact: true })).toBeVisible();
});

test("break-even ROAS exposes its achieved scenario and profit curve", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByPlaceholder("Search all 27 tools").fill("break even roas");
  const toggle = page.getByRole("button", { name: /Break-Even ROAS Calculator/ });
  await toggle.click();

  await expect(page.getByLabel("Achieved ROAS")).toHaveValue("3");
  await expect(page.getByText("Profit per order at 3.0x ROAS")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Profit per order across ROAS from 0.5x to 8.0x" }),
  ).toBeVisible();
  await expect(toggle).toHaveAttribute("data-state", "expanded");

  await page.getByLabel("Achieved ROAS").fill("4");
  await expect(page.getByText("Profit per order at 4.0x ROAS")).toBeVisible();
  await expect(page.getByText("$25.38", { exact: true })).toBeVisible();
});

test("A/B significance and UTM tools render their specialized outputs", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByPlaceholder("Search all 27 tools").fill("significance");
  await page.getByRole("button", { name: /A\/B Test Significance Calculator/ }).click();
  await expect(page.getByText("Significant", { exact: true })).toBeVisible();

  await page.getByLabel("Clear search").click();
  await page.getByPlaceholder("Search all 27 tools").fill("utm");
  await page.getByRole("button", { name: /UTM Builder/ }).click();
  await expect(page.getByText(/utm_source=facebook/)).toBeVisible();
  await expect(page.getByText("Check the inputs to continue.")).toHaveCount(0);
});

test("expanded calculator has no serious axe violations", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search all 27 tools").fill("break even roas");
  await page.getByRole("button", { name: /Break-Even ROAS Calculator/ }).click();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

test("open calculators keep field IDs unique", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Break-Even ROAS Calculator/ }).click();
  await page.getByRole("button", { name: /LTV Calculator/ }).click();

  const ids = await page.locator("[id]").evaluateAll((elements) =>
    elements.map((element) => element.id),
  );
  expect(new Set(ids).size).toBe(ids.length);
});

test("zero divisors show a clear calculation message", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search all 27 tools").fill("ad budget");
  await page.getByRole("button", { name: /Ad Budget Calculator/ }).click();
  await page.getByLabel("Average order value").fill("0");

  await expect(
    page.getByText("This calculation needs a non-zero value in every divisor field."),
  ).toBeVisible();
});
