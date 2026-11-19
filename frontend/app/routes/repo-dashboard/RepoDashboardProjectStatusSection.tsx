import EChartsReact from "echarts-for-react";
import { FiCheck, FiFile, FiGitPullRequest, FiHardDrive } from "react-icons/fi";
import { useParams } from "react-router";
import {
    useRepoDashboardProjectBranches,
    useRepoDashboardProjectDeployments,
    useRepoDashboardProjectFiles,
    useRepoDashboardProjectHistory,
    useRepoDashboardProjectOverview,
    useRepoDashboardProjectParticipation,
} from "~/hooks/api/useRepoDashboardProjectStatus";

import {
    chartColors,
    fileTypeLabels,
    formatAttemptsPerWeek,
    formatCount,
    formatDate,
    formatMonth,
    formatPercent,
    formatSize,
    getDeploymentHourBars,
    getDeploymentMetrics,
    getProjectChartData,
    getProjectIssuePrTotals,
    makeLineOption,
    makeParticipationOption,
    makePieOption,
} from "~/utils/page/repo-project-status";

function QueryNotice({
    loading,
    error,
    emptyMessage,
}: {
    loading: boolean;
    error: boolean;
    emptyMessage: string;
}) {
    if (loading) return <p className="text-sm text-gray-500">불러오는 중입니다.</p>;
    if (error) return <p className="text-sm text-gray-500">정보를 불러오지 못했습니다.</p>;
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
}

export default function RepoDashboardProjectStatusSection() {
    const { owner, repo } = useParams();
    const overviewQuery = useRepoDashboardProjectOverview(owner, repo);
    const filesQuery = useRepoDashboardProjectFiles(owner, repo);
    const branchesQuery = useRepoDashboardProjectBranches(owner, repo);
    const historyQuery = useRepoDashboardProjectHistory(owner, repo);
    const participationQuery = useRepoDashboardProjectParticipation(owner, repo);
    const deploymentsQuery = useRepoDashboardProjectDeployments(owner, repo);
    const overview = overviewQuery.data;
    const files = filesQuery.data;
    const branches = branchesQuery.data;
    const history = historyQuery.data;
    const participation = participationQuery.data;
    const deployments = deploymentsQuery.data;
    const {
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
    } = getProjectChartData({ overview, files, history, participation });

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
                {languageData.length > 0 ? (
                    <div>
                        <EChartsReact
                            option={makePieOption("언어 구성", languageData)}
                            className="h-64 w-full"
                        />
                        <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                            {overview?.languages.map(({ name, sharePercent }, index) => (
                                <li
                                    key={name}
                                    className="flex items-center justify-between gap-3 py-2">
                                    <span className="flex items-center gap-2 text-sm">
                                        <span
                                            aria-hidden="true"
                                            className="size-2.5 rounded-lg"
                                            style={{
                                                backgroundColor:
                                                    chartColors[index % chartColors.length],
                                            }}
                                        />
                                        {name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatPercent(sharePercent)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <QueryNotice
                        loading={overviewQuery.isLoading}
                        error={overviewQuery.isError}
                        emptyMessage="언어 정보가 없습니다."
                    />
                )}
            </article>
            <article className="bg-panel flex w-full min-w-0 flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">전체 파일</h3>
                        <p className="text-sm text-gray-500">수집된 월별 파일 수 변화</p>
                    </div>
                    <div className="flex items-start gap-3 text-right">
                        <strong className="text-2xl">{formatCount(files?.fileCount)}</strong>
                        <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <FiFile aria-hidden="true" />
                        </span>
                    </div>
                </div>
                {hasFileHistory ? (
                    <EChartsReact
                        option={makeLineOption(fileHistory, "전체 파일")}
                        style={{ height: 200, width: "100%" }}
                    />
                ) : (
                    <QueryNotice
                        loading={historyQuery.isLoading || filesQuery.isLoading}
                        error={historyQuery.isError || filesQuery.isError}
                        emptyMessage="수집된 파일 이력이 없습니다."
                    />
                )}
                {files?.partial || Boolean(history?.coverage.missingFileCountMonths.length) ? (
                    <p className="text-xs text-gray-500">
                        일부 파일 데이터가 아직 수집되지 않았습니다.
                    </p>
                ) : null}
            </article>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">발견한 프레임워크</h3>
                <p className="text-sm text-gray-500">
                    설정과 매니페스트 파일을 기준으로 확인했어요.
                </p>
                {files?.frameworks.length ? (
                    <ul className="flex flex-wrap gap-2">
                        {files.frameworks.map(({ name, paths }) => (
                            <li
                                key={name}
                                title={paths.join(", ")}
                                className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                                {name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <QueryNotice
                        loading={filesQuery.isLoading}
                        error={filesQuery.isError}
                        emptyMessage="발견한 프레임워크가 없습니다."
                    />
                )}
            </article>
            <article className="bg-panel flex w-full min-w-0 flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">Git 저장소 용량</h3>
                        <p className="text-sm text-gray-500">수집된 월별 디스크 사용량</p>
                    </div>
                    <div className="flex items-start gap-3 text-right">
                        <strong className="text-2xl">{formatSize(overview?.diskUsageKb)}</strong>
                        <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <FiHardDrive aria-hidden="true" />
                        </span>
                    </div>
                </div>
                {hasStorageHistory ? (
                    <EChartsReact
                        option={makeLineOption(storageHistory, "Git 저장소 용량")}
                        style={{ height: 200, width: "100%" }}
                    />
                ) : (
                    <QueryNotice
                        loading={historyQuery.isLoading || overviewQuery.isLoading}
                        error={historyQuery.isError || overviewQuery.isError}
                        emptyMessage="수집된 용량 이력이 없습니다."
                    />
                )}
                {Boolean(history?.coverage.unobservedDiskUsageMonths.length) ? (
                    <p className="text-xs text-gray-500">일부 월의 용량 정보가 없습니다.</p>
                ) : null}
            </article>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">파일 구성</h3>
                <p className="text-sm text-gray-500">소스, 테스트, 문서, 설정 파일의 비율이에요.</p>
                {fileTypeData.length > 0 ? (
                    <div>
                        {files?.fileCount === null ? (
                            <p className="text-sm text-gray-500">전체 파일을 확인하지 못해 비율을 표시할 수 없습니다.</p>
                        ) : (
                            <EChartsReact
                                option={makePieOption("파일 구성", fileTypeData)}
                                className="h-64 w-full"
                            />
                        )}
                        <ul className="flex min-w-0 flex-col divide-y divide-gray-300">
                            {files?.fileTypes.map(({ type, count, sharePercent }, index) => (
                                <li
                                    key={type}
                                    className="flex items-center justify-between gap-3 py-2">
                                    <span className="flex items-center gap-2 text-sm">
                                        <span
                                            aria-hidden="true"
                                            className="size-2.5 rounded-lg"
                                            style={{ backgroundColor: chartColors[index] }}
                                        />
                                        {fileTypeLabels[type]}
                                    </span>
                                    <span className="text-right text-xs text-gray-500">
                                        {formatCount(count)} ·{" "}
                                        {formatPercent(sharePercent)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <QueryNotice
                        loading={filesQuery.isLoading}
                        error={filesQuery.isError}
                        emptyMessage="분류한 파일이 없습니다."
                    />
                )}
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
                {overview ? (
                    <dl className="flex flex-wrap divide-x divide-gray-300">
                        {getProjectIssuePrTotals(overview).map(([label, value]) => (
                            <div
                                key={String(label)}
                                className="flex min-w-32 flex-1 flex-col gap-2 px-4">
                                <dt className="text-xs text-gray-500">{label}</dt>
                                <dd className="text-xl font-bold">
                                    {formatCount(value)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                ) : (
                    <QueryNotice
                        loading={overviewQuery.isLoading}
                        error={overviewQuery.isError}
                        emptyMessage="이슈와 PR 정보가 없습니다."
                    />
                )}
            </article>
            <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <div className="flex items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">커뮤니티 건강도</h3>
                        <p className="text-sm text-gray-500">기본 문서 준비 상태</p>
                    </div>
                    <strong className="text-primary text-2xl">
                        {files
                            ? `${files.healthScore.present}/${files.healthScore.total}`
                            : "-"}
                    </strong>
                </div>
                {files?.health.length ? (
                    <ul className="flex flex-col gap-3">
                        {files.health.map(({ name, present }) => (
                            <li
                                key={name}
                                className="flex items-center gap-3 text-sm">
                                <span
                                    className={`flex size-5 items-center justify-center rounded-lg ${present ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                                    {present ? (
                                        <FiCheck
                                            aria-label="준비됨"
                                            className="text-xs"
                                        />
                                    ) : (
                                        "-"
                                    )}
                                </span>
                                {name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <QueryNotice
                        loading={filesQuery.isLoading}
                        error={filesQuery.isError}
                        emptyMessage="확인할 건강도 파일이 없습니다."
                    />
                )}
            </article>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">브랜치 현황</h3>
                <p className="text-sm text-gray-500">최근 활성 및 오래된 브랜치 현황</p>
                {branches ? (
                    <>
                        <dl className="flex gap-5">
                            <div className="flex flex-1 flex-col gap-2">
                                <dt className="text-xs text-gray-500">전체 브랜치</dt>
                                <dd className="text-2xl font-bold">
                                    {formatCount(branches.total)}
                                </dd>
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <dt className="text-xs text-gray-500">최근 활성</dt>
                                <dd className="text-2xl font-bold text-gray-500">
                                    {formatCount(branches.active)}
                                </dd>
                            </div>
                        </dl>
                        <div className="flex flex-col gap-2 pt-4">
                            <p className="text-xs text-gray-500">기본 브랜치</p>
                            <p className="font-semibold">{branches.defaultBranch ?? "정보 없음"}</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-500">오래된 브랜치</p>
                                <strong>{formatCount(branches.stale)}</strong>
                            </div>
                            {branches.oldest.length > 0 ? (
                                <ul className="flex flex-col gap-2 text-xs text-gray-500">
                                    {branches.oldest.map(({ name, committedAt }) => (
                                        <li
                                            key={`${name}-${committedAt}`}
                                            className="flex justify-between gap-2">
                                            <span className="truncate">{name}</span>
                                            <span className="shrink-0">
                                                {formatDate(committedAt)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-500">오래된 브랜치가 없습니다.</p>
                            )}
                        </div>
                        {branches.partial ? (
                            <p className="text-xs text-gray-500">
                                일부 브랜치 정보가 아직 수집되지 않았습니다.
                            </p>
                        ) : null}
                    </>
                ) : (
                    <QueryNotice
                        loading={branchesQuery.isLoading}
                        error={branchesQuery.isError}
                        emptyMessage="브랜치 정보가 없습니다."
                    />
                )}
            </article>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">배포 결과</h3>
                <p className="text-sm text-gray-500">수집된 배포 기록 기준</p>
                {deployments ? (
                    deployments.attempts === 0 ? (
                        <p className="text-sm text-gray-500">배포 기록이 없습니다.</p>
                    ) : (
                        <>
                            <strong className="block text-3xl">
                                {formatPercent(deployments.successRatePercent)}
                            </strong>
                            <p className="text-sm text-gray-500">
                                완료된 배포 {formatCount(deployments.completed)}회 중{" "}
                                {formatCount(deployments.successful)}회 성공
                            </p>
                            <div className="h-3 rounded-lg bg-gray-200">
                                <div
                                    className="h-full rounded-lg bg-gray-500"
                                    style={{ width: `${deployments.successRatePercent ?? 0}%` }}
                                />
                            </div>
                            {deployments.partial ? (
                                <p className="text-xs text-gray-500">
                                    일부 배포 기록이 제외되었습니다.
                                </p>
                            ) : null}
                        </>
                    )
                ) : (
                    <QueryNotice
                        loading={deploymentsQuery.isLoading}
                        error={deploymentsQuery.isError}
                        emptyMessage="배포 기록이 없습니다."
                    />
                )}
            </article>
            <article className="bg-panel w-full min-w-0 rounded-lg border border-gray-300 p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">Issue·PR 참여자 추이</h3>
                        <p className="text-sm text-gray-500">월별 고유 작성자 기준</p>
                    </div>
                </div>
                {hasParticipationHistory ? (
                    <EChartsReact
                        option={makeParticipationOption(participationHistory)}
                        style={{ height: 270, width: "100%" }}
                    />
                ) : (
                    <QueryNotice
                        loading={participationQuery.isLoading}
                        error={participationQuery.isError}
                        emptyMessage="수집된 참여자 이력이 없습니다."
                    />
                )}
                {participation?.partial ? (
                    <p className="text-xs text-gray-500">일부 월의 참여자 정보가 없습니다.</p>
                ) : null}
            </article>
            <article className="bg-panel w-full min-w-0 rounded-lg border border-gray-300 p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">기여자 증가 추이</h3>
                        <p className="text-sm text-gray-500">저장소에 커밋을 남긴 누적 기여자</p>
                    </div>
                    <strong className="text-xl">
                        {participation?.latestContributorMonth
                            ? `${formatCount(participation.latestContributorCount)}명 · ${formatMonth(participation.latestContributorMonth)}`
                            : "정보 없음"}
                    </strong>
                </div>
                {hasContributorHistory ? (
                    <EChartsReact
                        option={makeLineOption(contributorHistory, "누적 기여자")}
                        style={{ height: 250, width: "100%" }}
                    />
                ) : (
                    <QueryNotice
                        loading={participationQuery.isLoading}
                        error={participationQuery.isError}
                        emptyMessage="수집된 기여자 이력이 없습니다."
                    />
                )}
            </article>
            <article className="bg-panel flex w-full min-w-0 flex-col gap-6 rounded-lg border border-gray-300 p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">배포 리듬</h3>
                        <p className="text-sm text-gray-500">
                            수집된 배포 기록의 소요 시간과 시간대예요.
                        </p>
                    </div>
                    <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                        {deployments?.attempts
                            ? formatAttemptsPerWeek(deployments)
                            : "배포 기록 없음"}
                    </span>
                </div>
                {deployments?.attempts ? (
                    <>
                        <dl className="flex flex-wrap gap-4">
                            {getDeploymentMetrics(deployments).map(([label, value, detail]) => (
                                <div
                                    key={label}
                                    className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-4 md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333333%-0.666667rem)]">
                                    <dt className="text-xs text-gray-500">{label}</dt>
                                    <dd className="text-xl font-bold">{value}</dd>
                                    <p className="text-xs leading-5 text-gray-500">{detail}</p>
                                </div>
                            ))}
                        </dl>
                        <div className="flex flex-col gap-4 pt-5">
                            <h4 className="text-sm font-semibold">시간대별 배포 비중</h4>
                            {deployments.hourBuckets.length > 0 ? (
                                <ul className="flex flex-col gap-3">
                                    {getDeploymentHourBars(deployments).map(({ hour, count, label, width }) => (
                                        <li
                                            key={hour}
                                            className="flex items-center gap-3">
                                            <span className="w-20 shrink-0 text-xs text-gray-500">
                                                {label}
                                            </span>
                                            <div className="h-3 flex-1 rounded-lg bg-gray-200">
                                                <div
                                                    className="h-full rounded-lg bg-gray-500"
                                                    style={{
                                                        width,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-10 text-right text-xs font-semibold">
                                                {formatCount(count)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    시간대별 배포 기록이 없습니다.
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <QueryNotice
                        loading={deploymentsQuery.isLoading}
                        error={deploymentsQuery.isError}
                        emptyMessage="배포 리듬 정보가 없습니다."
                    />
                )}
            </article>
        </section>
    );
}
