import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import HomeBoardList from "../../../../app/components/page/home/HomeBoardList";
import { boardItems } from "../../../../mock/storybook/home";

const meta = {
    title: "Components/Page/Home/HomeBoardList",
    component: HomeBoardList,
    args: { boardTitle: "GitHub updates", data: boardItems },
    render: (args) => <HomeBoardList {...args} data={args.data.map((item) => ({ ...item }))} />,
} satisfies Meta<typeof HomeBoardList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvas }) => {
        const link = canvas.getByTitle(boardItems[0].title);
        await expect(link).toHaveAttribute("href", boardItems[0].url);
    },
};
export const Empty: Story = { args: { data: [] } };
export const OneItem: Story = { args: { data: boardItems.slice(0, 1) } };
export const LongContent: Story = {
    args: { data: [{ ...boardItems[0], title: "Long content ".repeat(30), description: "Long content ".repeat(80) }] },
};
export const MoreThanFive: Story = { args: { data: [...boardItems, { ...boardItems[0], title: "Sixth article" }] } };
