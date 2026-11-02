import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, userEvent } from "storybook/test";
import type { ISearchFilterCategory } from "../../../../app/components/page/home/SearchBar";
import SearchCategoryOpenButton from "../../../../app/components/page/search/SearchCategoryOpenButton";

const meta = {
    title: "Components/Page/Search/SearchCategoryOpenButton", component: SearchCategoryOpenButton,
    args: { category: { value: "users", name: "사용자" }, setCategory: () => {} },
    render: function Render(args) {
        const [category, setCategory] = useState<ISearchFilterCategory>(args.category);
        return <SearchCategoryOpenButton category={category} setCategory={setCategory} />;
    },
} satisfies Meta<typeof SearchCategoryOpenButton>;
export default meta;
type Story = StoryObj<typeof meta>;
// 메뉴를 열고 닫은 뒤 저장소 선택 상태를 확인합니다.
export const Default: Story = { play: async ({ canvas }) => {
    const control = canvas.getByLabelText("검색 카테고리 선택 버튼");
    await userEvent.click(control);
    await expect(canvas.getByRole("button", { name: "저장소" })).toBeVisible();
    await userEvent.click(control);
    await expect(canvas.queryByRole("button", { name: "저장소" })).not.toBeInTheDocument();
    await userEvent.click(control);
    // 실제 포인터는 포커스 이동 시 부모의 blur로 메뉴가 사라질 수 있어 클릭 이벤트만 전달합니다.
    fireEvent.click(canvas.getByRole("button", { name: "저장소" }));
    await expect(control).toHaveTextContent("저장소");
} };
// 저장소가 처음부터 선택된 상태입니다.
export const RepositorySelected: Story = { args: { category: { value: "repos", name: "저장소" } } };
