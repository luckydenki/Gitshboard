/** 저장소 대시보드 프로필과 열린 이슈·PR 수를 조회합니다. */
export const repositoryDashboardProfileQuery = /* GraphQL */ `
    query GetRepositoryDashboardProfile($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
            name
            nameWithOwner
            description
            visibility
            url
            pushedAt
            owner { login avatarUrl }
            licenseInfo { name }
            defaultBranchRef { name }
            repositoryTopics(first: 100) {
                nodes { topic { name } }
            }
            stargazerCount
            forkCount
            watchers { totalCount }
            issues(states: OPEN) { totalCount }
            pullRequests(states: OPEN) { totalCount }
        }
    }
`;
