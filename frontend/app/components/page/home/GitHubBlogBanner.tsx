import { useState } from "react";
import useBlogFeedRSS from "~/hooks/useBlogFeedRSS";
import GitHubBlogPostList, { GitHubBlogPostListSkeleton } from "./GitHubBlogPostList";
import useBlogFeedThumbnail from "~/hooks/useBlogFeedThumbnail";
const PAGE_SIZE = 5;

interface GitHubBlogPaginationProps {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

export const GitHubBlogPagination = ({
    hasPreviousPage,
    hasNextPage,
    onPreviousPage,
    onNextPage,
}: GitHubBlogPaginationProps) => {
    return (
        <nav
            aria-label="GitHub Blog 페이지 이동"
            className="flex items-center gap-2">
            <button
                type="button"
                onClick={onPreviousPage}
                disabled={!hasPreviousPage}
                aria-label="이전 5개 글 보기"
                className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                &lt;-
            </button>
            <button
                type="button"
                onClick={onNextPage}
                disabled={!hasNextPage}
                aria-label="다음 5개 글 보기"
                className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                -&gt;
            </button>
        </nav>
    );
};

export default function GitHubBlogBanner() {
    const [pageIndex, setPageIndex] = useState(0);
    const { data: blogPosts, isLoading: isBlogLoading, isError: isBlogError } = useBlogFeedRSS(true);
    const {
        data: thumbnails,
        isLoading: isThumbnailLoading,
        isError: isThumbnailError,
    } = useBlogFeedThumbnail();
    const isLoading = isBlogLoading || isThumbnailLoading;
    const isError = isBlogError || isThumbnailError;

    if (blogPosts && thumbnails) {
        thumbnails.forEach((v, idx) => {
            const post = blogPosts[idx];
            if (post) {
                post.thumbnailUrl = v.thumbnailUrl;
            }
        });
    }

    const visiblePosts = blogPosts?.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE) ?? [];
    const postCount = blogPosts?.length ?? 0;

    const hasPreviousPage = pageIndex > 0;
    const hasNextPage = (pageIndex + 1) * PAGE_SIZE < postCount;

    return (
        <section
            aria-labelledby="github-blog-banner-title"
            className="flex w-full min-w-0 flex-col gap-4">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">GitHub Blog</p>
                    <h3
                        id="github-blog-banner-title"
                        className="text-2xl font-semibold">
                        최신 글
                    </h3>
                </div>

                {!isLoading && !isError && postCount > PAGE_SIZE && (
                    <GitHubBlogPagination
                        hasPreviousPage={hasPreviousPage}
                        hasNextPage={hasNextPage}
                        onPreviousPage={() => setPageIndex((currentIndex) => currentIndex - 1)}
                        onNextPage={() => setPageIndex((currentIndex) => currentIndex + 1)}
                    />
                )}
            </header>

            {isError ? (
                <p
                    role="status"
                    className="bg-panel flex min-h-40 items-center justify-center rounded-lg border border-gray-300 p-4 text-center text-gray-500">
                    네트워크 요청에 실패했습니다
                </p>
            ) : isLoading ? (
                <GitHubBlogPostListSkeleton count={PAGE_SIZE} />
            ) : (
                <GitHubBlogPostList visiblePosts={visiblePosts} />
            )}
        </section>
    );
}
