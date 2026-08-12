
export default function ContributionHeader({ startTime, endTime }: { startTime: string, endTime: string }) {

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);


    return(
        <section className="rounded-[2.25rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.10)] dark:bg-gray-900">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Contribution insights</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Commit activity</h1>
                    <p className="mt-5 text-base leading-7 text-gray-500 dark:text-gray-400">
                        Follow how work has moved across your repositories over the last 30 days.
                    </p>
                </div>
                <div className="w-fit rounded-3xl bg-[#eef4ff] px-6 py-5 shadow-inner dark:bg-gray-800">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Reporting period</p>
                    <p className="mt-2 text-lg font-semibold">{startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString()}</p>
                </div>
            </div>
        </section>
    )


}