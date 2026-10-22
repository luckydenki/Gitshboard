import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";

const issueFlow = [
    { week: "1주", opened: 72, closed: 65 },
    { week: "2주", opened: 83, closed: 71 },
    { week: "3주", opened: 79, closed: 76 },
    { week: "4주", opened: 92, closed: 82 },
] as const;

const issueFlowOption: EChartsOption = {
    color: ["#076BFF", "#9CA3AF"],
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, data: ["신규", "종료"], textStyle: { color: "#6B7280" } },
    grid: { left: 32, right: 12, top: 20, bottom: 48, containLabel: true },
    xAxis: {
        type: "category",
        data: issueFlow.map(({ week }) => week),
        axisLabel: { color: "#6B7280" },
        axisLine: { lineStyle: { color: "#D1D5DB" } },
    },
    yAxis: {
        type: "value",
        min: 0,
        axisLabel: { color: "#6B7280" },
        splitLine: { lineStyle: { color: "#E5E7EB" } },
    },
    series: [
        { name: "신규", type: "bar", data: issueFlow.map(({ opened }) => opened), barMaxWidth: 30 },
        { name: "종료", type: "bar", data: issueFlow.map(({ closed }) => closed), barMaxWidth: 30 },
    ],
};

const issueAge = [
    { label: "7일 이하", count: 126, percent: 15 },
    { label: "8~30일", count: 208, percent: 25 },
    { label: "31~90일", count: 246, percent: 29 },
    { label: "90일 초과", count: 262, percent: 31 },
] as const;

const issueLabels = [
    { label: "bug", count: 312, percent: 37 },
    { label: "feature", count: 224, percent: 27 },
    { label: "documentation", count: 118, percent: 14 },
    { label: "good first issue", count: 24, percent: 3 },
    { label: "기타", count: 164, percent: 19 },
] as const;

const issueTypes = [
    { label: "bug", median: "2일 8시간", width: "35%" },
    { label: "feature", median: "7일 12시간", width: "100%" },
    { label: "documentation", median: "1일 15시간", width: "22%" },
] as const;

const milestones = [
    { name: "React 19.3", closed: 48, total: 60, percent: 80 },
    { name: "Compiler improvements", closed: 29, total: 50, percent: 58 },
    { name: "Documentation", closed: 17, total: 25, percent: 68 },
] as const;

const prSizes = [
    { label: "작음 · 100줄 이하", count: 410, percent: 27 },
    { label: "보통 · 101~500줄", count: 535, percent: 36 },
    { label: "큼 · 501~1,000줄", count: 328, percent: 22 },
    { label: "매우 큼 · 1,000줄 초과", count: 223, percent: 15 },
] as const;

const prMetrics = [
    { label: "Draft PR 비율", value: "17.8%", detail: "열린 PR 214건 중 38건" },
    { label: "변경 요청 후 수정", value: "중앙값 9시간", detail: "수정 커밋이 올라오기까지" },
    { label: "승인 없이 병합", value: "6.3%", detail: "병합된 PR 기준" },
    { label: "코드와 테스트 함께 변경", value: "64%", detail: "코드 변경 PR 기준" },
    { label: "코드와 문서 함께 변경", value: "28%", detail: "코드 변경 PR 기준" },
    { label: "외부 기여자 PR 병합률", value: "72%", detail: "외부 기여자 작성 PR 기준" },
    { label: "봇 PR 비율", value: "19%", detail: "전체 PR 기준" },
    { label: "Dependabot PR 처리", value: "중앙값 1일 8시간", detail: "생성부터 병합·종료까지" },
] as const;

export default function RepoDashboardPullRequestIssueSection() {
    return (
        <section
            aria-label="PR 및 이슈 현황"
            className="flex min-w-0 flex-col gap-6">
            <section
                aria-label="Issue 통계"
                className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[
                        { label: "열린 Issue", value: "842", detail: "현재 해결 대기 중" },
                        { label: "닫힌 Issue", value: "2,934", detail: "전체 기간 누적" },
                        { label: "전체 Issue", value: "3,776", detail: "열린 건 + 닫힌 건" },
                    ].map((item) => (
                        <article
                            key={item.label}
                            className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                            <h3 className="text-sm text-gray-500">{item.label}</h3>
                            <strong className="mt-3 block text-3xl">{item.value}</strong>
                            <p className="mt-2 text-xs text-gray-500">{item.detail}</p>
                        </article>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold">Issue 신규·종료 추이</h3>
                                <p className="mt-1 text-sm text-gray-500">최근 4주 기준</p>
                            </div>
                            <div className="flex gap-5 text-sm">
                                <span>
                                    <strong className="text-primary">326</strong> 신규
                                </span>
                                <span>
                                    <strong>294</strong> 종료
                                </span>
                            </div>
                        </div>
                        <EChartsReact
                            option={issueFlowOption}
                            style={{ height: 260, width: "100%" }}
                        />
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">처리 흐름</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {[
                                {
                                    term: "Issue 해결률",
                                    value: "90.2%",
                                    detail: "최근 4주 종료 ÷ 신규",
                                },
                                { term: "순증감량", value: "+32건", detail: "신규 326 − 종료 294" },
                                {
                                    term: "Issue → PR",
                                    value: "61%",
                                    detail: "최근 4주 신규 Issue 중 PR 연결",
                                },
                            ].map((item) => (
                                <div
                                    key={item.term}
                                    className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <dt className="text-sm font-medium">{item.term}</dt>
                                        <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                                    </div>
                                    <dd className="text-primary text-lg font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">첫 응답까지</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Issue 등록부터 첫 유지관리자 응답
                        </p>
                        <dl className="mt-6 flex gap-5">
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">중앙값</dt>
                                <dd className="mt-2 text-xl font-bold">4시간 18분</dd>
                            </div>
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">90백분위</dt>
                                <dd className="mt-2 text-xl font-bold">1일 6시간</dd>
                            </div>
                        </dl>
                    </article>
                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">종료까지</h3>
                        <p className="mt-1 text-sm text-gray-500">Issue 등록부터 종료</p>
                        <dl className="mt-6 flex gap-5">
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">중앙값</dt>
                                <dd className="mt-2 text-xl font-bold">3일 7시간</dd>
                            </div>
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">90백분위</dt>
                                <dd className="mt-2 text-xl font-bold">24일</dd>
                            </div>
                        </dl>
                    </article>
                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">장기 대기와 재오픈</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            <div className="flex items-center justify-between gap-3 py-3 first:pt-0">
                                <dt className="text-sm text-gray-500">30일 이상 활동 없음</dt>
                                <dd className="text-xl font-bold">126건</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3 py-3 last:pb-0">
                                <dt className="text-sm text-gray-500">재오픈 비율</dt>
                                <dd className="text-xl font-bold">8.1%</dd>
                            </div>
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">열린 Issue 경과일</h3>
                        <ul className="mt-5 flex flex-col gap-4">
                            {issueAge.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="text-gray-500">
                                            {item.count}건 · {item.percent}%
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">라벨별 Issue</h3>
                        <p className="mt-1 text-xs text-gray-500">열린 Issue의 대표 라벨 기준</p>
                        <ul className="mt-5 flex flex-col gap-4">
                            {issueLabels.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="text-gray-500">{item.count}건</span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">유형별 해결 속도</h3>
                        <p className="mt-1 text-xs text-gray-500">종료까지 걸린 시간의 중앙값</p>
                        <ul className="mt-5 flex flex-col gap-4">
                            {issueTypes.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="font-semibold">{item.median}</span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: item.width }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">마일스톤 진행률</h3>
                        <ul className="mt-5 flex flex-col gap-5">
                            {milestones.map((item) => (
                                <li
                                    key={item.name}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.name}</span>
                                        <span className="text-gray-500">
                                            {item.closed}/{item.total}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">참여 가능한 Issue</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {[
                                {
                                    term: "담당자 없음",
                                    value: "218건",
                                    detail: "열린 Issue의 25.9%",
                                },
                                {
                                    term: "good first issue",
                                    value: "24건",
                                    detail: "신규 기여자용 라벨",
                                },
                            ].map((item) => (
                                <div
                                    key={item.term}
                                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                    <div>
                                        <dt className="text-sm font-medium">{item.term}</dt>
                                        <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                                    </div>
                                    <dd className="text-lg font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">댓글 수 분포</h3>
                        <p className="mt-1 text-xs text-gray-500">Issue당 댓글</p>
                        <ul className="mt-5 flex flex-col gap-3">
                            {[
                                { label: "0개", value: "22%", width: "22%" },
                                { label: "1~3개", value: "43%", width: "43%" },
                                { label: "4~9개", value: "25%", width: "25%" },
                                { label: "10개 이상", value: "10%", width: "10%" },
                            ].map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{item.label}</span>
                                        <span>{item.value}</span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: item.width }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">토론이 활발한 Issue</h3>
                        <ol className="mt-5 flex flex-col divide-y divide-gray-300">
                            {[
                                {
                                    title: "Suspense boundary behavior in concurrent updates",
                                    number: "#34860",
                                    comments: 48,
                                },
                                {
                                    title: "Server Actions error handling proposal",
                                    number: "#34782",
                                    comments: 36,
                                },
                                {
                                    title: "Improve hydration warning details",
                                    number: "#34691",
                                    comments: 29,
                                },
                            ].map((item) => (
                                <li
                                    key={item.number}
                                    className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                    <span className="min-w-0 text-sm font-medium break-words">
                                        {item.title}
                                        <span className="ml-2 text-xs text-gray-500">
                                            {item.number}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-xs text-gray-500">
                                        댓글 {item.comments}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <h3 className="text-lg font-bold">Issue 종료 사유</h3>
                        <p className="mt-1 text-xs text-gray-500">최근 종료된 Issue의 분류</p>
                        <div
                            className="mt-5 flex h-4 overflow-hidden rounded-lg bg-gray-200"
                            aria-label="수정 완료 72%, 중복 15%, 무효 8%, 재현 불가 5%">
                            <span className="bg-primary w-[72%]" />
                            <span className="bg-primary/70 w-[15%]" />
                            <span className="bg-primary/40 w-[8%]" />
                            <span className="w-[5%] bg-gray-300" />
                        </div>
                        <dl className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {[
                                { term: "수정 완료", value: "72%" },
                                { term: "중복", value: "15%" },
                                { term: "무효", value: "8%" },
                                { term: "재현 불가", value: "5%" },
                            ].map((item) => (
                                <div key={item.term}>
                                    <dt className="text-xs text-gray-500">{item.term}</dt>
                                    <dd className="mt-1 font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>
                </div>
            </section>

            <section
                aria-label="Pull Request 통계"
                className="flex flex-col gap-6 border-t-1 border-gray-300 pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[
                        { label: "열린 PR", value: "214", detail: "현재 리뷰·수정 진행 중" },
                        { label: "병합된 PR", value: "1,086", detail: "전체 기간 누적" },
                        { label: "병합 없이 닫힌 PR", value: "196", detail: "거절·중단 포함" },
                    ].map((item) => (
                        <article
                            key={item.label}
                            className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                            <h3 className="text-sm text-gray-500">{item.label}</h3>
                            <strong className="mt-3 block text-3xl">{item.value}</strong>
                            <p className="mt-2 text-xs text-gray-500">{item.detail}</p>
                        </article>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">PR 처리 결과</h3>
                        <p className="mt-1 text-xs text-gray-500">결과가 결정된 PR 1,282건 기준</p>
                        <div
                            className="mt-6 flex h-4 overflow-hidden rounded-lg bg-gray-200"
                            aria-label="병합 84.7%, 거절·중단 15.3%">
                            <span className="bg-primary w-[84.7%]" />
                            <span className="w-[15.3%] bg-gray-400" />
                        </div>
                        <dl className="mt-5 flex justify-between gap-4">
                            <div>
                                <dt className="text-xs text-gray-500">병합률</dt>
                                <dd className="mt-1 text-xl font-bold">84.7%</dd>
                            </div>
                            <div className="text-right">
                                <dt className="text-xs text-gray-500">거절·중단</dt>
                                <dd className="mt-1 text-xl font-bold">15.3%</dd>
                            </div>
                        </dl>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">첫 리뷰까지</h3>
                        <p className="mt-1 text-sm text-gray-500">PR 생성부터 첫 리뷰</p>
                        <strong className="mt-6 block text-2xl">6시간 42분</strong>
                        <p className="mt-2 text-xs text-gray-500">중앙값</p>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">병합까지</h3>
                        <p className="mt-1 text-sm text-gray-500">PR 생성부터 병합</p>
                        <dl className="mt-6 flex gap-5">
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">중앙값</dt>
                                <dd className="mt-2 text-xl font-bold">2일 11시간</dd>
                            </div>
                            <div className="flex-1">
                                <dt className="text-xs text-gray-500">90백분위</dt>
                                <dd className="mt-2 text-xl font-bold">14일 6시간</dd>
                            </div>
                        </dl>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <h3 className="text-lg font-bold">PR 생성 후 리뷰·병합 흐름</h3>
                        <p className="mt-1 text-sm text-gray-500">중앙값 기준 누적 소요 시간</p>
                        <ol className="mt-6 flex items-stretch gap-3 not-sm:flex-col">
                            {[
                                { label: "PR 생성", value: "0시간" },
                                { label: "첫 리뷰", value: "6시간 42분" },
                                { label: "병합", value: "2일 11시간" },
                            ].map((item, index) => (
                                <li
                                    key={item.label}
                                    className="bg-primary/10 flex min-w-0 flex-1 flex-col gap-2 rounded-lg p-4">
                                    <span className="text-primary text-xs">0{index + 1}</span>
                                    <span className="text-sm font-semibold">{item.label}</span>
                                    <strong>{item.value}</strong>
                                </li>
                            ))}
                        </ol>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">PR당 협업 규모</h3>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {[
                                { term: "리뷰", value: "평균 2.8회" },
                                { term: "댓글", value: "평균 5.4개" },
                                { term: "참여자", value: "평균 3.2명" },
                            ].map((item) => (
                                <div
                                    key={item.term}
                                    className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                    <dt className="text-sm text-gray-500">{item.term}</dt>
                                    <dd className="text-sm font-bold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold">PR 크기 분포</h3>
                                <p className="mt-1 text-sm text-gray-500">변경한 코드 줄 수 기준</p>
                            </div>
                            <span className="text-sm font-semibold">평균 변경 파일 8.4개</span>
                        </div>
                        <ul className="mt-6 flex flex-col gap-4">
                            {prSizes.map((item) => (
                                <li
                                    key={item.label}
                                    className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span>{item.label}</span>
                                        <span className="text-gray-500">
                                            {item.count}건 · {item.percent}%
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-lg bg-gray-200">
                                        <div
                                            className="bg-primary h-full rounded-lg"
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">크기별 병합 속도</h3>
                        <p className="mt-1 text-xs text-gray-500">생성부터 병합까지 중앙값</p>
                        <dl className="mt-6 flex flex-col gap-5">
                            <div>
                                <dt className="text-sm text-gray-500">작은 PR · 100줄 이하</dt>
                                <dd className="mt-1 text-xl font-bold">1일 4시간</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">큰 PR · 501줄 이상</dt>
                                <dd className="mt-1 text-xl font-bold">5일 8시간</dd>
                            </div>
                        </dl>
                    </article>

                    <div className="grid min-w-0 grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
                        {prMetrics.map((item) => (
                            <article
                                key={item.label}
                                className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                                <h3 className="text-sm text-gray-500">{item.label}</h3>
                                <strong className="mt-3 block text-xl">{item.value}</strong>
                                <p className="mt-2 text-xs leading-5 text-gray-500">
                                    {item.detail}
                                </p>
                            </article>
                        ))}
                    </div>

                    <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                        <h3 className="text-lg font-bold">병합 방식</h3>
                        <p className="mt-1 text-xs text-gray-500">병합된 PR 기준</p>
                        <div
                            className="mt-5 flex h-4 overflow-hidden rounded-lg bg-gray-200"
                            aria-label="squash 72%, merge 21%, rebase 7%">
                            <span className="bg-primary w-[72%]" />
                            <span className="bg-primary/60 w-[21%]" />
                            <span className="w-[7%] bg-gray-300" />
                        </div>
                        <dl className="mt-5 flex flex-col divide-y divide-gray-300">
                            {[
                                { term: "Squash", value: "72%" },
                                { term: "Merge", value: "21%" },
                                { term: "Rebase", value: "7%" },
                            ].map((item) => (
                                <div
                                    key={item.term}
                                    className="flex justify-between py-2">
                                    <dt className="text-sm text-gray-500">{item.term}</dt>
                                    <dd className="text-sm font-semibold">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                        <h3 className="text-lg font-bold">Issue와 연결된 PR</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            개발 결과가 Issue 해결로 이어진 정도예요.
                        </p>
                        <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm text-gray-500">Issue를 연결한 PR</dt>
                                <dd className="mt-2 text-2xl font-bold">617건</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">
                                    병합으로 자동 종료된 Issue
                                </dt>
                                <dd className="mt-2 text-2xl font-bold">493건</dd>
                            </div>
                        </dl>
                    </article>
                </div>
            </section>
        </section>
    );
}
