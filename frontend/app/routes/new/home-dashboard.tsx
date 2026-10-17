import { useState } from "react";
import DashboardActivitySection from "~/components/page/home-dashboard/DashboardActivitySection";
import DashboardNavigationSection from "~/components/page/home-dashboard/DashboardNavigationSection";
import DashboardProfileSection from "~/components/page/home-dashboard/DashboardProfileSection";

interface Commit {
    sha: string;
    repository: string;
    message: string;
    date: string;
    type: string;
    url: string;
}

const ThemeColors = {
    green: {
        heatMapRange: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    },
};

//js의 enum은 양방향 매핑이 가능하다는 장점이 있음
enum EHomeDashboardMenu {
    "최근 활동" = 0,
    "개발 성향" = 1,
    레포지토리 = 2,
}

export default function HomeDashboard() {
    const location: string = "Korea, Seoul";
    const bio = "안녕하세요 뛰어난 개발자입니다.aㅁㄴㅇㅁㄴㅇsdasdasㅁㄴ애ㅑㅡ패ㅑㅡsdasdasdasd";
    const name = "flyetanol";
    const link = ["https://instagram.com", "https://naver.com"];
    const following = 30;
    const followers = 25;

    const [menuState, setMenuState] = useState<EHomeDashboardMenu>(EHomeDashboardMenu["최근 활동"]);

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
            <DashboardNavigationSection menus={menus} />

            {menuState == 0 ? (
                <DashboardActivitySection commits={commits} />
            ) : menuState == 1 ? (
                <section className="grid min-w-24 grid-cols-3 gap-8 not-lg:grid-cols-1">
                    <div>
                        <div className="h-84 border">니 얼굴</div>
                    </div>
                    <div>내 얼굴ㅋ</div>
                    <div>너의 얼굴ㅋ</div>

                    <div></div>
                </section>
            ) : menuState == 2 ? (
                <section className="grid min-h-[50vh] grid-cols-3"> 니 얼굴</section>
            ) : (
                <section className="min-h-screen">
                    <ul></ul>
                </section>
            )}
        </main>
    );
}
