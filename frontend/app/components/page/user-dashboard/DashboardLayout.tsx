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

interface DashboardLayoutProps {
    dashboardLayouttv?: VariantProps<typeof dashboardLayout_tv>;
    children: React.ReactNode;
}

export const DashboardLayout = ({ dashboardLayouttv, children }: DashboardLayoutProps) => {
    return <main className={dashboardLayout_tv(dashboardLayouttv)}>{children}</main>;
};
