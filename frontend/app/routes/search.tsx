import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router"
import type { CommonErrorResponse, CommonResponse, ErrorStatus, SuccessStatus } from "~/types/common/common";
import getBackendURL from "~/utils/getBackendURL";
import "~/styles/search.css";

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
        <div className="flex flex-col h-full items-center justify-center search-page">

            <header> 
                <h1>Search Results for "{name}"</h1>
            </header>
            <section>
                {data?.items.map((user)=>{
                    return(
                        <article key={user.id} className="flex ">
                            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                            <img src={user.avatar_url} alt={`${user.login}'s avatar`} width={50} height={50}/>
                            <span>{user.login}</span>
                            </a>
                        </article>
                    )
                })}
            </section>

        </div>
    )
}