import type { SearchResult } from "../../components/page/home/SearchAutocompleteList";
import type { ISearchFilterCategory } from "../../components/page/home/SearchBar";
import type { CommonResponse } from "~/types/common/common";
import type { UserSearchData } from "~/types/search/user-search";
import type { RepositorySearchData } from "~/types/search/repository-search";

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
    page: number | string,
    per_page: number | string,
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

export const searchUser = async (
    searchForm: FormData | URLSearchParams | string,
    page: number | string,
    per_page: number | string,
) => {
    //return await searchSubmit(formData, page, per_page) as CommonResponse<UserSearchData>
    try {
        let params: URLSearchParams;
        if (searchForm instanceof FormData) {
            params = createSearchParameter(searchForm, page, per_page, [
                "type",
                "language",
                "location",
            ]);
        } else if (searchForm instanceof URLSearchParams) {
            params = searchForm;
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

/**
 * 검색 API의 응답에서 자동완성 목록에 필요한 항목과 전체 개수만 전달합니다.
 * @param input 현재 검색 입력 요소
 * @param category 요청할 사용자 또는 저장소 검색 범주
 * @param page 기존 페이지 번호
 * @param perPage 요청할 항목 수
 * @param updateResult 응답을 목록 상태에 반영하는 함수
 * @returns 요청 처리가 끝나면 완료되며, 검색어가 비어 있거나 응답이 실패하면 상태를 갱신하지 않습니다.
 * @example searchAutoComplete(input, category, 1, 12, setSearchResult)
 */
export const searchAutoComplete = async (
    input: HTMLInputElement,
    category: ISearchFilterCategory,
    page: number,
    perPage: number,
    updateResult: (update: (previous: SearchResult) => SearchResult) => void,
) => {
    const keyword = input.value.trim();
    if (!keyword) return;

    try {
        if (category.value === "users") {
            const response = await searchUser(keyword, page, perPage);
            if (!response?.success || !response.data || input.value.trim() !== keyword) return;

            const { total_count, items } = response.data;

            updateResult((previous) => {
                return {
                    repo: previous.repo,
                    user: previous.user,
                };
            });

            //updateResult의 인자에 이 함수를 실행할 시 발생할 set콜백을 지정한다.
            updateResult((previous) => ({
                user: {
                    total_count,
                    items: page === 1 ? items : [...(previous.user?.items ?? []), ...items],
                },
            }));
        } else {
            const response = await searchRepo(keyword, page, perPage);
            if (!response?.success || !response.data || input.value.trim() !== keyword) return;

            const { total_count, items } = response.data;
            updateResult((previous) => ({
                repo: {
                    total_count,
                    items: page === 1 ? items : [...(previous.repo?.items ?? []), ...items],
                },
            }));
        }
    } catch (error) {
        console.error("자동완성 검색 요청에 실패했습니다.", error);
    }
};
