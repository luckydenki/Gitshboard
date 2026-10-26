import {
    contributorsMock as contributors,
    contributorMetricsMock as contributorMetrics,
    issueReadinessMock as issueReadiness,
    discussionCategoriesMock as discussionCategories,
    popularDiscussionsMock as popularDiscussions,
    recurringTopicsMock as recurringTopics,
    summaryMock,
} from "~/mock/repo-dashboard/communication";
import { FiUsers } from "react-icons/fi";

export default function RepoDashboardCommunicationSection() {
    return (
        <section
            aria-label="커뮤니케이션 현황"
            className="flex min-w-0 flex-col gap-6">
            <article className="bg-panel flex flex-col gap-5 rounded-lg border border-gray-300 p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold">상위 기여자</h3>
                        <p className="text-sm text-gray-500">
                            전체 기간의 커밋 기여를 기준으로 했어요.
                        </p>
                    </div>
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                        <FiUsers aria-hidden="true" />
                        {summaryMock.contributorTotal}
                    </span>
                </div>
                <ol className="flex flex-col divide-y divide-gray-300">
                    {contributors.map((contributor, index) => (
                        <li
                            key={contributor.login}
                            className="flex items-center gap-4 py-4">
                            <span className="w-6 text-xs font-bold text-gray-500">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <img
                                src={`https://github.com/${contributor.login}.png?size=96`}
                                alt=""
                                className="size-12 shrink-0 rounded-lg border border-gray-300"
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <p className="font-semibold break-words">@{contributor.login}</p>
                                <p className="text-xs text-gray-500">
                                    {contributor.commits.toLocaleString()} commits
                                </p>
                            </div>
                            <span className="text-sm font-semibold">{contributor.share}</span>
                        </li>
                    ))}
                </ol>
            </article>

            <section
                aria-label="신규 기여자 현황"
                className="flex flex-wrap gap-6">
                <div className="flex w-full min-w-0 flex-wrap gap-4 md:w-full xl:w-full">
                    {contributorMetrics.map((item) => (
                        <article
                            key={item.label}
                            className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-5 md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333333%-0.666667rem)]">
                            <h3 className="text-sm text-gray-500">{item.label}</h3>
                            <strong className="block text-2xl">{item.value}</strong>
                            <p className="text-xs text-gray-500">{item.detail}</p>
                        </article>
                    ))}
                </div>

                <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                    <h3 className="text-lg font-bold">Issue 안내의 명확성</h3>
                    <p className="text-sm text-gray-500">
                        열린 Issue에서 참여에 필요한 정보가 보이는 비율
                    </p>
                    <ul className="flex flex-col gap-5">
                        {issueReadiness.map((item) => (
                            <li
                                key={item.label}
                                className="flex flex-col gap-2">
                                <div className="flex justify-between gap-3 text-sm">
                                    <span>{item.label}</span>
                                    <span className="font-semibold">{item.value}%</span>
                                </div>
                                <div className="h-2 rounded-lg bg-gray-200">
                                    <div
                                        className="h-full rounded-lg bg-gray-500"
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="border-gray-300 pt-4 text-xs leading-5 text-gray-500">
                        {summaryMock.readinessInsight}
                    </p>
                </article>

                <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                    <h3 className="text-lg font-bold">최근 병합된 첫 기여</h3>
                    <p className="text-sm text-gray-500">새 기여자의 PR 사례 · 예시 데이터</p>
                    <div className="flex flex-col gap-3 rounded-lg border border-gray-300 p-4">
                        <span className="text-xs font-semibold text-gray-500">첫 PR 병합</span>
                        <strong className="text-base leading-6">
                            {summaryMock.firstContributionTitle}
                        </strong>
                        <p className="text-xs text-gray-500">
                            {summaryMock.firstContributionReference}
                        </p>
                        <div className="flex flex-wrap gap-3 border-gray-300 pt-3 text-xs text-gray-500">
                            <span>{summaryMock.firstContributionReviews}</span>
                            <span>{summaryMock.firstContributionMergeTime}</span>
                        </div>
                    </div>
                    <p className="text-xs leading-5 text-gray-500">
                        {summaryMock.firstContributionDescription}
                    </p>
                </article>

                <article className="bg-panel flex w-full flex-col gap-5 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-bold">기여 시작 난이도</h3>
                        <span className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                            AI 요약 · 예시
                        </span>
                    </div>
                    <strong className="block text-2xl">{summaryMock.difficulty}</strong>
                    <p className="text-sm leading-6 text-gray-500">
                        {summaryMock.difficultyInsight}
                    </p>
                    <p className="border-gray-300 pt-4 text-xs leading-5 text-gray-500">
                        {summaryMock.difficultyEvidence}
                    </p>
                </article>
            </section>

            <section
                aria-label="Discussion 현황"
                className="flex flex-wrap gap-6">
                <article className="bg-panel flex w-full min-w-0 flex-col gap-6 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold">Discussion 카테고리</h3>
                            <p className="text-sm text-gray-500">전체 게시물의 주제별 분포</p>
                        </div>
                        <strong className="text-xl">{summaryMock.totalDiscussions}</strong>
                    </div>
                    <ul className="flex flex-col gap-4">
                        {discussionCategories.map((category) => (
                            <li
                                key={category.name}
                                className="flex flex-col gap-2">
                                <div className="flex justify-between gap-3 text-sm">
                                    <span>{category.name}</span>
                                    <span className="text-gray-500">
                                        {category.count}개 · {category.percent}%
                                    </span>
                                </div>
                                <div className="h-2 rounded-lg bg-gray-200">
                                    <div
                                        className="h-full rounded-lg bg-gray-500"
                                        style={{
                                            width: `${category.percent}%`,
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="bg-panel flex w-full flex-col gap-6 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                    <h3 className="text-lg font-bold">답변과 응답</h3>
                    <dl className="flex flex-col divide-y divide-gray-300">
                        <div className="flex items-center justify-between gap-3 py-4">
                            <dt className="text-sm text-gray-500">답변 완료율</dt>
                            <dd className="text-xl font-bold">{summaryMock.answeredRate}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-4">
                            <dt className="text-sm text-gray-500">첫 답변 중앙값</dt>
                            <dd className="text-xl font-bold">{summaryMock.firstAnswerTime}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-4">
                            <dt className="text-sm text-gray-500">Discussion에서 해결</dt>
                            <dd className="text-xl font-bold">{summaryMock.resolvedDiscussions}</dd>
                        </div>
                    </dl>
                    <p className="text-xs leading-5 text-gray-500">{summaryMock.resolvedPeriod}</p>
                </article>

                <article className="bg-panel flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                    <h3 className="text-lg font-bold">인기 Discussion</h3>
                    <p className="text-sm text-gray-500">최근 참여가 많은 게시물</p>
                    <ol className="flex flex-col divide-y divide-gray-300">
                        {popularDiscussions.map((item, index) => (
                            <li
                                key={item.title}
                                className="flex items-center gap-4 py-4">
                                <span className="w-5 shrink-0 text-xs font-bold text-gray-500">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <p className="text-sm font-semibold break-words">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-gray-500">{item.category}</p>
                                </div>
                                <span className="shrink-0 text-xs text-gray-500">
                                    답글 {item.replies}
                                </span>
                            </li>
                        ))}
                    </ol>
                </article>

                <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                    <h3 className="text-lg font-bold">반복되는 질문과 주제</h3>
                    <p className="text-sm text-gray-500">{summaryMock.recurringTopicsPeriod}</p>
                    <ul className="flex flex-col divide-y divide-gray-300">
                        {recurringTopics.map((item) => (
                            <li
                                key={item.topic}
                                className="flex justify-between gap-3 py-3 text-sm">
                                <span>{item.topic}</span>
                                <span className="shrink-0 text-gray-500">{item.count}회</span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="bg-panel flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-full xl:w-full">
                    <h3 className="text-lg font-bold">공지와 릴리스 소식</h3>
                    <p className="text-sm text-gray-500">{summaryMock.announcementsPeriod}</p>
                    <dl className="flex flex-wrap gap-4">
                        <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-4 md:w-[calc(50%-0.5rem)]">
                            <dt className="text-sm text-gray-500">공지사항</dt>
                            <dd className="text-2xl font-bold">{summaryMock.announcementCount}</dd>
                            <p className="text-xs text-gray-500">
                                {summaryMock.announcementAverage}
                            </p>
                        </div>
                        <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-4 md:w-[calc(50%-0.5rem)]">
                            <dt className="text-sm text-gray-500">릴리스 소식</dt>
                            <dd className="text-2xl font-bold">{summaryMock.releaseCount}</dd>
                            <p className="text-xs text-gray-500">{summaryMock.releaseAverage}</p>
                        </div>
                    </dl>
                </article>
            </section>
        </section>
    );
}
