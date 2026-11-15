import { Link, useParams } from "react-router";
import { useUserDashboardOrganizations } from "~/hooks/useUserDashboard";

function OrganizationListSkeleton() {
    return (
        <div aria-busy="true">
            <p role="status" className="sr-only">조직을 불러오는 중입니다.</p>
            <ul aria-hidden="true" className="flex flex-col gap-4 motion-safe:animate-pulse">
                {Array.from({ length: 3 }, (_, index) => (
                    <li key={index} className="bg-panel flex gap-4 rounded-lg p-5">
                        <span className="h-14 w-14 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700" />
                        <div className="flex flex-1 flex-col gap-3">
                            <span className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                            <span className="h-4 w-64 max-w-full rounded bg-gray-200 dark:bg-gray-700" />
                            <span className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function UserDashboardOrganizationSection() {
    const { user } = useParams();
    const { data, isLoading, isError } = useUserDashboardOrganizations(user);

    return (
        <section className="min-h-[50vh]" aria-labelledby="organizations-heading">
            <div className="bg-panel mb-8 flex items-center justify-between rounded-lg p-4">
                <h2 id="organizations-heading">가입된 조직</h2>
                <span className="text-primary text-2xl font-semibold">
                    {data?.totalOrgCount.toLocaleString() ?? "—"}
                </span>
            </div>

            {isLoading && <OrganizationListSkeleton />}
            {isError && <p role="alert">조직을 불러오지 못했습니다.</p>}
            {data && data.orgs.length === 0 && (
                <div className="bg-panel flex min-h-48 flex-col items-center justify-center gap-2 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold">표시할 조직이 없습니다</h3>
                    <p className="text-sm text-gray-500">공개된 소속 조직이 없거나, 조직 소속 정보가 공개되지 않았습니다.</p>
                </div>
            )}

            {data && data.orgs.length > 0 && (
                <ul className="flex flex-col gap-4">
                    {data.orgs.map((org) => (
                        <li key={org.id}>
                            <Link
                                to={`/org/${encodeURIComponent(org.login)}`}
                                className="bg-panel hover:bg-primary/5 focus-visible:outline-primary flex flex-col gap-4 rounded-lg p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row">
                                <img
                                    src={org.avatarurl}
                                    alt=""
                                    className="h-14 w-14 shrink-0 rounded-lg"
                                    loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-semibold">{org.name || org.login}</h3>
                                    {org.name && <p className="text-sm text-gray-500">@{org.login}</p>}
                                    {org.description && <p className="mt-2 wrap-break-words">{org.description}</p>}
                                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>공개 레포 {org.public_repo.toLocaleString()}개</span>
                                        <span>팔로워 {org.followers.toLocaleString()}명</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
