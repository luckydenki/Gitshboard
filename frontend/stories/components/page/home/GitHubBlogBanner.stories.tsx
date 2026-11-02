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
// 여섯 개의 글을 다섯 개씩 나누어 표시하는 기본 사례입니다.
export const Default: Story = {
    decorators: [withPosts(blogPosts)],
    // 다음 및 이전 페이지 이동과 양 끝의 버튼 비활성화를 확인합니다.
    play: async ({ canvas }) => {
        const previous = canvas.getByRole("button", { name: "이전 5개 글 보기" });
        const next = canvas.getByRole("button", { name: "다음 5개 글 보기" });
        await expect(previous).toBeDisabled();
        await expect(canvas.getByRole("link", { name: blogPosts[0].title })).toBeVisible();
        await userEvent.click(next);
        await expect(canvas.getByRole("link", { name: blogPosts[5].title })).toBeVisible();
        await expect(next).toBeDisabled();
        await userEvent.click(previous);
        await expect(canvas.getByRole("link", { name: blogPosts[0].title })).toBeVisible();
    },
};
// 글이 없는 빈 목록입니다.
export const Empty: Story = { decorators: [withPosts([])] };
// 페이지 이동 버튼이 나타나지 않는 다섯 개 글의 경계 사례입니다.
export const ExactlyFive: Story = { decorators: [withPosts(blogPosts.slice(0, 5))] };
// 긴 제목과 여러 카테고리를 표시하는 사례입니다.
export const LongContent: Story = {
    decorators: [withPosts([{ ...blogPosts[0], title: "아주 긴 GitHub 블로그 글 제목 ".repeat(8), categories: ["개발", "오픈소스", "커뮤니티"], authorName: "아주 긴 작성자 이름" }])],
};

// 이미지가 있는 게시글을 표시하는 사례입니다.
export const WithThumbnail: Story = {
    decorators: [withPosts([{ ...blogPosts[0], thumbnailUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%2324292f'/%3E%3C/svg%3E" }])],
    // 썸네일 이미지에 준비된 주소가 적용되는지 확인합니다.
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("img")).toHaveAttribute("src", expect.stringContaining("data:image/svg+xml"));
    },
};
// 블로그 글을 불러오는 동안의 상태입니다.
export const Loading: Story = {
    decorators: [(Story) => {
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        void client.fetchQuery({ queryKey: ["blog"], queryFn: () => new Promise(() => {}) });
        client.setQueryData(["blogThumbNail"], []);
        return <QueryClientProvider client={client}><Story /></QueryClientProvider>;
    }],
};
