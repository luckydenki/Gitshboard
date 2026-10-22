import CommonError from "~/utils/old/common-error";
import type { ISearchFilterCategory } from "../../components/home/SearchBar";
import type { ErrorStatus } from "~/types/common/common";

export const searchAutoComplete = async (
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