import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type {
    RepoProjectBranchesDto,
    RepoProjectDeploymentsDto,
    RepoProjectFilesDto,
    RepoProjectHistoryDto,
    RepoProjectOverviewDto,
    RepoProjectParticipationDto,
} from "~/types/response/repo-project-status";

const staleTime = 5 * 60 * 1000;

async function getProjectData<T>(url: string, signal: AbortSignal, message: string): Promise<T> {
    const response = await fetch(url, { credentials: "include", signal });
    if (!response.ok) throw new Error(message);

    const result: CommonResponse<T> = await response.json();
    if (!result.success || !result.data) throw new Error(message);
    return result.data;
}

function useRepoProjectQuery<T>(key: QueryKeys, endpoint: string, owner?: string, repo?: string) {
    return useQuery({
        queryKey: [key, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime,
        gcTime: 0,
        retry: 3,
        queryFn: ({ signal }) =>
            getProjectData<T>(
                `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/project/${endpoint}`,
                signal,
                "프로젝트 현황을 불러오지 못했습니다.",
            ),
    });
}

export function useRepoDashboardProjectOverview(owner?: string, repo?: string) {
    return useRepoProjectQuery<RepoProjectOverviewDto>(
        QueryKeys.REPO_DASHBOARD_PROJECT_OVERVIEW,
        "overview",
        owner,
        repo,
    );
}

export function useRepoDashboardProjectFiles(owner?: string, repo?: string) {
    return useRepoProjectQuery<RepoProjectFilesDto>(
        QueryKeys.REPO_DASHBOARD_PROJECT_FILES,
        "files",
        owner,
        repo,
    );
}

export function useRepoDashboardProjectBranches(owner?: string, repo?: string) {
    return useRepoProjectQuery<RepoProjectBranchesDto>(
        QueryKeys.REPO_DASHBOARD_PROJECT_BRANCHES,
        "branches",
        owner,
        repo,
    );
}

export function useRepoDashboardProjectHistory(owner?: string, repo?: string) {
    return useRepoProjectQuery<RepoProjectHistoryDto>(
        QueryKeys.REPO_DASHBOARD_PROJECT_HISTORY,
        "history",
        owner,
        repo,
    );
}

export function useRepoDashboardProjectParticipation(owner?: string, repo?: string) {
    return useRepoProjectQuery<RepoProjectParticipationDto>(
        QueryKeys.REPO_DASHBOARD_PROJECT_PARTICIPATION,
        "participation",
        owner,
        repo,
    );
}

export function useRepoDashboardProjectDeployments(owner?: string, repo?: string) {
    return useRepoProjectQuery<RepoProjectDeploymentsDto>(
        QueryKeys.REPO_DASHBOARD_PROJECT_DEPLOYMENTS,
        "deployments",
        owner,
        repo,
    );
}
