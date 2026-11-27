import type { ReactNode } from "react";
import type { CommunicationMetric } from "~/types/response/repo-communication";
type Props<T> = {
    pending: boolean;
    error: boolean;
    metric?: CommunicationMetric<T>;
    onRetry: () => void;
    children: (value: T) => ReactNode;
};
export default function RepoCommunicationQueryState<T>({
    pending,
    error,
    metric,
    onRetry,
    children,
}: Props<T>) {
    return (
        <>
            {pending ? (
                <RepoCommunicationSkeleton />
            ) : error ? (
                <RepoCommunicationRetry onRetry={onRetry} />
            ) : !metric || metric.status !== "complete" || metric.value === null ? (
                <span className="min-h-24 text-sm text-gray-500">
                    {metric?.status === "partial"
                        ? "일부 데이터만 수집되어 집계를 표시할 수 없습니다."
                        : metric?.reason === "disabled"
                          ? "Discussion이 비활성화되어 있습니다."
                          : "이 데이터를 조회할 수 없습니다."}
                </span>
            ) : (
                children(metric.value)
            )}
        </>
    );
}
export const RepoCommunicationSkeleton = () => (
    <span
        role="status"
        aria-label="데이터 불러오는 중"
        className="flex min-h-24 animate-pulse flex-col gap-4">
        <span className="h-6 rounded-lg bg-gray-200" />
        <span className="h-12 rounded-lg bg-gray-200" />
    </span>
);
export const RepoCommunicationRetry = ({ onRetry }: { onRetry: () => void }) => (
    <span className="flex min-h-24 flex-col gap-3">
        <span role="alert">데이터를 불러오지 못했습니다.</span>
        <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-lg border border-gray-300 p-2 hover:bg-gray-200">
            다시 시도
        </button>
    </span>
);
