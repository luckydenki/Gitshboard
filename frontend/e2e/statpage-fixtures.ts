export const statPageApiData = {
  languages: [
    { name: "TypeScript", percent: 80, size: 80, color: "bg-blue-500" },
    { name: "CSS", percent: 20, size: 20, color: "bg-pink-500" },
  ],
  commitTime: {
    total: 12,
    peakHour: 9,
    weekendPercent: 25,
    timeBuckets: [
      { label: "Morning", count: 7, percent: 58 },
      { label: "Afternoon", count: 3, percent: 25 },
      { label: "Evening", count: 2, percent: 17 },
    ],
    weekdays: [
      { label: "Mon", count: 3, heightPercent: 100 },
      { label: "Tue", count: 2, heightPercent: 67 },
      { label: "Wed", count: 2, heightPercent: 67 },
      { label: "Thu", count: 2, heightPercent: 67 },
      { label: "Fri", count: 1, heightPercent: 33 },
      { label: "Sat", count: 1, heightPercent: 33 },
      { label: "Sun", count: 1, heightPercent: 33 },
    ],
  },
  projectTopics: [
    { name: "Frontend", count: 1, percent: 100 },
  ],
  developStats: {
    profiles: [
      { name: "Morning builder", percent: 58 },
      { name: "TypeScript focused", percent: 80 },
    ],
    traits: [
      { title: "Peak activity", detail: "Most commits are made in the morning." },
    ],
  },
  projectLiveRate: {
    total: 1,
    active: 1,
    idle: 0,
    dormant: 0,
    archived: 0,
    forks: 0,
    projects: [
      {
        name: "e2e-dashboard",
        createdAt: "2025-01-01T09:00:00.000Z",
        pushedAt: "2026-07-28T09:00:00.000Z",
        updatedAt: "2026-07-28T09:00:00.000Z",
        isArchived: false,
        isFork: false,
        status: "Active" as const,
        daysSincePush: 8,
        updatedLabel: "Updated recently",
      },
    ],
  },
};
