import { useMemo, useState } from "react";
import GridDragTest from "~/components/do-not-touch-thisfolder/GridDragTest";
import InfiniteListTest from "~/components/do-not-touch-thisfolder/InfiniteListTest";
import SideBarTest from "~/components/do-not-touch-thisfolder/SideBarTest";
import VirtualizeListTest from "~/components/do-not-touch-thisfolder/VirtualizeListTest";

export default function Test() {
    const [menuNum, setMenuNum] = useState(0);
    const menus = useMemo(() => {
        return [
            {
                name: "그리드 드래그  테스트",
                render: <GridDragTest />,
            },
            {
                name: "사이드바 테스트",
                render: <SideBarTest />,
            },
            {
                name: "무한 스크롤링 테스트",
                render: <InfiniteListTest />,
            },
            {
                name: "가상 스크롤링 테스트",
                render: <VirtualizeListTest />,
            },
        ];
    }, []);

    const record: Record<number, React.JSX.Element> = {};
    menus.forEach((e, idx) => {
        record[idx] = e.render;
    });

    return (
        <main className="p-0">
            <nav className="bg-panel fixed right-0 z-1 flex h-fit gap-4 rounded-lg p-4 shadow-md">
                {menus.map((e, idx) => {
                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                setMenuNum(idx);
                            }}
                            className="w-48 border p-1">
                            {e.name}
                        </button>
                    );
                })}
            </nav>

            {record[menuNum]}
        </main>
    );
}
