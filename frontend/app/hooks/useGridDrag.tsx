import { useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 *
 * grid, flex 등 레이아웃에서 드래그로 위치를 바꿀 수 있는 훅입니다.
 *
 *
 * @param dragableArray 드래그 가능한 배열, `Array<{id:string}>`으로 반드시 id 필드가 있어야 함.
 * @returns
 */
export const useGridDrag = (
    dragableArray: Array<{ id: string } & Record<string, any>>,
    dragableElements: Record<string, Element>,
    dragStyle?: string,
    animationOption?: {
        duration: number;
        easeing?: string;
        delay?: number;
    },
) => {
    const dragId = useRef<string>("");
    const overId = useRef<string>("");
    const dragIdx = useRef<number>(0);
    const overIdx = useRef<number>(0);
    const dragelement = useRef<Element>(null);
    const overelement = useRef<Element>(null);

    const isAnimateListArray = useMemo(() => {
        const record: Record<string, boolean> = {};
        dragableArray.forEach((e) => {
            record[e.id] = false;
        });
        return record;
    }, []);

    const [dragableList, setDragableList] = useState(dragableArray);
    const isAnimateRecord = useRef<Record<string, boolean>>(isAnimateListArray);
    const moveElements = useRef<Array<{ id: string; element: Element }>>([]);
    const distVectors = useRef<
        Array<{ id: string; element: Element; x: number; y: number } | undefined>
    >([]);

    const replace = (dragId: string, overId: string) => {
        const dragidx = dragableList.findIndex((e) => {
            return e.id == dragId;
        });
        const overidx = dragableList.findIndex((e) => {
            return e.id == overId;
        });

        dragIdx.current = dragidx;
        overIdx.current = overidx;

        let a = overidx;
        let b = dragidx;
        if (a < b) {
            for (let i = a; i <= b; ++i) {
                moveElements.current.push({
                    id: dragableList[i].id,
                    element: dragableElements[dragableList[i].id],
                });
            }
        } else {
            for (let i = a; i >= b; --i) {
                moveElements.current.push({
                    id: dragableList[i].id,
                    element: dragableElements[dragableList[i].id],
                });
            }
        }

        distVectors.current = moveElements.current.map((e, idx, arr) => {
            if (idx == arr.length - 1) return;

            const rect1 = arr[idx].element.getBoundingClientRect();
            const rect2 = arr[idx + 1].element.getBoundingClientRect();

            return {
                id: e.id,
                element: e.element,
                x: rect1.x - rect2.x,
                y: rect1.y - rect2.y,
            };
        });

        console.log(moveElements.current);

        let newList = [...dragableList];
        const [item] = newList.splice(dragidx, 1); //밀어내기 로직
        newList.splice(overidx, 0, item);
        setDragableList(newList);
    };

    const onDragStartHandle = (e: React.DragEvent<HTMLDivElement>, obj: { id: string }) => {
        dragId.current = obj.id; //쥐고 있는 오브젝트 id
        dragelement.current = e.currentTarget;
        const element = e.currentTarget;
        e.dataTransfer.setDragImage(element, element.offsetWidth / 2, element.offsetHeight / 2);
        if (dragStyle) element.classList.add(dragStyle);
    };

    const onDragEndHandle = (e: React.DragEvent<HTMLDivElement>) => {
        dragId.current = "";
        const element = e.currentTarget;
        if (dragStyle) element.classList.remove(dragStyle);
    };

    const onDragOverCaptureHandle = (e: React.DragEvent, obj: { id: string }) => {
        e.preventDefault();
        if (dragId.current == obj.id || !dragId.current) return; //자기 자신에는 dragOver가 발생하지 않음
        if (isAnimateRecord.current[overId.current]) return;

        overId.current = obj.id; //over된 오브젝트 id
        overelement.current = e.currentTarget;

        replace(dragId.current, overId.current);
    };

    useLayoutEffect(() => {
        if (!overelement.current || !dragelement.current) return;
        if (!isAnimateRecord.current) return;
        if (!moveElements.current) return;

        moveElements.current = [];

        distVectors.current.forEach((e) => {
            if (!e) return;
            isAnimateRecord.current[e.id] = true;
            const ani = e.element.animate(
                [{ transform: `translateX(${e.x}px)` }, { transform: "translateX(0)" }],
                {
                    duration: animationOption?.duration,
                    easing: animationOption?.easeing,
                    delay: animationOption?.delay,
                },
            );
            ani.onfinish = () => {
                isAnimateRecord.current[e.id] = false;
            };
        });

        console.log("dragableList의 변경");
    }, [dragableList]);

    return { dragableList, onDragStartHandle, onDragOverCaptureHandle, onDragEndHandle };
};
