import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import SearchBar from "../../../../app/components/page/home/SearchBar";

const meta = {
    title: "Components/Page/Home/SearchBar",
    component: SearchBar,
    args: { enableFilter: false, variant: { wsize: "md" } },
    beforeEach: () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async () => new Response("", { status: 200 });
        return () => { globalThis.fetch = originalFetch; };
    },
} satisfies Meta<typeof SearchBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvas }) => {
        const input = canvas.getByPlaceholderText("\uac80\uc0c9...");
        await userEvent.type(input, "octocat");
        await expect(input).toHaveValue("octocat");
        await userEvent.click(canvas.getByRole("button", { name: "\uac80\uc0c9 \ubc84\ud2bc" }));
    },
};
export const SmallWithFilters: Story = {
    args: { enableFilter: true, variant: { wsize: "sm" } },
    play: async ({ canvas }) => {
        await userEvent.click(canvas.getByRole("button", { name: /\uac80\uc0c9 \ud544\ud130/ }));
        await userEvent.click(canvas.getByLabelText("\uac1c\uc778"));
        await expect(canvas.getByText("type:user")).toBeVisible();
        await userEvent.type(canvas.getByPlaceholderText("\uc9c0\uc5ed\uc744 \uc785\ub825\ud558\uc138\uc694"), "Seoul");
        await expect(canvas.getByText("location:Seoul")).toBeVisible();
    },
};
export const FullWidth: Story = { args: { variant: { wsize: "full" } } };
export const LargestWidth: Story = { args: { variant: { wsize: "xl" } } };
