import { useQuery } from "@tanstack/react-query";
import { Log } from "~/utils/log_system/log";
import { useMemo, type JSX } from "react";
import type { CommonResponse, CommonErrorResponse } from "~/types/common/common";
import type { GithubUserSearchResponse } from "~/types/common/search";
import { useNavigate } from "react-router";




export function useSearchQuery({ name, page, per_page } : { name: string; page: number; per_page: { current: number } }){

    const { data, isLoading, isError } = useQuery(
        {
            queryKey: ["search", name, page],
            queryFn: async () => {
                try {
                    const urlParams = new URLSearchParams({
                        name: name,
                        page: page.toString(),
                        per_page: per_page.current.toString(),
                    });

                    Log("params", urlParams.toString());
                    
                    const res = await fetch(`/api/search?${urlParams.toString()}`, {
                        credentials: "include"
                    });

                    if (res.ok) {
                        const data: CommonResponse<GithubUserSearchResponse> = await res.json();
                        return data.data;
                    }
                    else {
                        const errorData: CommonErrorResponse = await res.json();
                        throw errorData;
                    }
                } catch (error) {
                    throw error;
                }
            },
            staleTime: 1 * 20 * 1000,   //  20초
            gcTime : 1 * 60 * 1000,
            enabled: !!name, // name이 존재할 때만 쿼리 실행
        }
    );

    return { data, isLoading, isError };
}



export function useFilteringItems({ category, data, isLoading }: { category: string; data: GithubUserSearchResponse | undefined; isLoading: boolean }){
    const filter_items = useMemo(()=>{
            if(isLoading || data === undefined) return [];        
            if(category === "all") return data.items;
            const items = data.items;

            const filter_items = items.filter((e)=>{
                return e.type === category;
            })
            return filter_items;      

        }, [category, isLoading, data])


    return { filter_items };
}






interface useSearchPaginationProps {
    data: GithubUserSearchResponse | undefined;
    page: string;
    per_page: { current: number };
    name: string;
    PageButton: (props: { key: number; pageNumber: number; isActive: boolean; onClick: () => void }) => JSX.Element;
}

export function useSearchPagination({data, page, per_page, name, PageButton} : useSearchPaginationProps){

    const navigate = useNavigate();

    const PaginationButton = useMemo(()=>{

        const totalCount = data?.total_count ?? 0;
        const currentpage = Number(page);
        const perpage = per_page.current;
        const pageCount = Math.ceil(totalCount / perpage);

        const cluster = Math.floor((currentpage-1) /perpage);
        Log("cluster ",cluster, "current page", currentpage);
        const buttons: Array<JSX.Element> = [];


        for(let i = cluster * 10 + 1; i <= Math.min(pageCount,cluster * 10 + 10); i++){

            const isActive = Number(page) == i ?  true : false;

            buttons.push(<PageButton key={i} pageNumber={i} isActive={isActive} onClick={()=>{

                const searchParams = new URLSearchParams({
                    name : name,
                    page : i.toString(),
                })

                navigate(`/search?${searchParams.toString()}`);;
            }} />);
        }

        return buttons;
    },[data?.total_count]);

    return { PaginationButton };
}