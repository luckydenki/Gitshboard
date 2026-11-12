import { BiStar } from "react-icons/bi";
import { Link, useParams } from "react-router";
import { useUserDashboardRepositories } from "~/hooks/useUserDashboard";

export default function UserDashboardRepositorySection() {
    const { user } = useParams();
    const { data, isLoading, isError } = useUserDashboardRepositories(user);
    const repos = data?.repositories ?? [];

    return (
        <section className="min-h-[50vh]">
            <div className="grid grid-cols-3 gap-4 pb-8">
                <div className="bg-panel rounded-lg p-2">총 레포 수 {data?.totalCount.toLocaleString() ?? "—"}</div>
                <div className="bg-panel rounded-lg p-2">받은 star 수 {data?.totalStars.toLocaleString() ?? "—"}</div>
                <div className="bg-panel rounded-lg p-2">포크 수 {data?.totalForks.toLocaleString() ?? "—"}</div>
            </div>
            <h3 className="mb-4 text-xl">레포지토리</h3>
            {isLoading && <p role="status">저장소를 불러오는 중입니다.</p>}
            {isError && <p role="alert">저장소를 불러오지 못했습니다.</p>}
            {data && repos.length === 0 && <p>공개 저장소가 없습니다.</p>}
            <ul className="flex flex-col gap-4">
                {repos.map((repo) => {
                    return (
                        <li key={repo.nameWithOwner}>
                            <Link
                                to={`/repo/${encodeURIComponent(repo.nameWithOwner)}`}
                                className="bg-panel flex flex-col gap-4 rounded-lg p-5 transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-row sm:items-center sm:justify-between">
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
                                                            backgroundColor: repo.primaryLanguage.color,
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
