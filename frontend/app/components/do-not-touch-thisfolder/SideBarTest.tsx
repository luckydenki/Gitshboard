import { useRef, useState } from "react";
import { BiMenu } from "react-icons/bi";

export default function SideBarTest() {
    const asideRef = useRef<HTMLElement>(null);
    const [sideBarToggle, setSideBarToggle] = useState(false);

    const catchInfo = useRef({
        startX: 0,
        startWidth: 0,
    });

    const onPointerDownHandler = (e: React.PointerEvent<HTMLButtonElement>) => {
        console.log("다운");
        const aside = asideRef.current;

        if (aside) {
            aside.classList.remove("transition-all");
            catchInfo.current.startX = e.clientX;
            catchInfo.current.startWidth = aside.getBoundingClientRect().width;
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    };

    const onPointerMoveHandler = (e: React.PointerEvent<HTMLButtonElement>) => {
        const aside = asideRef.current;
        if (aside && e.currentTarget.hasPointerCapture(e.pointerId)) {
            const diff = e.clientX - catchInfo.current.startX;
            const width = catchInfo.current.startWidth + diff;

            aside.style.setProperty("--sidebar-width", `${width}px`);
        }
    };

    const onPointerUpHandler = (e: React.PointerEvent<HTMLButtonElement>) => {
        console.log("올려");
        const aside = asideRef.current;
        if (aside && e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
            aside.classList.add("transition-all");
        }
    };

    return (
        <>
            <div className="flex h-full">
                <aside
                    ref={asideRef}
                    className="bg-panel @container relative z-1 grid h-full w-(--sidebar-width) grid-rows-[auto_1fr_auto] flex-col border-y border-y-gray-300 px-2 py-4 transition-all"
                    style={
                        {
                            "--sidebar-width": "240px",
                        } as React.CSSProperties
                    }
                    onClick={(e) => {
                        const target = e.target;
                        if (target instanceof HTMLButtonElement && target.id == "reduce-size") {
                            console.log("우하하");
                            e.currentTarget.style.setProperty(
                                "--sidebar-width",
                                sideBarToggle ? "80px" : "240px",
                            );
                            setSideBarToggle((e) => !e);
                        }
                    }}>
                    <button
                        id={"reduce-size"}
                        className="flex rounded-lg border p-2">
                        <img
                            className="size-8"
                            src="#"
                        />
                        <span className="hidden @min-[80px]:block">깃시보드</span>
                    </button>
                    <button
                        className="absolute top-0 right-0 h-full cursor-col-resize border-r-4 border-r-gray-300 hover:border-r-gray-500"
                        onPointerDown={onPointerDownHandler}
                        onPointerMove={onPointerMoveHandler}
                        onPointerUp={onPointerUpHandler}
                        onPointerCancel={onPointerUpHandler}
                    />

                    <div className="flex flex-col items-center gap-4 pt-8">
                        <button className="flex w-full items-center justify-center border-b border-gray-300">
                            <BiMenu size={24} />
                            <span className="hidden @min-[80px]:block">목록 1</span>
                        </button>
                        <button className="flex w-full items-center justify-center">
                            <BiMenu size={24} />
                            <span className="hidden @min-[80px]:block">목록 2</span>
                        </button>
                        <button className="flex w-full items-center justify-center">
                            <BiMenu size={24} />
                            <span className="hidden @min-[80px]:block">목록 3</span>
                        </button>
                    </div>
                </aside>
                <div className="p-8"> 니얼굴이래요 </div>
            </div>
        </>
    );
}
