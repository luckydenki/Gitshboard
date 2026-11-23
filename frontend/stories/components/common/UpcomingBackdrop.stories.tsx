import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import UpcomingBackdrop from "~/components/common/UpcomingBackdrop";
const meta = {
    title: "Components/Common/UpcomingBackdrop",
    component: UpcomingBackdrop,
    parameters: { layout: "padded" },
} satisfies Meta<typeof UpcomingBackdrop>;
export default meta;
type Story = StoryObj<typeof meta>;
// 미구현 콘텐츠에 같은 백드롭 안내를 표시합니다.
export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText("추후 업데이트 예정")).toBeVisible();
    },
};
// 좁은 화면에서도 문구가 읽히는지 확인합니다.
export const Mobile: Story = { globals: { viewport: { value: "mobile1", isRotated: false } } };
