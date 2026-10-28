import { FiAlertCircle, FiGitCommit, FiGitPullRequest } from "react-icons/fi";

export interface DashboardActivityEvent {
    id: string;
    type: "commit" | "pull-request" | "issue";
    label: string;
    title: string;
    description: string;
    reference: string;
    time: string;
    dateTime?: string;
    actor?: string | null;
    url?: string;
}

export const DashboardRecentActivityItem = ({ event }: { event: DashboardActivityEvent }) => {
    const Icon =
        event.type === "commit"
            ? FiGitCommit
            : event.type === "pull-request"
              ? FiGitPullRequest
              : FiAlertCircle;

    return (
        <li className="flex gap-4 py-5">
            <span className="text-primary flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icon aria-hidden="true" />
            </span>
            <article className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">{event.label}</span>
                        {event.url ? (
                            <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-xs hover:underline">
                                {event.reference}
                            </a>
                        ) : (
                            <span className="text-xs text-gray-500">{event.reference}</span>
                        )}
                    </div>
                    <time
                        dateTime={event.dateTime}
                        className="text-xs text-gray-500">
                        {event.time}
                    </time>
                </div>
                <h4 className="wrap-break-words font-semibold">{event.title}</h4>
                <p className="wrap-break-words text-sm leading-6 text-gray-500">
                    {event.description}
                </p>
                {event.actor && <p className="text-xs text-gray-500">@{event.actor}</p>}
            </article>
        </li>
    );
};

export default function DashboardRecentActivityList({
    events,
}: {
    events: readonly DashboardActivityEvent[];
}) {
    return (
        <ol className="flex flex-col divide-y divide-gray-300">
            {events.length === 0 ? (
                <li className="py-5 text-sm text-gray-500">표시할 활동이 없습니다.</li>
            ) : (
                events.map((event) => (
                    <DashboardRecentActivityItem
                        key={event.id}
                        event={event}
                    />
                ))
            )}
        </ol>
    );
}
