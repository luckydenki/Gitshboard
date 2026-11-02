import type { Route } from "../+types/root";
import MainLogo from "../components/page/home/MainLogo";
import HomeSearchBar from "../components/page/home/SearchBar";
import HomeBoardList from "../components/page/home/HomeBoardList";
import useChangeLogRSS from "../hooks/useChangeLogRSS";
import GitHubBlogBanner from "~/components/page/home/GitHubBlogBanner";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Gitshboard" }, { name: "description", content: "GitHub Dashboard login" }];
}

/**
 * 홈 화면
 *
 *
 * @returns
 */
export default function Home() {
    const { data, isLoading } = useChangeLogRSS();

    if (isLoading) return;

    return (
        <main className="flex flex-col items-center gap-4 py-32 [grid-area:main] [&>section]:items-center">
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
