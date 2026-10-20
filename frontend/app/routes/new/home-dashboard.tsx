import { useState } from "react";
import DashboardActivitySection from "~/components/page/home-dashboard/DashboardActivitySection";
import DashboardDevelopStyleSection from "~/components/page/home-dashboard/DashboardDevelopStyleSection";
import DashboardNavigationSection from "~/components/page/home-dashboard/DashboardNavigationSection";
import DashboardProfileSection from "~/components/page/home-dashboard/DashboardProfileSection";
import DashboardRepositorySection from "~/components/page/home-dashboard/DashboardRepositorySection";
import { interestTopicsMock } from "~/mock/home-dashboard/dashboard-interests";
import { recommendedRepositoriesMock } from "~/mock/home-dashboard/dashboard-recommendRepos";
import { reposMock } from "~/mock/home-dashboard/dashboard-repos";
import { viewedRepositoriesMock, viewedUsersMock } from "~/mock/home-dashboard/dashboard-viewed";
import "~/routes/new/home-dashboard.css";
import type { Commit } from "./types/commit";
import type { Profile } from "./types/profile";

// const ThemeColors = {
//     green: {
//         heatMapRange: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
//     },
// };

//js의 enum은 양방향 매핑이 가능하다는 장점이 있음
export enum EHomeDashboardMenu {
    "최근 활동" = 0,
    "개발 성향" = 1,
    레포지토리 = 2,
    관심사 = 3,
}

export default function HomeDashboard() {
    const profile: Profile = {
        name: "flyetanol",
        company: "우리회사",
        createdAt: "2017.12.14",
        followers: { totalCount: 3 },
        following: { totalCount: 4 },
        login: "니똥꼬",
        url: "",
        websiteUrl: "",
        socialAccounts: { nodes: [{ url: "a" }, { url: "b" }] },
        contributionsCollection: { contributionCalendar: { totalContributions: 3 } },
        location: "Korea, Seoul",
        avatarUrl: "",
        bio: "우하하adasdasdasd우하하adasdasdasd",
    };

    const location: string = "Korea, Seoul";
    const bio =
        "우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하ada";
    const name = "flyetanol";
    const link = ["https://instagram.com", "https://naver.com"];
    const following = 30;
    const followers = 25;

    const [menuState, setMenuState] = useState<EHomeDashboardMenu>(EHomeDashboardMenu["최근 활동"]);

    // 관심사 화면의 구성과 추천 방식을 보여주기 위한 예시 데이터입니다.
    const interestTopics = interestTopicsMock;
    const viewedRepositories = viewedRepositoriesMock;
    const viewedUsers = viewedUsersMock;
    const recommendedRepositories = recommendedRepositoriesMock;

    const repos = reposMock;

    const menus = [
        {
            menu: EHomeDashboardMenu[0],
            callback: () => {
                setMenuState(EHomeDashboardMenu["최근 활동"]);
            },
        },
        {
            menu: EHomeDashboardMenu[1],
            callback: () => {
                setMenuState(EHomeDashboardMenu["개발 성향"]);
            },
        },
        {
            menu: EHomeDashboardMenu[2],
            callback: () => {
                setMenuState(EHomeDashboardMenu["레포지토리"]);
            },
        },
        {
            menu: EHomeDashboardMenu[3],
            callback: () => {
                setMenuState(EHomeDashboardMenu["관심사"]);
            },
        },
    ];

    const commits: Commit[] = [];
    for (let i = 0; i < 12; ++i) {
        commits.push({
            nameWithOwner: "flyetanol/Gitshboard",
            oid: "59671a2b4c8d9e0f1234567890abcdef12345678",
            abbreviatedOid: "59671a2",
            messageHeadline: "feat: 새로운 커밋",
            committedDate: "2017-09-01T00:00:00Z",
            committedViaWeb: false,
            url: "https://github.com/flyetanol/Gitshboard/commit/59671a2b4c8d9e0f1234567890abcdef12345678",
        });
    }

    return (
        <>
            {/* React 19버전 이후부터 가능한 meta 주입 방식입니다. */}
            <title>{name + " - " + EHomeDashboardMenu[menuState]}</title>
            <meta
                name="description"
                content={`${EHomeDashboardMenu[menuState]} 페이지`}
            />

            <main className="px-main-side flex w-full min-w-0 flex-col gap-8 pt-8 pb-8">
                <DashboardProfileSection
                    name={name}
                    bio={bio}
                    location={location}
                    link={link}
                    following={following}
                    followers={followers}
                />
                <DashboardNavigationSection
                    menus={menus}
                    menuState={menuState}
                />

                {menuState == 0 ? (
                    <DashboardActivitySection data={commits} />
                ) : menuState == 1 ? (
                    <DashboardDevelopStyleSection />
                ) : menuState == 2 ? (
                    <DashboardRepositorySection repos={repos} />
                ) : menuState == 3 ? (
                    <section className="min-h-[50vh]">
                        <section
                            aria-labelledby="interest-preview-title"
                            className="flex min-w-0 flex-col gap-6">
                            <div className="bg-panel rounded-lg border-1 border-gray-300 p-6 sm:p-8">
                                <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,0.8fr)] lg:items-center">
                                    <div>
                                        <span className="bg-primary/10 text-primary inline-flex rounded-lg px-3 py-1 text-xs font-semibold">
                                            나의 탐색 요약
                                        </span>
                                        <span className="ml-3 text-xs text-gray-500">
                                            예시 화면 · 최근 30일
                                        </span>
                                        <h2
                                            id="interest-preview-title"
                                            className="mt-4 text-2xl leading-snug font-bold tracking-tight text-inherit sm:text-3xl">
                                            요즘 프론트엔드에
                                            <br />
                                            관심이 많으시군요!
                                        </h2>
                                        <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">
                                            최근 찾아본 프로젝트에서 프론트엔드와 개발자 도구가 자주
                                            등장했어요. 관심 주제를 바탕으로 새로운 프로젝트도
                                            둘러보세요.
                                        </p>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {[
                                                "# 프론트엔드",
                                                "# 개발자 도구",
                                                "# 데이터 시각화",
                                            ].map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-panel text-primary rounded-lg border-1 border-gray-300 px-3 py-1.5 text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-sm font-semibold text-inherit">
                                                많이 살펴본 주제
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                조회 기록 기준
                                            </span>
                                        </div>
                                        <div className="mt-5 flex flex-col gap-4">
                                            {interestTopics.map((topic) => (
                                                <div key={topic.name}>
                                                    <div className="mb-2 flex justify-between gap-2 text-xs">
                                                        <span className="font-medium text-gray-500">
                                                            {topic.name}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {topic.count}회
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 overflow-hidden rounded-lg bg-gray-300">
                                                        <div
                                                            className={`h-full rounded-lg ${topic.color}`}
                                                            style={{ width: topic.width }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                                    <h3 className="text-lg font-bold text-inherit">
                                        자주 살펴본 레포지토리
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        최근 관심을 가지고 찾아본 프로젝트예요.
                                    </p>
                                    <ul className="mt-5 divide-y divide-gray-300">
                                        {viewedRepositories.map((repo, index) => (
                                            <li key={repo.name}>
                                                <a
                                                    href={repo.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:bg-primary/5 flex items-center gap-3 rounded-lg py-4 first:pt-3">
                                                    <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                                                        0{index + 1}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-semibold text-inherit">
                                                            {repo.name}
                                                        </span>
                                                        <span className="mt-1 block truncate text-xs text-gray-500">
                                                            {repo.topic}
                                                        </span>
                                                    </span>
                                                    <span className="shrink-0 text-xs text-gray-500">
                                                        {repo.visits}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-2 text-xs text-gray-500">
                                        이름을 선택하면 GitHub로 이동해요.
                                    </p>
                                </article>

                                <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                                    <h3 className="text-lg font-bold text-inherit">
                                        자주 찾아본 개발자
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        관심 있게 살펴본 GitHub 사용자예요.
                                    </p>
                                    <ul className="mt-5 divide-y divide-gray-300">
                                        {viewedUsers.map((user) => (
                                            <li key={user.name}>
                                                <a
                                                    href={user.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:bg-primary/5 flex items-center gap-3 rounded-lg py-4 first:pt-3">
                                                    <span
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${user.color}`}>
                                                        {user.initials}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-semibold text-inherit">
                                                            {user.name}
                                                        </span>
                                                        <span className="mt-1 block truncate text-xs text-gray-500">
                                                            {user.description}
                                                        </span>
                                                    </span>
                                                    <span className="shrink-0 text-xs text-gray-500">
                                                        {user.visits}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-2 text-xs text-gray-500">
                                        이름을 선택하면 GitHub로 이동해요.
                                    </p>
                                </article>
                            </div>

                            <article className="bg-panel rounded-lg border border-gray-300 p-6 sm:p-7">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-inherit">
                                            이런 프로젝트는 어떠세요?
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            관심 주제와 관련된 프로젝트를 발견해 보세요.
                                        </p>
                                    </div>
                                    <span className="bg-primary/10 text-primary rounded-lg px-3 py-1.5 text-xs font-medium">
                                        관심사 기반 추천 예시
                                    </span>
                                </div>
                                <div className="mt-6 grid gap-3 lg:grid-cols-3">
                                    {recommendedRepositories.map((repo) => (
                                        <a
                                            key={repo.name}
                                            href={repo.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-panel hover:border-primary hover:bg-primary/5 flex h-full flex-col rounded-lg border border-gray-300 p-5 transition-colors">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="bg-panel text-primary rounded-lg px-2.5 py-1 text-xs font-semibold">
                                                    {repo.topic}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="text-gray-500">
                                                    ↗
                                                </span>
                                            </div>
                                            <h4 className="mt-4 text-sm font-bold break-all text-inherit">
                                                {repo.name}
                                            </h4>
                                            <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">
                                                {repo.description}
                                            </p>
                                            <p className="mt-5 border-t border-gray-300 pt-3 text-xs leading-5 text-gray-500">
                                                <span className="text-primary font-semibold">
                                                    추천 이유
                                                </span>{" "}
                                                · {repo.reason}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </article>

                            <p className="text-xs leading-5 text-gray-500">
                                이 화면의 조회 기록과 추천은 디자인을 위한 예시입니다. 관심사는
                                전적을 조회하는 사용자의 사이트 이용 기록을 기준으로 표시할 수
                                있어요.
                            </p>
                        </section>
                        관심사
                    </section>
                ) : (
                    <section className="min-h-screen">
                        <ul></ul>
                    </section>
                )}
            </main>
        </>
    );
}
