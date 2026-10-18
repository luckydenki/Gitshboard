import { EHomeDashboardMenu } from "~/routes/new/home-dashboard";

const NavigationItems = ({
    menu,
    callback,
    checked,
}: {
    menu: string;
    callback: () => void;
    checked: boolean;
}) => {
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
    menuState,
}: {
    menus: Array<{
        menu: string;
        callback: () => void;
    }>;
    menuState: EHomeDashboardMenu;
}) {
    return (
        <section className="border-lg bg-panel flex min-w-sm gap-4 px-4 py-2">
            {menus.map((e) => {
                return (
                    <NavigationItems
                        callback={e.callback}
                        menu={e.menu}
                        checked={EHomeDashboardMenu[menuState] == e.menu}
                        key={e.menu}
                    />
                );
            })}
        </section>
    );
}
