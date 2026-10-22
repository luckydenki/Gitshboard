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
   
    layout("routes/new/CommonLayout.tsx", [
        index("routes/new/home.tsx"),
        route(RouteURL.trend, "routes/new/trend.tsx"),
        route(RouteURL.search, "routes/new/search.tsx"),
        route(RouteURL.community, "routes/new/community.tsx"),
        route("user/:user", "routes/new/home-dashboard.tsx",[
            index("./components/page/home-dashboard/DashboardActivitySection.tsx"),
            route("devStyle", "./components/page/home-dashboard/DashboardDevelopStyleSection.tsx"),
            route("repos", "./components/page/home-dashboard/DashboardRepositorySection.tsx"),
            route("interests", "./components/page/home-dashboard/DashboardInterestsSection.tsx")
        ]),
    ]),
    route("auth/github/callback", "routes/auth/callback.tsx"),

] satisfies RouteConfig;
