import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type {
    GetRepoActivityBranchesDto,
    GetRepoActivityDto,
    GetRepoActivitySummaryDto,
} from "~/types/response/repo-activity";

const staleTime = 5 * 60 * 1000;

async function getActivityData<T>(url: string, signal: AbortSignal, message: string): Promise<T> {
    const response = await fetch(url, { credentials: "include", signal });
    if (!response.ok) throw new Error(message);

    const result: CommonResponse<T> = await response.json();
    if (!result.success || !result.data) throw new Error(message);
    return result.data;
}

export type RepoDashboardActivityMode = "commits" | "pull-requests-issues";

export function useRepoDashboardActivity(
    owner?: string,
    repo?: string,
    mode: RepoDashboardActivityMode = "commits",
    branch?: string | null,
) {
    const queryKey = mode === "commits"
        ? QueryKeys.REPO_DASHBOARD_COMMIT_ACTIVITY
        : QueryKeys.REPO_DASHBOARD_PR_ISSUE_ACTIVITY;

    return useInfiniteQuery({
        queryKey: [queryKey, owner, repo, mode === "commits" ? branch : null],
        enabled: Boolean(owner && repo),
        staleTime,
        gcTime: 0,
        retry: 3,
        initialPageParam: null as string | null,
        queryFn: ({ pageParam, signal }) => {
            const endpoint = mode === "commits" ? "commits" : "pull-requests-issues";
            const params = new URLSearchParams();
            if (pageParam) params.set("cursor", pageParam);
            if (mode === "commits" && branch) params.set("branch", branch);
            const query = params.size ? `?${params.toString()}` : "";
            const url = `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/activity/${endpoint}`;
            return getActivityData<GetRepoActivityDto>(
                url + query, signal, "최근 전적을 불러오지 못했습니다.",
            );
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
}

export function useRepoDashboardActivitySummary(owner?: string, repo?: string, branch?: string | null) {
    return useQuery({
        queryKey: [QueryKeys.REPO_DASHBOARD_ACTIVITY_SUMMARY, owner, repo, branch],
        enabled: Boolean(owner && repo),
        staleTime,
        gcTime: 0,
        retry: 3,
        queryFn: ({ signal }) => {
            const params = new URLSearchParams();
            if (branch) params.set("branch", branch);
            const query = params.size ? `?${params.toString()}` : "";
            return getActivityData<GetRepoActivitySummaryDto>(
                `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/activity/summary${query}`,
                signal,
                "활동 요약을 불러오지 못했습니다.",
            );
        },
    });
}

export function useRepoDashboardActivityBranches(owner?: string, repo?: string) {
    return useInfiniteQuery({
        queryKey: [QueryKeys.REPO_DASHBOARD_ACTIVITY_BRANCHES, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime,
        gcTime: 0,
        retry: 3,
        initialPageParam: null as string | null,
        queryFn: ({ pageParam, signal }) => {
            const params = new URLSearchParams();
            if (pageParam) params.set("cursor", pageParam);
            const query = params.size ? `?${params.toString()}` : "";
            return getActivityData<GetRepoActivityBranchesDto>(
                `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/activity/branches${query}`,
                signal,
                "브랜치 목록을 불러오지 못했습니다.",
            );
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
}
