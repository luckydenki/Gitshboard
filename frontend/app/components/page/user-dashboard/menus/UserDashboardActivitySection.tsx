import { useOutletContext, useParams } from "react-router";
import { useUserRecentActivity } from "~/hooks/useUserDashboard";
import UserDashboardActivityArticle from "../UserDashboardActivityArticle";
import UserDashboardRecentActivitySection from "./UserDashboardRecentActivitySection";

const UserDashboardRecentActivitySkeleton = () => (
    <section
        aria-label="최근 활동 내역"
        aria-busy="true"
        className="bg-panel min-w-0 flex-1 p-6 not-lg:w-full">
        <p role="status" className="sr-only">최근 활동을 불러오는 중입니다.</p>
        <div aria-hidden="true" className="motion-safe:animate-pulse">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold sm:text-2xl">최근 활동 내역</h3>
                    <p className="text-sm text-gray-500">
                        최근 활동 최대 10건을 보여주며, 분류는 이 활동 내에서 적용됩니다.
                    </p>
                </div>
                <div className="h-10 w-28 rounded-lg bg-gray-200" />
            </div>
            <ol className="flex flex-col divide-y divide-gray-300">
                {Array.from({ length: 10 }, (_, index) => (
                    <li key={index} className="flex gap-4 py-5">
                        <span className="size-10 shrink-0 rounded-lg bg-gray-200" />
                        <div className="flex min-w-0 flex-1 flex-col gap-4">
                            <div className="flex justify-between gap-2">
                                <span className="h-4 w-24 rounded-lg bg-gray-200" />
                                <span className="h-4 w-28 rounded-lg bg-gray-200" />
                            </div>
                            <span className="h-5 w-3/4 rounded-lg bg-gray-200" />
                            <span className="h-6 w-1/2 rounded-lg bg-gray-200" />
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

export default function UserDashboardActivitySection() {
    const { user } = useParams();
    const { streakDays, isProfileLoading, isProfileError } = useOutletContext<{
        streakDays?: number;
        isProfileLoading: boolean;
        isProfileError: boolean;
    }>();
    const { data, isLoading, isError } = useUserRecentActivity(user);

    return (
        <section className="flex min-w-sm items-start gap-6 not-lg:flex-col">
            <UserDashboardActivityArticle
                streakDays={streakDays}
                isProfileLoading={isProfileLoading}
                isProfileError={isProfileError}
            />
            {isLoading && <UserDashboardRecentActivitySkeleton />}
            {isError && <p role="alert">최근 활동을 불러오지 못했습니다.</p>}
            {data && <UserDashboardRecentActivitySection data={data.items} />}
        </section>
    );
}
