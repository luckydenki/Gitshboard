import { tv, type VariantProps } from "tailwind-variants";

const list_TV = tv({
    base: "hover:bg-back flex items-center justify-center",
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
        <div className="bg-panel absolute top-full left-0 mt-2 w-full items-center justify-center rounded-lg border border-gray-300 text-center shadow-lg">
            {children}
        </div>
    );
}
