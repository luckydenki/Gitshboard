import { expect, test, type Page, type Route } from "playwright/test";

const sessionCookie = "e2e-session=authenticated";
const avatarUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const fulfillJson = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });

const isAuthenticated = async (route: Route) =>
  (await route.request().headerValue("cookie"))?.includes(sessionCookie) ?? false;

const repositoryData = (nodes: unknown[]) => ({
  user: {
    repositories: {
      nodes,
    },
  },
});

const success = <T>(data: T) => ({ success: true, status: 200, data });

async function mockStatPageApis(page: Page) {
  const unauthorized = (route: Route) =>
    fulfillJson(route, 401, { error: "Unauthorized" });
  const protectedRoute = (body: unknown) => async (route: Route) => {
    if (!(await isAuthenticated(route))) {
      return unauthorized(route);
    }

    return fulfillJson(route, 200, body);
  };
  const commitHistory = {
    target: {
      history: {
        nodes: [{ committedDate: "2026-07-28T09:00:00.000Z" }],
      },
    },
  };

  await page.route(
    "**/api/auth/check",
    protectedRoute({ success: true }),
  );
  await page.route(
    "**/api/users/userheader",
    protectedRoute(
      success({
        login: "e2e-user",
        avatarUrl,
      }),
    ),
  );
  await page.route(
    "**/api/repos/languages",
    protectedRoute(
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
  await page.route(
    "**/api/repos/commitTime",
    protectedRoute(
      success(repositoryData([{ name: "e2e-dashboard", defaultBranchRef: commitHistory }])),
    ),
  );
  await page.route(
    "**/api/repos/projectTopics",
    protectedRoute(
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
  await page.route(
    "**/api/repos/developStats",
    protectedRoute(
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
  await page.route(
    "**/api/repos/projectLiveRate",
    protectedRoute(
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

test.describe("/statpage 직접 접근", () => {
  test("인증 쿠키가 있으면 통계 페이지에 머문다", async ({ context, page }) => {
    await context.addCookies([
      {
        name: "e2e-session",
        value: "authenticated",
        domain: "127.0.0.1",
        path: "/",
      },
    ]);
    await mockStatPageApis(page);

    await page.goto("/");
    await page.goto("/statpage");

    await expect(page).toHaveURL(/\/statpage$/);
    await expect(
      page.getByRole("heading", { name: "Development statistics" }),
    ).toBeVisible();
    await expect(page.getByText("5 sources ready")).toBeVisible();
  });

  test("인증 쿠키가 없으면 홈으로 이동한다", async ({ page }) => {
    test.fail(
      true,
      "StatPage currently remains on /statpage after protected API requests return 401.",
    );
    await mockStatPageApis(page);

    await page.goto("/");
    await page.goto("/statpage");

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("button", { name: "Login with GitHub" }),
    ).toBeVisible();
  });
});
