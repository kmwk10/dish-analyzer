import { test, expect } from "@playwright/test";

test("filter by calories -> only valid items shown", async ({ page }) => {
  await page.goto("/auth");

  await page.getByRole("button").first().click();
  await page.getByPlaceholder("Введите электронную почту").fill("test@test.com");
  await page.getByPlaceholder("Введите пароль").fill("123456");
  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL("**/dishes");
  await page.goto("/products");

  await page.getByText("Все продукты").click();

  const inputs = page.locator('input[type="number"]');

  await inputs.nth(0).fill("50");
  await inputs.nth(1).fill("150");

  await page.waitForTimeout(500);

  const items = await page.locator("text=/\\d+,?\\d*\\/\\d+,?\\d*\\/\\d+,?\\d*\\/\\d+,?\\d*/").allTextContents();

  for (const item of items) {
    const calories = parseFloat(item.split("/")[0].replace(",", "."));

    expect(calories).toBeGreaterThanOrEqual(50);
    expect(calories).toBeLessThanOrEqual(150);
  }
});

test("create as user -> delete as admin", async ({ page }) => {
  const productName = `Test Product ${Date.now()}`;

  await page.goto("/auth");

  await page.getByRole("button").first().click();

  await page.getByPlaceholder("Введите электронную почту").fill("test@test.com");
  await page.getByPlaceholder("Введите пароль").fill("123456");

  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL("**/dishes");
  await page.goto("/products");

  await page.getByRole("button", { name: "Добавить продукт" }).click();

  const modal = page.locator('text=Сохранить').locator('..');
  const inputs = modal.locator("input");

  await inputs.nth(0).fill(productName);
  await inputs.nth(1).fill("100");
  await inputs.nth(2).fill("10");
  await inputs.nth(3).fill("5");
  await inputs.nth(4).fill("20");

  await page.getByRole("button", { name: "Сохранить" }).click();

  await page.mouse.click(100, 100);

  await expect(page.getByText(productName)).toBeVisible();

  await page.goto("/auth");

  await page.getByRole("button").first().click();

  await page.getByPlaceholder("Введите электронную почту").fill("admin@example.com");
  await page.getByPlaceholder("Введите пароль").fill("admin");

  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL("**/dishes");
  await page.goto("/products");

  await page.getByPlaceholder("Введите название продукта").fill(productName);

  await page.getByText(productName).click();

  await page.getByRole("button", { name: "Удалить" }).click();

  await page.waitForTimeout(500);

  await expect(page.getByText(productName)).not.toBeVisible();
});
