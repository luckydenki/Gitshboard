import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import ContributionCommitActivityByRepo from "../../../../app/components/page/contribution/ContributionCommitActivityByRepo";
import { commitActivityFixture } from "./fixtures";

const meta = {
    title: "Components/Page/Contribution/ContributionCommitActivityByRepo",
    component: ContributionCommitActivityByRepo,
    parameters: { layout: "padded" },
    decorators: [(Story) => <div className="max-w-360 bg-[#f4f6f1] p-6"><Story /></div>],
    args: {
        data: commitActivityFixture,
        isLoading: false,
        isError: false,
    },
} satisfies Meta<typeof ContributionCommitActivityByRepo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 레포지토리별_활동_그래프: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("heading", { name: "Commit activity by repository" })).toBeVisible();
        await expect(canvas.getByText("Compare each repository's daily commit trend at a glance.")).toBeVisible();
    },
};

export const 로딩_상태: Story = {
    args: { data: undefined, isLoading: true },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("Loading repository activity…")).toBeVisible();
    },
};

export const 오류_상태: Story = {
    args: { data: undefined, isError: true },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("Repository activity could not be loaded.")).toBeVisible();
    },
};

export const 빈_데이터: Story = {
    args: { data: { ...commitActivityFixture, results: [] } },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("No repository commit activity was recorded for this period.")).toBeVisible();
    },
};

