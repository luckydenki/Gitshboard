import CommonError from "~/utils/common/common-error";
import type { ISearchFilterCategory } from "../../components/page/home/SearchBar";
import type { CommonResponse, ErrorStatus } from "~/types/common/common";
import type { UserSearchData } from "~/types/search/user-search";
import type { RepositorySearchData } from "~/types/search/repository-search";
import { QueryClient } from "@tanstack/react-query";

/**
 * 최종 검색 스트링 q를 생성하는 메서드
 *
 * @param formq 검색어
 * @param options 옵션 배열
 * - formData : 원래 formData
 * - querykey : 검색 조건(쿼리) 키값 배열입니다.
 * @returns `(검색 스트링)  검색키1:검색값1 검색키2:검색값2 ...`
 */
const createq = (formq: string, options?: { formData: FormData; querykey: Array<string> }) => {
    let q = formq;

    if (options) {
        const { formData, querykey } = options;

        const qarray = querykey.map((e) => {
            if (formData.has(e)) {
                const value = formData.get(e);
                return `${e}:${value}`;
            }
        });
        console.log("qarray", qarray);
        q += " " + qarray.join(" ");
    }

    return q;
};

const createSearchParameter = (
    formData: FormData,
    page: number,
    per_page: number,
    querykey: Array<string>,
) => {
    const formq = formData.get("q")?.toString();

    if (!formq) throw new Error("검색어를 입력하세요");

    const q = createq(formq, { formData, querykey });
    const params = new URLSearchParams({
        q,
        page: `${page}`,
        per_page: `${per_page}`,
    });

    return params;
};

const createSearchParameterByString = (paramkey: Array<string>, paramValues: Array<string>) => {
    if (paramkey.length !== paramValues.length)
        throw new Error("쿼리 키와 값의 짝이 맞지 않습니다.");

    const params = new URLSearchParams();

    paramkey.forEach((e, idx) => {
        params.append(e, paramValues[idx]);
    });

    return params;
};

/**
 * 검색 API를 fetch해주는 wrapping 메서드
 *
 * @param category
 * @param params
 */
const searchfetch = async (category: string, params: URLSearchParams) => {
    try {
        const res = await fetch(`/api/search/${category}?${params.toString()}`);
        if (res.ok) {
            const json = await res.json();
            return json;
        }
    } catch (e) {
        throw e;
    }
};

export const searchUser = async (searchForm: FormData | string, page: number, per_page: number) => {
    //return await searchSubmit(formData, page, per_page) as CommonResponse<UserSearchData>
    try {
        let params: URLSearchParams;
        if (searchForm instanceof FormData) {
            params = createSearchParameter(searchForm, page, per_page, [
                "type",
                "language",
                "location",
            ]);
        } else {
            params = createSearchParameterByString(
                ["q", "page", "per_page"],
                [searchForm, page.toString(), per_page.toString()],
            );
        }
        const data: CommonResponse<UserSearchData> = await searchfetch("users", params);
        return data;
    } catch (e) {
        throw e;
    }
};

export const searchRepo = async (searchForm: FormData | string, page: number, per_page: number) => {
    try {
        let params: URLSearchParams;
        if (searchForm instanceof FormData) {
            params = createSearchParameter(searchForm, page, per_page, ["type", "language"]);
        } else {
            params = createSearchParameterByString(
                ["q", "page", "per_page"],
                [searchForm, page.toString(), per_page.toString()],
            );
        }
        const data: CommonResponse<RepositorySearchData> = await searchfetch("repos", params);
        return data;
    } catch (e) {
        throw e;
    }
};

export const searchAutoComplete = async (
    target: EventTarget & HTMLInputElement,
    category: ISearchFilterCategory,
    page: number,
    per_page: number,
    setState: React.Dispatch<
        React.SetStateAction<{
            user?: UserSearchData;
            repo?: RepositorySearchData;
        }>
    >,
) => {
    try {
        if (!target.value) return;

        const params = createSearchParameterByString(
            ["q", "page", "per_page"],
            [target.value, page.toString(), per_page.toString()],
        );
        const res = await fetch(`api/search/${category.value}?${params.toString()}`);

        if (res.ok) {
            const json = await res.json();

            setState((e) => {
                if (category.value == "users") {
                    const newdata: CommonResponse<UserSearchData> = json;
                    return {
                        repo: undefined,
                        user: newdata.data,
                    };
                } else {
                    const newdata: CommonResponse<RepositorySearchData> = json;
                    return {
                        user: undefined,
                        repo: newdata.data,
                    };
                }
            });

            //console.log("success");
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
