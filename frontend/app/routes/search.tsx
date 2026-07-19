import { QueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";   
import { useSearchParams } from "react-router"
import getBackendURL from "~/utils/getBackendURL";




export default function Search() {

    const [searchParams, setSearchParams] = useSearchParams();
    const searchName : string = searchParams.get("search_name") ?? "";

    const [queryClient] = useState(()=>new QueryClient()); //이렇게 하면 컴포넌트가 처음 렌더링 될 때 한 번만 생성되고 이후에는 같은 인스턴스를 사용합니다.


    console.log("Search page loaded with search_name:", searchName);

    const { data, isLoading, isError} = useQuery(
         {
            queryKey : ["search", searchName],
            queryFn : async ()=>{
                const backendURL = getBackendURL();
                const res = await fetch(`${backendURL}/search?search_name=${encodeURIComponent(searchName)}`);
                return res.json();
            },
            staleTime : 5* 60 * 1000, // 5분
            gcTime : 10 * 60 * 1000, // 10분
            enabled : !!searchName, // searchName이 존재할 때만 쿼리 실행
         }
    );



    return(
        <>



        </>
    )
}