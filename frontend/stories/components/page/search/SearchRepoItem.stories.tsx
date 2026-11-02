import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, userEvent } from "storybook/test";
import SearchRepoItem from "../../../../app/components/page/search/SearchRepoItem";
import { searchRepo } from "../../../../mock/storybook/search";

const meta = { title: "Components/Page/Search/SearchRepoItem", component: SearchRepoItem, args: { item: searchRepo }, decorators: [(Story) => <MemoryRouter initialEntries={["/"]}><Routes><Route path="/" element={<Story />} /><Route path="/repo/:name" element={<p>Repository dashboard</p>} /></Routes></MemoryRouter>] } satisfies Meta<typeof SearchRepoItem>;
export default meta;
type Story = StoryObj<typeof meta>;
// 저장소 링크의 목적지와 대시보드 이동을 확인합니다.
export const Default: Story = { play: async ({ canvas }) => { await expect(canvas.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", searchRepo.html_url); await userEvent.click(canvas.getByRole("link", { name: searchRepo.full_name })); await expect(canvas.getByText("Repository dashboard")).toBeVisible(); } };
// 언어와 설명이 없고 별과 포크가 없는 저장소입니다.
export const EmptyDetails: Story = { args: { item: { ...searchRepo, language: null, description: null, stargazers_count: 0, forks_count: 0 } } };
// 긴 이름과 큰 통계를 표시합니다.
export const LongContent: Story = { args: { item: { ...searchRepo, full_name: "octocat/" + "long-name-".repeat(16), description: "Description ".repeat(40), stargazers_count: 1000000, forks_count: 1000000 } } };
