import type {
    GetCommitTimesQuery,
    GetRepoLanguagesQuery,
} from "../types/github/graphql/operations.generated";

const languageColors: Record<string, string> = {
    TypeScript: "bg-[#3178c6]",
    JavaScript: "bg-[#e5c743]",
    Python: "bg-[#4f8f65]",
    "C#": "bg-[#8b5cf6]",
    Java: "bg-[#dc6b35]",
    CSS: "bg-[#7952b3]",
    HTML: "bg-[#e34c26]",
    Other: "bg-gray-400",
};

export interface LanguageStat {
    name: string;
    percent: number;
    size: number;
    color: string;
}

export interface CommitTimeStat {
    label: string;
    count: number;
    percent: number;
}

export interface WeekdayStat {
    label: string;
    count: number;
    heightPercent: number;
}

const getNodes = <T>(response?: {
    user?: { repositories: { nodes?: Array<T | null> | null } } | null;
}) => (response?.user?.repositories.nodes ?? []).filter((node) => node !== null);

const roundPercent = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 1000) / 10 : 0;

export function calculateLanguageStats(
    response?: GetRepoLanguagesQuery,
): LanguageStat[] {
    const sizes = new Map<string, number>();

    getNodes(response).forEach((repository) => {
        repository.languages?.edges?.forEach((edge) => {
            if (!edge) return;
            const { node, size } = edge;
            sizes.set(node.name, (sizes.get(node.name) ?? 0) + size);
        });
    });

    const sorted = [...sizes.entries()].sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((sum, [, size]) => sum + size, 0);
    const top = sorted.slice(0, 5);
    const otherSize = sorted.slice(5).reduce((sum, [, size]) => sum + size, 0);
    const entries = otherSize > 0 ? [...top, ["Other", otherSize] as [string, number]] : top;

    return entries.map(([name, size]) => ({
        name,
        size,
        percent: roundPercent(size, total),
        color: languageColors[name] ?? "bg-github-light",
    }));
}

export interface CommitStats {
    total: number;
    peakHour: number;
    weekendPercent: number;
    timeBuckets: CommitTimeStat[];
    weekdays: WeekdayStat[];
}

export function calculateCommitStats(
    response?: GetCommitTimesQuery,
): CommitStats {
    const dates = getNodes(response).flatMap((repository) => {
        const target = repository.defaultBranchRef?.target;
        if (!target || !("history" in target)) return [];

        return (target.history.nodes ?? [])
            .filter((commit) => commit !== null)
            .map(({ committedDate }) => new Date(committedDate))
            .filter((date) => !Number.isNaN(date.getTime()));
    });

    const timeBuckets = [
        { label: "Dawn", count: 0 },
        { label: "Morning", count: 0 },
        { label: "Afternoon", count: 0 },
        { label: "Night", count: 0 },
    ];
    const weekdays = [
        { label: "Mon", count: 0 },
        { label: "Tue", count: 0 },
        { label: "Wed", count: 0 },
        { label: "Thu", count: 0 },
        { label: "Fri", count: 0 },
        { label: "Sat", count: 0 },
        { label: "Sun", count: 0 },
    ];
    const hours = Array.from({ length: 24 }, () => 0);

    dates.forEach((date) => {
        const hour = date.getHours();
        const day = date.getDay();
        hours[hour] += 1;
        timeBuckets[hour < 6 ? 0 : hour < 12 ? 1 : hour < 18 ? 2 : 3].count += 1;
        weekdays[day === 0 ? 6 : day - 1].count += 1;
    });

    const peakHour = hours.reduce((best, count, hour) => (count > hours[best] ? hour : best), 0);
    const maxWeekday = Math.max(...weekdays.map(({ count }) => count), 1);

    return {
        total: dates.length,
        peakHour,
        weekendPercent: roundPercent(weekdays[5].count + weekdays[6].count, dates.length),
        timeBuckets: timeBuckets.map(({ label, count }) => ({
            label,
            count,
            percent: roundPercent(count, dates.length),
        })),
        weekdays: weekdays.map(({ label, count }) => ({
            label,
            count,
            heightPercent: Math.max(5, Math.round((count / maxWeekday) * 100)),
        })),
    };
}
