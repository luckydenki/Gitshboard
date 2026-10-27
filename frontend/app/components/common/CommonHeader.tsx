import HeaderDarkModeButton from "./HeaderDarkModeButton";
import HeaderLoginButton from "./LoginButton";

import HeaderMenu from "./HeaderMenu";
import useAuthCheck from "~/hooks/useAuthCheck";

export default function CommonHeader() {
    const { isSuccess } = useAuthCheck();

    if (isSuccess === undefined) {
        console.log("기다려^^");
        return null;
    }

    if (isSuccess) {
        console.log("축하해~");
    }

    return (
        <header className="bg-panel relative flex justify-between px-12 not-sm:px-16">
            <HeaderMenu />
            <div className="flex flex-row items-center gap-4">
                <HeaderDarkModeButton />
                {isSuccess === false ? (
                    <HeaderLoginButton />
                ) : (
                    <div className="relative">
                        <button className="hover:ring-primary flex items-center justify-between gap-2 rounded-full px-4 py-2 ring-1 not-lg:p-1 hover:cursor-pointer hover:ring-2 lg:w-32">
                            <img
                                alt="프로필사진"
                                className="size-6"
                            />
                            <span className="line-clamp-1 not-lg:hidden">김덴덴덴첩덴첩</span>
                        </button>
                        <div className="bg-panel absolute flex w-[calc(100%)] translate-y-4 flex-col items-center border border-gray-300">
                            <div>이동해</div>
                            <a>이동해</a>
                            <a>이동해</a>
                            <a>이동해</a>
                            <a>이동해</a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
