import DashboardDevelopStyleFullPanelLayout from "./DashboardDevelopStyleFullPanelLayout";

export default function DashboardDevelopStyleActivityRhythm() {
    return (
        <DashboardDevelopStyleFullPanelLayout>
            <h3 className="mb-3 text-xl font-semibold">활동 리듬</h3>
            <div className="grid h-48 grid-cols-3 divide-x divide-gray-300 not-lg:grid-cols-1 not-lg:divide-x-0 not-lg:divide-y">
                <div className="px-4">
                    <h4 className="text-lg">시간대 별 활동</h4>
                    <span className="text-sm text-gray-500">
                        오전·오후·저녁·밤 중 활동이 많은 시간
                    </span>
                </div>

                <div className="px-4">
                    <h4 className="text-lg">요일 별 활동</h4>
                    <span className="text-sm text-gray-500">
                        평일과 주말, 요일별 활동 분포
                    </span>
                </div>

                <div className="px-4">
                    <h4 className="text-lg">기간 별 성향 변화</h4>
                    <span className="text-sm text-gray-500">
                        이전 기간과 비교해 활동 시간이나 방식이 어떻게 변했는지
                    </span>
                </div>
            </div>
        </DashboardDevelopStyleFullPanelLayout>
    );
}
