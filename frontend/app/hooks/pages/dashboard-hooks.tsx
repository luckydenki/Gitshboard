import { useQuery } from "@tanstack/react-query";
import type { GithubRepositoryResponse } from "~/types/GithubInfo";


export function useDashboardData(){

    const { data, isLoading, isError} = useQuery<GithubRepositoryResponse>({
        queryKey: ["dashboardData"],
        queryFn : async()=>{
            const response = await fetch("/api/users/repos", {
                method :'GET',
                credentials : 'include'
            });
            
            const json = await response.json();

            if(!response.ok){
                throw json;
            }

            console.log("dashboard data : ", json.data);
            return json.data;
        },
    });

    return { data, isLoading, isError};
}

