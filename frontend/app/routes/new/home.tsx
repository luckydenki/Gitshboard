import { Navigate } from "react-router";
import useAuthCheck from "~/hooks/useAuthCheck";
import type { Route } from "../../+types/root";
import SearchForm from "~/components/page/home/SearchForm";
import { BiUser } from "react-icons/bi";
import SideProfile from "~/components/page/dashboard/SideProfile";
import SideTitleLogo from "~/components/design/SideTitleLogo";

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
        <div className='grid h-screen w-screen grid-rows-[60px_9fr_1fr] [grid-template-areas:"header_header_header"_"main_main_main"_"footer_footer_footer"]'>
            <header className="flex items-center justify-between bg-gray-400 px-24 [grid-area:header]">
                <div className="flex gap-12">
                    <SideTitleLogo href="/test/home" />
                    <ul className="flex gap-4">
                        <li className="font-medium">
                            <a href="#">Menu Item 1</a>
                        </li>
                        <li className="font-medium">
                            <a href="#">Menu Item 2</a>
                        </li>
                        <li className="font-medium">
                            <a href="#">Menu Item 3</a>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-row-reverse gap-4">
                    <button
                        className={`rounded-full bg-black p-2 text-white hover:scale-110 hover:transition-transform hover:duration-200`}
                        aria-label="Login-button">
                        <BiUser color="gainsboro" />
                    </button>
                    <input type="checkbox" />
                </div>
            </header>
            <main className="flex flex-col items-center justify-center [grid-area:main]">
                <SearchForm />
            </main>
            <footer className={"[grid-area:footer]"}>
                <div>풋터</div>
            </footer>
        </div>
    );
}
