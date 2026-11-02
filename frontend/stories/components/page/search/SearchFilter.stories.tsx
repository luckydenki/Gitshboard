import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import type { SearchChoiceOptions, SearchChoiceOptionsKeyType } from "../../../../app/components/page/home/SearchBar";
import SearchFilter from "../../../../app/components/page/search/SearchFilter";

const meta = {
    title: "Components/Page/Search/SearchFilter", component: SearchFilter,
    args: { choice: {}, choiceHandler: () => {} },
    render: function Render(args) {
        const [choice, setChoice] = useState<SearchChoiceOptions>(args.choice);
        const choiceHandler = (key: SearchChoiceOptionsKeyType, value: string) => setChoice((previous) => ({ ...previous, [key]: value }));
        return <SearchFilter choice={choice} choiceHandler={choiceHandler} />;
    },
} satisfies Meta<typeof SearchFilter>;
export default meta;
type Story = StoryObj<typeof meta>;
// 필터를 열어 라디오와 직접 입력값의 선택 결과를 확인합니다.
export const Default: Story = { play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /검색 필터/ }));
    await userEvent.click(canvas.getByLabelText("개인"));
    await expect(canvas.getByText("type:user")).toBeVisible();
    await userEvent.click(canvas.getByLabelText("Python"));
    await expect(canvas.getByText("language:Python")).toBeVisible();
    await userEvent.type(canvas.getByPlaceholderText("languages"), "Rust");
    await expect(canvas.getByText("language:Rust")).toBeVisible();
    await userEvent.type(canvas.getByPlaceholderText("지역을 입력하세요"), "Seoul");
    await expect(canvas.getByText("location:Seoul")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: /검색 필터/ }));
    await expect(canvas.getByPlaceholderText("languages")).not.toBeVisible();
} };
// 모든 선택값이 이미 존재하는 상태입니다.
export const SelectedFilters: Story = { args: { choice: { type: "org", languages: "TypeScript", location: "Seoul" } } };
// 긴 사용자 입력을 표시합니다.
export const LongValues: Story = { args: { choice: { languages: "language".repeat(12), location: "location".repeat(12) } } };
