import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common/common";
import type { Profile } from "~/types/profile";

export type DashboardProfile = Omit<Profile, "contributionsCollection" | "socialAccounts"> & {
    socialAccounts: { nodes?: Profile["socialAccounts"]["nodes"] | null };
    contributionsCollection: {
        contributionCalendar: {
            totalContributions: number;
            weeks: Array<{
                contributionDays: Array<{ date: string; contributionCount: number }>;
            }>;
        };
    };
};

interface RecentActivityItem {
    id: string;
    url: string;
    nameWithOwner: string;
    occurredAt: string;
}

export type UserRecentActivityItem = RecentActivityItem &
    (
        | {
              type: "issue" | "pull-request";
              number: number;
              title: string;
              state: "OPEN" | "CLOSED" | "MERGED";
              authorLogin: string | null;
              commentCount: number;
          }
        | {
              type: "commit";
              oid: string;
              abbreviatedOid: string;
              messageHeadline: string;
              committedViaWeb: boolean;
          }
    );

async function fetchDashboardData<T>(url: string, signal: AbortSignal, errorMessage: string) {
    const response = await fetch(url, { credentials: "include", signal });
    if (!response.ok) throw new Error(errorMessage);

    const result: CommonResponse<T> = await response.json();
    if (!result.success || result.data == null) throw new Error(errorMessage);
    return result.data;
}

export function useUserDashboardProfile(login?: string) {
    return useQuery({
        queryKey: ["user-dashboard-profile", login],
        enabled: Boolean(login),
        gcTime: 0,
        queryFn: async ({ signal }) => {
            const errorMessage = "GitHub 프로필을 불러오지 못했습니다.";
            const { user } = await fetchDashboardData<{ user: DashboardProfile | null }>(
                `/api/users/${encodeURIComponent(login ?? "")}/profile`,
                signal,
                errorMessage,
            );
            if (!user) throw new Error(errorMessage);
            return user;
        },
    });
}

export function useUserRecentActivity(login?: string) {
    return useQuery({
        queryKey: ["user-dashboard-recent-activity", login],
        enabled: Boolean(login),
        queryFn: ({ signal }) =>
            fetchDashboardData<{ items: UserRecentActivityItem[] }>(
                `/api/users/${encodeURIComponent(login ?? "")}/recent-activity`,
                signal,
                "최근 활동을 불러오지 못했습니다.",
            ),
    });
}
