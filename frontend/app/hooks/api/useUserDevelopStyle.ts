import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type { CommonResponse } from "~/types/common-response/common";
import type { UserDevelopStyle } from "~/types/response/user-develop-style";
export function useUserDevelopStyle(login: string) {
    return useQuery({
        queryKey: [QueryKeys.USER_DEVELOP_STYLE, login, "Asia/Seoul"],
        enabled: !!login,
        staleTime: 5 * 60 * 1000,
        retry: 3,
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/users/${encodeURIComponent(login)}/develop-style?timezone=Asia%2FSeoul`,
                { signal, credentials: "include" },
            );
            const result: CommonResponse<UserDevelopStyle> = await response.json();
            if (!response.ok || !result.success || !result.data)
                throw new Error("개발 성향 정보를 불러오지 못했습니다.");
            return result.data;
        },
    });
}
