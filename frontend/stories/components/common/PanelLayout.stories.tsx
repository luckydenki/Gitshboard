import type { Meta, StoryObj } from "@storybook/react-vite";
import PanelLayout from "../../../app/components/common/DashboardPanelLayout";

const meta = {
    title: "Components/Common/PanelLayout",
    component: PanelLayout,
    args: { title: "주 사용 언어", semititle: "자주 사용하는 언어 top 5", children: <div className="h-40">패널 콘텐츠</div>, footer: "분석 기간 2025-10-17 ~ 2026-10-17" },
} satisfies Meta<typeof PanelLayout>;
export default meta;
type Story = StoryObj<typeof meta>;
// 기본 제목, 부제목, 콘텐츠, 바닥글을 표시합니다.
export const Default: Story = {};
// 선택 요소가 없는 최소 패널입니다.
export const TitleOnly: Story = { args: { semititle: undefined, footer: undefined, children: undefined } };
// 모바일 너비에서 긴 제목과 바닥글의 줄바꿈을 확인합니다.
export const Narrow: Story = { args: { title: "시간대별 활동 분포와 개발 패턴 분석", footer: "실제 GitHub 분석 결과가 아닌 예시 데이터입니다." }, decorators: [(Story) => <div style={{ width: 288 }}><Story /></div>] };
