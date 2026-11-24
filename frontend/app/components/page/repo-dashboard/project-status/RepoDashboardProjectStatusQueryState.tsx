import type { ReactNode } from "react";
import LoadingSpinner from "~/components/common/LoadingSpinner";
import PanelError from "~/components/common/PanelError";

type Props = { loading: boolean; error: boolean; onRetry: () => void; children: ReactNode };

export default function RepoDashboardProjectStatusQueryState({
    loading,
    error,
    onRetry,
    children,
}: Props) {
    if (loading) return <RepoDashboardProjectStatusLoading />;
    if (error) return <RepoDashboardProjectStatusError onRetry={onRetry} />;
    return children;
}

export const RepoDashboardProjectStatusLoading = () => (
    <div className="flex min-h-64 items-center justify-center">
        <LoadingSpinner
            showLabel
            label="프로젝트 현황을 불러오는 중입니다."
        />
    </div>
);
export const RepoDashboardProjectStatusError = ({ onRetry }: Pick<Props, "onRetry">) => (
    <div className="flex min-h-64 items-center justify-center">
        <PanelError onRetry={onRetry} />
    </div>
);
