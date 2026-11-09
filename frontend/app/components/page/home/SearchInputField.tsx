import { useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import type { RepositorySearchData } from "~/types/search/repository-search";
import type { UserSearchData } from "~/types/search/user-search";
import { searchAutoComplete, searchRepo, searchUser } from "~/utils/search/AutoComplete";
import type { ISearchFilterCategory } from "./SearchBar";
import { VscLoading } from "react-icons/vsc";

const searchCallback = async (
    input: HTMLInputElement,
    category: string,
    page: number,
    setSearchResult: React.Dispatch<
        React.SetStateAction<{
            user?: UserSearchData | undefined;
            repo?: RepositorySearchData;
        }>
    >,
) => {
    if (category === "users" && input) {
        const response = await searchUser(input.value, page, 12);

        setSearchResult((e) => {
            if (!e.user) {
                return {
                    ...e,
                    user: response.data,
                };
            } else if (!response.data) {
                return e;
            }
            return {
                ...e,
                user: {
                    ...e.user,
                    items: [...e.user.items, ...response.data.items],
                },
            };
        });
    } else if (category === "repos" && input) {
        const response = await searchRepo(input.value, page, 12);

        setSearchResult((e) => {
            if (!e.repo) {
                return {
                    ...e,
                    repo: response.data,
                };
            } else if (!response.data) {
                return e;
            }
            return {
                ...e,
                repo: {
                    ...e.repo,
                    items: [...e.repo.items, ...response.data.items],
                },
            };
        });
    }
};

export default function SearchInputField({
    category,
    searchResult,
    setSearchResult,
    maxPage = 5,
}: {
    category: ISearchFilterCategory;
    searchResult: { user?: UserSearchData; repo?: RepositorySearchData };
    setSearchResult: React.Dispatch<React.SetStateAction<typeof searchResult>>;
    maxPage?: number;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const debounce = useDebounce(searchAutoComplete, 500);
    const page = useRef<number>(1);
    const listRootElement = useRef<Element>(null);
    const lastItemElement = useRef<Element>(null);
    const [isLoadingMax, setIsLoadingMax] = useState(false);

    const categoryRef = useRef<typeof category>(category);

    useMemo(() => {
        if (categoryRef.current.value != category.value) {
            categoryRef.current = category;
            page.current = 1;

            if (!inputRef.current) return;
            searchCallback(inputRef.current, category.value, page.current, setSearchResult);
        }
    }, [category]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async ([element]) => {
                if (element.isIntersecting) {
                    //console.log("observer");
                    page.current++;

                    if (page.current > maxPage) {
                        console.log("더이상 호출은 불가능합니다.");
                        setIsLoadingMax(true);
                        return;
                    }
                    if (!inputRef.current) return;
                    searchCallback(inputRef.current, category.value, page.current, setSearchResult);
                }
            },
            {
                root: listRootElement.current,
                threshold: 1,
            },
        );
        if (lastItemElement.current) {
            //console.log("관찰 시작");
            observer.observe(lastItemElement.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [searchResult]);

    return (
        <div className="relative flex w-full">
            <input
                ref={inputRef}
                name="q"
                placeholder="검색..."
                className="w-full min-w-64 appearance-none pr-2 outline-none"

                onChange={(e) => {
                    page.current = 1;
                    setIsLoadingMax(false);
                    if (!e.target.value) {
                        setIsVisible(false);
                        setSearchResult({});
                        return;
                    }

                    debounce(e.target, category, page.current, 12, setSearchResult);
                    setIsVisible(true);
                }}
            />

            {isVisible && (
                <ul
                    ref={(ref) => {
                        listRootElement.current = ref;
                    }}
                    className="bg-panel absolute top-full z-1 mt-2 flex h-96 w-full flex-col gap-2 overflow-y-auto p-2">
                    {category.value == "users" &&
                    searchResult &&
                    searchResult.user &&
                    searchResult.user?.items.length > 0 ? (
                        searchResult.user.items.map((e, idx, arr) => {
                            return (
                                <li
                                    ref={(ref) => {
                                        if (idx == arr.length - 1) {
                                            console.log("우리 연결 ", e.login);
                                            lastItemElement.current = ref;
                                        }
                                    }}
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
                                        className="text-primary flex h-full items-center text-sm hover:underline"
                                        href={e.html_url}>
                                        Github
                                    </a>
                                </li>
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
                    ) : searchResult &&
                      (searchResult.user?.total_count === 0 ||
                          searchResult.repo?.total_count === 0) ? (
                        <div className="flex h-full w-full items-center justify-center">
                            검색 결과가 없습니다.
                        </div>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center gap-2">
                            <VscLoading className="animate-spin" />
                            찾는 중입니다.
                        </div>
                    )}
                    {!searchResult.user && !searchResult.repo ? (
                        <></>
                    ) : !isLoadingMax ? (
                        <div className="flex w-full items-center justify-center">
                            <VscLoading
                                className="animate-spin"
                                size={24}
                            />
                        </div>
                    ) : (
                        <div className="flex w-full items-center justify-center">
                            <span>같은 검색어로 자동완성은 최대 5번만 지원합니다.</span>
                        </div>
                    )}
                </ul>
            )}
        </div>
    );
}
