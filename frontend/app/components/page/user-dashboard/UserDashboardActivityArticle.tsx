import type { UserCommitActivity } from "~/hooks/useUserDashboard";
import UserDashboardWeeklyActivityArticle from "./UserDashboardWeeklyActivityArticle";
import UserDashboardRepositoryActivityArticle from "./UserDashboardRepositoryActivityArticle";

interface UserDashboardActivityArticleProps {
    streakDays?: number;
    isProfileLoading: boolean;
    isProfileError: boolean;
    weekly?: UserCommitActivity;
    weeklyLoading: boolean;
    weeklyError: boolean;
    yearly?: UserCommitActivity;
    yearlyLoading: boolean;
    yearlyError: boolean;
    weekStart: string;
}

export default function UserDashboardActivityArticle({
    streakDays,
    isProfileLoading,
    isProfileError,
    weekly,
    weeklyLoading,
    weeklyError,
    yearly,
    yearlyLoading,
    yearlyError,
    weekStart,
}: UserDashboardActivityArticleProps) {
    return (
        <aside
            aria-label="사용자 활동 요약"
            className="flex w-80 shrink-0 flex-col gap-4 not-lg:w-full">
            <article className="bg-panel flex flex-col gap-4 rounded-lg border border-gray-300 p-5">
                <div className="flex items-center justify-between gap-2">
                    {isProfileLoading && <p role="status">연속 활동을 불러오는 중입니다.</p>}
                    {isProfileError && <p role="alert">연속 활동을 불러오지 못했습니다.</p>}
                    {streakDays !== undefined && (
                        <h3 className="font-bold">
                            {streakDays > 0
                                ? `${streakDays}일 연속 활동 중`
                                : "최근 연속 활동 없음"}
                        </h3>
                    )}
                </div>
                <div className="flex items-end justify-between gap-3">
                    <p className="text-sm text-gray-500">최근 1년 커밋 기여</p>
                    {yearlyLoading && (
                        <span
                            role="status"
                            className="text-sm">
                            불러오는 중
                        </span>
                    )}
                    {yearlyError && (
                        <span
                            role="alert"
                            className="text-sm">
                            조회 실패
                        </span>
                    )}
                    {yearly && (
                        <strong className="text-2xl">
                            {yearly.total.toLocaleString()}
                            <span className="text-sm font-normal text-gray-500"> 회</span>
                        </strong>
                    )}
                </div>
            </article>
            <UserDashboardWeeklyActivityArticle
                data={weekly}
                isLoading={weeklyLoading}
                isError={weeklyError}
                weekStart={weekStart}
            />
            <UserDashboardRepositoryActivityArticle
                data={weekly}
                isLoading={weeklyLoading}
                isError={weeklyError}
            />
        </aside>
    );
}
