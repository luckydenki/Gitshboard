import { useState } from "react";
import useBlogFeedRSS from "~/hooks/useBlogFeedRSS";
import useBlogFeedThumbnail from "~/hooks/useBlogFeedThumbnail";
const PAGE_SIZE = 5;

export default function GitHubBlogBanner() {
    const [pageIndex, setPageIndex] = useState(0);
    const { data: blogPosts, isLoading } = useBlogFeedRSS(true);
    const { data: thumbnails } = useBlogFeedThumbnail();

    if (!blogPosts || isLoading) {
        return;
    }
    if (thumbnails) {
        thumbnails.forEach((v, idx) => {
            blogPosts[idx].thumbnailUrl = v.thumbnailUrl;
        });
    }

    const visiblePosts = blogPosts.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);
    const hasPreviousPage = pageIndex > 0;
    const hasNextPage = (pageIndex + 1) * PAGE_SIZE < blogPosts.length;

    return (
        <section
            aria-labelledby="github-blog-banner-title"
            className="flex flex-col gap-4">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">GitHub Blog</p>
                    <h3
                        id="github-blog-banner-title"
                        className="text-2xl font-semibold">
                        최신 글
                    </h3>
                </div>

                {blogPosts.length > PAGE_SIZE && (
                    <nav
                        aria-label="GitHub Blog 페이지 이동"
                        className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPageIndex((currentIndex) => currentIndex - 1)}
                            disabled={!hasPreviousPage}
                            aria-label="이전 5개 글 보기"
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                            &lt;-
                        </button>
                        <button
                            type="button"
                            onClick={() => setPageIndex((currentIndex) => currentIndex + 1)}
                            disabled={!hasNextPage}
                            aria-label="다음 5개 글 보기"
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                            -&gt;
                        </button>
                    </nav>
                )}
            </header>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {visiblePosts.map((post) => (
                    <li key={post.id}>
                        <article className="bg-panel hover:outline-primary flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 hover:outline-2">
                            <figure className="flex aspect-video items-center justify-center bg-gray-100">
                                {post.thumbnailUrl ? (
                                    <img
                                        src={post.thumbnailUrl}
                                        alt={`${post.title} 썸네일`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400">No image</span>
                                )}
                            </figure>

                            <div className="flex flex-1 flex-col gap-3 p-4">
                                <header>
                                    <ul
                                        aria-label="게시글 카테고리"
                                        className="flex flex-wrap gap-1">
                                        {post.categories.map((category) => (
                                            <li
                                                key={category}
                                                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                {category}
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="mt-3 line-clamp-3 text-base font-semibold">
                                        <a
                                            href={post.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline">
                                            {post.title}
                                        </a>
                                    </h3>
                                </header>

                                <footer className="mt-auto flex flex-col gap-1 text-xs text-gray-500">
                                    <p>
                                        <span className="sr-only">작성자: </span>
                                        {post.authorName}
                                    </p>
                                    <time dateTime={post.publishedAt}>
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </time>
                                </footer>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </section>
    );
}
