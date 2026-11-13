import { BiStar } from "react-icons/bi";
import { Link, useParams } from "react-router";
import { handleOAuthLogin } from "~/components/common/LoginButton";
import useGithubScopes from "~/hooks/useGithubScopes";
import { useUserDashboardRepositories } from "~/hooks/useUserDashboard";

export const UserDashboardRepositoryStatsItem = ({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) => {
    return (
        <div className="bg-panel flex items-center justify-between rounded-lg p-4">
            <div>{label}</div>
            <div className="text-primary text-2xl font-semibold"> {value ?? "—"}</div>
        </div>
    );
};

export const UserDashboardRepositoryStatsSection = ({
    totalCount,
    totalStars,
    totalForks,
}: {
    totalCount: number | string | undefined;
    totalStars: number | string | undefined;
    totalForks: number | string | undefined;
}) => {
    const items = [
        {
            label: "총 레포 수",
            value: totalCount,
        },
        {
            label: "받은 star 수",
            value: totalStars,
        },
        {
            label: "포크 수",
            value: totalForks,
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 pb-8">
            {items.map((e) => {
                return (
                    <UserDashboardRepositoryStatsItem
                        label={e.label}
                        value={e.value ?? ""}
                    />
                );
            })}
        </div>
    );
};

const UserDashboardRepositoryListSkleton = () => {
    return (
        <div aria-busy="true">
            <p
                role="status"
                className="sr-only">
                저장소를 불러오는 중입니다.
            </p>
            <ul
                aria-hidden="true"
                className="flex flex-col gap-4 motion-safe:animate-pulse">
                {Array.from({ length: 4 }, (_, index) => (
                    <li
                        key={index}
                        className="bg-panel flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-3">
                            <span className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                            <span className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                            <span className="h-5 w-44 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <span className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function UserDashboardRepositorySection() {
    const { data: scope, isLoading: scopeLoading } = useGithubScopes();
    const { user } = useParams();
    const { data, isLoading, isError } = useUserDashboardRepositories(user);
    const repos = data?.repositories ?? [];

    return (
        <section className="min-h-[50vh]">
            <UserDashboardRepositoryStatsSection
                totalCount={data?.totalCount.toLocaleString()}
                totalForks={data?.totalForks.toLocaleString()}
                totalStars={data?.totalStars.toLocaleString()}
            />

            <div className="mb-2 flex justify-between">
                <h3 className="text-xl">레포지토리</h3>
                {scopeLoading ? (
                    <div className="w-4 bg-gray-200 p-2" />
                ) : scope?.includes("read:org") ? (
                    <div>이미 조직 레포지토리까지 설정이 완료되었습니다.</div>
                ) : (
                    <div>
                        <span className="mr-2 text-sm text-gray-500">
                            현재 조직 레포 권한이 설정되지 않았습니다.
                        </span>
                        <button
                            className="bg-primary hover:bg-primary/70 rounded-xl border p-2 text-white"
                            onClick={() => {
                                handleOAuthLogin(["read:org", ...scope!]);
                            }}>
                            권한 설정
                        </button>
                    </div>
                )}
            </div>
            {isLoading && <UserDashboardRepositoryListSkleton />}
            {isError && <p role="alert">저장소를 불러오지 못했습니다.</p>}
            {data && repos.length === 0 && <p>공개 저장소가 없습니다.</p>}

            <ul className="flex flex-col gap-4">
                {repos.map((repo) => {
                    return (
                        <li key={repo.nameWithOwner}>
                            <Link
                                to={`/repo/${repo.nameWithOwner.split("/").map(encodeURIComponent).join("/")}`}
                                className="bg-panel hover:bg-primary/5 focus-visible:outline-primary flex flex-col gap-4 rounded-lg p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 flex-col gap-3">
                                    <h4 className="wrap-break-words text-xl font-semibold">
                                        {repo.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <BiStar
                                                aria-hidden="true"
                                                className="inline"
                                            />
                                            <span className="sr-only">스타 </span>
                                            {repo.stargazerCount.toLocaleString()}
                                        </span>
                                        {repo.primaryLanguage && (
                                            <span className="flex items-center gap-1.5">
                                                {repo.primaryLanguage.color && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                repo.primaryLanguage.color,
                                                        }}
                                                    />
                                                )}
                                                {repo.primaryLanguage.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        최근 업데이트 :{" "}
                                        <time dateTime={repo.updatedAt}>
                                            {repo.updatedAt.slice(0, 10)}
                                        </time>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
                                    <span className="text-gray-500">활동량 요약 준비 중</span>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
