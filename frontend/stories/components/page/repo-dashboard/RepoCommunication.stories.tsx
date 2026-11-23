import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import { expect, userEvent } from "storybook/test";
import RepoDashboardCommunicationSection from "~/routes/repo-dashboard/RepoDashboardCommunicationSection";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type { GetRepoCommunicationData } from "~/types/response/repo-communication";
const fixtures: Record<string, GetRepoCommunicationData> = {
    contributors: {
        asOf: "2026-11-23T00:00:00Z",
        contributors: {
            status: "complete",
            value: {
                totalEntries: 1,
                top: [
                    {
                        login: "octocat",
                        avatarUrl: "/Gitshboard_logo.png",
                        url: "https://github.com/octocat",
                        commits: 100,
                        sharePercent: 100,
                    },
                ],
            },
        },
    },
    onboarding: {
        asOf: "2026-11-23T00:00:00Z",
        openIssues: {
            status: "complete",
            value: { total: 4, goodFirstIssueCount: 2, helpWantedCount: 1, assignedPercent: 25 },
        },
    },
    discussions: {
        asOf: "2026-11-23T00:00:00Z",
        distribution: {
            status: "complete",
            value: { total: 1, categories: [{ id: "qa", name: "Q&A", count: 1, percent: 100 }] },
        },
        responses: {
            status: "complete",
            value: { answerableCount: 1, answeredCount: 1, answeredPercent: 100 },
        },
        popular: {
            status: "complete",
            value: [
                {
                    number: 1,
                    title: "Discussion title",
                    url: "https://github.com/example/repo/discussions/1",
                    categoryName: "Q&A",
                    topLevelCommentCount: 3,
                    upvoteCount: 5,
                    recentActivity: 2,
                    uniqueCommenterCount: 2,
                    score: 1,
                    elapsedDays: 1,
                },
            ],
        },
    },
    releases: {
        asOf: "2026-11-23T00:00:00Z",
        releases: {
            status: "complete",
            value: {
                count: 6,
                monthlyAverage: 1,
                months: 6,
                includePrereleases: true,
                period: { from: "2026-05-23T00:00:00Z", to: "2026-11-23T00:00:00Z" },
            },
        },
    },
};
function scenario(mode = "default") {
    return function Decorator(Story: React.ComponentType) {
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    staleTime: Infinity,
                    queryFn: async () => fixtures.contributors,
                },
            },
        });
        for (const [endpoint, fixture] of Object.entries(fixtures)) {
            const queryKey = [QueryKeys.REPO_COMMUNICATION, "owner", "repo", endpoint];
            if (mode === "loading") {
                client.setQueryDefaults(queryKey, { queryFn: () => new Promise(() => {}) });
                continue;
            }
            let data = structuredClone(fixture);
            if (mode === "empty") {
                if (data.contributors?.value)
                    data.contributors.value = { totalEntries: 0, top: [] };
                if (data.distribution?.value)
                    data.distribution.value = { total: 0, categories: [] };
                if (data.popular) data.popular.value = [];
            }
            if (mode === "partial")
                for (const key of [
                    "contributors",
                    "openIssues",
                    "distribution",
                    "responses",
                    "popular",
                    "releases",
                ] as const)
                    if (data[key]) Object.assign(data[key]!, { status: "partial", value: null });
            if (mode === "long" && data.popular?.value)
                data.popular.value[0].title = "LongDiscussionTitle".repeat(30);
            client.setQueryData(queryKey, data);
            if (mode === "error")
                client
                    .getQueryCache()
                    .find({ queryKey })
                    ?.setState({ status: "error", error: new globalThis.Error("조회 실패") });
        }
        return (
            <QueryClientProvider client={client}>
                <MemoryRouter initialEntries={["/repo/owner/repo"]}>
                    <Routes>
                        <Route
                            path="/repo/:owner/:repo"
                            element={<Story />}
                        />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    };
}
const meta = {
    title: "Components/Page/RepoDashboard/Communication",
    component: RepoDashboardCommunicationSection,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RepoDashboardCommunicationSection>;
export default meta;
type Story = StoryObj<typeof meta>;
// 실제 집계와 유지된 C 예시를 함께 보여준다.
export const Default: Story = {
    decorators: [scenario()],
    play: async ({ canvas }) => {
        await expect(canvas.getByText("@octocat")).toBeVisible();
        await expect(canvas.getByText("기여 시작 난이도")).toBeVisible();
        // 원래의 개별 지표 카드와 담당자 막대 위치를 유지합니다.
        const firstIssue = canvas.getByRole("heading", { name: "good first issue", exact: true });
        const helpWanted = canvas.getByRole("heading", { name: "help wanted", exact: true });
        await expect(firstIssue.closest("article")).not.toBe(helpWanted.closest("article"));
        await expect(canvas.queryByRole("heading", { name: "기여 시작 안내" })).toBeNull();
        await expect(canvas.getByText("담당자 명시").closest("article")).toHaveTextContent(
            "Issue 안내의 명확성",
        );
    },
};
// 빈 목록 상태.
export const Empty: Story = { decorators: [scenario("empty")] };
// 패널별 스켈레톤 상태.
export const Loading: Story = { decorators: [scenario("loading")] };
// 실패 후 재조회 버튼 동작.
export const Error: Story = {
    decorators: [scenario("error")],
    play: async ({ canvas }) => {
        const buttons = canvas.getAllByRole("button", { name: "다시 시도" });
        await expect(buttons[0]).toBeEnabled();
        await userEvent.click(buttons[0]);
    },
};
// 불완전 집계를 실제 통계로 표시하지 않는다.
export const Partial: Story = { decorators: [scenario("partial")] };
// 긴 제목과 모바일 화면에서 줄바꿈을 확인한다.
export const Mobile: Story = {
    decorators: [scenario("long")],
    globals: { viewport: { value: "mobile1", isRotated: false } },
};
