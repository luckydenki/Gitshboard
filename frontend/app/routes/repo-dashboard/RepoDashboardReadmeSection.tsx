import { useState } from "react";
import { FiBookOpen, FiExternalLink } from "react-icons/fi";
import { useParams } from "react-router";
import RepoDashboardReadmeArticle from "~/components/page/repo-dashboard/RepoDashboardReadmeArticle";
import RepoDashboardReadmeQueryState from "~/components/page/repo-dashboard/RepoDashboardReadmeQueryState";
import {
    useRepoDashboardReadmeContent,
    useRepoDashboardReadmes,
} from "~/hooks/api/useRepoDashboardReadme";

export default function RepoDashboardReadmeSection() {
    const { owner, repo } = useParams();
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const listQuery = useRepoDashboardReadmes(owner, repo);
    const documents = listQuery.data?.documents ?? [];
    const activePath =
        documents.find((item) => item.path === selectedPath)?.path ?? documents[0]?.path;
    const contentQuery = useRepoDashboardReadmeContent(owner, repo, activePath);
    const content = contentQuery.data;

    return (
        <section
            aria-label="README 내용"
            className="bg-panel flex min-w-0 flex-col divide-y divide-gray-300 rounded-lg border border-gray-300 md:flex-row md:divide-x md:divide-y-0">
            {listQuery.isPending ? (
                <RepoDashboardReadmeQueryState kind="listLoading" />
            ) : listQuery.isError ? (
                <RepoDashboardReadmeQueryState
                    kind="listError"
                    onRetry={() => void listQuery.refetch()}
                />
            ) : documents.length === 0 ? (
                <RepoDashboardReadmeQueryState kind="empty" />
            ) : (
                <>
                    <div className="flex flex-col gap-3 p-4 md:hidden">
                        <label
                            htmlFor="readme-path"
                            className="text-sm font-semibold">
                            README 파일{" "}
                            <span className="text-xs font-normal text-gray-500">
                                · {documents.length}개
                            </span>
                        </label>
                        <select
                            id="readme-path"
                            value={activePath}
                            onChange={(event) => setSelectedPath(event.target.value)}
                            className="bg-panel w-full cursor-pointer rounded-lg border border-gray-300 p-3 text-sm">
                            {documents.map((document) => (
                                <option
                                    key={document.path}
                                    value={document.path}>
                                    {document.path}
                                </option>
                            ))}
                        </select>
                    </div>
                    <aside className="hidden min-w-0 divide-y divide-gray-300 md:block md:w-64 md:shrink-0">
                        <div className="flex items-center justify-between gap-2 p-4 text-sm font-semibold">
                            <span className="flex items-center gap-2">
                                <FiBookOpen aria-hidden="true" />
                                README 파일
                            </span>
                            <span className="text-xs font-normal text-gray-500">
                                {documents.length}개
                            </span>
                        </div>
                        <nav
                            aria-label="README 파일 목록"
                            className="p-2">
                            <ul className="flex flex-col divide-y divide-gray-300">
                                {documents.map((document) => (
                                    <li
                                        key={document.path}
                                        className="py-2">
                                        <button
                                            type="button"
                                            aria-pressed={activePath === document.path}
                                            onClick={() => setSelectedPath(document.path)}
                                            className={`w-full cursor-pointer rounded-lg p-3 text-left text-sm break-all ${activePath === document.path ? "bg-primary font-semibold text-white" : "text-gray-500 hover:bg-gray-200"}`}>
                                            {document.path}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                    <div className="min-w-0 flex-1 divide-y divide-gray-300 md:w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold break-all">
                                <FiBookOpen
                                    aria-hidden="true"
                                    className="shrink-0 text-gray-500"
                                />
                                {activePath}
                            </span>
                            {content && (
                                <a
                                    href={content.htmlUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary flex cursor-pointer items-center gap-2 text-sm font-semibold hover:underline">
                                    GitHub에서 보기
                                    <FiExternalLink aria-hidden="true" />
                                </a>
                            )}
                        </div>
                        {contentQuery.isPending ? (
                            <RepoDashboardReadmeQueryState kind="contentLoading" />
                        ) : contentQuery.isError ? (
                            <RepoDashboardReadmeQueryState
                                kind="contentError"
                                onRetry={() => void contentQuery.refetch()}
                            />
                        ) : content ? (
                            <RepoDashboardReadmeArticle content={content} />
                        ) : null}
                    </div>
                </>
            )}
        </section>
    );
}
