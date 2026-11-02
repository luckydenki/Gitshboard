import SearchBar from "~/components/page/home/SearchBar";
import SearchUserItem from "~/components/page/search/SearchUserItem";
import SearchRepoItem from "~/components/page/search/SearchRepoItem";
import SearchResultHeader from "~/components/page/search/SearchResultHeader";
import type { SearchResultResponse } from "~/types/search/search-result";
import { searchResponseMock } from "~/mock/search/search-response";

export default function Search() {
    const searchResponse: SearchResultResponse = searchResponseMock;

    const { items: data, total_count } = searchResponse;

    return (
        <main className="px-main-x-side grid grid-rows-[auto_1fr] [grid-area:main]">
            <section className="flex h-fit w-full flex-col items-center justify-center gap-4 pt-22 pb-12">
                <SearchBar
                    enableFilter={true}
                    variant={{
                        wsize: "sm",
                    }}
                />
            </section>

            <section className="flex min-h-screen w-full flex-col gap-4 justify-self-center pb-12">
                <SearchResultHeader total_count={total_count} />
                {total_count > 0 ? (
                    <section className="flex flex-col gap-3">
                        {data.map((item) =>
                            item.type === "Repository" ? (
                                <SearchRepoItem
                                    key={`repo-${item.id}`}
                                    item={item}
                                />
                            ) : (
                                <SearchUserItem
                                    key={`user-${item.id}`}
                                    item={item}
                                />
                            ),
                        )}
                    </section>
                ) : (
                    <div className="flex h-full items-center justify-center text-3xl text-gray-500">
                        검색 결과가 없습니다
                    </div>
                )}
            </section>
        </main>
    );
}
