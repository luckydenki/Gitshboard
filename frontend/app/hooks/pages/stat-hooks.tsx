import { useQuery } from "@tanstack/react-query";
import {
    type CategoryStat,
    type CommitStats,
    type DeveloperProfileStats,
    type LanguageStat,
    type ProjectHealthStats,
} from "~/types/page/statpage";
import type { CommonErrorResponse, CommonResponse } from "~/types/common/common";
import { statQueryFn } from "~/utils/statpage";


const languagesQueryFn = async() => await statQueryFn(`/api/repos/languages`);
const commitTimeQueryFn = async()=> await statQueryFn(`/api/repos/commitTime`);
const projectTopicsQueryFn = async()=> await statQueryFn(`/api/repos/projectTopics`);
const developStatsQueryFn = async()=> await statQueryFn(`/api/repos/developStats`);
const projectLiveRateQueryFn = async()=> await statQueryFn(`/api/repos/projectLiveRate`);


export function useLanguagesQuery(){
    return useQuery<CommonResponse<LanguageStat[]>, CommonErrorResponse>({
        queryKey: ["languagesData"],
        queryFn: async() => await languagesQueryFn(),
        gcTime: 10 * 60 * 1000,
    });
}

export function useCommitTimeQuery(){
    return useQuery<CommonResponse<CommitStats>, CommonErrorResponse>({
        queryKey: ["commitTimeData"],
        queryFn: async () => await commitTimeQueryFn() ,
        gcTime: 10 * 60 * 1000,
    });
}


export function useProjectTopicsQuery(){
    return useQuery<CommonResponse<CategoryStat[]>, CommonErrorResponse>({
        queryKey: ["projectTopicsData"],
        queryFn: async () => await projectTopicsQueryFn(),
        gcTime: 10 * 60 * 1000,
    });
}


export function useDevelopStatsQuery(){
    return useQuery<CommonResponse<DeveloperProfileStats>, CommonErrorResponse  >({
        queryKey: ["developStatsData"], 
        queryFn: async () => await developStatsQueryFn(),
        gcTime: 10 * 60 * 1000,
    });
}

export function useProjectLiveRateQuery(){
    return useQuery<CommonResponse<ProjectHealthStats>, CommonErrorResponse>({
        queryKey: ["projectLiveRateData"],
        queryFn: async () => await projectLiveRateQueryFn(),
        gcTime: 10 * 60 * 1000,
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
