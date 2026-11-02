export const boardItems = Array.from({ length: 5 }, (_, index) => ({
    title: `GitHub 업데이트 ${index + 1}`,
    description: `새로운 기능과 개선 사항을 소개합니다. (${index + 1})`,
    url: `https://github.blog/changelog/${index + 1}`,
    date: "Mon 01 Jan 2024",
}));

export const blogPosts = Array.from({ length: 6 }, (_, index) => ({
    id: `post-${index + 1}`,
    title: `GitHub 블로그 글 ${index + 1}`,
    publishedAt: "2024-01-01T00:00:00Z",
    thumbnailUrl: null as string | null,
    authorName: "GitHub",
    categories: ["개발"],
    url: `https://github.blog/article-${index + 1}`,
}));
