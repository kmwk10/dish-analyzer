import { test, expect } from "@playwright/test";

test("quote load -> display quote", async ({ page }) => {
  await page.goto("/auth");

  await page.getByRole("button").first().click();
  await page.getByPlaceholder("Введите электронную почту").fill("test@test.com");
  await page.getByPlaceholder("Введите пароль").fill("123456");
  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL("**/dishes");

  await page.goto("/settings");

  await page.waitForSelector("text=Loading...", { state: "detached" });

  const quoteText = page.locator('text=/".+"/');

  await expect(quoteText).toBeVisible();
});
