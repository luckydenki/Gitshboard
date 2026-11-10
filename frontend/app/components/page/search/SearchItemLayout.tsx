import type { ReactNode } from "react";
import { Link } from "react-router";
import { FiExternalLink, FiStar } from "react-icons/fi";

interface SearchItemLayoutProps {
    avatarUrl: string;
    avatarAlt: string;
    title: string;
    badge: string;
    dashboardUrl: string;
    githubUrl: string;
    description?: string | null;
    stars?: number;
    starsLabel?: string;
    updatedAt?: string;
    children?: ReactNode;
}

export default function SearchItemLayout({
    avatarUrl,
    avatarAlt,
    title,
    badge,
    dashboardUrl,
    githubUrl,
    description,
    stars,
    starsLabel = "Star",
    updatedAt,
    children,
}: SearchItemLayoutProps) {
    return (
        <article className="bg-panel relative flex w-full items-center gap-4 rounded-lg border border-gray-300 p-4 hover:outline hover:outline-primary not-sm:flex-wrap not-sm:items-start">
            <img
                src={avatarUrl}
                alt={avatarAlt}
                loading="lazy"
                className="aspect-square size-16 shrink-0 rounded-lg border border-gray-300"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <h4 className="min-w-0 text-lg font-bold">
                        <Link
                            to={dashboardUrl}
                            className="focus-visible:after:outline-primary line-clamp-1 after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2">
                            {title}
                        </Link>
                    </h4>
                    <span className="text-primary rounded-lg text-xs font-medium">{badge}</span>
                </div>
                {children && (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        {children}
                    </div>
                )}
                {description !== undefined && (
                    <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                        {description || "소개가 없습니다"}
                    </p>
                )}
                {(stars !== undefined || updatedAt) && (
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {stars !== undefined && (
                            <span className="flex items-center gap-1">
                                <FiStar aria-hidden="true" />
                                {starsLabel} {stars.toLocaleString("ko-KR")}
                            </span>
                        )}
                        {updatedAt && (
                            <span>
                                최근 업데이트{" "}
                                <time dateTime={updatedAt}>
                                    {new Date(updatedAt).toLocaleDateString("ko-KR", {
                                        timeZone: "Asia/Seoul",
                                    })}
                                </time>
                            </span>
                        )}
                    </div>
                )}
            </div>
            <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary relative z-10 flex shrink-0 items-center justify-center gap-1 rounded-lg p-2 text-sm font-medium hover:underline">
                GitHub에서 보기 <FiExternalLink aria-hidden="true" />
            </a>
        </article>
    );
}
