import { Navigate } from "react-router";
import useAuthCheck from "~/hooks/useAuthCheck";
import type { Route } from "../../+types/root";
import MainLogo from "./home/MainLogo";
import HomeSearchBar from "./home/SearchBar";
import HomeBoardList from "./home/HomeBoardList";
import useChangeLogRSS from "./useChangeLogRSS";
import useBlogFeedRSS from "./useBlogFeedRSS";
import GitHubBlogBanner from "~/components/page/home-dashboard/GitHubBlogBanner";
import useBlogFeedThumbnail from "./useBlogFeedThumbnail";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "GitHub Dashboard" },
        { name: "description", content: "GitHub Dashboard login" },
    ];
}

/**
 * 홈 화면
 *
 *
 * @returns
 */
export default function Home() {
    const { isSuccess } = useAuthCheck();
    const { data, isLoading } = useChangeLogRSS();

    if (isSuccess) {
        return (
            <Navigate
                to="/dashboard"
                replace={true}
            />
        );
    }

    if (isLoading) return;

    return (
        <main className="flex flex-col items-center gap-4 py-32 [grid-area:main] [&>section]:max-w-7xl [&>section]:items-center">
            <section className="relative flex w-full flex-col pb-12">
                <MainLogo />
                <HomeSearchBar />
            </section>
            <section className="flex flex-col gap-12">
                <GitHubBlogBanner />

                <section className={"grid gap-8 [grid-area:section] lg:grid-cols-2"}>
                    <HomeBoardList
                        boardTitle="깃허브 ChangeLog"
                        data={data ?? []}
                    />
                    <HomeBoardList
                        boardTitle="Gitshboard 패치노트"
                        data={[]}
                    />
                </section>
            </section>
        </main>
    );
}
