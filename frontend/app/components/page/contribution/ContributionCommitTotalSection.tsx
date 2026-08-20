import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { EmptyChart, surfaceClass, type GithubCommitActivity } from "~/routes/contribute";
import { formatDate } from "~/utils/contribute";


export default function ContributionCommitTotalSection({ data, isLoading, isError }: { data: GithubCommitActivity | undefined, isLoading: boolean, isError: boolean }) {

    const totalCommits = data?.total ?? 0;

    const totalActivityOption: EChartsOption = {
            tooltip: {
                trigger: "axis",
                backgroundColor: "rgba(17, 24, 39, 0.94)",
                borderWidth: 0,
                textStyle: { color: "#f9fafb" },
            },
            grid: { top: 28, right: 20, bottom: 24, left: 42, containLabel: true },
            xAxis: {
                type: "category",
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
            series: [{
                name: "Commits",
                type: "bar",
                barMaxWidth: 26,
                data: data?.commitCounts ?? [],
                itemStyle: {
                    color: "#4183c4",
                    borderRadius: [7, 7, 0, 0],
                },
                emphasis: { itemStyle: { color: "#2563eb" } },
            }],
        };



    return(

        <section className={`${surfaceClass} p-7 md:p-8`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Daily volume</p>
                    <h2 className="mt-3 font-semibold tracking-tight">All commits by date</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">A complete daily count combined from every tracked repository.</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400"><strong className="text-gray-950 dark:text-white">{totalCommits}</strong> commits in total</p>
            </div>
            <div className="mt-8">
                {isLoading ? <EmptyChart message="Loading daily commit volume…" /> :
                 isError ? <EmptyChart message="Daily commit volume could not be loaded." /> 
                 : (data?.commitOccuredAt.length ?? 0) === 0 ? 
                 <EmptyChart message="No daily commit records were found for this period." /> 
                 : <ReactECharts option={totalActivityOption} style={{ height: "360px", width: "100%" }} />}
            </div>
        </section>


    )


}