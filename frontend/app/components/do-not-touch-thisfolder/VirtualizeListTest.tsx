import { useEffect, useMemo, useRef, useState } from "react";

const datalist = Array.from({ length: 20 }, (_, idx) => {
    return {
        id: idx + 1,
        data: `우하하${idx + 1}`,
        height: 64,
    };
});

/**
 *
 * 필요한 정보
 * 1. 시작 위치                     s
 * 2. 요소의 높이                   h
 * 3. 요소의 간격                   g
 * 4. 요소의 전체 개수              n
 * 5. 한번에 렌더링 되는 요소의 개수 m
 *
    - k번째 위치의 요소 : s + k * (h + g)
 *  - 이것을 감쌀 부모 요소의 높이 : s + n * (h + g)
 *
 * 구상 알고리즘
 * 
 *  1. 우선 부모 요소 안에 시작점 부터 m개의 요소를 렌더링 한다.
 *  2. 화면을 내렸을 때 위에서 벗어나는 요소를 감지하고, 이것을 곧바로 아래로 내려보낸다.
 * 이때 내려보낸 요소의 정보는 리스트의 m+1번째 요소의 정보로 갱신시켜준다.
 *  3. 화면을 올렸을 때 아래에서 벗어나는 요소를 감지하고, 이것을 곧바로 위로 올려보낸다.

 * 
 * - 위 아래로 벗어난 것의 여부는 IntersectionObserver의 intersectionRect.y 값으로 판단한다.
 *  - 위쪽에서 벗어난 경우 intersectionRect.y <= 0 && !isIntersecting
 *  - 아래쪽에서 벗어난 경우 intersectionRect.y > 0 && !isIntersecting
 *
 * @returns
 */
export default function VirtualizeListTest() {
    const poolref = useRef<Array<HTMLElement>>([]);
    const parentref = useRef<HTMLElement>(null);

    const [start, setStart] = useState<number>(0);
    const startidx = useRef<number>(0);
    const [gap, setGap] = useState<number>(8);
    const [data, setData] = useState<Array<(typeof datalist)[0]>>(datalist);
    const length = useMemo(() => {
        return data.reduce((acc, cur, idx) => {
            if (idx == 0) acc += gap;

            acc += cur.height + gap;
            return acc;
        }, 0);
    }, [data]);
    const [maxpool, setMaxPool] = useState<number>(15);

    const isLoading = useRef(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (arr, ob) => {
                if (isLoading.current) {
                    isLoading.current = false;
                    return;
                }

                arr.forEach((e, idx) => {
                    if (e.intersectionRect.y === 0 && !e.isIntersecting) {
                        //위쪽에서 벗어남

                        console.log("위쪽에서 벗어남 ", idx, e.target.innerHTML);
                        const target = e.target as HTMLElement;
                        startidx.current += 1;
                    } else if (e.intersectionRect.y > 0 && !e.isIntersecting) {
                        //아래쪽에서 벗어남
                        //setStart((prev) => prev - 1);
                        console.log("아래쪽에서 벗어남", idx, e.target.innerHTML);
                        const target = e.target as HTMLElement;
                        //target.style.translate = `-50% ${(start - 1) * (data[0].height + gap)}px`;
                    }
                });
            },
            {
                threshold: 0.1,
            },
        );
        poolref.current.forEach((e) => {
            observer.observe(e);
        });
        return () => observer.disconnect();
    }, []);

    console.log("start", start);
    const ListComponent = ({
        startidx,
        endidx,
        marginTop,
    }: {
        startidx: number;
        endidx: number;
        marginTop?: number;
    }) => {
        //endidx가 범위를 벗어나도 slice는 알아서 범위 내로 잘라준다.
        const list = data.slice(startidx, endidx);

        console.log("s, e", startidx, endidx);
        return (
            <div>
                {list.map((e, idx) => {
                    return (
                        <div
                            key={idx}
                            ref={(el) => {
                                if (el) poolref.current[idx] = el;
                            }}
                            style={{
                                top: `${(idx + startidx) * (e.height + gap)}px`,
                                height: `${e.height}px`,
                                marginTop: `${marginTop}px`,
                            }}
                            className="absolute flex w-96 -translate-x-1/2 items-center justify-center border text-2xl">
                            {e.data}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full items-center justify-center p-8">
            <div className="flex h-32 w-full items-center justify-center border text-2xl">시작</div>
            <div
                ref={(e) => {
                    if (e) parentref.current = e;
                }}
                style={{
                    height: `${length}px`,
                }}
                className="relative flex w-full flex-col items-center justify-center border">
                <ListComponent
                    startidx={startidx.current}
                    endidx={startidx.current + maxpool}
                    marginTop={gap}
                />
            </div>
        </div>
    );
}

//알아야 하는 값
//1. 요소의 높이
//2. 이격할 거리 (높이+gap)
