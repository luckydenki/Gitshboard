import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common/common";
import type { GitHubScope } from "~/types/GithubOAuth";

export default function useGithubScopes() {
    return useQuery({
        queryKey: ["github-scopes"],
        gcTime: 0,
        retry: false,
        queryFn: async ({ signal }) => {
            const response = await fetch("/api/auth/github/scopes", {
                credentials: "include",
                signal,
            });
            if (!response.ok) throw new Error("GitHub 권한을 불러오지 못했습니다.");
            const result: CommonResponse<{ scopes: Array<GitHubScope> }> = await response.json();
            if (!result.success || !Array.isArray(result.data?.scopes)) {
                throw new Error("GitHub 권한을 불러오지 못했습니다.");
            }
            return result.data.scopes;
        },
    });
}
