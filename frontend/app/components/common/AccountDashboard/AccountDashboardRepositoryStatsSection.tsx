export const AccountDashboardRepositoryStatsItem = ({
    label,
    value,
}: {
    label: string;
    value: string | number | undefined;
}) => {
    return (
        <div className="bg-panel flex items-center justify-between rounded-lg p-4">
            <div>{label}</div>
            <div className="text-primary text-2xl font-semibold">{value ?? "—"}</div>
        </div>
    );
};

export const AccountDashboardRepositoryStatsSection = ({
    totalCount,
    totalStars,
    totalForks,
}: {
    totalCount: number | string | undefined;
    totalStars: number | string | undefined;
    totalForks: number | string | undefined;
}) => {
    const items = [
        {
            label: "총 레포 수",
            value: totalCount,
        },
        {
            label: "받은 star 수",
            value: totalStars,
        },
        {
            label: "포크 수",
            value: totalForks,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-3">
            {items.map((e) => {
                return (
                    <AccountDashboardRepositoryStatsItem
                        key={e.label}
                        label={e.label}
                        value={e.value}
                    />
                );
            })}
        </div>
    );
};
