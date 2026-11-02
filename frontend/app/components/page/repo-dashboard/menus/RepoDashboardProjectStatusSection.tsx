import {
    languagesMock as languages,
    fileTypesMock as fileTypes,
    fileCountTrendMock as fileCountTrend,
    storageTrendMock as storageTrend,
    growthMonthsMock as growthMonths,
    deploymentHoursMock as deploymentHours,
    frameworksMock as frameworks,
    issuePrTotalsMock as issuePrTotals,
    healthFilesMock as healthFiles,
    deploymentMetricsMock as deploymentMetrics,
    issueParticipantTrendMock as issueParticipantTrend,
    prParticipantTrendMock as prParticipantTrend,
    contributorGrowthTrendMock as contributorGrowthTrend,
    summaryMock,
} from "~/mock/repo-dashboard/project-status";
import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { FiCheck, FiFile, FiGitPullRequest, FiHardDrive } from "react-icons/fi";

const chartColors = ["#4B5563", "#9CA3AF", "#D1D5DB", "#076BFF"];

const languagePieOption: EChartsOption = {
    color: chartColors,
    tooltip: {
        trigger: "item",
        formatter: "{b}<br/>{c}%",
    },
    series: [
        {
            name: "언어 구성",
            type: "pie",
            radius: "68%",
            center: ["50%", "50%"],
            label: {
                color: "#6B7280",
                fontSize: 11,
                formatter: "{b}\n{d}%",
            },
            labelLine: {
                length: 10,
                length2: 6,
            },
            itemStyle: {
                borderColor: "#FFFFFF",
                borderWidth: 1,
            },
            data: languages.map(({ name, percent }) => ({
                name,
                value: percent,
            })),
        },
    ],
};

const fileTypePieOption: EChartsOption = {
    color: chartColors,
    tooltip: {
        trigger: "item",
        formatter: "{b}<br/>{c}%",
    },
    series: [
        {
            name: "파일 구성",
            type: "pie",
            radius: "68%",
            center: ["50%", "50%"],
            label: {
                color: "#6B7280",
                fontSize: 11,
                formatter: "{b}\n{d}%",
            },
            labelLine: {
                length: 10,
                length2: 6,
            },
            itemStyle: {
                borderColor: "#FFFFFF",
                borderWidth: 1,
            },
            data: fileTypes.map(({ label, percent }) => ({
                name: label,
                value: percent,
            })),
        },
    ],
};

const participationOption: EChartsOption = {
    color: ["#6B7280", "#9CA3AF"],
    tooltip: { trigger: "axis" },
    legend: {
        bottom: 0,
        data: ["Issue 참여자", "PR 참여자"],
        textStyle: { color: "#6B7280" },
    },
    grid: { left: 32, right: 16, top: 24, bottom: 52, containLabel: true },
    xAxis: {
        type: "category",
        data: growthMonths,
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
            data: issueParticipantTrend,
        },
        {
            name: "PR 참여자",
            type: "line",
            smooth: true,
            symbolSize: 8,
            data: prParticipantTrend,
        },
    ],
};

const contributorGrowthOption: EChartsOption = {
    color: ["#6B7280"],
    tooltip: { trigger: "axis" },
    grid: { left: 32, right: 16, top: 24, bottom: 24, containLabel: true },
    xAxis: {
        type: "category",
        data: growthMonths,
        axisLabel: { color: "#6B7280" },
        axisLine: { lineStyle: { color: "#D1D5DB" } },
    },
    yAxis: {
        type: "value",
        min: 1500,
        axisLabel: { color: "#6B7280" },
        splitLine: { lineStyle: { color: "#E5E7EB" } },
    },
    series: [
        {
            name: "누적 기여자",
            type: "line",
            smooth: true,
            symbolSize: 8,
            data: contributorGrowthTrend,
        },
    ],
};

export default function RepoDashboardProjectStatusSection() {
    const fileMin = Math.min(...fileCountTrend.map(({ value }) => value));
    const fileMax = Math.max(...fileCountTrend.map(({ value }) => value));
    const filePoints = fileCountTrend
        .map(
            ({ value }, index) =>
                `${40 + index * 100},${160 - ((value - fileMin) / (fileMax - fileMin)) * 112}`,
        )
        .join(" ");
    const storageMin = Math.min(...storageTrend.map(({ value }) => value));
    const storageMax = Math.max(...storageTrend.map(({ value }) => value));
    const storagePoints = storageTrend
        .map(
            ({ value }, index) =>
                `${40 + index * 100},${160 - ((value - storageMin) / (storageMax - storageMin)) * 112}`,
        )
        .join(" ");

    return (
        <section
            aria-label="프로젝트 현황"
            className="flex min-w-0 flex-wrap gap-6">
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">언어 구성</h3>
                    <p className="text-sm text-gray-500">
                        저장소 전체 코드를 언어별로 나눈 비중이에요.
                    </p>
                </div>
                <div>
                    <EChartsReact
                        option={languagePieOption}
                        className="h-64 w-full"
                    />
                    <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                        {languages.map((language) => (
                            <li
                                key={language.name}
                                className="flex items-center justify-between gap-3 py-2">
                                <span className="flex items-center gap-2 text-sm">
                                    <span
                                        aria-hidden="true"
                                        className={`size-2.5 rounded-lg ${language.color}`}
                                    />
                                    {language.name}
                                </span>
                                <span className="text-xs text-gray-500">{language.percent}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </article>

            <article className="bg-panel flex w-full min-w-0 flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">전체 파일</h3>
                        <p className="text-sm text-gray-500">{summaryMock.filePeriod}</p>
                    </div>
                    <div className="flex items-start gap-3 text-right">
                        <div className="flex flex-col gap-1">
                            <strong className="text-2xl">{summaryMock.fileCount}</strong>
                            <p className="text-xs text-gray-500">{summaryMock.fileGrowth}</p>
                        </div>
                        <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <FiFile aria-hidden="true" />
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <svg
                        role="img"
                        aria-label="최근 6개월 전체 파일 수 꺾은선 그래프"
                        viewBox="0 0 580 200"
                        className="h-48 w-full min-w-140 text-gray-500">
                        {[48, 104, 160].map((y) => (
                            <line
                                key={y}
                                x1="40"
                                y1={y}
                                x2="540"
                                y2={y}
                                className="stroke-gray-200"
                                strokeWidth="1"
                            />
                        ))}
                        <polyline
                            points={filePoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {fileCountTrend.map(({ month, value }, index) => (
                            <g key={month}>
                                <circle
                                    cx={40 + index * 100}
                                    cy={160 - ((value - fileMin) / (fileMax - fileMin)) * 112}
                                    r="5"
                                    fill="currentColor"
                                />
                                <text
                                    x={40 + index * 100}
                                    y="190"
                                    textAnchor="middle"
                                    className="fill-gray-500 text-xs">
                                    {month}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">발견한 프레임워크</h3>
                <p className="text-sm text-gray-500">
                    설정과 매니페스트 파일을 기준으로 확인했어요.
                </p>
                <ul className="flex flex-wrap gap-2">
                    {frameworks.map((framework) => (
                        <li
                            key={framework}
                            className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                            {framework}
                        </li>
                    ))}
                </ul>
                <p className="text-xs text-gray-500">{summaryMock.frameworkEvidence}</p>
            </article>

            <article className="bg-panel flex w-full min-w-0 flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">Git 저장소 용량</h3>
                        <p className="text-sm text-gray-500">{summaryMock.storagePeriod}</p>
                    </div>
                    <div className="flex items-start gap-3 text-right">
                        <div className="flex flex-col gap-1">
                            <strong className="text-2xl">{summaryMock.storageSize}</strong>
                            <p className="text-xs text-gray-500">{summaryMock.storageGrowth}</p>
                        </div>
                        <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <FiHardDrive aria-hidden="true" />
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <svg
                        role="img"
                        aria-label="최근 6개월 Git 저장소 용량 꺾은선 그래프"
                        viewBox="0 0 580 200"
                        className="h-48 w-full min-w-140 text-gray-500">
                        {[48, 104, 160].map((y) => (
                            <line
                                key={y}
                                x1="40"
                                y1={y}
                                x2="540"
                                y2={y}
                                className="stroke-gray-200"
                                strokeWidth="1"
                            />
                        ))}
                        <polyline
                            points={storagePoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {storageTrend.map(({ month, value }, index) => (
                            <g key={month}>
                                <circle
                                    cx={40 + index * 100}
                                    cy={
                                        160 -
                                        ((value - storageMin) / (storageMax - storageMin)) * 112
                                    }
                                    r="5"
                                    fill="currentColor"
                                />
                                <text
                                    x={40 + index * 100}
                                    y="190"
                                    textAnchor="middle"
                                    className="fill-gray-500 text-xs">
                                    {month}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">파일 구성</h3>
                <p className="text-sm text-gray-500">소스, 테스트, 문서, 설정 파일의 비율이에요.</p>
                <div>
                    <EChartsReact
                        option={fileTypePieOption}
                        className="h-64 w-full"
                    />
                    <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                        {fileTypes.map((fileType) => (
                            <li
                                key={fileType.label}
                                className="flex items-center justify-between gap-3 py-2">
                                <span className="flex items-center gap-2 text-sm">
                                    <span
                                        aria-hidden="true"
                                        className={`size-2.5 rounded-lg ${fileType.color}`}
                                    />
                                    {fileType.label}
                                </span>
                                <span className="text-right text-xs text-gray-500">
                                    {fileType.count} · {fileType.percent}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </article>

            <article className="bg-panel flex w-full min-w-0 flex-col gap-6 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <FiGitPullRequest aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">이슈와 Pull Request</h3>
                        <p className="text-sm text-gray-500">현재 열린 수와 전체 기간 누적</p>
                    </div>
                </div>
                <dl className="flex flex-wrap divide-x divide-gray-300">
                    {issuePrTotals.map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex min-w-32 flex-1 flex-col gap-2 px-4">
                            <dt className="text-xs text-gray-500">{label}</dt>
                            <dd className="text-xl font-bold">{value}</dd>
                        </div>
                    ))}
                </dl>
            </article>

            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <div className="flex items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">커뮤니티 건강도</h3>
                        <p className="text-sm text-gray-500">기본 문서 준비 상태</p>
                    </div>
                    <strong className="text-primary text-2xl">{summaryMock.healthScore}</strong>
                </div>
                <ul className="flex flex-col gap-3">
                    {healthFiles.map((item) => (
                        <li
                            key={item}
                            className="flex items-center gap-3 text-sm">
                            <span className="flex size-5 items-center justify-center rounded-lg bg-gray-500 text-white">
                                <FiCheck
                                    aria-hidden="true"
                                    className="text-xs"
                                />
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">브랜치 현황</h3>
                <p className="text-sm text-gray-500">{summaryMock.activeBranchPeriod}</p>
                <dl className="flex gap-5">
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">전체 브랜치</dt>
                        <dd className="text-2xl font-bold">{summaryMock.branchCount}</dd>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <dt className="text-xs text-gray-500">최근 활성</dt>
                        <dd className="text-2xl font-bold text-gray-500">
                            {summaryMock.activeBranchCount}
                        </dd>
                    </div>
                </dl>
                <div className="flex flex-col gap-2 border-gray-300 pt-4">
                    <p className="text-xs text-gray-500">기본 브랜치</p>
                    <p className="font-semibold">{summaryMock.defaultBranch}</p>
                </div>
                <div className="flex flex-col gap-3 border-gray-300 pt-4">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500">{summaryMock.staleBranchPeriod}</p>
                        <strong>{summaryMock.staleBranchCount}</strong>
                    </div>
                    <ul className="flex flex-col gap-2 text-xs text-gray-500">
                        <li className="flex justify-between gap-2">
                            <span className="truncate">{summaryMock.staleBranchName}</span>
                            <span className="shrink-0">{summaryMock.staleBranchLastCommit}</span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="truncate">{summaryMock.experimentalBranchName}</span>
                            <span className="shrink-0">
                                {summaryMock.experimentalBranchLastCommit}
                            </span>
                        </li>
                    </ul>
                </div>
            </article>

            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">배포 결과</h3>
                <p className="text-sm text-gray-500">{summaryMock.deploymentPeriod}</p>
                <strong className="block text-3xl">{summaryMock.deploymentSuccessRate}</strong>
                <p className="text-sm text-gray-500">{summaryMock.deploymentSuccessDetail}</p>
                <div className="h-3 rounded-lg bg-gray-200">
                    <div
                        className="h-full rounded-lg bg-gray-500"
                        style={{ width: summaryMock.deploymentSuccessRate }}
                    />
                </div>
            </article>

            <article className="bg-panel w-full min-w-0 rounded-lg border border-gray-300 p-6 md:w-full xl:w-full">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">Issue·PR 참여자 추이</h3>
                        <p className="text-sm text-gray-500">
                            월별 고유 참여자 · 작성·댓글·리뷰 기준
                        </p>
                    </div>
                    <span className="text-xs text-gray-500">{summaryMock.contributorPeriod}</span>
                </div>
                <EChartsReact
                    option={participationOption}
                    style={{ height: 270, width: "100%" }}
                />
            </article>

            <article className="bg-panel w-full min-w-0 rounded-lg border border-gray-300 p-6 md:w-full xl:w-full">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">기여자 증가 추이</h3>
                        <p className="text-sm text-gray-500">저장소에 커밋을 남긴 누적 기여자</p>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <strong className="text-xl">{summaryMock.contributorCount}</strong>
                        <p className="text-xs text-gray-500">{summaryMock.contributorGrowth}</p>
                    </div>
                </div>
                <EChartsReact
                    option={contributorGrowthOption}
                    style={{ height: 250, width: "100%" }}
                />
            </article>

            <article className="bg-panel flex w-full min-w-0 flex-col gap-6 rounded-lg border border-gray-300 p-6 md:w-full xl:w-full">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">배포 리듬</h3>
                        <p className="text-sm text-gray-500">
                            {summaryMock.deploymentFrequencyPeriod}
                        </p>
                    </div>
                    <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                        {summaryMock.deploymentFrequency}
                    </span>
                </div>
                <dl className="flex flex-wrap gap-4">
                    {deploymentMetrics.map((item) => (
                        <div
                            key={item.label}
                            className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-4 md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333333%-0.666667rem)]">
                            <dt className="text-xs text-gray-500">{item.label}</dt>
                            <dd className="text-xl font-bold">{item.value}</dd>
                            <p className="text-xs leading-5 text-gray-500">{item.detail}</p>
                        </div>
                    ))}
                </dl>
                <div className="flex flex-col gap-4 border-gray-300 pt-5">
                    <h4 className="text-sm font-semibold">시간대별 배포 비중</h4>
                    <ul className="flex flex-col gap-3">
                        {deploymentHours.map((item) => (
                            <li
                                key={item.label}
                                className="flex items-center gap-3">
                                <span className="w-20 shrink-0 text-xs text-gray-500">
                                    {item.label}
                                </span>
                                <div className="h-3 flex-1 rounded-lg bg-gray-200">
                                    <div
                                        className="h-full rounded-lg bg-gray-500"
                                        style={{ width: `${item.count}%` }}
                                    />
                                </div>
                                <span className="w-10 text-right text-xs font-semibold">
                                    {item.count}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        </section>
    );
}
