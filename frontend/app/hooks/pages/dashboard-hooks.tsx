import type { GithubRepositoryResponse } from "~/types/GithubInfo";
import useManagedKeyQuery from "../useManagedKeyQuery";
import { QueryKeys } from "~/types/query-key-enum";
import CommonError from "~/utils/common-error";


export function useDashboardData(){

    const { data, isLoading, isError} = useManagedKeyQuery<GithubRepositoryResponse>([QueryKeys.USER_REPOS],{
          queryFn : async()=>{
            const response = await fetch("/api/users/repos", {
                method :'GET',
                credentials : 'include'
            });
            
            const json = await response.json();
            if(!response.ok){
                const error = new CommonError({
                    status : json.status,
                    title : json.title,
                    type : json.type,
                    detail : json.detail,
                    instance : json.instance,
                })

                throw error;
            }
            return json.data;
        },
    });

    return { data, isLoading, isError};
}

