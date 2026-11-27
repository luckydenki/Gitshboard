import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import { FiCheck } from "react-icons/fi";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusHealthPanel({ status }: Props) {
    const { filesQuery, files } = status;
    return (
        <DashboardPanelLayout
            title="커뮤니티 건강도"
            semititle="기본 문서 준비 상태">
            <RepoDashboardProjectStatusQueryState
                loading={filesQuery.isLoading || (filesQuery.isFetching && filesQuery.isError)}
                error={filesQuery.isError}
                onRetry={() => {
                    void filesQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    <strong className="text-primary text-2xl">
                        {files ? `${files.healthScore.present}/${files.healthScore.total}` : "-"}
                    </strong>
                    {files?.health.length ? (
                        <ul className="flex flex-col gap-3">
                            {files.health.map(({ name, present }) => (
                                <li
                                    key={name}
                                    className="flex items-center gap-3 text-sm">
                                    <span
                                        className={`flex size-5 items-center justify-center rounded-lg ${present ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                                        {present ? (
                                            <FiCheck
                                                aria-label="준비됨"
                                                className="text-xs"
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </span>
                                    {name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            확인할 건강도 파일이 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
