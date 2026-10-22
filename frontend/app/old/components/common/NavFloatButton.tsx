import { useState } from "react";
import SpinFloatEffect from "../design/SpinFloatEffect";

export interface NavFloatButtonProps {
    onFetchClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    render_time: number;
}

export function NavFloatButton({ onFetchClick, render_time }: NavFloatButtonProps) {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <button
            className="fixed right-8 bottom-8 h-20 w-20 rounded-full bg-white shadow-md transition-all duration-200 hover:-translate-y-0.5 dark:bg-white"
            onClick={() => {
                setModalOpen((prev) => !prev);
            }}>
            <SpinFloatEffect isModalOpen={isModalOpen} />
            {isModalOpen && (
                <div className="absolute right-8 bottom-22 h-150 w-100 overflow-hidden rounded-2xl border-white bg-[#eef4ff]/60 p-10 shadow-md backdrop-blur-xs">
                    <header className="mb-4 flex flex-col items-baseline gap-2 pb-2">
                        <h1 className="text-2xl font-bold">Fetch Config</h1>
                        <p>Rendering Time: {render_time.toFixed(3)} ms</p>
                        {/* 소수점 아래 3자리까지 표시 */}
                    </header>
                    <section className="flex h-fit flex-col gap-4">
                        <button
                            className={
                                "h-24 w-full rounded-2xl bg-white shadow-md hover:bg-gray-100"
                            }
                            value="1"
                            onClick={onFetchClick}>
                            {" "}
                            Dench Component{" "}
                        </button>
                        <button
                            className="h-24 w-full rounded-2xl bg-white shadow-md hover:bg-gray-100"
                            value="2"
                            onClick={onFetchClick}>
                            {" "}
                            Tanstack Component{" "}
                        </button>
                        <button
                            className="h-24 w-full rounded-2xl bg-white shadow-md hover:bg-gray-100"
                            value="3"
                            onClick={onFetchClick}>
                            {" "}
                            GraphQL Component{" "}
                        </button>
                    </section>
                </div>
            )}
        </button>
    );
}
