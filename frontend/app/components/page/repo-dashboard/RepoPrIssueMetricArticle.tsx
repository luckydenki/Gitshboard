import type { ReactNode } from "react";
import type { Metric } from "~/types/response/repo-pr-issue";

type Props<T> = {
    title: string;
    description?: string;
    metric?: Metric<T>;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
    children: (value: T) => ReactNode;
};

export default function RepoPrIssueMetricArticle<T>({
    title,
    description,
    metric,
    loading,
    error,
    onRetry,
    children,
}: Props<T>) {
    return (
        <article className="bg-panel flex min-h-36 w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
            <h3 className="text-lg font-bold">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
            {loading ? (
                <RepoPrIssueMetricSkeleton />
            ) : error ? (
                <RepoPrIssueMetricRetry
                    message={error}
                    onRetry={onRetry}
                />
            ) : metric?.status === "complete" ? (
                children(metric.value)
            ) : (
                <RepoPrIssueMetricRetry
                    message={metric?.reason ?? "수집된 데이터가 없습니다."}
                    onRetry={metric?.status === "partial" ? onRetry : undefined}
                />
            )}
        </article>
    );
}

export const RepoPrIssueMetricSkeleton = () => (
    <div
        role="status"
        className="h-16 animate-pulse rounded-lg bg-gray-200">
        <span className="sr-only">통계를 불러오는 중</span>
    </div>
);

export const RepoPrIssueMetricRetry = ({
    message,
    onRetry,
}: {
    message: string;
    onRetry?: () => void;
}) => (
    <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-gray-500">{message}</p>
        {onRetry && (
            <button
                type="button"
                onClick={onRetry}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
                다시 시도
            </button>
        )}
    </div>
);

export const RepoPrIssueStatsList = ({ rows }: { rows: { label: string; value: ReactNode }[] }) =>
    rows.length ? (
        <dl className="flex flex-col gap-2 divide-y divide-gray-300">
            {rows.map((row) => (
                <div
                    key={row.label}
                    className="flex min-w-0 items-start justify-between gap-3 py-2">
                    <dt className="min-w-0 text-sm wrap-break-word text-gray-500">{row.label}</dt>
                    <dd className="shrink-0 text-right text-sm font-bold">{row.value}</dd>
                </div>
            ))}
        </dl>
    ) : (
        <p className="text-sm text-gray-500">집계할 데이터가 없습니다.</p>
    );
