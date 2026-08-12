import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { EmptyChart, surfaceClass, type GithubCommitActivity } from "~/routes/contribute";
import { alignRepositoryActivity, formatDate } from "~/utils/contribute";

const chartPalette = ["#4183c4", "#0f766e", "#8b5cf6", "#e11d48", "#d97706", "#0891b2", "#4f46e5", "#65a30d"];


export default function ContributionCommitActivityByRepo({ data, isLoading, isError }: {   data: GithubCommitActivity | undefined, isLoading: boolean, isError: boolean }) {

        const repositories = data?.results ?? [];
        const repo_length = repositories.length;
        
        const repositoryOption: EChartsOption = {
        color: chartPalette,
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(17, 24, 39, 0.94)",
            borderWidth: 0,
            textStyle: { color: "#f9fafb" },
        },
        legend: {
            type: "scroll",
            top: 0,
            left: 0,
            right: 16,
            textStyle: { color: "#6b7280" },
            pageTextStyle: { color: "#6b7280" },
        },
        grid: { top: 58, right: 20, bottom: 24, left: 42, containLabel: true },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: data?.commitOccuredAt ?? [],
            axisLine: { lineStyle: { color: "#d1d5db" } },
            axisTick: { show: false },
            axisLabel: { color: "#9ca3af", formatter: formatDate, hideOverlap: true },
        },
        yAxis: {
            type: "value",
            minInterval: 1,
            splitLine: { lineStyle: { color: "#eef0eb" } },
            axisLabel: { color: "#9ca3af" },
        },
        series: repositories.map((repository, index) => ({
            name: repository.repositoryName,
            type: "line",
            smooth: true,
            showSymbol: false,
            symbolSize: 7,
            lineStyle: { width: 3 },
            emphasis: { focus: "series" },
            data: alignRepositoryActivity(repository, data?.commitOccuredAt ?? []),
            itemStyle: { color: chartPalette[index % chartPalette.length] },
        })),
    };



    return(
        <section className={`${surfaceClass} p-7 md:p-8`}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Repository breakdown</p>
                <h2 className="mt-3 font-semibold tracking-tight">Commit activity by repository</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Compare each repository&apos;s daily commit trend at a glance.</p>
            </div>
            <div className="mt-8">
                {
                isLoading ? <EmptyChart message="Loading repository activity…" /> : 
                isError ? <EmptyChart message="Repository activity could not be loaded." /> :
                 repo_length === 0 ? <EmptyChart message="No repository commit activity was recorded for this period." /> 
                 : <ReactECharts option={repositoryOption} style={{ height: "380px", width: "100%" }} />}
            </div>
        </section>
    )


}