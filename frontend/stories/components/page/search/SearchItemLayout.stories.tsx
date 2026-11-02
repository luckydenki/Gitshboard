import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, userEvent } from "storybook/test";
import SearchItemLayout from "../../../../app/components/page/search/SearchItemLayout";
import { searchRepo } from "../../../../mock/storybook/search";

const meta = {
    title: "Components/Page/Search/SearchItemLayout", component: SearchItemLayout,
    args: { avatarUrl: searchRepo.owner.avatar_url, avatarAlt: "octocat profile", title: searchRepo.full_name, badge: "Repository", dashboardUrl: "/dashboard", githubUrl: searchRepo.html_url, description: searchRepo.description, stars: 1234, updatedAt: searchRepo.updated_at, children: <span>TypeScript</span> },
    decorators: [(Story) => <MemoryRouter initialEntries={["/"]}><Routes><Route path="/" element={<Story />} /><Route path="/dashboard" element={<p>Dashboard destination</p>} /></Routes></MemoryRouter>],
} satisfies Meta<typeof SearchItemLayout>;
export default meta;
type Story = StoryObj<typeof meta>;
// 내부 대시보드 이동과 외부 링크 속성을 확인합니다.
export const Default: Story = { play: async ({ canvas }) => { await expect(canvas.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", searchRepo.html_url); await userEvent.click(canvas.getByRole("link", { name: searchRepo.full_name })); await expect(canvas.getByText("Dashboard destination")).toBeVisible(); } };
// 설명과 자식 내용이 없고 별이 0개인 경우입니다.
export const EmptyDetails: Story = { args: { description: null, stars: 0, children: null } };
// 긴 제목과 설명, 사용자 지정 별 레이블을 표시합니다.
export const LongContent: Story = { args: { title: "Long repository name ".repeat(12), description: "Long description ".repeat(30), stars: 1000000, starsLabel: "Total stars" } };
