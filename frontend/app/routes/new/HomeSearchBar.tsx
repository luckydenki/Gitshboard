import { useState } from "react";
import { BiSearch } from "react-icons/bi";

export default function HomeSearchBar() {
    const [category, setCategory] = useState("사용자");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <form
            method="GET"
            className="bg-panel text-md flex h-12 w-[80%] gap-4 rounded-full shadow-md not-sm:h-16 not-lg:w-full">
            <button
                type="button"
                className="hover:bg-panel-hover relative z-1 rounded-l-full pl-4 text-left hover:cursor-pointer hover:bg-gray-300"
                onBlur={() => setIsCategoryOpen(false)}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                aria-label="검색 카테고리 선택 버튼">
                <div className="w-20">{category}</div>

                {isCategoryOpen && (
                    <ul className="bg-panel [&>li]:hover:bg-back [&>li]:text-md absolute top-full left-0 mt-2 w-full items-center justify-center rounded-lg border border-gray-300 text-center shadow-lg [&>li]:h-10">
                        <li
                            className="flex items-center justify-center"
                            onClick={() => setCategory("사용자")}>
                            사용자
                        </li>
                        <li
                            className="flex items-center justify-center"
                            onClick={() => setCategory("저장소")}>
                            저장소
                        </li>
                    </ul>
                )}
            </button>
            <input
                type="hidden"
                name="category"
                value={category}
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
        </form>
    );
}
