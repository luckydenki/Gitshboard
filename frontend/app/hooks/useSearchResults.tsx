import { useQuery } from "@tanstack/react-query";
import { searchRepo, searchUser } from "~/utils/page/search/AutoComplete";

export default function useSearchResults(
    params: URLSearchParams,
    category: "repos" | "users",
    page: number,
    perPage: number,
    keyword: string,
) {
    return useQuery({
        queryKey: ["search-results", params.toString()],
        enabled: Boolean(keyword), //어떤 값이 존재해야 실행 시킬지
        queryFn: async () => {
            const form = new FormData();
            form.set("q", keyword);

            const language = params
                .getAll("language")
                .reverse()
                .find((value) => value.trim());
            if (language) form.set("language", language.trim());

            if (category === "repos") {
                const response = await searchRepo(form, page, perPage);
                if (!response?.success || !response.data) {
                    throw new Error("저장소 검색에 실패했습니다.");
                }
                return { category, data: response.data } as const;
            }

            const type = params.get("type");
            const location = params.get("location")?.trim();
            if (type === "user" || type === "org") form.set("type", type);
            if (location) form.set("location", /\s/.test(location) ? `"${location}"` : location);

            const response = await searchUser(form, page, perPage);
            if (!response?.success || !response.data) {
                throw new Error("사용자 검색에 실패했습니다.");
            }
            return { category, data: response.data } as const;
        },
    });
}
