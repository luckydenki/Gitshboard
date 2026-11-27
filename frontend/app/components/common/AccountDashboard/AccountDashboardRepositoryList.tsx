//Dashboard의 레포지토리 리스트 UI
import { BiStar } from "react-icons/bi";
import { Link } from "react-router";

export interface AccountDashboardRepository {
    name: string;
    nameWithOwner: string;
    stargazerCount: number;
    updatedAt: string;
    primaryLanguage?: {
        name: string;
        color?: string | null;
    } | null;
}

export const AccountDashboardRepositoryListSkleton = () => {
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

export default function AccountDashboardRepositoryListItem({
    repo,
}: {
    repo: AccountDashboardRepository;
}) {
    return (
        <li key={repo.nameWithOwner}>
            <Link
                to={`/repo/${repo.nameWithOwner.split("/").map(encodeURIComponent).join("/")}`}
                className="bg-panel hover:bg-primary/5 focus-visible:outline-primary flex flex-col gap-4 rounded-lg p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-3">
                    <h4 className="wrap-break-words text-xl font-semibold">{repo.name}</h4>
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
                        <time dateTime={repo.updatedAt}>{repo.updatedAt.slice(0, 10)}</time>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
                    <span className="text-gray-500">활동량 요약 준비 중</span>
                </div>
            </Link>
        </li>
    );
}
