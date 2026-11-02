import { FiExternalLink, FiLink, FiMapPin, FiUser } from "react-icons/fi";
import UserDashboardFollowSection from "./UserDashboardFollowSection";

interface UserDashboardProfileArticleProps {
    login: string;
    name: string;
    bio: string;
    location: string;
    link: string[];
    following: number;
    followers: number;
    url: string;
    avatarUrl: string;
}

export default function UserDashboardProfileArticle({
    login,
    name,
    bio,
    location,
    link,
    following,
    followers,
    url,
    avatarUrl,
}: UserDashboardProfileArticleProps) {
    const githubUrl = url || `https://github.com/${encodeURIComponent(login)}`;

    return (
        <article className="flex min-w-0 flex-col gap-6 pb-8">
            <div className="flex min-w-0 items-start justify-between gap-6 not-lg:flex-col">
                <div className="flex min-w-0 items-start gap-5 not-sm:flex-col">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={`${name} 프로필 이미지`}
                            className="size-24 shrink-0 rounded-lg border-1 border-gray-300 object-cover"
                        />
                    ) : (
                        <div
                            role="img"
                            aria-label="프로필 이미지 없음"
                            className="flex size-24 shrink-0 items-center justify-center rounded-lg border-1 border-gray-300 text-gray-500">
                            <FiUser aria-hidden="true" className="size-8" />
                        </div>
                    )}

                    <div className="flex min-w-0 flex-col gap-3">
                        <span className="text-sm text-gray-500">@{login}</span>
                        <h1 className="text-2xl leading-tight font-bold break-words sm:text-3xl">
                            {name}
                        </h1>
                        <p className="max-w-3xl text-sm leading-6 break-words text-gray-500">
                            {bio || "소개가 없습니다."}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <FiMapPin aria-hidden="true" className="shrink-0" />
                                {location || "지역 정보 없음"}
                            </span>
                            {link.map((value, index) => (
                                <a
                                    key={`${value}-${index}`}
                                    href={value}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary flex min-w-0 items-center gap-2 hover:underline">
                                    <FiLink aria-hidden="true" className="shrink-0" />
                                    <span className="max-w-56 truncate">
                                        {value.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:border-primary flex shrink-0 items-center gap-2 rounded-lg border-1 border-gray-300 p-3 text-sm font-semibold">
                    GitHub에서 보기
                    <FiExternalLink aria-hidden="true" />
                </a>
            </div>

            <UserDashboardFollowSection
                following={following}
                followers={followers}
            />
        </article>
    );
}
