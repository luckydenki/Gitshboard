import type { Meta, StoryObj } from "@storybook/react-vite";
import MainLogo from "../../../../app/components/page/home/MainLogo";

const meta = {
    title: "Components/Page/Home/MainLogo",
    component: MainLogo,
    parameters: { layout: "centered" },
} satisfies Meta<typeof MainLogo>;
export default meta;
type Story = StoryObj<typeof meta>;
// 기본 화면 크기의 로고입니다.
export const Default: Story = {};
// 모바일 화면에서 텍스트 로고를 표시하는 사례입니다.
export const Mobile: Story = {
    parameters: { viewport: { options: { narrow: { name: "모바일", styles: { width: "375px", height: "667px" } } } } },
    globals: { viewport: { value: "narrow", isRotated: false } },
};
