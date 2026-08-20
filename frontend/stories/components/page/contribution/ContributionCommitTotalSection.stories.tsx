import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import ContributionCommitTotalSection from "../../../../app/components/page/contribution/ContributionCommitTotalSection";
import { commitActivityFixture } from "./fixtures";

const meta = {
    title: "Components/Page/Contribution/ContributionCommitTotalSection",
    component: ContributionCommitTotalSection,
    parameters: { layout: "padded" },
    decorators: [(Story) => <div className="max-w-360 bg-[#f4f6f1] p-6"><Story /></div>],
    args: {
        data: commitActivityFixture,
        isLoading: false,
        isError: false,
    },
} satisfies Meta<typeof ContributionCommitTotalSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 날짜별_전체_커밋_그래프: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("heading", { name: "All commits by date" })).toBeVisible();
        await expect(canvas.getByText("18")).toBeVisible();
    },
};

export const 로딩_상태: Story = {
    args: { data: undefined, isLoading: true },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("Loading daily commit volume…")).toBeVisible();
    },
};

export const 오류_상태: Story = {
    args: { data: undefined, isError: true },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("Daily commit volume could not be loaded.")).toBeVisible();
    },
};

export const 빈_데이터: Story = {
    args: { data: { ...commitActivityFixture, commitOccuredAt: [], commitCounts: [] } },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("No daily commit records were found for this period.")).toBeVisible();
    },
};

