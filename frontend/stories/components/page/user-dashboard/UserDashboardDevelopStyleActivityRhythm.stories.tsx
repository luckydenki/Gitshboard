import type { Meta, StoryObj } from "@storybook/react-vite";
import UserDashboardDevelopStyleActivityRhythm from "../../../../app/components/page/user-dashboard/UserDashboardDevelopStyleActivityRhythm";
const meta = {
    title: "Components/Page/UserDashboard/DevelopStyleActivityRhythm",
    component: UserDashboardDevelopStyleActivityRhythm,
    decorators: [
        (Story) => (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof UserDashboardDevelopStyleActivityRhythm>;
export default meta;
type Story = StoryObj<typeof meta>;
// lg 이상에서 두 차트를 나란히 표시합니다.
export const Default: Story = {};
// 좁은 화면에서 차트를 한 열로 표시합니다.
export const Mobile: Story = { globals: { viewport: { value: "mobile1", isRotated: false } } };
