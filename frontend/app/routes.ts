import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export const RouteURL = {
    trend : "/trend",
    search : "/search",
    community : "/community"
    
}


export default [

    layout("routes/CommonLayout.tsx", [
        index("routes/home.tsx"),
        route(RouteURL.trend, "routes/trend.tsx"),
        route(RouteURL.search, "routes/search.tsx"),
        route(RouteURL.community, "routes/community.tsx"),

        ...(import.meta.env.DEV) ? [route("test", "routes/Test.tsx")] : [],  //test


        route("repo/:repo", "routes/repo-dashboard.tsx", [
            index("./components/page/repo-dashboard/menus/RepoDashboardRecentActivitySection.tsx"),
            route("readme", "./components/page/repo-dashboard/menus/RepoDashboardReadmeSection.tsx"),
            route("project", "./components/page/repo-dashboard/menus/RepoDashboardProjectStatusSection.tsx"),
            route("commit", "./components/page/repo-dashboard/menus/RepoDashboardCommitStatusSection.tsx"),
            route("prissue", "./components/page/repo-dashboard/menus/RepoDashboardPullRequestIssueSection.tsx"),
            route("communication", "./components/page/repo-dashboard/menus/RepoDashboardCommunicationSection.tsx"),
        ]),
        route("user/:user", "routes/user-dashboard.tsx",[
            index("./components/page/user-dashboard/menus/UserDashboardActivitySection.tsx"),
            route("devStyle", "./components/page/user-dashboard/menus/UserDashboardDevelopStyleSection.tsx"),
            route("repos", "./components/page/user-dashboard/menus/UserDashboardRepositorySection.tsx"),
            route("interests", "./components/page/user-dashboard/menus/UserDashboardInterestsSection.tsx")
        ]),
        route("500", "routes/error/server-error-page.tsx"),
        route("503", "routes/error/service-unavailable-page.tsx"),
        route("*", "routes/error/not-found-page.tsx"),
    ]),
    route("auth/github/callback", "routes/auth/callback.tsx"),

] satisfies RouteConfig;
