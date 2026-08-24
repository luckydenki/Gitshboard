import { HTTPCredentials } from "dench-fetch";
import { useContext, useMemo } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import HeaderLayout from "~/components/layout/variant/HeaderLayout";
import type { CommonResponse } from "~/types/common/common";
import SearchForm from "~/components/page/home/SearchForm";
import HeaderProfileButton from "~/components/common/HeaderProfileButton";
import { DashboardContext } from "~/stores/dashboardContext";
import { commonRetry } from "~/utils/tanstackUtil";

/*
    사용 페이지
    dashboard.tsx
    statpage.tsx
*/

interface UserDataState{
    login : string,
    avatarUrl : string
}

function DashboardMenu({name, href, onClick} : {name: string, href:string, onClick?: ()=>void}){

    return(
        <>
          <Link 
            className="hover:text-gray-400 dark:hover:text-gray-300"
            to={href}
            onClick={onClick}>{name}</Link>
        </>
    )

}



export default function DashboardHeader(){

    const { data, isLoading, isError} = useQuery(
        {
            queryKey: ["userheader"], 
            queryFn: async() =>{
                try {
                    const json = await fetch(`/api/users/userheader`,{
                        method : 'GET',
                        credentials : HTTPCredentials.INCLUDE,
                    }).then(async(res)=>{   
                        console.log("response", res)
                        return await res.json() as CommonResponse<UserDataState>
                    })

                    if(json.status !== 200){
                        console.log("not 200", json)
                        throw json;
                    }
                    console.log("header ",json)
                    return json.data;
                } catch (error) {
                    console.error("DashboardHeader queryFn error:", error);
                    throw error;
                }
            },
        }
    );

    const dashboardContext = useContext(DashboardContext);


    if (!dashboardContext) {
    throw new Error(
        "DashboardContext must be used inside DashboardContext.Provider"
    );
    }

    
    const menus = useMemo(()=> {
        const menuList = [
            {name : "Profile", link : "/dashboard"},
            {name : "Statistics", link : "/statpage"},
            {name : "Contribute", link : "/contribute"},
        ]

        return menuList.map((menu, index)=>{
            return (<DashboardMenu key={index} 
                name={menu.name} 
                href={menu.link} />  )
        })
    }, []);

    if(isLoading || isError){
        return <div>Loading...</div>;
    }


    return(
        <HeaderLayout href="/dashboard">
            <div className="flex flex-row gap-3">
                <nav className={`flex flex-row gap-6 items-center
                    font-medium text-md 
                    not-sm:font-light 
                    not-sm:text-sm
                    tracking-[0.12em] 
                    text-gray-800
                     dark:text-gray-200`}>
                    {menus}
                </nav>

                <SearchForm
                    Customform={`
                        flex flex-row rounded-full shadow-md text-sm pl-4 pr-2 py-1
                        gap-2
                        items-center
                        
                    `}
                    CustomInput={
                        `
                        max-w-10
                        hover:max-w-80
                        focus:max-w-80
                        transition-all duration-300
                        
                        `
                    }
                    CustomButton={`
                        flex items-center justify-center
                        rounded-full bg-github-light size-8
                        z-1
                        hover:ring-2 hover:ring-github-light hover:bg-github-light/60
                        
                    `}
                />

                <HeaderProfileButton data ={data}/>
            </div>
        </HeaderLayout>
    )
}

