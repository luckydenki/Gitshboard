const NavigationItems = ({ menu, callback }: { menu: string; callback: () => void }) => {
    return (
        <button
            className="h-8 w-24 cursor-pointer rounded-lg hover:bg-gray-200"
            onClick={callback}>
            {menu}
        </button>
    );
};

/**
 *
 * @returns
 */
export default function DashboardNavigationSection({
    menus,
}: {
    menus: Array<{
        menu: string;
        callback: () => void;
    }>;
}) {
    return (
        <section className="border-lg bg-panel flex gap-4 px-4 py-2">
            {menus.map((e) => {
                return (
                    <NavigationItems
                        callback={e.callback}
                        menu={e.menu}
                    />
                );
            })}
        </section>
    );
}
