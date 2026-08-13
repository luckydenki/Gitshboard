import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import EmptyState from "./EmptyState";
import React from "react";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

import { useLanguagesQuery } from "~/hooks/pages/stat-hooks";

export default React.memo(TechnologyDistributionArticle);

function LoadingSkelton(){
    return(
        <div>
            <div className="mb-2 flex items-center justify-between">
                    <span className="h-2.5 w-12 bg-gray-300 animate-pulse"> </span>
                    <span className="h-2.5 w-12 bg-gray-300 animate-pulse"> </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            
            </div>
        </div>
    )
}

const chartColorByClass: Record<string, string> = {
    "bg-[#3178c6]": "#3178c6",
    "bg-[#e5c743]": "#e5c743",
    "bg-[#4f8f65]": "#4f8f65",
    "bg-[#8b5cf6]": "#8b5cf6",
    "bg-[#dc6b35]": "#dc6b35",
    "bg-[#7952b3]": "#7952b3",
    "bg-[#e34c26]": "#e34c26",
    "bg-gray-400": "#9ca3af",
    "bg-github-light": "#4183c4",
    "bg-blue-500": "#3b82f6",
    "bg-pink-500": "#ec4899",
};

function getChartColor(color: string) {
    return chartColorByClass[color] ?? "#4183c4";
}

function TechnologyDistributionArticle(){

    const { data : languages, isLoading, isError} = useLanguagesQuery();

    if(isLoading){
        const skeletons : ReturnType<typeof LoadingSkelton>[] = [];
        for(let i=0; i<6; ++i){
            skeletons.push(<LoadingSkelton key={i} />)
        }

        return (
        <article className={`${surfaceClass} p-7 md:p-8`}>
            <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
            <div className="mt-8 space-y-7">
                {skeletons}
            </div>
        </article>
        )
    }

    if(isError){
        console.error("Error occurred while fetching language data for TechnologyDistributionArticle");
        return(
            <article className={`${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
                <div className="mt-8 space-y-7">
                    <EmptyState text="Failed to load language data" />
                </div>
            </article>
        )
    }

    const chartOption: EChartsOption = {
        color: languages!.map((language) => getChartColor(language.color)),
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(17, 24, 39, 0.94)",
            borderWidth: 0,
            textStyle: { color: "#f9fafb" },
            formatter: "{b}: {d}%",
        },
        legend: {
            type: "scroll",
            bottom: 0,
            left: "center",
            textStyle: { color: "#6b7280" },
            formatter: (name) => {
                const language = languages!.find((item) => item.name === name);
                return `${name}  ${language?.percent ?? 0}%`;
            },
        },
        series: [{
            type: "pie",
            radius: ["54%", "78%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: true,
            itemStyle: { borderColor: "#ffffff", borderWidth: 4, borderRadius: 6 },
            label: { show: false },
            emphasis: {
                label: { show: true, fontSize: 15, fontWeight: "bold", formatter: "{b}\n{d}%" },
                itemStyle: { shadowBlur: 12, shadowColor: "rgba(15, 23, 42, 0.18)" },
            },
            data: languages!.map((language) => ({ name: language.name, value: language.size })),
        }],
    };

    return(
    <article className={`${surfaceClass} min-w-0 p-7 md:p-8`}>
        <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
        <div className="mt-8">
            {languages!.length > 0 && <ReactECharts option={chartOption} style={{ height: "340px", width: "100%" }} />}
            {!isLoading && languages!.length === 0 && <EmptyState text="No language data available" />}
        </div>
    </article>
    )
}
