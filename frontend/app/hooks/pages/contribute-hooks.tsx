import { useQuery } from "@tanstack/react-query";
import { HTTPCredentials } from "dench-fetch";
import type { GithubCommitActivity } from "~/routes/contribute";





export function useContributeData(from : string, to : string) {

    const params = new URLSearchParams({
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString(),
    });



    const { data, isLoading, isError } = useQuery<GithubCommitActivity>({
        queryKey: ["contributeData", from, to],
        queryFn: async () => {
            const response = await fetch(`/api/contribute/commitActivity?${params.toString()}`, {
                method: "GET",
                credentials: HTTPCredentials.INCLUDE,
            });
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message ?? "Unable to load commit activity");
            }

            return json.data as GithubCommitActivity;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
    
    return { data, isLoading, isError };



}