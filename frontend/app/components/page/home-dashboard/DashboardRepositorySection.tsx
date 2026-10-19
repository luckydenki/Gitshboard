import { BiStar } from "react-icons/bi";

/**
 * GitHub GraphQL 저장소 목록의 항목 타입입니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/repos#repository
 *
 * graphQL :
 * query {
 *   viewer {
 *     repositories(first: 10, ownerAffiliations: OWNER) {
 *       nodes { name url stargazerCount primaryLanguage { name color } updatedAt }
 *     }
 *   }
 * }
 *
 * 성공 응답 예시 (요청한 필드에 따라 응답이 달라집니다):
 * {
 *   "data": {
 *     "viewer": {
 *       "repositories": {
 *         "nodes": [{
 *           "name": "Hello-World",
 *           "url": "https://github.com/octocat/Hello-World",
 *           "stargazerCount": 3,
 *           "primaryLanguage": { "name": "TypeScript", "color": "#3178c6" },
 *           "updatedAt": "2020-08-01T00:00:00Z"
 *         }]
 *       }
 *     }
 *   }
 * }
 * nodes의 항목, primaryLanguage와 그 color는 null일 수 있으며,
 * GraphQL 오류가 발생하면 응답에 errors가 포함될 수 있습니다.
 */
export interface RepositoryItems {
    name: string; // 저장소 이름
    url: string; // GitHub 저장소 URL
    stargazerCount: number; // 저장소를 별표한 사용자 수
    primaryLanguage: {
        name: string; // 주 언어 이름
        color: string | null; // 주 언어의 표시 색상
    } | null; // 저장소의 주 언어
    updatedAt: string; // 저장소가 마지막으로 업데이트된 시각
}

export interface DashboardRepositorySectionProps {
    repos: Array<RepositoryItems>;
}

export default function DashboardRepositorySection({ repos }: DashboardRepositorySectionProps) {
    return (
        <section className="min-h-[50vh]">
            <div className="grid grid-cols-3 gap-4 pb-8">
                <div className="bg-panel rounded-lg p-2">총 레포 수</div>
                <div className="bg-panel rounded-lg p-2">받은 star 수</div>
                <div className="bg-panel rounded-lg p-2">포크 수</div>
            </div>
            <h3 className="mb-4 text-xl">레포지토리</h3>
            <ul className="flex flex-col gap-4">
                {repos.map((repo) => {
                    return (
                        <li
                            key={repo.url}
                            className="bg-panel flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 flex-col gap-3">
                                <a
                                    href={repo.url}
                                    className="text-primary text-xl font-semibold break-words hover:underline">
                                    {repo.name}
                                </a>
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
                                <a
                                    href={repo.url}
                                    className="text-primary font-medium hover:underline">
                                    GitHub에서 보기
                                </a>
                                <span className="text-gray-500">활동량 요약 준비 중</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
