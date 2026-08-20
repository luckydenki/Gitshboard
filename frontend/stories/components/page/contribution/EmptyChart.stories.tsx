import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { EmptyChart } from "../../../../app/routes/contribute";

const meta = {
    title: "Components/Page/Contribution/EmptyChart",
    component: EmptyChart,
    parameters: { layout: "padded" },
    decorators: [(Story) => <div className="max-w-360 bg-[#f4f6f1] p-6"><Story /></div>],
    args: { message: "No repository commit activity was recorded for this period." },
} satisfies Meta<typeof EmptyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 안내_메시지_표시: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText("No repository commit activity was recorded for this period.")).toBeVisible();
    },
};

