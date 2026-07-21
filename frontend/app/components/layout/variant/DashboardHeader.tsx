import { dench, HTTPCredentials } from "dench-fetch";
import { useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import HeaderLayout from "~/components/layout/variant/HeaderLayout";
import getBackendURL from "~/utils/getBackendURL";
import type { CommonResponse } from "~/types/common/common";
import SearchForm from "~/components/page/home/SearchForm";

/*
    사용 페이지
    dashboard.tsx
    statpage.tsx
*/



interface UserDataState{
    login : string,
    avatarUrl : string
}

function DashboardMenu({name, onClick} : {name: string, onClick : ()=>void}){

    return(
        <>
          <button className="hover:text-gray-400 hover:cursor-pointer dark:hover:text-gray-300"
            onClick={onClick}>{name}</button>
        </>
    )

}



export default function DashboardHeader(){
    
    const navigate = useNavigate();
    const backendurl = getBackendURL();
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

    
    const menus = useMemo(()=> {
        const menuList = [
            {name : "Profile", link : "/dashboard"},
            {name : "Statistics", link : "/statpage"},
        ]

        return menuList.map((menu, index)=>{
            return (<DashboardMenu key={index} 
                name={menu.name} 
                onClick={()=>{
                navigate(menu.link); }} />  )
        })
    }, []);

    return(
        <HeaderLayout onClick={()=>navigate("/dashboard")}>
            <div className="flex flex-row gap-3">
                <nav className="flex flex-row gap-6 font-medium text-md not-sm:font-light tracking-[0.12em] text-gray-800 dark:text-gray-200">
                    {menus}
                </nav>

                <SearchForm
                    Customform={`
                        flex flex-row rounded-full shadow-md text-sm pl-4 pr-2 py-1
                    `}
                    CustomInput={`
                        
                    `}
                />

                <button className="flex w-fit items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-gray-900">
                    <img
                        src={data?.avatarUrl}
                        alt="avatar"
                        fetchPriority="high"
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="overflow-hidden text-sm font-medium text-gray-700 dark:text-gray-200 not-sm:hidden">{data?.login}</span>
                </button>
            </div>
        </HeaderLayout>
    )
}

