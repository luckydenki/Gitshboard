import type { Meta, StoryObj } from "@storybook/react-vite";
import RepoCommitStatusCodeChangeChart from "../../../../app/components/page/repo-dashboard/RepoCommitStatusCodeChangeChart";
import { commitOverview } from "../../../../mock/storybook/repo-commit-status";

const points = commitOverview.codeChange.value!.points;
const meta = {
    title: "Components/Page/RepoDashboard/CommitStatusCodeChangeChart",
    component: RepoCommitStatusCodeChangeChart,
    args: { points, timezone: "UTC" },
} satisfies Meta<typeof RepoCommitStatusCodeChangeChart>;
export default meta;
type Story = StoryObj<typeof meta>;
// 추가와 삭제가 모두 있는 주별 순증감 그래프입니다.
export const Default: Story = {};
// 줄 수 변화가 없는 경우입니다.
export const NoChanges: Story = {
    args: { points: points.map((point) => ({ ...point, additions: 0, deletions: 0, net: 0 })) },
};
// 삭제가 추가보다 큰 주가 포함된 경우입니다.
export const NetDeletion: Story = {
    args: {
        points: points.map((point, index) =>
            index === 25 ? { ...point, additions: 20, deletions: 800, net: -780 } : point,
        ),
    },
};
