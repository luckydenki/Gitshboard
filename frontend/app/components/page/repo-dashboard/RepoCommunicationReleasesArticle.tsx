import { useParams } from "react-router";
import { useRepoCommunication } from "~/hooks/api/useRepoCommunication";
import RepoCommunicationQueryState from "./RepoCommunicationQueryState";
import { summaryMock } from "~/mock/repo-dashboard/communication";
export default function RepoCommunicationReleasesArticle() {
    const { owner, repo } = useParams();
    const query = useRepoCommunication(owner, repo, "releases");
    return (
        <article className="bg-panel flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-full xl:w-full">
            <h3 className="text-lg font-bold">릴리스 소식</h3>
            <p className="text-sm text-gray-500">{summaryMock.announcementsPeriod}</p>
            <RepoCommunicationQueryState
                pending={query.isPending}
                error={query.isError}
                metric={query.data?.releases}
                onRetry={() => void query.refetch()}>
                {(value) => (
                    <dl className="flex flex-wrap gap-4">
                        <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-4 md:w-[calc(50%-0.5rem)]">
                            <dt className="text-sm text-gray-500">릴리스 소식</dt>
                            <dd className="text-2xl font-bold">{value.count}건</dd>
                            <p className="text-xs text-gray-500">
                                월평균 {value.monthlyAverage.toFixed(1)}건
                            </p>
                        </div>
                    </dl>
                )}
            </RepoCommunicationQueryState>
        </article>
    );
}
