import { useRef } from "react";
import { useGridDrag } from "~/hooks/useGridDrag";

const dragableObjsMock = [
    {
        id: "1",
        text: "우하하",
    },
    {
        id: "2",
        text: "우하하2",
    },
    {
        id: "3",
        text: "우하하3",
    },
    {
        id: "4",
        text: "우하하4",
    },
    {
        id: "5",
        text: "우하하5",
    },
    {
        id: "6",
        text: "우하하6",
    },
    {
        id: "7",
        text: "우하하7",
    },
];

export default function GridDragTest() {
    const elementRecord = useRef<Record<string, Element>>({});
    const { dragableList, onDragEndHandle, onDragOverCaptureHandle, onDragStartHandle } =
        useGridDrag(dragableObjsMock, elementRecord.current, "opacity-50", {
            duration: 150,
            easeing: "ease-in",
        });

    return (
        <>
            <div className="grid h-full grid-cols-4 py-8">
                {dragableList.map((obj) => {
                    return (
                        <div
                            ref={(e) => {
                                if (e) {
                                    elementRecord.current[obj.id] = e;
                                }
                            }}
                            key={obj.id}
                            draggable
                            onDragStart={(e) => onDragStartHandle(e, obj)}
                            onDragOverCapture={(e) => {
                                onDragOverCaptureHandle(e, obj);
                            }}
                            onDragEnd={onDragEndHandle}
                            className={`${obj.id == "6" ? "col-span-2" : ""}`}
                            onDrop={(e) => {}}>
                            <div
                                className={`bg-primary pointer-events-none h-full w-full border hover:border-2`}>
                                {obj.text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
