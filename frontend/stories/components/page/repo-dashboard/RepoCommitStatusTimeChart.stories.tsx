import type { Meta, StoryObj } from "@storybook/react-vite";
import RepoCommitStatusTimeChart from "../../../../app/components/page/repo-dashboard/RepoCommitStatusTimeChart";
import { commitOverview } from "../../../../mock/storybook/repo-commit-status";

const buckets = commitOverview.timeOfDay.value!.buckets;
const meta = {
    title: "Components/Page/RepoDashboard/CommitStatusTimeChart",
    component: RepoCommitStatusTimeChart,
    args: { buckets },
} satisfies Meta<typeof RepoCommitStatusTimeChart>;
export default meta;
type Story = StoryObj<typeof meta>;
// 여섯 개 시간대의 기본 분포입니다.
export const Default: Story = {};
// 커밋이 없는 시간대 분포입니다.
export const Empty: Story = {
    args: { buckets: buckets.map((bucket) => ({ ...bucket, count: 0 })) },
};
// 한 시간대에 커밋이 집중된 분포입니다.
export const Peak: Story = {
    args: {
        buckets: buckets.map((bucket) => ({
            ...bucket,
            count: bucket.startHour === 16 ? 5000 : 1,
        })),
    },
};
