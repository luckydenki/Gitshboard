import SearchBar from "~/components/page/home/SearchBar";
import SearchPagination from "~/components/page/search/SearchPagination";
import SearchUserItem from "~/components/page/search/SearchUserItem";
import SearchRepoItem from "~/components/page/search/SearchRepoItem";
import SearchResultHeader from "~/components/page/search/SearchResultHeader";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { searchRepo, searchUser } from "~/utils/search/AutoComplete";

const searchResultLimit = 1000;

/**
 * 현재 검색 API 응답에 없는 카드 정보입니다.
 * - 사용자: total_stars(derived: 소유 저장소가 받은 별의 합계).
 * - 저장소: 카드에 필요한 필드가 모두 제공됩니다.
 */
export default function Search() {
    const [params] = useSearchParams();
    const category = params.get("category") === "repos" ? "repos" : "users";
    const keyword = params.get("q")?.trim() ?? "";
    const page = Number(params.get("page") ?? 1);
    const perPage = 12;

    const { data: result, isLoading, isError } = useQuery({
        queryKey: ["search-results", params.toString()],
        enabled: Boolean(keyword),
        queryFn: async () => {
            const form = new FormData();
            form.set("q", keyword);

            const language = params.getAll("language").reverse().find((value) => value.trim());
            if (language) form.set("language", language.trim());

            if (category === "repos") {
                const response = await searchRepo(form, page, perPage);
                if (!response?.success || !response.data) {
                    throw new Error("저장소 검색에 실패했습니다.");
                }
                return { category, data: response.data } as const;
            }

            const type = params.get("type");
            const location = params.get("location")?.trim();
            if (type === "user" || type === "org") form.set("type", type);
            if (location) form.set("location", /\s/.test(location) ? `"${location}"` : location);

            const response = await searchUser(form, page, perPage);
            if (!response?.success || !response.data) {
                throw new Error("사용자 검색에 실패했습니다.");
            }
            return { category, data: response.data } as const;
        },
    });

    return (
        <>
            <title>검색</title>
            <meta
                name="description"
                content="Gitshboard 검색 페이지"
            />

            <main className="px-main-x-side grid grid-rows-[auto_1fr]">
                <section className="flex h-fit w-full flex-col items-center justify-center gap-4 pt-22 pb-12">
                    <SearchBar
                        enableFilter={true}
                        variant={{
                            wsize: "sm",
                        }}
                    />
                </section>

                <section className="flex min-h-screen w-full flex-col gap-4 justify-self-center pb-12">
                    {!isLoading && <SearchResultHeader total_count={result?.data.total_count ?? 0} />}
                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            <p role="status" className="text-sm text-gray-500">
                                검색 결과를 불러오는 중입니다
                            </p>
                            <div aria-hidden="true" className="flex flex-col gap-3 motion-safe:animate-pulse">
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="bg-panel flex min-h-36 items-center gap-4 rounded-lg border border-gray-300 p-4">
                                        <div className="size-16 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                                            <div className="h-5 w-2/5 max-w-48 rounded bg-gray-200 dark:bg-gray-700" />
                                            <div className="h-3 w-1/3 max-w-32 rounded bg-gray-200 dark:bg-gray-700" />
                                            <div className="h-3 w-4/5 max-w-96 rounded bg-gray-200 dark:bg-gray-700" />
                                            <div className="h-3 w-1/2 max-w-40 rounded bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : isError ? (
                        <p role="status" className="py-8 text-center text-gray-500">
                            검색 요청에 실패했습니다
                        </p>
                    ) : result && result.data.items.length > 0 ? (
                        <section className="flex flex-col gap-3">
                            {result.category === "repos"
                                ? result.data.items.map((item) => (
                                    <SearchRepoItem
                                        key={`repo-${item.id}`}
                                        item={item}
                                    />
                                ))
                                : result.data.items.map((item) => (
                                    <SearchUserItem
                                        key={`user-${item.id}`}
                                        item={item}
                                    />
                                ))}
                            <SearchPagination
                                currentPage={page}
                                totalPages={Math.ceil(Math.min(result.data.total_count, searchResultLimit) / perPage)}
                            />
                        </section>
                    ) : (
                        <div className="flex h-full items-center justify-center text-3xl text-gray-500">
                            검색 결과가 없습니다
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
