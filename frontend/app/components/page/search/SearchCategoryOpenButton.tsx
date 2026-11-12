import { useState, type Dispatch, type SetStateAction } from "react";
import type { ISearchFilterCategory } from "../home/SearchBar";
import ListLayout, { ListButton } from "~/components/common/ListLayout";

export default function SearchCategoryOpenButton({
    category,
    setCategory,
}: {
    category: ISearchFilterCategory;
    setCategory: Dispatch<SetStateAction<ISearchFilterCategory>>;
}) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    //console.log("재렌더링", category);

    return (
        <div
            className="hover:bg-panel-hover relative z-2 flex items-center justify-center rounded-l-full pl-4 text-left hover:cursor-pointer hover:bg-gray-300"
            onBlur={() => setIsCategoryOpen(false)}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            aria-label="검색 카테고리 선택 버튼">
            <div className="w-20">{category.name}</div>

            {isCategoryOpen && (
                <ListLayout>
                    <ListButton
                        value="사용자"
                        callback={() =>
                            setCategory({
                                value: "users",
                                name: "사용자",
                            })
                        }
                    />
                    <ListButton
                        value="저장소"
                        callback={() =>
                            setCategory({
                                value: "repos",
                                name: "저장소",
                            })
                        }
                    />
                </ListLayout>
            )}
        </div>
    );
}
