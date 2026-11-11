import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import SearchBar from "../../../../app/components/page/home/SearchBar";
import { searchRepo, searchUser } from "../../../../mock/storybook/search";

const meta = {
    title: "Components/Page/Home/SearchBar",
    component: SearchBar,
    args: { enableFilter: false, variant: { wsize: "md" } },
    beforeEach: () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input) => {
            const isRepoSearch = String(input).includes("/api/search/repos?");
            const data = isRepoSearch
                ? { total_count: 1, incomplete_results: false, items: [searchRepo] }
                : {
                      total_count: 1,
                      items: [searchUser],
                      page_info: { has_next_page: false, end_cursor: null },
                  };
            return Response.json({ success: true, status: 200, data });
        };
        return () => { globalThis.fetch = originalFetch; };
    },
} satisfies Meta<typeof SearchBar>;
export default meta;
type Story = StoryObj<typeof meta>;

// 기본 너비에서 검색어를 입력하고 검색 버튼을 누르는 사례입니다.
export const Default: Story = {
    // 검색어 입력과 검색 버튼 동작을 확인합니다.
    play: async ({ canvas }) => {
        const input = canvas.getByPlaceholderText("검색...");
        await userEvent.type(input, "octocat");
        await expect(input).toHaveValue("octocat");
        await userEvent.click(canvas.getByRole("button", { name: "검색 버튼" }));
    },
};
// 작은 너비에 검색 필터를 표시하는 사례입니다.
export const SmallWithFilters: Story = {
    args: { enableFilter: true, variant: { wsize: "sm" } },
    // 필터를 열고 타입과 지역을 선택하면 선택값이 표시되는지 확인합니다.
    play: async ({ canvas }) => {
        await userEvent.click(canvas.getByRole("button", { name: /검색 필터/ }));
        await userEvent.click(canvas.getByLabelText("개인"));
        await expect(canvas.getByText("type:user")).toBeVisible();
        await userEvent.type(canvas.getByPlaceholderText("지역을 입력하세요"), "Seoul");
        await expect(canvas.getByText("location:Seoul")).toBeVisible();
    },
};
// 최대 너비 제한이 없는 검색창입니다.
export const FullWidth: Story = { args: { variant: { wsize: "full" } } };
// 최대 너비가 가장 큰 검색창입니다.
export const LargestWidth: Story = { args: { variant: { wsize: "xl" } } };
