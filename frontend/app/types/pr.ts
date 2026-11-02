/**
 * 대시보드 활동 타임라인에 표시할 GitHub GraphQL `PullRequest` 응답 타입입니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/pulls
 *
 * graphQL :
 * query RecentPullRequests {
 *   viewer {
 *     pullRequests(first: 10, orderBy: { field: UPDATED_AT, direction: DESC }) {
 *       nodes {
 *         repository { nameWithOwner }
 *         number
 *         title
 *         url
 *         author { login avatarUrl(size: 40) }
 *         state
 *         isDraft
 *         merged
 *         mergedAt
 *         createdAt
 *         updatedAt
 *         closedAt
 *         reviewDecision
 *         comments { totalCount }
 *         labels(first: 3) { nodes { name color } }
 *       }
 *     }
 *   }
 * }
 */
export interface PullRequest {
    repository: {
        nameWithOwner: string; // 풀 리퀘스트가 속한 owner/repository 이름
    };
    number: number; // 저장소 내 풀 리퀘스트 번호
    title: string; // 풀 리퀘스트 제목
    url: string; // 풀 리퀘스트 상세 페이지 URL
    author: {
        login: string; // 풀 리퀘스트 작성자의 GitHub 로그인 ID
        avatarUrl: string; // 40px 크기의 작성자 프로필 이미지 URL
    } | null; // 삭제된 계정 등 작성자 정보가 없을 수 있음
    state: "OPEN" | "CLOSED" | "MERGED"; // 풀 리퀘스트의 현재 상태
    isDraft: boolean; // 초안 풀 리퀘스트 여부
    merged: boolean; // 병합 완료 여부
    mergedAt: string | null; // 병합 완료 시각(ISO 8601)
    createdAt: string; // 풀 리퀘스트 생성 시각(ISO 8601)
    updatedAt: string; // 풀 리퀘스트 최근 변경 시각(ISO 8601)
    closedAt: string | null; // 병합 없이 종료된 시각(ISO 8601)
    reviewDecision: "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null; // 현재 코드 리뷰 결정 상태
    comments: {
        totalCount: number; // 풀 리퀘스트 댓글 수
    };
    labels: {
        nodes: Array<{
            name: string; // 라벨 이름
            color: string; // 라벨 색상(16진수, # 제외)
        } | null>;
    };
}
