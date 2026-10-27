import { useMemo, useRef, useState } from "react";

export function CommonBackground() {
    const divref = useRef<HTMLDivElement>(null);

    const images = useMemo(() => {
        return ["/bg.webp", "/bg-paper.jpg"];
    }, []);

    const [idx, setIdx] = useState<number>(0);

    return (
        <div className="relative h-56 w-full">
            <div
                ref={divref}
                className="absolute h-full w-full bg-cover bg-center p-4"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            to bottom,
                            transparent,
                            rgba(0, 0, 0, 0.8)
                        ),
                        url("${images[idx]}")
                        `,
                }}>
                <button
                    className="flex rounded-lg bg-white p-2 active:scale-90"
                    onClick={() => {
                        setIdx((e) => {
                            console.log("찍지마좀");
                            return (e + 1) % 2;
                        });
                    }}>
                    우하하
                </button>
            </div>
        </div>
    );
}
