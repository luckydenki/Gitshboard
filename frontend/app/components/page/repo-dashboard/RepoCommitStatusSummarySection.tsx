import type { RepoCommitStatusOverviewDto } from "~/types/response/repo-commit-status";
import {
    completeCommitValue,
    formatCommitChange,
    formatCommitNumber,
} from "~/utils/page/repo-commit-status";
type Props = { overview: RepoCommitStatusOverviewDto };
export default function RepoCommitStatusSummarySection({ overview }: Props) {
    const yearly = completeCommitValue(overview.yearly);
    const periods = completeCommitValue(overview.periods);
    const total = yearly?.count ?? null;
    return (
        <div className="flex items-stretch gap-6 not-xl:flex-col">
            <article className="bg-panel flex min-w-0 flex-2 flex-col justify-between gap-8 divide-y divide-gray-300 rounded-lg p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-500">최근 1년 커밋</p>
                        <strong className="block text-4xl">
                            {total === null ? "—" : formatCommitNumber(total)}
                        </strong>
                    </div>
                    <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                        {overview.branch ?? "기본 브랜치"}
                    </span>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4 pt-5">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500">이전 동일 기간 대비</p>
                        <p className="text-primary text-lg font-bold">
                            {yearly ? formatCommitChange(yearly.changePercent) : "—"}
                        </p>
                    </div>
                    <p className="max-w-sm text-right text-xs leading-5 text-gray-500">
                        {yearly
                            ? `${formatCommitNumber(yearly.previousCount)}개에서 ${formatCommitNumber(yearly.count)}개로 변화했어요.`
                            : ""}
                    </p>
                </div>
            </article>
            <div className="flex min-w-0 flex-3 flex-wrap gap-4">
                {periods?.map(({ days, count, changePercent }) => (
                    <article
                        key={days}
                        className="bg-panel flex min-w-44 flex-1 flex-col gap-3 rounded-lg p-4">
                        <p className="text-sm text-gray-500">최근 완료된 {days}일</p>
                        <strong className="block text-3xl">{formatCommitNumber(count)}</strong>
                        <div className="flex items-center justify-between gap-3 pt-2 text-xs">
                            <span className="text-gray-500">이전 동일 기간</span>
                            <span className="font-semibold">
                                {formatCommitChange(changePercent)}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
