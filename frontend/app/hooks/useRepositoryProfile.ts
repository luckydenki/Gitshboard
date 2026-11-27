import { useQuery } from "@tanstack/react-query";

interface RepositoryProfile {
    name: string;
    nameWithOwner: string;
    description: string | null;
    visibility: string;
    url: string;
    pushedAt: string | null;
    owner: { login: string; avatarUrl: string };
    licenseInfo: { name: string } | null;
    defaultBranchRef: { name: string } | null;
    repositoryTopics: { nodes: Array<{ topic: { name: string } } | null> | null };
    stargazerCount: number;
    forkCount: number;
    watchers: { totalCount: number };
    issues: { totalCount: number };
    pullRequests: { totalCount: number };
}

export default function useRepositoryProfile(owner?: string, repo?: string) {
    return useQuery({
        queryKey: ["repository-profile", owner, repo],
        enabled: Boolean(owner && repo),
        gcTime: 0,
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/repos/${encodeURIComponent(owner!)}/${encodeURIComponent(repo!)}/profile`,
                { credentials: "include", signal },
            );
            if (!response.ok) throw new Error("저장소 프로필을 불러오지 못했습니다.");
            const result = await response.json();
            if (!result.success || !result.data?.repository)
                throw new Error("저장소 프로필을 불러오지 못했습니다.");
            return result.data.repository as RepositoryProfile;
        },
    });
}
