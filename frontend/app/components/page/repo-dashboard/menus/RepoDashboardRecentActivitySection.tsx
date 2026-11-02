import {
    weeklyActivityMock as weeklyActivity,
    activityEventsMock as activityEvents,
    activityTagsMock as activityTags,
    summaryMock,
} from "~/mock/repo-dashboard/recent-activity";
import DashboardRecentActivityList from "~/components/common/DashboardRecentActivityList";

export default function RepoDashboardRecentActivitySection() {
    const maxActivity = Math.max(...weeklyActivity.map(({ count }) => count));
    const linePoints = weeklyActivity
        .map(({ count }, index) => `${24 + index * 76},${150 - (count / maxActivity) * 112}`)
        .join(" ");

    return (
        <section
            aria-labelledby="recent-activity-title"
            className="flex min-w-sm items-start gap-6 not-lg:flex-col">
            <h2
                id="recent-activity-title"
                className="sr-only">
                최근 활동
            </h2>

            <aside className="flex w-80 shrink-0 flex-col gap-4 not-lg:w-full">
                <article className="bg-panel flex flex-col gap-4 rounded-lg border border-gray-300 p-5">
                    <h3 className="font-bold">현재 상태</h3>
                    <div className="flex flex-wrap gap-2">
                        {activityTags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs leading-5 text-gray-500">{summaryMock.statusInsight}</p>
                </article>

                <article className="bg-panel flex flex-col gap-4 rounded-lg border border-gray-300 p-5">
                    <p className="text-xs text-gray-500">활동 리듬</p>
                    <div className="flex items-end justify-between gap-3">
                        <strong className="text-xl">{summaryMock.rhythm}</strong>
                        <span className="text-sm font-semibold text-gray-500">
                            {summaryMock.rhythmBadge}
                        </span>
                    </div>
                    <p className="text-xs leading-5 text-gray-500">{summaryMock.rhythmInsight}</p>
                </article>

                <article className="bg-panel flex flex-col gap-5 rounded-lg border border-gray-300 p-5">
                    <div className="flex items-end justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold">주간 커밋</h3>
                            <p className="text-xs text-gray-500">{summaryMock.weeklyPeriod}</p>
                        </div>
                        <strong className="text-xl">{summaryMock.weeklyCommits}</strong>
                    </div>
                    <div className="overflow-x-auto">
                        <svg
                            role="img"
                            aria-label="월요일부터 일요일까지의 주간 커밋 꺾은선 그래프"
                            viewBox="0 0 504 180"
                            className="h-40 w-full min-w-70 text-gray-500">
                            <line
                                x1="24"
                                y1="150"
                                x2="480"
                                y2="150"
                                className="stroke-gray-300"
                                strokeWidth="1"
                            />
                            <polyline
                                points={linePoints}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            {weeklyActivity.map(({ day, count }, index) => {
                                const x = 24 + index * 76;
                                const y = 150 - (count / maxActivity) * 112;

                                return (
                                    <g key={day}>
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r="5"
                                            fill="currentColor"
                                        />
                                        <text
                                            x={x}
                                            y="173"
                                            textAnchor="middle"
                                            className="fill-gray-500 text-xs">
                                            {day}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <div className="flex flex-col gap-2 border-gray-300 pt-4">
                        <p className="text-xs text-gray-500">이번 주 가장 활발한 날</p>
                        <div className="flex items-end justify-between gap-3">
                            <strong className="text-2xl">{summaryMock.peakDay}</strong>
                            <span className="text-sm font-bold text-gray-500">
                                {summaryMock.peakCount}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">{summaryMock.peakBreakdown}</p>
                    </div>
                </article>
            </aside>

            <section
                aria-labelledby="activity-record-title"
                className="bg-panel min-w-0 flex-1 p-6 not-lg:w-full">
                <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
                    <div className="flex flex-col gap-1">
                        <h3
                            id="activity-record-title"
                            className="text-xl font-bold sm:text-2xl">
                            최근 전적
                        </h3>
                        <p className="text-sm text-gray-500">
                            저장소에서 발생한 주요 활동을 시간순으로 보여줘요.
                        </p>
                    </div>
                    <div className="flex gap-4 text-right text-xs text-gray-500">
                        <span>
                            <strong className="block text-base text-inherit">
                                {summaryMock.commitCount}
                            </strong>
                            Commit
                        </span>
                        <span>
                            <strong className="block text-base text-inherit">
                                {summaryMock.pullRequestCount}
                            </strong>
                            PR
                        </span>
                        <span>
                            <strong className="block text-base text-inherit">
                                {summaryMock.issueCount}
                            </strong>
                            Issue
                        </span>
                    </div>
                </div>

                <DashboardRecentActivityList
                    events={activityEvents.map((event) => ({
                        ...event,
                        id: `${event.type}:${event.reference}`,
                    }))}
                />
            </section>
        </section>
    );
}
