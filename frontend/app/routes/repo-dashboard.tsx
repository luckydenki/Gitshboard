import { NavLink, Outlet } from "react-router";
import { DashboardLayout } from "~/components/page/home-dashboard/DashboardLayout";
import RepoProfileSection from "~/components/page/repo-dashboard/RepoProfileSection";
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
                <RepoProfileSection />

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
