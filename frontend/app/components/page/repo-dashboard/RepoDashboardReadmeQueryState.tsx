interface Props {
    kind: "listLoading" | "listError" | "empty" | "contentLoading" | "contentError";
    onRetry?: () => void;
}

export const RepoDashboardReadmeSkeleton = ({ content = false }: { content?: boolean }) => (
    <div
        className={`flex flex-col gap-4 p-8 ${content ? "" : "w-full"}`}
        aria-label={`README ${content ? "내용을" : "목록을"} 불러오는 중`}>
        <div
            className={`h-8 animate-pulse rounded-lg bg-gray-200 ${content ? "w-1/2" : "w-1/3"}`}
        />
        <div className="h-80 animate-pulse rounded-lg bg-gray-200" />
    </div>
);

export const RepoDashboardReadmeRetry = ({
    content,
    onRetry,
}: {
    content: boolean;
    onRetry?: () => void;
}) => (
    <div
        role="alert"
        className="flex min-h-48 flex-col gap-3 p-8 text-sm text-gray-500">
        <p>README {content ? "내용을" : "목록을"} 불러오지 못했습니다.</p>
        <button
            type="button"
            onClick={onRetry}
            className="text-primary cursor-pointer self-start font-semibold hover:underline">
            다시 시도
        </button>
    </div>
);

export const RepoDashboardReadmeEmpty = () => (
    <p className="flex min-h-48 items-center p-8 text-sm text-gray-500">
        이 저장소에는 README 파일이 없습니다.
    </p>
);

export default function RepoDashboardReadmeQueryState({ kind, onRetry }: Props) {
    if (kind === "listLoading") return <RepoDashboardReadmeSkeleton />;
    if (kind === "contentLoading") return <RepoDashboardReadmeSkeleton content />;
    if (kind === "listError")
        return (
            <RepoDashboardReadmeRetry
                content={false}
                onRetry={onRetry}
            />
        );
    if (kind === "contentError")
        return (
            <RepoDashboardReadmeRetry
                content
                onRetry={onRetry}
            />
        );
    return <RepoDashboardReadmeEmpty />;
}
