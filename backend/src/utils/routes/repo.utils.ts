/** 활동 커서가 가리키는 스냅샷과 마지막 이벤트입니다. */
interface RepoActivityCursor {
    asOf: string;
    occurredAt: string;
    id: string;
}

class RepoUtils {
    /**
     * GitHub GraphQL 오류에서 조회 대상 저장소를 찾을 수 없는지 확인합니다.
     * @param error GitHub 요청에서 발생한 오류.
     * @returns 저장소 필드의 NOT_FOUND 오류가 있으면 true.
     */
    public static isRepositoryNotFound(error: unknown): boolean {
        return error instanceof Error && "errors" in error && Array.isArray(error.errors) &&
            error.errors.some((item) => item?.type === "NOT_FOUND" && item.path?.[0] === "repository");
    }

    /**
     * 활동 조회에 사용하는 저장소 주소와 시간대의 형식을 확인합니다.
     * @param owner 저장소 소유자 경로 값.
     * @param repo 저장소 이름 경로 값.
     * @param timezone 시간대 쿼리 값.
     * @returns 형식이 유효한 입력값 또는 undefined.
     */
    public static parseActivityLocation(owner: unknown, repo: unknown, timezone: unknown) {
        if (
            typeof owner !== "string" || !/^[\w-]+$/.test(owner) ||
            typeof repo !== "string" || !/^[\w.-]+$/.test(repo) ||
            typeof timezone !== "string" || timezone.length > 100
        ) return undefined;

        return { owner, repo, timezone };
    }

    /**
     * 활동 커서를 복원하고 요청 범위, 시각 및 만료 여부를 검사합니다.
     * @param cursor 요청의 base64url 커서 값.
     * @param scope 현재 요청의 저장소와 시간대 식별자.
     * @param now 현재 요청의 기준 시각(밀리초).
     * @returns 유효한 커서 데이터 또는 undefined.
     */
    public static decodeActivityCursor(cursor: unknown, scope: string, now: number): RepoActivityCursor | undefined {
        if (typeof cursor !== "string" || !/^[\w-]{1,4096}$/.test(cursor)) return undefined;

        try {
            const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
            if (
                parsed?.scope !== scope || typeof parsed.asOf !== "string" ||
                new Date(parsed.asOf).toISOString() !== parsed.asOf ||
                Date.parse(parsed.asOf) > now || now - Date.parse(parsed.asOf) > 60 * 60 * 1000 ||
                typeof parsed.occurredAt !== "string" ||
                new Date(parsed.occurredAt).toISOString() !== parsed.occurredAt ||
                typeof parsed.id !== "string" || !parsed.id
            ) return undefined;

            return { asOf: parsed.asOf, occurredAt: parsed.occurredAt, id: parsed.id };
        } catch {
            return undefined;
        }
    }

    /**
     * 마지막 활동을 다음 페이지에서 읽을 수 있는 커서로 인코딩합니다.
     * @param scope 현재 요청의 저장소와 시간대 식별자.
     * @param activity 스냅샷 시각과 페이지의 마지막 활동 식별 정보.
     * @returns 다음 요청에 사용할 base64url 커서.
     */
    public static encodeActivityCursor(scope: string, activity: RepoActivityCursor): string {
        return Buffer.from(JSON.stringify({ scope, ...activity })).toString("base64url");
    }

    /**
     * 스냅샷 기준 최근 7개 현지 날짜와 GitHub 조회 시작 시각을 구합니다.
     * @param asOf 활동 스냅샷의 ISO 시각.
     * @param clock 조회 시간대의 날짜와 시각을 표시하는 포매터.
     * @returns 날짜 목록, UTC 조회 시작 시각, 현지 날짜 변환 및 범위 판별 함수.
     */
    public static getActivityWindow(asOf: string, clock: Intl.DateTimeFormat) {
        const dateKey = (value: string) => {
            const parts = clock.formatToParts(new Date(value));
            const year = parts.find((part) => part.type === "year")?.value;
            const month = parts.find((part) => part.type === "month")?.value;
            const day = parts.find((part) => part.type === "day")?.value;
            return `${year}-${month}-${day}`;
        };
        const dayMs = 24 * 60 * 60 * 1000;
        const lastDate = dateKey(asOf);
        const lastDateMidnight = Date.parse(lastDate);
        const dates = Array.from({ length: 7 }, (_, index) =>
            new Date(lastDateMidnight - (6 - index) * dayMs).toISOString().slice(0, 10),
        );
        // UTC 자정보다 먼저 시작하는 현지 날짜까지 조회합니다.
        const since = new Date(lastDateMidnight - 7 * dayMs).toISOString();
        const inWindow = (value: string) =>
            Date.parse(value) < Date.parse(asOf) && dateKey(value) >= dates[0];

        return { dates, lastDate, since, dateKey, inWindow };
    }
}

export default RepoUtils;
