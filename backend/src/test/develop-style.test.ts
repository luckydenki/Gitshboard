import { describe, it, expect } from "vitest";
import UserDevelopStyleProcess from "../processor/user-develop-style.processor";
describe("공개 활동 집계", () => {
    it("UTC 23시는 한국 시간 다음날 8시로 집계하고 PR 생성만 센다", () => {
        const result = UserDevelopStyleProcess.summarizeDevelopActivity(
            [
                {
                    type: "PullRequestEvent",
                    created_at: "2026-11-23T23:00:00Z",
                    repo: { name: "other/repo" },
                    payload: { action: "opened" },
                },
                {
                    type: "PullRequestEvent",
                    created_at: "2026-11-23T23:10:00Z",
                    repo: { name: "other/repo" },
                    payload: { action: "closed" },
                },
            ],
            "me",
            "Asia/Seoul",
        );
        expect(result.hourly[8].count).toBe(2);
        expect(result.weekly[1].count).toBe(2);
        expect(result.collaboration).toEqual({
            pullRequests: 1,
            reviews: 0,
            externalRepositories: 1,
        });
    });
    it("빈 결과는 24시간과 7요일의 0이며 외부 활동만 기여로 센다", () => {
        const result = UserDevelopStyleProcess.summarizeDevelopActivity(
            [
                {
                    type: "WatchEvent",
                    created_at: "2026-11-24T00:00:00Z",
                    repo: { name: "other/repo" },
                    payload: {},
                },
            ],
            "me",
            "UTC",
        );
        expect(result.hourly.every((x) => x.count === 0)).toBe(true);
        expect(result.weekly).toHaveLength(7);
        expect(result.collaboration.externalRepositories).toBe(0);
    });
});

it("언어 바이트를 합산하고 전체 기준 Top5와 기타 비율을 계산", () => {
    const result = UserDevelopStyleProcess.summarizeRepositories([
        { languages: { A: 50, B: 20, C: 10 }, topics: ["react"] },
        { languages: { A: 10, D: 5, E: 3, F: 2 }, topics: ["react", "typescript"] },
    ]);
    expect(result.languages[0]).toMatchObject({ language: "A", percentage: 60 });
    expect(result.languages).toHaveLength(5);
    expect(result.otherPercentage).toBe(2);
    expect(result.topics[0]).toEqual({ name: "react", count: 2 });
});
it("저장소가 없으면 언어·토픽이 비고 기타 비율은 0", () => {
    expect(UserDevelopStyleProcess.summarizeRepositories([])).toEqual({
        languages: [],
        topics: [],
        otherPercentage: 0,
    });
});
