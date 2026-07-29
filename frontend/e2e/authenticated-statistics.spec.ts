import { expect, test, type Page, type Route } from "playwright/test";

const avatarUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const success = <T>(data: T) => ({
  success: true,
  status: 200,
  data,
});

const fulfillJson = (route: Route, body: unknown) =>
  route.fulfill({
    contentType: "application/json",
    body: JSON.stringify(body),
  });

async function mockAuthenticatedApis(page: Page) {
  const user = {
    id: 1,
    login: "e2e-user",
    avatar_url: avatarUrl,
    html_url: "https://github.com/e2e-user",
    name: "E2E User",
    company: null,
    blog: "",
    location: "Seoul",
    email: null,
    bio: "Playwright test user",
    followers: 12,
    following: 8,
  };

  await page.route("**/api/auth/check", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "Unauthorized" }),
    }),
  );

  await page.route("https://github.com/login/oauth/authorize**", (route) =>
    route.fulfill({
      status: 302,
      headers: {
        location: "http://127.0.0.1:5173/auth/github/callback?code=e2e-code",
      },
    }),
  );

  await page.route("**/api/auth/github", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toEqual({ code: "e2e-code" });

    await fulfillJson(route, success({}));
  });

  await page.route("**/api/users/userheader", (route) =>
    fulfillJson(
      route,
      success({
        login: user.login,
        avatarUrl,
      }),
    ),
  );

  await page.route("**/api/users/repos", (route) =>
    fulfillJson(route, {
      repos: [
        {
          id: 101,
          name: "e2e-dashboard",
          full_name: "e2e-user/e2e-dashboard",
          private: false,
          html_url: "https://github.com/e2e-user/e2e-dashboard",
          description: "Repository used by the E2E test",
          fork: false,
          url: "https://api.github.com/repos/e2e-user/e2e-dashboard",
          language: "TypeScript",
          watchers: 3,
        },
      ],
    }),
  );

  await page.route("**/api/users", (route) => fulfillJson(route, success(user)));

  const repositoryData = (nodes: unknown[]) => ({
    user: {
      repositories: {
        nodes,
      },
    },
  });

  const commitHistory = {
    target: {
      history: {
        nodes: [{ committedDate: "2026-07-28T09:00:00.000Z" }],
      },
    },
  };

  await page.route("**/api/repos/languages", (route) =>
    fulfillJson(
      route,
      success(
        repositoryData([
          {
            name: "e2e-dashboard",
            languages: {
              totalSize: 100,
              edges: [
                { size: 80, node: { name: "TypeScript" } },
                { size: 20, node: { name: "CSS" } },
              ],
            },
          },
        ]),
      ),
    ),
  );

  await page.route("**/api/repos/commitTime", (route) =>
    fulfillJson(
      route,
      success(repositoryData([{ name: "e2e-dashboard", defaultBranchRef: commitHistory }])),
    ),
  );

  await page.route("**/api/repos/projectTopics", (route) =>
    fulfillJson(
      route,
      success(
        repositoryData([
          {
            name: "e2e-dashboard",
            repositoryTopics: { nodes: [{ topic: { name: "react" } }] },
          },
        ]),
      ),
    ),
  );

  await page.route("**/api/repos/developStats", (route) =>
    fulfillJson(
      route,
      success(
        repositoryData([
          {
            name: "e2e-dashboard",
            defaultBranchRef: commitHistory,
            languages: { edges: [{ node: { name: "TypeScript" } }] },
            repositoryTopics: { nodes: [{ topic: { name: "react" } }] },
          },
        ]),
      ),
    ),
  );

  await page.route("**/api/repos/projectLiveRate", (route) =>
    fulfillJson(
      route,
      success(
        repositoryData([
          {
            name: "e2e-dashboard",
            createdAt: "2025-01-01T09:00:00.000Z",
            pushedAt: "2026-07-28T09:00:00.000Z",
            updatedAt: "2026-07-28T09:00:00.000Z",
            isArchived: false,
            isFork: false,
          },
        ]),
      ),
    ),
  );
}

test("GitHub OAuth 로그인 후 대시보드와 통계 화면을 확인한다", async ({ page }) => {
  await mockAuthenticatedApis(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Login with GitHub" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "E2E User's workspace" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Repositories" })).toBeVisible();
  await expect(page.getByText("e2e-dashboard")).toBeVisible();

  await page.getByRole("link", { name: "Statistics" }).click();

  await expect(page).toHaveURL(/\/statpage$/);
  await expect(
    page.getByRole("heading", { name: "Development statistics" }),
  ).toBeVisible();
  await expect(page.getByText("5 sources ready")).toBeVisible();
});
