import type { Meta, StoryObj } from "@storybook/react-vite";
import UserDashboardDevelopStyleLanguageChart from "../../../../app/components/page/user-dashboard/UserDashboardDevelopStyleLanguageChart";

const meta = {
    title: "Components/Page/UserDashboard/DevelopStyleLanguageChart",
    component: UserDashboardDevelopStyleLanguageChart,
} satisfies Meta<typeof UserDashboardDevelopStyleLanguageChart>;
export default meta;
type Story = StoryObj<typeof meta>;
// 상위 다섯 언어의 예시 코드 구성 비율을 표시합니다.
export const Default: Story = {};
// 모바일 패널 너비에서 언어명과 비율을 확인하는 스토리입니다.
export const Mobile: Story = {
    decorators: [(Story) => <div style={{ width: 288 }}><Story /></div>],
};
