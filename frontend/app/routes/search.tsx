import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router"
import type { CommonErrorResponse, CommonResponse, ErrorStatus, SuccessStatus } from "~/types/common/common";
import getBackendURL from "~/utils/getBackendURL";
import "../routes/search.css";
import { useMemo, useRef, useState, type JSX } from "react";

interface GithubUserSearchResponse{
    total_count: number
    incomplete_results: boolean,
    items: Array<{
        login: string,
        id: number,
        avatar_url: string,
        html_url: string,
        type: string
    }>
}


function PageButton({pageNumber, isActive, onClick} : {pageNumber: number, isActive: boolean, onClick : ()=>void}){

    return(
        <button className={`w-12 h-12
            ${isActive ? "bg-gray-300" : "bg-white"}
            text-center
            hover:bg-gray-400
            not-sm:text-xs not-sm:w-8 not-sm:h-8
            `}
            onClick={onClick}
            >
            {pageNumber}
        </button>
    )
}



export default function Search() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const per_page = useRef(10);
        
    const name : string = searchParams.get("name") ?? "";
    const page : string = searchParams.get("page") ?? "";

    console.log("Search page loaded with search_name:", name, page);

    const { data, isLoading, isError} = useQuery(
         {
            queryKey : ["search", name, page],
            queryFn : async ()=>{
                const backendURL = getBackendURL();
                console.log("backendURL:", backendURL);
                try{
                    const urlParams = new URLSearchParams({
                        name : name,
                        page : page,
                        per_page : per_page.current.toString()
                    });

                    console.log("params" , urlParams.toString());

                    const res = await fetch(`${backendURL}/api/search?${urlParams.toString()}`);
                    if(res.ok){
                        const data : CommonResponse<GithubUserSearchResponse> = await res.json();
                        return data.data;
                    }
                    else{
                        const errorData : CommonErrorResponse = await res.json();
                        throw new Error(`Error ${errorData.status}: ${errorData.title} - ${errorData.detail}`);
                    }
                }catch(error){
                    console.error("Failed to fetch search results:", error);
                }
            },
            staleTime :1 * 20 * 1000,
            enabled : !!name, // name이 존재할 때만 쿼리 실행
         }
    );


    const PaginationButton = useMemo(()=>{
        const totalCount = data?.total_count ?? 0;
        const currentpage = Number(page);
        const perpage = per_page.current;
        const pageCount = Math.ceil(totalCount / perpage);

        const cluster = (currentpage-1) /perpage;

        const buttons: Array<JSX.Element> = [];




        for(let i = cluster * 10 + 1; i <= Math.min(pageCount,cluster * 10 + 10); i++){
            buttons.push(<PageButton key={i} pageNumber={i} isActive={false} onClick={()=>{

                const searchParams = new URLSearchParams({
                    name : name,
                    page : i.toString(),
                })

                navigate(`/search?${searchParams.toString()}`);
                //console.log("page : ", i);
            }} />);
        }
        return buttons;
    },[data?.total_count]);


    console.log("frontend data" ,data);

    if(isLoading){
        return <div>Loading...</div>
    }



    return(
        <div className="flex flex-col h-full lg:px-8 px-6 not-sm:px-4 py-6 gap-4 min-h-screen">
            <section className="flex flex-col gap-4 max-w-7xl w-full self-center py-4">
                <header> 
                    <h2 className="not-md text-gray-950">Search Results for "{name}"</h2>
                </header>

                <div>
                    <select>
                         <option value="user">
                            user
                        </option>
                        <option value="repository">
                            repository
                        </option>
                    </select>
                </div>

                {data?.items.map((user)=>{
                    return(
                        <article key={user.id} className="flex flex-col">
                            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                                <div className={`
                                        flex items-center gap-6 justify-between px-6 py-4
                                        rounded-[1.75rem]
                                        bg-white  shadow-md
                                        hover:bg-gray-100 dark:hover:bg-gray-800
                                    `}>
                                    <img src={user.avatar_url} alt={`${user.login}'s avatar`}
                                     width={50} height={50}
                                     className="rounded-full border-2 border-gray-400"
                                     />
                                     <div className="flex flex-col gap-1 items-end">
                                        <span className="text-xl not-sm:text-md">{user.login}</span>
                                        <span className={`px-2
                                            text-sm text-center
                                            not-sm:text-xs
                                            rounded-full
                                            bg-gray-300`}>{user.type}</span>
                                    </div>
                                </div>
                            </a>
                        </article>
                    )
                })}
                <footer className="flex self-center">
                    <button className={`w-12 
                        text-center
                        hover:bg-gray-400
                        not-sm:text-xs not-sm:w-8 not-sm:h-8
                        `}
                        onClick={()=>{
                            navigate("/")
                            console.log("뒤로가기")
                        }}
                        >
                        {"<"}
                    </button>
                    {PaginationButton}
                     <button className={`w-12
                        text-center
                        hover:bg-gray-400
                        not-sm:text-xs not-sm:w-8 not-sm:h-8
                        `}
                        onClick={()=>{
                            const searchParams = new URLSearchParams({
                                name : name,
                                page : page.toString(),
                            })
                            console.log("앞으로가기")
                        }}
                        >
                        {">"}
                    </button>
                </footer>
            </section>

        </div>
    )
}