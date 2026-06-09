import { useQuery } from "@tanstack/react-query";
import { dench, HTTPCredentials } from "dench-fetch";
import { useState } from "react"
import { mockCommitActivity, mockCommitTimes, mockLanguageStats, mockOverviewStats, mockProjectHealth, mockTopics } from "~/mock/statpage";
import type { CommonResponse } from "~/types/common/common";
import type { DevelopStatsNode, GithubCommitTimeRepositoryNode, GithubLanguageRepositoryNode, GithubProjectTopicsNode, GithubRepoCommonResponse, ProjectLiveRateNode } from "~/types/page/statpage";


const surfaceClass = "rounded-[1.75rem] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.08)] dark:bg-gray-900";

export default function StatPage(){

    const denchInstance = useState(()=>dench("http://localhost:3000/api", "statPageDench"))[0];

    const { data, isLoading } = useQuery({
        queryKey : ["statPageData"],
        queryFn : async()=>{
            const commonAPI = denchInstance.get("")
            .error((err)=>{
                console.error("Failed to fetch data:", err);
            })
            .credentials(HTTPCredentials.INCLUDE)

            type CommonResponseType<T> = CommonResponse<GithubRepoCommonResponse<T>>

            const languagesAPI = commonAPI.copy().api<CommonResponseType<GithubLanguageRepositoryNode>>("repos/languages").toJson();
            const commitTimeAPI = commonAPI.copy().api<CommonResponseType<GithubCommitTimeRepositoryNode>>("repos/commitTime").toJson();
            const projectTopicAPI = commonAPI.copy().api<CommonResponseType<GithubProjectTopicsNode>>("repos/projectTopics").toJson();
            const developStatsAPI = commonAPI.copy().api<CommonResponseType<DevelopStatsNode>>("repos/developStats").toJson();
            const projectLiveRateAPI = commonAPI.copy().api<CommonResponseType<ProjectLiveRateNode>>("repos/projectLiveRate").toJson();

            const res = await Promise.all([
                languagesAPI,
                commitTimeAPI,
                projectTopicAPI,
                developStatsAPI,
                projectLiveRateAPI,
            ])
         
            return [ res[0].data, res[1].data, res[2].data, res[3].data, res[4].data ] as const;
        },
        staleTime : 5 * 60 * 1000,
    })


    return(
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950 dark:text-white">
            <main className="mx-auto flex max-w-360 flex-col gap-8 px-6 py-10 lg:px-8">
                <section className={`${surfaceClass} overflow-hidden p-8 md:p-10`}>
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Account analytics</p>
                            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Development statistics</h1>
                            <p className="mt-5 max-w-xl text-base leading-7 text-gray-500 dark:text-gray-400">
                                Repository activity, technology usage, and project health in one workspace.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 rounded-3xl bg-[#eef4ff] px-5 py-4 shadow-inner dark:bg-gray-800">
                            <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? "animate-pulse bg-amber-400" : "bg-emerald-500"}`} />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Data sources</p>
                                <p className="mt-1 text-sm font-semibold">{isLoading ? "Syncing APIs" : "5 sources ready"}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {mockOverviewStats.map((stat) => (
                        <article key={stat.label} className={`${surfaceClass} p-6`}>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                            <p className="mt-5 truncate text-3xl font-semibold tracking-tight">{stat.value}</p>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{stat.caption}</p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <article className={`${surfaceClass} p-7 md:p-8`}>
                        <SectionHeading eyebrow="Languages" title="Technology distribution" detail="Code volume across repositories" />
                        <div className="mt-8 space-y-6">
                            {mockLanguageStats.map((language) => (
                                <div key={language.name}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-medium">{language.name}</span>
                                        <span className="text-gray-400">{language.percent}%</span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div className={`h-full rounded-full ${language.color}`} style={{ width: `${language.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className={`${surfaceClass} p-7 md:p-8`}>
                        <SectionHeading eyebrow="Commit rhythm" title="Weekly activity" detail="Default branch commit frequency" />
                        <div className="mt-8 flex h-64 items-end gap-3">
                            {mockCommitActivity.map((day) => (
                                <div key={day.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3">
                                    <div className="flex h-full w-full items-end rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <div
                                            className="w-full rounded-xl bg-github-light shadow-[0_8px_20px_rgba(65,131,196,0.22)]"
                                            style={{ height: `${day.value}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-400">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <article className={`${surfaceClass} p-7 md:p-8`}>
                        <SectionHeading eyebrow="Work pattern" title="Preferred commit time" detail="Activity by time of day" />
                        <div className="mt-8 space-y-5">
                            {mockCommitTimes.map((time) => (
                                <div key={time.label} className="grid grid-cols-[90px_1fr_36px] items-center gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{time.label}</span>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div className="h-full rounded-full bg-gray-950 dark:bg-white" style={{ width: `${time.value}%` }} />
                                    </div>
                                    <span className="text-right text-xs font-semibold text-gray-400">{time.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 rounded-3xl bg-[#eef4ff] p-5 dark:bg-gray-800">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Strongest window</p>
                            <p className="mt-2 text-lg font-semibold">Evening focus</p>
                            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Most commits land between 18:00 and 23:00.</p>
                        </div>
                    </article>

                    <article className={`${surfaceClass} p-7 md:p-8`}>
                        <SectionHeading eyebrow="Development profile" title="Working style" detail="Inferred from time, stack, and topics" />
                        <div className="mt-8 flex items-end gap-3">
                            <p className="text-5xl font-semibold tracking-tight">82</p>
                            <p className="pb-1 text-sm text-gray-400">focus score</p>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            {[
                                ["Cadence", "Consistent"],
                                ["Style", "Full-stack"],
                                ["Peak day", "Thursday"],
                                ["Variation", "Balanced"],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-3xl bg-gray-100 p-4 dark:bg-gray-800">
                                    <p className="text-xs uppercase tracking-[0.16em] text-gray-400">{label}</p>
                                    <p className="mt-2 text-sm font-semibold">{value}</p>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className={`${surfaceClass} p-7 md:p-8 lg:col-span-2 xl:col-span-1`}>
                        <SectionHeading eyebrow="Topics" title="Project interests" detail="Frequently used repository topics" />
                        <div className="mt-8 flex flex-wrap gap-3">
                            {mockTopics.map((topic, index) => (
                                <div
                                    key={topic.name}
                                    className={`rounded-full px-4 py-2.5 text-sm font-medium ${
                                        index < 2
                                            ? "bg-gray-950 text-white shadow-lg shadow-gray-950/15 dark:bg-white dark:text-gray-950"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    }`}
                                >
                                    {topic.name} <span className="ml-2 opacity-50">{topic.count}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className={`${surfaceClass} p-7 md:p-8`}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <SectionHeading eyebrow="Project health" title="Repository activity" detail="Recency, archive state, and ownership" />
                        <div className="flex gap-5 text-sm text-gray-500 dark:text-gray-400">
                            <span><strong className="text-gray-950 dark:text-white">70%</strong> active</span>
                            <span><strong className="text-gray-950 dark:text-white">10%</strong> archived</span>
                        </div>
                    </div>
                    <div className="mt-8 grid gap-3">
                        {mockProjectHealth.map((project) => (
                            <div key={project.name} className="grid gap-4 rounded-3xl bg-gray-100 px-5 py-4 sm:grid-cols-[1fr_110px_140px_90px] sm:items-center dark:bg-gray-800">
                                <p className="truncate font-semibold">{project.name}</p>
                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                    project.status === "Active"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                        : "bg-white text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                                }`}>
                                    {project.status}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{project.updated}</p>
                                <p className="text-sm text-gray-400">{project.type}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

function SectionHeading({ eyebrow, title, detail }: { eyebrow: string, title: string, detail: string }){
    return(
        <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{detail}</p>
        </div>
    )
}
