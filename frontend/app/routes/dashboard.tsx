import { useNavigate } from "react-router";
import { Loading } from "~/components/design/Loading";
import DashboardSection from "~/components/page/dashboard/DashboardSection";
import useErrorCallback from "~/hooks/useErrorCallback";
import { useQuery } from "@tanstack/react-query";
import { dench } from "dench-fetch";
import { useRef } from "react";
import { HTTPCredentials } from "dench-fetch";
import type { GithubUser } from "~/types/GithubInfo";
import type { CommonResponse } from "~/types/common/common";
import getBackendURL from "~/utils/getBackendURL";

function OnSetFetchMode(e : React.MouseEvent<HTMLButtonElement>, setFetchMode : React.Dispatch<React.SetStateAction<1|2|3>>){
    const val = e.currentTarget.value
    setFetchMode(Number(val) as 1|2|3);
}


export default function Dashboard(){
    const navigate = useNavigate();
    
    const { data, error, isLoading, isError} = useQuery({
        queryKey: ["githubUserData"],
        queryFn : async()=>{
            const json = await fetch("/api/users",{
                method : 'GET',
               credentials : HTTPCredentials.INCLUDE,
            }).then(async(res)=>{
                return await res.json() as CommonResponse<GithubUser>
            })

            return json.data;
        },
        staleTime : 1 * 60 * 1000, //1분
        gcTime : 5 * 60 * 1000, //5분
        retry : (failureCount, error)=>{        //retry
            if(error.message.includes("401")){
                // Handle unauthorized error
                return false;
            }
            return failureCount < 3;
        }
    })


    useErrorCallback(isError, ()=>{
        navigate("/");
    })
    
    if(isLoading){
        return(
            <Loading/>
        )
    }
    return (
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950">
            <DashboardSection userDataState={data!} loading={isLoading} />
        </div>
    );
}
