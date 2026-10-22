import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export const RouteURL = {
    trend : "/trend",
    search : "/search",
    community : "/community"
}



export default [
    //index는 기본 라우트("/")로 사용될 컴포넌트를 지정할 때 사용
    // index("old/home","routes/old/home.tsx"),
    // layout("components/layout/QueryClientLayout.tsx", [
    //         route("old/search","routes/old/search.tsx"),
    // ]
    // ),
    // layout("components/layout/RouteGuardLayout.tsx", [
    //     layout("components/layout/DashboardLayout.tsx", [
    //         route("old/dashboard", "routes/old/dashboard.tsx"),
    //         route("old/statpage", "routes/old/statpage.tsx"),
    //         route("old/contribute", "routes/old/contribute.tsx"),
    //     ]),
    // ]),
   
    layout("routes/CommonLayout.tsx", [
        index("routes/home.tsx"),
        route(RouteURL.trend, "routes/trend.tsx"),
        route(RouteURL.search, "routes/search.tsx"),
        route(RouteURL.community, "routes/community.tsx"),
        route("repo/:repo", "routes/repo-dashboard.tsx", [
            index("./components/page/repo-dashboard/RepoDashboardRecentActivitySection.tsx"),
            route("readme", "./components/page/repo-dashboard/RepoDashboardReadmeSection.tsx"),
            route("project", "./components/page/repo-dashboard/RepoDashboardProjectStatusSection.tsx"),
            route("commit", "./components/page/repo-dashboard/RepoDashboardCommitStatusSection.tsx"),
            route("prissue", "./components/page/repo-dashboard/RepoDashboardPullRequestIssueSection.tsx"),
            route("communication", "./components/page/repo-dashboard/RepoDashboardCommunicationSection.tsx"),
        ]),
        route("user/:user", "routes/user-dashboard.tsx",[
            index("./components/page/home-dashboard/DashboardActivitySection.tsx"),
            route("devStyle", "./components/page/home-dashboard/DashboardDevelopStyleSection.tsx"),
            route("repos", "./components/page/home-dashboard/DashboardRepositorySection.tsx"),
            route("interests", "./components/page/home-dashboard/DashboardInterestsSection.tsx")
        ]),
    ]),
    route("auth/github/callback", "routes/auth/callback.tsx"),

] satisfies RouteConfig;
