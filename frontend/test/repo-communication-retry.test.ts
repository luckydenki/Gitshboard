import { describe, expect, it } from "vitest";
import { shouldRetryRepoCommunication } from "../app/utils/page/repo-communication-retry";
describe("communication query retries", () => {
    it("never automatically retries HTTP 429", () => {
        const error = Object.assign(new Error("호출 제한"), { status: 429 });
        expect(shouldRetryRepoCommunication(0, error)).toBe(false);
        expect(shouldRetryRepoCommunication(2, error)).toBe(false);
    });
    it("keeps three retries for other HTTP failures", () => {
        const error = Object.assign(new Error("조회 실패"), { status: 503 });
        expect([0, 1, 2, 3].map((count) => shouldRetryRepoCommunication(count, error))).toEqual([
            true,
            true,
            true,
            false,
        ]);
        expect(shouldRetryRepoCommunication(0, { status: 404 })).toBe(true);
    });
    it("keeps three retries for network failures", () => {
        expect(shouldRetryRepoCommunication(0, new Error("네트워크 실패"))).toBe(true);
        expect(shouldRetryRepoCommunication(3, new Error("네트워크 실패"))).toBe(false);
    });
});
