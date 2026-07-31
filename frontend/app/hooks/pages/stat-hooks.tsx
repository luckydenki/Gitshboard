import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
    calculateCommitStats,
    calculateDeveloperProfile,
    calculateLanguageStats,
    calculateProjectCategories,
    calculateProjectHealth,
} from "~/utils/statpage";
import type { CommonResponse } from "~/types/common/common";
import type { DevelopStatsNode, GithubCommitTimeRepositoryNode, GithubLanguageRepositoryNode, GithubProjectTopicsNode, GithubRepoCommonResponse, ProjectLiveRateNode } from "~/types/page/statpage";

type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>;


const languagesQueryFn = async()=>
        {
            const res = await fetch(`/api/repos/languages`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
                }
                return res.json() as Promise<CommonResponseType<GithubLanguageRepositoryNode>>;
            })

           // const res = await commonAPI.copy().api<CommonResponseType<GithubLanguageRepositoryNode>>("repos/languages").toJson();
            return res.data;
        }


const commitTimeQueryFn = async()=>
        {
            const res = await fetch(`/api/repos/commitTime`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
                }
                return res.json() as Promise<CommonResponseType<GithubCommitTimeRepositoryNode>>;
            })

            //const res = await commonAPI.copy().api<CommonResponseType<GithubCommitTimeRepositoryNode>>("repos/commitTime").toJson();
            return res.data;
        }


const projectTopicsQueryFn = async()=>
        {   
            const res = await fetch(`/api/repos/projectTopics`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
                }
                return res.json() as Promise<CommonResponseType<GithubProjectTopicsNode>>;
            })

            //const res = await commonAPI.copy().api<CommonResponseType<GithubProjectTopicsNode>>("repos/projectTopics").toJson();
            return res.data;
        }

const developStatsQueryFn = async()=>
        {
            const res = await fetch(`/api/repos/developStats`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
                }
                return res.json() as Promise<CommonResponseType<DevelopStatsNode>>;
            })

            //const res = await commonAPI.copy().api<CommonResponseType<DevelopStatsNode>>("repos/developStats").toJson();
            return res.data;
        }


const projectLiveRateQueryFn = async()=>
        {
            const res = await fetch(`/api/repos/projectLiveRate`, {
                credentials: 'include',
                }).then(async(res)=>{
                if(!res.ok){
                    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
                }
                return res.json() as Promise<CommonResponseType<ProjectLiveRateNode>>;
            })

            //const res = await commonAPI.copy().api<CommonResponseType<ProjectLiveRateNode>>("repos/projectLiveRate").toJson();
            return res.data;
        }


export function useLanguagesQuery(){
    return useQuery({
        queryKey: ["languagesData"],
        queryFn: () => languagesQueryFn(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useCommitTimeQuery(){
    return useQuery({
        queryKey: ["commitTimeData"],
        queryFn: async () => { return await commitTimeQueryFn() },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}


export function useProjectTopicsQuery(){
    return useQuery({
        queryKey: ["projectTopicsData"],
        queryFn: async () => { return await projectTopicsQueryFn(); },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}


export function useDevelopStatsQuery(){
    return useQuery({
        queryKey: ["developStatsData"], 
        queryFn: async () => { return await developStatsQueryFn(); },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useProjectLiveRateQuery(){
    return useQuery({
        queryKey: ["projectLiveRateData"],
        queryFn: async () => { return await projectLiveRateQueryFn(); },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}   










export function useStatQuery(){

    const languagesQuery = useLanguagesQuery();
    const commitTimeQuery = useCommitTimeQuery();
    const projectTopicsQuery = useProjectTopicsQuery();
    const developStatsQuery = useDevelopStatsQuery();
    const projectLiveRateQuery = useProjectLiveRateQuery();

    return {
        languagesQuery,
        commitTimeQuery,
        projectTopicsQuery,
        developStatsQuery,
        projectLiveRateQuery
    };  

}

export function useAnalyticsData({ data } : { data: readonly any[] }){
        const analytics = useMemo(() => ({
            languages: calculateLanguageStats(data?.[0]),
            commits: calculateCommitStats(data?.[1]),
            categories: calculateProjectCategories(data?.[2]),
            developer: calculateDeveloperProfile(data?.[3]),
            health: calculateProjectHealth(data?.[4]),
        }), [data]);


        return {
            analytics
        } 
}


