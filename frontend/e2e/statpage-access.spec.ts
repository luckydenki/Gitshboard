import { expect, test, type Page, type Route } from "playwright/test";
import { statPageApiData } from "./statpage-fixtures";

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

const success = <T>(data: T) => ({ success: true, status: 200, data });

async function mockStatPageApis(page: Page) {
  const unauthorized = (route: Route) =>
    fulfillJson(route, 401, {
      status: 401,
      type: "Unauthorized",
      title: "Unauthorized",
      detail: "Authentication cookie is missing.",
    });

    //projectedRoute는 인증 여부를 확인하고,
    // 인증이 되어있으면 정상 응답을, 인증이 안되어있으면 401을 반환하는 함수입니다.
  const protectedRoute = (body: unknown) => async (route: Route) => {
    if (!(await isAuthenticated(route))) {
      return unauthorized(route);
    }

    return fulfillJson(route, 200, body);
  };
  await page.route(
    "**/api/auth/check",
    async (route) => {
      if (!(await isAuthenticated(route))) {
        return fulfillJson(route, 200, {
          success: false,
          status : 200,
          data : null,
        });
      }
    }
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
    protectedRoute(success(statPageApiData.languages)),
  );
  await page.route(
    "**/api/repos/commitTime",
    protectedRoute(success(statPageApiData.commitTime)),
  );
  await page.route(
    "**/api/repos/projectTopics",
    protectedRoute(success(statPageApiData.projectTopics)),
  );
  await page.route(
    "**/api/repos/developStats",
    protectedRoute(success(statPageApiData.developStats)),
  );
  await page.route(
    "**/api/repos/projectLiveRate",
    protectedRoute(success(statPageApiData.projectLiveRate)),
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
    await expect(page.getByText("TypeScript", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("12", { exact: true }).first()).toBeVisible();
  });

  test("인증 쿠키가 없으면 홈으로 이동한다", async ({ page }) => {
    await mockStatPageApis(page);

    await page.goto("/");
    await page.goto("/statpage");

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("button", { name: "Login with GitHub" }),
    ).toBeVisible();
  });
});
