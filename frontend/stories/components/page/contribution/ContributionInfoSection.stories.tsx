import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import ContributionInfoSection from "../../../../app/components/page/contribution/ContributionInfoSection";
import { commitActivityFixture } from "./fixtures";

const meta = {
    title: "Components/Page/Contribution/ContributionInfoSection",
    component: ContributionInfoSection,
    parameters: { layout: "padded" },
    decorators: [(Story) => <div className="max-w-360 bg-[#f4f6f1] p-6"><Story /></div>],
    args: {
        data: commitActivityFixture,
        isLoading: false,
    },
} satisfies Meta<typeof ContributionInfoSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 커밋_요약_표시: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText("Total commits")).toBeVisible();
        await expect(canvas.getByText("18")).toBeVisible();
        await expect(canvas.getByText("Repositories")).toBeVisible();
        await expect(canvas.getByText("Active days")).toBeVisible();
    },
};

export const 로딩_상태: Story = {
    args: { data: undefined, isLoading: true },
    play: async ({ canvas }) => {
        await expect(canvas.getAllByText("–")).toHaveLength(3);
    },
};

