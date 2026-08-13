import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import ContributionHeader from "../../../../app/components/page/contribution/ContributionHeader";

const formatPeriod = (startTime: string, endTime: string) =>
    `${new Date(startTime).toLocaleDateString()} - ${new Date(endTime).toLocaleDateString()}`;

const meta = {
    title: "Components/Page/Contribution/ContributionHeader",
    component: ContributionHeader,
    parameters: { layout: "padded" },
    decorators: [(Story) => <div className="max-w-360 bg-[#f4f6f1] p-6"><Story /></div>],
    args: {
        startTime: "2026-08-01T00:00:00.000Z",
        endTime: "2026-08-05T00:00:00.000Z",
    },
} satisfies Meta<typeof ContributionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 커밋_활동_기간: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("heading", { name: "Commit activity" })).toBeVisible();
        await expect(canvas.getByText(formatPeriod("2026-08-01T00:00:00.000Z", "2026-08-05T00:00:00.000Z"))).toBeVisible();
    },
};

export const 단일_기간: Story = {
    args: {
        startTime: "2026-08-05T00:00:00.000Z",
        endTime: "2026-08-05T00:00:00.000Z",
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText(formatPeriod("2026-08-05T00:00:00.000Z", "2026-08-05T00:00:00.000Z"))).toBeVisible();
    },
};
