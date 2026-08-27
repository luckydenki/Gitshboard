import {  useMemo } from "react";
import { Link } from "react-router";
import HeaderLayout from "~/components/layout/variant/HeaderLayout";

import SearchForm from "~/components/page/home/SearchForm";
import HeaderProfileButton from "~/components/common/HeaderProfileButton";
import useUserHeader from "~/hooks/useUserHeader";




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

    const { data, isLoading, isError} = useUserHeader();

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

