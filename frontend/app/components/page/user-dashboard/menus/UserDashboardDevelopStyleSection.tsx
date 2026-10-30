import {
    weeklyActivityMock,
    workTypesMock,
    developStyleTopPanelsMock,
    collaborationStatsMock,
    developStyleSummaryMock,
} from "~/mock/home-dashboard/dashboard-develop-style";
import { useRef, useState } from "react";
import UserDashboardDevelopStyleActivityRhythm from "../UserDashboardDevelopStyleActivityRhythm";
import UserDashboardDevelopStyleCodeStyle from "../UserDashboardDevelopStyleCodeStyle";
import UserDashboardDevelopStyleCollaborationStyle from "../UserDashboardDevelopStyleCollaborationStyle";
import { useGridDrag } from "~/hooks/useGridDrag";

interface TopPanel {
    id: string;
    title: string;
    description: string;
    from: string;
    to: string;
    isLoading: boolean;
    elementsMap: Record<string, Element>;
}

export type Div = React.ComponentPropsWithRef<"div">;

export type TopPanelProps = TopPanel & Div;

const TopPanel = ({
    id,
    title,
    description,
    from,
    to,
    isLoading,
    elementsMap,
    draggable,
    ...props
}: TopPanelProps) => {
    return (
        <div
            draggable={draggable}
            ref={(e) => {
                if (e) elementsMap[id] = e;
            }}
            className={`bg-panel ${draggable ? "hover:outline-primary hover:outline-1" : ""} flex flex-col gap-2 rounded-lg px-4 py-4`}
            {...props}>
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <span className="text-sm text-gray-500">{description}</span>
            </div>
            <div
                className={
                    isLoading
                        ? `flex h-52 animate-pulse items-center justify-center rounded-lg bg-gray-200`
                        : `bg-panel flex h-52 items-center justify-center`
                }></div>
            <div className="text-sm text-gray-500">
                분석 기간 {from} ~ {to}
            </div>
        </div>
    );
};

export default function UserDashboardDevelopStyleSection() {
    const [isLoading, setIsLoading] = useState(false);
    const dragElements = useRef<Record<string, Element>>({});

    const { dragableList, onDragEndHandle, onDragOverCaptureHandle, onDragStartHandle } =
        useGridDrag(developStyleTopPanelsMock, dragElements.current, "opacity-50", {
            duration: 150,
            easeing: "ease-in",
        });

    const [draggable, setDraggable] = useState<boolean>(false);

    return (
        <section>
            <label className="flex gap-2">
                패널 옮기기
                <input
                    type="checkbox"
                    onChange={(e) => {
                        setDraggable((i) => !i);
                    }}
                />
            </label>
            <section className="grid min-w-sm grid-cols-3 gap-8 not-lg:grid-cols-1">
                {dragableList.map((e) => {
                    return (
                        <TopPanel
                            key={e.id}
                            id={e.id}
                            draggable={draggable}
                            elementsMap={dragElements.current}
                            title={e.title}
                            description={e.description}
                            from={e.from}
                            to={e.to}
                            isLoading={isLoading}
                            onDragStart={(d) => {
                                onDragStartHandle(d, e);
                            }}

                            onDragOverCapture={(d) => {
                                onDragOverCaptureHandle(d, e);
                            }}

                            onDragEnd={(d) => {
                                onDragEndHandle(d);
                            }}
                        />
                    );
                })}

                <UserDashboardDevelopStyleActivityRhythm />
                <UserDashboardDevelopStyleCodeStyle />
                <UserDashboardDevelopStyleCollaborationStyle />
            </section>

            {/* 아래 내용은 개발 성향 화면을 위한 예시 데이터입니다. */}
            <section
                aria-labelledby="develop-style-preview"
                className="mt-12 flex min-w-0 flex-col gap-6">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <article className="bg-panel flex-1 rounded-lg border-1 border-gray-300 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-primary text-xs font-semibold tracking-wide">
                                    ACTIVITY RHYTHM
                                </p>
                                <h3 className="mt-2 text-lg font-bold text-inherit">활동 리듬</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    언제 가장 활발하게 활동할까요?
                                </p>
                            </div>
                            <span className="bg-primary/10 text-primary rounded-lg px-3 py-2 text-xs font-semibold">
                                요일별
                            </span>
                        </div>
                        <div className="bg-primary/10 mt-6 rounded-lg px-4 py-3 text-sm text-gray-500">
                            <span className="text-primary font-semibold">{developStyleSummaryMock.peakDayLabel}</span>에 가장 많은
                            활동을 기록했어요.
                        </div>
                        <div
                            className="mt-6 flex h-36 items-end justify-around gap-3"
                            aria-label="요일별 예시 활동 수">
                            {weeklyActivityMock.map((item) => (
                                <div
                                    key={item.day}
                                    className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                    <span className="text-xs font-medium text-gray-500">
                                        {item.count}
                                    </span>
                                    <div
                                        className={`w-full max-w-8 rounded-lg ${item.day === developStyleSummaryMock.peakDay ? "bg-primary" : "bg-primary/15"}`}
                                        style={{ height: `${(item.count / developStyleSummaryMock.peakActivityCount) * 100}px` }}
                                    />
                                    <span className="text-xs text-gray-500">{item.day}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-xs leading-5 text-gray-500">
                            예시 활동 {developStyleSummaryMock.activityCount}건 · 커밋, PR, 이슈, 리뷰 기준
                        </p>
                    </article>

                    <article className="bg-panel flex-1 rounded-lg border-1 border-gray-300 p-6">
                        <div>
                            <p className="text-primary text-xs font-semibold tracking-wide">
                                WORK PATTERNS
                            </p>
                            <h3 className="mt-2 text-lg font-bold text-inherit">
                                어떤 작업을 많이 할까요?
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                PR의 주요 목적을 기준으로 살펴봐요.
                            </p>
                        </div>
                        <div
                            className="mt-6 flex h-3 overflow-hidden rounded-lg bg-gray-300"
                            aria-label="작업 유형별 예시 PR 수">
                            {workTypesMock.map((item) => (
                                <div
                                    key={item.label}
                                    className={item.color}
                                    style={{ width: `${(item.count / developStyleSummaryMock.pullRequestCount) * 100}%` }}
                                />
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col gap-4">
                            {workTypesMock.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2.5 w-2.5 rounded-lg ${item.color}`}
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm text-gray-500">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-inherit">
                                        {item.count}건
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-primary/10 mt-6 rounded-lg px-4 py-3 text-sm leading-6 text-gray-500">
                            <span className="text-primary font-semibold">{developStyleSummaryMock.primaryWorkType}</span>와 함께
                            기존 코드 개선에도 시간을 쓰고 있어요.
                        </div>
                        <p className="mt-5 text-xs leading-5 text-gray-500">
                            예시 PR {developStyleSummaryMock.pullRequestCount}건 · 작업 유형 분류는 추후 분석 결과를 연결할 수 있어요.
                        </p>
                    </article>
                </div>

                <article className="bg-panel flex-1 rounded-lg border-1 border-gray-300 p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-primary text-xs font-semibold tracking-wide">
                                COLLABORATION
                            </p>
                            <h3 className="mt-2 text-lg font-bold text-inherit">
                                함께 만드는 방식
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                코드 작성부터 리뷰까지, 협업에서 보이는 나의 모습이에요.
                            </p>
                        </div>
                        <span className="rounded-lg bg-gray-300 px-3 py-2 text-xs font-medium text-gray-500">
                            예시 데이터
                        </span>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        {collaborationStatsMock.map((item) => (
                            <div
                                key={item.title}
                                className="bg-panel flex-1 rounded-lg border-1 border-gray-300 p-4">
                                <span
                                    className={`inline-flex rounded-lg px-2 py-2 text-xs font-semibold ${item.color}`}>
                                    {item.title}
                                </span>
                                <p className="mt-4 text-2xl font-bold text-inherit">
                                    {item.number}
                                    <span className="ml-0.5 text-sm font-medium text-gray-500">
                                        {item.unit}
                                    </span>
                                </p>
                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                    {item.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </article>

                <p className="text-xs leading-5 text-gray-500">
                    이 화면의 수치와 성향은 디자인을 위한 예시입니다. GitHub 기록은 실제 개발 활동의
                    일부만 보여줍니다.
                </p>
            </section>
        </section>
    );
}
