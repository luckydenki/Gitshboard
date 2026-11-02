import type { Profile } from "~/types/profile";

/** 사용자 대시보드 프로필 화면을 위한 임시 응답 데이터입니다. */
export const userProfileMock: Profile = {
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
