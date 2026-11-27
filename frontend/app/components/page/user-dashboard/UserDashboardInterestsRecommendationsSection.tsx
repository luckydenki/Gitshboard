import PanelLayout from "~/components/common/DashboardPanelLayout";
import { recommendedRepositoriesMock } from "~/mock/home-dashboard/dashboard-recommendRepos";
export default function UserDashboardInterestsRecommendationsSection() {
    return (
        <PanelLayout
            title="이런 프로젝트는 어떠세요?"
            semititle="관심 주제와 관련된 프로젝트를 발견해 보세요."
            footer="관심사 기반 추천 예시">
            <ul className="flex flex-col gap-4 divide-y divide-gray-300 lg:flex-row lg:divide-x lg:divide-y-0">
                {recommendedRepositoriesMock.map((repo) => (
                    <li
                        key={repo.name}
                        className="min-w-0 flex-1">
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:bg-primary/5 focus-visible:outline-primary flex h-full cursor-pointer flex-col gap-3 rounded-lg p-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">
                            <span className="text-sm text-gray-500">{repo.topic}</span>
                            <h4 className="text-lg font-medium break-words">{repo.name}</h4>
                            <p className="flex-1 text-sm leading-6 text-gray-500">
                                {repo.description}
                            </p>
                            <p className="text-xs leading-5 text-gray-500">
                                추천 이유 · {repo.reason}
                            </p>
                        </a>
                    </li>
                ))}
            </ul>
        </PanelLayout>
    );
}
