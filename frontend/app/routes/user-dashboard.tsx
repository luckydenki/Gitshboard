import { useState } from "react";
import UserDashboardNavigationSection from "~/components/page/user-dashboard/UserDashboardNavigationSection";
import UserDashboardProfileSection from "~/components/page/user-dashboard/UserDashboardProfileSection";
import "~/routes/user-dashboard.css";
import { Outlet } from "react-router";
import { UserDashboardLayout } from "~/components/page/user-dashboard/UserDashboardLayout";
import { CommonBackground } from "~/components/common/CommonBackground";
import { userProfileMock } from "~/mock/home-dashboard/user-profile";

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

export default function UserDashboard() {
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
            <title>{userProfileMock.name + " - " + EHomeDashboardMenu[menuState]}</title>
            <meta
                name="description"
                content={`${EHomeDashboardMenu[menuState]} 페이지`}
            />

            <CommonBackground />
            {/* 지금 아래 -mt-48과 같이 음수 마진 기법을 쓰면 absolute 없이도 무언가와 겹쳐지는 것을 구현할 수 있습니다. */}

            <UserDashboardLayout>
                <UserDashboardProfileSection profile={userProfileMock} />
                <UserDashboardNavigationSection menus={menus} />

                <Outlet />
            </UserDashboardLayout>
        </>
    );
}
