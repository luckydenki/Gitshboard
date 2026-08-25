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
    fulfillJson(route, {
      success: false,
      status: 200,
      data: null,
    }),
  );

  await page.route("**/api/search**", (route) => {
    return fulfillJson(route, {
      success: true,
      status: 200,
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            login: "asd-result",
            id: 102,
            avatar_url: avatarUrl,
            html_url: "https://github.com/asd-result",
            type: "User",
          },
        ],
      },
    });
  });

  await page.route("https://api.github.com/search/users**", (route) =>
    fulfillJson(route, {
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          login: "asd-suggestion",
          id: 101,
          avatar_url: avatarUrl,
          html_url: "https://github.com/asd-suggestion",
          type: "User",
        },
      ],
    }),
  );

  await page.goto("/");

  const searchInput = page.getByRole("textbox", {
    name: "Search for github users input field",
  });
  const autocompleteResponse = page.waitForResponse((response) => {
    const requestUrl = new URL(response.url());

    return (
      requestUrl.origin === "https://api.github.com" &&
      requestUrl.pathname === "/search/users" &&
      requestUrl.searchParams.get("q") === "asd" &&
      requestUrl.searchParams.get("per_page") === "8" &&
      response.ok()
    );
  });

  await searchInput.fill("asd");
  await autocompleteResponse;

  await expect(
    page.getByRole("button", { name: "asd-suggestion" }),
  ).toBeVisible();

  const searchResultResponse = page.waitForResponse((response) => {
    const requestUrl = new URL(response.url());

    return (
      requestUrl.pathname === "/api/search" &&
      requestUrl.searchParams.get("name") === "asd" &&
      requestUrl.searchParams.get("per_page") === "10" &&
      response.ok()
    );
  });
  await page.getByRole("button", { name: "Search users" }).click();
  await searchResultResponse;

  await expect(page).toHaveURL(/\/search\?name=asd$/);
  await expect(
    page.getByRole("heading", { name: /Search Results for "asd"/ }),
  ).toBeVisible();
  await expect(page.getByText("asd-result", { exact: true })).toBeVisible();
});
