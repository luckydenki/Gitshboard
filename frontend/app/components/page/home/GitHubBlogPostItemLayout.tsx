import type { ReactNode } from "react";

interface GitHubBlogPostItemLayoutProps {
    thumbnail: ReactNode;
    categories: ReactNode;
    title: ReactNode;
    metadata: ReactNode;
}

export default function GitHubBlogPostItemLayout({
    thumbnail,
    categories,
    title,
    metadata,
}: GitHubBlogPostItemLayoutProps) {
    return (
        <li>
            <article className="bg-panel hover:outline-primary flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 hover:outline-2">
                <figure className="flex aspect-video items-center justify-center bg-gray-100">
                    {thumbnail}
                </figure>

                <div className="flex flex-1 flex-col gap-3 p-4">
                    <header>
                        <ul
                            aria-label="게시글 카테고리"
                            className="flex flex-wrap gap-1">
                            {categories}
                        </ul>

                        <h3 className="mt-3 line-clamp-3 text-base font-semibold">{title}</h3>
                    </header>

                    <footer className="mt-auto flex flex-col gap-1 text-xs text-gray-500">
                        {metadata}
                    </footer>
                </div>
            </article>
        </li>
    );
}
