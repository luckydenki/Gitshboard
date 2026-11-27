import UpcomingBackdrop from "~/components/common/UpcomingBackdrop";
import { useParams } from "react-router";
import { useRepoCommunication } from "~/hooks/api/useRepoCommunication";
import RepoCommunicationQueryState from "./RepoCommunicationQueryState";
export default function RepoCommunicationDiscussionExampleSection() {
    const { owner, repo } = useParams();
    const query = useRepoCommunication(owner, repo, "discussions");
    return (
        <>
            <article className="bg-panel flex w-full min-w-0 flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-full xl:w-[calc(66.666667%-0.5rem)]">
                <h3 className="text-lg font-bold">인기 Discussion</h3>
                <p className="text-sm text-gray-500">최근 참여가 많은 게시물</p>
                <RepoCommunicationQueryState
                    pending={query.isPending}
                    error={query.isError}
                    metric={query.data?.popular}
                    onRetry={() => void query.refetch()}>
                    {(value) => (
                        <>
                            {value.length === 0 ? (
                                <p className="min-h-24 text-sm text-gray-500">
                                    표시할 Discussion이 없습니다.
                                </p>
                            ) : (
                                <ol className="flex flex-col divide-y divide-gray-300">
                                    {value.map((item, index) => (
                                        <li
                                            key={item.number}
                                            className="flex items-center gap-4 py-4">
                                            <span className="w-5 shrink-0 text-xs font-bold text-gray-500">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                <p className="wrap-break-words text-sm font-semibold">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.categoryName}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-xs text-gray-500">
                                                답글 {item.topLevelCommentCount}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </>
                    )}
                </RepoCommunicationQueryState>
            </article>
            <article className="bg-panel flex w-full flex-col gap-4 rounded-lg border border-gray-300 p-6 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <h3 className="text-lg font-bold">반복되는 질문과 주제</h3>
                <UpcomingBackdrop />
            </article>
        </>
    );
}
