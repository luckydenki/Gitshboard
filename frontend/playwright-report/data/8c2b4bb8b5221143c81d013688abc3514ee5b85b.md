# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: statpage-access.spec.ts >> /statpage 직접 접근 >> 인증 쿠키가 없으면 홈으로 이동한다
- Location: e2e\statpage-access.spec.ts:152:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/$/
Received string:  "http://127.0.0.1:5173/statpage"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://127.0.0.1:5173/statpage"

```

```yaml
- banner:
  - link "Gitshboard":
    - /url: /dashboard
  - navigation:
    - link "Profile":
      - /url: /dashboard
    - link "Statistics":
      - /url: /statpage
  - form "Search for github users":
    - textbox "Search for github users input field":
      - /placeholder: Search for users
    - button "Search users":
      - img
  - button "avatar":
    - img "avatar"
- main:
  - paragraph: Account analytics
  - heading "Development statistics" [level=1]
  - paragraph: Repository activity, technology usage, and project health in one workspace.
  - paragraph: Data sources
  - paragraph: Syncing APIs
  - article:
    - paragraph: Analyzed repos
    - paragraph: "-"
    - paragraph: 0 forks included
  - article:
    - paragraph: Recent commits
    - paragraph: "-"
    - paragraph: Fetched default branch history
  - article:
    - paragraph: Active projects
    - paragraph: "-"
    - paragraph: Pushed within 30 days
  - article:
    - paragraph: Primary stack
    - paragraph: "-"
    - paragraph: By total code size
  - article:
    - paragraph: Languages
    - heading "Technology distribution" [level=2]
    - paragraph: Code volume across repositories
  - article:
    - paragraph: Commit rhythm
    - heading "Weekly activity" [level=2]
    - paragraph: Default branch commit frequency
  - article:
    - paragraph: Work pattern
    - heading "Preferred commit time" [level=2]
    - paragraph: Activity by time of day
    - paragraph: Strongest window
  - article:
    - paragraph: Development profile
    - heading "Working style" [level=2]
    - paragraph: Inferred from time, stack, and topics
  - article:
    - paragraph: Project types
    - heading "Repository categories" [level=2]
    - paragraph: Inferred from names and topics
  - paragraph: Project health
  - heading "Repository activity" [level=2]
  - paragraph: Recency, archive state, and ownership
  - text: active dormant archived
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
  - paragraph
```

# Test source

```ts
  62  |         repositoryData([
  63  |           {
  64  |             name: "e2e-dashboard",
  65  |             languages: {
  66  |               totalSize: 100,
  67  |               edges: [
  68  |                 { size: 80, node: { name: "TypeScript" } },
  69  |                 { size: 20, node: { name: "CSS" } },
  70  |               ],
  71  |             },
  72  |           },
  73  |         ]),
  74  |       ),
  75  |     ),
  76  |   );
  77  |   await page.route(
  78  |     "**/api/repos/commitTime",
  79  |     protectedRoute(
  80  |       success(repositoryData([{ name: "e2e-dashboard", defaultBranchRef: commitHistory }])),
  81  |     ),
  82  |   );
  83  |   await page.route(
  84  |     "**/api/repos/projectTopics",
  85  |     protectedRoute(
  86  |       success(
  87  |         repositoryData([
  88  |           {
  89  |             name: "e2e-dashboard",
  90  |             repositoryTopics: { nodes: [{ topic: { name: "react" } }] },
  91  |           },
  92  |         ]),
  93  |       ),
  94  |     ),
  95  |   );
  96  |   await page.route(
  97  |     "**/api/repos/developStats",
  98  |     protectedRoute(
  99  |       success(
  100 |         repositoryData([
  101 |           {
  102 |             name: "e2e-dashboard",
  103 |             defaultBranchRef: commitHistory,
  104 |             languages: { edges: [{ node: { name: "TypeScript" } }] },
  105 |             repositoryTopics: { nodes: [{ topic: { name: "react" } }] },
  106 |           },
  107 |         ]),
  108 |       ),
  109 |     ),
  110 |   );
  111 |   await page.route(
  112 |     "**/api/repos/projectLiveRate",
  113 |     protectedRoute(
  114 |       success(
  115 |         repositoryData([
  116 |           {
  117 |             name: "e2e-dashboard",
  118 |             createdAt: "2025-01-01T09:00:00.000Z",
  119 |             pushedAt: "2026-07-28T09:00:00.000Z",
  120 |             updatedAt: "2026-07-28T09:00:00.000Z",
  121 |             isArchived: false,
  122 |             isFork: false,
  123 |           },
  124 |         ]),
  125 |       ),
  126 |     ),
  127 |   );
  128 | }
  129 | 
  130 | test.describe("/statpage 직접 접근", () => {
  131 |   test("인증 쿠키가 있으면 통계 페이지에 머문다", async ({ context, page }) => {
  132 |     await context.addCookies([
  133 |       {
  134 |         name: "e2e-session",
  135 |         value: "authenticated",
  136 |         domain: "127.0.0.1",
  137 |         path: "/",
  138 |       },
  139 |     ]);
  140 |     await mockStatPageApis(page);
  141 | 
  142 |     await page.goto("/");
  143 |     await page.goto("/statpage");
  144 | 
  145 |     await expect(page).toHaveURL(/\/statpage$/);
  146 |     await expect(
  147 |       page.getByRole("heading", { name: "Development statistics" }),
  148 |     ).toBeVisible();
  149 |     await expect(page.getByText("5 sources ready")).toBeVisible();
  150 |   });
  151 | 
  152 |   test("인증 쿠키가 없으면 홈으로 이동한다", async ({ page }) => {
  153 |     test.fail(
  154 |       true,
  155 |       "StatPage currently remains on /statpage after protected API requests return 401.",
  156 |     );
  157 |     await mockStatPageApis(page);
  158 | 
  159 |     await page.goto("/");
  160 |     await page.goto("/statpage");
  161 | 
> 162 |     await expect(page).toHaveURL(/\/$/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  163 |     await expect(
  164 |       page.getByRole("button", { name: "Login with GitHub" }),
  165 |     ).toBeVisible();
  166 |   });
  167 | });
  168 | 
```