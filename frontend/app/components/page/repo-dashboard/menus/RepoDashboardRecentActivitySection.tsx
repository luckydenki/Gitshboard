import { useParams } from "react-router";
import DashboardRecentActivityList, {
    type DashboardActivityEvent,
} from "~/components/common/DashboardRecentActivityList";
import {
    useRepoDashboardActivity,
    useRepoDashboardActivitySummary,
} from "~/hooks/api/useRepoDashboardActivity";
import type {
    GetRepoActivitySummaryDto,
    RepoActivityEvent,
} from "~/types/response/repo-activity";

const weekdayFormatter = new Intl.DateTimeFormat("ko-KR", { weekday: "short" });

const getRelativeTime = (occurredAt: string) => {
    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - Date.parse(occurredAt)) / 60_000));
    if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;
    if (elapsedMinutes < 24 * 60) return `${Math.floor(elapsedMinutes / 60)}시간 전`;
    return `${Math.floor(elapsedMinutes / (24 * 60))}일 전`;
};

const getEventDescription = (event: RepoActivityEvent) => {
    if (event.type === "commit") {
        if (!event.representativePath) {
            if (event.changedFiles === 0) return "변경 파일이 없어요.";
            if (event.changedFiles !== null) return `${event.changedFiles}개 파일 변경`;
            return "변경 파일 정보를 불러오지 못했어요.";
        }
        const remainingFiles = Math.max(0, (event.changedFiles ?? 1) - 1);
        return remainingFiles ? `${event.representativePath} 외 ${remainingFiles}개 파일 변경` : `${event.representativePath} 변경`;
    }
    if (event.type === "pull-request") return event.action === "merged" ? `${event.baseBranch} 브랜치에 병합됨` : event.draft ? "초안으로 등록됨" : "새 Pull Request가 열림";
    if (event.action === "closed") return "Issue가 종료됨";
    return event.labels.length ? `${event.labels.slice(0, 2).join(", ")} 라벨로 등록됨` : "새 Issue가 등록됨";
};

const toDashboardEvent = (event: RepoActivityEvent): DashboardActivityEvent => ({
    id: event.id,
    type: event.type,
    label: event.type === "commit" ? "Commit" : event.type === "pull-request" ? "Pull Request" : "Issue",
    title: event.title,
    description: getEventDescription(event),
    reference: event.reference,
    time: getRelativeTime(event.occurredAt),
    dateTime: event.occurredAt,
    actor: event.actor,
    url: event.url,
});

const getRhythm = (summary: GetRepoActivitySummaryDto) => {
    if (summary.weekdayShare === null) return "활동 정보 없음";
    if (summary.weekdayShare >= 0.7) return "평일 집중형";
    if (summary.weekdayShare <= 0.3) return "주말 집중형";
    return "고른 활동형";
};

const getRhythmInsight = (summary: GetRepoActivitySummaryDto) => {
    if (summary.peakHours === null || summary.weekdayShare === null) return "최근 활동 기록이 충분하지 않아요.";
    return `전체 활동의 ${Math.round(summary.weekdayShare * 100)}%가 평일에 기록되며 ${summary.peakHours.fromHour}시부터 ${summary.peakHours.toHour}시 사이가 가장 활발해요.`;
};

export default function RepoDashboardRecentActivitySection() {
    const { owner, repo } = useParams();
    const activityQuery = useRepoDashboardActivity(owner, repo);
    const summaryQuery = useRepoDashboardActivitySummary(owner, repo);
    const summary = summaryQuery.data;
    const events = activityQuery.data?.pages.flatMap((page) => page.events) ?? [];
    const maxActivity = Math.max(...(summary?.dailyCommits.map(({ count }) => count) ?? [0]), 1);
    const linePoints = summary?.dailyCommits
        .map(({ count }, index) => `${24 + index * 76},${150 - (count / maxActivity) * 112}`)
        .join(" ");

    return (
        <section aria-labelledby="recent-activity-title" className="flex min-w-sm items-start gap-6 not-lg:flex-col">
            <h2 id="recent-activity-title" className="sr-only">최근 활동</h2>

            <aside className="flex w-80 shrink-0 flex-col gap-4 not-lg:w-full">
                {summaryQuery.isLoading ? (
                    <article className="bg-panel rounded-lg border border-gray-300 p-5 text-sm text-gray-500" role="status">활동 요약을 불러오는 중입니다.</article>
                ) : !summary ? (
                    <article className="bg-panel flex flex-col gap-3 rounded-lg border border-gray-300 p-5 text-sm text-gray-500" role="alert">
                        활동 요약을 불러오지 못했습니다.
                        <button type="button" onClick={() => summaryQuery.refetch()} className="cursor-pointer self-start text-primary font-semibold hover:underline">다시 시도</button>
                    </article>
                ) : (
                    <>
                        <article className="bg-panel flex flex-col gap-4 rounded-lg border border-gray-300 p-5">
                            <h3 className="font-bold">현재 상태</h3>
                            <div className="flex flex-wrap gap-2">
                                {summary.badges.map((badge) => (
                                    <span key={badge} className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                                        {badge === "active-project" ? "활발한 프로젝트" : badge === "steady-commits" ? "꾸준한 커밋" : "빠른 이슈 응답"}
                                    </span>
                                ))}
                                {summary.badges.length === 0 && <span className="text-xs text-gray-500">표시할 활동 배지가 없습니다.</span>}
                            </div>
                            <p className="text-xs leading-5 text-gray-500">{Object.values(summary.counts).every((count) => count > 0) ? "최근 7일 동안 커밋, PR, Issue 활동이 모두 확인됐어요." : "최근 7일 동안 확인된 활동을 표시하고 있어요."}</p>
                        </article>

                        <article className="bg-panel flex flex-col gap-4 rounded-lg border border-gray-300 p-5">
                            <p className="text-xs text-gray-500">활동 리듬</p>
                            <strong className="text-xl">{getRhythm(summary)}</strong>
                            <p className="text-xs leading-5 text-gray-500">{getRhythmInsight(summary)}</p>
                        </article>

                        <article className="bg-panel flex flex-col gap-5 rounded-lg border border-gray-300 p-5">
                            <div className="flex items-end justify-between gap-3">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold">주간 커밋</h3>
                                    <p className="text-xs text-gray-500">최근 7일 기준</p>
                                </div>
                                <strong className="text-xl">{summary.counts.commit}</strong>
                            </div>
                            <div className="overflow-x-auto">
                                <svg role="img" aria-label="월요일부터 일요일까지의 주간 커밋 꺾은선 그래프" viewBox="0 0 504 180" className="h-40 w-full min-w-70 text-gray-500">
                                    <line x1="24" y1="150" x2="480" y2="150" className="stroke-gray-300" strokeWidth="1" />
                                    <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                                    {summary.dailyCommits.map(({ date, count }, index) => {
                                        const x = 24 + index * 76;
                                        const y = 150 - (count / maxActivity) * 112;
                                        return (
                                            <g key={date}>
                                                <circle cx={x} cy={y} r="5" fill="currentColor" />
                                                <text x={x} y="173" textAnchor="middle" className="fill-gray-500 text-xs">
                                                    {weekdayFormatter.format(new Date(`${date}T00:00:00`))}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                            <div className="flex flex-col gap-2 border-gray-300 pt-4">
                                <p className="text-xs text-gray-500">이번 주 가장 활발한 날</p>
                                <div className="flex items-end justify-between gap-3">
                                    <strong className="text-2xl">
                                        {summary.peakDay ? weekdayFormatter.format(new Date(`${summary.peakDay.date}T00:00:00`)) : "-"}
                                    </strong>
                                    <span className="text-sm font-bold text-gray-500">
                                        {summary.peakDay ? `${summary.peakDay.total}회` : "활동 없음"}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {summary.peakDay ? `커밋 ${summary.peakDay.counts.commit} · PR ${summary.peakDay.counts["pull-request"]} · Issue ${summary.peakDay.counts.issue}` : "최근 7일 활동이 없습니다."}
                                </p>
                            </div>
                        </article>
                        {summaryQuery.isError && (
                            <p role="alert" className="text-xs text-gray-500">
                                최신 활동 요약을 갱신하지 못했습니다. {" "}
                                <button type="button" onClick={() => summaryQuery.refetch()} className="cursor-pointer text-primary font-semibold hover:underline">
                                    다시 시도
                                </button>
                            </p>
                        )}
                        {summary.coverage.truncatedSources.length > 0 && (
                            <p className="text-xs leading-5 text-gray-500">
                                일부 활동 기록을 모두 확인하지 못해 집계 범위가 제한될 수 있습니다.
                            </p>
                        )}
                    </>
                )}
            </aside>

            <section aria-labelledby="activity-record-title" className="bg-panel min-w-0 flex-1 p-6 not-lg:w-full">
                <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
                    <div className="flex flex-col gap-1">
                        <h3 id="activity-record-title" className="text-xl font-bold sm:text-2xl">최근 전적</h3>
                        <p className="text-sm text-gray-500">저장소에서 발생한 주요 활동을 시간순으로 보여줘요.</p>
                    </div>
                    {activityQuery.data && (
                        <div className="flex gap-4 text-right text-xs text-gray-500">
                            <span><strong className="block text-base text-inherit">{activityQuery.data.pages[0]?.counts.commit ?? 0}</strong>Commit</span>
                            <span><strong className="block text-base text-inherit">{activityQuery.data.pages[0]?.counts["pull-request"] ?? 0}</strong>PR</span>
                            <span><strong className="block text-base text-inherit">{activityQuery.data.pages[0]?.counts.issue ?? 0}</strong>Issue</span>
                        </div>
                    )}
                </div>

                {activityQuery.isLoading ? <p role="status" className="py-5 text-sm text-gray-500">최근 전적을 불러오는 중입니다.</p>
                    : activityQuery.isError && !activityQuery.data ? <div role="alert" className="flex flex-col gap-3 py-5 text-sm text-gray-500"><p>최근 전적을 불러오지 못했습니다.</p><button type="button" onClick={() => activityQuery.refetch()} className="cursor-pointer self-start text-primary font-semibold hover:underline">다시 시도</button></div>
                        : <><DashboardRecentActivityList events={events.map(toDashboardEvent)} />
                            {activityQuery.data?.pages.some((page) => page.coverage.truncatedSources.length > 0) && <p className="mt-4 text-xs leading-5 text-gray-500">일부 활동 기록을 모두 확인하지 못해 최근 전적 범위가 제한될 수 있습니다.</p>}
                            {activityQuery.isFetchNextPageError && <p role="alert" className="mt-4 text-xs text-gray-500">추가 활동을 불러오지 못했습니다. {" "}<button type="button" onClick={() => activityQuery.fetchNextPage()} className="cursor-pointer text-primary font-semibold hover:underline">다시 시도</button></p>}
                            {activityQuery.hasNextPage && <button type="button" onClick={() => activityQuery.fetchNextPage()} disabled={activityQuery.isFetchingNextPage || activityQuery.isFetching} className="cursor-pointer mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm font-semibold text-gray-500 hover:bg-gray-100 disabled:cursor-default disabled:opacity-60">{activityQuery.isFetchingNextPage ? "더 불러오는 중입니다." : "더 보기"}</button>}
                        </>}
            </section>
        </section>
    );
}
