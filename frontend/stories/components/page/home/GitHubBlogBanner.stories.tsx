import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, userEvent } from "storybook/test";
import GitHubBlogBanner from "../../../../app/components/page/home/GitHubBlogBanner";
import { blogPosts } from "../../../../mock/storybook/home";

const meta = {
    title: "Components/Page/Home/GitHubBlogBanner",
    component: GitHubBlogBanner,
} satisfies Meta<typeof GitHubBlogBanner>;
export default meta;
type Story = StoryObj<typeof meta>;

function withPosts(posts: typeof blogPosts) {
    return (Story: ComponentType) => {
        const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
        client.setQueryData(["blog"], posts.map((post) => ({ ...post })));
        client.setQueryData(["blogThumbNail"], []);
        return <QueryClientProvider client={client}><Story /></QueryClientProvider>;
    };
}
export const Default: Story = {
    decorators: [withPosts(blogPosts)],
    play: async ({ canvas }) => {
        const previous = canvas.getByRole("button", { name: "\uc774\uc804 5\uac1c \uae00 \ubcf4\uae30" });
        const next = canvas.getByRole("button", { name: "\ub2e4\uc74c 5\uac1c \uae00 \ubcf4\uae30" });
        await expect(previous).toBeDisabled();
        await expect(canvas.getByRole("link", { name: "GitHub Blog article 1" })).toBeVisible();
        await userEvent.click(next);
        await expect(canvas.getByRole("link", { name: "GitHub Blog article 6" })).toBeVisible();
        await expect(next).toBeDisabled();
        await userEvent.click(previous);
        await expect(canvas.getByRole("link", { name: "GitHub Blog article 1" })).toBeVisible();
    },
};
export const Empty: Story = { decorators: [withPosts([])] };
export const ExactlyFive: Story = { decorators: [withPosts(blogPosts.slice(0, 5))] };
export const LongContent: Story = {
    decorators: [withPosts([{ ...blogPosts[0], title: "A long GitHub Blog article title ".repeat(8), categories: ["Engineering", "Open source", "Community"], authorName: "A very long author name" }])],
};

export const WithThumbnail: Story = {
    decorators: [withPosts([{ ...blogPosts[0], thumbnailUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%2324292f'/%3E%3C/svg%3E" }])],
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("img")).toHaveAttribute("src", expect.stringContaining("data:image/svg+xml"));
    },
};
export const Loading: Story = {
    decorators: [(Story) => {
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        void client.fetchQuery({ queryKey: ["blog"], queryFn: () => new Promise(() => {}) });
        client.setQueryData(["blogThumbNail"], []);
        return <QueryClientProvider client={client}><Story /></QueryClientProvider>;
    }],
};
