import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import ContributionHeader from "../../../../app/components/page/contribution/ContributionHeader";
import { commitActivityFixture } from "./fixtures";

const meta = {
    title: "Components/Page/Contribution/ContributionHeader",
    component: ContributionHeader,
    parameters: { layout: "padded" },
    decorators: [(Story) => <div className="max-w-360 bg-[#f4f6f1] p-6"><Story /></div>],
    args: {
        commitOccuredAt: commitActivityFixture.commitOccuredAt,
    },
} satisfies Meta<typeof ContributionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 커밋_활동_기간: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("heading", { name: "Commit activity" })).toBeVisible();
        await expect(canvas.getByText("Aug 1 – Aug 5")).toBeVisible();
    },
};

export const 활동_기록_없음: Story = {
    args: { commitOccuredAt: [] },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("No activity recorded")).toBeVisible();
    },
};

