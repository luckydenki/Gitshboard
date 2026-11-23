import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import PanelError from "~/components/common/PanelError";

const meta = {
    title: "Components/Common/PanelError",
    component: PanelError,
    parameters: { layout: "padded" },
    decorators: [
        (Story) => (
            <div className="bg-panel w-full max-w-md rounded-lg border border-gray-300 p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PanelError>;
export default meta;
type Story = StoryObj<typeof meta>;

// 콜백이 없으면 오류 안내만 표시하고 재시도 버튼은 만들지 않습니다.
export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("alert")).toHaveTextContent("데이터를 불러오지 못했습니다.");
        await expect(canvas.queryByRole("button")).toBeNull();
    },
};

// 재시도 버튼의 마우스·키보드 동작을 검증합니다.
export const WithRetry: Story = {
    args: { onRetry: fn() },
    play: async ({ canvas, args }) => {
        const retry = canvas.getByRole("button", { name: "다시 시도" });
        await userEvent.click(retry);
        await expect(args.onRetry).toHaveBeenCalledTimes(1);
        retry.focus();
        await userEvent.keyboard("{Enter}");
        await expect(args.onRetry).toHaveBeenCalledTimes(2);
    },
};

// 화면별 오류 문구와 재시도 버튼 문구를 지정합니다.
export const CustomMessage: Story = {
    args: {
        title: "통계를 가져오지 못했어요",
        message: "요청이 잠시 제한되었습니다. 잠시 후 다시 확인해 주세요.",
        retryLabel: "통계 다시 불러오기",
        onRetry: fn(),
    },
};

// 좁은 패널에서도 긴 제목·메시지가 줄바꿈되며 넘치지 않는지 확인합니다.
export const NarrowPanel: Story = {
    args: {
        title: "통계정보를불러오는과정에서예상하지못한문제가발생했습니다",
        message:
            "현재 선택한 저장소의 통계 정보를 불러올 수 없습니다. 네트워크 연결 상태를 확인한 뒤 잠시 후 다시 시도해 주세요.",
        onRetry: fn(),
    },
    globals: { viewport: { value: "mobile1", isRotated: false } },
    decorators: [
        (Story) => (
            <div className="w-48">
                <Story />
            </div>
        ),
    ],
    play: async ({ canvas }) => {
        const alert = canvas.getByRole("alert");
        await expect(alert).toBeVisible();
        await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
    },
};
