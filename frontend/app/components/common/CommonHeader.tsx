import HeaderDarkModeButton from "./HeaderDarkModeButton";
import HeaderLoginButton from "./LoginButton";

import HeaderMenu from "./HeaderMenu";
import useAuthCheck from "~/hooks/useAuthCheck";
import ListLayout, { ListA } from "./ListLayout";

export default function CommonHeader() {
    const { isSuccess } = useAuthCheck();

    const nickname = "덴첩";

    if (isSuccess === undefined) {
        console.log("기다려^^");
        return null;
    }

    if (isSuccess) {
        console.log("축하해~");
    }

    const MenuList = [
        {
            id: "1",
            value: "내 프로필",
            href: `/user/${nickname}`,
        },
        {
            id: "2",
            value: "내 설정",
            href: "/settings",
        },
    ];

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
                            <span className="line-clamp-1 not-lg:hidden">{nickname}</span>
                        </button>

                        <ListLayout>
                            {MenuList.map((e) => {
                                return (
                                    <ListA
                                        key={e.id}
                                        href={e.href}
                                        value={e.value}
                                    />
                                );
                            })}
                        </ListLayout>
                    </div>
                )}
            </div>
        </header>
    );
}
