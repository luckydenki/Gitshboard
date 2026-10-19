import DashboardFollowSection from "./DashboardFollowSection";

interface DashboardProfileArticleProps {
    name: string;
    bio: string;
    location: string;
    link: string[];
    following: number;
    followers: number;
}

export default function DashboardProfileArticle({
    name,
    bio,
    location,
    link,
    following,
    followers,
}: DashboardProfileArticleProps) {
    return (
        <article className="flex min-w-0 items-start justify-between gap-6 not-lg:flex-col">
            <div className="flex min-w-0 gap-4 sm:gap-6">
                <img
                    className="aspect-square size-24 shrink-0 rounded-lg border-1 border-gray-300"
                    alt="profile"
                />
                <div className="flex min-w-0 flex-col gap-3">
                    <h1 className="text-2xl leading-tight font-bold break-words sm:text-3xl">
                        {name}
                    </h1>
                    <div className="max-w-lg text-sm leading-6 break-words text-gray-500">
                        {bio ? (
                            bio
                        ) : (
                            <div className="min-h-16">소개가 없습니다.</div>
                        )}
                    </div>
                    <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sm">
                        <div className="flex min-w-0 gap-2">
                            <span className="shrink-0 text-gray-500">지역</span>
                            <span className="break-words">{location ? location : "Gyeungi Hwasung"}</span>
                        </div>
                        <div className="flex min-w-0 flex-wrap gap-2">
                            <span className="shrink-0 text-gray-500">링크</span>
                            {link.map((v, index) => {
                                return (
                                    <a key={`${v}-${index}`} className="text-primary underline underline-offset-4" href={v}>
                                        Instagram
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <DashboardFollowSection
                following={following}
                followers={followers}
            />
        </article>
    );
}
