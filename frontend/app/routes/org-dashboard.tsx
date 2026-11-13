import { useState } from "react";
import { useParams } from "react-router";
import { CommonBackground } from "~/components/common/CommonBackground";
import OrgDashboardProfileSection from "~/components/page/org-dashboard/OrgDashboardProfileSection";
import AccountDashboardNavigationSection from "~/components/common/AccountDashboard/AccountDashboardNavigationSection";
import { AccountDashboardProfileSkeleton } from "~/components/page/user-dashboard/UserDashboardProfileSection";
import useOrgDashboardProfile from "~/hooks/useOrgDashboardProfile";
import { DashboardLayout } from "~/components/common/AccountDashboard/AccountDashboardLayout";

export enum EHomeDashboardMenu {
    "최근 활동" = 0,
    "개발 성향" = 1,
    레포지토리 = 2,
    관심사 = 3,
}

export default function OrgDashboard() {
    const { org } = useParams();
    // 관심사 화면의 구성과 추천 방식을 보여주기 위한 예시 데이터입니다.
    const [currentMenu, setCurrentMenu] = useState<EHomeDashboardMenu>();

    const { data: profile, isLoading, isError } = useOrgDashboardProfile(org);

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
            <title>{`${org ?? "조직"} - ${"메뉴명"}`}</title>
            <meta
                name="description"
                content={`${org ?? "조직"}의 ${"메뉴명"} 페이지`}
            />

            <CommonBackground />
            <DashboardLayout>
                {isLoading && <AccountDashboardProfileSkeleton />}
                {profile && (
                    <OrgDashboardProfileSection
                        profile={{
                            avatarUrl: "a",
                            githubUrl: "b",
                            introduce: "c",
                            link: ["d"],
                            location: "e",
                            login: "REACT",
                            name: "REACT",
                        }}
                    />
                )}
                <AccountDashboardNavigationSection menus={menus} />
            </DashboardLayout>
        </>
    );
}
