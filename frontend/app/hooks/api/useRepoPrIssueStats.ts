import { useQuery } from "@tanstack/react-query";
import type { CommonResponse, CommonErrorResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type {
    GetRepoIssueStatsData,
    GetRepoPullRequestStatsData,
} from "~/types/response/repo-pr-issue";

function useRepoPrIssueQuery<T>(
    key: QueryKeys,
    endpoint: "issues" | "pull-requests",
    owner?: string,
    repo?: string,
) {
    return useQuery({
        queryKey: [key, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime: 5 * 60 * 1000,
        retry: 3,
        queryFn: async ({ signal }) => {
            const result = await fetch(
                `/api/repos/${encodeURIComponent(owner!)}/${encodeURIComponent(repo!)}/pr-issue/${endpoint}`,
                { credentials: "include", signal },
            );
            if (!result.ok) {
                const error: CommonErrorResponse | undefined = await result
                    .json()
                    .catch(() => undefined);
                throw new Error(error?.detail || "저장소 통계를 불러오지 못했습니다.");
            }
            const response: CommonResponse<T> = await result.json();
            if (!response.success || !response.data)
                throw new Error("저장소 통계를 불러오지 못했습니다.");
            return response.data;
        },
    });
}

export function useRepoIssueStats(owner?: string, repo?: string) {
    return useRepoPrIssueQuery<GetRepoIssueStatsData>(
        QueryKeys.REPO_DASHBOARD_ISSUE_STATS,
        "issues",
        owner,
        repo,
    );
}

export function useRepoPullRequestStats(owner?: string, repo?: string) {
    return useRepoPrIssueQuery<GetRepoPullRequestStatsData>(
        QueryKeys.REPO_DASHBOARD_PULL_REQUEST_STATS,
        "pull-requests",
        owner,
        repo,
    );
}
