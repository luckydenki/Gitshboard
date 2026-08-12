import { surfaceClass } from "~/routes/contribute";




export default function ContributionInfoSection({ totalCommits, repositories_count, activeDays, isLoading }: { totalCommits: number, repositories_count: number, activeDays: number, isLoading: boolean }) {


    return(
        <section className="grid gap-5 sm:grid-cols-3">
            {[
                { label: "Total commits", value: totalCommits, caption: "Across all repositories" },
                { label: "Repositories", value: repositories_count, caption: "With tracked activity" },
                { label: "Active days", value: activeDays, caption: "Days with at least one commit" },
            ].map((stat) => (
                <article key={stat.label} className={`${surfaceClass} p-6`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                    <p className="mt-5 text-3xl font-semibold tracking-tight">{isLoading ? "–" : stat.value}</p>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{stat.caption}</p>
                </article>
            ))}
        </section>
    )


}