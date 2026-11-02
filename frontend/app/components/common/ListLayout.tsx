import { tv, type VariantProps } from "tailwind-variants";

const list_TV = tv({
    base: "hover:bg-back flex w-full items-center justify-center",
    variants: {
        height: {
            md: "h-10",
            sm: "h-8",
            lg: "h-12",
        },
        text: {
            sm: "text-sm",
            md: "text-md",
            lg: "text-lg",
        },
    },
    defaultVariants: {
        height: "md",
        text: "md",
    },
});

type listTVType = VariantProps<typeof list_TV>;

export const ListButton = ({
    value,
    callback,
    listtv,
}: {
    value: string;
    callback: () => void;
    listtv?: listTVType;
}) => {
    console.log("callback", callback);
    return (
        <button
            className={list_TV(listtv)}
            onClick={callback}>
            {value}
        </button>
    );
};

export const ListA = ({
    value,
    href,
    listtv,
}: {
    value: string;
    href: string;
    listtv?: listTVType;
}) => {
    return (
        <a
            className={list_TV(listtv)}
            href={href}>
            {value}
        </a>
    );
};

export default function ListLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-panel absolute top-full z-1 mt-2 w-full min-w-24 items-center justify-center rounded-lg border border-gray-300 text-center text-nowrap shadow-lg not-lg:right-0 lg:left-0">
            {children}
        </div>
    );
}
