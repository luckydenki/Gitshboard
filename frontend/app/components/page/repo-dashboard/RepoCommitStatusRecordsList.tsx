import type { RepoCommitStatusRecordsDto } from "~/types/response/repo-commit-status";
import {
    completeCommitValue,
    formatCommitNumber,
    formatCommitWeek,
} from "~/utils/page/repo-commit-status";
import RepoCommitStatusQueryState from "./RepoCommitStatusQueryState";

type Props = {
    records?: RepoCommitStatusRecordsDto;
    loading: boolean;
    error: boolean;
    onRetry: () => void;
};

/** 최근 완료된 1년의 커밋 전적 카드 목록을 표시합니다. */
export default function RepoCommitStatusRecordsList({ records, loading, error, onRetry }: Props) {
    const total = records && completeCommitValue(records.totalCommits);
    const activeDays = records && completeCommitValue(records.activeDays);
    const activeWeeks = records && completeCommitValue(records.activeWeeks);
    const perWeek = records && completeCommitValue(records.avgCommitsPerActiveWeek);
    const perDay = records && completeCommitValue(records.avgCommitsPerActiveDay);
    const busiest = records && completeCommitValue(records.busiestWeek);
    const last = records && completeCommitValue(records.lastCommit);
    const inactive = records && completeCommitValue(records.longestInactiveDays);
    const streak = records && completeCommitValue(records.longestActiveWeeks);
    const cards =
        records && total !== null && total !== undefined
            ? [
                  {
                      label: "활동한 날짜",
                      value: activeDays ? `${formatCommitNumber(activeDays.count)}일` : "—",
                      detail:
                          activeDays?.percentage !== null && activeDays?.percentage !== undefined
                              ? `조회 기간의 ${formatCommitNumber(activeDays.percentage)}%`
                              : "조회 기간 기준",
                  },
                  {
                      label: "활동한 주",
                      value:
                          activeWeeks !== null && activeWeeks !== undefined
                              ? `${formatCommitNumber(activeWeeks)}주`
                              : "—",
                      detail: "최근 완료된 1년",
                  },
                  {
                      label: "주당 평균 커밋",
                      value:
                          perWeek !== null && perWeek !== undefined
                              ? `${formatCommitNumber(perWeek)}개`
                              : "—",
                      detail: "활동 주 기준",
                  },
                  {
                      label: "활동일당 평균 커밋",
                      value:
                          perDay !== null && perDay !== undefined
                              ? `${formatCommitNumber(perDay)}개`
                              : "—",
                      detail: "커밋이 있던 날 기준",
                  },
                  {
                      label: "가장 활발했던 주",
                      value: busiest ? `${formatCommitNumber(busiest.count)}개` : "기록 없음",
                      detail: busiest
                          ? `${formatCommitWeek(busiest.from, records.timezone)} 시작`
                          : "최근 완료된 1년",
                  },
                  {
                      label: "마지막 커밋",
                      value: last
                          ? new Intl.DateTimeFormat("ko-KR", {
                                timeZone: records.timezone,
                                dateStyle: "medium",
                                timeStyle: "short",
                            }).format(new Date(last.committedAt))
                          : "기록 없음",
                      detail: records.branch ? `${records.branch} 브랜치` : "기본 브랜치",
                  },
                  {
                      label: "최장 무커밋 기간",
                      value: inactive ? `${formatCommitNumber(inactive.days)}일` : "0일",
                      detail: inactive ? `${inactive.from} ~ ${inactive.to}` : "최근 완료된 1년",
                  },
                  {
                      label: "연속 활동 주 기록",
                      value: streak ? `${formatCommitNumber(streak.weeks)}주` : "—",
                      detail: streak?.ongoing ? "현재도 기록 중" : "최근 완료된 1년",
                  },
              ]
            : null;

    return (
        <section
            aria-labelledby="commit-record-title"
            className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <h3
                    id="commit-record-title"
                    className="text-lg font-bold">
                    커밋 전적
                </h3>
                <span className="text-xs text-gray-500">최근 완료된 1년</span>
            </div>
            {loading ? (
                <RepoCommitStatusQueryState state="loading" />
            ) : error || !records ? (
                <RepoCommitStatusQueryState
                    state="error"
                    onRetry={onRetry}
                />
            ) : !cards ? (
                <RepoCommitStatusQueryState
                    state="partial"
                    onRetry={onRetry}
                />
            ) : total === 0 ? (
                <RepoCommitStatusQueryState state="empty" />
            ) : (
                <dl className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                    {cards.map((card) => (
                        <div
                            key={card.label}
                            className="bg-panel flex flex-col gap-3 rounded-lg border border-gray-300 p-5 md:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
                            <dt className="text-sm text-gray-500">{card.label}</dt>
                            <dd className="text-xl font-bold">{card.value}</dd>
                            <p className="text-xs text-gray-500">{card.detail}</p>
                        </div>
                    ))}
                </dl>
            )}
        </section>
    );
}
