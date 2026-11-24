import type { ReactNode } from "react";

export default function UserDashboardDevelopStyleFullPanelLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <div className="bg-panel col-span-full rounded-lg p-4">{children}</div>;
}
