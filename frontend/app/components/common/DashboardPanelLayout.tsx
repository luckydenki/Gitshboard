import type { ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const panelLayoutTV = tv({
    slots: {
        panel: "flex min-w-0 flex-col gap-2",
        header: "",
        title: "",
        semititle: "",
        content: "min-w-0",
        footer: "mt-auto",
    },
    variants: {
        appearance: {
            default: {
                panel: "bg-panel rounded-lg border-0 p-4",
                title: "text-xl font-semibold",
                semititle: "text-sm text-gray-500",
                footer: "text-sm text-gray-500",
            },
        },
    },
    defaultVariants: { appearance: "default" },
});

type DashboardPanelLayoutProps = VariantProps<typeof panelLayoutTV> & {
    title: ReactNode;
    semititle?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
};

export default function DashboardPanelLayout({
    title,
    semititle,
    footer,
    children,
    appearance,
}: DashboardPanelLayoutProps) {
    const styles = panelLayoutTV({ appearance });
    return (
        <section className={styles.panel()}>
            <header className={styles.header()}>
                <h3 className={styles.title()}>{title}</h3>
                {semititle != null && <div className={styles.semititle()}>{semititle}</div>}
            </header>
            <div className={styles.content()}>{children}</div>
            {footer != null && <footer className={styles.footer()}>{footer}</footer>}
        </section>
    );
}
