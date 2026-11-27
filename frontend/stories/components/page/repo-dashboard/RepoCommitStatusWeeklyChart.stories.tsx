import type { Meta, StoryObj } from "@storybook/react-vite";
import RepoCommitStatusWeeklyChart from "../../../../app/components/page/repo-dashboard/RepoCommitStatusWeeklyChart";
import { commitOverview } from "../../../../mock/storybook/repo-commit-status";

const points = commitOverview.weekly.value!.points;
const meta = {
    title: "Components/Page/RepoDashboard/CommitStatusWeeklyChart",
    component: RepoCommitStatusWeeklyChart,
    args: { points, timezone: "UTC" },
} satisfies Meta<typeof RepoCommitStatusWeeklyChart>;
export default meta;
type Story = StoryObj<typeof meta>;
// 52개 주간 점을 표시하는 기본 그래프입니다.
export const Default: Story = {};
// 커밋이 없는 주만 표시합니다.
export const Empty: Story = { args: { points: points.map((point) => ({ ...point, count: 0 })) } };
// 커밋이 매우 많은 한 주가 포함된 경우입니다.
export const Spike: Story = {
    args: {
        points: points.map((point, index) => ({
            ...point,
            count: index === 25 ? 10000 : point.count,
        })),
    },
};
