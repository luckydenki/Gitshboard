import { useQuery } from "@tanstack/react-query";
import { HTTPCredentials } from "dench-fetch";
import type { GithubCommitActivity } from "~/routes/contribute";
import type { CommonErrorResponse } from "~/types/common/common";
import { commonRetry } from "~/utils/tanstackUtil";





export function useContributeData(from : string, to : string) {

    const params = new URLSearchParams({
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString(),
    });

    const { data, isLoading, isError, error } = useQuery<GithubCommitActivity, CommonErrorResponse>({
        queryKey: ["contributeData", from, to],
        queryFn: async () => {
            const response = await fetch(`/api/contribute/commitActivity?${params.toString()}`, {
                method: "GET",
                credentials: HTTPCredentials.INCLUDE,
            });
            const json = await response.json();

            if (!response.ok) {
                throw json; // CommonErrorResponse 타입으로 내려옴
            }

            return json.data as GithubCommitActivity;
        },
        gcTime: 10 * 60 * 1000,
    });
    
    return { data, isLoading, isError, error };



}