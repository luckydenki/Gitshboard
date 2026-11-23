export type ActivityComment = {
    id: string;
    createdAt: string;
    author?: { id: string; __typename: string } | null;
};
/** activityStats: 댓글·대댓글을 작성자/UTC 날짜로 중복 제거하고 인기 점수를 계산한다.
 * @param comments id, createdAt, author(id/타입)를 가진 전체 댓글·대댓글.
 * @param authorId 게시글 작성자 ID. null이면 알려진 작성자 제외 불가.
 * @param upvotes 현재 추천 수. @param createdAt 게시글 생성 시각. @param asOf 수집 시작 시각.
 * @returns 7일 활동일 수, 전체 고유 참여자 수, 정수 경과일 및 로그 감쇠 점수.
 * @example activityStats([], null, 0, "2026-11-23", "2026-11-23") // score: 0
 * @see src/test/communication.test.ts
 */
export function activityStats(
    comments: ActivityComment[],
    authorId: string | null,
    upvotes: number,
    createdAt: string,
    asOf: string,
) {
    const to = asOf.slice(0, 10) + "T00:00:00.000Z";
    const from = new Date(Date.parse(to) - 7 * 86400000).toISOString();
    const participants = new Set<string>(),
        days = new Set<string>(),
        seen = new Set<string>();
    let excludedCount = 0;
    for (const c of comments) {
        if (seen.has(c.id)) continue;
        seen.add(c.id);
        if (!c.author) {
            excludedCount++;
            continue;
        }
        if (c.author.id === authorId || c.author.__typename === "Bot") continue;
        participants.add(c.author.id);
        if (Date.parse(c.createdAt) >= Date.parse(from) && Date.parse(c.createdAt) < Date.parse(to))
            days.add(c.author.id + ":" + c.createdAt.slice(0, 10));
    }
    const elapsedDays = Math.max(
        0,
        Math.round((Date.parse(to) - Date.parse(createdAt.slice(0, 10) + "T00:00:00Z")) / 86400000),
    );
    const evaluationScore =
        0.7 * Math.log1p(upvotes) +
        0.2 * Math.log1p(days.size) +
        0.1 * Math.log1p(participants.size);
    return {
        recentActivity: days.size,
        uniqueCommenterCount: participants.size,
        excludedCount,
        activityPeriod: { from, to },
        elapsedDays,
        evaluationScore,
        score: evaluationScore ** 0.9 / (elapsedDays + 2) ** 1.2,
    };
}
/** releaseStats: 실제 공개 릴리스의 최근 6개월 게시 건수/월평균을 구한다.
 * @param releases draft 여부와 published_at을 가진 전체 릴리스. @param asOf UTC 집계 시각.
 * @returns 말일 보정 6개월 구간과 건수, 월평균. prerelease 포함.
 * @example releaseStats([], "2026-08-31T12:00:00Z") // count: 0
 * @see src/test/communication.test.ts
 */
export function releaseStats(
    releases: { draft: boolean; published_at: string | null }[],
    asOf: string,
) {
    const to = new Date(asOf),
        from = new Date(asOf),
        day = from.getUTCDate();
    from.setUTCDate(1);
    from.setUTCMonth(from.getUTCMonth() - 6);
    const last = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0)).getUTCDate();
    from.setUTCDate(Math.min(day, last));
    const count = releases.filter(
        (r) =>
            !r.draft &&
            r.published_at &&
            Date.parse(r.published_at) >= +from &&
            Date.parse(r.published_at) < +to,
    ).length;
    return {
        count,
        monthlyAverage: count / 6,
        months: 6 as const,
        includePrereleases: true as const,
        period: { from: from.toISOString(), to: to.toISOString() },
    };
}
