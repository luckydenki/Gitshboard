import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type { GetRepoActivityDto, GetRepoActivitySummaryDto } from "~/types/response/repo-activity";

const staleTime = 5 * 60 * 1000;

async function getActivityData<T>(url: string, signal: AbortSignal, message: string): Promise<T> {
    const response = await fetch(url, { credentials: "include", signal });
    if (!response.ok) throw new Error(message);

    const result: CommonResponse<T> = await response.json();
    if (!result.success || !result.data) throw new Error(message);
    return result.data;
}

export function useRepoDashboardActivity(owner?: string, repo?: string) {
    return useInfiniteQuery({
        queryKey: [QueryKeys.REPO_DASHBOARD_ACTIVITY, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime,
        gcTime: 0,
        retry: 3,
        initialPageParam: null as string | null,
        queryFn: ({ pageParam, signal }) => {
            const url = `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/activity`;
            const query = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : "";
            return getActivityData<GetRepoActivityDto>(
                url + query, signal, "최근 전적을 불러오지 못했습니다.",
            );
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
}

export function useRepoDashboardActivitySummary(owner?: string, repo?: string) {
    return useQuery({
        queryKey: [QueryKeys.REPO_DASHBOARD_ACTIVITY_SUMMARY, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime,
        gcTime: 0,
        retry: 3,
        queryFn: ({ signal }) => getActivityData<GetRepoActivitySummaryDto>(
            `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/activity/summary`,
            signal,
            "활동 요약을 불러오지 못했습니다.",
        ),
    });
}
