import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator } from "@playwright/test";

/** Sliders replace number boxes: press arrow keys until the live label matches. */
async function slideTo(slider: Locator, label: string) {
  await slider.focus();
  for (let i = 0; i < 2000; i += 1) {
    const current = await slider.getAttribute("aria-valuetext");
    if (current === label) return;
    const value = Number(await slider.inputValue());
    const max = Number(await slider.getAttribute("max"));
    if (value >= max) break;
    await slider.press("ArrowRight");
  }
  for (let i = 0; i < 2000; i += 1) {
    const current = await slider.getAttribute("aria-valuetext");
    if (current === label) return;
    await slider.press("ArrowLeft");
  }
  throw new Error(`Slider never reached ${label}`);
}

const widths = [390, 768, 1440] as const;

test("header uses the approved DOE vector and exact brand palette", async ({ page }) => {
  await page.goto("/");

  const logo = page.getByRole("link", { name: "DOE Media", exact: true });
  await expect(logo).toBeVisible();
  await expect(logo.locator("img")).toHaveAttribute(
    "src",
    /^(?:data:image\/svg\+xml,.*|.*doe-logo\.svg)$/,
  );
  await expect(logo.locator("img")).toHaveJSProperty("complete", true);

  const palette = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      red: styles.getPropertyValue("--red").trim(),
      purple: styles.getPropertyValue("--purple").trim(),
      black: styles.getPropertyValue("--black").trim(),
      white: styles.getPropertyValue("--white").trim(),
    };
  });
  expect(palette).toEqual({
    red: "#E24B4B",
    purple: "#694AE2",
    black: "#000000",
    white: "#FFFFFF",
  });
});

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
  await slideTo(page.getByLabel("Average order value"), "$100");
  await expect(page.getByText("1.54", { exact: true })).toBeVisible();
});

test("break-even ROAS exposes its achieved scenario and profit curve", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByPlaceholder("Search all 27 tools").fill("break even roas");
  const toggle = page.getByRole("button", { name: /Break-Even ROAS Calculator/ });
  await toggle.click();

  await expect(page.getByLabel("Achieved ROAS")).toHaveAttribute("aria-valuetext", "3.0x");
  await expect(page.getByText("Profit per order at 3.0x ROAS")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Profit per order across ROAS from 0.5x to 8.0x" }),
  ).toBeVisible();
  await expect(toggle).toHaveAttribute("data-state", "expanded");

  await slideTo(page.getByLabel("Achieved ROAS"), "4.0x");
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

test("every numeric input is a slider with a formatted live label", async ({ page }) => {
  await page.goto("/");
  for (const button of await page.locator(".tool-summary").all()) await button.click();
  await expect(page.locator('input[type="number"]')).toHaveCount(0);
  const sliders = page.locator('input[type="range"]');
  expect(await sliders.count()).toBeGreaterThan(80);
  const spend = page.locator("#ad-spend-calculator-field-budget");
  await expect(spend).toHaveAttribute("aria-valuetext", "$10,000");
  await slideTo(spend, "$20,000");
  await expect(page.locator("#ad-spend-calculator .result-row").first()).toContainText("$20,000");
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
  await page.getByPlaceholder("Search all 27 tools").fill("conversion rate");
  await page.getByRole("button", { name: /Conversion Rate Calculator/ }).click();
  const sessions = page.getByLabel("Sessions");
  await sessions.focus();
  await sessions.press("Home");

  await expect(
    page.getByText("This calculation needs a non-zero value in every divisor field."),
  ).toBeVisible();
});
