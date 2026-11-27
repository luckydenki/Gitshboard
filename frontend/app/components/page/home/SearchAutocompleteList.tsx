import { useEffect, useRef } from "react";
import { VscLoading } from "react-icons/vsc";
import type { RepositorySearchData, RepositorySearchItem } from "~/types/search/repository-search";
import type { UserSearchData, UserSearchItem } from "~/types/search/user-search";
import type { ISearchFilterCategory } from "./SearchBar";
import { Link, useNavigate } from "react-router";

export type SearchResult = {
    user?: Pick<UserSearchData, "items" | "total_count">;
    repo?: Pick<RepositorySearchData, "items" | "total_count">;
};

const SearchAutoCompleteUserItem = ({
    e,
    refCallback,
}: {
    e: UserSearchItem;
    refCallback?: (e: HTMLButtonElement) => void;
}) => {
    const navigate = useNavigate();
    //  console.log("e.login", e.login);
    return (
        <button
            type="button"
            onClick={() => {
                console.log("누르기");
                navigate(`../${e.type === "User" ? "user" : "org"}/${e.login ?? e.name}`);
            }}
            ref={refCallback}
            key={e.id}
            className="flex w-full justify-between hover:cursor-pointer hover:bg-gray-200">
            <div className="flex gap-4">
                <img
                    alt="프로필 사진"
                    className="size-12"
                    src={e.avatar_url}
                />
                <span>{e.login ?? e.name}</span>
            </div>
            <a
                href={e.html_url}
                onClick={(element) => {
                    element.stopPropagation();
                }}
                className="text-primary flex h-full items-center text-sm hover:underline">
                Github
            </a>
        </button>
    );
};

const SearchAutoCompleteRepoItem = ({
    e,
    dayString,
    refCallback,
}: {
    e: RepositorySearchItem;
    dayString: string;
    refCallback?: (e: HTMLButtonElement) => void;
}) => {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => {
                navigate(
                    `/repo/${encodeURIComponent(e.owner.login)}/${encodeURIComponent(e.name)}`,
                );
            }}
            ref={refCallback}
            key={e.id}
            className="flex min-h-12 w-full justify-between gap-8 hover:cursor-pointer hover:bg-gray-200">
            <div className="flex w-full flex-col">
                <div className="line-clamp-1 flex max-w-2/3 text-ellipsis">{e.full_name}</div>
                <div className="flex text-sm">
                    <img
                        alt="프로필 사진"
                        src={e.owner.avatar_url}
                        className="mr-2 size-6 rounded-full"></img>
                    <span>{e.owner.login}</span>
                    <span className="ml-4">{dayString}</span>
                </div>
            </div>
            <a
                className="text-primary flex h-full items-center text-sm hover:underline"
                onClick={(element) => {
                    element.stopPropagation();
                }}
                href={e.html_url}>
                Github
            </a>
        </button>
    );
};

/**
 * 검색 자동완성 리스트입니다.
 * 무한 스크롤 원리를 이용했으나, 지나친 호출을 막기 위해 5회로 제한하고 있습니다.
 *
 *
 * totalCount는 이미 가져오게 되어있습니다. 리스트를 갱신해야 하는 타이밍은 다음과 같아요.
 *
 * 1. 카테고리를 바꾼 경우
 * 2. 검색어를 바꾼 경우
 *
 * 무한 스크롤링의 기준점은 아직 미확정이지만 다음과 같은 무한 스크롤 상태가 있습니다.
 *
 * 1. 로딩 중
 * 2. 최대 로드 횟수 소진
 * 3. 더 이상 가져올 데이터가 없음
 * 4. 더 가져오다가 실패함
 *
 * - 최대 페이지네이션보다 totalCount가 더 크다면 2번을 보여줘야 합니다.
 * - 최대 페이지네이션보다 totalCount가 같거나 더 작다면 3번을 보여줘야 합니다.
 *
 * @param param0
 * @returns
 */
export default function SearchAutocompleteList({
    category,
    searchResult,
    isLoadingMax,
    isLoadingFull,
    isLoadingMore,
    onLoadMore,
}: {
    category: ISearchFilterCategory;
    searchResult: SearchResult;
    isLoadingMax: boolean;
    isLoadingFull: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}) {
    const listRootElement = useRef<HTMLUListElement>(null);
    const lastItemElement = useRef<Element>(null);

    console.log("isLoadingFull", isLoadingFull);

    useEffect(() => {
        const root = listRootElement.current;
        const lastItem = lastItemElement.current;
        if (!root || !lastItem) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isLoadingFull) {
                    onLoadMore();
                }
            },
            { root, threshold: 1 },
        );
        observer.observe(lastItem);

        return () => observer.disconnect();
    }, [searchResult, onLoadMore, isLoadingFull]);

    return (
        <ul
            ref={listRootElement}
            className="bg-panel absolute top-full z-1 mt-2 flex h-96 w-full flex-col gap-2 overflow-y-auto p-2">
            {category.value == "users" &&
            searchResult &&
            searchResult.user &&
            searchResult.user?.items.length > 0 ? (
                searchResult.user.items.map((e) => {
                    return (
                        <SearchAutoCompleteUserItem
                            refCallback={(e) => {
                                lastItemElement.current = e;
                            }}
                            key={e.id}
                            e={e}
                        />
                    );
                })
            ) : category.value == "repos" &&
              searchResult &&
              searchResult.repo &&
              searchResult.repo?.items.length > 0 ? (
                searchResult.repo.items.map((e) => {
                    const date = new Date(e.updated_at).getTime();
                    const today = Date.now();

                    const diff = today - date;
                    const daydiff = new Date(diff).getDay();

                    const dayString =
                        daydiff == 0 ? "오늘" : daydiff == 1 ? "어제" : `${daydiff}일 전`;

                    return (
                        <SearchAutoCompleteRepoItem
                            refCallback={(e) => {
                                lastItemElement.current = e;
                            }}
                            e={e}
                            key={e.id}
                            dayString={dayString}
                        />
                    );
                })
            ) : searchResult.user?.total_count === 0 || searchResult.repo?.total_count === 0 ? (
                <div className="flex h-full w-full items-center justify-center">
                    검색 결과가 없습니다.
                </div>
            ) : (
                <div className="flex h-full w-full items-center justify-center gap-2">
                    <VscLoading className="animate-spin" />
                    찾는 중입니다.
                </div>
            )}
            {isLoadingFull && !isLoadingMax && (
                <div className="flex w-full items-center justify-center">
                    <span>모든 데이터를 로딩했습니다.</span>
                </div>
            )}

            {isLoadingMax && !isLoadingFull && (
                <div className="flex w-full items-center justify-center">
                    <span>같은 검색어로 자동완성은 최대 5번만 지원합니다.</span>
                </div>
            )}

            {isLoadingMore && !isLoadingMax && !isLoadingFull && (
                <div className="flex w-full items-center justify-center">
                    <VscLoading
                        className="animate-spin"
                        size={24}
                    />
                </div>
            )}
        </ul>
    );
}
