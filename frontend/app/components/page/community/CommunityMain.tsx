import { useState } from "react";
import {
    communityCategories,
    communityPostsMock,
    type CommunityCategory,
} from "~/mock/community/community-posts";

const POSTS_PER_PAGE = 10;

export default function CommunityMain() {
    const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>("공지사항");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredPosts = communityPostsMock.filter((post) => post.category === selectedCategory);
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const visiblePosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE,
    );

    const selectCategory = (category: CommunityCategory) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <main className="z-1 -mt-32 flex w-full min-w-0 flex-col gap-6 py-8">
            <div className="bg-panel rounded-lg px-4 py-6">
                <h3
                    id="community-list-title"
                    className="pb-6 text-xl font-bold sm:text-2xl">
                    인기글
                </h3>
                <section className="grid not-sm:gap-2 sm:gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-6 lg:gap-2">
                    <article className="flex flex-col md:items-center">
                        <a
                            href="#"
                            className="group flex gap-2 sm:items-center md:flex-row lg:flex-col">
                            <img
                                src="/PNGLogo.png"
                                className="rounded-lg border border-gray-300 object-cover object-center not-sm:hidden hover:object-contain sm:hidden md:block md:size-24 lg:size-32"
                            />
                            <div className="not-sm w-full gap-2 not-md:flex">
                                <div className="text-sm text-nowrap lg:self-start">자유게시판</div>
                                <div className="font-medium not-sm:line-clamp-1 group-hover:underline sm:line-clamp-1 sm:w-full md:line-clamp-2 lg:w-32">
                                    시발 ㅋㅋ 떴냐?ㅋㅋㅋㅋㅋㅋㅋㅋㅋzzzzzzzzzzzzzzzzz
                                </div>
                                <span className="font-xs text-nowrap text-gray-500 lg:self-start">
                                    {"김덴덴"}
                                </span>
                            </div>
                        </a>
                    </article>
                    <article className="flex flex-col md:items-center">
                        <a
                            href="#"
                            className="group flex gap-2 sm:items-center md:flex-row lg:flex-col">
                            <img
                                src="/PNGLogo.png"
                                className="rounded-lg border border-gray-300 object-cover object-center not-sm:hidden hover:object-contain sm:hidden md:block md:size-24 lg:size-32"
                            />
                            <div className="not-sm w-full gap-2 not-md:flex">
                                <div className="text-sm text-nowrap lg:self-start">자유게시판</div>
                                <div className="font-medium not-sm:line-clamp-1 group-hover:underline sm:line-clamp-1 sm:w-full md:line-clamp-2 lg:w-32">
                                    시발 ㅋㅋ 떴냐?ㅋㅋㅋㅋㅋㅋㅋㅋㅋzzzzzzzzzzzzzzzzz
                                </div>
                                <span className="font-xs text-nowrap text-gray-500 lg:self-start">
                                    {"김덴덴"}
                                </span>
                            </div>
                        </a>
                    </article>
                    <article className="flex flex-col md:items-center">
                        <a
                            href="#"
                            className="group flex gap-2 sm:items-center md:flex-row lg:flex-col">
                            <img
                                src="/PNGLogo.png"
                                className="rounded-lg border border-gray-300 object-cover object-center not-sm:hidden hover:object-contain sm:hidden md:block md:size-24 lg:size-32"
                            />
                            <div className="not-sm w-full gap-2 not-md:flex">
                                <div className="text-sm text-nowrap lg:self-start">자유게시판</div>
                                <div className="font-medium not-sm:line-clamp-1 group-hover:underline sm:line-clamp-1 sm:w-full md:line-clamp-2 lg:w-32">
                                    시발 ㅋㅋ 떴냐?ㅋㅋㅋㅋㅋㅋㅋㅋㅋzzzzzzzzzzzzzzzzz
                                </div>
                                <span className="font-xs text-nowrap text-gray-500 lg:self-start">
                                    {"김덴덴"}
                                </span>
                            </div>
                        </a>
                    </article>
                    <article className="flex flex-col md:items-center">
                        <a
                            href="#"
                            className="group flex gap-2 sm:items-center md:flex-row lg:flex-col">
                            <img
                                src="/PNGLogo.png"
                                className="rounded-lg border border-gray-300 object-cover object-center not-sm:hidden hover:object-contain sm:hidden md:block md:size-24 lg:size-32"
                            />
                            <div className="not-sm w-full gap-2 not-md:flex">
                                <div className="text-sm text-nowrap lg:self-start">자유게시판</div>
                                <div className="font-medium not-sm:line-clamp-1 group-hover:underline sm:line-clamp-1 sm:w-full md:line-clamp-2 lg:w-32">
                                    시발 ㅋㅋ 떴냐?ㅋㅋㅋㅋㅋㅋㅋㅋㅋzzzzzzzzzzzzzzzzz
                                </div>
                                <span className="font-xs text-nowrap text-gray-500 lg:self-start">
                                    {"김덴덴"}
                                </span>
                            </div>
                        </a>
                    </article>
                    <article className="flex flex-col md:items-center">
                        <a
                            href="#"
                            className="group flex gap-2 sm:items-center md:flex-row lg:flex-col">
                            <img
                                src="/PNGLogo.png"
                                className="rounded-lg border border-gray-300 object-cover object-center not-sm:hidden hover:object-contain sm:hidden md:block md:size-24 lg:size-32"
                            />
                            <div className="not-sm w-full gap-2 not-md:flex">
                                <div className="text-sm text-nowrap lg:self-start">자유게시판</div>
                                <div className="font-medium not-sm:line-clamp-1 group-hover:underline sm:line-clamp-1 sm:w-full md:line-clamp-2 lg:w-32">
                                    시발 ㅋㅋ 떴냐?ㅋㅋㅋㅋㅋㅋㅋㅋㅋzzzzzzzzzzzzzzzzz
                                </div>
                                <span className="font-xs text-nowrap text-gray-500 lg:self-start">
                                    {"김덴덴"}
                                </span>
                            </div>
                        </a>
                    </article>
                    <article className="flex flex-col md:items-center">
                        <a
                            href="#"
                            className="group flex gap-2 sm:items-center md:flex-row lg:flex-col">
                            <img
                                src="/PNGLogo.png"
                                className="rounded-lg border border-gray-300 object-cover object-center not-sm:hidden hover:object-contain sm:hidden md:block md:size-24 lg:size-32"
                            />
                            <div className="not-sm w-full gap-2 not-md:flex">
                                <div className="text-sm text-nowrap lg:self-start">자유게시판</div>
                                <div className="font-medium not-sm:line-clamp-1 group-hover:underline sm:line-clamp-1 sm:w-full md:line-clamp-2 lg:w-32">
                                    시발 ㅋㅋ 떴냐?ㅋㅋㅋㅋㅋㅋㅋㅋㅋzzzzzzzzzzzzzzzzz
                                </div>
                                <span className="font-xs text-nowrap text-gray-500 lg:self-start">
                                    {"김덴덴"}
                                </span>
                            </div>
                        </a>
                    </article>
                </section>
            </div>

            <div className="flex min-h-screen min-w-0 items-start gap-4 not-lg:flex-col">
                <aside className="bg-panel sticky top-20 w-48 shrink-0 rounded-lg border-1 border-gray-300 p-3 not-lg:top-16 not-lg:w-full">
                    <nav aria-label="커뮤니티 게시판">
                        <ul className="flex flex-col gap-1 not-lg:flex-row not-lg:overflow-x-auto">
                            {communityCategories.map((category) => {
                                const isSelected = selectedCategory === category;

                                return (
                                    <li
                                        key={category}
                                        className="shrink-0">
                                        <button
                                            type="button"
                                            aria-current={isSelected ? "page" : undefined}
                                            className={`w-full cursor-pointer rounded-lg p-3 text-left text-sm font-medium not-lg:w-auto ${
                                                isSelected
                                                    ? "bg-primary text-white"
                                                    : "bg-panel hover:bg-primary/10 hover:text-primary"
                                            }`}
                                            onClick={() => selectCategory(category)}>
                                            {category}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </aside>

                <section
                    aria-labelledby="community-list-title"
                    className="bg-panel min-w-0 flex-1 border-gray-300 p-6 not-lg:w-full">
                    <div className="flex flex-wrap items-end justify-between gap-3 pb-5">
                        <div className="flex flex-col gap-1">
                            <h3
                                id="community-list-title"
                                className="text-xl font-bold sm:text-2xl">
                                {selectedCategory}
                            </h3>
                            <p className="text-sm text-gray-500">
                                전체 {filteredPosts.length}개의 글
                            </p>
                        </div>
                        <span className="text-xs text-gray-500">
                            {currentPage} / {totalPages} 페이지
                        </span>
                    </div>

                    <ol className="flex flex-col divide-y divide-gray-300">
                        {visiblePosts.map((post) => (
                            <li
                                key={post.id}
                                className="flex min-w-0 items-center gap-4 py-4 first:pt-0 last:pb-0">
                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <h3 className="min-w-0 text-base leading-6 font-semibold">
                                        <a
                                            href="#"
                                            className="hover:text-primary break-words">
                                            {post.title}
                                        </a>{" "}
                                        <span className="text-primary text-sm font-semibold whitespace-nowrap">
                                            [{post.commentCount}]
                                        </span>
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                        <span>{post.author}</span>
                                        <span aria-hidden="true">·</span>
                                        <time>{post.createdAt}</time>
                                    </div>
                                </div>
                                <img
                                    src={post.thumbnail}
                                    alt=""
                                    className="h-16 w-24 shrink-0 rounded-lg border-1 border-gray-300 object-cover sm:h-20 sm:w-28"
                                />
                            </li>
                        ))}
                    </ol>

                    <nav
                        aria-label="게시글 페이지 이동"
                        className="mt-6 flex items-center justify-center gap-2 border-t-1 border-gray-300 pt-5">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            className="bg-panel cursor-pointer rounded-lg border-1 border-gray-300 p-2 text-sm disabled:cursor-default disabled:text-gray-500"
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
                            이전
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                aria-current={currentPage === page ? "page" : undefined}
                                className={`size-9 cursor-pointer rounded-lg border-1 p-2 text-sm font-medium ${
                                    currentPage === page
                                        ? "border-primary bg-primary text-white"
                                        : "bg-panel hover:border-primary border-gray-300"
                                }`}
                                onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            className="bg-panel cursor-pointer rounded-lg border-1 border-gray-300 p-2 text-sm disabled:cursor-default disabled:text-gray-500"
                            onClick={() =>
                                setCurrentPage((page) => Math.min(totalPages, page + 1))
                            }>
                            다음
                        </button>
                    </nav>
                </section>
            </div>
        </main>
    );
}
