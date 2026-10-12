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
        <article className="flex justify-between gap-4 not-lg:flex-col">
            <div className="flex gap-4">
                <img
                    className="rounded-xl border border-gray-300"
                    width={100}
                    height={100}
                />
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-semibold"> {name}</h1>
                    <div>
                        {" "}
                        {bio ? (
                            bio
                        ) : (
                            <div className="min-h-16 text-gray-500">소개가 없습니다.</div>
                        )}{" "}
                    </div>
                    <div className="">지역 | {location ? location : "Gyeungi Hwasung"} </div>

                    <div className="flex gap-2">
                        <div> 링크 |</div>
                        <a href={link[0]}>Instagram</a>
                        <a href={link[1]}>Notion</a>
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
