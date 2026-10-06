import { useState } from "react";
import HomeSearchBar from "./home/SearchBar";

export default function Search() {
    const [count, setCount] = useState<number>(0);

    return (
        <main className="px-main-side grid grid-rows-[auto_1fr] [grid-area:main]">
            <section className="flex h-fit w-full flex-col items-center justify-center gap-4 py-12">
                <HomeSearchBar enableFilter={true} />
            </section>

            <section className="flex w-full flex-col gap-4 justify-self-center lg:w-[80%]">
                <header>
                    <h2>총 {count} 개의 검색 결과가 있습니다. </h2>
                </header>
                <article className="bg-panel w-full rounded-lg">
                    <a
                        href="#"
                        className="flex w-full justify-center py-2">
                        <img
                            src="/bg.png"
                            alt="ㅇㅋ"
                            className="size-12"
                        />
                        <div>
                            <div> 이름</div>
                            <div> 한줄 소개</div>
                        </div>
                    </a>
                </article>
                <article className="w-full">
                    <img
                        src="#"
                        alt=""
                    />
                    <span> 이름</span>
                    <span> 한줄 소개</span>
                </article>
                <article className="w-full">
                    <img
                        src="#"
                        alt=""
                    />
                    <span> 이름</span>
                    <span> 한줄 소개</span>
                </article>
            </section>
        </main>
    );
}
