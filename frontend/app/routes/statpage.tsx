import { useQuery } from "@tanstack/react-query";
import { dench, HTTPCredentials, type DenchGetBuilder } from "dench-fetch";
import { useMemo, useState } from "react"
import OverviewSection from "~/components/page/stat/OverviewSection";
import PreferredCommitTimeArticle from "~/components/page/stat/PreferredCommitTimeArticle";
import RepositoryActivitySection from "~/components/page/stat/RepositoryActivitySection";
import RepositoryCategoriesArticle from "~/components/page/stat/RepositoryCategoriesArticle";
import StatTitleSection from "~/components/page/stat/StatTitleSection";
import TechnologyDistributionArticle from "~/components/page/stat/TechnologyDistributionArticle";
import WeekActivityArticle from "~/components/page/stat/WeekActivityArticle";
import WorkingStyleArticle from "~/components/page/stat/WorkingStyleArticle";
import type { CommonResponse } from "~/types/common/common";
import type { DevelopStatsNode, GithubCommitTimeRepositoryNode, GithubLanguageRepositoryNode, GithubProjectTopicsNode, GithubRepoCommonResponse, ProjectLiveRateNode } from "~/types/page/statpage";
import getBackendURL from "~/utils/getBackendURL";
import {
    calculateCommitStats,
    calculateDeveloperProfile,
    calculateLanguageStats,
    calculateProjectCategories,
    calculateProjectHealth,
} from "~/utils/statpage";


type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>

export const surfaceClass = "rounded-[1.75rem] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.08)] dark:bg-gray-900";

export const languagesQueryFn = async(commonAPI : DenchGetBuilder<unknown>)=>
        {
            const res = await commonAPI.copy().api<CommonResponseType<GithubLanguageRepositoryNode>>("repos/languages").toJson();
            return res.data;
        }


export const commitTimeQueryFn = async(commonAPI : DenchGetBuilder<unknown>)=>
        {
            const res = await commonAPI.copy().api<CommonResponseType<GithubCommitTimeRepositoryNode>>("repos/commitTime").toJson();
            return res.data;
        }


export const projectTopicsQueryFn = async(commonAPI : DenchGetBuilder<unknown>)=>
        {
            const res = await commonAPI.copy().api<CommonResponseType<GithubProjectTopicsNode>>("repos/projectTopics").toJson();
            return res.data;
        }

export const developStatsQueryFn = async(commonAPI : DenchGetBuilder<unknown>)=>
        {
            const res = await commonAPI.copy().api<CommonResponseType<DevelopStatsNode>>("repos/developStats").toJson();
            return res.data;
        }


export const projectLiveRateQueryFn = async(commonAPI : DenchGetBuilder<unknown>)=>
        {
            const res = await commonAPI.copy().api<CommonResponseType<ProjectLiveRateNode>>("repos/projectLiveRate").toJson();
            return res.data;
        }



export default function StatPage(){

    const backendurl = getBackendURL();
    const denchInstance = useState(()=>dench(`${backendurl}/api`, "statPageDench"))[0];
    const commonAPI =  denchInstance.get("").error((err)=>{ console.error("Failed to fetch data:", err); }).credentials(HTTPCredentials.INCLUDE)

    console.log("StatPage");

    const languagesQuery = useQuery({
        queryKey : ["languagesData"],
        queryFn : () => languagesQueryFn(commonAPI),
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    } 
    )

    const commitTimeQuery = useQuery({
        queryKey : ["commitTimeData"],
        queryFn : async()=>{return await commitTimeQueryFn(commonAPI)},
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    } 
    )

    const projectTopicsQuery = useQuery({
        queryKey : ["projectTopicsData"],
        queryFn : async()=>{ return await projectTopicsQueryFn(commonAPI);},
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    } 
    )
    
    const developStatsQuery = useQuery({
        queryKey : ["developStatsData"],
        queryFn : async()=>{ return await developStatsQueryFn(commonAPI);},
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    } 
    )

    const projectLiveRateQuery = useQuery({
        queryKey : ["projectLiveRateData"],
        queryFn : async()=>{ return await projectLiveRateQueryFn(commonAPI);},
        staleTime : 5 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
    } 
    )

    const isLoading = languagesQuery.isLoading || commitTimeQuery.isLoading || projectTopicsQuery.isLoading || developStatsQuery.isLoading || projectLiveRateQuery.isLoading;
    const isError = languagesQuery.isError || commitTimeQuery.isError || projectTopicsQuery.isError || developStatsQuery.isError || projectLiveRateQuery.isError;
    const data = [languagesQuery.data, commitTimeQuery.data, projectTopicsQuery.data, developStatsQuery.data, projectLiveRateQuery.data] as const;
    

    const analytics = useMemo(() => ({
        languages: calculateLanguageStats(data?.[0]),
        commits: calculateCommitStats(data?.[1]),
        categories: calculateProjectCategories(data?.[2]),
        developer: calculateDeveloperProfile(data?.[3]),
        health: calculateProjectHealth(data?.[4]),
    }), [data]);


    return(
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950 dark:text-white">
            <main className="mx-auto flex max-w-360 flex-col gap-8 px-6 py-10 lg:px-8">
                <StatTitleSection title="Development statistics" isLoading={isLoading} isError={isError} />
                <OverviewSection analytics={analytics} isLoading={isLoading} />

                <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <TechnologyDistributionArticle backendURL={backendurl} />
                    <WeekActivityArticle backendURL={backendurl} />
                </section>

                <section className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <PreferredCommitTimeArticle backendURL={backendurl} />
                    <WorkingStyleArticle backendURL={backendurl} />
                    <RepositoryCategoriesArticle backendURL={backendurl} />     
                </section>

                <RepositoryActivitySection backendURL={backendurl} />
            </main>
        </div>
    )
}
