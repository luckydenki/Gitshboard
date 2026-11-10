import { useCallback, useMemo, useRef, useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import { searchAutoComplete, searchRepo, searchUser } from "~/utils/search/AutoComplete";
import type { ISearchFilterCategory } from "./SearchBar";
import SearchAutocompleteList, { type SearchResult } from "./SearchAutocompleteList";

const searchCallback = async (
    input: HTMLInputElement,
    category: string,
    page: number,
    setSearchResult: React.Dispatch<React.SetStateAction<SearchResult>>,
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
    searchResult: SearchResult;
    setSearchResult: React.Dispatch<React.SetStateAction<SearchResult>>;
    maxPage?: number;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const debounce = useDebounce(searchAutoComplete, 500);
    const page = useRef<number>(1);

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingMax, setIsLoadingMax] = useState(false);
    const categoryRef = useRef<typeof category>(category);

    //category가 변화할 때 지금 입력값을 기준으로 searchResult를 바꾸는 로직
    useMemo(() => {
        if (categoryRef.current.value != category.value) {
            categoryRef.current = category;
            page.current = 1;

            if (!inputRef.current) return;

            setIsLoadingMax(false);
            setIsLoadingMore(false);
            setSearchResult({}); //초기화 해야함
            searchCallback(inputRef.current, category.value, page.current, setSearchResult);
        }
    }, [category, setSearchResult]);

    const loadMore = useCallback(async () => {
        page.current++;

        if (page.current > maxPage) {
            console.log("더이상 호출은 불가능합니다.");
            setIsLoadingMax(true);
            return;
        }
        if (!inputRef.current) return;

        setIsLoadingMore(true);
        await searchCallback(inputRef.current, category.value, page.current, setSearchResult);
        setIsLoadingMore(false);
    }, [category.value, maxPage, setSearchResult]);

    return (
        <div className="relative flex w-full">
            <input
                required
                ref={inputRef}
                name="q"
                placeholder="검색..."
                className="w-full min-w-64 appearance-none outline-none"
                onFocus={(e) => {
                    if (e.target.value) setIsVisible(true);
                }}
                onBlur={() => {
                    setIsVisible(false);
                }}
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
                <SearchAutocompleteList
                    category={category}
                    searchResult={searchResult}
                    isLoadingMax={isLoadingMax}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={loadMore}
                />
            )}
        </div>
    );
}
