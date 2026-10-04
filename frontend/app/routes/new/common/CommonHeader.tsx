import HeaderDarkModeButton from "./HeaderDarkModeButton";
import HeaderLoginButton from "./HeaderLoginButton";

import HeaderMenu from "./HeaderMenu";

export default function CommonHeader() {
    return (
        <header className="bg-panel flex justify-between px-12 [grid-area:header] not-sm:px-16">
            <HeaderMenu />
            <div className="flex flex-row items-center gap-4">
                <HeaderDarkModeButton />
                <HeaderLoginButton />
            </div>
        </header>
    );
}
