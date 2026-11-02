import { useEffect, useRef, useState } from "react";
import { VscLoading } from "react-icons/vsc";

const list = [
    {
        id: 1,
        data: "우하하1",
    },
    {
        id: 2,
        data: "우하하2",
    },
    {
        id: 3,
        data: "우하하3",
    },
    {
        id: 4,
        data: "우하하4",
    },
    {
        id: 5,
        data: "우하하5",
    },
    {
        id: 6,
        data: "우하하6",
    },
    {
        id: 7,
        data: "우하하7",
    },
    {
        id: 8,
        data: "우하하8",
    },
    {
        id: 9,
        data: "우하하9",
    },
    {
        id: 10,
        data: "우하하10",
    },
];

export default function InfiniteListTest() {
    const [renderList, setRenderList] = useState(() => list.slice(0, 10));
    const [isLoading, setIsLoading] = useState(false);
    const [cluster, setCluster] = useState(0);

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (e) => {
                let timeout;
                if (e[0].isIntersecting && !isLoading) {
                    setIsLoading(true);
                    console.log("로딩중!");
                    timeout = setTimeout(() => {
                        console.log("후하하");
                        const slicelist = list.slice(1, 10);
                        setIsLoading(false);
                        setRenderList([...renderList, ...slicelist]);
                    }, 1000);
                }
            },
            {
                threshold: 1.0,
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isLoading]);

    return (
        <>
            <div className="w-full py-8">
                <div className="flex h-42 w-full items-center justify-center">큰 섹션</div>
                <div className="flex flex-col items-center gap-4">
                    {renderList.map((e, idx) => {
                        return (
                            <div
                                key={idx}
                                className="bg-panel flex h-14 w-[50%] items-center justify-center rounded-lg border border-gray-300">
                                {e.data}
                            </div>
                        );
                    })}

                    <div
                        ref={(e) => {
                            ref.current = e;
                        }}
                        className="flex min-h-36 w-full items-center justify-center border">
                        {isLoading && (
                            <VscLoading
                                className="animate-spin"
                                size={28}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
