/**
 * issuePopularityScore: 댓글과 반응, 마지막 활동 이후 경과 일수로 인기 점수를 계산합니다.
 * @param comments Issue의 댓글 수 (0 이상)
 * @param reactions Issue 본문에 달린 모든 종류의 반응 수 (0 이상)
 * @param elapsedDays 마지막 활동 이후 경과 일수 (0 이상, 소수 허용)
 * @returns 계산된 인기 점수. 댓글과 반응이 없으면 0입니다.
 * @example issuePopularityScore(0, 0, 0) // 0
 * @example issuePopularityScore(10, 5, 3) // 8 ** 0.8 / 5 ** 1.2
 * @see backend/src/test/issue-popularity.test.ts
 */
export function issuePopularityScore(
    comments: number,
    reactions: number,
    elapsedDays: number,
): number {
    return Math.pow(0.6 * comments + 0.4 * reactions, 0.8) / Math.pow(elapsedDays + 2, 1.2);
}
