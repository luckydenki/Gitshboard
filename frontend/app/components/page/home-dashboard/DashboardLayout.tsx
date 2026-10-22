export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="px-main-x-side flex w-full min-w-0 flex-col gap-8 pt-8 pb-8">
            {children}
        </main>
    );
};
