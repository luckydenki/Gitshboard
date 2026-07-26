import { dench, HTTPCredentials } from "dench-fetch";
import { useState } from "react"
import OverviewSection from "~/components/page/stat/OverviewSection";
import PreferredCommitTimeArticle from "~/components/page/stat/PreferredCommitTimeArticle";
import RepositoryActivitySection from "~/components/page/stat/RepositoryActivitySection";
import RepositoryCategoriesArticle from "~/components/page/stat/RepositoryCategoriesArticle";
import StatTitleSection from "~/components/page/stat/StatTitleSection";
import TechnologyDistributionArticle from "~/components/page/stat/TechnologyDistributionArticle";
import WeekActivityArticle from "~/components/page/stat/WeekActivityArticle";
import WorkingStyleArticle from "~/components/page/stat/WorkingStyleArticle";
import { useAnalyticsData, useStatQuery } from "~/hooks/pages/stat-hooks";
import getBackendURL from "~/utils/getBackendURL";


/**
 * 페이지 컴포넌트 규칙
 * 
 * 1. 페이지 렌더링을 바꾸는 상태 (useState)는 페이지에서 관리함
 * 2. 그 외 useQuery, useMemo, useEffect 등은 hooks에서 관리함
 * 3. 의사 결정 로직, 선언적 로직들을 제외한 보여져야 할 UI는 components에서 관리함
 * ex) { isloading ? <LoadingSkeleton /> : <DataComponent data={data} /> }
 * 이런 isloading, isError 같은 ui 상태를 제어하는 것들은 페이지 내에서 관리하고 따로 컴포넌트화 시키지 말것.
 * 
 * 
 */


export const surfaceClass = "rounded-[1.75rem] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.08)] dark:bg-gray-900";


export default function StatPage(){

    const backendurl = getBackendURL();
    const denchInstance = useState(()=>dench(`${backendurl}/api`, "statPageDench"))[0];
    const commonAPI =  denchInstance.get("").error((err)=>{ console.error("Failed to fetch data:", err); }).credentials(HTTPCredentials.INCLUDE)

    const { commitTimeQuery, developStatsQuery, languagesQuery, projectLiveRateQuery, projectTopicsQuery } =   useStatQuery(commonAPI)

    const isLoading = languagesQuery.isLoading || commitTimeQuery.isLoading || projectTopicsQuery.isLoading || developStatsQuery.isLoading || projectLiveRateQuery.isLoading;
    const isError = languagesQuery.isError || commitTimeQuery.isError || projectTopicsQuery.isError || developStatsQuery.isError || projectLiveRateQuery.isError;
    const data = [languagesQuery.data, commitTimeQuery.data, projectTopicsQuery.data, developStatsQuery.data, projectLiveRateQuery.data] as const;
    

    const { analytics } = useAnalyticsData({ data });

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
