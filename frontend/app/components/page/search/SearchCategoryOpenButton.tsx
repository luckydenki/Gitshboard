import { useState, type Dispatch, type SetStateAction } from "react";
import type { ISearchFilterCategory } from "../home/SearchBar";

const CategoryButton = ({ value, callback }: { value: string; callback: () => void }) => {
    return (
        <li
            className="flex items-center justify-center"
            onClick={callback}>
            {value}
        </li>
    );
};

export default function SearchCategoryOpenButton({
    category,
    setCategory,
}: {
    category: ISearchFilterCategory;
    setCategory: Dispatch<SetStateAction<ISearchFilterCategory>>;
}) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <button
            type="button"
            className="hover:bg-panel-hover relative z-1 rounded-l-full pl-4 text-left hover:cursor-pointer hover:bg-gray-300"
            onBlur={() => setIsCategoryOpen(false)}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            aria-label="검색 카테고리 선택 버튼">
            <div className="w-20">{category.name}</div>

            {isCategoryOpen && (
                <ul className="bg-panel [&>li]:hover:bg-back [&>li]:text-md absolute top-full left-0 mt-2 w-full items-center justify-center rounded-lg border border-gray-300 text-center shadow-lg [&>li]:h-10">
                    <CategoryButton
                        value="사용자"
                        callback={() =>
                            setCategory({
                                value: "users",
                                name: "사용자",
                            })
                        }
                    />
                    <CategoryButton
                        value="저장소"
                        callback={() =>
                            setCategory({
                                value: "repos",
                                name: "저장소",
                            })
                        }
                    />
                </ul>
            )}
        </button>
    );
}
