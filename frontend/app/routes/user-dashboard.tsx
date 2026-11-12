import UserDashboardNavigationSection from "~/components/page/user-dashboard/UserDashboardNavigationSection";
import UserDashboardProfileSection from "~/components/page/user-dashboard/UserDashboardProfileSection";
import "~/routes/user-dashboard.css";
import { Outlet, useMatch, useParams } from "react-router";
import { UserDashboardLayout } from "~/components/page/user-dashboard/UserDashboardLayout";
import { CommonBackground } from "~/components/common/CommonBackground";
import { useUserDashboardProfile } from "~/hooks/useUserDashboard";

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
    const { user } = useParams();
    const { data: profile, isLoading, isError } = useUserDashboardProfile(user);
    const menuMatch = useMatch("/user/:user/:menu");

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

    const currentMenu =
        menus.find((item) => item.link === `./${menuMatch?.params.menu}`) ?? menus[0];

    return (
        <>
            {/* React 19버전 이후부터 가능한 meta 주입 방식입니다. */}
            <title>{`${user ?? "사용자"} - ${currentMenu.menu}`}</title>
            <meta
                name="description"
                content={`${user ?? "사용자"}의 ${currentMenu.menu} 페이지`}
            />

            <CommonBackground />
            {/* 지금 아래 -mt-48과 같이 음수 마진 기법을 쓰면 absolute 없이도 무언가와 겹쳐지는 것을 구현할 수 있습니다. */}

            <UserDashboardLayout>
                {isLoading && <p role="status">프로필을 불러오는 중입니다.</p>}
                {isError && <p role="alert">프로필을 불러오지 못했습니다.</p>}
                {profile && <UserDashboardProfileSection profile={profile} />}
                <UserDashboardNavigationSection menus={menus} />

                <Outlet />
            </UserDashboardLayout>
        </>
    );
}
