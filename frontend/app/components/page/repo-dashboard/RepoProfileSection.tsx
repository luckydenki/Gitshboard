import { useParams } from "react-router";
import useRepositoryProfile from "~/hooks/useRepositoryProfile";
import {
    FiBookOpen,
    FiExternalLink,
    FiEye,
    FiGitBranch,
    FiGitCommit,
    FiStar,
    FiGitPullRequest,
} from "react-icons/fi";

import { PiGitFork } from "react-icons/pi";
import { AccountDashboardProfileSectionLayout } from "~/components/common/AccountDashboard/AccountDashboardLayout";

export default function RepoProfileSection() {
    const { owner, repo } = useParams();
    const { data, isLoading, isError } = useRepositoryProfile(owner, repo);
    if (!owner || !repo)
        return (
            <AccountDashboardProfileSectionLayout>
                <p role="alert">올바른 저장소 주소가 아닙니다.</p>
            </AccountDashboardProfileSectionLayout>
        );
    if (isLoading)
        return (
            <AccountDashboardProfileSectionLayout>
                <p role="status">저장소 프로필을 불러오는 중입니다.</p>
            </AccountDashboardProfileSectionLayout>
        );
    if (isError || !data)
        return (
            <AccountDashboardProfileSectionLayout>
                <p role="alert">저장소 프로필을 불러오지 못했습니다.</p>
            </AccountDashboardProfileSectionLayout>
        );
    const topics = (data.repositoryTopics.nodes ?? []).flatMap((node) =>
        node ? [node.topic.name] : [],
    );
    const profileStats = [
        { label: "Stars", value: data.stargazerCount, Icon: FiStar },
        { label: "Forks", value: data.forkCount, Icon: PiGitFork },
        { label: "Watchers", value: data.watchers.totalCount, Icon: FiEye },
        { label: "열린 이슈", value: data.issues.totalCount, Icon: FiGitCommit },
        { label: "열린 PR", value: data.pullRequests.totalCount, Icon: FiGitPullRequest },
    ];
    return (
        <AccountDashboardProfileSectionLayout>
            <div className="flex flex-col gap-6 divide-gray-300 pb-8">
                <div className="flex min-w-0 items-start justify-between gap-6 not-lg:flex-col">
                    <div className="flex min-w-0 items-start gap-5 not-sm:flex-col">
                        <img
                            src={data.owner.avatarUrl}
                            alt={`${data.owner.login} 프로필 사진`}
                            className="size-24 shrink-0 rounded-lg border border-gray-300 object-cover"
                        />
                        <div className="flex min-w-0 flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                <span>{data.owner.login}</span>
                                <span aria-hidden="true">/</span>
                                <span className="rounded-lg border border-gray-300 p-2 text-xs">
                                    {data.visibility}
                                </span>
                            </div>
                            <h1 className="wrap-break-words text-2xl leading-tight font-bold sm:text-3xl">
                                {data.name}
                            </h1>
                            <p className="max-w-3xl text-sm leading-6 text-gray-500">
                                {data.description || "설명이 없습니다."}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((topic) => (
                                    <span
                                        key={topic}
                                        className="rounded-lg bg-gray-100 p-2 text-xs font-medium text-gray-500">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    <FiBookOpen aria-hidden="true" />
                                    {data.licenseInfo?.name ?? "라이선스 정보 없음"}
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiGitBranch aria-hidden="true" />
                                    {data.defaultBranchRef?.name ?? "기본 브랜치 없음"}
                                </span>
                                <span>
                                    마지막 푸시{" "}
                                    {data.pushedAt ? (
                                        <time dateTime={data.pushedAt}>
                                            {data.pushedAt.slice(0, 10)}
                                        </time>
                                    ) : (
                                        "정보 없음"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <a
                        href={data.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:border-primary flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 p-3 text-sm font-semibold">
                        GitHub에서 보기
                        <FiExternalLink aria-hidden="true" />
                    </a>
                </div>

                <dl className="flex flex-wrap gap-4 border-gray-300 pt-5">
                    {profileStats.map(({ label, value, Icon }) => {
                        return (
                            <div
                                key={label}
                                className="flex w-[calc(50%-0.5rem)] min-w-0 flex-col gap-2 p-2 xl:w-[calc(20%-0.8rem)]">
                                <dt className="flex items-center gap-2 text-xs text-gray-500">
                                    <Icon aria-hidden="true" />
                                    {label}
                                </dt>
                                <dd className="text-xl font-bold">{value.toLocaleString()}</dd>
                            </div>
                        );
                    })}
                </dl>
            </div>
        </AccountDashboardProfileSectionLayout>
    );
}
