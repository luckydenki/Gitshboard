import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { BsFilterCircle, BsFilterCircleFill } from "react-icons/bs";
import useDebounce from "~/hooks/useDebounce";
import type { ErrorStatus } from "~/types/common/common";
import CommonError from "~/utils/common-error";

export interface SearchBarProps {
    enableFilter?: boolean;
}

interface ISearchFilterCategory {
    value: "users" | "repos";
    name: "사용자" | "저장소";
}

const searchAutoComplete = async (
    target: EventTarget & HTMLInputElement,
    category: ISearchFilterCategory,
) => {
    console.log("디바운스 호출", target.value, "카테고리 ", category.value);
    try {
        const res = await fetch("", {});

        if (res.ok) {
            console.log("success");
        } else {
            throw new CommonError({
                status: res.status as ErrorStatus,
                title: "니얼굴",
                type: "검색 에러",
                detail: "검색창에서 진짜 심각한 에러가 터졌습니다",
            });
        }
    } catch (e) {
        console.log("error ", e);
    }
};

export default function SearchBar({ enableFilter }: SearchBarProps = { enableFilter: false }) {
    const [category, setCategory] = useState<ISearchFilterCategory>({
        value: "users",
        name: "사용자",
    });
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const debounce = useDebounce(searchAutoComplete, 500);

    return (
        <form
            method="GET"
            className="flex w-full flex-col gap-4">
            <div className="bg-panel text-md flex h-12 w-[80%] gap-4 self-center rounded-full shadow-md not-sm:h-16 not-lg:w-full">
                <button
                    type="button"
                    className="hover:bg-panel-hover relative z-1 rounded-l-full pl-4 text-left hover:cursor-pointer hover:bg-gray-300"
                    onBlur={() => setIsCategoryOpen(false)}
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    aria-label="검색 카테고리 선택 버튼">
                    <div className="w-20">{category.name}</div>

                    {isCategoryOpen && (
                        <ul className="bg-panel [&>li]:hover:bg-back [&>li]:text-md absolute top-full left-0 mt-2 w-full items-center justify-center rounded-lg border border-gray-300 text-center shadow-lg [&>li]:h-10">
                            <li
                                className="flex items-center justify-center"
                                onClick={() =>
                                    setCategory({
                                        value: "users",
                                        name: "사용자",
                                    })
                                }>
                                사용자
                            </li>
                            <li
                                className="flex items-center justify-center"
                                onClick={() =>
                                    setCategory({
                                        value: "repos",
                                        name: "저장소",
                                    })
                                }>
                                저장소
                            </li>
                        </ul>
                    )}
                </button>
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
                <div className="relative w-[80%] self-center not-lg:w-full">
                    <button
                        type="button"
                        className="flex gap-2"
                        onClick={() => {
                            setIsFilterOpen((e) => !e);
                        }}>
                        검색 필터
                        {!isFilterOpen ? (
                            <BsFilterCircle
                                size={24}
                                aria-label="필터링 ui"
                            />
                        ) : (
                            <BsFilterCircleFill
                                size={24}
                                aria-label="필터링 on UI"
                            />
                        )}
                    </button>

                    <div
                        className={
                            isFilterOpen
                                ? `bg-panel/30 absolute flex w-full flex-col gap-3 rounded-lg px-3 py-4 backdrop-blur-sm`
                                : `hidden`
                        }>
                        <fieldset className="flex gap-4 **:appearance-none">
                            <legend className="mb-2 font-semibold">타입</legend>
                            <label className="border-primary group has-checked:bg-primary rounded-full border px-4 py-1 has-checked:text-white">
                                전체
                                <input
                                    type="radio"
                                    name="type"
                                    value="all"
                                    defaultChecked
                                />
                            </label>
                            <label className="border-primary group has-checked:bg-primary rounded-full border px-4 py-1 has-checked:text-white">
                                개인
                                <input
                                    type="radio"
                                    name="type"
                                    value="user"
                                />
                            </label>

                            <label className="border-primary group has-checked:bg-primary rounded-full border px-4 py-1 has-checked:text-white">
                                레포지토리
                                <input
                                    type="radio"
                                    name="type"
                                    value="org"
                                />
                            </label>
                        </fieldset>

                        <div className="flex flex-col">
                            <label
                                className="mb-2 font-semibold"
                                htmlFor="combobox-languages">
                                언어
                            </label>
                            <input
                                placeholder="검색할 언어를 입력하세요 (기본값 : 전체)"
                                id="combobox-languages"
                                name="languages"
                                list="languages"
                                className="focus:outline-primary outline-primary w-sm appearance-none rounded-lg px-2 py-1 outline-1 focus:outline-2"
                                defaultValue={"전체"}
                            />

                            <datalist
                                id="languages"
                                className="appearance-none">
                                <option value="전체" />
                                <option value="JavaScript" />
                                <option value="TypeScript" />
                                <option value="Python" />
                                <option value="Java" />
                            </datalist>
                        </div>

                        <div className="flex flex-col">
                            <label
                                className="mb-2 font-semibold"
                                htmlFor="combobox-languages">
                                지역
                            </label>
                            <input
                                placeholder="지역을 입력하세요"
                                id="locations"
                                name="locations"
                                className="outline-primary h-8 w-sm rounded-lg px-2 py-1 outline-1 focus:outline-2"
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* 오답 노트 : ??는 undefined 또는 null일 시에만 작동되는 코드
                &&은 falsy값이 아니면 (truthy값) 작동되는 코드
            */}
        </form>
    );
}
