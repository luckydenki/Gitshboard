import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export const RouteURL = {
    trend: "/trend",
    search: "/search",
    community: "/community",
};

export default [
    layout("routes/CommonLayout.tsx", [
        index("routes/home.tsx"),
        route(RouteURL.trend, "routes/trend.tsx"),
        route(RouteURL.search, "routes/search.tsx"),
        route(RouteURL.community, "routes/community.tsx"),

        ...(import.meta.env.DEV ? [route("test", "routes/Test.tsx")] : []), //test

        route("repo/:legacy", "routes/repo-legacy.tsx"),
        route("repo/:owner/:repo", "routes/repo-dashboard.tsx", [
            index("./routes/repo-dashboard/RepoDashboardRecentActivitySection.tsx"),
            route("readme", "./routes/repo-dashboard/RepoDashboardReadmeSection.tsx"),
            route("project", "./routes/repo-dashboard/RepoDashboardProjectStatusSection.tsx"),
            route("commit", "./routes/repo-dashboard/RepoDashboardCommitStatusSection.tsx"),
            route("prissue", "./routes/repo-dashboard/RepoDashboardPullRequestIssueSection.tsx"),
            route("communication", "./routes/repo-dashboard/RepoDashboardCommunicationSection.tsx"),
        ]),
        route("org/:org", "routes/org-dashboard.tsx", [
            index("./routes/org-dashboard/OrgDashboardActivitySection.tsx"),
            route("repos", "./routes/org-dashboard/OrgDashboardRepositorySection.tsx"),
        ]),
        route("user/:user", "routes/user-dashboard.tsx", [
            index("./routes/user-dashboard/UserDashboardActivitySection.tsx"),
            route("devStyle", "./routes/user-dashboard/UserDashboardDevelopStyleSection.tsx"),
            route("repos", "./routes/user-dashboard/UserDashboardRepositorySection.tsx"),
            route("organizations", "./routes/user-dashboard/UserDashboardOrganizationSection.tsx"),
            route("interests", "./routes/user-dashboard/UserDashboardInterestsSection.tsx"),
        ]),
        route("500", "routes/error/server-error-page.tsx"),
        route("503", "routes/error/service-unavailable-page.tsx"),
        route("*", "routes/error/not-found-page.tsx"),
    ]),
    route("auth/github/callback", "routes/auth/callback.tsx"),
] satisfies RouteConfig;
