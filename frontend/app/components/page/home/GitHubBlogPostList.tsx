import type { GitHubBlogPost } from "~/hooks/useBlogFeedRSS";

export const GitHubBlogPostItem = ({ post }: { post: GitHubBlogPost }) => {
    return (
        <li>
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
    );
};

export default function GitHubBlogPostList({ visiblePosts }: { visiblePosts: GitHubBlogPost[] }) {
    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {visiblePosts.map((post) => (
                <GitHubBlogPostItem
                    key={post.id}
                    post={post}
                />
            ))}
        </ul>
    );
}
