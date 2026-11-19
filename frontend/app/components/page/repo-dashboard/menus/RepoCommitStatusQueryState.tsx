type Props = { state: "loading" | "error" | "empty" | "partial"; onRetry?: () => void };

/** 커밋 현황 API의 로딩·오류·빈 결과를 표시합니다. */
export default function RepoCommitStatusQueryState({ state, onRetry }: Props) {
    if (state === "loading") {
        return <div role="status" className="bg-panel flex min-h-36 animate-pulse flex-col gap-4 rounded-lg border border-gray-300 p-6">
            <span className="h-5 w-32 rounded-lg bg-gray-200" />
            <span className="h-8 w-48 rounded-lg bg-gray-200" />
            <span className="h-4 w-full rounded-lg bg-gray-200" />
            <span className="sr-only">커밋 현황을 불러오는 중입니다.</span>
        </div>;
    }
    const message = state === "error" ? "커밋 현황을 불러오지 못했습니다."
        : state === "partial" ? "커밋 이력의 일부만 수집되어 정확한 통계를 표시할 수 없습니다."
            : "이 기간에는 커밋 기록이 없습니다.";
    return <div role={state === "error" ? "alert" : "status"}
        className="bg-panel flex min-h-36 flex-col items-start justify-center gap-3 rounded-lg border border-gray-300 p-6 text-sm text-gray-500">
        <p>{message}</p>
        {onRetry && <button type="button" onClick={onRetry}
            className="text-primary cursor-pointer font-semibold hover:underline">다시 시도</button>}
    </div>;
}
