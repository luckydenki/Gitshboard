import { tv, type VariantProps } from "tailwind-variants";

const dashboardLayout_tv = tv({
    base: "relative flex w-full min-w-0 flex-col gap-8 pt-8 pb-8",
    variants: {
        background: {
            bg: "-mt-32",
            none: "",
        },
    },
    defaultVariants: {
        background: "bg",
    },
});

interface UserDashboardLayoutProps {
    dashboardLayouttv?: VariantProps<typeof dashboardLayout_tv>;
    children: React.ReactNode;
}

export const DashboardLayout = ({ dashboardLayouttv, children }: UserDashboardLayoutProps) => {
    return <main className={dashboardLayout_tv(dashboardLayouttv)}>{children}</main>;
};

export const AccountDashboardProfileSectionLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <section className="bg-panel min-w-0 px-8 pt-8">{children}</section>;
};

export const AccountDashboardProfileArticleLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <article className="flex min-w-0 flex-col gap-6 pb-8">{children}</article>;
};
