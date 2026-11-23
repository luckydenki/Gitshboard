import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type { RepoPopularIssuesDto } from "~/types/response/repo-popular-issues";

export function useRepoDashboardPopularIssues(owner?: string, repo?: string) {
    return useQuery({
        queryKey: [QueryKeys.REPO_DASHBOARD_POPULAR_ISSUES, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime: 5 * 60 * 1000,
        retry: 3,
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/pr-issue/popular`,
                { credentials: "include", signal },
            );
            if (!response.ok) throw new Error("인기 Issue를 불러오지 못했습니다.");
            const result: CommonResponse<RepoPopularIssuesDto> = await response.json();
            if (!result.success || !result.data)
                throw new Error("인기 Issue를 불러오지 못했습니다.");
            return result.data;
        },
    });
}
