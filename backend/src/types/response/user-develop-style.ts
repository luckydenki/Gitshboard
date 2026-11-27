/** GET /api/users/:login/develop-style 응답. 공개 저장소 스냅샷과 공개 이벤트 표본입니다. */
export interface UserDevelopStyle {
    languages: { language: string; percentage: number; color: string }[];
    otherPercentage: number;
    topics: { name: string; count: number }[];
    hourly: { hour: number; count: number }[];
    weekly: { day: string; count: number }[];
    collaboration: { pullRequests: number; reviews: number; externalRepositories: number };
    coverage: {
        from: string;
        to: string;
        timezone: string;
        events: number;
        repositories: number;
        eventsLimited: boolean;
        repositoriesLimited: boolean;
        scope: "public";
    };
    workTypes: { status: "unsupported"; reason: string };
}
