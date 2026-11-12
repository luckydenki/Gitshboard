import { activitySummaryMock as summary } from "~/mock/home-dashboard/dashboard-activity";
import UserDashboardWeeklyActivityArticle from "./UserDashboardWeeklyActivityArticle";
import UserDashboardRepositoryActivityArticle from "./UserDashboardRepositoryActivityArticle";

interface UserDashboardActivityArticleProps {
    streakDays?: number;
    isProfileLoading: boolean;
    isProfileError: boolean;
}

export default function UserDashboardActivityArticle({
    streakDays,
    isProfileLoading,
    isProfileError,
}: UserDashboardActivityArticleProps) {
    return (
        <aside aria-label="사용자 활동 요약" className="flex w-80 shrink-0 flex-col gap-4 not-lg:w-full">
            <article className="bg-panel flex flex-col gap-4 rounded-lg border border-gray-300 p-5">
                <div className="flex items-center justify-between gap-2">
                    {isProfileLoading && <p role="status">연속 활동을 불러오는 중입니다.</p>}
                    {isProfileError && <p role="alert">연속 활동을 불러오지 못했습니다.</p>}
                    {streakDays !== undefined && (
                        <h3 className="font-bold">
                            {streakDays > 0 ? `${streakDays}일 연속 활동 중` : "최근 연속 활동 없음"}
                        </h3>
                    )}
                </div>
                <div className="flex items-end justify-between gap-3">
                    <p className="text-sm text-gray-500">총 커밋수 <span>(예시)</span></p>
                    <strong className="text-2xl">{summary.totalCommits.toLocaleString()}<span className="text-sm font-normal text-gray-500"> 회</span></strong>
                </div>
            </article>
            <UserDashboardWeeklyActivityArticle />
            <UserDashboardRepositoryActivityArticle />
        </aside>
    );
}

