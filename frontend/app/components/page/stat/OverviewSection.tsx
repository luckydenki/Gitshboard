import { useStatQuery } from "~/hooks/pages/stat-hooks";
import { surfaceClass } from "~/routes/statpage";


export default function OverviewSection(){

    const { languagesQuery, commitTimeQuery, projectLiveRateQuery, isLoading, isError } = useStatQuery();

    if(isLoading){
        return(
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <article className={`${surfaceClass} p-6`}>
                    <p className="h-3 w-24 rounded bg-gray-400 animate-pulse"></p>
                    <p className="mt-5 h-8 w-16 rounded bg-gray-400 animate-pulse"></p>
                    <p className="mt-3 h-3 w-32 rounded bg-gray-400 animate-pulse"></p>
                </article>
                <article className={`${surfaceClass} p-6`}>
                    <p className="h-3 w-24 rounded bg-gray-400 animate-pulse"></p>
                    <p className="mt-5 h-8 w-16 rounded bg-gray-400 animate-pulse"></p>
                    <p className="mt-3 h-3 w-32 rounded bg-gray-400 animate-pulse"></p>
                </article>
                <article className={`${surfaceClass} p-6`}>     
                <p className="h-3 w-24 rounded bg-gray-400 animate-pulse"></p>
                <p className="mt-5 h-8 w-16 rounded bg-gray-400 animate-pulse"></p>
                <p className="mt-3 h-3 w-32 rounded bg-gray-400 animate-pulse"></p>
                </article>
                <article className={`${surfaceClass} p-6`}>     
                <p className="h-3 w-24 rounded bg-gray-400 animate-pulse"></p>
                <p className="mt-5 h-8 w-16 rounded bg-gray-400 animate-pulse"></p>
                <p className="mt-3 h-3 w-32 rounded bg-gray-400 animate-pulse"></p>
                </article>
            </section>
        )
    }

    if(isError){
        console.error("Error occurred while fetching data for OverviewSection");
        return(
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <article className={`${surfaceClass} p-6`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Analyzed repos</p>
                    <p className="mt-5 truncate text-3xl font-semibold tracking-tight">-</p>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Failed to load data</p>
                </article>
                <article className={`${surfaceClass} p-6`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Recent commits</p>
                    <p className="mt-5 truncate text-3xl font-semibold tracking-tight">-</p>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Failed to load data</p>
                </article>
                <article className={`${surfaceClass} p-6`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Active projects</p>
                    <p className="mt-5 truncate text-3xl font-semibold tracking-tight">-</p>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Failed to load data</p>
                </article>
                <article className={`${surfaceClass} p-6`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Primary stack</p>
                    <p className="mt-5 truncate text-3xl font-semibold tracking-tight">-</p>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Failed to load data</p>
                </article>
            </section>
        )
    }



    const languages = languagesQuery.data!;
    const commits = commitTimeQuery.data!;
    const health = projectLiveRateQuery.data!;
    
    
    const overviewStats = [
        { label: "Analyzed repos", value: health.total, caption: `${health.forks} forks included` },
        { label: "Recent commits", value: commits.total, caption: "Fetched default branch history" },
        { label: "Active projects", value: health.active, caption: "Pushed within 30 days" },
        { label: "Primary stack", value: languages[0]?.name ?? "-", caption: "By total code size" },
    ];

        return(
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {overviewStats.map((stat) => (
                        <article key={stat.label} className={`${surfaceClass} p-6`}>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                            <p className="mt-5 truncate text-3xl font-semibold tracking-tight">{isLoading ? "-" : stat.value}</p>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{stat.caption}</p>
                        </article>
                    ))}
                </section>
        )

}