import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { tv, type VariantProps } from "tailwind-variants";
import useDebounce from "~/hooks/useDebounce";
import SearchFilter from "../search/SearchFilter";

import SearchCategoryOpenButton from "../search/SearchCategoryOpenButton";
import { searchAutoComplete } from "../utils/search/AutoComplete";

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
    languages?: string;
    location?: string;
}

export type SearchChoiceOptionsKeyType = keyof SearchChoiceOptions;

export interface SearchBarProps {
    enableFilter?: boolean;
    variant?: VariantProps<typeof searchBarTv>;
}

export default function SearchBar({ enableFilter, variant }: SearchBarProps) {
    const [category, setCategory] = useState<ISearchFilterCategory>({
        value: "users",
        name: "사용자",
    });
    const [choice, setChoice] = useState<SearchChoiceOptions>({});
    const debounce = useDebounce(searchAutoComplete, 500);

    const choiceHandler = (
        key: SearchChoiceOptionsKeyType,
        value: (typeof choice)[SearchChoiceOptionsKeyType],
    ) => {
        choice[key] = value as "user" | "org";
        setChoice({
            ...choice,
        });
    };

    return (
        <form
            method="GET"
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
                {/* form 을 쓸 떄 hidden 을 쓰면 어떤 변수 값이든 form 에 포함시켜서
                        보낼 수 있다. 매우 중요할 듯 
                        추가로 name 속성을 넣어야 formData에 추가된다. 이게 허용되는 태그가
                        별도로 있으니 그건 인터넷 찾아보셈
                        */}

                <input
                    name="search-query"
                    placeholder="검색..."
                    className="w-full min-w-64 appearance-none pr-2 outline-none"
                    onChange={(e) => {
                        debounce(e.target, category);
                    }}
                />

                <button
                    type="submit"
                    className="cursor-pointer pr-8"
                    aria-label="검색 버튼"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        const form = e.currentTarget.form;
                        if (!form) {
                            return;
                        }
                        new FormData(form).forEach((value, key) => {
                            console.log(key, value);
                        });
                        console.log("form :", form);
                    }}>
                    <BiSearch size="24" />
                </button>
            </div>

            {enableFilter && (
                <SearchFilter
                    choice={choice}
                    choiceHandler={choiceHandler}
                />
            )}
            {/* 오답 노트 : ??는 undefined 또는 null일 시에만 작동되는 코드
                &&은 falsy값이 아니면 (truthy값) 작동되는 코드
            */}
        </form>
    );
}
