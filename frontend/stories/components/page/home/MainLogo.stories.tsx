import type { Meta, StoryObj } from "@storybook/react-vite";
import MainLogo from "../../../../app/components/page/home/MainLogo";

const meta = {
    title: "Components/Page/Home/MainLogo",
    component: MainLogo,
    parameters: { layout: "centered" },
} satisfies Meta<typeof MainLogo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mobile: Story = {
    parameters: { viewport: { options: { narrow: { name: "Mobile", styles: { width: "375px", height: "667px" } } } } },
    globals: { viewport: { value: "narrow", isRotated: false } },
};
