import type { EChartsOption } from "echarts";
import type {
    RepoProjectDeploymentsDto,
    RepoProjectFilesDto,
    RepoProjectHistoryDto,
    RepoProjectOverviewDto,
    RepoProjectParticipationDto,
} from "~/types/response/repo-project-status";

export const chartColors = ["#4B5563", "#9CA3AF", "#D1D5DB", "#076BFF"];
export const fileTypeLabels = {
    source: "소스",
    test: "테스트",
    docs: "문서",
    config: "설정",
} as const;

export function formatCount(value: number | null | undefined) {
    return typeof value === "number" && Number.isFinite(value)
        ? value.toLocaleString("ko-KR")
        : "정보 없음";
}
export function formatSize(kb: number | null | undefined) {
    if (typeof kb !== "number" || !Number.isFinite(kb)) return "정보 없음";
    return kb < 1024
        ? `${formatCount(kb)} KB`
        : `${(kb / 1024).toLocaleString("ko-KR", { maximumFractionDigits: 1 })} MB`;
}
function formatDuration(seconds: number | null) {
    if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "정보 없음";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}시간 ${minutes}분` : `${Math.max(1, minutes)}분`;
}
export function formatMonth(month: string) {
    const [year, monthNumber] = month.split("-");
    return year && monthNumber ? `${year.slice(2)}.${monthNumber}` : month;
}
export function formatDate(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "날짜 정보 없음"
        : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(date);
}
export function makePieOption(
    name: string,
    data: Array<{ name: string; value: number }>,
): EChartsOption {
    return {
        color: chartColors,
        tooltip: { trigger: "item", formatter: "{b}<br/>{d}%" },
        series: [
            {
                name,
                type: "pie",
                radius: "68%",
                center: ["50%", "50%"],
                label: { color: "#6B7280", fontSize: 11, formatter: "{b}\n{d}%" },
                labelLine: { length: 10, length2: 6 },
                itemStyle: { borderColor: "#FFFFFF", borderWidth: 1 },
                data,
            },
        ],
    };
}
export function makeLineOption(
    data: Array<{ month: string; value: number | null }>,
    name: string,
    color = "#6B7280",
): EChartsOption {
    return {
        color: [color],
        tooltip: { trigger: "axis" },
        grid: { left: 32, right: 16, top: 24, bottom: 24, containLabel: true },
        xAxis: {
            type: "category",
            data: data.map(({ month }) => formatMonth(month)),
            axisLabel: { color: "#6B7280" },
            axisLine: { lineStyle: { color: "#D1D5DB" } },
        },
        yAxis: {
            type: "value",
            axisLabel: { color: "#6B7280" },
            splitLine: { lineStyle: { color: "#E5E7EB" } },
        },
        series: [
            {
                name,
                type: "line",
                smooth: true,
                symbolSize: 8,
                connectNulls: false,
                data: data.map(({ value }) => value),
            },
        ],
    };
}
export function makeParticipationOption(
    data: Array<{ month: string; issueAuthors: number | null; prAuthors: number | null }>,
): EChartsOption {
    return {
        color: ["#6B7280", "#9CA3AF"],
        tooltip: { trigger: "axis" },
        legend: { bottom: 0, data: ["Issue 참여자", "PR 참여자"], textStyle: { color: "#6B7280" } },
        grid: { left: 32, right: 16, top: 24, bottom: 52, containLabel: true },
        xAxis: {
            type: "category",
            data: data.map(({ month }) => formatMonth(month)),
            axisLabel: { color: "#6B7280" },
            axisLine: { lineStyle: { color: "#D1D5DB" } },
        },
        yAxis: {
            type: "value",
            axisLabel: { color: "#6B7280" },
            splitLine: { lineStyle: { color: "#E5E7EB" } },
        },
        series: [
            {
                name: "Issue 참여자",
                type: "line",
                smooth: true,
                symbolSize: 8,
                connectNulls: false,
                data: data.map(({ issueAuthors }) => issueAuthors),
            },
            {
                name: "PR 참여자",
                type: "line",
                smooth: true,
                symbolSize: 8,
                connectNulls: false,
                data: data.map(({ prAuthors }) => prAuthors),
            },
        ],
    };
}

export function getProjectChartData({
    overview,
    files,
    history,
    participation,
}: {
    overview?: RepoProjectOverviewDto;
    files?: RepoProjectFilesDto;
    history?: RepoProjectHistoryDto;
    participation?: RepoProjectParticipationDto;
}) {
    const languageData =
        overview?.languages
            .filter(({ bytes }) => bytes > 0)
            .map(({ name, bytes }) => ({ name, value: bytes })) ?? [];
    const fileTypeData =
        files?.fileTypes
            .filter(({ count }) => count > 0)
            .map(({ type, count }) => ({ name: fileTypeLabels[type], value: count })) ?? [];
    const fileHistory =
        history?.months.map(({ month, fileCount }) => ({ month, value: fileCount })) ?? [];
    const storageHistory =
        history?.months.map(({ month, diskUsageKb }) => ({ month, value: diskUsageKb })) ?? [];
    const participationHistory =
        participation?.months.map(({ month, issueAuthors, prAuthors }) => ({
            month,
            issueAuthors,
            prAuthors,
        })) ?? [];
    const contributorHistory =
        participation?.months.map(({ month, contributors }) => ({ month, value: contributors })) ??
        [];
    const hasFileHistory = fileHistory.some(({ value }) => value !== null);
    const hasStorageHistory = storageHistory.some(({ value }) => value !== null);
    const hasParticipationHistory = participationHistory.some(
        ({ issueAuthors, prAuthors }) => issueAuthors !== null || prAuthors !== null,
    );
    const hasContributorHistory = contributorHistory.some(({ value }) => value !== null);

    return {
        languageData,
        fileTypeData,
        fileHistory,
        storageHistory,
        participationHistory,
        contributorHistory,
        hasFileHistory,
        hasStorageHistory,
        hasParticipationHistory,
        hasContributorHistory,
    };
}

export function getProjectIssuePrTotals({ issuePrCounts }: RepoProjectOverviewDto) {
    const { openIssues, closedIssues, openPullRequests, mergedPullRequests } = issuePrCounts;
    return [
        ["열린 Issue", openIssues],
        ["종료된 Issue", closedIssues],
        ["열린 PR", openPullRequests],
        ["병합된 PR", mergedPullRequests],
    ] as const;
}

function formatHour(hour: number) {
    return `${hour.toString().padStart(2, "0")}시`;
}

export function getDeploymentMetrics(deployments: RepoProjectDeploymentsDto) {
    const { medianDurationSeconds, medianLeadTimeSeconds, peakHour } = deployments;
    return [
        ["배포 소요 시간", formatDuration(medianDurationSeconds), "시작부터 완료까지 중앙값"],
        ["커밋 → 배포", formatDuration(medianLeadTimeSeconds), "푸시 기록이 있는 배포의 중앙값"],
        [
            "가장 활발한 배포 시간",
            peakHour === null ? "정보 없음" : formatHour(peakHour),
            "한국 표준시 기준",
        ],
    ] as const;
}

export function getDeploymentHourBars({ hourBuckets }: RepoProjectDeploymentsDto) {
    const maxHourCount = Math.max(0, ...hourBuckets.map(({ count }) => count));
    return hourBuckets.map(({ hour, count }) => ({
        hour,
        label: formatHour(hour),
        count,
        width: `${maxHourCount ? (count / maxHourCount) * 100 : 0}%`,
    }));
}

export function formatPercent(value: number | null) {
    return value === null ? "정보 없음" : `${value.toFixed(1)}%`;
}

export function formatAttemptsPerWeek(deployments?: RepoProjectDeploymentsDto) {
    return deployments?.attempts ? `주 평균 ${deployments.attemptsPerWeek.toFixed(1)}회` : "-";
}
