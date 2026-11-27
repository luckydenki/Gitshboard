import type { DashboardProfile } from "~/hooks/useUserDashboard";
import UserDashboardContributionCalendarArticle from "./UserDashboardContributionCalendarArticle";
import UserDashboardProfileArticle from "../../common/AccountDashboard/AccountDashboardProfileArticle";
import { AccountDashboardProfileSectionLayout } from "~/components/common/AccountDashboard/AccountDashboardLayout";

interface UserDashboardProfileSectionProps {
    profile: DashboardProfile;
}

export function AccountDashboardProfileSkeleton() {
    return (
        <AccountDashboardProfileSectionLayout>
            <div aria-busy="true">
                <p
                    role="status"
                    className="sr-only">
                    프로필을 불러오는 중입니다.
                </p>
                <div
                    aria-hidden="true"
                    className="motion-safe:animate-pulse">
                    <div className="flex flex-col gap-6 pb-8">
                        <div className="flex items-start justify-between gap-6 not-lg:flex-col">
                            <div className="flex items-start gap-5 not-sm:flex-col">
                                <span className="size-24 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                <div className="flex flex-col gap-3">
                                    <span className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                                    <span className="h-9 w-52 rounded bg-gray-200 dark:bg-gray-700" />
                                    <span className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                                    <span className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                                </div>
                            </div>
                            <span className="h-11 w-36 rounded-lg bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-6">
                            {[0, 1].map((item) => (
                                <div
                                    key={item}
                                    className="flex flex-col gap-3">
                                    <span className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                                    <span className="h-6 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex h-75 items-center px-4 sm:px-12">
                        <div className="h-36 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            </div>
        </AccountDashboardProfileSectionLayout>
    );
}

export default function UserDashboardProfileSection({ profile }: UserDashboardProfileSectionProps) {
    const links = [
        profile.websiteUrl,
        ...(profile.socialAccounts.nodes ?? []).map((account) => account?.url),
    ].filter((url): url is string => Boolean(url));

    return (
        <AccountDashboardProfileSectionLayout>
            <UserDashboardProfileArticle
                login={profile.login}
                name={profile.name ?? profile.login}
                bio={profile.bio ?? ""}
                location={profile.location ?? ""}
                link={links}
                following={profile.followingTotal ?? profile.following.totalCount}
                followers={profile.followersTotal ?? profile.followers.totalCount}
                url={profile.url}
                avatarUrl={profile.avatarUrl}
            />
            <UserDashboardContributionCalendarArticle
                weeks={profile.contributionsCollection.contributionCalendar.weeks}
            />
        </AccountDashboardProfileSectionLayout>
    );
}
