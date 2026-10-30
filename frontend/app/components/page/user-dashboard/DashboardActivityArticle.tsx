import { activitySummaryMock as summary } from "~/mock/home-dashboard/dashboard-activity";
import DashboardWeeklyActivityArticle from "./DashboardWeeklyActivityArticle";
import DashboardRepositoryActivityArticle from "./DashboardRepositoryActivityArticle";

export default function DashboardActivityArticle() {
    return (
        <aside aria-label="사용자 활동 요약" className="flex w-80 shrink-0 flex-col gap-4 not-lg:w-full">
            <article className="bg-panel flex flex-col gap-4 rounded-lg border border-gray-300 p-5">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold">{summary.streakDays}일 연속 활동 중</h3>
                    <span className="rounded-lg bg-gray-100 p-2 text-xs text-gray-500">예시</span>
                </div>
                <div className="flex items-end justify-between gap-3">
                    <p className="text-sm text-gray-500">총 커밋수</p>
                    <strong className="text-2xl">{summary.totalCommits.toLocaleString()}<span className="text-sm font-normal text-gray-500"> 회</span></strong>
                </div>
            </article>
            <DashboardWeeklyActivityArticle />
            <DashboardRepositoryActivityArticle />
        </aside>
    );
}

