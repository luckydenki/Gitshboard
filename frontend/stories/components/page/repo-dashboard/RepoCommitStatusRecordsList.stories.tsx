import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import RepoCommitStatusRecordsList from "../../../../app/components/page/repo-dashboard/RepoCommitStatusRecordsList";
import { commitRecords } from "../../../../mock/storybook/repo-commit-status";

const meta = {
    title: "Components/Page/RepoDashboard/CommitStatusRecordsList",
    component: RepoCommitStatusRecordsList,
    args: { records: commitRecords, loading: false, error: false, onRetry: fn() },
} satisfies Meta<typeof RepoCommitStatusRecordsList>;
export default meta;
type Story = StoryObj<typeof meta>;
// 최근 1년의 전적 카드 8개를 표시합니다.
export const Default: Story = {};
// 전적 조회 중 스켈레톤을 표시합니다.
export const Loading: Story = { args: { loading: true } };
// 전적 조회 실패와 다시 시도 버튼을 표시합니다.
export const Error: Story = {
    args: { error: true },
    // 버튼을 누르면 전적 조회를 다시 요청하는지 확인합니다.
    play: async ({ canvas, args }) => {
        await userEvent.click(canvas.getByRole("button", { name: "다시 시도" }));
        await expect(args.onRetry).toHaveBeenCalledOnce();
    },
};
// 수집 범위에 커밋이 없는 전적입니다.
export const Empty: Story = {
    args: { records: { ...commitRecords, totalCommits: { status: "complete", value: 0 } } },
};
// 일부 페이지만 수집되어 수치를 숨깁니다.
export const Partial: Story = {
    args: {
        records: {
            ...commitRecords,
            totalCommits: { status: "partial", value: null, reason: "수집 한도 초과" },
        },
    },
};
