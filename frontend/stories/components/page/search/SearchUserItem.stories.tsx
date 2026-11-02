import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, userEvent } from "storybook/test";
import SearchUserItem from "../../../../app/components/page/search/SearchUserItem";
import { searchUser } from "../../../../mock/storybook/search";

const meta = { title: "Components/Page/Search/SearchUserItem", component: SearchUserItem, args: { item: searchUser }, decorators: [(Story) => <MemoryRouter initialEntries={["/"]}><Routes><Route path="/" element={<Story />} /><Route path="/user/:login" element={<p>User dashboard</p>} /></Routes></MemoryRouter>] } satisfies Meta<typeof SearchUserItem>;
export default meta;
type Story = StoryObj<typeof meta>;
// 사용자 링크의 목적지와 대시보드 이동을 확인합니다.
export const Default: Story = { play: async ({ canvas }) => { await expect(canvas.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", searchUser.html_url); await userEvent.click(canvas.getByRole("link", { name: searchUser.name! })); await expect(canvas.getByText("User dashboard")).toBeVisible(); } };
// 조직 유형과 선택 프로필 정보가 없는 경우입니다.
export const OrganizationWithoutDetails: Story = { args: { item: { ...searchUser, type: "Organization", name: null, bio: null, location: null, total_stars: 0 } } };
// 긴 프로필과 큰 별 합계를 표시합니다.
export const LongContent: Story = { args: { item: { ...searchUser, name: "Long name ".repeat(20), bio: "Biography ".repeat(40), location: "Location ".repeat(12), total_stars: 1000000 } } };
