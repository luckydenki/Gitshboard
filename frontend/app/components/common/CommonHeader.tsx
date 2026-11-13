import HeaderDarkModeButton from "./HeaderDarkModeButton";
import HeaderLoginButton from "./LoginButton";
import HeaderMenu from "./HeaderMenu";
import HeaderProfileButton from "./HeaderProfileButton";
import useAuthCheck from "~/hooks/useAuthCheck";

export default function CommonHeader() {
    const { isSuccess } = useAuthCheck();

    return (
        <header className="bg-panel relative flex justify-between px-12 not-sm:px-16">
            <HeaderMenu />
            <div className="flex flex-row items-center gap-4">
                <HeaderDarkModeButton />
                {isSuccess === true ? <HeaderProfileButton /> : <HeaderLoginButton />}
            </div>
        </header>
    );
}
