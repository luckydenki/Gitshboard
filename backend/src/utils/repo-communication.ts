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

export type ContributorCommit = {
    sha: string;
    author: { id?: number; login?: string; avatar_url?: string; html_url?: string } | null;
    commit: { committer: { date?: string } | null };
};
/** recentContributorPeriod: 오늘을 제외한 UTC 직전 7일 구간을 반환한다.
 * @param asOf UTC 수집 시작 시각.
 * @returns from 포함, to 제외인 UTC 날짜 구간.
 * @example recentContributorPeriod("2026-11-24T12:00:00Z") // 11월17일~24일 미만
 * @see src/test/communication.test.ts
 */
export function recentContributorPeriod(asOf: string) {
    const to = asOf.slice(0, 10) + "T00:00:00.000Z";
    return { from: new Date(Date.parse(to) - 7 * 86400000).toISOString(), to };
}
/** recentContributorStats: 최근 7일 커밋을 작성자 계정별로 집계한다.
 * @param commits sha, author(계정 id/login/avatar_url/html_url), commit.committer.date를 가진 목록.
 * @param asOf UTC 집계 시각.
 * @returns 기간, 식별된 기여 계정 수 및 상위4명. 비율 분모는 익명 포함 기간 내 고유 커밋 전체.
 * @example recentContributorStats([], "2026-11-24T00:00:00Z") // totalEntries:0, top:[]
 * @see src/test/communication.test.ts
 */
export function recentContributorStats(commits: ContributorCommit[], asOf: string) {
    const period = recentContributorPeriod(asOf),
        seen = new Set<string>();
    const authors = new Map<
        number,
        { login: string; avatarUrl: string; url: string; commits: number }
    >();
    for (const row of commits) {
        const time = Date.parse(row.commit.committer?.date ?? "");
        if (
            !Number.isFinite(time) ||
            time < Date.parse(period.from) ||
            time >= Date.parse(period.to) ||
            seen.has(row.sha)
        )
            continue;
        seen.add(row.sha);
        if (
            !row.author ||
            typeof row.author.id !== "number" ||
            !row.author.login ||
            !row.author.avatar_url ||
            !row.author.html_url
        )
            continue;
        const author = authors.get(row.author.id) ?? {
            login: row.author.login,
            avatarUrl: row.author.avatar_url,
            url: row.author.html_url,
            commits: 0,
        };
        author.commits++;
        authors.set(row.author.id, author);
    }
    const top = [...authors.values()]
        .sort((a, b) => b.commits - a.commits || a.login.localeCompare(b.login))
        .slice(0, 4)
        .map((a) => ({ ...a, sharePercent: (100 * a.commits) / seen.size }));
    return { period, totalEntries: authors.size, top };
}
