import { test, expect } from "@playwright/test";

test("login -> redirect to dishes", async ({ page, request }) => {
  const res = await request.post("http://localhost:8000/auth/register", {
    data: {
      username: "Test",
      email: "test@test.com",
      password: "123456"
    }
  });
  

  if (!res.ok() && res.status() !== 400) {
    throw new Error("Seed failed");
  }

  await page.goto("/auth");

  await page.getByRole("button").first().click();

  await page.getByPlaceholder("Введите электронную почту").fill("test@test.com");
  await page.getByPlaceholder("Введите пароль").fill("123456");

  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL("**/dishes");

  await expect(page).toHaveURL(/dishes/);
});

test("logout -> redirect to auth", async ({ page }) => {
  await page.goto("/auth");

  await page.getByRole("button").first().click();
  await page.getByPlaceholder("Введите электронную почту").fill("user@example.com");
  await page.getByPlaceholder("Введите пароль").fill("string");
  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL("**/dishes");

  await page.goto("/settings");

  await page.getByRole("button", { name: "Выйти" }).click();

  await expect(page).toHaveURL(/auth/);
});

test("session restore -> stay authenticated", async ({ page }) => {
  await page.goto("/auth");

  await page.getByRole("button").first().click();
  await page.getByPlaceholder("Введите электронную почту").fill("test@test.com");
  await page.getByPlaceholder("Введите пароль").fill("123456");
  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL("**/dishes");

  await page.reload();

  await expect(page).toHaveURL(/dishes/);
});
