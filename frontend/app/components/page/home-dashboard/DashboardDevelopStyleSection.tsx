import { useState } from "react";

const TopPanel = ({
    title,
    description,
    from,
    to,
    isLoading,
}: {
    title: string;
    description: string;
    from: string;
    to: string;
    isLoading: boolean;
}) => {
    return (
        <div className="bg-panel flex flex-col gap-2 rounded-lg px-4 py-2">
            <div>
                <h3 className="text-xl">{title}</h3>
                <span className="text-sm text-gray-500">{description}</span>
            </div>
            <div
                className={
                    isLoading
                        ? `flex h-52 animate-pulse items-center justify-center rounded-lg bg-gray-200`
                        : `bg-panel flex h-52 items-center justify-center`
                }></div>
            <div className="text-sm text-gray-500">
                {" "}
                분석 기간 {from} ~ {to}
            </div>
        </div>
    );
};

export default function DashboardDevelopStyleSection() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <section className="grid min-w-sm grid-cols-3 gap-8 not-lg:grid-cols-1">
            {/* <div className="preferencebox-border col-span-full flex flex-col rounded-lg border-2 border-transparent px-4 pt-4 pb-8">
                <div className="text-xl">나의 주 성향은...</div>
                <div className="self-center text-3xl">꾸준한 기여자</div>
            </div> */}

            <TopPanel
                title="주 사용 언어"
                description="자주 사용하는 언어 top 5"
                from="2025-10-17"
                to="2026-10-17"
                isLoading={isLoading}
            />
            <TopPanel
                title="주 관심사"
                description="주요 관심 기술 top 3"
                from="2025-10-17"
                to="2026-10-17"
                isLoading={isLoading}
            />

            <TopPanel
                title="주 사용 언어"
                description="자주 사용하는 언어 top 5"
                from="2025-10-17"
                to="2026-10-17"
                isLoading={isLoading}
            />

            <div className="bg-panel col-span-full rounded-lg px-4 py-2">
                <h3 className="text-xl">활동 시간 분석</h3>
                <div>
                    시간대 별 활동
                    <span className="text-sm text-gray-500">
                        오전·오후·저녁·밤 중 활동이 많은 시간
                    </span>
                </div>

                <div>
                    요일 별 활동
                    <span className="text-sm text-gray-500">평일과 주말, 요일별 활동 분포</span>
                </div>

                <div>
                    기간 별 성향 변화
                    <span className="text-sm text-gray-500">
                        이전 기간과 비교해 활동 시간이나 방식이 어떻게 변했는지
                    </span>
                </div>
            </div>

            <div className="bg-panel py- col-span-full rounded-lg px-4 py-2">
                <h3 className="text-xl">코드 스타일</h3>
            </div>

            <div className="bg-panel py- col-span-full rounded-lg px-4 py-2">
                <h3 className="text-xl">협업 스타일</h3>
            </div>
        </section>
    );
}
