import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import SideTitleLogo from "~/components/design/SideTitleLogo";
import { tv, type VariantProps } from "tailwind-variants";

interface MenuListProps {
    menuData: Array<{
        name: string;
        href: string;
    }>;
    menuItemType: VariantProps<typeof tv_MenuListItem>;
}

interface MenuListItemProps {
    name: string;
    href: string;
    menuItemType: VariantProps<typeof tv_MenuListItem>;
}

const tv_MenuListItem = tv({
    slots: {
        ul: "",
        li: "",
        a: "",
    },
    variants: {
        placed: {
            row: {
                ul: "flex h-full items-stretch gap-4 whitespace-nowrap not-sm:hidden [&>li]:w-12 [&>li]:items-center [&>li]:justify-center [&>li]:px-4",
                li: "hover:after:bg-primary relative flex w-12 items-center justify-center px-4 font-medium after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:transition-all after:content-[''] hover:after:w-full",
            },
            col: {
                ul: "absolute mt-4 flex w-24 flex-col items-center gap-1 rounded-lg border border-gray-300 bg-white text-lg",
                li: "hover:bg-back w-full",
                a: "block w-full",
            },
        },
    },
});

const MenuList = ({ menuData, menuItemType }: MenuListProps) => {
    const { ul } = tv_MenuListItem(menuItemType);
    return (
        <ul className={ul()}>
            {menuData.map((value) => {
                return (
                    <MenuListItem
                        href={value.href}
                        name={value.name}
                        menuItemType={menuItemType}
                        key={value.name}
                    />
                );
            })}
        </ul>
    );
};

const MenuListItem = ({ name, href, menuItemType }: MenuListItemProps) => {
    const { a, li } = tv_MenuListItem(menuItemType);
    return (
        <li className={li()}>
            <a
                className={a()}
                href={href}>
                {name}
            </a>
        </li>
    );
};

export interface HeaderMenuProps {
    logoRedirect?: string;
}

export default function HeaderMenu({ logoRedirect }: HeaderMenuProps) {
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

    const menuData = [
        {
            name: "홈",
            href: "#",
        },
        {
            name: "트렌드",
            href: "#",
        },
        {
            name: "검색",
            href: "#",
        },
        {
            name: "커뮤니티",
            href: "#",
        },
    ];

    return (
        <nav className="flex h-full sm:gap-12">
            <SideTitleLogo href={logoRedirect ?? "test/home"} />
            <MenuList
                menuData={menuData}
                menuItemType={{
                    placed: "row",
                }}
            />

            <button
                className="relative z-1 cursor-pointer *:sm:hidden"
                onBlur={() => setIsHeaderMenuOpen(false)}
                onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}>
                <BiMenu size={32} />

                {isHeaderMenuOpen && (
                    <MenuList
                        menuData={menuData}
                        menuItemType={{
                            placed: "col",
                        }}
                    />
                )}
            </button>
        </nav>
    );
}
