import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "~/types/queryKey/query-key-enum";
import type { CommonResponse } from "~/types/common-response/common";
import type { GetRepoCommunicationData } from "~/types/response/repo-communication";
export function useRepoCommunication(
    owner: string | undefined,
    repo: string | undefined,
    endpoint: string,
) {
    return useQuery({
        queryKey: [QueryKeys.REPO_COMMUNICATION, owner, repo, endpoint],
        enabled: !!owner && !!repo,
        staleTime: 300000,
        retry: 3,
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/repos/${encodeURIComponent(owner!)}/${encodeURIComponent(repo!)}/communication/${endpoint}`,
                { signal, credentials: "include" },
            );
            if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
            const result: CommonResponse<GetRepoCommunicationData> = await response.json();
            if (!result.success || !result.data) throw new Error("응답을 확인할 수 없습니다.");
            return result.data;
        },
    });
}
