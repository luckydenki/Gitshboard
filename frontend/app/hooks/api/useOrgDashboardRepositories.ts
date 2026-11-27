import { useQuery } from "@tanstack/react-query";
import type { UserDashboardRepositories } from "~/hooks/useUserDashboard";
import type { CommonResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";

export type OrgDashboardRepositories = UserDashboardRepositories;

export function useOrgDashboardRepositories(login?: string) {
    return useQuery({
        queryKey: [QueryKeys.ORG_DASHBOARD_REPOSITORIES, login],
        enabled: Boolean(login),
        staleTime: 5 * 60 * 1000,
        retry: 3,
        queryFn: async ({ signal }) => {
            const message = "조직 저장소를 불러오지 못했습니다.";
            const response = await fetch(
                `/api/orgs/${encodeURIComponent(login ?? "")}/repositories`,
                { credentials: "include", signal },
            );
            if (!response.ok) throw new Error(message);

            const result: CommonResponse<OrgDashboardRepositories> = await response.json();
            if (!result.success || !result.data) throw new Error(message);
            return result.data;
        },
    });
}
