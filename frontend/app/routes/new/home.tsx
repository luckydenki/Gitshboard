import { Navigate } from "react-router";
import useAuthCheck from "~/hooks/useAuthCheck";
import type { Route } from "../../+types/root";
import MainLogo from "./MainLogo";
import HomeSearchBar from "./HomeSearchBar";
import HomeBoardList from "./HomeBoardList";

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

    if (isSuccess) {
        return (
            <Navigate
                to="/dashboard"
                replace={true}
            />
        );
    }

    return (
        <main className="flex flex-col items-center gap-4 px-16 py-32 [grid-area:main] [&>section]:max-w-4xl [&>section]:items-center">
            <section className="relative flex w-full flex-col pb-12">
                <MainLogo />
                <HomeSearchBar />
            </section>

            <section className={"grid w-full [grid-area:section] lg:grid-cols-2 lg:gap-18"}>
                <HomeBoardList boardTitle="깃허브 소식" />
                <HomeBoardList boardTitle="Gitshboard 패치노트" />
                <HomeBoardList boardTitle="니 똥꼬" />
            </section>
        </main>
    );
}
