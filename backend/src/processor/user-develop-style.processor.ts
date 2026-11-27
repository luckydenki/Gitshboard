export type ActivityInput = {
    type: string | null;
    created_at: string | null;
    repo: { name: string };
    payload: { action?: string };
};

export default class UserDevelopStyleProcess {
    /**
     * summarizeDevelopActivity: 공개 기여 이벤트를 시간·요일·협업별로 집계합니다.
     * @param events type, created_at(ISO), repo.name(owner/repo), payload.action을 가진 이벤트.
     * @param login 대상 사용자명. 소유 저장소를 외부 기여에서 제외합니다.
     * @param timezone IANA 시간대. 반환값은 24시간·월~일 7개 버킷과 협업 통계입니다.
     * @example summarizeDevelopActivity([], "me", "UTC") // 모든 값 0
     * @example summarizeDevelopActivity(events, "me", "Asia/Seoul")
     * @returns 시간별·요일별 기여 이벤트 수 및 PR 생성·리뷰 이벤트·외부 저장소 수.
     * 테스트: backend/src/test/develop-style.test.ts
     */
    public static summarizeDevelopActivity(
        events: ActivityInput[],
        login: string,
        timezone: string,
    ) {
        const hourly = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
        const weekly = ["월", "화", "수", "목", "금", "토", "일"].map((day) => ({ day, count: 0 }));
        const external = new Set<string>();
        let pullRequests = 0;
        let reviews = 0;
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            weekday: "short",
            hour: "numeric",
            hourCycle: "h23",
        });
        for (const event of events) {
            if (
                ![
                    "PushEvent",
                    "PullRequestEvent",
                    "IssuesEvent",
                    "PullRequestReviewEvent",
                ].includes(event.type ?? "") ||
                !event.created_at
            )
                continue;
            const date = new Date(event.created_at);
            if (!Number.isFinite(date.getTime())) continue;
            const parts = formatter.formatToParts(date);
            const hour = Number(parts.find((p) => p.type === "hour")!.value);
            const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(
                parts.find((p) => p.type === "weekday")!.value,
            );
            hourly[hour].count++;
            weekly[day].count++;
            if (event.type === "PullRequestEvent" && event.payload.action === "opened")
                pullRequests++;
            if (event.type === "PullRequestReviewEvent") reviews++;
            if (event.repo.name.split("/")[0].toLowerCase() !== login.toLowerCase())
                external.add(event.repo.name);
        }
        return {
            hourly,
            weekly,
            collaboration: { pullRequests, reviews, externalRepositories: external.size },
        };
    }

    /**
     * summarizeRepositories: 수집된 저장소의 언어 바이트와 토픽을 합산합니다.
     * @param repositories languages(언어별 바이트), topics(저장소 토픽 배열)를 가진 수집 결과.
     * @returns 전체 바이트 기준 언어 Top5, 기타 비율 및 저장소 토픽 빈도 Top3.
     * @example UserDevelopStyleProcess.summarizeRepositories([]) // 빈 목록, 기타 0
     * @example UserDevelopStyleProcess.summarizeRepositories([{languages:{TypeScript:100},topics:["react"]}])
     * 테스트: backend/src/test/develop-style.test.ts
     */
    public static summarizeRepositories(
        repositories: { languages: Record<string, number>; topics: string[] }[],
    ) {
        const bytes: Record<string, number> = Object.create(null);
        const topics: Record<string, number> = Object.create(null);
        for (const repository of repositories) {
            for (const [name, size] of Object.entries(repository.languages))
                bytes[name] = (bytes[name] ?? 0) + size;
            for (const topic of repository.topics) topics[topic] = (topics[topic] ?? 0) + 1;
        }
        const total = Object.values(bytes).reduce((a, b) => a + b, 0);
        const rankedLanguages = Object.entries(bytes)
            .filter(([, size]) => size > 0)
            .sort((a, b) => b[1] - a[1]);
        const languages = rankedLanguages.slice(0, 5).map(([language, size]) => ({
            language,
            percentage: Math.round((size / total) * 1000) / 10,
            color: "#076BFF",
        }));

        return {
            languages,
            otherPercentage: total
                ? Math.round(
                      (rankedLanguages.slice(5).reduce((n, [, size]) => n + size, 0) / total) *
                          1000,
                  ) / 10
                : 0,
            topics: Object.entries(topics)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, count]) => ({ name, count })),
        };
    }
}
