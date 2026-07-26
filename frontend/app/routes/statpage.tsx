import { dench, HTTPCredentials } from "dench-fetch";
import { useMemo, useState } from "react"
import OverviewSection from "~/components/page/stat/OverviewSection";
import PreferredCommitTimeArticle from "~/components/page/stat/PreferredCommitTimeArticle";
import RepositoryActivitySection from "~/components/page/stat/RepositoryActivitySection";
import RepositoryCategoriesArticle from "~/components/page/stat/RepositoryCategoriesArticle";
import StatTitleSection from "~/components/page/stat/StatTitleSection";
import TechnologyDistributionArticle from "~/components/page/stat/TechnologyDistributionArticle";
import WeekActivityArticle from "~/components/page/stat/WeekActivityArticle";
import WorkingStyleArticle from "~/components/page/stat/WorkingStyleArticle";
import { useStatQuery } from "~/hooks/pages/stat-hooks";
import getBackendURL from "~/utils/getBackendURL";
import {
    calculateCommitStats,
    calculateDeveloperProfile,
    calculateLanguageStats,
    calculateProjectCategories,
    calculateProjectHealth,
} from "~/utils/statpage";



export const surfaceClass = "rounded-[1.75rem] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.08)] dark:bg-gray-900";


export default function StatPage(){

    const backendurl = getBackendURL();
    const denchInstance = useState(()=>dench(`${backendurl}/api`, "statPageDench"))[0];
    const commonAPI =  denchInstance.get("").error((err)=>{ console.error("Failed to fetch data:", err); }).credentials(HTTPCredentials.INCLUDE)

    console.log("StatPage");

    const { commitTimeQuery, developStatsQuery, languagesQuery, projectLiveRateQuery, projectTopicsQuery } =   useStatQuery(commonAPI)

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
