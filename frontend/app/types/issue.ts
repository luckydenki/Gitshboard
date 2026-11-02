/**
 * 대시보드 활동 타임라인에 표시할 GitHub GraphQL `Issue` 응답 타입입니다.
 * type : GraphQL
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql/reference/issues
 *
 * graphQL :
 * query RecentIssues {
 *   viewer {
 *     issues(first: 10, orderBy: { field: UPDATED_AT, direction: DESC }) {
 *       nodes {
 *         repository { nameWithOwner }
 *         number
 *         title
 *         url
 *         author { login avatarUrl(size: 40) }
 *         state
 *         stateReason
 *         createdAt
 *         updatedAt
 *         closedAt
 *         comments { totalCount }
 *         labels(first: 3) { nodes { name color } }
 *       }
 *     }
 *   }
 * }
 */
export interface Issue {
    repository: {
        nameWithOwner: string; // 이슈가 속한 owner/repository 이름
    };
    number: number; // 저장소 내 이슈 번호
    title: string; // 이슈 제목
    url: string; // 이슈 상세 페이지 URL
    author: {
        login: string; // 이슈 작성자의 GitHub 로그인 ID
        avatarUrl: string; // 40px 크기의 작성자 프로필 이미지 URL
    } | null; // 삭제된 계정 등 작성자 정보가 없을 수 있음
    state: "OPEN" | "CLOSED"; // 이슈의 현재 상태
    stateReason: "COMPLETED" | "DUPLICATE" | "NOT_PLANNED" | null; // 닫힌 이슈의 종료 사유
    createdAt: string; // 이슈 생성 시각(ISO 8601)
    updatedAt: string; // 이슈 최근 변경 시각(ISO 8601)
    closedAt: string | null; // 이슈 종료 시각(ISO 8601)
    comments: {
        totalCount: number; // 이슈 댓글 수
    };
    labels: {
        nodes: Array<{
            name: string; // 라벨 이름
            color: string; // 라벨 색상(16진수, # 제외)
        } | null>;
    };
}
