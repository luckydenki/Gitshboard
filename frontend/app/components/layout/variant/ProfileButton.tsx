import { useQuery } from "@tanstack/react-query";
import { dench, HTTPCredentials } from "dench-fetch";
import { useRef } from "react";
import type { CommonResponse } from "~/types/common/common";
import getBackendURL from "~/utils/getBackendURL";


interface UserDataState{
    login : string,
    avatarUrl : string
}

export default function ProfileButton(){
    
    const backendurl =getBackendURL();
    const denchInstance = useRef(dench(`${backendurl}/api/`, "headerDench"));

    const { data, error, isLoading, isError} = useQuery(
        {
            queryKey: ["headerUserData"], 
            queryFn: async() =>{
                
                const res = await denchInstance.current.get<CommonResponse<UserDataState>>("users/userheader")
                .credentials(HTTPCredentials.INCLUDE)
                .error((err)=>{
                    console.error("Failed to fetch user header data:", err);
                })
                .toJson()
                return res.data;
            },
            staleTime : 5 * 60 * 1000, //5분,
            retry : (failureCount, error)=>{
                if(error.message.includes("401")){
                    // Handle unauthorized error
                    return false;
                }

                return failureCount < 3;
            }
        }
    );


    return(
        <button className="flex w-fit items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-gray-900">
            <img
                src={data?.avatarUrl}
                alt="avatar"
                fetchPriority="high"
                className="h-8 w-8 rounded-full"
            />
            <span className="overflow-hidden text-sm font-medium text-gray-700 dark:text-gray-200 not-sm:hidden">{data?.login}</span>
        </button>
    )
}