import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import { FiCheck, FiFile, FiGitPullRequest, FiHardDrive } from "react-icons/fi";

const languages = [
    { name: "JavaScript", percent: 63.4, color: "bg-primary" },
    { name: "TypeScript", percent: 28.1, color: "bg-primary/70" },
    { name: "CSS", percent: 5.7, color: "bg-primary/40" },
    { name: "기타", percent: 2.8, color: "bg-gray-300" },
] as const;

const fileTypes = [
    { label: "소스", count: "8,940", percent: 68, color: "bg-primary" },
    { label: "테스트", count: "2,104", percent: 16, color: "bg-primary/70" },
    { label: "문서", count: "1,183", percent: 9, color: "bg-primary/40" },
    { label: "설정", count: "918", percent: 7, color: "bg-gray-300" },
] as const;

const chartColors = ["#076BFF", "#4D94FF", "#8BBAFF", "#D1D5DB"];

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
                borderWidth: 2,
            },
            data: languages.map(({ name, percent }) => ({ name, value: percent })),
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
                borderWidth: 2,
            },
            data: fileTypes.map(({ label, percent }) => ({ name: label, value: percent })),
        },
    ],
};

const fileCountTrend = [
    { month: "5월", value: 12_582 },
    { month: "6월", value: 12_694 },
    { month: "7월", value: 12_771 },
    { month: "8월", value: 12_918 },
    { month: "9월", value: 13_036 },
    { month: "10월", value: 13_145 },
] as const;

const storageTrend = [
    { month: "5월", value: 250 },
    { month: "6월", value: 256 },
    { month: "7월", value: 263 },
    { month: "8월", value: 269 },
    { month: "9월", value: 277 },
    { month: "10월", value: 284 },
] as const;

const growthMonths = ["5월", "6월", "7월", "8월", "9월", "10월"];

const participationOption: EChartsOption = {
    color: ["#076BFF", "#9CA3AF"],
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, data: ["Issue 참여자", "PR 참여자"], textStyle: { color: "#6B7280" } },
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
            data: [174, 189, 198, 212, 237, 264],
        },
        {
            name: "PR 참여자",
            type: "line",
            smooth: true,
            symbolSize: 8,
            data: [126, 139, 147, 168, 181, 198],
        },
    ],
};

const contributorGrowthOption: EChartsOption = {
    color: ["#076BFF"],
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
            data: [1532, 1594, 1648, 1716, 1781, 1842],
        },
    ],
};

const deploymentHours = [
    { label: "00~06시", count: 4 },
    { label: "06~12시", count: 12 },
    { label: "12~18시", count: 58 },
    { label: "18~24시", count: 26 },
] as const;

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
            className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <div>
                    <h3 className="text-lg font-bold">언어 구성</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        저장소 전체 코드를 언어별로 나눈 비중이에요.
                    </p>
                </div>
                <div className="mt-4">
                    <EChartsReact
                        option={languagePieOption}
                        className="h-64 w-full"
                    />
                    <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                        {languages.map((language) => (
                            <li
                                key={language.name}
                                className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
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

            <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold">전체 파일</h3>
                        <p className="mt-1 text-sm text-gray-500">최근 6개월 파일 수 변화</p>
                    </div>
                    <div className="flex items-start gap-3 text-right">
                        <div>
                            <strong className="text-2xl">13,145</strong>
                            <p className="text-primary mt-1 text-xs">6개월간 +563</p>
                        </div>
                        <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                            <FiFile aria-hidden="true" />
                        </span>
                    </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                    <svg
                        role="img"
                        aria-label="최근 6개월 전체 파일 수 꺾은선 그래프"
                        viewBox="0 0 580 200"
                        className="text-primary h-48 w-full min-w-[560px]">
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
                                    className="fill-gray-500 text-[12px]">
                                    {month}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </article>

            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <h3 className="text-lg font-bold">발견한 프레임워크</h3>
                <p className="mt-1 text-sm text-gray-500">
                    설정과 매니페스트 파일을 기준으로 확인했어요.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                    {["React", "Rollup", "Babel", "Jest", "ESLint", "Yarn"].map((framework) => (
                        <li
                            key={framework}
                            className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-semibold">
                            {framework}
                        </li>
                    ))}
                </ul>
                <p className="mt-5 text-xs text-gray-500">
                    package.json, rollup.config.js 외 8개 설정 파일 분석
                </p>
            </article>

            <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold">Git 저장소 용량</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            서비스가 수집한 최근 6개월 디스크 사용량
                        </p>
                    </div>
                    <div className="flex items-start gap-3 text-right">
                        <div>
                            <strong className="text-2xl">284 MB</strong>
                            <p className="text-primary mt-1 text-xs">6개월간 +34 MB</p>
                        </div>
                        <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                            <FiHardDrive aria-hidden="true" />
                        </span>
                    </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                    <svg
                        role="img"
                        aria-label="최근 6개월 Git 저장소 용량 꺾은선 그래프"
                        viewBox="0 0 580 200"
                        className="text-primary h-48 w-full min-w-[560px]">
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
                                    className="fill-gray-500 text-[12px]">
                                    {month}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </article>

            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <h3 className="text-lg font-bold">파일 구성</h3>
                <p className="mt-1 text-sm text-gray-500">
                    소스, 테스트, 문서, 설정 파일의 비율이에요.
                </p>
                <div className="mt-4">
                    <EChartsReact
                        option={fileTypePieOption}
                        className="h-64 w-full"
                    />
                    <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                        {fileTypes.map((fileType) => (
                            <li
                                key={fileType.label}
                                className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
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

            <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                        <FiGitPullRequest aria-hidden="true" />
                    </span>
                    <div>
                        <h3 className="text-lg font-bold">이슈와 Pull Request</h3>
                        <p className="mt-1 text-sm text-gray-500">현재 열린 수와 전체 기간 누적</p>
                    </div>
                </div>
                <dl className="mt-6 flex flex-wrap divide-x divide-gray-300">
                    {[
                        { label: "열린 Issue", value: "842" },
                        { label: "종료된 Issue", value: "2,934" },
                        { label: "열린 PR", value: "214" },
                        { label: "병합된 PR", value: "1,086" },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="min-w-32 flex-1 px-4 first:pl-0 last:pr-0">
                            <dt className="text-xs text-gray-500">{label}</dt>
                            <dd className="mt-2 text-xl font-bold">{value}</dd>
                        </div>
                    ))}
                </dl>
            </article>

            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold">커뮤니티 건강도</h3>
                        <p className="mt-1 text-sm text-gray-500">기본 문서 준비 상태</p>
                    </div>
                    <strong className="text-primary text-2xl">5/5</strong>
                </div>
                <ul className="mt-5 flex flex-col gap-3">
                    {["README", "LICENSE", "CONTRIBUTING", "CODE_OF_CONDUCT", "SECURITY"].map(
                        (item) => (
                            <li
                                key={item}
                                className="flex items-center gap-3 text-sm">
                                <span className="bg-primary flex size-5 items-center justify-center rounded-lg text-white">
                                    <FiCheck
                                        aria-hidden="true"
                                        className="text-xs"
                                    />
                                </span>
                                {item}
                            </li>
                        ),
                    )}
                </ul>
            </article>

            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <h3 className="text-lg font-bold">브랜치 현황</h3>
                <p className="mt-1 text-sm text-gray-500">최근 30일 커밋 기준 활성 브랜치</p>
                <dl className="mt-6 flex gap-5">
                    <div className="flex-1">
                        <dt className="text-xs text-gray-500">전체 브랜치</dt>
                        <dd className="mt-2 text-2xl font-bold">238개</dd>
                    </div>
                    <div className="flex-1">
                        <dt className="text-xs text-gray-500">최근 활성</dt>
                        <dd className="text-primary mt-2 text-2xl font-bold">42개</dd>
                    </div>
                </dl>
                <div className="mt-6 border-t-1 border-gray-300 pt-4">
                    <p className="text-xs text-gray-500">기본 브랜치</p>
                    <p className="mt-2 font-semibold">main</p>
                </div>
                <div className="mt-5 border-t-1 border-gray-300 pt-4">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500">180일 이상 변경 없는 브랜치</p>
                        <strong>19개</strong>
                    </div>
                    <ul className="mt-3 flex flex-col gap-2 text-xs text-gray-500">
                        <li className="flex justify-between gap-2">
                            <span className="truncate">legacy/server-rendering</span>
                            <span className="shrink-0">248일 전</span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="truncate">experiment/cache</span>
                            <span className="shrink-0">213일 전</span>
                        </li>
                    </ul>
                </div>
            </article>

            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <h3 className="text-lg font-bold">배포 결과</h3>
                <p className="mt-1 text-sm text-gray-500">최근 90일 production 배포</p>
                <strong className="mt-6 block text-3xl">98.4%</strong>
                <p className="mt-2 text-sm text-gray-500">배포 성공률 · 124회 중 122회 성공</p>
                <div className="mt-5 h-3 rounded-lg bg-gray-200">
                    <div className="bg-primary h-full w-[98.4%] rounded-lg" />
                </div>
            </article>

            <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2 xl:col-span-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold">Issue·PR 참여자 추이</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            월별 고유 참여자 · 작성·댓글·리뷰 기준
                        </p>
                    </div>
                    <span className="text-xs text-gray-500">최근 6개월</span>
                </div>
                <EChartsReact
                    option={participationOption}
                    style={{ height: 270, width: "100%" }}
                />
            </article>

            <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2 xl:col-span-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold">기여자 증가 추이</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            저장소에 커밋을 남긴 누적 기여자
                        </p>
                    </div>
                    <div className="text-right">
                        <strong className="text-xl">1,842명</strong>
                        <p className="text-primary mt-1 text-xs">6개월간 +310명</p>
                    </div>
                </div>
                <EChartsReact
                    option={contributorGrowthOption}
                    style={{ height: 250, width: "100%" }}
                />
            </article>

            <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2 xl:col-span-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold">배포 리듬</h3>
                        <p className="mt-1 text-sm text-gray-500">최근 90일 production 배포 기준</p>
                    </div>
                    <span className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-semibold">
                        주 평균 9.6회
                    </span>
                </div>
                <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[
                        {
                            label: "배포 소요 시간",
                            value: "8분 42초",
                            detail: "시작부터 완료까지 중앙값",
                        },
                        {
                            label: "커밋 → 배포",
                            value: "2시간 16분",
                            detail: "main 반영부터 production까지 중앙값",
                        },
                        {
                            label: "가장 활발한 배포 시간",
                            value: "목요일 16시",
                            detail: "최근 배포 기록 기준",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-lg border-1 border-gray-300 p-4">
                            <dt className="text-xs text-gray-500">{item.label}</dt>
                            <dd className="mt-2 text-xl font-bold">{item.value}</dd>
                            <p className="mt-2 text-xs leading-5 text-gray-500">{item.detail}</p>
                        </div>
                    ))}
                </dl>
                <div className="mt-6 border-t-1 border-gray-300 pt-5">
                    <h4 className="text-sm font-semibold">시간대별 배포 비중</h4>
                    <ul className="mt-4 flex flex-col gap-3">
                        {deploymentHours.map((item) => (
                            <li
                                key={item.label}
                                className="flex items-center gap-3">
                                <span className="w-20 shrink-0 text-xs text-gray-500">
                                    {item.label}
                                </span>
                                <div className="h-3 flex-1 rounded-lg bg-gray-200">
                                    <div
                                        className="bg-primary h-full rounded-lg"
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
