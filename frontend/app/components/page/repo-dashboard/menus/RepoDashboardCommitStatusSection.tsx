import {
    barWidthsMock,
    weeklyCommitsMock as weeklyCommits,
    commitRecordsMock as commitRecords,
    codeChangeTrendMock as codeChangeTrend,
    commitsByTimeMock as commitsByTime,
    commitPeriodsMock as commitPeriods,
    summaryMock,
} from "~/mock/repo-dashboard/commit-status";

export default function RepoDashboardCommitStatusSection() {
    const maxWeeklyCommits = Math.max(...weeklyCommits);
    const linePoints = weeklyCommits
        .map((count, index) => `${20 + index * 19.6},${210 - (count / maxWeeklyCommits) * 168}`)
        .join(" ");
    const codeChangeMin = Math.min(...codeChangeTrend);
    const codeChangeMax = Math.max(...codeChangeTrend);
    const codeChangePoints = codeChangeTrend
        .map(
            (value, index) =>
                `${24 + index * 92},${150 - ((value - codeChangeMin) / (codeChangeMax - codeChangeMin)) * 108}`,
        )
        .join(" ");
    const maxTimeCommits = Math.max(...commitsByTime.map(({ count }) => count));

    return (
        <section
            aria-label="커밋 현황"
            className="flex min-w-sm flex-col gap-6">
            <div className="flex items-stretch gap-6 not-xl:flex-col">
                <article className="bg-panel flex min-w-72 flex-2 flex-col justify-between gap-8 divide-y divide-gray-300 rounded-lg border border-gray-300 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500">전체 커밋</p>
                            <strong className="block text-4xl">{summaryMock.totalCommits}</strong>
                        </div>
                        <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                            {summaryMock.activeStreak}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4 pt-5">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-gray-500">이전 전체 기간 대비</p>
                            <p className="text-primary text-lg font-bold">
                                {summaryMock.growthRate}
                            </p>
                        </div>
                        <p className="max-w-sm text-right text-xs leading-5 text-gray-500">
                            {summaryMock.yearlyComparison}
                        </p>
                    </div>
                </article>

                <div className="flex min-w-0 flex-3 flex-wrap gap-4">
                    {commitPeriods.map((item) => (
                        <article
                            key={item.period}
                            className="bg-panel flex min-w-44 flex-1 flex-col gap-3 rounded-lg border border-gray-300 p-6">
                            <p className="text-sm text-gray-500">{item.period}</p>
                            <strong className="block text-3xl">{item.value}</strong>
                            <div className="flex items-center justify-between gap-3 pt-2 text-xs">
                                <span className="text-gray-500">이전 동일 기간</span>
                                <span className="font-semibold">{item.change}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <article className="bg-panel flex flex-col gap-6 rounded-lg border border-gray-300 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold">최근 1년 주별 커밋 추이</h3>
                        <p className="text-sm text-gray-500">
                            각 주에 기본 브랜치로 반영된 커밋 수예요.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                        <strong className="text-xl">{summaryMock.yearlyCommits}</strong>
                        <p className="text-xs text-gray-500">{summaryMock.yearlyPeriod}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <svg
                        role="img"
                        aria-label="최근 52주의 주별 커밋 꺾은선 그래프"
                        viewBox="0 0 1040 250"
                        className="h-64 w-full min-w-190 text-gray-500">
                        {[42, 84, 126, 168, 210].map((y) => (
                            <line
                                key={y}
                                x1="20"
                                y1={y}
                                x2="1020"
                                y2={y}
                                className="stroke-gray-200"
                                strokeWidth="1"
                            />
                        ))}
                        <polyline
                            points={linePoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                        {weeklyCommits.map((count, index) => {
                            if (index % 8 !== 0 && index !== weeklyCommits.length - 1) return null;

                            const x = 20 + index * 19.6;
                            const y = 210 - (count / maxWeeklyCommits) * 168;

                            return (
                                <circle
                                    key={`${index}-${count}`}
                                    cx={x}
                                    cy={y}
                                    r="5"
                                    fill="currentColor"
                                />
                            );
                        })}
                        <text
                            x="20"
                            y="240"
                            className="fill-gray-500 text-xs">
                            {summaryMock.chartStart}
                        </text>
                        <text
                            x="510"
                            y="240"
                            textAnchor="middle"
                            className="fill-gray-500 text-xs">
                            {summaryMock.chartMiddle}
                        </text>
                        <text
                            x="1020"
                            y="240"
                            textAnchor="end"
                            className="fill-gray-500 text-xs">
                            {summaryMock.chartEnd}
                        </text>
                    </svg>
                </div>
            </article>

            <div className="flex items-stretch gap-6 not-xl:flex-col">
                <article className="bg-panel flex min-w-0 flex-1 flex-col gap-5 rounded-lg border border-gray-300 p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold">코드 변화량</h3>
                            <p className="text-sm text-gray-500">{summaryMock.codeChangePeriod}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                            <strong className="text-xl">{summaryMock.netCodeChange}</strong>
                            <p className="text-xs text-gray-500">{summaryMock.codeGrowth}</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <svg
                            role="img"
                            aria-label="최근 6개월 순 코드 변화량 꺾은선 그래프"
                            viewBox="0 0 508 180"
                            className="h-44 w-full min-w-120 text-gray-500">
                            {[42, 96, 150].map((y) => (
                                <line
                                    key={y}
                                    x1="24"
                                    y1={y}
                                    x2="484"
                                    y2={y}
                                    className="stroke-gray-200"
                                    strokeWidth="1"
                                />
                            ))}
                            <polyline
                                points={codeChangePoints}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {codeChangeTrend.map((value, index) => (
                                <circle
                                    key={`${index}-${value}`}
                                    cx={24 + index * 92}
                                    cy={
                                        150 -
                                        ((value - codeChangeMin) /
                                            (codeChangeMax - codeChangeMin)) *
                                            108
                                    }
                                    r="5"
                                    fill="currentColor"
                                />
                            ))}
                        </svg>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                            <span>{summaryMock.addedLines}</span>
                            <span>{summaryMock.removedLines}</span>
                        </div>
                        <div
                            aria-label={summaryMock.codeChangeDistribution}
                            className="flex h-3 overflow-hidden rounded-lg bg-gray-200">
                            <span
                                className="h-full bg-gray-500"
                                style={{ width: barWidthsMock[0] }}
                            />
                            <span
                                className="h-full bg-gray-300"
                                style={{ width: barWidthsMock[1] }}
                            />
                        </div>
                    </div>
                </article>

                <article className="bg-panel flex min-w-0 flex-1 flex-col gap-5 rounded-lg border border-gray-300 p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold">시간대별 커밋 분포</h3>
                            <p className="text-sm text-gray-500">{summaryMock.timePeriod}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                            <strong className="text-xl">{summaryMock.peakTime}</strong>
                            <p className="text-xs text-gray-500">가장 활발한 시간대</p>
                        </div>
                    </div>
                    <div
                        role="img"
                        aria-label="시간대별 커밋 수 막대그래프"
                        className="flex h-52 items-end gap-4 border-b border-gray-300 px-2">
                        {commitsByTime.map(({ time, count }) => (
                            <div
                                key={time}
                                className="flex h-full min-w-8 flex-1 flex-col items-center justify-end gap-2">
                                <span className="text-xs font-medium">{count}</span>
                                <span
                                    aria-hidden="true"
                                    className="w-full max-w-10 rounded-lg bg-gray-400"
                                    style={{
                                        height: `${(count / maxTimeCommits) * 132}px`,
                                    }}
                                />
                                <span className="pb-2 text-xs text-gray-500">{time}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs leading-5 text-gray-500">{summaryMock.timeInsight}</p>
                </article>
            </div>

            <section
                aria-labelledby="commit-record-title"
                className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <h3
                        id="commit-record-title"
                        className="text-lg font-bold">
                        커밋 전적
                    </h3>
                    <span className="text-xs text-gray-500">전체 기간 기준</span>
                </div>
                <dl className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                    {commitRecords.map((record) => (
                        <div
                            key={record.label}
                            className="bg-panel flex flex-col gap-3 rounded-lg border border-gray-300 p-5 md:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
                            <dt className="text-sm text-gray-500">{record.label}</dt>
                            <dd className="text-xl font-bold">{record.value}</dd>
                            <p className="text-xs text-gray-500">{record.detail}</p>
                        </div>
                    ))}
                </dl>
            </section>
        </section>
    );
}
