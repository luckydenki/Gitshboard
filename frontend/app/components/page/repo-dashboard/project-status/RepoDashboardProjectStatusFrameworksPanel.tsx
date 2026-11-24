import DashboardPanelLayout from "~/components/common/DashboardPanelLayout";
import RepoDashboardProjectStatusQueryState from "./RepoDashboardProjectStatusQueryState";
import type useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";

type Props = { status: ReturnType<typeof useRepoDashboardProjectStatusPanels> };

export default function RepoDashboardProjectStatusFrameworksPanel({ status }: Props) {
    const { filesQuery, files } = status;
    return (
        <DashboardPanelLayout
            title="발견한 프레임워크"
            semititle="설정과 매니페스트 파일을 기준으로 확인했어요.">
            <RepoDashboardProjectStatusQueryState
                loading={filesQuery.isLoading || (filesQuery.isFetching && filesQuery.isError)}
                error={filesQuery.isError}
                onRetry={() => {
                    void filesQuery.refetch();
                }}>
                <div className="flex min-h-64 min-w-0 flex-col gap-4">
                    {files?.frameworks.length ? (
                        <ul className="flex flex-wrap gap-2">
                            {files.frameworks.map(({ name, paths }) => (
                                <li
                                    key={name}
                                    title={paths.join(", ")}
                                    className="rounded-lg bg-gray-100 p-2 text-xs font-semibold text-gray-500">
                                    {name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="flex min-h-64 items-center justify-center text-sm text-gray-500">
                            발견한 프레임워크가 없습니다.
                        </p>
                    )}
                </div>
            </RepoDashboardProjectStatusQueryState>
        </DashboardPanelLayout>
    );
}
