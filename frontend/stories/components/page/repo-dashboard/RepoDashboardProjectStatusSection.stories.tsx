import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import RepoDashboardProjectStatusSection from "../../../../app/routes/repo-dashboard/RepoDashboardProjectStatusSection";
import { QueryKeys } from "../../../../app/types/queryKey/query-key-enum";

const overview = {
    languages: [{ name: "TypeScript", bytes: 100, sharePercent: 100 }],
    totalLanguageBytes: 100,
    diskUsageKb: 2048,
    issuePrCounts: { openIssues: 2, closedIssues: 4, openPullRequests: 1, mergedPullRequests: 8 },
};
const files = {
    fileCount: 12,
    fileTypes: [{ type: "source", count: 12, sharePercent: 100 }],
    frameworks: [{ name: "React", paths: ["package.json"] }],
    healthScore: { present: 1, total: 2 },
    health: [
        { name: "README", present: true },
        { name: "LICENSE", present: false },
    ],
    partial: false,
};
const branches = {
    defaultBranch: "main",
    total: 3,
    active: 2,
    stale: 1,
    oldest: [
        {
            name: "feature/very-long-branch-name-for-responsive-layout-check",
            committedAt: "2026-01-01T00:00:00Z",
        },
    ],
    partial: false,
};
const history = {
    months: [
        { month: "2026-10", fileCount: 10, diskUsageKb: 1024 },
        { month: "2026-11", fileCount: 12, diskUsageKb: 2048 },
    ],
    coverage: { missingFileCountMonths: [], unobservedDiskUsageMonths: [] },
    partial: false,
};
const participation = {
    months: [
        { month: "2026-10", issueAuthors: 2, prAuthors: 1, contributors: 3 },
        { month: "2026-11", issueAuthors: 3, prAuthors: 2, contributors: 4 },
    ],
    latestContributorCount: 4,
    latestContributorMonth: "2026-11",
    partial: false,
};
const deployments = {
    attempts: 5,
    successful: 4,
    completed: 5,
    successRatePercent: 80,
    attemptsPerWeek: 2,
    medianDurationSeconds: 120,
    medianLeadTimeSeconds: 3600,
    peakHour: 12,
    hourBuckets: [{ hour: 12, count: 5 }],
    partial: false,
};
const responses = { overview, files, branches, history, participation, deployments };
const empty = [
    { ...overview, languages: [] },
    { ...files, fileCount: 0, fileTypes: [], frameworks: [], health: [] },
    { ...branches, total: 0, active: 0, stale: 0, oldest: [] },
    { ...history, months: [] },
    { ...participation, months: [], latestContributorCount: null, latestContributorMonth: null },
    { ...deployments, attempts: 0, hourBuckets: [] },
];
const keys = [
    QueryKeys.REPO_DASHBOARD_PROJECT_OVERVIEW,
    QueryKeys.REPO_DASHBOARD_PROJECT_FILES,
    QueryKeys.REPO_DASHBOARD_PROJECT_BRANCHES,
    QueryKeys.REPO_DASHBOARD_PROJECT_HISTORY,
    QueryKeys.REPO_DASHBOARD_PROJECT_PARTICIPATION,
    QueryKeys.REPO_DASHBOARD_PROJECT_DEPLOYMENTS,
];

const meta = {
    title: "Components/Page/RepoDashboard/ProjectStatusSection",
    component: RepoDashboardProjectStatusSection,
    parameters: { layout: "fullscreen", projectState: "default" },
    beforeEach: () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = fn(async (input: RequestInfo | URL, init?: RequestInit) => {
            const endpoint = String(input).split("/project/")[1] as keyof typeof responses;
            if (endpoint in responses)
                return new Response(JSON.stringify({ success: true, data: responses[endpoint] }), {
                    headers: { "Content-Type": "application/json" },
                });
            return originalFetch(input, init);
        });
        return () => {
            globalThis.fetch = originalFetch;
        };
    },
    decorators: [
        (Story, context) => {
            const client = new QueryClient({
                defaultOptions: {
                    queries: { staleTime: Infinity, retry: false, retryOnMount: false },
                },
            });
            const state = context.parameters.projectState;
            Object.values(responses).forEach((data, index) => {
                const queryKey = [keys[index], "octocat", "hello-world"];
                if (state === "loading")
                    void client.fetchQuery({
                        queryKey,
                        queryFn: () => new Promise<never>(() => {}),
                    });
                else if (state === "error")
                    client
                        .getQueryCache()
                        .build(client, { queryKey })
                        .setState({
                            status: "error",
                            fetchStatus: "idle",
                            error: new globalThis.Error("조회 실패"),
                        });
                else
                    client.setQueryData(
                        queryKey,
                        state === "empty"
                            ? empty[index]
                            : state === "partial"
                              ? { ...data, partial: true }
                              : data,
                    );
            });
            return (
                <QueryClientProvider client={client}>
                    <MemoryRouter initialEntries={["/repos/octocat/hello-world"]}>
                        <Routes>
                            <Route
                                path="/repos/:owner/:repo"
                                element={
                                    <div className="bg-gray-100 p-4">
                                        <Story />
                                    </div>
                                }
                            />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );
        },
    ],
} satisfies Meta<typeof RepoDashboardProjectStatusSection>;
export default meta;
type Story = StoryObj<typeof meta>;
// 모든 패널의 데이터와 차트를 표시합니다.
export const Default: Story = {};
// 각 패널의 공통 로딩 스피너를 확인합니다.
export const Loading: Story = {
    parameters: { projectState: "loading" },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getAllByRole("status")).toHaveLength(12);
    },
};
// 데이터가 없는 저장소의 안내를 확인합니다.
export const Empty: Story = { parameters: { projectState: "empty" } };
// 일부만 수집된 데이터의 안내를 확인합니다.
export const Partial: Story = { parameters: { projectState: "partial" } };
// 공통 오류 UI에서 재시도하여 언어 데이터를 복구합니다.
export const Error: Story = {
    parameters: { projectState: "error" },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getAllByRole("alert")).toHaveLength(12);
        await userEvent.click(canvas.getAllByRole("button", { name: "다시 시도" })[0]);
        await expect(await canvas.findByText("TypeScript")).toBeVisible();
    },
};
// 좁은 화면에서 가로 넘침을 확인합니다.
export const Mobile: Story = {
    globals: { viewport: { value: "mobile1", isRotated: false } },
    play: async ({ canvasElement }) => {
        await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    },
};
