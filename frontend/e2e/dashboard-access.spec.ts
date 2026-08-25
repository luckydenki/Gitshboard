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

async function mockDashboardApis(page: Page) {
  const unauthorized = (route: Route) =>
    fulfillJson(route, 401, {
      status: 401,
      type: "Unauthorized",
      title: "Unauthorized",
      detail: "Authentication cookie is missing.",
    });
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

  await page.route("**/api/auth/check", async (route) => {
    if (!(await isAuthenticated(route))) {  // 인증 쿠키가 없는 케이스, check는 200으로 오지만 success가 false가 됨
      return {
        status : 200,
        success : false,
        data : null
      }
    }

    return fulfillJson(route, 200, { success: true });
  });

  await page.route("**/api/users/userheader", async (route) => {
    if (!(await isAuthenticated(route))) {
      return unauthorized(route);
    }

    return fulfillJson(route, 200, {
      success: true,
      status: 200,
      data: { login: user.login, avatarUrl },
    });
  });

  await page.route("**/api/users/repos", async (route) => {
    if (!(await isAuthenticated(route))) {
      return unauthorized(route);
    }

    return fulfillJson(route, 200, {
      success: true,
      status: 200,
      data: {
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
      },
    });
  });

  await page.route("**/api/users", async (route) => {
    if (!(await isAuthenticated(route))) {
      return unauthorized(route);
    }

    return fulfillJson(route, 200, {
      success: true,
      status: 200,
      data: user,
    });
  });
}

test.describe("/dashboard 직접 접근", () => {
  test("인증 쿠키가 있으면 대시보드에 머문다", async ({ context, page }) => {
    await context.addCookies([
      {
        name: "e2e-session",
        value: "authenticated",
        domain: "127.0.0.1",
        path: "/",
      },
    ]);
    await mockDashboardApis(page);

    await page.goto("/");
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: "E2E User's workspace" }),
    ).toBeVisible();
  });

  test("인증 쿠키가 없으면 홈으로 이동한다", async ({ page }) => {
    await mockDashboardApis(page);

    await page.goto("/");
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("button", { name: "Login with GitHub" }),
    ).toBeVisible();
  });
});
