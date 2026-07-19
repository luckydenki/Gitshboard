import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router"
import type { CommonErrorResponse, CommonResponse, ErrorStatus, SuccessStatus } from "~/types/common/common";
import getBackendURL from "~/utils/getBackendURL";
import "../routes/search.css";

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


export default function Search() {

    const [searchParams, setSearchParams] = useSearchParams();
    const name : string = searchParams.get("search_name") ?? "";

    console.log("Search page loaded with search_name:", name);

    const { data, isLoading, isError} = useQuery(
         {
            queryKey : ["search", name],
            queryFn : async ()=>{
                const backendURL = getBackendURL();
                console.log("backendURL:", backendURL);
                try{
                    const res = await fetch(`${backendURL}/api/search?name=${encodeURIComponent(name)}`);
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
            staleTime : 5* 60 * 1000, // 5분
            gcTime : 10 * 60 * 1000, // 10분
            enabled : !!name, // name이 존재할 때만 쿼리 실행
         }
    );


    console.log("frontend data" ,data);

    if(isLoading){
        return <div>Loading...</div>
    }

    return(
        <div className="flex flex-col h-full w-full lg:px-8 px-6 not-sm:px-4 py-10 gap-4 min-h-screen">
            <header> 
                <h2 className="not-md">Search Results for "{name}"</h2>
            </header>
            <div>
        
            </div>
            <section className="flex flex-col gap-4  min-w-80 py-4">
                {data?.items.map((user)=>{
                    return(
                        <article key={user.id} className="flex flex-col shadow-md">
                            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                                <div className={`
                                        flex items-center gap-6 justify-between px-6 py-4
                                        rounded-2xl
                                        bg-white
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
            </section>

        </div>
    )
}