import type { GithubCommitActivity } from "../../../../app/routes/contribute";

export const commitActivityFixture: GithubCommitActivity = {
    total: 18,
    results: [
        {
            repositoryName: "github-dashboard",
            occuredAt: ["2026-08-01T00:00:00.000Z", "2026-08-03T00:00:00.000Z", "2026-08-05T00:00:00.000Z"],
            commitCount: [3, 5, 2],
        },
        {
            repositoryName: "api-server",
            occuredAt: ["2026-08-02T00:00:00.000Z", "2026-08-04T00:00:00.000Z", "2026-08-05T00:00:00.000Z"],
            commitCount: [1, 4, 3],
        },
    ],
    commitOccuredAt: [
        "2026-08-01T00:00:00.000Z",
        "2026-08-02T00:00:00.000Z",
        "2026-08-03T00:00:00.000Z",
        "2026-08-04T00:00:00.000Z",
        "2026-08-05T00:00:00.000Z",
    ],
    commitCounts: [3, 1, 5, 4, 5],
};

