import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common-response/common";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type { GetRepoReadmeContentDto, GetRepoReadmesDto } from "~/types/response/repo-readme";

async function fetchReadme<T>(url: string, signal: AbortSignal): Promise<T> {
    const response = await fetch(url, { credentials: "include", signal });
    if (!response.ok) throw new Error("README 정보를 불러오지 못했습니다.");
    const result: CommonResponse<T> = await response.json();
    if (!result.success || !result.data) throw new Error("README 정보를 불러오지 못했습니다.");
    return result.data;
}

export function useRepoDashboardReadmes(owner?: string, repo?: string) {
    return useQuery({
        queryKey: [QueryKeys.REPO_DASHBOARD_READMES, owner, repo],
        enabled: Boolean(owner && repo),
        staleTime: 5 * 60 * 1000,
        retry: 3,
        queryFn: ({ signal }) =>
            fetchReadme<GetRepoReadmesDto>(
                `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/readmes`,
                signal,
            ),
    });
}

export function useRepoDashboardReadmeContent(owner?: string, repo?: string, path?: string) {
    return useQuery({
        queryKey: [QueryKeys.REPO_DASHBOARD_README_CONTENT, owner, repo, path],
        enabled: Boolean(owner && repo && path),
        staleTime: 5 * 60 * 1000,
        retry: 3,
        queryFn: ({ signal }) =>
            fetchReadme<GetRepoReadmeContentDto>(
                `/api/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(repo ?? "")}/readmes/content?path=${encodeURIComponent(path ?? "")}`,
                signal,
            ),
    });
}
