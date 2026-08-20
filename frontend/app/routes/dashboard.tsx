import { Loading } from "~/components/design/Loading";
import DashboardSection from "~/components/page/dashboard/DashboardSection";
import { useQuery } from "@tanstack/react-query";
import { HTTPCredentials } from "dench-fetch";
import type { GithubUser } from "~/types/GithubInfo";
import type { CommonResponse } from "~/types/common/common";

export default function Dashboard(){
    const { data, isLoading, isError } = useQuery({
        queryKey: ["githubUserData"],
        queryFn : async()=>{
            try{
            const res = await fetch("/api/users",{
                method : 'GET',
               credentials : HTTPCredentials.INCLUDE,
            })

            if(!res.ok){
                throw await res.json();
            }

            const json = await res.json() as CommonResponse<GithubUser>
            return json.data;

            }catch(error){
                throw error;
            }
        },
        staleTime : 1 * 60 * 1000, //1분
        gcTime : 5 * 60 * 1000, //5분
        retry : (failureCount, error)=>{        //retry
            if("status" in error && error.status === 401){
                // Handle unauthorized error
                return false;
            }
            return failureCount < 3;
        }
    })

    
    if(isLoading){
        return(
            <Loading/>
        )
    }
    if(isError){
        return(
            <div>Error occurred while fetching data.</div>
        )
    }


    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950">
            <DashboardSection userDataState={data!} />
        </div>
    );
}
