import { FiUsers } from "react-icons/fi";

const contributors = [
    { login: "gaearon", commits: 1_284, share: "18.2%" },
    { login: "sebmarkbage", commits: 976, share: "13.8%" },
    { login: "acdlite", commits: 641, share: "9.1%" },
    { login: "sophiebits", commits: 438, share: "6.2%" },
] as const;

const contributorMetrics = [
    { label: "good first issue", value: "24건", detail: "열린 Issue 중" },
    { label: "help wanted", value: "41건", detail: "열린 Issue 중" },
    { label: "신규 기여자 PR 병합률", value: "72%", detail: "첫 PR의 처리 결과 기준" },
    { label: "첫 PR에 남긴 리뷰 댓글", value: "평균 4.6개", detail: "유지관리자 작성 댓글" },
    { label: "외부 기여자 재참여율", value: "38%", detail: "첫 기여 뒤 6개월 내 재참여" },
    { label: "작게 시작할 수 있는 Issue", value: "29%", detail: "작업 범위가 작은 열린 Issue" },
] as const;

const issueReadiness = [
    { label: "담당자 명시", value: 63 },
    { label: "예상 난이도 명시", value: 52 },
    { label: "재현 절차 명시", value: 71 },
] as const;

const discussionCategories = [
    { name: "Q&A", count: 156, percent: 40 },
    { name: "Ideas", count: 94, percent: 24 },
    { name: "Show and tell", count: 62, percent: 16 },
    { name: "Announcements", count: 43, percent: 11 },
    { name: "General", count: 32, percent: 9 },
] as const;

const popularDiscussions = [
    { title: "How to migrate an existing app to React 19?", category: "Q&A", replies: 42 },
    {
        title: "Share your React Compiler migration results",
        category: "Show and tell",
        replies: 36,
    },
    { title: "Proposal: improve transition debugging", category: "Ideas", replies: 31 },
] as const;

export default function RepoDashboardCommunicationSection() {
    return (
        <section
            aria-label="커뮤니케이션 현황"
            className="flex min-w-0 flex-col gap-6">
            <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold">상위 기여자</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            전체 기간의 커밋 기여를 기준으로 했어요.
                        </p>
                    </div>
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                        <FiUsers aria-hidden="true" />총 1,842명
                    </span>
                </div>
                <ol className="mt-5 flex flex-col divide-y divide-gray-300">
                    {contributors.map((contributor, index) => (
                        <li
                            key={contributor.login}
                            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                            <span className="w-6 text-xs font-bold text-gray-500">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <img
                                src={`https://github.com/${contributor.login}.png?size=96`}
                                alt=""
                                className="size-12 shrink-0 rounded-lg border-1 border-gray-300"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold break-words">@{contributor.login}</p>
                                <p className="mt-1 text-xs text-gray-500">
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
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div className="grid min-w-0 grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2 xl:col-span-3 xl:grid-cols-3">
                    {contributorMetrics.map((item) => (
                        <article
                            key={item.label}
                            className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                            <h3 className="text-sm text-gray-500">{item.label}</h3>
                            <strong className="mt-3 block text-2xl">{item.value}</strong>
                            <p className="mt-2 text-xs text-gray-500">{item.detail}</p>
                        </article>
                    ))}
                </div>

                <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                    <h3 className="text-lg font-bold">Issue 안내의 명확성</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        열린 Issue에서 참여에 필요한 정보가 보이는 비율
                    </p>
                    <ul className="mt-6 flex flex-col gap-5">
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
                                        className="bg-primary h-full rounded-lg"
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 border-t-1 border-gray-300 pt-4 text-xs leading-5 text-gray-500">
                        세 정보가 모두 명확한 Issue는 46%예요.
                    </p>
                </article>

                <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                    <h3 className="text-lg font-bold">최근 병합된 첫 기여</h3>
                    <p className="mt-1 text-sm text-gray-500">새 기여자의 PR 사례 · 예시 데이터</p>
                    <div className="mt-6 flex flex-col gap-3 rounded-lg border-1 border-gray-300 p-4">
                        <span className="text-primary text-xs font-semibold">첫 PR 병합</span>
                        <strong className="text-base leading-6">
                            docs: clarify the useTransition example
                        </strong>
                        <p className="text-xs text-gray-500">@new-react-contributor · #34872</p>
                        <div className="flex flex-wrap gap-3 border-t-1 border-gray-300 pt-3 text-xs text-gray-500">
                            <span>리뷰 댓글 5개</span>
                            <span>병합까지 2일 4시간</span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs leading-5 text-gray-500">
                        문서 예제의 혼동되는 부분을 고친 작은 변경이었어요.
                    </p>
                </article>

                <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-bold">기여 시작 난이도</h3>
                        <span className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-semibold">
                            AI 요약 · 예시
                        </span>
                    </div>
                    <strong className="mt-5 block text-2xl">보통</strong>
                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        첫 기여용 Issue와 도움 요청이 꾸준히 열려 있고 첫 PR도 비교적 잘 병합돼요.
                        다만 담당자·난이도·재현 절차가 모두 명확한 Issue는 절반에 미치지 못해 작업을
                        고르는 데 시간이 걸릴 수 있어요.
                    </p>
                    <p className="mt-5 border-t-1 border-gray-300 pt-4 text-xs leading-5 text-gray-500">
                        근거: good first issue 24건 · help wanted 41건 · 첫 PR 병합률 72% · 안내
                        완성도 46%
                    </p>
                </article>
            </section>

            <section
                aria-label="Discussion 현황"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold">Discussion 카테고리</h3>
                            <p className="mt-1 text-sm text-gray-500">전체 게시물의 주제별 분포</p>
                        </div>
                        <strong className="text-xl">387개</strong>
                    </div>
                    <ul className="mt-6 flex flex-col gap-4">
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
                                        className="bg-primary h-full rounded-lg"
                                        style={{ width: `${category.percent}%` }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                    <h3 className="text-lg font-bold">답변과 응답</h3>
                    <dl className="mt-6 flex flex-col divide-y divide-gray-300">
                        <div className="flex items-center justify-between gap-3 py-4 first:pt-0">
                            <dt className="text-sm text-gray-500">답변 완료율</dt>
                            <dd className="text-xl font-bold">84%</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-4">
                            <dt className="text-sm text-gray-500">첫 답변 중앙값</dt>
                            <dd className="text-xl font-bold">3시간 12분</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 py-4 last:pb-0">
                            <dt className="text-sm text-gray-500">Discussion에서 해결</dt>
                            <dd className="text-xl font-bold">71건</dd>
                        </div>
                    </dl>
                    <p className="mt-5 text-xs leading-5 text-gray-500">
                        Issue로 옮기지 않고 Discussion 답변으로 해결한 문의는 최근 90일 기준이에요.
                    </p>
                </article>

                <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2">
                    <h3 className="text-lg font-bold">인기 Discussion</h3>
                    <p className="mt-1 text-sm text-gray-500">최근 참여가 많은 게시물</p>
                    <ol className="mt-5 flex flex-col divide-y divide-gray-300">
                        {popularDiscussions.map((item, index) => (
                            <li
                                key={item.title}
                                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                <span className="w-5 shrink-0 text-xs font-bold text-gray-500">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold break-words">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">{item.category}</p>
                                </div>
                                <span className="shrink-0 text-xs text-gray-500">
                                    답글 {item.replies}
                                </span>
                            </li>
                        ))}
                    </ol>
                </article>

                <article className="bg-panel rounded-lg border-1 border-gray-300 p-6">
                    <h3 className="text-lg font-bold">반복되는 질문과 주제</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        최근 90일 Discussion에서 자주 등장했어요.
                    </p>
                    <ul className="mt-5 flex flex-col divide-y divide-gray-300">
                        {[
                            { topic: "React 19 마이그레이션", count: 38 },
                            { topic: "React Compiler 설정", count: 27 },
                            { topic: "서버 컴포넌트", count: 19 },
                            { topic: "Hydration 오류", count: 15 },
                        ].map((item) => (
                            <li
                                key={item.topic}
                                className="flex justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
                                <span>{item.topic}</span>
                                <span className="shrink-0 text-gray-500">{item.count}회</span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="bg-panel min-w-0 rounded-lg border-1 border-gray-300 p-6 md:col-span-2 xl:col-span-3">
                    <h3 className="text-lg font-bold">공지와 릴리스 소식</h3>
                    <p className="mt-1 text-sm text-gray-500">최근 6개월 게시 빈도</p>
                    <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg border-1 border-gray-300 p-4">
                            <dt className="text-sm text-gray-500">공지사항</dt>
                            <dd className="mt-2 text-2xl font-bold">12건</dd>
                            <p className="mt-2 text-xs text-gray-500">월평균 2.0건</p>
                        </div>
                        <div className="rounded-lg border-1 border-gray-300 p-4">
                            <dt className="text-sm text-gray-500">릴리스 소식</dt>
                            <dd className="mt-2 text-2xl font-bold">8건</dd>
                            <p className="mt-2 text-xs text-gray-500">월평균 1.3건</p>
                        </div>
                    </dl>
                </article>
            </section>
        </section>
    );
}
