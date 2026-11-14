import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common-response/common";

interface OrgProfile {
    login: string;
    name: string | null;
    avatarUrl: string;
    url: string;
    description: string | null;
    location: string | null;
    websiteUrl: string | null;
    createdAt: string;
    twitterUsername: string | null;
    membersWithRole: { totalCount: number } | null;
    repositories: { totalCount: number };
}

export default function useOrgDashboardProfile(login?: string) {
    return useQuery({
        queryKey: ["org-profile", login],
        enabled: Boolean(login),
        gcTime: 0,
        queryFn: async ({ signal }) => {
            const message = "조직 프로필을 불러오지 못했습니다.";
            const response = await fetch(`/api/orgs/${encodeURIComponent(login ?? "")}/profile`, {
                credentials: "include",
                signal,
            });
            if (!response.ok) throw new Error(message);
            const result: CommonResponse<{ organization: OrgProfile | null }> = await response.json();
            if (!result.success || !result.data?.organization) throw new Error(message);
            return result.data.organization;
        },
    });
}
