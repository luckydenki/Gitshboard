export const boardItems = Array.from({ length: 5 }, (_, index) => ({
    title: `GitHub update ${index + 1}`,
    description: `Read about new features and improvements. (${index + 1})`,
    url: `https://github.blog/changelog/${index + 1}`,
    date: "Mon 01 Jan 2024",
}));

export const blogPosts = Array.from({ length: 6 }, (_, index) => ({
    id: `post-${index + 1}`,
    title: `GitHub Blog article ${index + 1}`,
    publishedAt: "2024-01-01T00:00:00Z",
    thumbnailUrl: null as string | null,
    authorName: "GitHub",
    categories: ["Engineering"],
    url: `https://github.blog/article-${index + 1}`,
}));
