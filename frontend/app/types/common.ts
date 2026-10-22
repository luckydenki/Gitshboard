/**
 * 대시보드 활동 타임라인에서 커밋, 이슈, 풀 리퀘스트를 같은 카드 형태로 표시하기 위한 파생 타입입니다.
 * type : Derived (GitHub GraphQL)
 * req : POST https://api.github.com/graphql (인증 필요)
 * link : https://docs.github.com/en/graphql
 */
export interface Common {
    kind: "COMMIT" | "ISSUE" | "PULL_REQUEST"; // derived: 활동 원본의 종류
    nameWithOwner: string; // derived: 활동이 발생한 저장소의 owner/repository 이름
    url: string; // derived: GitHub 상세 페이지 URL
    summary: string; // derived: 카드 본문에 표시할 한 줄 요약
    actor: {
        login: string; // derived: 활동 작성자의 GitHub 로그인 ID
        avatarUrl: string; // derived: 활동 작성자의 프로필 이미지 URL
    } | null; // derived: 작성자 정보가 없는 시스템 활동일 수 있음
    occurredAt: string; // derived: 활동이 발생하거나 마지막 상태가 변경된 시각(ISO 8601)
    statusLabel: string; // derived: 카드 배지에 표시할 상태 텍스트
    commentCount: number | null; // derived: 댓글 수를 지원하지 않는 활동은 null
    labels: Array<{
        name: string; // derived: 라벨 이름
        color: string; // derived: 라벨 색상(16진수, # 제외)
    }>; // derived: 활동에 연결된 라벨 목록
}

/**
 * `Common` 파생 필드 매핑
 *
 * - kind
 *   - Commit: "COMMIT" 상수
 *   - Issue: "ISSUE" 상수
 *   - PullRequest: "PULL_REQUEST" 상수
 *
 * - nameWithOwner
 *   - Commit: 상위 `Repository.nameWithOwner`를 Commit history 항목과 함께 평탄화
 *   - Issue: `Issue.repository.nameWithOwner`
 *   - PullRequest: `PullRequest.repository.nameWithOwner`
 *
 * - url
 *   - Commit: `Commit.url`
 *   - Issue: `Issue.url`
 *   - PullRequest: `PullRequest.url`
 *
 * - summary
 *   - Commit: `Commit.messageHeadline`
 *   - Issue: `Issue.title`
 *   - PullRequest: `PullRequest.title`
 *
 * - actor
 *   - Commit: `Commit.author.user`가 있으면 `{ login, avatarUrl }`으로 변환하고, 없으면 null
 *   - Issue: `Issue.author`를 `{ login, avatarUrl }`으로 변환하고, 없으면 null
 *   - PullRequest: `PullRequest.author`를 `{ login, avatarUrl }`으로 변환하고, 없으면 null
 *
 * - occurredAt
 *   - Commit: `Commit.committedDate`
 *   - Issue: `Issue.closedAt ?? Issue.updatedAt`
 *   - PullRequest: `PullRequest.mergedAt ?? PullRequest.closedAt ?? PullRequest.updatedAt`
 *
 * - statusLabel
 *   - Commit: `Commit.committedViaWeb`가 true면 "WEB", 아니면 "GIT"
 *   - Issue: 열린 이슈는 `Issue.state`, 닫힌 이슈는 `Issue.stateReason ?? Issue.state`
 *   - PullRequest: 초안이면 "DRAFT", 병합됐으면 "MERGED", 그 외에는 `PullRequest.reviewDecision ?? PullRequest.state`
 *
 * - commentCount
 *   - Commit: null
 *   - Issue: `Issue.comments.totalCount`
 *   - PullRequest: `PullRequest.comments.totalCount`
 *
 * - labels
 *   - Commit: 빈 배열
 *   - Issue: null을 제외한 `Issue.labels.nodes`의 `{ name, color }`
 *   - PullRequest: null을 제외한 `PullRequest.labels.nodes`의 `{ name, color }`
 */
