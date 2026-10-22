import { NavLink, Outlet } from "react-router";
import {
    FiBookOpen,
    FiExternalLink,
    FiEye,
    FiGitBranch,
    FiGitCommit,
    FiStar,
    FiUsers,
} from "react-icons/fi";
import { PiGitFork } from "react-icons/pi";
import { DashboardLayout } from "~/components/page/home-dashboard/DashboardLayout";
import { DashboardProfileSectionLayout } from "~/components/page/home-dashboard/DashboardProfileSectionLayout";
const menuTabs = [
    { label: "최근 활동", to: "." },
    { label: "README", to: "readme" },
    { label: "프로젝트 현황", to: "project" },
    { label: "커밋 현황", to: "commit" },
    { label: "PR 및 이슈 현황", to: "prissue" },
    { label: "커뮤니케이션 현황", to: "communication" },
] as const;

export default function RepoDashboard() {
    return (
        <>
            <title>facebook/react 저장소 통계 - Gitshboard</title>
            <meta
                name="description"
                content="facebook/react 저장소의 활동, 프로젝트, 커밋, 이슈와 커뮤니케이션 통계입니다."
            />

            <DashboardLayout>
                <DashboardProfileSectionLayout>
                    <div className="flex flex-col gap-6 pb-8">
                        <div className="flex min-w-0 items-start justify-between gap-6 not-lg:flex-col">
                            <div className="flex min-w-0 items-start gap-5 not-sm:flex-col">
                                <img
                                    src="https://github.com/facebook.png?size=160"
                                    alt="Meta 조직 프로필"
                                    className="size-24 shrink-0 rounded-lg border-1 border-gray-300 object-cover"
                                />
                                <div className="flex min-w-0 flex-col gap-3">
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                        <span>facebook</span>
                                        <span aria-hidden="true">/</span>
                                        <span className="rounded-lg border-1 border-gray-300 p-2 text-xs">
                                            Public
                                        </span>
                                        <span className="rounded-lg border-1 border-gray-300 p-2 text-xs">
                                            예시 데이터
                                        </span>
                                    </div>
                                    <h1 className="text-2xl leading-tight font-bold break-words sm:text-3xl">
                                        react
                                    </h1>
                                    <p className="max-w-3xl text-sm leading-6 text-gray-500">
                                        사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {["react", "javascript", "library", "frontend", "ui"].map(
                                            (topic) => (
                                                <span
                                                    key={topic}
                                                    className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-medium">
                                                    {topic}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-2">
                                            <FiBookOpen aria-hidden="true" />
                                            MIT License
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <FiGitBranch aria-hidden="true" />
                                            main
                                        </span>
                                        <span>마지막 푸시 2시간 전</span>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://github.com/facebook/react"
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary flex shrink-0 items-center gap-2 rounded-lg border-1 border-gray-300 p-3 text-sm font-semibold hover:border-primary">
                                GitHub에서 보기
                                <FiExternalLink aria-hidden="true" />
                            </a>
                        </div>

                        <dl className="grid grid-cols-2 gap-4 border-t-1 border-gray-300 pt-5 xl:grid-cols-5">
                            {[
                                { label: "Stars", value: "241k", icon: FiStar },
                                { label: "Forks", value: "49.7k", icon: PiGitFork },
                                { label: "Watchers", value: "6.8k", icon: FiEye },
                                { label: "기여자", value: "1,842", icon: FiUsers },
                                { label: "열린 이슈", value: "842", icon: FiGitCommit },
                            ].map(({ label, value, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="flex min-w-0 flex-col gap-2 p-2">
                                    <dt className="flex items-center gap-2 text-xs text-gray-500">
                                        <Icon aria-hidden="true" />
                                        {label}
                                    </dt>
                                    <dd className="text-xl font-bold">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </DashboardProfileSectionLayout>

                <section className="bg-panel min-w-0 overflow-x-auto px-4 py-2">
                    <nav aria-label="저장소 통계 메뉴">
                        <ul className="flex min-w-max gap-4">
                            {menuTabs.map(({ label, to }) => (
                                <li key={label}>
                                    <NavLink
                                        to={to}
                                        end
                                        className={({ isActive }) =>
                                            `flex h-9 cursor-pointer items-center rounded-lg px-4 text-sm font-medium ${
                                                isActive
                                                    ? "bg-primary text-white"
                                                    : "bg-panel hover:bg-gray-200"
                                            }`
                                        }>
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </section>

                <Outlet />
            </DashboardLayout>
        </>
    );
}
