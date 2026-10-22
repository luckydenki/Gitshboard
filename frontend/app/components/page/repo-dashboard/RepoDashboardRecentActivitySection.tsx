import { FiAlertCircle, FiGitCommit, FiGitPullRequest } from "react-icons/fi";

const weeklyActivity = [
    { day: "월", count: 8 },
    { day: "화", count: 14 },
    { day: "수", count: 11 },
    { day: "목", count: 19 },
    { day: "금", count: 16 },
    { day: "토", count: 7 },
    { day: "일", count: 10 },
] as const;

const activityEvents = [
    {
        type: "commit",
        label: "Commit",
        title: "feat: add Activity component to the public API",
        description: "packages/react/src/ReactClient.js 외 4개 파일 변경",
        actor: "gaearon",
        reference: "8c21f4a",
        time: "오늘 14:32",
    },
    {
        type: "pull-request",
        label: "Pull Request",
        title: "Improve hydration error messages for nested boundaries",
        description: "리뷰 4개를 거쳐 main 브랜치에 병합됨",
        actor: "acdlite",
        reference: "#34918",
        time: "오늘 12:08",
    },
    {
        type: "issue",
        label: "Issue",
        title: "useEffect cleanup runs twice in development mode",
        description: "bug 라벨과 Status: Unconfirmed 라벨로 등록됨",
        actor: "dev-user",
        reference: "#34917",
        time: "오늘 10:41",
    },
    {
        type: "commit",
        label: "Commit",
        title: "fix: preserve pending state after interrupted transition",
        description: "ReactFiberLane.js 외 2개 파일 변경",
        actor: "sebmarkbage",
        reference: "f173bd2",
        time: "어제 21:17",
    },
    {
        type: "pull-request",
        label: "Pull Request",
        title: "Add regression test for deferred value update",
        description: "CI 검사를 통과하고 리뷰를 기다리는 중",
        actor: "sophiebits",
        reference: "#34912",
        time: "어제 18:56",
    },
    {
        type: "issue",
        label: "Issue",
        title: "Documentation example uses a removed option",
        description: "documentation 라벨로 분류된 뒤 종료됨",
        actor: "react-helper",
        reference: "#34908",
        time: "어제 15:24",
    },
] as const;

export default function RepoDashboardRecentActivitySection() {
    const maxActivity = Math.max(...weeklyActivity.map(({ count }) => count));
    const linePoints = weeklyActivity
        .map(
            ({ count }, index) =>
                `${24 + index * 76},${150 - (count / maxActivity) * 112}`,
        )
        .join(" ");

    return (
        <section
            aria-labelledby="recent-activity-title"
            className="flex min-w-sm items-start gap-6 not-lg:flex-col">
            <h2
                id="recent-activity-title"
                className="sr-only">
                최근 활동
            </h2>

            <aside className="flex w-80 shrink-0 flex-col gap-4 not-lg:w-full">
                <article className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                    <h3 className="font-bold">현재 상태</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {["활발한 프로젝트", "꾸준한 커밋", "빠른 이슈 응답"].map((tag) => (
                            <span
                                key={tag}
                                className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-semibold">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="mt-4 text-xs leading-5 text-gray-500">
                        최근 7일 동안 커밋, PR, 이슈 활동이 모두 확인됐어요.
                    </p>
                </article>

                <article className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                    <p className="text-xs text-gray-500">활동 리듬</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                        <strong className="text-xl">평일 집중형</strong>
                        <span className="text-primary text-sm font-semibold">꾸준함</span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-gray-500">
                        전체 활동의 76%가 평일에 기록되며 오후 시간대가 가장 활발해요.
                    </p>
                </article>

                <article className="bg-panel rounded-lg border-1 border-gray-300 p-5">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h3 className="font-bold">주간 커밋</h3>
                            <p className="mt-1 text-xs text-gray-500">최근 7일</p>
                        </div>
                        <strong className="text-xl">85</strong>
                    </div>
                    <div className="mt-5 overflow-x-auto">
                        <svg
                            role="img"
                            aria-label="월요일부터 일요일까지의 주간 커밋 꺾은선 그래프"
                            viewBox="0 0 504 180"
                            className="h-40 min-w-[280px] w-full text-primary">
                            <line
                                x1="24"
                                y1="150"
                                x2="480"
                                y2="150"
                                className="stroke-gray-300"
                                strokeWidth="1"
                            />
                            <polyline
                                points={linePoints}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            {weeklyActivity.map(({ day, count }, index) => {
                                const x = 24 + index * 76;
                                const y = 150 - (count / maxActivity) * 112;

                                return (
                                    <g key={day}>
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r="5"
                                            fill="currentColor"
                                        />
                                        <text
                                            x={x}
                                            y="173"
                                            textAnchor="middle"
                                            className="fill-gray-500 text-[12px]">
                                            {day}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <div className="mt-5 border-t-1 border-gray-300 pt-4">
                        <p className="text-xs text-gray-500">이번 주 가장 활발한 날</p>
                        <div className="mt-2 flex items-end justify-between gap-3">
                            <strong className="text-2xl">목요일</strong>
                            <span className="text-primary text-sm font-bold">19회</span>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                            커밋 14 · PR 3 · 이슈 2
                        </p>
                    </div>
                </article>
            </aside>

            <section
                aria-labelledby="activity-record-title"
                className="bg-panel min-w-0 flex-1 p-6 not-lg:w-full">
                <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
                    <div className="flex flex-col gap-1">
                        <h3
                            id="activity-record-title"
                            className="text-xl font-bold sm:text-2xl">
                            최근 전적
                        </h3>
                        <p className="text-sm text-gray-500">
                            저장소에서 발생한 주요 활동을 시간순으로 보여줘요.
                        </p>
                    </div>
                    <div className="flex gap-4 text-right text-xs text-gray-500">
                        <span>
                            <strong className="block text-base text-inherit">12</strong>
                            Commit
                        </span>
                        <span>
                            <strong className="block text-base text-inherit">3</strong>
                            PR
                        </span>
                        <span>
                            <strong className="block text-base text-inherit">2</strong>
                            Issue
                        </span>
                    </div>
                </div>

                <ol className="flex flex-col divide-y divide-gray-300">
                    {activityEvents.map((event) => {
                        const Icon =
                            event.type === "commit"
                                ? FiGitCommit
                                : event.type === "pull-request"
                                  ? FiGitPullRequest
                                  : FiAlertCircle;

                        return (
                            <li
                                key={`${event.type}-${event.reference}`}
                                className="flex gap-4 py-5 first:pt-0 last:pb-0">
                                <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                                    <Icon aria-hidden="true" />
                                </span>
                                <article className="flex min-w-0 flex-1 flex-col gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-primary text-xs font-semibold">
                                            {event.label}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {event.reference}
                                        </span>
                                        <time className="ml-auto text-xs text-gray-500">
                                            {event.time}
                                        </time>
                                    </div>
                                    <h4 className="font-semibold break-words">{event.title}</h4>
                                    <p className="text-sm leading-6 text-gray-500">
                                        {event.description}
                                    </p>
                                    <p className="text-xs text-gray-500">@{event.actor}</p>
                                </article>
                            </li>
                        );
                    })}
                </ol>
            </section>
        </section>
    );
}
