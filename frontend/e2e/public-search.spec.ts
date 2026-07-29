import { expect, test, type Route } from "playwright/test";

const avatarUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const fulfillJson = (route: Route, body: unknown) =>
  route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(body),
  });

test("공개 검색에서 자동완성과 검색 결과를 확인한다", async ({ page }) => {
  await page.route("**/api/auth/check", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "Unauthorized" }),
    }),
  );

  await page.route("**/api/search**", (route) => {
    const requestUrl = new URL(route.request().url());
    const isAutocompleteRequest = requestUrl.searchParams.get("per_page") === "8";

    return fulfillJson(route, {
      success: true,
      status: 200,
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            login: isAutocompleteRequest ? "asd-suggestion" : "asd-result",
            id: isAutocompleteRequest ? 101 : 102,
            avatar_url: avatarUrl,
            html_url: "https://github.com/asd-result",
            type: "User",
          },
        ],
      },
    });
  });

  await page.goto("/");

  const searchInput = page.getByRole("textbox", {
    name: "Search for github users input field",
  });
  const autocompleteRequest = page.waitForRequest((request) => {
    const requestUrl = new URL(request.url());

    return (
      requestUrl.pathname === "/api/search" &&
      requestUrl.searchParams.get("name") === "asd" &&
      requestUrl.searchParams.get("per_page") === "8"
    );
  });
  const inputStartedAt = Date.now();

  await searchInput.fill("asd");
  await autocompleteRequest;

  expect(Date.now() - inputStartedAt).toBeGreaterThanOrEqual(1_400);
  await expect(
    page.getByRole("button", { name: "asd-suggestion" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Search users" }).click();

  await expect(page).toHaveURL(/\/search\?name=asd$/);
  await expect(
    page.getByRole("heading", { name: /Search Results for "asd"/ }),
  ).toBeVisible();
  await expect(page.getByText("asd-result", { exact: true })).toBeVisible();
});
