import { useCallback, useMemo, useRef, useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import { searchAutoComplete } from "~/utils/search/AutoComplete";
import type { ISearchFilterCategory } from "./SearchBar";
import SearchAutocompleteList, { type SearchResult } from "./SearchAutocompleteList";

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
    const categoryRef = useRef<typeof category>(category);

    const [isVisible, setIsVisible] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingMax, setIsLoadingMax] = useState(false);

    const [perPage, setPerpage] = useState(10);
    const page = useRef<number>(1);

    const runSearch = useCallback(
        //검색어가 있는 input 태그, 요청 카테고리, 페이지
        (input: HTMLInputElement, requestedCategory: ISearchFilterCategory, page: number) => {
            if (categoryRef.current.value !== requestedCategory.value) return;

            return searchAutoComplete(input, requestedCategory, page, perPage, (update) => {
                if (categoryRef.current.value === requestedCategory.value) {
                    setSearchResult(update);
                    //update의 개형 자체가 (e)=>e 꼴이라서 react 에서 요구하는 함수형 업데이트의 개형에 맞게 된다.
                    //기존 방식대로 굳이 set함수 자체를 넘기기보다
                    //setState 함수 자체는 원래 컴포넌트에 남겨두고,
                    //"언제 set을 발동시킬것인가"에 대한 책임은 컴포넌트에
                    //어떻게 set을 업데이트에 시킬것인가에 대한 책임은 실제 업데이트에 필요한 직접적인 정보가 많은
                    // searchAutoComplete한테 넘긺으로서 (왜냐면 직접 데이터 fetching 을 하는 로직이니까) 클로저를 영리하게 활용한 셈.
                    //(a : (b : T) => T) => void
                    //매우 인상깊은 codex 코드임
                    // 합성 함수 방식 f(f(x))...
                }
            });
        },
        [setSearchResult],
    );
    const debounce = useDebounce(runSearch, 500);

    //category가 변화할 때 지금 입력값을 기준으로 searchResult를 바꾸는 로직
    useMemo(() => {
        //이전 카테고리와 설정이 다르다면, 이전 카테고리로 검색한 내용들은 지워야 지워야 합니다.
        // 1. searchResult의 초기화
        // 2. loadingMax (최대 로딩 한도 UI 상태) 초기화
        // 3. laodingMore (더 로딩 하는 상태에 대한 UI) 초기화
        if (categoryRef.current.value != category.value) {
            categoryRef.current = category;
            page.current = 1;

            if (!inputRef.current) return;

            setIsLoadingMax(false);
            setIsLoadingMore(false);
            setSearchResult({}); //초기화 해야함
            void runSearch(inputRef.current, category, page.current);
        }
    }, [category, runSearch, setSearchResult]);

    const loadMore = useCallback(async () => {
        page.current++;

        if (page.current > maxPage) {
            console.log("더이상 호출은 불가능합니다.");
            setIsLoadingMax(true);
            return;
        }
        if (!inputRef.current) return;

        setIsLoadingMore(true);
        await runSearch(inputRef.current, categoryRef.current, page.current);
        setIsLoadingMore(false);
    }, [maxPage, runSearch]);

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

                    debounce(e.target, category, page.current);
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
