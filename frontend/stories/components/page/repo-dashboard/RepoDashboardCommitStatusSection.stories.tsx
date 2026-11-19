import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import RepoDashboardCommitStatusSection from "../../../../app/routes/repo-dashboard/RepoDashboardCommitStatusSection";
import { commitOverview, commitRecords } from "../../../../mock/storybook/repo-commit-status";
import { QueryKeys } from "../../../../app/types/queryKey/query-key-enum";

const meta = { title: "Components/Page/RepoDashboard/CommitStatusSection", component: RepoDashboardCommitStatusSection,
    parameters: { layout: "fullscreen" } } satisfies Meta<typeof RepoDashboardCommitStatusSection>;
export default meta;
type Story = StoryObj<typeof meta>;

function withData(overview = commitOverview, records = commitRecords, loading = false) {
    return (Story: ComponentType) => {
        const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
        if (!loading) {
            client.setQueryData([QueryKeys.REPO_DASHBOARD_COMMIT_STATUS_OVERVIEW, "octocat", "hello-world"], overview);
            client.setQueryData([QueryKeys.REPO_DASHBOARD_COMMIT_STATUS_RECORDS, "octocat", "hello-world"], records);
        } else {
            void client.fetchQuery({ queryKey: [QueryKeys.REPO_DASHBOARD_COMMIT_STATUS_OVERVIEW, "octocat", "hello-world"],
                queryFn: () => new Promise<never>(() => {}) });
            void client.fetchQuery({ queryKey: [QueryKeys.REPO_DASHBOARD_COMMIT_STATUS_RECORDS, "octocat", "hello-world"],
                queryFn: () => new Promise<never>(() => {}) });
        }
        return <QueryClientProvider client={client}><MemoryRouter initialEntries={["/repos/octocat/hello-world"]}>
            <Routes><Route path="/repos/:owner/:repo" element={<Story />} /></Routes>
        </MemoryRouter></QueryClientProvider>;
    };
}

// 정상 응답에서 모든 카드와 세 그래프를 표시합니다.
export const Default: Story = { decorators: [withData()] };
// 커밋이 없는 저장소의 빈 결과를 표시합니다.
export const Empty: Story = { decorators: [withData({ ...commitOverview,
    yearly: { status: "complete", value: { ...commitOverview.yearly.value!, count: 0 } },
}, { ...commitRecords, totalCommits: { status: "complete", value: 0 } })] };
// GitHub 페이지 제한으로 일부만 수집된 경우를 표시합니다.
export const Partial: Story = { decorators: [withData({ ...commitOverview,
    weekly: { status: "partial", value: null, reason: "수집 한도 초과" },
})] };
// 두 API가 응답하기 전의 로딩 상태를 표시합니다.
export const Loading: Story = { decorators: [withData(commitOverview, commitRecords, true)] };
