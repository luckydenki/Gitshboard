import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import HomeBoardList from "../../../../app/components/page/home/HomeBoardList";
import { boardItems } from "../../../../mock/storybook/home";

const meta = {
    title: "Components/Page/Home/HomeBoardList",
    component: HomeBoardList,
    args: { boardTitle: "GitHub 업데이트", data: boardItems },
    render: (args) => <HomeBoardList {...args} data={args.data.map((item) => ({ ...item }))} />,
} satisfies Meta<typeof HomeBoardList>;
export default meta;
type Story = StoryObj<typeof meta>;
// 다섯 개의 게시글이 있는 기본 목록입니다.
export const Default: Story = {
    // 게시글 링크가 전달받은 주소를 가리키는지 확인합니다.
    play: async ({ canvas }) => {
        const link = canvas.getByTitle(boardItems[0].title);
        await expect(link).toHaveAttribute("href", boardItems[0].url);
    },
};
// 게시글이 없는 경우 안내 문구를 표시합니다.
export const Empty: Story = { args: { data: [] } };
// 게시글 하나와 나머지 빈 자리 안내를 표시합니다.
export const OneItem: Story = { args: { data: boardItems.slice(0, 1) } };
// 긴 제목과 설명의 줄임 처리를 보여줍니다.
export const LongContent: Story = {
    args: { data: [{ ...boardItems[0], title: "긴 제목 ".repeat(30), description: "긴 설명 ".repeat(80) }] },
};
// 다섯 개를 초과하는 게시글을 표시합니다.
export const MoreThanFive: Story = { args: { data: [...boardItems, { ...boardItems[0], title: "여섯 번째 글" }] } };
