import { useQuery } from "@tanstack/react-query";
import {
    type CategoryStat,
    type CommitStats,
    type DeveloperProfileStats,
    type LanguageStat,
    type ProjectHealthStats,
} from "~/types/page/statpage";
import type { CommonResponse } from "~/types/common/common";
import { commonRetry } from "~/utils/tanstackUtil";


const languagesQueryFn = async()=>
        {
            try{
            const res = await fetch(`/api/repos/languages`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw res.json();
                }
                return res.json() as Promise<CommonResponse<LanguageStat[]>>;
            });
            return res.data;
            } catch (error) {
                console.error("languagesQueryFn error:", error);
                throw error;
            }
        }


const commitTimeQueryFn = async()=>
        {
            const res = await fetch(`/api/repos/commitTime`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw res.json();
                }
                return res.json() as Promise<CommonResponse<CommitStats>>;
            })


            return res.data;
        }


const projectTopicsQueryFn = async()=>
        {   
            const res = await fetch(`/api/repos/projectTopics`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw res.json();
                }
                return res.json() as Promise<CommonResponse<CategoryStat[]>>;
            })
            return res.data;
        }

const developStatsQueryFn = async()=>
        {
            const res = await fetch(`/api/repos/developStats`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw res.json();
                }
                return res.json() as Promise<CommonResponse<DeveloperProfileStats>>;
            })

            return res.data;
        }


const projectLiveRateQueryFn = async()=>
        {
            const res = await fetch(`/api/repos/projectLiveRate`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw res.json();
                }
                return res.json() as Promise<CommonResponse<ProjectHealthStats>>;
            })

            return res.data;
        }


export function useLanguagesQuery(){
    return useQuery({
        queryKey: ["languagesData"],
        queryFn: async() => await languagesQueryFn(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry : commonRetry,
    });
}

export function useCommitTimeQuery(){
    return useQuery({
        queryKey: ["commitTimeData"],
        queryFn: async () => await commitTimeQueryFn() ,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry : commonRetry,
    });
}


export function useProjectTopicsQuery(){
    return useQuery({
        queryKey: ["projectTopicsData"],
        queryFn: async () => await projectTopicsQueryFn(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry : commonRetry,
    });
}


export function useDevelopStatsQuery(){
    return useQuery({
        queryKey: ["developStatsData"], 
        queryFn: async () => await developStatsQueryFn(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry : commonRetry,
    });
}

export function useProjectLiveRateQuery(){
    return useQuery({
        queryKey: ["projectLiveRateData"],
        queryFn: async () => await projectLiveRateQueryFn(),

        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry : commonRetry,
    });
}   






export function useStatQuery(){

    const languagesQuery = useLanguagesQuery();
    const commitTimeQuery = useCommitTimeQuery();
    const projectTopicsQuery = useProjectTopicsQuery();
    const developStatsQuery = useDevelopStatsQuery();
    const projectLiveRateQuery = useProjectLiveRateQuery();



    const isLoading = languagesQuery.isLoading || commitTimeQuery.isLoading || projectTopicsQuery.isLoading || developStatsQuery.isLoading || projectLiveRateQuery.isLoading;
    const isError = languagesQuery.isError || commitTimeQuery.isError || projectTopicsQuery.isError || developStatsQuery.isError || projectLiveRateQuery.isError;





    return {
        languagesQuery,
        commitTimeQuery,
        projectTopicsQuery,
        developStatsQuery,
        projectLiveRateQuery,
        isLoading,
        isError,

    };  

}
