import { Link, useParams } from "react-router";
import { useUserDashboardOrganizations } from "~/hooks/useUserDashboard";

function OrganizationListSkeleton() {
    return (
        <div aria-busy="true">
            <p role="status" className="sr-only">조직을 불러오는 중입니다.</p>
            <ul
                aria-hidden="true"
                className="grid grid-cols-1 gap-4 motion-safe:animate-pulse md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                    <li key={index} className="bg-panel overflow-hidden rounded-lg">
                        <span className="block aspect-video w-full bg-gray-200 dark:bg-gray-700" />
                        <div className="flex flex-col gap-3 p-4">
                            <span className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                            <span className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                            <span className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
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
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {data.orgs.map((org) => (
                        <li key={org.id}>
                            <Link
                                to={`/org/${encodeURIComponent(org.login)}`}
                                className="bg-panel hover:bg-primary/5 focus-visible:outline-primary flex h-full flex-col overflow-hidden rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
                                <img
                                    src={org.avatarurl}
                                    alt=""
                                    className="aspect-video w-full shrink-0 bg-gray-100 object-contain dark:bg-gray-800"
                                    loading="lazy"
                                />
                                <div className="flex min-w-0 flex-1 flex-col p-4">
                                    <h3 className="text-lg font-semibold">{org.name || org.login}</h3>
                                    {org.name && <p className="text-sm text-gray-500">@{org.login}</p>}
                                    {org.description && (
                                        <p className="mt-2 line-clamp-3 wrap-break-words">{org.description}</p>
                                    )}
                                    <div className="mt-auto flex flex-wrap gap-4 pt-3 text-sm text-gray-500">
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
