/**
 * shouldRetryRepoCommunication: 커뮤니케이션 조회의 429 자동 재시도를 차단합니다.
 * @param failureCount 현재까지 실패 후 재시도한 횟수(첫 실패는 0).
 * @param error HTTP status를 포함할 수 있는 조회 오류.
 * @returns 429이면 false, 그 외 오류는 기존 최대 3회 재시도 허용 여부.
 * @example shouldRetryRepoCommunication(0, { status: 429 }) // false
 * @example shouldRetryRepoCommunication(2, new Error()) // true
 * @see frontend/test/repo-communication-retry.test.ts
 */
export function shouldRetryRepoCommunication(failureCount: number, error: unknown): boolean {
    if (typeof error === "object" && error !== null && "status" in error && error.status === 429) {
        return false;
    }
    return failureCount < 3;
}
