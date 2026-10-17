import { useState } from "react";
import type { MetaArgs } from "react-router";

import DashboardActivitySection from "~/components/page/home-dashboard/DashboardActivitySection";
import DashboardDevelopStyleSection from "~/components/page/home-dashboard/DashboardDevelopStyleSection";
import DashboardNavigationSection from "~/components/page/home-dashboard/DashboardNavigationSection";
import DashboardProfileSection from "~/components/page/home-dashboard/DashboardProfileSection";
import DashboardRepositorySection from "~/components/page/home-dashboard/DashboardRepositorySection";
import "~/routes/new/home-dashboard.css";

export interface Commit {
    sha: string;
    repository: string;
    message: string;
    date: string;
    type: string;
    url: string;
}

export interface Issue {}

export interface PullRequest {}

const ThemeColors = {
    green: {
        heatMapRange: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    },
};

//js의 enum은 양방향 매핑이 가능하다는 장점이 있음
export enum EHomeDashboardMenu {
    "최근 활동" = 0,
    "개발 성향" = 1,
    레포지토리 = 2,
    관심사 = 3,
}

export function meta({}: MetaArgs) {
    return [
        { title: "flyetanol - 최근 활동" },
        { name: "description", content: "GitHub Dashboard login" },
    ];
}

export default function HomeDashboard() {
    const location: string = "Korea, Seoul";
    const bio =
        "우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하adasdasdasd우하하ada";
    const name = "flyetanol";
    const link = ["https://instagram.com", "https://naver.com"];
    const following = 30;
    const followers = 25;

    const [menuState, setMenuState] = useState<EHomeDashboardMenu>(EHomeDashboardMenu["최근 활동"]);

    const repos = [
        {
            name: "React-Github",
            stars: 3,
            languages: "typescript",
            lateUpdate: "2020.08.01",
        },
    ];

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
            date: "2017-09-01",
            message: "feat : 새로운 커밋",
            repository: "Gitshboard",
            sha: "59671a",
            type: "타입",
            url: "www.naver.com",
        });
    }

    return (
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
                <section className="grid min-h-[50vh] grid-cols-[300px_200px_1fr]">
                    최근 조회한 사용자 및 레포지토리
                </section>
            ) : (
                <section className="min-h-screen">
                    <ul></ul>
                </section>
            )}
        </main>
    );
}
