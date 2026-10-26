import {
    topicsMock as topics,
    profileStatsMock as profileStats,
    summaryMock,
    profileMock,
} from "~/mock/repo-dashboard/profile";
import {
    FiBookOpen,
    FiExternalLink,
    FiEye,
    FiGitBranch,
    FiGitCommit,
    FiStar,
    FiUsers,
} from "react-icons/fi";
import { DashboardProfileSectionLayout } from "../user-dashboard/DashboardProfileSectionLayout";
import { PiGitFork } from "react-icons/pi";

const profileStatIcons = { FiStar, PiGitFork, FiEye, FiUsers, FiGitCommit };

export default function RepoProfileSection() {
    return (
        <DashboardProfileSectionLayout>
            <div className="flex flex-col gap-6 pb-8">
                <div className="flex min-w-0 items-start justify-between gap-6 not-lg:flex-col">
                    <div className="flex min-w-0 items-start gap-5 not-sm:flex-col">
                        <img
                            src={profileMock.avatarUrl}
                            alt={profileMock.avatarAlt}
                            className="size-24 shrink-0 rounded-lg border-1 border-gray-300 object-cover"
                        />
                        <div className="flex min-w-0 flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                <span>{profileMock.owner}</span>
                                <span aria-hidden="true">/</span>
                                <span className="rounded-lg border-1 border-gray-300 p-2 text-xs">
                                    {profileMock.visibility}
                                </span>
                                <span className="rounded-lg border-1 border-gray-300 p-2 text-xs">
                                    예시 데이터
                                </span>
                            </div>
                            <h1 className="text-2xl leading-tight font-bold break-words sm:text-3xl">
                                {profileMock.name}
                            </h1>
                            <p className="max-w-3xl text-sm leading-6 text-gray-500">
                                {profileMock.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((topic) => (
                                    <span
                                        key={topic}
                                        className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-medium">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    <FiBookOpen aria-hidden="true" />
                                    {profileMock.license}
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiGitBranch aria-hidden="true" />
                                    {profileMock.defaultBranch}
                                </span>
                                <span>{summaryMock.lastPush}</span>
                            </div>
                        </div>
                    </div>

                    <a
                        href={profileMock.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:border-primary flex shrink-0 items-center gap-2 rounded-lg border-1 border-gray-300 p-3 text-sm font-semibold">
                        GitHub에서 보기
                        <FiExternalLink aria-hidden="true" />
                    </a>
                </div>

                <dl className="grid grid-cols-2 gap-4 border-t-1 border-gray-300 pt-5 xl:grid-cols-5">
                    {profileStats.map(({ label, value, icon }) => {
                        const Icon = profileStatIcons[icon];
                        return (
                            <div
                                key={label}
                                className="flex min-w-0 flex-col gap-2 p-2">
                                <dt className="flex items-center gap-2 text-xs text-gray-500">
                                    <Icon aria-hidden="true" />
                                    {label}
                                </dt>
                                <dd className="text-xl font-bold">{value}</dd>
                            </div>
                        );
                    })}
                </dl>
            </div>
        </DashboardProfileSectionLayout>
    );
}
