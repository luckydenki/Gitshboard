/** 개인 통계 대시보드에 사용할 사용자 프로필과 기여 캘린더를 조회합니다. */
export const userDashboardProfileQuery = /* GraphQL */ `
    query GetUserDashboardProfile($login: String!) {
        user(login: $login) {
            login
            name
            avatarUrl(size: 160)
            url
            bio
            location
            company
            websiteUrl
            createdAt
            followers(first: 1) { totalCount }
            following(first: 1) { totalCount }
            socialAccounts(first: 10) {
                nodes { url }
            }
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays { date contributionCount }
                    }
                }
            }
        }
    }
`;
