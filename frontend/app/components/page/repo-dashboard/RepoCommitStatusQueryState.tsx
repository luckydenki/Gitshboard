import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import LoadingSpinner from "~/components/common/LoadingSpinner";
import PanelError from "~/components/common/PanelError";
type Props = { state: "loading" | "error" | "empty" | "partial"; onRetry?: () => void };
export default function RepoCommitStatusQueryState({ state, onRetry }: Props) {
    return (
        <DashboardPanelLayout title="커밋 현황">
            {state === "loading" ? (
                <RepoCommitStatusSkeleton />
            ) : state === "empty" ? (
                <p
                    role="status"
                    className="flex min-h-36 items-center justify-center p-4 text-sm text-gray-500">
                    이 기간에는 커밋 기록이 없습니다.
                </p>
            ) : (
                <RepoCommitStatusError
                    state={state}
                    onRetry={onRetry}
                />
            )}
        </DashboardPanelLayout>
    );
}
export const RepoCommitStatusSkeleton = () => (
    <div className="flex min-h-36 items-center justify-center">
        <LoadingSpinner
            showLabel
            label="커밋 현황을 불러오는 중입니다."
        />
    </div>
);
export const RepoCommitStatusError = ({ state, onRetry }: Pick<Props, "state" | "onRetry">) => (
    <PanelError
        title={
            state === "partial" ? "커밋 현황의 일부만 수집됐어요" : "커밋 현황을 불러오지 못했어요"
        }
        message={
            state === "partial"
                ? "커밋 이력의 일부만 수집되어 정확한 통계를 표시할 수 없습니다."
                : undefined
        }
        onRetry={onRetry}
    />
);
