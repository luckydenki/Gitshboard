import {  surfaceClass } from "~/routes/statpage";
import EmptyState from "./EmptyState";
import SectionHeading from "./SectionHeading";
import { useEffect, useState } from "react";
import React from "react";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useCommitTimeQuery } from "~/hooks/pages/stat-hooks";


export default React.memo(WeekActivityArticle);


function Skeleton(){
    return(
        <div  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3">
            <span className="text-xs font-semibold text-gray-400"></span>
                <div className="flex h-full w-full items-end rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800 animate-pulse">
            </div>
            <span className="text-xs font-medium text-gray-400"></span>
        </div>
    )
}



function WeekActivityArticle(){
    
    const [percents, setPercents] = useState<number[]>([]);
    const  { data : commits, isLoading, isError}  = useCommitTimeQuery();

    useEffect(()=>{
        if(!isLoading && !isError){
            const maps = commits!.weekdays.map((day)=>day.heightPercent ?? 0);
            setPercents(maps);
        }
    }, [isLoading, isError, commits]);


    
    if(isLoading){
        const skeletons : ReturnType<typeof Skeleton>[] = [];
        for(let i=0; i<8; ++i){
            skeletons.push(<Skeleton key={i} />)
        }

        return(
            <article className={`flex flex-col ${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Commit rhythm" title="Weekly activity" detail="Default branch commit frequency" />
                <div className="mt-8 flex h-64 items-end gap-3">
                    {skeletons}
                </div>
            </article>
        )
    }

    if(isError){
        return(
            <article className={`flex flex-col ${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Commit rhythm" title="Weekly activity" detail="Default branch commit frequency" />
                <div className="mt-8 flex h-64 items-center justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load data</p>
                </div>
            </article>
        )
    }

    const chartOption: EChartsOption = {
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(17, 24, 39, 0.94)",
            borderWidth: 0,
            textStyle: { color: "#f9fafb" },
            formatter: (params) => {
                const dataIndex = Array.isArray(params) ? params[0]?.dataIndex : 0;
                const day = commits!.weekdays[dataIndex ?? 0];
                return `${day.label}<br/>Commits: <strong>${day.count}</strong>`;
            },
        },
        grid: { top: 12, right: 4, bottom: 8, left: 4, containLabel: true },
        xAxis: {
            type: "category",
            data: commits!.weekdays.map((day) => day.label),
            axisTick: { show: false },
            axisLine: { lineStyle: { color: "#e5e7eb" } },
            axisLabel: { color: "#9ca3af", fontWeight: 500 },
        },
        yAxis: {
            type: "value",
            max: 100,
            show: false,
        },
        series: [{
            type: "bar",
            data: percents,
            barMaxWidth: 42,
            itemStyle: {
                color: "#4183c4",
                borderRadius: [10, 10, 3, 3],
                shadowBlur: 14,
                shadowColor: "rgba(65, 131, 196, 0.22)",
            },
            emphasis: { itemStyle: { color: "#2563eb" } },
        }],
    };

    return(
        <article className={`flex flex-col ${surfaceClass} min-w-0 p-7 md:p-8`}>
            <SectionHeading eyebrow="Commit rhythm" title="Weekly activity" detail="Default branch commit frequency" />
            <div className="flex items-center h-full">
            <ReactECharts option={chartOption} style={{ height: "256px", width: "100%" }} 
            />
            </div>
            {!isLoading && commits!.total === 0 && <EmptyState text="No commit history available" />}
        </article>
    )
}
