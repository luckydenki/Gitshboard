import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import RepoDashboardIssueStatsSection from "../../../../app/components/page/repo-dashboard/RepoDashboardIssueStatsSection";
import RepoDashboardPullRequestStatsSection from "../../../../app/components/page/repo-dashboard/RepoDashboardPullRequestStatsSection";
import type {
    GetRepoIssueStatsData,
    GetRepoPullRequestStatsData,
    Metric,
} from "../../../../app/types/response/repo-pr-issue";

const done = <T,>(value: T): Metric<T> => ({ status: "complete", value });
const basis = {
    asOf: "2026-11-23T00:00:00Z",
    timezone: "UTC",
    period: { from: "2026-10-26T00:00:00Z", to: "2026-11-23T00:00:00Z" },
};
const duration = { samples: 2, medianSeconds: 3600, p90Seconds: 5400 };
const issues: GetRepoIssueStatsData = {
    ...basis,
    stats: done({
        totals: { open: 5, closed: 7, total: 12 },
        flow: {
            opened: 5,
            closed: 2,
            closeToOpenPercent: 40,
            net: 3,
            weeks: [
                { from: "2026-10-26T00:00:00Z", to: "2026-11-02T00:00:00Z", opened: 1, closed: 1 },
                { from: "2026-11-02T00:00:00Z", to: "2026-11-09T00:00:00Z", opened: 2, closed: 0 },
                { from: "2026-11-09T00:00:00Z", to: "2026-11-16T00:00:00Z", opened: 1, closed: 0 },
                { from: "2026-11-16T00:00:00Z", to: "2026-11-23T00:00:00Z", opened: 1, closed: 1 },
            ],
        },
        openAge: [{ label: "7일 이하", count: 5, percent: 100 }],
        labels: [{ label: "bug", count: 3, percent: 60 }],
        commentDistribution: [{ label: "1~3개", count: 5, percent: 100 }],
        participation: { unassigned: 3, goodFirstIssue: 2 },
        closeDuration: duration,
        closeDurationByType: [{ type: "Bug", duration }],
        closeReasons: [
            { label: "완료", count: 6, percent: 85.7 },
            { label: "중복", count: 1, percent: 14.3 },
        ],
    }),
    milestones: done([{ number: 2, title: "릴리스 준비", open: 1, closed: 4, percent: 80 }]),
};
const pulls: GetRepoPullRequestStatsData = {
    ...basis,
    totals: done({ open: 4, merged: 30, closedUnmerged: 3 }),
    draft: done({ count: 2, total: 4, percent: 50 }),
    overview: done({
        outcomes: { merged: 4, closedUnmerged: 1, mergedPercent: 80 },
        mergeTime: duration,
        bots: { count: 1, unknown: 0, total: 5, percent: 20 },
    }),
    firstReview: done(duration),
    sizeStats: done({
        sizes: [{ label: "100줄 이하", count: 5, percent: 100 }],
        meanChangedFiles: 2.2,
        mergeTimeBySize: [{ size: "100줄 이하", duration }],
    }),
    collaboration: done({ samples: 5, meanReviews: 2, meanComments: 3.2, meanParticipants: 2.4 }),
    linkedIssues: done({ linkedPrs: 1, totalPrs: 5, referencedIssues: 2 }),
};

type Props = {
    issueData?: GetRepoIssueStatsData;
    pullData?: GetRepoPullRequestStatsData;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
};

function DashboardStories({ issueData, pullData, ...state }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <RepoDashboardIssueStatsSection
                data={issueData}
                {...state}
            />
            <RepoDashboardPullRequestStatsSection
                data={pullData}
                {...state}
            />
        </div>
    );
}

const meta = {
    title: "Components/Page/RepoDashboard/PullRequestIssueStats",
    component: DashboardStories,
} satisfies Meta<typeof DashboardStories>;
export default meta;
type Story = StoryObj<typeof meta>;

// 실제 API와 같은 응답을 표시하며 기간·봇 필터 문구가 맞는지 확인합니다.
export const Default: Story = {
    args: { issueData: issues, pullData: pulls },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("전체 기간 · 현재 닫힌 Issue")).toBeVisible();
        await expect(
            canvas.getByText("GitHub 봇 제외 · 일반 댓글과 코드 리뷰 댓글 포함"),
        ).toBeVisible();
        await expect(canvas.getByText("3.2")).toBeVisible();
        await expect(canvas.getByText("릴리스 준비")).toBeVisible();
    },
};

// 서버 데이터 대기 중 각 카드의 로딩 상태를 표시합니다.
export const Loading: Story = {
    args: { loading: true },
    play: async ({ canvas }) => {
        await expect(canvas.getAllByRole("status").length).toBeGreaterThan(2);
    },
};

// 결과가 비었을 때 숫자를 임의로 채우지 않습니다.
export const Empty: Story = {
    args: { issueData: { ...issues, milestones: done([]) } },
    play: async ({ canvas }) => {
        await expect(canvas.getAllByText("집계할 데이터가 없습니다.").length).toBeGreaterThan(0);
    },
};

// 부분 수집한 카드에서는 재시도를 제공하고 다른 지표는 유지합니다.
export const Partial: Story = {
    args: {
        issueData: issues,
        pullData: {
            ...pulls,
            collaboration: {
                status: "partial",
                value: null,
                reason: "댓글을 모두 수집하지 못했습니다.",
            },
        },
        onRetry: fn(),
    },
    play: async ({ canvas, args }) => {
        await expect(canvas.getByText("댓글을 모두 수집하지 못했습니다.")).toBeVisible();
        await userEvent.click(canvas.getByRole("button", { name: "다시 시도" }));
        await expect(args.onRetry).toHaveBeenCalledOnce();
    },
};

// 요청 전체가 실패한 경우 재시도할 수 있습니다.
export const Failure: Story = {
    args: { error: "저장소 통계를 불러오지 못했습니다.", onRetry: fn() },
    play: async ({ canvas, args }) => {
        await userEvent.click(canvas.getAllByRole("button", { name: "다시 시도" })[0]);
        await expect(args.onRetry).toHaveBeenCalledOnce();
    },
};

// 좁은 화면에서 패널이 가로로 넘치지 않습니다.
export const Mobile: Story = {
    args: { issueData: issues, pullData: pulls },
    globals: { viewport: { value: "mobile1", isRotated: false } },
    play: async ({ canvasElement }) => {
        await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth + 1);
    },
};
