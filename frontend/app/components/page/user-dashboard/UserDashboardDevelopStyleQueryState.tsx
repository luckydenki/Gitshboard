import PanelLayout from "~/components/common/DashboardPanelLayout";
import UpcomingBackdrop from "~/components/common/UpcomingBackdrop";
import PanelError from "~/components/common/PanelError";
import LoadingSpinner from "~/components/common/LoadingSpinner";

type Props = { state: "loading" | "error"; onRetry: () => void };

const panels = [
    {
        title: "주 사용 언어",
        semititle: "공개 소유 저장소의 코드 구성 비율 top 5",
        height: "min-h-60",
    },
    { title: "주 관심사", semititle: "공개 소유 저장소 토픽 빈도 top 3", height: "min-h-60" },
    {
        title: "시간대 별 활동",
        semititle: "0시부터 23시까지 공개 기여 이벤트 분포",
        height: "min-h-72",
    },
    { title: "요일 별 활동", semititle: "요일별 공개 기여 이벤트 분포", height: "min-h-72" },
    {
        title: "어떤 작업을 많이 할까요?",
        semititle: "PR의 주요 목적을 기준으로 살펴봐요.",
        height: "min-h-24",
    },
    {
        title: "함께 만드는 방식",
        semititle: "공개 이벤트에서 확인한 협업 활동",
        height: "min-h-44",
    },
];

export default function UserDashboardDevelopStyleQueryState({ state, onRetry }: Props) {
    return (
        <section
            className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2"
            aria-label="개발 성향 조회 상태"
            aria-busy={state === "loading"}>
            {panels.map((panel, index) => (
                <div
                    key={panel.title}
                    className={index >= 4 ? "min-w-0 lg:col-span-2" : "min-w-0"}>
                    <PanelLayout
                        title={panel.title}
                        semititle={panel.semititle}>
                        <div className={`flex items-center justify-center ${panel.height}`}>
                            {index === 4 ? (
                                <UpcomingBackdrop />
                            ) : state === "loading" ? (
                                <LoadingSpinner
                                    showLabel
                                    label={`${panel.title} 불러오는 중`}
                                />
                            ) : (
                                <PanelError
                                    title={`${panel.title} 조회 실패`}
                                    message="개발 성향 정보를 불러오지 못했습니다. 다시 시도하면 모든 패널을 함께 조회합니다."
                                    onRetry={onRetry}
                                />
                            )}
                        </div>
                    </PanelLayout>
                </div>
            ))}
        </section>
    );
}
