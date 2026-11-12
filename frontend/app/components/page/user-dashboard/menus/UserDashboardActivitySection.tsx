import { useOutletContext, useParams } from "react-router";
import { useUserRecentActivity } from "~/hooks/useUserDashboard";
import UserDashboardActivityArticle from "../UserDashboardActivityArticle";
import UserDashboardRecentActivitySection from "./UserDashboardRecentActivitySection";
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
            {isLoading && <p role="status">최근 활동을 불러오는 중입니다.</p>}
            {isError && <p role="alert">최근 활동을 불러오지 못했습니다.</p>}
            {data && <UserDashboardRecentActivitySection data={data.items} />}
        </section>
    );
}
