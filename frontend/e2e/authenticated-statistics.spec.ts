import { expect, test, type Page, type Route } from "playwright/test";
import { statPageApiData } from "./statpage-fixtures";

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


  //이제 check 계약은 토큰이 유효한지만 확인하는 api이기 때문에
  //실패하든 성공하든 200으로 오며, success 만으로 구분지어야 합니다.
  await page.route("**/api/auth/check", (route) =>
    route.fulfill({     //route.fulfill은 요청을 가로채서
                        //응답을 직접 만들어서 반환하는 역할을 한다.
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        status : 200,
        data : null,
      }),
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
    fulfillJson(
      route,
      success({
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
    ),
  );

  await page.route("**/api/users", (route) => fulfillJson(route, success(user)));

  await page.route("**/api/repos/languages", (route) =>
    fulfillJson(route, success(statPageApiData.languages)),
  );

  await page.route("**/api/repos/commitTime", (route) =>
    fulfillJson(route, success(statPageApiData.commitTime)),
  );

  await page.route("**/api/repos/projectTopics", (route) =>
    fulfillJson(route, success(statPageApiData.projectTopics)),
  );

  await page.route("**/api/repos/developStats", (route) =>
    fulfillJson(route, success(statPageApiData.developStats)),
  );

  await page.route("**/api/repos/projectLiveRate", (route) =>
    fulfillJson(route, success(statPageApiData.projectLiveRate)),
  );
}

test("GitHub OAuth 로그인 후 대시보드와 통계 화면을 확인한다", async ({ page }) => {
  await mockAuthenticatedApis(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Login with GitHub" }).click();

  await expect(page).toHaveURL(/\/dashboard$/); //
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
  await expect(page.getByText("TypeScript", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("12", { exact: true }).first()).toBeVisible();
});
