import { useState } from "react";
import DashboardNavigationSection from "~/components/page/home-dashboard/DashboardNavigationSection";
import DashboardProfileSection from "~/components/page/home-dashboard/DashboardProfileSection";
import "~/routes/new/home-dashboard.css";
import type { Profile } from "./types/profile";
import { Outlet } from "react-router";

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

    const menus = [
        {
            menu: EHomeDashboardMenu[0],
            link: "",
        },
        {
            menu: EHomeDashboardMenu[1],
            link: "./devStyle",
        },
        {
            menu: EHomeDashboardMenu[2],
            link: "./repos",
        },
        {
            menu: EHomeDashboardMenu[3],
            link: "./interests",
        },
    ];

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
                <DashboardNavigationSection menus={menus} />

                <Outlet />
            </main>
        </>
    );
}
