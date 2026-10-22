const weeklyCommits = [
    42, 38, 51, 46, 62, 70, 58, 64, 73, 68, 81, 77, 69, 75, 84, 91, 88, 79, 95, 102,
    97, 108, 113, 105, 119, 124, 116, 132, 127, 138, 144, 136, 129, 151, 147, 158, 162,
    154, 169, 176, 164, 182, 188, 174, 196, 203, 191, 212, 205, 219, 228, 214,
] as const;

const commitRecords = [
    { label: "활동한 날짜", value: "842일", detail: "전체 기간의 31.8%" },
    { label: "활동한 주", value: "148주", detail: "최근 3년 기준" },
    { label: "주당 평균 커밋", value: "124.5개", detail: "활동 주 기준" },
    { label: "활동일당 평균 커밋", value: "21.9개", detail: "커밋이 있던 날 기준" },
    { label: "가장 활발했던 주", value: "228개", detail: "2026년 41주차" },
    { label: "마지막 커밋", value: "2시간 전", detail: "main 브랜치" },
    { label: "최장 무커밋 기간", value: "11일", detail: "2024.12.22 ~ 2025.01.01" },
    { label: "연속 활동 주 기록", value: "48주", detail: "현재도 기록 중" },
] as const;

const codeChangeTrend = [8_420, 10_180, 9_360, 12_740, 14_220, 16_480] as const;

const commitsByTime = [
    { time: "00시", count: 42 },
    { time: "04시", count: 18 },
    { time: "08시", count: 76 },
    { time: "12시", count: 148 },
    { time: "16시", count: 186 },
    { time: "20시", count: 104 },
] as const;

export default function RepoDashboardCommitStatusSection() {
    const maxWeeklyCommits = Math.max(...weeklyCommits);
    const linePoints = weeklyCommits
        .map(
            (count, index) =>
                `${20 + index * 19.6},${210 - (count / maxWeeklyCommits) * 168}`,
        )
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
                <article className="bg-panel flex min-w-72 flex-[2] flex-col justify-between rounded-lg border-1 border-gray-300 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500">전체 커밋</p>
                            <strong className="mt-2 block text-4xl">18,426</strong>
                        </div>
                        <span className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-semibold">
                            48주 연속 활동 중
                        </span>
                    </div>
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t-1 border-gray-300 pt-5">
                        <div>
                            <p className="text-xs text-gray-500">이전 전체 기간 대비</p>
                            <p className="text-primary mt-1 text-lg font-bold">+12.4%</p>
                        </div>
                        <p className="max-w-sm text-right text-xs leading-5 text-gray-500">
                            최근 1년은 이전 1년보다 386개의 커밋이 더 등록됐어요.
                        </p>
                    </div>
                </article>

                <div className="flex min-w-0 flex-[3] flex-wrap gap-4">
                    {[
                        { period: "최근 7일", value: "85", change: "+9.0%" },
                        { period: "최근 30일", value: "356", change: "+12.7%" },
                        { period: "최근 90일", value: "1,074", change: "+8.4%" },
                    ].map((item) => (
                        <article
                            key={item.period}
                            className="bg-panel min-w-44 flex-1 rounded-lg border-1 border-gray-300 p-6">
                            <p className="text-sm text-gray-500">{item.period}</p>
                            <strong className="mt-3 block text-3xl">{item.value}</strong>
                            <div className="mt-5 flex items-center justify-between gap-3 text-xs">
                                <span className="text-gray-500">이전 동일 기간</span>
                                <span className="text-primary font-semibold">{item.change}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold">최근 1년 주별 커밋 추이</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            각 주에 기본 브랜치로 반영된 커밋 수예요.
                        </p>
                    </div>
                    <div className="text-right">
                        <strong className="text-xl">6,494</strong>
                        <p className="text-xs text-gray-500">52주 합계</p>
                    </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <svg
                        role="img"
                        aria-label="최근 52주의 주별 커밋 꺾은선 그래프"
                        viewBox="0 0 1040 250"
                        className="h-64 min-w-[760px] w-full text-primary">
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
                            className="fill-gray-500 text-[12px]">
                            2025.11
                        </text>
                        <text
                            x="510"
                            y="240"
                            textAnchor="middle"
                            className="fill-gray-500 text-[12px]">
                            2026.05
                        </text>
                        <text
                            x="1020"
                            y="240"
                            textAnchor="end"
                            className="fill-gray-500 text-[12px]">
                            2026.10
                        </text>
                    </svg>
                </div>
            </article>

            <div className="flex items-stretch gap-6 not-xl:flex-col">
                <article className="bg-panel min-w-0 flex-1 rounded-lg border-1 border-gray-300 p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold">코드 변화량</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                최근 6개월 순 코드 변화 추이
                            </p>
                        </div>
                        <div className="text-right">
                            <strong className="text-xl">+126,537줄</strong>
                            <p className="mt-1 text-xs text-primary">최근 증가 속도 +8.7%</p>
                        </div>
                    </div>
                    <div className="mt-5 overflow-x-auto">
                        <svg
                            role="img"
                            aria-label="최근 6개월 순 코드 변화량 꺾은선 그래프"
                            viewBox="0 0 508 180"
                            className="h-44 min-w-[480px] w-full text-primary">
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
                    <div className="mt-5 border-t-1 border-gray-300 pt-4">
                        <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                            <span>코드 추가 412,680줄</span>
                            <span>코드 정리 286,143줄</span>
                        </div>
                        <div
                            aria-label="코드 추가 59%, 코드 정리 41%"
                            className="mt-3 flex h-3 overflow-hidden rounded-lg bg-gray-200">
                            <span className="bg-primary h-full w-[59%]" />
                            <span className="h-full w-[41%] bg-gray-400" />
                        </div>
                    </div>
                </article>

                <article className="bg-panel min-w-0 flex-1 rounded-lg border-1 border-gray-300 p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold">시간대별 커밋 분포</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                최근 90일 커밋 시간을 기준으로 했어요.
                            </p>
                        </div>
                        <div className="text-right">
                            <strong className="text-xl">16시</strong>
                            <p className="mt-1 text-xs text-gray-500">가장 활발한 시간대</p>
                        </div>
                    </div>
                    <div
                        role="img"
                        aria-label="시간대별 커밋 수 막대그래프"
                        className="mt-6 flex h-52 items-end gap-4 border-b-1 border-gray-300 px-2">
                        {commitsByTime.map(({ time, count }) => (
                            <div
                                key={time}
                                className="flex h-full min-w-8 flex-1 flex-col items-center justify-end gap-2">
                                <span className="text-xs font-medium">{count}</span>
                                <span
                                    aria-hidden="true"
                                    className="bg-primary w-full max-w-10 rounded-t-lg"
                                    style={{ height: `${(count / maxTimeCommits) * 132}px` }}
                                />
                                <span className="pb-2 text-xs text-gray-500">{time}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs leading-5 text-gray-500">
                        전체 커밋의 58%가 12시부터 20시 사이에 등록됐어요.
                    </p>
                </article>
            </div>

            <section aria-labelledby="commit-record-title">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h3
                        id="commit-record-title"
                        className="text-lg font-bold">
                        커밋 전적
                    </h3>
                    <span className="text-xs text-gray-500">전체 기간 기준</span>
                </div>
                <dl className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {commitRecords.map((record) => (
                        <div
                            key={record.label}
                            className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                            <dt className="text-sm text-gray-500">{record.label}</dt>
                            <dd className="mt-2 text-xl font-bold">{record.value}</dd>
                            <p className="mt-3 text-xs text-gray-500">{record.detail}</p>
                        </div>
                    ))}
                </dl>
            </section>
        </section>
    );
}
