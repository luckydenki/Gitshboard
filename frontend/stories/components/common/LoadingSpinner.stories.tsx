import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import LoadingSpinner from "~/components/common/LoadingSpinner";

const meta = {
    title: "Components/Common/LoadingSpinner",
    component: LoadingSpinner,
    parameters: { layout: "centered" },
    args: { size: "md", label: "로딩 중", showLabel: false },
} satisfies Meta<typeof LoadingSpinner>;
export default meta;
type Story = StoryObj<typeof meta>;

// 기본 회전 애니메이션과 스크린 리더용 안내를 확인합니다.
export const Default: Story = {
    play: async ({ canvas }) => {
        const status = canvas.getByRole("status");
        await expect(status).toHaveTextContent("로딩 중");
        const icon = status.querySelector("svg")!;
        await expect(icon).toHaveAttribute("aria-hidden", "true");
        await expect(icon).toHaveClass("animate-spin");
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            await expect(window.getComputedStyle(icon).animationName).not.toBe("none");
        }
    },
};
// 작은 인라인 로딩 아이콘입니다.
export const Small: Story = { args: { size: "sm" } };
// 넓은 로딩 영역에 사용할 큰 아이콘입니다.
export const Large: Story = { args: { size: "lg" } };
// 시각적으로 안내 문구도 함께 표시합니다.
export const WithLabel: Story = {
    args: { showLabel: true, label: "데이터를 불러오는 중입니다" },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("데이터를 불러오는 중입니다")).toBeVisible();
    },
};
// 작은 화면의 제한된 너비에서 긴 문구가 줄바꿈되는지 확인합니다.
export const LongLabel: Story = {
    args: {
        showLabel: true,
        label: "선택한 저장소의 데이터를 불러오고 있습니다. 잠시만 기다려 주세요.",
        className: "w-48",
    },
    globals: { viewport: { value: "mobile1", isRotated: false } },
};
