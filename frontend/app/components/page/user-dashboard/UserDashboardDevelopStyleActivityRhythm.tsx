import PanelLayout from "~/components/common/DashboardPanelLayout";
import UserDashboardDevelopStyleHourlyChart from "./UserDashboardDevelopStyleHourlyChart";
import UserDashboardDevelopStyleWeeklyChart from "./UserDashboardDevelopStyleWeeklyChart";

export default function UserDashboardDevelopStyleActivityRhythm() {
    return (
        <>
            <PanelLayout
                title="시간대 별 활동"
                semititle="0시부터 23시까지의 활동 분포"
                footer="실제 GitHub 분석 결과가 아닌 예시 데이터입니다.">
                <UserDashboardDevelopStyleHourlyChart />
            </PanelLayout>
            <PanelLayout
                title="요일 별 활동"
                semititle="평일과 주말, 요일별 활동 분포"
                footer="실제 GitHub 분석 결과가 아닌 예시 데이터입니다.">
                <UserDashboardDevelopStyleWeeklyChart />
            </PanelLayout>
        </>
    );
}
