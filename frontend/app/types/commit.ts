/**
 * 대시보드 최근 활동에 표시할 GitHub GraphQL `Commit` 항목 타입입니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/objects#commit
 *
 * graphQL :
 * query RecentCommits {
 *   viewer {
 *     repositories(first: 10, ownerAffiliations: OWNER) {
 *       nodes {
 *         nameWithOwner
 *         defaultBranchRef {
 *           target {
 *             ... on Commit {
 *               history(first: 10) {
 *                 nodes { oid abbreviatedOid messageHeadline committedDate committedViaWeb url }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
export interface Commit {
    nameWithOwner: string; // derived: 상위 Repository.nameWithOwner를 커밋 목록에 함께 평탄화한 저장소 이름
    oid: string; // 커밋 전체 SHA
    abbreviatedOid: string; // 축약된 커밋 SHA
    messageHeadline: string; // 커밋 메시지 첫 줄
    committedDate: string; // 커밋 시각(ISO 8601)
    committedViaWeb: boolean; // GitHub 웹 UI에서 생성한 커밋 여부
    url: string; // 커밋 상세 페이지 URL
}
