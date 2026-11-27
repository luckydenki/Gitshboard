import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import RepoDashboardPopularIssueList from "../../../../app/components/page/repo-dashboard/RepoDashboardPopularIssueList";
const meta = {
    title: "Components/Page/RepoDashboard/PopularIssueList",
    component: RepoDashboardPopularIssueList,
    args: { loading: false, error: false, onRetry: fn() },
} satisfies Meta<typeof RepoDashboardPopularIssueList>;
export default meta;
type Story = StoryObj<typeof meta>;
// 댓글과 반응을 표시하는 기본 상태입니다.
export const Default: Story = {
    args: {
        data: {
            asOf: "2026-11-23T00:00:00Z",
            status: "complete",
            reason: null,
            issues: [
                {
                    number: 12,
                    title: "오래된 Issue에 새로운 관심이 모였습니다",
                    url: "https://github.com/example/repo/issues/12",
                    comments: 10,
                    reactions: 8,
                    reactionCounts: { "+1": 8 },
                    score: 1.2,
                    lastActivityAt: "2026-11-22T00:00:00Z",
                },
            ],
        },
    },
};
// 열린 Issue가 없는 경우입니다.
export const Empty: Story = {
    args: { data: { asOf: "2026-11-23T00:00:00Z", status: "complete", reason: null, issues: [] } },
};
// 수집 중인 경우입니다.
export const Loading: Story = { args: { loading: true } };
// 부분 수집한 순위를 숨기는 경우입니다.
export const Partial: Story = {
    args: {
        data: {
            asOf: "2026-11-23T00:00:00Z",
            status: "partial",
            reason: "수집 제한",
            issues: null,
        },
    },
};
// 오류 시 다시 시도 버튼을 실행합니다.
export const Error: Story = {
    args: { error: true },
    play: async ({ canvas, args }) => {
        await userEvent.click(canvas.getByRole("button", { name: "다시 시도" }));
        await expect(args.onRetry).toHaveBeenCalled();
    },
};
