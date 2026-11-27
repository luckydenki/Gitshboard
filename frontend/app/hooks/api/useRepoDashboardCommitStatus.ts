import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type {
    RepoCommitStatusOverviewDto,
    RepoCommitStatusRecordsDto,
} from "~/types/response/repo-commit-status";

const staleTime = 5 * 60 * 1000;

async function getCommitStatus<T>(url: string, signal: AbortSignal): Promise<T> {
    const response = await fetch(url, { credentials: "include", signal });
    if (!response.ok) throw new Error("커밋 현황을 불러오지 못했습니다.");
    const result: CommonResponse<T> = await response.json();
    if (!result.success || !result.data) throw new Error("커밋 현황을 불러오지 못했습니다.");
    return result.data;
}

function useCommitStatusQuery<T>(
    key: QueryKeys,
    endpoint: "overview" | "records",
    owner?: string,
    repo?: string,
) {
    return useQuery({
        queryKey: [key, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime,
        retry: 3,
        queryFn: ({ signal }) =>
            getCommitStatus<T>(
                `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/commit-status/${endpoint}`,
                signal,
            ),
    });
}

export function useRepoDashboardCommitStatusOverview(owner?: string, repo?: string) {
    return useCommitStatusQuery<RepoCommitStatusOverviewDto>(
        QueryKeys.REPO_DASHBOARD_COMMIT_STATUS_OVERVIEW,
        "overview",
        owner,
        repo,
    );
}

export function useRepoDashboardCommitStatusRecords(owner?: string, repo?: string) {
    return useCommitStatusQuery<RepoCommitStatusRecordsDto>(
        QueryKeys.REPO_DASHBOARD_COMMIT_STATUS_RECORDS,
        "records",
        owner,
        repo,
    );
}
