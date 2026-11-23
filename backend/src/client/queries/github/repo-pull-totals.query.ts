/** PR의 서로 배타적인 세 상태의 전체 개수를 조회합니다. */
export const repoPullTotalsQuery = /* GraphQL */ `
    query GetRepoPullTotals($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
            open: pullRequests(first: 1, states: [OPEN]) {
                totalCount
            }
            merged: pullRequests(first: 1, states: [MERGED]) {
                totalCount
            }
            closed: pullRequests(first: 1, states: [CLOSED]) {
                totalCount
            }
        }
    }
`;
