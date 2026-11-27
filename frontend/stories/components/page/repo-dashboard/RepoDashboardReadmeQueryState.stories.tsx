import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import RepoDashboardReadmeQueryState from "../../../../app/components/page/repo-dashboard/RepoDashboardReadmeQueryState";

const meta = {
    title: "Components/Page/RepoDashboard/ReadmeQueryState",
    component: RepoDashboardReadmeQueryState,
    args: { kind: "listLoading", onRetry: fn() },
} satisfies Meta<typeof RepoDashboardReadmeQueryState>;
export default meta;
type Story = StoryObj<typeof meta>;

// README 목록 로딩 스켈레톤을 표시합니다.
export const ListLoading: Story = {};
// README 본문 로딩 스켈레톤을 표시합니다.
export const ContentLoading: Story = { args: { kind: "contentLoading" } };
// 빈 저장소의 안내 문구를 표시합니다.
export const Empty: Story = { args: { kind: "empty" } };
// 목록 오류의 재시도 버튼을 누르면 콜백이 실행됩니다.
export const ListError: Story = {
    args: { kind: "listError" },
    play: async ({ canvas, args }) => {
        await userEvent.click(canvas.getByRole("button", { name: "다시 시도" }));
        await expect(args.onRetry).toHaveBeenCalledOnce();
    },
};
// 본문 오류의 재시도 버튼을 표시합니다.
export const ContentError: Story = { args: { kind: "contentError" } };

// 좁은 화면에서 오류 문구와 재시도 버튼을 표시합니다.
export const Mobile: Story = {
    args: { kind: "contentError" },
    parameters: { viewport: { defaultViewport: "mobile1" } },
};
