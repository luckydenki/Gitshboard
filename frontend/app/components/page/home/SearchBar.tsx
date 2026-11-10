import { useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { tv, type VariantProps } from "tailwind-variants";
import SearchFilter from "../search/SearchFilter";

import SearchCategoryOpenButton from "../search/SearchCategoryOpenButton";
import type { UserSearchData } from "~/types/search/user-search";
import type { RepositorySearchData } from "~/types/search/repository-search";
import SearchInputField from "./SearchInputField";

export interface ISearchFilterCategory {
    value: "users" | "repos";
    name: "사용자" | "저장소";
}

const searchBarTv = tv({
    base: "flex w-full flex-col gap-4",
    variants: {
        wsize: {
            sm: "max-w-3xl",
            md: "max-w-4xl",
            lg: "max-w-5xl",
            xl: "max-w-6xl",
            full: "",
        },
    },
    defaultVariants: {
        wsize: "md",
    },
});

export interface SearchChoiceOptions {
    type?: "user" | "org";
    language?: string;
    location?: string;
}

export type SearchChoiceOptionsKeyType = keyof SearchChoiceOptions;

export interface SearchBarProps {
    enableFilter?: boolean;
    variant?: VariantProps<typeof searchBarTv>;
}

/**
 * GitHub REST Search API
 *
 * GET https://api.github.com/search/users?q=<검색식>&page=1&per_page=10
 * GET https://api.github.com/search/repositories?q=<검색식>&page=1&per_page=10
 *
 * URL 쿼리 파라미터
 * q : string (필수, 검색어와 검색 조건을 공백으로 연결한 문자열)
 * page : integer (선택, 페이지 번호, 기본 1)
 * per_page : integer (선택, 페이지당 결과 수, 기본 30, 최대 100)
 *
 * q 안에 붙이는 검색 조건 (key:value)
 * type : user | org (/search/users)
 * language : string (/search/users, /search/repositories)
 * location : string (/search/users)
 *
 * 조건을 적용하지 않을 때는 해당 key:value를 생략한다.
 * q 원문 예시 — octocat type:user language:TypeScript location:"New York"
 * 요청 예시 — https://api.github.com/search/users?q=octocat+type%3Auser+language%3ATypeScript+location%3A%22New+York%22&page=1&per_page=10
 * URLSearchParams에 q 원문을 넘겨 URL 인코딩한다.
 */
export default function SearchBar({ enableFilter, variant }: SearchBarProps) {
    const [category, setCategory] = useState<ISearchFilterCategory>({
        value: "users",
        name: "사용자",
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const [choice, setChoice] = useState<SearchChoiceOptions>({});
    const [perPage, setPerPage] = useState(10);

    const [searchResult, setSearchResult] = useState<{
        user?: UserSearchData;
        repo?: RepositorySearchData;
    }>({});

    const choiceHandler = (
        key: SearchChoiceOptionsKeyType,
        value: (typeof choice)[SearchChoiceOptionsKeyType],
    ) => {
        choice[key] = value as "user" | "org";
        setChoice({
            ...choice,
        });

        inputRef.current;
    };

    return (
        <form
            method="GET"
            action="/search"
            className={searchBarTv(variant)}>
            <div className="bg-panel text-md flex h-12 w-full gap-4 self-center rounded-full shadow-md not-sm:h-16 not-lg:w-full">
                <SearchCategoryOpenButton
                    category={category}
                    setCategory={setCategory}
                />
                <input
                    type="hidden"
                    name="category"
                    value={category.value}
                />
                <input
                    type="hidden"
                    name="page"
                    value={1}
                />
                {/* form 을 쓸 떄 hidden 을 쓰면 어떤 변수 값이든 form 에 포함시켜서
                        보낼 수 있다. 매우 중요할 듯 
                        추가로 name 속성을 넣어야 formData에 추가된다. 이게 허용되는 태그가
                        별도로 있으니 그건 인터넷 찾아보셈
                        */}

                <SearchInputField
                    category={category}
                    searchResult={searchResult}
                    setSearchResult={setSearchResult}
                />

                <button
                    type="submit"
                    className="cursor-pointer pr-8"
                    aria-label="검색 버튼"
                    onSubmit={(e) => {
                        if (!e.currentTarget.value) {
                            e.preventDefault();
                            console.log("입려을 안했는데?");
                        }
                    }}>
                    <BiSearch size="24" />
                </button>
            </div>

            {enableFilter && (
                <SearchFilter
                    choice={choice}
                    category={category}
                    choiceHandler={choiceHandler}
                />
            )}
            {/* 오답 노트 : ??는 undefined 또는 null일 시에만 작동되는 코드
                &&은 falsy값이 아니면 (truthy값) 작동되는 코드
            */}
        </form>
    );
}
