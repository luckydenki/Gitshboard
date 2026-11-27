import type { GetRepoPopularIssuesData } from "../types/controllers/repo-popular-issues";

type RankedIssue = NonNullable<GetRepoPopularIssuesData["issues"]>[number];

/**
 * rankPopularIssues — 점수가 가장 높은 5개를 반환합니다. 동점은 반응 수, 댓글 수, 번호 순입니다.
 * @param issues 점수, 반응 수, 댓글 수와 번호가 있는 순위 후보입니다.
 * @returns 원본을 변경하지 않고 정렬한 최대 5개의 Issue입니다.
 * @example rankPopularIssues([]) // []
 * @see src/test/repo-popular-issues.processor.test.ts
 */
export function rankPopularIssues(issues: readonly RankedIssue[]): RankedIssue[] {
    return [...issues]
        .sort(
            (a, b) =>
                b.score - a.score ||
                b.reactions - a.reactions ||
                b.comments - a.comments ||
                a.number - b.number,
        )
        .slice(0, 5);
}
