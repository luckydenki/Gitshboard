import { Link } from "react-router";
import { EHomeDashboardMenu } from "~/routes/user-dashboard";

const NavigationItems = ({ menu, link }: { menu: string; link: string }) => {
    return (
        <Link
            to={link}
            className="flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-200">
            {menu}
        </Link>
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
        link: string;
    }>;
}) {
    return (
        <section className="border-lg bg-panel flex min-w-sm gap-4 px-4 py-2">
            {menus.map((e) => {
                return (
                    <NavigationItems
                        link={e.link}
                        menu={e.menu}
                        key={e.menu}
                    />
                );
            })}
        </section>
    );
}
