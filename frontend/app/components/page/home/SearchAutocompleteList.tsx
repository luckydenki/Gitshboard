import { useEffect, useRef, type RefObject } from "react";
import { VscLoading } from "react-icons/vsc";
import type { RepositorySearchData, RepositorySearchItem } from "~/types/search/repository-search";
import type { UserSearchData, UserSearchItem } from "~/types/search/user-search";
import type { ISearchFilterCategory } from "./SearchBar";
import { Link, useNavigate } from "react-router";

export type SearchResult = { user?: UserSearchData; repo?: RepositorySearchData };

const SearchAutoCompleteUserItem = ({
    e,
    refCallback,
}: {
    e: UserSearchItem;
    refCallback: (e: HTMLButtonElement) => void;
}) => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => {
                navigate(`../user/${e.login ?? e.name}`);
            }}
            ref={refCallback}
            key={e.id}
            className="flex w-full justify-between hover:bg-gray-200">
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
                className="text-primary flex h-full items-center text-sm hover:underline"
                onClick={(element) => {
                    element.stopPropagation();
                }}>
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
    refCallback: (e: HTMLAnchorElement) => void;
}) => {
    return (
        <Link
            to={`../repo/${e.name.split("/")[0]}`}
            ref={refCallback}

            key={e.id}
            className="flex min-h-12 w-full items-center justify-between gap-8 hover:bg-gray-200">
            <div className="flex w-full flex-col">
                <div className="line-clamp-1 max-w-2/3 text-ellipsis">{e.full_name}</div>
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
                href={e.html_url}>
                Github
            </a>
        </Link>
    );
};

export default function SearchAutocompleteList({
    category,
    searchResult,
    isLoadingMax,
    isLoadingMore,
    onLoadMore,
}: {
    category: ISearchFilterCategory;
    searchResult: SearchResult;
    isLoadingMax: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
}) {
    const listRootElement = useRef<HTMLUListElement>(null);
    const lastItemElement = useRef<Element>(null);

    useEffect(() => {
        const root = listRootElement.current;
        const lastItem = lastItemElement.current;
        if (!root || !lastItem) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) onLoadMore();
            },
            { root, threshold: 1 },
        );
        observer.observe(lastItem);

        return () => observer.disconnect();
    }, [searchResult, onLoadMore]);

    return (
        <ul
            ref={listRootElement}
            className="bg-panel absolute top-full z-1 mt-2 flex h-96 w-full flex-col gap-2 overflow-y-auto p-2">
            {category.value == "users" &&
            searchResult &&
            searchResult.user &&
            searchResult.user?.items.length > 0 ? (
                searchResult.user.items.map((e, idx, arr) => {
                    return (
                        <SearchAutoCompleteUserItem
                            refCallback={(ref) => {
                                if (idx == arr.length - 1) {
                                    console.log("우리 연결 ", e.login);
                                    lastItemElement.current = ref;
                                }
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
                searchResult.repo.items.map((e, idx, arr) => {
                    const date = new Date(e.updated_at).getTime();
                    const today = Date.now();

                    const diff = today - date;
                    const daydiff = new Date(diff).getDay();

                    const dayString =
                        daydiff == 0 ? "오늘" : daydiff == 1 ? "어제" : `${daydiff}일 전`;

                    return (
                        <a
                            href={`../repo/${e.name.split("/")[0]}`}
                            ref={(ref) => {
                                if (idx == arr.length - 1) {
                                    lastItemElement.current = ref;
                                }
                            }}

                            key={e.id}
                            className="flex min-h-12 w-full items-center justify-between gap-8 hover:bg-gray-200">
                            <div className="flex w-full flex-col">
                                <div className="line-clamp-1 max-w-2/3 text-ellipsis">
                                    {e.full_name}
                                </div>
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
                                href={e.html_url}>
                                Github
                            </a>
                        </a>
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

            {isLoadingMax && (
                <div className="flex w-full items-center justify-center">
                    <span>같은 검색어로 자동완성은 최대 5번만 지원합니다.</span>
                </div>
            )}

            {isLoadingMore && !isLoadingMax && (
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
