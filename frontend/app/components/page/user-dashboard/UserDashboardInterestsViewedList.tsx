import PanelLayout from "~/components/common/DashboardPanelLayout";
import { viewedRepositoriesMock, viewedUsersMock } from "~/mock/home-dashboard/dashboard-viewed";

type Props = { kind: "repositories" | "users" };
export default function UserDashboardInterestsViewedList({ kind }: Props) {
    const isRepositories = kind === "repositories";
    const items = isRepositories ? viewedRepositoriesMock : viewedUsersMock;
    return (
        <PanelLayout
            title={isRepositories ? "자주 살펴본 레포지토리" : "자주 찾아본 개발자"}
            semititle={
                isRepositories
                    ? "최근 관심을 가지고 찾아본 프로젝트예요."
                    : "관심 있게 살펴본 GitHub 사용자예요."
            }
            footer="이름을 선택하면 GitHub로 이동해요.">
            <ul className="flex flex-col divide-y divide-gray-300">
                {items.map((item, index) => (
                    <li key={item.name}>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:bg-primary/5 focus-visible:outline-primary flex min-w-0 cursor-pointer items-center gap-3 rounded-lg p-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">
                            <span
                                className="shrink-0 text-sm text-gray-500"
                                aria-hidden="true">
                                {"initials" in item
                                    ? item.initials
                                    : String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold break-words">
                                    {item.name}
                                </span>
                                <span className="mt-1 block text-xs text-gray-500">
                                    {"topic" in item ? item.topic : item.description}
                                </span>
                            </span>
                            <span className="shrink-0 text-xs text-gray-500">{item.visits}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </PanelLayout>
    );
}
