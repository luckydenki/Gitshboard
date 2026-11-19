import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import RepoCommitStatusQueryState from "../../../../app/components/page/repo-dashboard/RepoCommitStatusQueryState";

const meta = { title: "Components/Page/RepoDashboard/CommitStatusQueryState",
    component: RepoCommitStatusQueryState, args: { state: "loading", onRetry: fn() } } satisfies Meta<typeof RepoCommitStatusQueryState>;
export default meta;
type Story = StoryObj<typeof meta>;
// API 응답을 기다리는 스켈레톤입니다.
export const Loading: Story = {};
// 조회 오류에서 다시 시도 버튼을 표시합니다.
export const Error: Story = { args: { state: "error" },
    // 버튼을 누르면 재시도 콜백이 호출되는지 확인합니다.
    play: async ({ canvas, args }) => {
        await userEvent.click(canvas.getByRole("button", { name: "다시 시도" }));
        await expect(args.onRetry).toHaveBeenCalledOnce();
    } };
// 커밋이 없는 결과입니다.
export const Empty: Story = { args: { state: "empty" } };
// 일부 커밋 페이지만 수집된 결과입니다.
export const Partial: Story = { args: { state: "partial" } };
